// QNS Resolver contract config for read-only avatar lookups
// The resolver stores text records (avatar, bio, twitter, etc.) keyed by namehash

export const QNS_RESOLVER_ADDRESS = (import.meta.env.VITE_QNS_RESOLVER_ADDRESS || '0x276b7e9343c19bea29d32dd4a8f84e6d1c183111') as `0x${string}`;

export const QF_ETH_RPC = 'https://archive.mainnet.qfnode.net/eth';

// Minimal ABI — only the text() read function we need
export const QNS_RESOLVER_ABI = [
  {
    type: 'function',
    name: 'text',
    inputs: [
      { name: 'node', type: 'bytes32' },
      { name: 'key', type: 'string' },
    ],
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
  },
] as const;
