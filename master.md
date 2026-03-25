# QFTools — Production Build Specification

> Source of truth for the QFTools frontend. Read this COMPLETELY before writing any code.

---

## 1. What This Is

QFTools is a blockchain explorer and utility suite for QF Network. It is a React + TypeScript
single-page application that connects to a live backend API. It is NOT a clone of Etherscan.
It is a names-first, people-first, burn-aware explorer that feels like a premium fintech product.

The design spec for every color, font, spacing value, animation timing, and UX pattern lives in
`qftools.md` (also in this repo). This file (`master.md`) tells you HOW to build it. `qftools.md`
tells you WHAT it should look and feel like. Both are required reading. If they conflict, `qftools.md`
wins on design; this file wins on architecture.

---

## 2. Architecture & Tech Stack

### Stack (strict — no substitutions)

| Layer       | Technology                                              |
| ----------- | ------------------------------------------------------- |
| Framework   | React 19 + TypeScript                                   |
| Build       | Vite (latest) + `@vitejs/plugin-react`                  |
| Styling     | Tailwind CSS v3 + PostCSS + Autoprefixer                |
| Animation   | Framer Motion (latest)                                  |
| State       | Zustand (latest)                                        |
| Routing     | React Router v7 (`react-router-dom`)                    |
| Icons       | `lucide-react` only                                     |
| Fonts       | Fontshare (Clash Display, Satoshi) + Google (JetBrains Mono) |

### What NOT to use

- No component libraries (no shadcn, MUI, Chakra, Radix)
- No chart libraries (build SVG charts by hand)
- No additional icon libraries
- No CSS-in-JS
- No `@tailwindcss/vite` (we use Tailwind v3 with PostCSS, matching QNS)

### Reference Codebase

The QNS app at `https://github.com/zero-dev1/qns` is the architectural reference. QFTools
mirrors its project structure, config patterns, font loading, and component conventions.

---

## 3. Project Structure

This is a standard Vite app at the repo root. No `/app` subfolder. No legacy files to preserve.

Copy
qf-tools/ ├── master.md # This file — build spec ├── qftools.md # Product spec & design system ├── qftools-builder.md # Detailed builder prompt with mock data & component specs ├── index.html # Vite entry — fonts, OG tags, PWA meta ├── package.json ├── vite.config.ts ├── tailwind.config.js ├── postcss.config.js ├── tsconfig.json ├── tsconfig.app.json ├── tsconfig.node.json ├── public/ │ ├── favicon.svg │ ├── og-image.png │ ├── manifest.json │ ├── robots.txt │ └── icons/ │ ├── icon-192x192.png │ └── icon-512x512.png └── src/ ├── main.tsx # StrictMode + createRoot ├── App.tsx # BrowserRouter + AnimatedRoutes + ScrollToTop ├── index.css # Tailwind directives + font utilities + base resets + scrollbar ├── components/ │ ├── Navbar.tsx # Persistent top nav — wordmark left, links right │ ├── PageTransition.tsx # Framer Motion AnimatePresence route wrapper │ ├── ScrollToTop.tsx # Scroll to top on route change │ ├── SearchBar.tsx # Cycling placeholder, enter-to-navigate │ ├── SearchModal.tsx # Cmd+K spotlight search overlay │ ├── StatsLine.tsx # "Block X · Y accounts · Z transfers · Synced" │ ├── QFName.tsx # "name" in white + ".qf" in #00D179 │ ├── TruncatedAddress.tsx # First6...Last6 in JetBrains Mono │ ├── Identity.tsx # Avatar + name or truncated address composite │ ├── GradientAvatar.tsx # Deterministic gradient circle from address hash │ ├── NumberScroller.tsx # Animated per-digit mechanical counter │ ├── BurnBadge.tsx # Flame icon + burn amount │ ├── TransferRow.tsx # Single transfer: identities + amount + burn badge + metadata │ ├── EmptyState.tsx # Icon + title + description for empty/error states │ └── Skeleton.tsx # Shimmer loading skeleton bars ├── pages/ │ ├── Explorer.tsx # Home: stats + search + live activity feed │ ├── AccountView.tsx # Profile hero + balance + filtered activity │ ├── Burn.tsx # Burn dashboard: counter + source cards + chart + feed │ ├── Tokens.tsx # Token directory (or empty state) │ ├── Gas.tsx # Gas tracker (or empty state) │ ├── Accounts.tsx # Leaderboard: ranked funded accounts │ └── NotFound.tsx # 404 ├── stores/ │ └── appStore.ts # Zustand: cached API responses, search state, preferences ├── hooks/ │ ├── useStats.ts # GET /api/stats — polls every 30s │ ├── useTransfers.ts # GET /api/txs?limit=N — polls every 60s │ ├── useAccount.ts # GET /api/account/:addr + /api/txs/:addr │ ├── useAccounts.ts # GET /api/accounts?limit=75 │ ├── useBurns.ts # GET /api/txs/{burnAddress}?limit=200 — derives totals │ ├── useGas.ts # GET /api/gas — handles empty/error gracefully │ ├── useTokens.ts # GET /api/tokens — handles empty/error gracefully │ └── useCopy.ts # Clipboard copy with flash state ├── config/ │ └── constants.ts # API base URL, known addresses, burn address, router address ├── utils/ │ ├── api.ts # Typed fetch wrapper for all endpoints │ ├── enrichTransfers.ts # QFPay triplet grouping + burn annotation │ ├── format.ts # formatQF(), truncateAddress(), relativeTime(), formatNumber() │ └── avatar.ts # Deterministic gradient SVG data URL from address └── types/ └── index.ts # Transfer, Account, StatsResponse, etc.


