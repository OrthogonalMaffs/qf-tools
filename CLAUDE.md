# QFTools

> The human-readable layer of QF Network.

QFTools is the blockchain explorer and utility suite for QF Network. It is NOT an Etherscan clone -- it is a names-first, people-first, burn-aware explorer that feels like a premium fintech product. It sits alongside QNS, QFPay, and QFLink as the neutral observation layer of the ecosystem.

Live at: **https://qftools.xyz**
Repo: OrthogonalMaffs/qf-tools

---

## Tech Stack

| Layer      | Technology                                   |
|------------|----------------------------------------------|
| Framework  | React 19 + TypeScript                        |
| Build      | Vite + @vitejs/plugin-react                  |
| Styling    | Tailwind CSS v3 + PostCSS + Autoprefixer     |
| Animation  | Framer Motion                                |
| State      | Zustand                                      |
| Routing    | React Router v7 (react-router-dom)           |
| Icons      | lucide-react only                            |
| Fonts      | Fontshare (Clash Display, Satoshi) + Google (JetBrains Mono) |

**Do NOT use:** component libraries (shadcn, MUI, Chakra, Radix), chart libraries, CSS-in-JS, @tailwindcss/vite.

---

## Pages & Routes

| Route                  | Page         | Status      |
|------------------------|--------------|-------------|
| `/` `/explorer`        | Explorer     | Live        |
| `/explorer/accounts`   | Accounts     | Live        |
| `/explorer/:id`        | AccountView  | Live        |
| `/burn`                | Burn         | Live        |
| `/tokens`              | Tokens       | Placeholder |
| `/gas`                 | Gas          | Placeholder |

`/explorer/accounts` must be matched BEFORE `/explorer/:id` in route config.

---

## API

**Base URL:** `https://qf-explorer.mathswins.co.uk/api`

| Endpoint                    | Returns                          | Poll    |
|-----------------------------|----------------------------------|---------|
| `GET /api/stats`            | block height, accounts, transfers| 30s     |
| `GET /api/health`           | status + timestamp               | --      |
| `GET /api/accounts?limit=N` | accounts sorted by balance desc  | 60s     |
| `GET /api/txs?limit=N`      | recent transfers + extrinsics    | 60s     |
| `GET /api/account/:address`  | single account (SS58 or .qf name)| --     |
| `GET /api/txs/:address?limit=N` | transfers for one address    | --      |
| `GET /api/gas`               | gas data (currently empty)      | once    |
| `GET /api/tokens`            | token list (currently empty)    | once    |

---

## Key Addresses

| Label         | Address                                              |
|---------------|------------------------------------------------------|
| Burn Address  | `5C4hrfjw9DjXZTzV3MwzrrAr9PUr9y8SHgV3cmVGNUWRiJL5` |
| QFPay Router  | `5Ew9dLGRMLr3J5icw9vSG64w62hdxcvrDAvjKqx9T1KG1uKc` |

### QNS Contracts (H160)

| Contract   | Address                                      |
|------------|----------------------------------------------|
| Registry   | `0xa2cfccb0b6d94b55d69ff90bcc2d1822150a16b5` |
| Registrar  | `0x493a63a9b107b812ab3098cadaaa4abe86ad5bc5` |
| Resolver   | `0x276b7e9343c19bea29d32dd4a8f84e6d1c183111` |

---

## Backend

- Indexer runs on Hetzner (37.27.219.31) in `~/qf-explorer/`
- SQLite database, Substrate WS RPC as data source
- Exposed via Cloudflare Tunnel at `qf-explorer.mathswins.co.uk`
- ETH RPC returns zero transactions -- must use Substrate WS RPC
- See `.claude/rules/indexer-notes.md` for indexer internals

---

## QFPay Burn Detection

QFPay transfers appear as triplets in the same block:
1. User -> QFPay Router (full amount)
2. QFPay Router -> Recipient (99.9%)
3. QFPay Router -> Burn Address (0.1%)

`enrichTransfers()` in `src/utils/enrichTransfers.ts` groups these into a single display row. Transfers #1 and #3 are hidden; only the enriched delivery row is shown.

---

## Design System (Essentials)

- **Dark only.** Background `#0A0A0A`, cards `#111111`. No light mode.
- **Max content width:** 720px, centered.
- **Typography:** Clash Display (headlines/numbers), Satoshi (body/UI), JetBrains Mono (addresses/hashes).
- **Colour coding:** QNS green `#00D179` (only .qf suffixes + sync dot), QFPay blue `#0052FF` (only QFPay labels), burn orange `#E85D25` (only flame/burn data).
- **No shadows, no heavy borders.** Border max: `rgba(255,255,255,0.1)`.
- **Animations:** Framer Motion on every transition. No CSS animations except sync dot pulse.
- **Loading:** Skeleton shimmer. Never spinners.
- **Empty states:** Designed with icon + title + description. Empty means "not yet," not "broken."
- **Mobile-first.** No hamburger menu. Nav stays horizontal.

---

## Build & Dev

```bash
npm install
npm run dev          # Vite dev server
npm run build        # Production build
npm run preview      # Preview production build
```

---

## Deployment

GitHub Pages at qftools.xyz. Production build output goes to `dist/`.

---

## Full Specs

- Product spec (design, colours, UX patterns): `.claude/rules/product-spec.md`
- Build spec (architecture, types, hooks, config): `master.md`
- Builder prompt (component details): `qftools-builder.md`
- Indexer notes: `.claude/rules/indexer-notes.md`


## Task Contract

All tasks arriving from Jon (relayed from Claude chat) will be structured as follows.
Do not begin work unless all six fields are present:

TASK: [one sentence description]
ROOT CAUSE: [what is actually wrong]
EXACT CHANGE: [file, function, what changes to what]
DO NOT TOUCH: [explicit exclusions]
SUCCESS CONDITION: [how to know the task is complete]
STOP IF: [conditions that require you to halt and report back to Jon]

### Behaviour rules

- Before touching any file, state your understanding of the ROOT CAUSE in one sentence.
- If you hit something unexpected, do not improvise. Invoke STOP IF and report back.
- Do not refactor, rename, reformat, or tidy anything outside EXACT CHANGE.
- One pass. If it isn't right, stop and report — do not attempt iterative self-correction.
- If a task arrives without this structure, ask Jon for the missing fields before proceeding.
