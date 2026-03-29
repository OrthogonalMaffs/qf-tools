# QF Explorer Indexer Notes

## Location
- Server: 37.27.219.31 (Hetzner, ubuntu user, SSH key ~/.ssh/hetzner-vm)
- Code: ~/qf-explorer/ on the server
- DB: ~/qf-explorer/qf-explorer.db (SQLite)
- PM2 processes: qf-indexer (indexer), qf-explorer-api (API on port 3848)

## Architecture
- Substrate WS RPC (wss://mainnet.qfnode.net) — NOT ETH RPC
- Forward watcher: polls every 2 seconds for new blocks
- Backward scanner: fills history towards genesis
- Priority: HEAD > GAP > HISTORY (on restart, jumps to head, fills gap first)
- 4GB heap limit (--max-old-space-size=4096)

## QNS Decoder
- Decodes NameRegistered, NameRenewed, NameTransferred events from revive.ContractEmitted
- Contract addresses (NEW as of 2026-03-28):
  - Registry: 0x32d2023807a5374f228fd7d7c91d9e431709a455
  - Registrar: 0x79d1b7425c8ad9cda83e3bb1c4e6730ff77b7854
  - Resolver: 0xd5d12431b2956248861dbec5e8a9bc6023114e80
- Old addresses (defunct): Registry 0x595888..., Registrar 0xe65856..., Resolver 0xd78e5b...
- Uses labelHash (keccak of just the name), NOT ENS-style namehash for contract queries
- Backfills from existing indexed ContractEmitted events on startup

## ethTransact Fix
- revive.* extrinsics captured regardless of isSigned flag
- Block filter includes revive section (hasSigned || method.section === 'revive')
- Known limitation: ethTransact may not appear in block.extrinsics via Polkadot.js API
- Axe confirmed ContractEmitted events DO fire for ethTransact at Substrate level
- Pending: runtime upgrade to stable2512 would fix ETH RPC completely

## Database Tables
- extrinsics: block_num, ext_index, hash, signer, section, method, args, success, timestamp
- events: block_num, event_index, section, method, data, timestamp
- transfers: block_num, from_addr, to_addr, amount_wei, timestamp, ext_hash
- accounts: address, h160, free, reserved, nonce, last_seen
- qns_names: name, owner_h160, expires, fee_wei, block_num, timestamp, permanent
- meta: key, value (tracks head_block, back_block)

## API Endpoints
- GET /api/stats — totalExtrinsics, totalTransfers, fundedAccounts, lastIndexedBlock
- GET /api/health — status check
- GET /api/accounts?limit=200 — all funded accounts with .qf names
- GET /api/txs?limit=100 — recent transfers + extrinsics
- GET /api/account/:addressOrName — account detail (resolves .qf names via DB then contract)
- GET /api/txs/:addressOrName?limit=100 — transfers for an address

## Name Resolution Priority
1. Check qns_names table (fastest, no RPC)
2. Forward resolve via contract call (RPC to resolver)
3. Reverse resolve cache (warmed on startup, 10-min TTL)