---

## 4. Config Files

### index.html

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>QFTools — Explorer for QF Network</title>
    <meta name="description" content="The human-readable layer of QF Network. Search accounts, track burns, explore activity." />

    <meta property="og:title" content="QFTools — Explorer for QF Network" />
    <meta property="og:description" content="The human-readable layer of QF Network." />
    <meta property="og:image" content="/og-image.png" />
    <meta property="og:url" content="https://qftools.xyz" />
    <meta property="og:type" content="website" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="QFTools — Explorer for QF Network" />
    <meta name="twitter:description" content="The human-readable layer of QF Network." />
    <meta name="twitter:image" content="/og-image.png" />

    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
    <link rel="manifest" href="/manifest.json" />
    <meta name="theme-color" content="#0A0A0A" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <link rel="canonical" href="https://qftools.xyz/" />

    <link href="https://api.fontshare.com/v2/css?f[]=clash-display@600,700&f[]=satoshi@400,500,600,700&display=swap" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
  </head>
  <body class="bg-[#0A0A0A] text-white antialiased">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
tailwind.config.js
Copy/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0A0A0A',
          card: '#111111',
        },
        qns: '#00D179',
        qfpay: '#0052FF',
        burn: '#E85D25',
        'burn-red': '#C13333',
      },
      fontFamily: {
        display: ['"Clash Display"', 'sans-serif'],
        body: ['Satoshi', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"IBM Plex Mono"', 'monospace'],
      },
      maxWidth: {
        content: '720px',
      },
    },
  },
  plugins: [],
};
Copy
postcss.config.js
Copyexport default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
vite.config.ts
Copyimport { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
src/index.css
Copy@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  *, *::before, *::after {
    box-sizing: border-box;
  }

  html {
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.1) #0a0a0a;
    overflow-x: clip;
    max-width: 100vw;
  }

  body {
    margin: 0;
    background-color: #0A0A0A;
    color: #FFFFFF;
    font-family: 'Satoshi', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-wrap: break-word;
    word-break: break-word;
    overflow-x: clip;
    max-width: 100vw;
  }

  #root {
    overflow-wrap: break-word;
    word-break: break-word;
    overflow-x: clip;
    max-width: 100vw;
  }

  ::selection {
    background-color: rgba(255, 255, 255, 0.15);
    color: #FFFFFF;
  }

  input::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
}

@layer utilities {
  .font-clash {
    font-family: 'Clash Display', sans-serif;
  }
  .font-satoshi {
    font-family: 'Satoshi', sans-serif;
  }
  .font-mono-addr {
    font-family: 'JetBrains Mono', 'IBM Plex Mono', monospace;
  }
}

