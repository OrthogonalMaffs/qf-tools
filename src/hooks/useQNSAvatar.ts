import { useState, useEffect } from 'react';
import { keccak256 } from 'js-sha3';
import { QNS_RESOLVER_ADDRESS, QF_ETH_RPC } from '../config/qns';

// ─── Cache ───────────────────────────────────────────────────────────────────
// name → avatarUrl (empty string means "checked, no avatar")
const avatarCache = new Map<string, string>();
const inflightRequests = new Map<string, Promise<string>>();

// ─── Namehash ────────────────────────────────────────────────────────────────
function hexToBytes(hex: string): Uint8Array {
  const clean = hex.startsWith('0x') ? hex.slice(2) : hex;
  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(clean.substr(i * 2, 2), 16);
  }
  return bytes;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

function keccak256Bytes(input: Uint8Array): string {
  return keccak256(input);
}

function namehash(name: string): string {
  const fullName = name.endsWith('.qf') ? name : `${name}.qf`;
  const labels = fullName.split('.').reverse();
  
  let node = '0'.repeat(64); // 32 bytes of zeros as hex
  
  for (const label of labels) {
    const labelBytes = new TextEncoder().encode(label);
    const labelHashHex = keccak256Bytes(labelBytes);
    const combined = hexToBytes(node + labelHashHex);
    node = keccak256Bytes(combined);
  }
  
  return '0x' + node;
}

// ─── ABI encoding for resolver.text(bytes32, string) ─────────────────────────
function encodeTextCall(node: string, key: string): string {
  // Function selector: keccak256("text(bytes32,string)") first 4 bytes
  const sig = keccak256Bytes(new TextEncoder().encode('text(bytes32,string)'));
  const selector = sig.slice(0, 8);
  
  // Encode: node (bytes32) + offset to string data + string data
  const nodeHex = node.startsWith('0x') ? node.slice(2) : node;
  
  // offset to string data = 64 bytes (0x40)
  const offset = '0000000000000000000000000000000000000000000000000000000000000040';
  
  // string encoding: length (32 bytes) + data (padded to 32-byte boundary)
  const keyBytes = new TextEncoder().encode(key);
  const keyLenHex = keyBytes.length.toString(16).padStart(64, '0');
  const keyDataHex = bytesToHex(keyBytes).padEnd(Math.ceil(keyBytes.length / 32) * 64, '0');
  
  return '0x' + selector + nodeHex + offset + keyLenHex + keyDataHex;
}

function decodeStringResult(hex: string): string {
  if (!hex || hex === '0x' || hex.length < 130) return '';
  const clean = hex.startsWith('0x') ? hex.slice(2) : hex;
  
  // ABI-encoded string: offset (32 bytes) + length (32 bytes) + data
  // First 32 bytes = offset to string data
  const offsetBytes = parseInt(clean.slice(0, 64), 16);
  const dataStart = offsetBytes * 2; // in hex chars
  
  if (dataStart + 64 > clean.length) return '';
  
  // Next 32 bytes at offset = string length
  const strLen = parseInt(clean.slice(dataStart, dataStart + 64), 16);
  if (strLen === 0) return '';
  
  // Then the actual string bytes
  const strHex = clean.slice(dataStart + 64, dataStart + 64 + strLen * 2);
  
  // Decode hex to UTF-8
  const bytes = hexToBytes(strHex);
  return new TextDecoder().decode(bytes);
}

// ─── RPC call ────────────────────────────────────────────────────────────────
async function fetchAvatarUrl(name: string): Promise<string> {
  try {
    const node = namehash(name);
    const callData = encodeTextCall(node, 'avatar');
    
    const response = await fetch(QF_ETH_RPC, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_call',
        params: [
          {
            to: QNS_RESOLVER_ADDRESS,
            data: callData,
          },
          'latest',
        ],
      }),
    });
    
    const json = await response.json();
    
    if (json.error || !json.result || json.result === '0x') {
      return '';
    }
    
    const avatarUrl = decodeStringResult(json.result);
    
    // Basic validation: must look like a URL
    if (avatarUrl && (avatarUrl.startsWith('http://') || avatarUrl.startsWith('https://'))) {
      return avatarUrl;
    }
    
    return '';
  } catch {
    return '';
  }
}

// ─── Hook ────────────────────────────────────────────────────────────────────
/**
 * Fetches the QNS avatar URL for a .qf name.
 * Returns the avatar URL string, or empty string if none/not yet loaded.
 * Results are cached in memory so repeated renders don't re-fetch.
 * 
 * @param name - A .qf name like "axe.qf" or "axe" (will append .qf). Pass null/undefined to skip.
 */
export function useQNSAvatar(name: string | null | undefined): string {
  const [avatarUrl, setAvatarUrl] = useState<string>(() => {
    if (!name) return '';
    const cached = avatarCache.get(name);
    return cached ?? '';
  });

  useEffect(() => {
    if (!name) {
      setAvatarUrl('');
      return;
    }

    // Check cache first
    const cached = avatarCache.get(name);
    if (cached !== undefined) {
      setAvatarUrl(cached);
      return;
    }

    // Check if already in flight
    let request = inflightRequests.get(name);
    if (!request) {
      request = fetchAvatarUrl(name);
      inflightRequests.set(name, request);
    }

    let cancelled = false;

    request.then((url) => {
      avatarCache.set(name, url);
      inflightRequests.delete(name);
      if (!cancelled) {
        setAvatarUrl(url);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [name]);

  return avatarUrl;
}
