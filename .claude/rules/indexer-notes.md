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

## Tunable Settings (as of 2026-04-14)

Measured on the live indexer. Values chosen empirically, not speculative.

| Setting | File | Value | Effect if raised |
|---|---|---|---|
| `BATCH_SIZE` | indexer.js | 100 | Fewer meta-table writes per batch |
| `BACKFILL_CONCURRENCY` | indexer.js | 20 | More parallel RPC requests per batch |
| `POLL_INTERVAL` | indexer.js | 2000 ms | Forward-watcher polling cadence (leave alone) |
| `--max-old-space-size` | ecosystem.config.js | 2048 MB | Node heap ceiling |

Observed fill rate at these values: **5–8 blocks/sec** on the QF mainnet WS RPC.
Previous values (BATCH_SIZE 25, BACKFILL_CONCURRENCY 5, heap 768): ~0.5 b/s.

If the RPC starts throwing errors after any further increase: **dial `BACKFILL_CONCURRENCY` back first, leave the other two alone**. One variable at a time so you know what broke.

Changing `node_args` (heap) in ecosystem.config.js requires `pm2 delete qf-indexer && pm2 start ecosystem.config.js --only qf-indexer` — a plain `pm2 restart` does NOT re-read node_args.

### POLL_INTERVAL is not a backfill lever

Two independent loops:
- **Forward watcher** (governed by `POLL_INTERVAL`) — checks chain tip every N ms
- **Backward scanner** (governed by `BACKFILL_CONCURRENCY`) — runs continuously in parallel, 20 RPC requests at a time

Slowing the forward watcher does **not** "give" backfill more capacity directly. The only indirect effect: the two loops share one RPC connection, and the watcher briefly blocks the scanner (`headBusy` flag) while processing tip blocks. Raising `POLL_INTERVAL` frees up contiguous time for the scanner — maybe 10–20% uplift at most.

Empty blocks don't help either: every block still costs the same RPC round-trip to check, whether it has activity or not. The bottleneck is RPC latency per block, not DB inserts.

### Next tuning step (if needed)

If 5–8 b/s isn't fast enough and the RPC isn't throwing errors, try **in order**, one at a time:
1. `BACKFILL_CONCURRENCY`: 20 → 30 (more parallel RPC calls)
2. `POLL_INTERVAL`: 2000 → 5000 ms (modest indirect boost, and 5s is still essentially live on the UI)

Stack both for a realistic 30–40% extra throughput. Watch logs for `Poll error` or `rate limit` — if either appears, revert the most recent change and stop.

## RPC Session Sickness — "State already discarded"

### Symptom
`qf-indexer` logs fill with repeating:

    [HEAD] Poll error: 4003: Client error: Api called for an unknown Block:
    State already discarded for 0x<blockhash>...

The forward watcher stops advancing. `head_block` stays frozen. The process stays `online` in PM2 but is effectively dead.

### Cause
`@polkadot/api`'s `ApiPromise` caches runtime metadata per block hash. When the node prunes state for a block the API had cached (usually around a runtime upgrade or long uptime across pruning boundaries), subsequent internal calls like `getRuntimeVersion(at=<old hash>)` fail permanently within that session. The process never recovers in-session.

### Fix — crash early, let PM2 restart
In-session `ApiPromise` reconstruction would be complex and bug-prone. Simpler: detect the class of errors and `process.exit(1)`. PM2 restarts automatically. Boot-time logic at indexer.js:378 already does the right thing — it jumps `head_block` to current chain tip and backfills the gap concurrently with the forward watcher.

Applied 2026-04-14 inside the `[HEAD]` poll `catch` block:

    if (/State already discarded|unknown Block|Api called for an unknown/i.test(err.message)) {
      console.error("[HEAD] RPC session unrecoverable — exiting for PM2 restart");
      process.exit(1);
    }

Four lines, zero state to preserve. PM2 handles the supervision.

### What NOT to do
- Don't try to patch `ApiPromise` metadata cache internals
- Don't add retry-with-backoff — the error is permanent within the session, retries just delay the inevitable
- Don't manually `UPDATE meta SET value = <tip> WHERE key = 'head_block'` — it works once but leaves the same crash waiting for the next pruning cycle

## Two Cursors — Forward Watcher vs Backward Scanner

Two independent loops updating two meta keys:

- **`head_block`** — forward watcher. Advances every `POLL_INTERVAL` to the latest chain tip, processing any new blocks. This drives the "live activity" feed.
- **`back_block`** — backward scanner. Walks downward toward genesis, filling historical data. On boot if a gap exists (oldHead → currentHead), the scanner fills that first (PRIORITY 1 GAP), then resumes normal historical backfill (PRIORITY 2 HISTORY).

When you see `head_block > back_block` with a large difference, that's normal during gap-fill — both cursors are moving, just in opposite directions.

## Recovery from Extended Outage

Example: indexer down for several days. Chain advances X blocks. To fully recover:

1. Fix the root cause (RPC issue, bad deploy, etc).
2. `pm2 restart qf-indexer` — boot logic jumps head to chain tip, records X-block gap, starts backfill concurrently with forward watcher.
3. Explorer is **immediately live** for new blocks because forward watcher starts from tip.
4. Historical data trickles in behind it at current fill rate (5–8 b/s today → 1 day per ~500K blocks).
5. Never run a third recovery path. The two cursors handle everything — adding a targeted gap-fill creates a third moving part to maintain.

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