/* Scrollbar for webkit */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: #0a0a0a; }
::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 999px; }
::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
Copy
5. Live API Reference
Base URL: https://qf-explorer.mathswins.co.uk/api

All data is live. No mock data. If an endpoint errors or returns empty, show a designed empty state.

Endpoints
GET /api/stats
Copy{
  "totalExtrinsics": 1396,
  "totalTransfers": 70,
  "fundedAccounts": 75,
  "lastIndexedBlock": 48389719
}
GET /api/health
Copy{ "status": "ok", "timestamp": 1774433758444 }
GET /api/accounts?limit=N
Returns accounts sorted by total balance descending. Max 200.

Copy{
  "count": 75,
  "accounts": [
    {
      "address": "5GaRaCrdTYJAX2ze8hGUXkNZfRJNRR8TL9YzasZs22U2rgfR",
      "h160": "0xe035a3f11cb1aba8746d7fb0b27ef39a828b45ac",
      "name": null,
      "freeQF": "10000000.000000",
      "reservedQF": "90000000.000000",
      "totalQF": "100000000.000000",
      "nonce": 0,
      "lastSeen": 1774433526
    }
  ]
}
The name field is either null or a string like "axe.qf" (includes the .qf suffix).

GET /api/txs?limit=N
Returns recent transfers and extrinsics.

Copy{
  "transfers": {
    "count": 70,
    "items": [
      {
        "blockNumber": 48350818,
        "from": "5DqSZBLxvAvqeHph3uzdHkhFF85JSpPVjZrhPwwFrWoYnaax",
        "fromName": "bigbadbarry.qf",
        "to": "5Ew9dLGRMLr3J5icw9vSG64w62hdxcvrDAvjKqx9T1KG1uKc",
        "toName": null,
        "amountWei": "690690000000000000",
        "amountQF": "0.690690",
        "timestamp": 1774386005,
        "hash": null
      }
    ]
  },
  "extrinsics": { "count": 70, "items": [...] }
}
fromName and toName are either null or strings like "bigbadbarry.qf".

GET /api/account/:address
Address can be SS58 format or a .qf name (e.g., axe.qf).

Copy{
  "address": "5DcouPSTvkgJiHGjTENcCDimNsRnu5vQuaGQNoArVuFoKM73",
  "found": true,
  "balance": {
    "address": "5DcouPSTvkgJiHGjTENcCDimNsRnu5vQuaGQNoArVuFoKM73",
    "h160": "0x66643ca1487d96406955222f0a10d5fd9c82d372",
    "name": "axe.qf",
    "freeQF": "33.245708",
    "reservedQF": "0.001052",
    "totalQF": "33.246760",
    "nonce": 17,
    "lastSeen": 1774433526
  }
}
GET /api/txs/:address?limit=N
Transfers/extrinsics scoped to one address. Address can be SS58 or .qf name. Response includes addressName field. Same shape as /api/txs.

GET /api/gas
Currently returns error/empty. Handle gracefully with designed empty state.

GET /api/tokens
Currently returns error/empty. Handle gracefully with designed empty state.

6. Known Addresses
Copy// src/config/constants.ts

export const API_BASE = 'https://qf-explorer.mathswins.co.uk/api';

export const BURN_ADDRESS = '5C4hrfjw9DjXZTzV3MwzrrAr9PUr9y8SHgV3cmVGNUWRiJL5';
export const QFPAY_ROUTER = '5Ew9dLGRMLr3J5icw9vSG64w62hdxcvrDAvjKqx9T1KG1uKc';

// Known system addresses for labeling in the UI
export const KNOWN_ADDRESSES: Record<string, string> = {
  '5C4hrfjw9DjXZTzV3MwzrrAr9PUr9y8SHgV3cmVGNUWRiJL5': 'Burn Address',
  '5Ew9dLGRMLr3J5icw9vSG64w62hdxcvrDAvjKqx9T1KG1uKc': 'QFPay Router',
};
7. QFPay Burn Detection
QFPay transfers appear as triplets in the same block:

