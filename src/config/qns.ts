// QNS Resolver contract config for read-only avatar lookups
// The resolver stores text records (avatar, bio, twitter, etc.) keyed by namehash

export const QNS_RESOLVER_ADDRESS = (import.meta.env.VITE_QNS_RESOLVER_ADDRESS || '0xd78e5b5779ed7bdf70dad0061fbeb189836022fb') as `0x${string}`;

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
