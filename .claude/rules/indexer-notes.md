# QF Explorer Indexer Notes

## Location
- Server: 37.27.219.31 (Hetzner, ubuntu user, SSH key ~/.ssh/hetzner-vm)
- Code: ~/qf-explorer/ on the server
- DB: ~/qf-explorer/qf-explorer.db (SQLite)
- PM2 processes: qf-indexer (indexer), qf-explorer-api (API on port 3848)

## Architecture
- Substrate WS RPC (wss://mainnet.qfnode.net) — NOT ETH RPC
- Forward watcher: polls every 2 seconds for new blocks
- Backward scanner: fills history towards genesis (batch size 25, concurrency 10)
- Priority: HEAD > GAP > HISTORY (on restart, jumps to head, fills gap first)
- 4GB heap limit (--max-old-space-size=4096)
- Account snapshots: runs on boot + every 5 minutes (if indexer stays alive)
- Shared ETH RPC helper: rpc.js (used by indexer, names, server)

## Account Snapshot — Two Phases
- Phase 1: `system.account.entries()` — all Substrate-native accounts. Uses `OriginalAccount` cache to set correct H160 when mapping exists, falls back to keccak(pubkey).
- Phase 2: QNS H160s not in Phase 1 — queries `eth_getBalance` via ETH RPC. Balance-matches against existing Substrate accounts to avoid duplicates. Inserts truly new EVM-only accounts with H160 as address key.
- KNOWN ISSUE: Unmapped accounts (no `map_account` call) may still duplicate. Needs Axe input.

## Key Files (on Hetzner ~/qf-explorer/)
- indexer.js — block processor + account snapshot
- server.js — Express API
- names.js — QNS name resolution (reverse resolve, forward resolve, cache)
- rpc.js — shared ETH RPC helper (added 2026-03-29)
- qns-decoder.js — QNS event decoder
- db.js — SQLite schema + setup

## QNS Decoder
- Decodes NameRegistered, NameRenewed, NameTransferred events from revive.ContractEmitted
- Contract addresses (NEW as of 2026-03-28):
  - Registry: 0xa2cfccb0b6d94b55d69ff90bcc2d1822150a16b5
  - Registrar: 0x493a63a9b107b812ab3098cadaaa4abe86ad5bc5
  - Resolver: 0x276b7e9343c19bea29d32dd4a8f84e6d1c183111
- Old addresses (defunct): Gen1: Registry 0x595888..., Registrar 0xe65856..., Resolver 0xd78e5b... / Gen2: Registry 0x32d202..., Registrar 0x79d1b7..., Resolver 0xd5d124...
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
- GET /api/accounts?limit=200 — all funded accounts with .qf names, sorted by balance desc
- GET /api/txs?limit=100 — recent transfers + extrinsics
- GET /api/account/:addressOrName — account detail (resolves .qf names via DB then contract)
- GET /api/txs/:addressOrName?limit=100 — transfers for an address
- GET /api/burns/summary — total burned, count, breakdown by source
- GET /api/burns/history — time-bucketed burn data (day/week)
- GET /api/gas — current gas price from ETH RPC
- GET /api/events — recent non-system events
- GET /api/resolve/:input — name↔address resolution

## API Formatting
- All balance fields (freeQF, reservedQF, totalQF, amountQF): 2 decimal places
- Burn totals: 6 decimal places (small amounts would round to zero at 2dp)
- Sorting uses CAST(free AS REAL) — not INTEGER (overflows on wei values)

## Name Resolution Priority
1. Check qns_names table (fastest, no RPC)
2. Forward resolve via contract call (RPC to resolver)
3. Reverse resolve cache (warmed on startup, 10-min TTL)
4. H160 addresses handled directly in resolveOne (no keccak derivation attempted)
