import { useState, useCallback, useRef } from 'react';
import { keccak256 } from 'js-sha3';
import { QF_ETH_RPC } from '../config/qns';

// ─── Types ──────────────────────────────────────────────────────────────────
export interface Approval {
  tokenAddress: string;
  tokenName: string;
  tokenSymbol: string;
  spender: string;
  allowance: string; // raw hex
  allowanceDisplay: string; // "Unlimited" or formatted number
  isUnlimited: boolean;
  revoking: boolean;
}

interface RpcResult {
  jsonrpc: string;
  id: number;
  result?: unknown;
  error?: { code: number; message: string };
}

// ─── Constants ──────────────────────────────────────────────────────────────
// keccak256("Approval(address,address,uint256)")
const APPROVAL_TOPIC = '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925';

// ERC-20 function selectors
const ALLOWANCE_SELECTOR = keccak256('allowance(address,address)').slice(0, 8);
const NAME_SELECTOR = keccak256('name()').slice(0, 8);
const SYMBOL_SELECTOR = keccak256('symbol()').slice(0, 8);
const DECIMALS_SELECTOR = keccak256('decimals()').slice(0, 8);
const APPROVE_SELECTOR = keccak256('approve(address,uint256)').slice(0, 8);

// ─── ABI helpers ────────────────────────────────────────────────────────────
function padAddress(addr: string): string {
  const clean = addr.startsWith('0x') ? addr.slice(2) : addr;
  return clean.toLowerCase().padStart(64, '0');
}

function encodeAllowanceCall(owner: string, spender: string): string {
  return '0x' + ALLOWANCE_SELECTOR + padAddress(owner) + padAddress(spender);
}

function encodeApproveCall(spender: string, amount: string): string {
  const amountHex = amount.replace('0x', '').padStart(64, '0');
  return '0x' + APPROVE_SELECTOR + padAddress(spender) + amountHex;
}

function decodeStringResult(hex: string): string {
  if (!hex || hex === '0x' || hex.length < 130) return '';
  const clean = hex.startsWith('0x') ? hex.slice(2) : hex;
  const offsetBytes = parseInt(clean.slice(0, 64), 16);
  const dataStart = offsetBytes * 2;
  if (dataStart + 64 > clean.length) return '';
  const strLen = parseInt(clean.slice(dataStart, dataStart + 64), 16);
  if (strLen === 0 || strLen > 256) return '';
  const strHex = clean.slice(dataStart + 64, dataStart + 64 + strLen * 2);
  const matched = strHex.match(/.{2}/g);
  if (!matched) return '';
  const bytes = new Uint8Array(matched.map(b => parseInt(b, 16)));
  return new TextDecoder().decode(bytes);
}

function decodeUint256(hex: string): string {
  if (!hex || hex === '0x') return '0';
  const clean = hex.startsWith('0x') ? hex.slice(2) : hex;
  // Always return 64 chars, zero-padded
  return clean.padStart(64, '0').slice(-64);
}

function formatAllowance(rawHex: string, decimals: number): { display: string; isUnlimited: boolean } {
  const clean = rawHex.replace(/^0+/, '') || '0';
  // MaxUint256 is 64 f's — treat anything with 63+ hex digits as Unlimited
  if (clean.length >= 63) {
    return { display: 'Unlimited', isUnlimited: true };
  }
  const value = BigInt('0x' + (clean || '0'));
  if (value === 0n) {
    return { display: '0', isUnlimited: false };
  }
  const divisor = 10n ** BigInt(decimals);
  const whole = value / divisor;
  const remainder = value % divisor;

  // Catch dust amounts that would round to "0" at 4dp
  if (whole === 0n) {
    const remainderStr = remainder.toString().padStart(decimals, '0').slice(0, 4);
    if (/^0+$/.test(remainderStr)) {
      return { display: '< 0.0001', isUnlimited: false };
    }
    const trimmed = remainderStr.replace(/0+$/, '');
    return { display: `0.${trimmed}`, isUnlimited: false };
  }

  const remainderStr = remainder.toString().padStart(decimals, '0').slice(0, 4).replace(/0+$/, '');
  const wholeFormatted = whole.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  if (remainderStr) {
    return { display: `${wholeFormatted}.${remainderStr}`, isUnlimited: false };
  }
  return { display: wholeFormatted, isUnlimited: false };
}

// ─── RPC helpers ────────────────────────────────────────────────────────────
async function rpcCall(method: string, params: unknown[]): Promise<RpcResult> {
  const res = await fetch(QF_ETH_RPC, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  });
  return res.json();
}

async function ethCall(to: string, data: string): Promise<string> {
  const result = await rpcCall('eth_call', [{ to, data }, 'latest']);
  return (result.result as string) || '0x';
}

async function waitForReceipt(txHash: string, maxAttempts = 30): Promise<boolean> {
  for (let i = 0; i < maxAttempts; i++) {
    const result = await rpcCall('eth_getTransactionReceipt', [txHash]);
    if (result.result) {
      const receipt = result.result as { status: string };
      return receipt.status === '0x1';
    }
    await new Promise(r => setTimeout(r, 2000));
  }
  return false;
}