User → QFPay Router: The full amount (e.g., 0.690690 QF)
QFPay Router → Recipient: 99.9% (e.g., 0.690000 QF)
QFPay Router → Burn Address: 0.1% (e.g., 0.000690 QF)
The enrichTransfers() utility groups these into a single display row showing:

Original sender (from transfer #1)
Final recipient (from transfer #2)
Net amount received
Burn amount with flame badge
Transfers #1 and #3 are hidden from the feed. Only the enriched delivery row is shown.

There is also a secondary router pattern observed in the live data: address 5HiY1Six... and 5HGj7Six... also send burns to the burn address. The detection logic should identify ANY transfer to the burn address in the same block as a delivery from the same sender, regardless of whether the sender is the known QFPay Router.

Implementation: src/utils/enrichTransfers.ts

Copyimport { BURN_ADDRESS, QFPAY_ROUTER } from '../config/constants';

export interface Transfer {
  blockNumber: number;
  from: string;
  fromName: string | null;
  to: string;
  toName: string | null;
  amountQF: string;
  amountWei: string;
  timestamp: number;
  hash: string | null;
}

export interface EnrichedTransfer extends Transfer {
  isQFPayTransfer: boolean;
  burnAmount?: number;
  originalSender?: string;
  originalSenderName?: string | null;
}

export function enrichTransfers(transfers: Transfer[]): EnrichedTransfer[] {
  const byBlock = new Map<number, Transfer[]>();
  for (const tx of transfers) {
    const list = byBlock.get(tx.blockNumber) || [];
    list.push(tx);
    byBlock.set(tx.blockNumber, list);
  }

  const enriched: EnrichedTransfer[] = [];
  const consumed = new Set<number>(); // index in original array

  for (let i = 0; i < transfers.length; i++) {
    if (consumed.has(i)) continue;
    const tx = transfers[i];
    const blockTxs = byBlock.get(tx.blockNumber) || [];

    // Is this a delivery FROM a router-like address (not to burn)?
    if (tx.to !== BURN_ADDRESS) {
      // Find a burn in the same block from the same sender
      const burnIdx = transfers.findIndex(
        (t, j) =>
          j !== i &&
          !consumed.has(j) &&
          t.blockNumber === tx.blockNumber &&
          t.from === tx.from &&
          t.to === BURN_ADDRESS
      );

      if (burnIdx !== -1) {
        const burnTx = transfers[burnIdx];
        // Find the user→router transfer in same block
        const senderIdx = transfers.findIndex(
          (t, j) =>
            j !== i &&
            j !== burnIdx &&
            !consumed.has(j) &&
            t.blockNumber === tx.blockNumber &&
            t.to === tx.from
        );

        consumed.add(i);
        consumed.add(burnIdx);
        if (senderIdx !== -1) consumed.add(senderIdx);

        const senderTx = senderIdx !== -1 ? transfers[senderIdx] : null;

        enriched.push({
          ...tx,
          from: senderTx?.from || tx.from,
          fromName: senderTx?.fromName || tx.fromName,
          isQFPayTransfer: true,
          burnAmount: parseFloat(burnTx.amountQF),
          originalSender: senderTx?.from,
          originalSenderName: senderTx?.fromName,
        });
        continue;
      }
    }

    // Is this a burn transfer or user→router that should already be consumed?
    if (tx.to === BURN_ADDRESS || tx.to === QFPAY_ROUTER) {
      const hasDelivery = transfers.some(
        (t, j) =>
          j !== i &&
          t.blockNumber === tx.blockNumber &&
          t.from === (tx.to === BURN_ADDRESS ? tx.from : tx.to) &&
          t.to !== BURN_ADDRESS &&
          t.from !== tx.from
      );
      if (hasDelivery) {
        consumed.add(i);
        continue;
      }
    }

    // Regular transfer
    enriched.push({ ...tx, isQFPayTransfer: false });
  }

  return enriched;
}
Copy
8. Burn Totals
To compute burn totals for the Burn Dashboard, fetch all transfers TO the burn address:

GET /api/txs/5C4hrfjw9DjXZTzV3MwzrrAr9PUr9y8SHgV3cmVGNUWRiJL5?limit=200
Live data (as of build time) shows 17 burn transfers totaling ~0.0627 QF. Most are from the QFPay Router (5Ew9dLGRML...). A few are from 5HiY1Six... and 5HGj7Six... (other router instances or direct burns). Categorize:

QFPay burns: from is the QFPay Router address → source: "QFPay"
Other burns: any other from address → source: "Other" (label generically until QNS burn pattern is confirmed on-chain)
9. TypeScript Types
Copy// src/types/index.ts

export interface StatsResponse {
  totalExtrinsics: number;
  totalTransfers: number;
  fundedAccounts: number;
  lastIndexedBlock: number;
}

export interface HealthResponse {
  status: string;
  timestamp: number;
}

export interface Account {
  address: string;
  h160: string;
  name: string | null;        // e.g. "axe.qf" or null
  freeQF: string;
  reservedQF: string;
  totalQF: string;
  nonce: number;
  lastSeen: number;
}

export interface AccountsResponse {
  count: number;
  accounts: Account[];
}

export interface Transfer {
  blockNumber: number;
  from: string;
  fromName: string | null;    // e.g. "bigbadbarry.qf" or null
  to: string;
  toName: string | null;
  amountWei: string;
  amountQF: string;
  timestamp: number;
  hash: string | null;
}

export interface Extrinsic {
  blockNumber: number;
  index: number;
  hash: string;
  signer: string;
  signerName: string | null;
  section: string;
  method: string;
  call: string;
  args: string[];
  success: boolean;
  timestamp: number;
}

export interface TransfersResponse {
  transfers: { count: number; items: Transfer[] };
  extrinsics: { count: number; items: Extrinsic[] };
}

export interface AccountDetailResponse {
  address: string;
  found: boolean;
  balance: Account;
}

export interface AddressTransfersResponse extends TransfersResponse {
  address: string;
  addressName: string | null;
}
Copy
10. Name Handling
The API returns .qf names WITH the suffix included (e.g., "axe.qf", "bigbadbarry.qf").

The QFName component splits on this:

Copyfunction QFName({ name }: { name: string }) {
  const base = name.endsWith('.qf') ? name.slice(0, -3) : name;
  return (
    <span className="font-body font-medium text-white">
      {base}<span className="text-qns">.qf</span>
    </span>
  );
}
The Identity component decides which to render:

Copyfunction Identity({ address, name, showAvatar = true, size = 24 }: Props) {
  if (name) {
    return (
      <span className="inline-flex items-center gap-2">
        {showAvatar && <GradientAvatar address={address} size={size} />}
        <QFName name={name} />
      </span>
    );
  }
  return <TruncatedAddress address={address} />;
}
11. Routing
/                     → Redirect to /explorer
/explorer             → Home: stats + search + live activity feed
/explorer/accounts    → Accounts leaderboard
/explorer/:id         → Account view (id = "axe.qf" or SS58 address)
/tokens               → Token directory
/gas                  → Gas tracker
/burn                 → Burn dashboard
*                     → 404 Not Found
/explorer/accounts must be matched BEFORE /explorer/:id in the route config.

12. Hooks Pattern
Each hook follows this shape:

Copyimport { useState, useEffect } from 'react';
import { api } from '../utils/api';

export function useStats(pollInterval = 30_000) {
  const [data, setData] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetch() {
      try {
        const res = await api.getStats();
        if (mounted) { setData(res); setLoading(false); setError(null); }
      } catch (e) {
        if (mounted) { setError('Failed to fetch'); setLoading(false); }
      }
    }

    fetch();
    const id = setInterval(fetch, pollInterval);
    return () => { mounted = false; clearInterval(id); };
  }, [pollInterval]);

  return { data, loading, error };
}
Polling intervals: stats 30s, transfers 60s, accounts 60s. Gas/tokens: fetch once on mount, no polling.