// ─── Hook ───────────────────────────────────────────────────────────────────
export function useRevoke() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const connectingRef = useRef(false);

  const connect = useCallback(async () => {
    // Guard against rapid double-clicks
    if (connectingRef.current) return;
    connectingRef.current = true;

    const ethereum = (window as unknown as { ethereum?: { request: (args: { method: string; params?: unknown[] }) => Promise<unknown> } }).ethereum;
    if (!ethereum) {
      setError('No wallet detected. Install MetaMask or another EVM wallet.');
      connectingRef.current = false;
      return;
    }

    setLoading(true);
    setError(null);
    setApprovals([]);

    try {
      // Request accounts
      const accounts = (await ethereum.request({ method: 'eth_requestAccounts' })) as string[];
      if (!accounts || accounts.length === 0) {
        setError('No account selected.');
        setLoading(false);
        connectingRef.current = false;
        return;
      }

      const owner = accounts[0].toLowerCase();
      setWalletAddress(owner);

      // Fetch all Approval events where owner is topic1
      const ownerTopic = '0x' + padAddress(owner);
      const logsResult = await rpcCall('eth_getLogs', [{
        fromBlock: 'earliest',
        toBlock: 'latest',
        topics: [APPROVAL_TOPIC, ownerTopic],
      }]);

      if (logsResult.error) {
        setError(`RPC error fetching approvals: ${logsResult.error.message}`);
        setLoading(false);
        connectingRef.current = false;
        return;
      }

      const logs = logsResult.result as Array<{
        address: string;
        topics: string[];
        data: string;
      }>;

      if (!logs || !Array.isArray(logs)) {
        setApprovals([]);
        setLoading(false);
        connectingRef.current = false;
        return;
      }

      // Deduplicate: keep latest approval per (token, spender) pair
      const latestMap = new Map<string, { tokenAddress: string; spender: string }>();
      for (const log of logs) {
        if (log.topics.length < 3) continue;
        const tokenAddress = log.address.toLowerCase();
        const spender = '0x' + log.topics[2].slice(26).toLowerCase();
        const key = `${tokenAddress}:${spender}`;
        latestMap.set(key, { tokenAddress, spender });
      }

      // Check live allowances and fetch token metadata
      const entries = Array.from(latestMap.values());
      const results: Approval[] = [];

      // Process in batches of 10 to avoid overwhelming the RPC
      const batchSize = 10;
      for (let i = 0; i < entries.length; i += batchSize) {
        const batch = entries.slice(i, i + batchSize);
        const batchResults = await Promise.all(
          batch.map(async ({ tokenAddress, spender }) => {
            try {
              // Check current allowance
              const allowanceHex = await ethCall(tokenAddress, encodeAllowanceCall(owner, spender));
              const rawAllowance = decodeUint256(allowanceHex);

              // Skip zero allowances
              if (/^0+$/.test(rawAllowance) || rawAllowance === '0') return null;

              // Fetch token metadata
              const [nameHex, symbolHex, decimalsHex] = await Promise.all([
                ethCall(tokenAddress, '0x' + NAME_SELECTOR),
                ethCall(tokenAddress, '0x' + SYMBOL_SELECTOR),
                ethCall(tokenAddress, '0x' + DECIMALS_SELECTOR),
              ]);

              const name = decodeStringResult(nameHex) || 'Unknown Token';
              const symbol = decodeStringResult(symbolHex) || '???';
              const decimalsRaw = decodeUint256(decimalsHex);
              const decimals = decimalsRaw ? parseInt(decimalsRaw, 16) : 18;

              const { display, isUnlimited } = formatAllowance(rawAllowance, decimals);

              return {
                tokenAddress,
                tokenName: name,
                tokenSymbol: symbol,
                spender,
                allowance: rawAllowance,
                allowanceDisplay: display,
                isUnlimited,
                revoking: false,
              } as Approval;
            } catch {
              return null;
            }
          })
        );
        results.push(...batchResults.filter((r): r is Approval => r !== null));
      }

      setApprovals(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet.');
    } finally {
      setLoading(false);
      connectingRef.current = false;
    }
  }, []);

  const revoke = useCallback(async (tokenAddress: string, spender: string) => {
    const ethereum = (window as unknown as { ethereum?: { request: (args: { method: string; params?: unknown[] }) => Promise<unknown> } }).ethereum;
    if (!ethereum || !walletAddress) {
      setError('Wallet not connected.');
      return;
    }

    // Mark row as revoking
    setApprovals(prev => prev.map(a =>
      a.tokenAddress === tokenAddress && a.spender === spender
        ? { ...a, revoking: true }
        : a
    ));
    setError(null);

    try {
      const data = encodeApproveCall(spender, '0'.repeat(64));

      const txHash = await ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: walletAddress,
          to: tokenAddress,
          data,
        }],
      }) as string;

      // Wait for on-chain confirmation
      const confirmed = await waitForReceipt(txHash);

      if (confirmed) {
        // Remove from list only after confirmed success
        setApprovals(prev => prev.filter(
          a => !(a.tokenAddress === tokenAddress && a.spender === spender)
        ));
      } else {
        // Transaction failed or timed out — unmark revoking, show error
        setApprovals(prev => prev.map(a =>
          a.tokenAddress === tokenAddress && a.spender === spender
            ? { ...a, revoking: false }
            : a
        ));
        setError('Transaction failed on-chain. The approval was not revoked.');
      }
    } catch (err) {
      // Unmark revoking on any error
      setApprovals(prev => prev.map(a =>
        a.tokenAddress === tokenAddress && a.spender === spender
          ? { ...a, revoking: false }
          : a
      ));
      const message = err instanceof Error ? err.message : 'Transaction failed.';
      // User rejections from wallets use various wording
      const isUserRejection = /reject|denied|cancel|refuse|disapprov/i.test(message);
      if (!isUserRejection) {
        setError(message);
      }
    }
  }, [walletAddress]);

  return { approvals, loading, error, connect, revoke, walletAddress };
}