13. Design Rules (Non-Negotiable)
These are the cliff-notes from qftools.md. Read the full spec for details.

Background: #0A0A0A everywhere. Cards: #111111. No other surface colors.
Text hierarchy: text-white (primary), text-white/50 (secondary), text-white/30 (tertiary).
Borders: border-white/5 default, border-white/10 subtle, border-white/20 focus. Never heavier.
No shadows. No gradients (except burn chart fill). No heavy borders.
QNS green (#00D179): ONLY on .qf suffixes and the sync status dot.
QFPay blue (#0052FF): ONLY on burn source card top-border and QFPay labels.
Burn orange (#E85D25): ONLY on flame icons and burn amounts.
Headlines: Clash Display (font-display). Body: Satoshi (font-body). Addresses: JetBrains Mono (font-mono).
Max content width: max-w-content (720px), centered. No sidebars.
Every transition: Framer Motion. No CSS animations except sync dot pulse.
Loading states: Skeleton shimmer. Never spinners.
Empty states: Designed with icon + title + description. Empty = "early," not "broken."
Mobile-first. No hamburger menu. Nav stays horizontal.
14. Build Order
Phase 1: Foundation
1. Initialize the project from the repo root (which contains only .md files):
   ```bash
   npm create vite@latest . -- --template react-ts
   npm install
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p (tailswind v3)
   npm install framer-motion zustand react-router-dom lucide-react
Phase 2: Data Layer
src/types/index.ts — all TypeScript interfaces
src/config/constants.ts — API base, known addresses
src/utils/api.ts — typed fetch wrapper with all endpoints
src/utils/format.ts — formatQF, truncateAddress, relativeTime, formatNumber
src/utils/enrichTransfers.ts — QFPay triplet grouping
src/utils/avatar.ts — deterministic gradient from address hash
All hooks: useStats, useTransfers, useAccount, useAccounts, useBurns, useGas, useTokens, useCopy
VERIFY: Console.log each hook's data, confirm API responses parse correctly
Phase 3: Shared Components
GradientAvatar, QFName, TruncatedAddress, Identity
NumberScroller (per-digit mechanical counter)
BurnBadge (flame icon + amount)
TransferRow (uses Identity, BurnBadge, format utils)
StatsLine (uses useStats, NumberScroller for block count, pulsing sync dot)
SearchBar (cycling placeholder, enter-to-navigate)
SearchModal (Cmd+K, searches useAccounts data)
EmptyState, Skeleton
VERIFY: Render each component in isolation, check against qftools.md spec
Phase 4: Pages
Explorer — StatsLine + SearchBar + activity feed from useTransfers → enrichTransfers()
AccountView — useAccount(id), hero with avatar/name/address/bio, balance, filtered activity
Burn — useBurns for burn history, hero counter, source breakdown cards, SVG area chart, burn feed
Tokens — useTokens, show data or EmptyState
Gas — useGas, show data or EmptyState with subtle animated sine wave
Accounts — useAccounts(75), leaderboard sorted by totalQF, relative bars
VERIFY: All pages render with real data, QFPay burns detected, names render correctly
Phase 5: Polish
Cmd+K keyboard shortcut
Stagger animations on all list renders (staggerChildren: 0.05)
Hover states on interactive rows (bg-white/[0.02] transition)
Test at 375px — no overflow, clean stacking
Loading states: skeleton shimmer on every page during initial fetch
Error states: graceful fallback if API is down
Copy button micro-animation (icon swap + scale pulse)
Burn counter mount animation (count up from 0 over 2s)
VERIFY: Full quality against qftools.md Section 8 (Global UX Patterns)
15. Error & Empty State Handling
Endpoint  When empty/error  Display
/api/tokens Returns error EmptyState: token icon + "No tokens yet" + "Tokens will appear here as they're deployed on QF Network."
/api/gas  Returns error EmptyState: gauge icon + "Collecting gas data" + "Real-time gas prices will appear here as data accumulates."
/api/txs  Returns 0 items "No activity yet"
/api/account/:id  found: false  "Account not found" + "This address has no on-chain activity."
Any endpoint  Network failure Subtle line: "Unable to connect to QF Network" in text-white/30. No red, no alarm.
This document + qftools.md together are the complete source of truth. Do not deviate unless explicitly told to.