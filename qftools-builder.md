# QFTools — AI Builder Prompt

## PROJECT OVERVIEW

Build "QFTools" — the world's most premium blockchain explorer. This is a React + TypeScript + Vite + Tailwind CSS + Framer Motion application. It is a dark-mode-only, mobile-first, single-page application with client-side routing. It uses mock data for now (no real blockchain connection). The design quality bar is Awwwards / Godly.website level. Think Linear, Vercel Dashboard, and Apple product pages — but for a blockchain explorer. This should be the most beautiful, polished, and intentional blockchain tool ever built.

This is NOT an Etherscan clone. This is a people-first explorer where human-readable names (.qf names) are shown instead of hex addresses wherever possible. It should feel like a premium fintech product, not a developer tool.

---

## TECH STACK (strict)

- React 18+ with TypeScript
- Vite for build
- Tailwind CSS for styling (dark mode only, no light mode)
- Framer Motion for ALL animations and transitions
- React Router v6 for client-side routing
- Zustand for state management
- No component library (no shadcn, no MUI, no Chakra). All components are custom-built.
- No external icon library. Use inline SVGs for the ~5 icons needed (copy, flame, search, speaker, magnifying glass).

---

## FONTS (critical — load these first)

Add these to the HTML <head>:

```html
<link href="https://api.fontshare.com/v2/css?f[]=clash-display@600,700&f[]=satoshi@400,500,600,700&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
Copy
Tailwind config font families:

CopyfontFamily: {
  display: ['"Clash Display"', 'sans-serif'],
  body: ['Satoshi', 'sans-serif'],
  mono: ['"JetBrains Mono"', 'monospace'],
}
Usage rules:

font-display (Clash Display): ALL headlines, page titles, section headings, large numbers (balances, counters, stats)
font-body (Satoshi): ALL body text, labels, descriptions, nav items, metadata, amounts, "QF" unit text
font-mono (JetBrains Mono): ALL addresses (SS58 and hex), contract addresses, block numbers, hashes, nonce values
COLOR SYSTEM (strict — no deviations)
Tailwind config:

Copycolors: {
  bg: {
    primary: '#0A0A0A',
    card: '#111111',
  },
  qns: '#00D179',       // emerald green — ONLY for .qf name suffixes and sync dot
  qfpay: '#0052FF',     // blue — ONLY for QFPay-related annotations
  burn: '#E85D25',      // orange — ONLY for burn-related elements (flame icon, burn amounts)
  burnRed: '#C13333',   // deep red — only in burn gradient
}
```
Text colors (use Tailwind arbitrary values):

Primary text: text-white
Secondary text: text-white/50
Tertiary text: text-white/30
Borders: border-white/5 (default), border-white/10 (subtle), border-white/20 (focus)
RULES:

The app background is ALWAYS #0A0A0A. Cards and containers are #111111.
NO colored backgrounds on cards. No gradients except on the burn chart area fill.
NO shadows anywhere. No drop-shadow, no box-shadow.
NO borders heavier than border-white/10. Most borders are border-white/5.
The QNS green (#00D179) appears ONLY on the ".qf" text suffix when rendering names, and on the tiny sync status dot. Nowhere else.
The QFPay blue (#0052FF) appears ONLY when labeling QFPay-specific data.
The burn orange (#E85D25) appears ONLY on flame icons and burn amount text.
The tool's own UI (nav, buttons, search bar, borders) uses ONLY white at various opacities. NO accent color in the tool's own chrome.
LAYOUT SYSTEM
Max content width: max-w-2xl (672px) centered on all screen sizes. This is deliberate — the narrow column creates focus and readability.
On screens wider than 1440px, the content stays centered with massive negative space on both sides. This is a feature, not a bug.
Mobile: full width with px-4 padding.
NO sidebars. NO dashboard layouts. Every page is a single vertical column.
Body/html background: bg-[#0A0A0A] with min-h-screen.
NAVIGATION
A persistent top nav bar on every page:

[QFTools wordmark]                    [Explorer] [Tokens] [Gas] [Burn]
Fixed at top, transparent background, border-b border-white/5
Left: "QF" in text-white font-display font-semibold text-base, "Tools" in text-white/50 font-display font-semibold text-base. Clickable, links to /.
Right: nav links in font-body font-medium text-sm. Inactive: text-white/50 hover:text-white/70 transition-colors. Active: text-white with a 4px white circle dot centered below the text (use a pseudo-element or a small div).
On mobile: nav items in a horizontally scrollable row if needed, with gap-6.
Height: h-14 (56px).
Content is centered within the same max-w-2xl container as page content.
MOCK DATA
QNS Names & Accounts
Create this mock data object with 30 accounts. Some have .qf names, some don't. The ones with .qf names also have avatars (use DiceBear gradient API URLs or generate deterministic gradient SVGs):
```
interface Account {
  address: string;          // SS58 format (starts with 5, 48 chars)
  qfName?: string;          // e.g., "alex" (without .qf suffix)
  avatar?: string;          // URL or null
  bio?: string;
  freeBalance: number;
  reservedBalance: number;
  nonce: number;
}

// Ecosystem / dApp Lab reserved names (these are special — they represent dApps)
const ACCOUNTS: Account[] = [
  // === ECOSYSTEM ACCOUNTS ===
  {
    address: '5FbmtGERRpSCFG8Rz8bVGrUPW6y7q2xKCDv4EeRz8bVGrU',
    qfName: 'deployer',
    avatar: null,
    bio: 'QF Network deployer account',
    freeBalance: 49.09,
    reservedBalance: 0,
    nonce: 506,
  },
  {
    address: '5HpLku4FAmAJHJpMo9Bv6CKFG8Rz8bVGrUPW6y7q2xKCDv',
    qfName: 'qfpay',
    avatar: null,
    bio: 'QFPay — Instant payments on QF Network',
    freeBalance: 0,
    reservedBalance: 0,
    nonce: 1,
  },
  {
    address: '5DfhGyZiTArUDB7pSMFJ2DCbGRz8bVGrUPW6y7q2xKCDvR',
    qfName: 'qns',
    avatar: null,
    bio: 'QF Name Service — Your identity on QF Network',
    freeBalance: 0,
    reservedBalance: 0,
    nonce: 1,
  },
  {
    address: '5GNJqTPyNqANBkUVMN1LPPrxXnFouWA2MJHzRz8bVGrUPW',
    qfName: 'qflink',
    avatar: null,
    bio: 'QFLink — On-chain messaging',
    freeBalance: 0,
    reservedBalance: 0,
    nonce: 1,
  },
  {
    address: '5EsXZf83jgtyuKCDv4EeRz8bVGrUPW6y7q2xotJQCYLMn',
    qfName: 'chopsticks',
    avatar: null,
    bio: null,
    freeBalance: 150.98,
    reservedBalance: 0,
    nonce: 9,
  },
  {
    address: '5HRAXshTidPW6y7q2xKCDv4EeRz8bVGrUPWE6YH5tzPq',
    qfName: 'hardwired',
    avatar: null,
    bio: 'Building on QF since day one',
    freeBalance: 14040.00,
    reservedBalance: 0,
    nonce: 8,
  },
  // === COMMUNITY ACCOUNTS ===
  {
    address: '5DqSZBLxvAKCDv4EeRz8bVGrUPW6y7q2xrWoYnaaxPm',
    qfName: 'bigbadbarry',
    avatar: null,
    bio: 'Barry. Big. Bad.',
    freeBalance: 11.10,
    reservedBalance: 0,
    nonce: 8,
  },
  {
    address: '5DcouPSTvkCDv4EeRz8bVGrUPW6y7q2xVuFoKM73Rt',
    qfName: 'axe',
    avatar: null,
    bio: null,
    freeBalance: 33.25,
    reservedBalance: 0,
    nonce: 17,
  },
  {
    address: '5Ew9dLGRMLKCDv4EeRz8bVGrUPW6y7q2xT1KG1uKcNm',
    qfName: 'alex',
    avatar: null,
    bio: 'dApp Lab',
    freeBalance: 920.50,
    reservedBalance: 0,
    nonce: 42,
  },
  {
    address: '5CiRz8bVGrUPW6y7q2xKCDv4EeRz8bVGrUPW6y7qNUWR',
    qfName: 'boobs',
    avatar: null,
    bio: null,
    freeBalance: 1.32,
    reservedBalance: 0,
    nonce: 20,
  },
  {
    address: '5FvRz8bVGrUPW6y7q2xKCDv4EeRz8bVGrUPW6y7qWxMn',
    qfName: 'satoshi',
    avatar: null,
    bio: 'In cryptography we trust',
    freeBalance: 2100.00,
    reservedBalance: 0,
    nonce: 31,
  },
  {
    address: '5GjRz8bVGrUPW6y7q2xKCDv4EeRz8bVGrUPW6y7qKpLm',
    qfName: 'vitalik',
    avatar: null,
    bio: null,
    freeBalance: 450.75,
    reservedBalance: 0,
    nonce: 15,
  },
  {
    address: '5HkRz8bVGrUPW6y7q2xKCDv4EeRz8bVGrUPW6y7qPnQr',
    qfName: 'zero',
    avatar: null,
    bio: 'First to nothing, last to everything',
    freeBalance: 0.01,
    reservedBalance: 0,
    nonce: 3,
  },
  {
    address: '5JmRz8bVGrUPW6y7q2xKCDv4EeRz8bVGrUPW6y7qTrSt',
    qfName: 'phantom',
    avatar: null,
    bio: null,
    freeBalance: 77.77,
    reservedBalance: 0,
    nonce: 7,
  },
  {
    address: '5KnRz8bVGrUPW6y7q2xKCDv4EeRz8bVGrUPW6y7qVuTw',
    qfName: 'ghost',
    avatar: null,
    bio: 'Lurking in the mempool',
    freeBalance: 500.00,
    reservedBalance: 0,
    nonce: 22,
  },
  {
    address: '5LpRz8bVGrUPW6y7q2xKCDv4EeRz8bVGrUPW6y7qXwVy',
    qfName: 'nova',
    avatar: null,
    bio: 'Stellar things ahead',
    freeBalance: 3333.33,
    reservedBalance: 0,
    nonce: 44,
  },
  {
    address: '5MqRz8bVGrUPW6y7q2xKCDv4EeRz8bVGrUPW6y7qZyXA',
    qfName: 'pixel',
    avatar: null,
    bio: 'One dot at a time',
    freeBalance: 88.88,
    reservedBalance: 0,
    nonce: 11,
  },
  {
    address: '5NrRz8bVGrUPW6y7q2xKCDv4EeRz8bVGrUPW6y7qBACB',
    qfName: 'onyx',
    avatar: null,
    bio: null,
    freeBalance: 1250.00,
    reservedBalance: 0,
    nonce: 19,
  },
  {
    address: '5PsRz8bVGrUPW6y7q2xKCDv4EeRz8bVGrUPW6y7qDCED',
    qfName: 'ember',
    avatar: null,
    bio: 'Burning bright',
    freeBalance: 666.66,
    reservedBalance: 0,
    nonce: 16,
  },
  {
    address: '5QtRz8bVGrUPW6y7q2xKCDv4EeRz8bVGrUPW6y7qFEGF',
    qfName: 'cipher',
    avatar: null,
    bio: 'Encrypted thoughts',
    freeBalance: 42.00,
    reservedBalance: 0,
    nonce: 5,
  },
  // === ACCOUNTS WITHOUT QNS NAMES (address-only) ===
  {
    address: '5GaRaCrdTYRz8bVGrUPW6y7q2xKCDv4Ee22U2rgfRPm',
    freeBalance: 10000000,
    reservedBalance: 90000000,
    nonce: 0,
  },
  {
    address: '5F6i4D5y3cRz8bVGrUPW6y7q2xKCDv4EenCSKnWMuQp',
    freeBalance: 10000000,
    reservedBalance: 90000000,
    nonce: 0,
  },
  {
    address: '5ECAbGJmoWRz8bVGrUPW6y7q2xKCDv4Eerg2Gyr8kLm',
    freeBalance: 19400000,
    reservedBalance: 180000000,
    nonce: 0,
  },
  {
    address: '5EU53UgNLRz8bVGrUPW6y7q2xKCDv4Ee9tr6t7roNp',
    freeBalance: 5000000,
    reservedBalance: 45000000,
    nonce: 0,
  },
  {
    address: '5G9dSUYyR2Rz8bVGrUPW6y7q2xKCDv4EeoX4gium8Qr',
    freeBalance: 70960,
    reservedBalance: 0,
    nonce: 0,
  },
  {
    address: '5Dqb6W6gKrRz8bVGrUPW6y7q2xKCDv4Ee8f7xf4FEst',
    freeBalance: 4990,
    reservedBalance: 0,
    nonce: 1,
  },
  {
    address: '5CoR3f1aqWRz8bVGrUPW6y7q2xKCDv4Ee4UPWQHjRuv',
    freeBalance: 2500,
    reservedBalance: 0,
    nonce: 0,
  },
  {
    address: '5GuU6sEamVRz8bVGrUPW6y7q2xKCDv4EeCRJwAqJDwx',
    freeBalance: 2500,
    reservedBalance: 0,
    nonce: 4,
  },
  {
    address: '5Dnf1nGQZFRz8bVGrUPW6y7q2xKCDv4EeyufEkkAuyz',
    freeBalance: 49.93,
    reservedBalance: 0,
    nonce: 2,
  },
  {
    address: '5FjunwqnWQRz8bVGrUPW6y7q2xKCDv4Ee9QDC8LBgAB',
    freeBalance: 100.00,
    reservedBalance: 0,
    nonce: 0,
  },
];
```
Mock Transfers (30 transfers with QFPay burns interleaved)
```interface Transfer {
  id: string;
  from: string;       // address
  to: string;         // address  
  amount: number;
  block: number;
  timestamp: string;  // ISO string
  isQFPayTransfer: boolean;
  burnAmount?: number; // 0.1% of amount, only if isQFPayTransfer
}

// Generate 30 transfers using the accounts above.
// Rules:
// - About 60% should be QFPay transfers (isQFPayTransfer: true, with burnAmount = amount * 0.001)
// - Mix of transfers between named accounts and unnamed accounts
// - Blocks range from 48,300,000 to 48,380,000
// - Timestamps range from "2026-03-24T10:00:00Z" to "2026-03-25T08:00:00Z"
// - Amounts range from 0.05 QF to 5000 QF
// - Some transfers should be between well-known names (alex.qf → axe.qf, bigbadbarry.qf → nova.qf, etc.)
// - Include a few transfers FROM named accounts TO unnamed addresses
// - Include a few transfers FROM unnamed addresses TO named accounts

const TRANSFERS: Transfer[] = [
  {
    id: 'tx-001',
    from: '5Ew9dLGRMLKCDv4EeRz8bVGrUPW6y7q2xT1KG1uKcNm', // alex.qf
    to: '5DcouPSTvkCDv4EeRz8bVGrUPW6y7q2xVuFoKM73Rt',     // axe.qf
    amount: 1.00,
    block: 48306227,
    timestamp: '2026-03-24T19:45:14Z',
    isQFPayTransfer: true,
    burnAmount: 0.001,
  },
  {
    id: 'tx-002',
    from: '5Ew9dLGRMLKCDv4EeRz8bVGrUPW6y7q2xT1KG1uKcNm', // alex.qf
    to: '5DcouPSTvkCDv4EeRz8bVGrUPW6y7q2xVuFoKM73Rt',     // axe.qf
    amount: 0.10,
    block: 48305064,
    timestamp: '2026-03-24T19:43:17Z',
    isQFPayTransfer: true,
    burnAmount: 0.0001,
  },
  {
    id: 'tx-003',
    from: '5CiRz8bVGrUPW6y7q2xKCDv4EeRz8bVGrUPW6y7qNUWR', // boobs.qf
    to: '5Ew9dLGRMLKCDv4EeRz8bVGrUPW6y7q2xT1KG1uKcNm',    // alex.qf
    amount: 0.10,
    block: 48305064,
    timestamp: '2026-03-24T19:43:17Z',
    isQFPayTransfer: true,
    burnAmount: 0.0001,
  },
  {
    id: 'tx-004',
    from: '5DqSZBLxvAKCDv4EeRz8bVGrUPW6y7q2xrWoYnaaxPm', // bigbadbarry.qf
    to: '5GaRaCrdTYRz8bVGrUPW6y7q2xKCDv4Ee22U2rgfRPm',   // unnamed
    amount: 5.00,
    block: 48306647,
    timestamp: '2026-03-24T19:45:56Z',
    isQFPayTransfer: true,
    burnAmount: 0.005,
  },
  {
    id: 'tx-005',
    from: '5GaRaCrdTYRz8bVGrUPW6y7q2xKCDv4Ee22U2rgfRPm', // unnamed
    to: '5DqSZBLxvAKCDv4EeRz8bVGrUPW6y7q2xrWoYnaaxPm',   // bigbadbarry.qf
    amount: 0.50,
    block: 48307431,
    timestamp: '2026-03-24T19:47:15Z',
    isQFPayTransfer: true,
    burnAmount: 0.0005,
  },
  {
    id: 'tx-006',
    from: '5FvRz8bVGrUPW6y7q2xKCDv4EeRz8bVGrUPW6y7qWxMn', // satoshi.qf
    to: '5LpRz8bVGrUPW6y7q2xKCDv4EeRz8bVGrUPW6y7qXwVy',   // nova.qf
    amount: 100.00,
    block: 48310500,
    timestamp: '2026-03-24T20:15:30Z',
    isQFPayTransfer: true,
    burnAmount: 0.1,
  },
  {
    id: 'tx-007',
    from: '5LpRz8bVGrUPW6y7q2xKCDv4EeRz8bVGrUPW6y7qXwVy', // nova.qf
    to: '5KnRz8bVGrUPW6y7q2xKCDv4EeRz8bVGrUPW6y7qVuTw',   // ghost.qf
    amount: 50.00,
    block: 48315000,
    timestamp: '2026-03-24T21:00:00Z',
    isQFPayTransfer: true,
    burnAmount: 0.05,
  },
  {
    id: 'tx-008',
    from: '5HRAXshTidPW6y7q2xKCDv4EeRz8bVGrUPWE6YH5tzPq', // hardwired.qf
    to: '5Ew9dLGRMLKCDv4EeRz8bVGrUPW6y7q2xT1KG1uKcNm',    // alex.qf
    amount: 500.00,
    block: 48320000,
    timestamp: '2026-03-24T22:00:00Z',
    isQFPayTransfer: true,
    burnAmount: 0.5,
  },
  {
    id: 'tx-009',
    from: '5PsRz8bVGrUPW6y7q2xKCDv4EeRz8bVGrUPW6y7qDCED', // ember.qf
    to: '5MqRz8bVGrUPW6y7q2xKCDv4EeRz8bVGrUPW6y7qZyXA',   // pixel.qf
    amount: 8.88,
    block: 48325000,
    timestamp: '2026-03-24T23:00:00Z',
    isQFPayTransfer: true,
    burnAmount: 0.00888,
  },
  {
    id: 'tx-010',
    from: '5NrRz8bVGrUPW6y7q2xKCDv4EeRz8bVGrUPW6y7qBACB', // onyx.qf
    to: '5QtRz8bVGrUPW6y7q2xKCDv4EeRz8bVGrUPW6y7qFEGF',   // cipher.qf
    amount: 25.00,
    block: 48330000,
    timestamp: '2026-03-24T23:30:00Z',
    isQFPayTransfer: false,
  },
  {
    id: 'tx-011',
    from: '5JmRz8bVGrUPW6y7q2xKCDv4EeRz8bVGrUPW6y7qTrSt', // phantom.qf
    to: '5HkRz8bVGrUPW6y7q2xKCDv4EeRz8bVGrUPW6y7qPnQr',   // zero.qf
    amount: 0.01,
    block: 48335000,
    timestamp: '2026-03-25T00:00:00Z',
    isQFPayTransfer: true,
    burnAmount: 0.00001,
  },
  {
    id: 'tx-012',
    from: '5GjRz8bVGrUPW6y7q2xKCDv4EeRz8bVGrUPW6y7qKpLm', // vitalik.qf
    to: '5FvRz8bVGrUPW6y7q2xKCDv4EeRz8bVGrUPW6y7qWxMn',   // satoshi.qf
    amount: 210.00,
    block: 48340000,
    timestamp: '2026-03-25T01:00:00Z',
    isQFPayTransfer: true,
    burnAmount: 0.21,
  },
  {
    id: 'tx-013',
    from: '5Dqb6W6gKrRz8bVGrUPW6y7q2xKCDv4Ee8f7xf4FEst', // unnamed
    to: '5PsRz8bVGrUPW6y7q2xKCDv4EeRz8bVGrUPW6y7qDCED',   // ember.qf
    amount: 200.00,
    block: 48345000,
    timestamp: '2026-03-25T02:00:00Z',
    isQFPayTransfer: false,
  },
  {
    id: 'tx-014',
    from: '5KnRz8bVGrUPW6y7q2xKCDv4EeRz8bVGrUPW6y7qVuTw', // ghost.qf
    to: '5Dnf1nGQZFRz8bVGrUPW6y7q2xKCDv4EeyufEkkAuyz',     // unnamed
    amount: 15.50,
    block: 48348000,
    timestamp: '2026-03-25T02:30:00Z',
    isQFPayTransfer: true,
    burnAmount: 0.0155,
  },
  {
    id: 'tx-015',
    from: '5Ew9dLGRMLKCDv4EeRz8bVGrUPW6y7q2xT1KG1uKcNm', // alex.qf
    to: '5FvRz8bVGrUPW6y7q2xKCDv4EeRz8bVGrUPW6y7qWxMn',   // satoshi.qf
    amount: 21.00,
    block: 48350000,
    timestamp: '2026-03-25T03:00:00Z',
    isQFPayTransfer: true,
    burnAmount: 0.021,
  },
  {
    id: 'tx-016',
    from: '5LpRz8bVGrUPW6y7q2xKCDv4EeRz8bVGrUPW6y7qXwVy', // nova.qf
    to: '5NrRz8bVGrUPW6y7q2xKCDv4EeRz8bVGrUPW6y7qBACB',   // onyx.qf
    amount: 333.33,
    block: 48352000,
    timestamp: '2026-03-25T03:15:00Z',
    isQFPayTransfer: true,
    burnAmount: 0.33333,
  },
  {
    id: 'tx-017',
    from: '5FbmtGERRpSCFG8Rz8bVGrUPW6y7q2xKCDv4EeRz8bVGrU', // deployer.qf
    to: '5HRAXshTidPW6y7q2xKCDv4EeRz8bVGrUPWE6YH5tzPq',      // hardwired.qf
    amount: 5000.00,
    block: 48355000,
    timestamp: '2026-03-25T04:00:00Z',
    isQFPayTransfer: false,
  },
  {
    id: 'tx-018',
    from: '5MqRz8bVGrUPW6y7q2xKCDv4EeRz8bVGrUPW6y7qZyXA', // pixel.qf
    to: '5JmRz8bVGrUPW6y7q2xKCDv4EeRz8bVGrUPW6y7qTrSt',   // phantom.qf
    amount: 7.77,
    block: 48358000,
    timestamp: '2026-03-25T04:30:00Z',
    isQFPayTransfer: true,
    burnAmount: 0.00777,
  },
  {
    id: 'tx-019',
    from: '5QtRz8bVGrUPW6y7q2xKCDv4EeRz8bVGrUPW6y7qFEGF', // cipher.qf
    to: '5Ew9dLGRMLKCDv4EeRz8bVGrUPW6y7q2xT1KG1uKcNm',    // alex.qf
    amount: 4.20,
    block: 48360000,
    timestamp: '2026-03-25T05:00:00Z',
    isQFPayTransfer: true,
    burnAmount: 0.0042,
  },
  {
    id: 'tx-020',
    from: '5DcouPSTvkCDv4EeRz8bVGrUPW6y7q2xVuFoKM73Rt', // axe.qf
    to: '5CiRz8bVGrUPW6y7q2xKCDv4EeRz8bVGrUPW6y7qNUWR', // boobs.qf
    amount: 0.69,
    block: 48362000,
    timestamp: '2026-03-25T05:15:00Z',
    isQFPayTransfer: true,
    burnAmount: 0.00069,
  },
  {
    id: 'tx-021',
    from: '5F6i4D5y3cRz8bVGrUPW6y7q2xKCDv4EenCSKnWMuQp', // unnamed (large holder)
    to: '5GjRz8bVGrUPW6y7q2xKCDv4EeRz8bVGrUPW6y7qKpLm',  // vitalik.qf
    amount: 1000.00,
    block: 48365000,
    timestamp: '2026-03-25T06:00:00Z',
    isQFPayTransfer: false,
  },
  {
    id: 'tx-022',
    from: '5HRAXshTidPW6y7q2xKCDv4EeRz8bVGrUPWE6YH5tzPq', // hardwired.qf
    to: '5LpRz8bVGrUPW6y7q2xKCDv4EeRz8bVGrUPW6y7qXwVy',   // nova.qf
    amount: 250.00,
    block: 48367000,
    timestamp: '2026-03-25T06:15:00Z',
    isQFPayTransfer: true,
    burnAmount: 0.25,
  },
  {
    id: 'tx-023',
    from: '5DqSZBLxvAKCDv4EeRz8bVGrUPW6y7q2xrWoYnaaxPm', // bigbadbarry.qf
    to: '5DcouPSTvkCDv4EeRz8bVGrUPW6y7q2xVuFoKM73Rt',     // axe.qf
    amount: 3.33,
    block: 48369000,
    timestamp: '2026-03-25T06:30:00Z',
    isQFPayTransfer: true,
    burnAmount: 0.00333,
  },
  {
    id: 'tx-024',
    from: '5KnRz8bVGrUPW6y7q2xKCDv4EeRz8bVGrUPW6y7qVuTw', // ghost.qf
    to: '5PsRz8bVGrUPW6y7q2xKCDv4EeRz8bVGrUPW6y7qDCED',   // ember.qf
    amount: 66.60,
    block: 48371000,
    timestamp: '2026-03-25T06:45:00Z',
    isQFPayTransfer: true,
    burnAmount: 0.0666,
  },
  {
    id: 'tx-025',
    from: '5EsXZf83jgtyuKCDv4EeRz8bVGrUPW6y7q2xotJQCYLMn', // chopsticks.qf
    to: '5FbmtGERRpSCFG8Rz8bVGrUPW6y7q2xKCDv4EeRz8bVGrU',  // deployer.qf
    amount: 10.00,
    block: 48373000,
    timestamp: '2026-03-25T07:00:00Z',
    isQFPayTransfer: true,
    burnAmount: 0.01,
  },
  {
    id: 'tx-026',
    from: '5Ew9dLGRMLKCDv4EeRz8bVGrUPW6y7q2xT1KG1uKcNm', // alex.qf
    to: '5KnRz8bVGrUPW6y7q2xKCDv4EeRz8bVGrUPW6y7qVuTw',   // ghost.qf
    amount: 42.00,
    block: 48375000,
    timestamp: '2026-03-25T07:15:00Z',
    isQFPayTransfer: true,
    burnAmount: 0.042,
  },
  {
    id: 'tx-027',
    from: '5NrRz8bVGrUPW6y7q2xKCDv4EeRz8bVGrUPW6y7qBACB', // onyx.qf
    to: '5GuU6sEamVRz8bVGrUPW6y7q2xKCDv4EeCRJwAqJDwx',     // unnamed
    amount: 125.00,
    block: 48377000,
    timestamp: '2026-03-25T07:30:00Z',
    isQFPayTransfer: false,
  },
  {
    id: 'tx-028',
    from: '5FvRz8bVGrUPW6y7q2xKCDv4EeRz8bVGrUPW6y7qWxMn', // satoshi.qf
    to: '5Ew9dLGRMLKCDv4EeRz8bVGrUPW6y7q2xT1KG1uKcNm',    // alex.qf
    amount: 21.00,
    block: 48378000,
    timestamp: '2026-03-25T07:40:00Z',
    isQFPayTransfer: true,
    burnAmount: 0.021,
  },
  {
    id: 'tx-029',
    from: '5LpRz8bVGrUPW6y7q2xKCDv4EeRz8bVGrUPW6y7qXwVy', // nova.qf
    to: '5HkRz8bVGrUPW6y7q2xKCDv4EeRz8bVGrUPW6y7qPnQr',   // zero.qf
    amount: 0.33,
    block: 48379000,
    timestamp: '2026-03-25T07:50:00Z',
    isQFPayTransfer: true,
    burnAmount: 0.00033,
  },
  {
    id: 'tx-030',
    from: '5DcouPSTvkCDv4EeRz8bVGrUPW6y7q2xVuFoKM73Rt', // axe.qf
    to: '5DqSZBLxvAKCDv4EeRz8bVGrUPW6y7q2xrWoYnaaxPm',  // bigbadbarry.qf
    amount: 2.22,
    block: 48380000,
    timestamp: '2026-03-25T08:00:00Z',
    isQFPayTransfer: true,
    burnAmount: 0.00222,
  },
];
```
Mock Burn Data
```interface BurnEvent {
  id: string;
  source: 'qfpay' | 'qns';
  amount: number;
  triggerTx: string;       // transfer id or "QNS registration"
  triggerAccount: string;  // address
  block: number;
  timestamp: string;
}

// Derive QFPay burns from the transfers above (every transfer with isQFPayTransfer: true).
// Add 8 additional QNS registration burns:

const QNS_BURNS: BurnEvent[] = [
  { id: 'burn-qns-001', source: 'qns', amount: 0.05,  triggerTx: 'QNS: alex.qf registered',       triggerAccount: '5Ew9dLGRMLKCDv4EeRz8bVGrUPW6y7q2xT1KG1uKcNm', block: 48100000, timestamp: '2026-03-20T10:00:00Z' },
  { id: 'burn-qns-002', source: 'qns', amount: 0.15,  triggerTx: 'QNS: axe.qf registered',        triggerAccount: '5DcouPSTvkCDv4EeRz8bVGrUPW6y7q2xVuFoKM73Rt',  block: 48100500, timestamp: '2026-03-20T10:30:00Z' },
  { id: 'burn-qns-003', source: 'qns', amount: 0.05,  triggerTx: 'QNS: boobs.qf registered',      triggerAccount: '5CiRz8bVGrUPW6y7q2xKCDv4EeRz8bVGrUPW6y7qNUWR', block: 48101000, timestamp: '2026-03-20T11:00:00Z' },
  { id: 'burn-qns-004', source: 'qns', amount: 0.05,  triggerTx: 'QNS: bigbadbarry.qf registered', triggerAccount: '5DqSZBLxvAKCDv4EeRz8bVGrUPW6y7q2xrWoYnaaxPm', block: 48102000, timestamp: '2026-03-20T12:00:00Z' },
  { id: 'burn-qns-005', source: 'qns', amount: 0.05,  triggerTx: 'QNS: satoshi.qf registered',    triggerAccount: '5FvRz8bVGrUPW6y7q2xKCDv4EeRz8bVGrUPW6y7qWxMn', block: 48110000, timestamp: '2026-03-21T08:00:00Z' },
  { id: 'burn-qns-006', source: 'qns', amount: 0.10,  triggerTx: 'QNS: vitalik.qf registered',    triggerAccount: '5GjRz8bVGrUPW6y7q2xKCDv4EeRz8bVGrUPW6y7qKpLm', block: 48120000, timestamp: '2026-03-21T14:00:00Z' },
  { id: 'burn-qns-007', source: 'qns', amount: 0.05,  triggerTx: 'QNS: ghost.qf registered',      triggerAccount: '5KnRz8bVGrUPW6y7q2xKCDv4EeRz8bVGrUPW6y7qVuTw', block: 48150000, timestamp: '2026-03-22T09:00:00Z' },
  { id: 'burn-qns-008', source: 'qns', amount: 0.05,  triggerTx: 'QNS: nova.qf registered',       triggerAccount: '5LpRz8bVGrUPW6y7q2xKCDv4EeRz8bVGrUPW6y7qXwVy', block: 48155000, timestamp: '2026-03-22T10:00:00Z' },
];
```
// Total burned: sum of all QFPay burnAmounts + sum of all QNS burns ≈ 1.832 QF
// Display this as the hero counter on the Burn page
Mock Token Directory
```
interface Token {
  name: string;
  symbol: string;
  contractAddress: string;
  deployer: string;       // address — resolve to .qf name if available
  totalSupply: string;
  verified: boolean;
}

const TOKENS: Token[] = [
  {
    name: 'Wrapped QF',
    symbol: 'wQF',
    contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
    deployer: '5FbmtGERRpSCFG8Rz8bVGrUPW6y7q2xKCDv4EeRz8bVGrU', // deployer.qf
    totalSupply: '1,000,000',
    verified: true,
  },
  {
    name: 'QF Staked',
    symbol: 'sQF',
    contractAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
    deployer: '5FbmtGERRpSCFG8Rz8bVGrUPW6y7q2xKCDv4EeRz8bVGrU', // deployer.qf
    totalSupply: '500,000',
    verified: true,
  },
  {
    name: 'Pixel Token',
    symbol: 'PXL',
    contractAddress: '0x567890abcdef1234567890abcdef123456789012',
    deployer: '5MqRz8bVGrUPW6y7q2xKCDv4EeRz8bVGrUPW6y7qZyXA', // pixel.qf
    totalSupply: '10,000,000',
    verified: false,
  },
  {
    name: 'Nova Credits',
    symbol: 'NOVA',
    contractAddress: '0x890abcdef1234567890abcdef12345678901234ab',
    deployer: '5LpRz8bVGrUPW6y7q2xKCDv4EeRz8bVGrUPW6y7qXwVy', // nova.qf
    totalSupply: '100,000',
    verified: false,
  },
  {
    name: 'Ember Fuel',
    symbol: 'FUEL',
    contractAddress: '0xcdef1234567890abcdef1234567890abcdef1234',
    deployer: '5PsRz8bVGrUPW6y7q2xKCDv4EeRz8bVGrUPW6y7qDCED', // ember.qf
    totalSupply: '50,000',
    verified: true,
  },
];
```
Mock Gas Data
```interface GasDataPoint {
  timestamp: string;
  price: number; // in micro-QF
}

// Generate 48 data points (one per hour for the last 2 days)
// Prices fluctuate between 0.00018 and 0.00035 QF
// Current gas price: 0.00025 QF

const GAS_DATA: GasDataPoint[] = [
  // ... generate 48 points with realistic fluctuation
];

const CURRENT_GAS = 0.00025;

// Cost estimates:
const GAS_ESTIMATES = {
  qfpayTransfer: '~0.0012 QF',
  qnsRegistration: '~0.0045 QF',
  tokenTransfer: '~0.0008 QF',
};
Network Stats
Copyconst NETWORK_STATS = {
  currentBlock: 48380000,
  fundedAccounts: 75,
  totalTransfers: 156,
  syncStatus: 'synced' as const,
  totalBurned: 1.832, // sum of all burns
  qfpayBurned: 1.282, // sum of QFPay burns only
  qnsBurned: 0.55,    // sum of QNS burns only
};
```
DETERMINISTIC GRADIENT AVATARS
For accounts that don't have a QNS avatar set (which is all of them in mock data), generate a deterministic gradient avatar. Build a utility function:

```function generateGradientAvatar(address: string): string {
  // Hash the address string to get deterministic values
  // Extract 2 hue values from the hash (0-360)
  // Return an inline SVG data URL with a radial or linear gradient
  // Use muted, warm-to-cool tones on dark backgrounds
  // The gradient should feel like the default avatars in Telegram or Signal
  // Circle shape, no text, just gradient
}
```
Each avatar is rendered as a circle (rounded-full). Size varies by context: 24px in transfer rows, 32px in leaderboard, 80px in account hero.

PAGE-BY-PAGE BUILD SPECIFICATIONS
PAGE 1: HOME / EXPLORER (/ and /explorer)
This is the front door. It must be breathtaking in its simplicity.

Structure (top to bottom):

Stats Line — centered, single line:

Block 48,380,000 · 75 accounts · 156 transfers · Synced
font-body text-[13px] text-white/40
Block number should animate: use a NumberScroller component that rolls each digit independently when the number changes. Simulate this by incrementing the block number by 1 every 6 seconds.
"Synced" preceded by a tiny (4px) pulsing circle in #00D179. Pulse: scale 1→1.3→1 over 2s infinite.
Stats separated by · (middle dot with spaces)
Search Bar — full content width:

Container: bg-[#111111] border border-white/10 rounded-xl h-14 px-5
On focus: border-white/20 transition-colors duration-200
Small magnifying glass icon (inline SVG, text-white/30) on the left inside the input
Placeholder cycles with crossfade every 4 seconds:
"Search a .qf name..."
"Search an address..."
"Search a block..."
Placeholder: font-body text-white/30
Input text: font-body text-white
On enter: if input matches a .qf name (without the .qf suffix), navigate to /explorer/{name}.qf. If it matches an address pattern, navigate to /explorer/{address}.
On mobile: gets position: sticky at top after scrolling past it
Activity Feed — the live transfer list:

Section heading: "Activity" in font-display text-lg font-semibold text-white with mt-10 mb-4
Each transfer row is a flex container:
[Avatar] sender.qf → [Avatar] recipient.qf                    1.00 QF 🔥0.001
Block 48,306,227 · 3 min ago
Row padding: py-4
Row divider: border-b border-white/5
Sender/Recipient rendering:
If .qf name exists: [GradientAvatar 24px] [name in font-body font-medium text-white][.qf in text-[#00D179]]
If no .qf name: [truncated address in font-mono text-sm text-white/50] — truncate as first 6 chars...last 6 chars
Arrow: → in text-white/30 mx-2 font-body
Amount: right-aligned, font-body font-semibold text-[15px] text-white. "QF" after in text-white/50.
QFPay burn badge: If isQFPayTransfer, after the amount show: a small inline flame SVG (12px, text-[#E85D25]) followed by the burn amount in text-white/30 text-xs font-mono. Example: 🔥0.001
Metadata line: below the main row, font-body text-xs text-white/30. Format: Block {number} · {relative time} (use "2 min ago", "1 hr ago", "yesterday" etc.)
Animation: The feed should load with a staggered fade-in (each row delays 50ms after the previous). Use Framer Motion variants with stagger.
Show all 30 transfers, newest first (sorted by block number descending).

PAGE 2: ACCOUNT VIEW (/explorer/:nameOrAddress)
The most important page. When you land here, you should feel like you're viewing someone's profile, not an address lookup.

Hero (top section):

Centered layout, pt-12 pb-8 text-center
Avatar: 80px circle, rounded-full. Use the generateGradientAvatar function with the account's address. Centered. Framer Motion: scale from 0.8 to 1 + fade in on mount, 400ms, spring.
Name: below avatar with mt-4. If .qf name: font-display text-[28px] font-semibold. Name part in text-white, ".qf" in text-[#00D179]. If no name: full address in font-mono text-sm text-white/70 (will be long, that's fine).
Address line: below name, mt-1. Full address in font-mono text-xs text-white/30. With a copy button: small clipboard SVG (14px, text-white/30) that on click copies the address, briefly shows a checkmark, and shows a "Copied" tooltip that fades out after 1s.
Bio: if present, below address, mt-2 font-body text-sm text-white/50 max-w-md mx-auto. Max 2 lines with line-clamp-2.
No-name CTA: if account has no .qf name, show below the address: font-body text-xs text-white/30 → "This address doesn't have a .qf name yet." with a link "Claim one →" in text-[#00D179] hover:underline pointing to https://dotqf.xyz.
Balance Section:

Centered, mt-6
Total balance: font-display text-[36px] font-bold text-white. Number formatted with commas and 2 decimals. "QF" after in text-white/40 font-body text-lg ml-1.
Breakdown: mt-1 font-body text-[13px] text-white/40. Format: {free} free · {reserved} reserved
Transaction count: mt-0.5 font-body text-xs text-white/30. "{nonce} transactions"
Activity Section:

mt-10
Heading: "Activity" in font-display text-lg font-semibold text-white mb-4
Same row format as home page, but filtered to only transfers involving this account.
If no activity: empty state with a subtle clock outline SVG (48px, text-white/5) and "No activity yet" in font-body text-sm text-white/30, centered.
Animation: The entire page should mount with a coordinated sequence:

Avatar scales + fades in (0→400ms)
Name fades in (200→500ms)
Balance fades + slides up (300→600ms)
Activity rows stagger in (500ms+)
PAGE 3: BURN DASHBOARD (/burn)
This page is a monument. It should feel significant.

Hero Counter:

Centered, pt-16 pb-8
The total QF burned, displayed huge: font-display text-[48px] font-bold text-white
Use the NumberScroller component so each digit can animate independently
Below: "QF burned forever" in font-body text-sm text-white/40 mt-2
Animate on mount: the number should count up from 0 to the actual value over ~2 seconds, with easing
Source Cards:

mt-8, two cards side by side on desktop (grid grid-cols-2 gap-4), stacked on mobile
Each card: bg-[#111111] border border-white/5 rounded-xl p-6
QFPay card has a border-t-2 border-t-[#0052FF] accent at top
QNS card has a border-t-2 border-t-[#00D179] accent at top
Inside each card:
Source label: font-body text-xs text-white/40 uppercase tracking-wider ("QFPAY TRANSFERS" / "QNS REGISTRATIONS")
Amount: font-display text-2xl font-semibold text-white mt-2 (e.g., "1.282 QF")
Mechanic: font-body text-xs text-white/30 mt-1 ("0.1% of every transfer" / "5% of every registration")
Burn Chart:

mt-8
Simple area chart. Build this with plain SVG (no chart library needed for mock data).
X-axis: dates. Y-axis: cumulative QF burned.
Line color: #E85D25
Fill: linear gradient from rgba(232, 93, 37, 0.15) at top to transparent at bottom
Axis labels: font-mono text-[11px] text-white/30
Chart background: transparent (sits on #0A0A0A)
Height: ~200px
Use 12 data points showing cumulative burn growing over the past 5 days
Recent Burns Feed:

mt-8
Heading: "Recent Burns" in font-display text-lg font-semibold text-white mb-4
Each row:
🔥 0.001 QF burned · QFPay transfer by alex.qf
Block 48,306,227 · 3 hours ago
Flame SVG in text-[#E85D25] (16px)
Amount: font-body font-semibold text-white
Context: font-body text-sm text-white/50. Source ("QFPay transfer" or "QNS registration") and the triggering account (rendered with .qf name if available, green suffix)
Metadata: font-body text-xs text-white/30
Show the 15 most recent burns (mix of QFPay and QNS)
PAGE 4: TOKEN DIRECTORY (/tokens)
Page heading: "Tokens" in font-display text-[28px] font-semibold text-white pt-8 mb-1
Subheading: "Deployed on QF Network" in font-body text-sm text-white/40 mb-8
Show the 5 tokens from mock data in a clean list:

Each row: py-4 border-b border-white/5

Layout:

Wrapped QF          wQF      0x1234...5678      deployer.qf      1,000,000      ✓
Token name: font-body font-medium text-white
Symbol: font-body text-sm text-white/50 ml-3
Contract: font-mono text-xs text-white/30 ml-auto (truncated)
Deployer: font-body text-sm — name in white + ".qf" in #00D179, or truncated address
Supply: font-body text-sm text-white/50
Verified: small checkmark SVG in text-white if verified, nothing if not
On mobile: the row wraps. Token name + symbol on first line, contract + deployer on second, supply on third. Still looks clean.

Disclaimer footer: mt-8 font-body text-[11px] text-white/30 text-center. "Listing a token does not constitute an endorsement. Always DYOR."

PAGE 5: GAS TRACKER (/gas)
Page heading: "Gas" in font-display text-[28px] font-semibold text-white pt-8 mb-1
Subheading: "Real-time gas prices on QF Network" in font-body text-sm text-white/40 mb-8
Current Price:

Large number: font-display text-[36px] font-bold text-white. Show "0.00025 QF"
Label below: font-body text-sm text-white/40 mt-1 → "Current gas price"
Chart:

mt-8
Same SVG chart approach as the burn chart but with a white/30 line instead of orange
Fill: rgba(255, 255, 255, 0.03) gradient
48 data points showing price fluctuation over 2 days
Height: ~180px
Cost Estimates:

mt-8
Heading: "Estimated costs" in font-display text-base font-semibold text-white mb-4
Three clean rows:
Send QF via QFPay                 ~0.0012 QF
Register a .qf name              ~0.0045 QF
Transfer a token                  ~0.0008 QF
Label: font-body text-sm text-white/50
Cost: font-mono text-sm text-white
Each row: py-3 border-b border-white/5 flex justify-between
PAGE 6: ACCOUNTS LEADERBOARD (/explorer/accounts)
Page heading: "Accounts" in font-display text-[28px] font-semibold text-white pt-8 mb-1
Subheading: "All funded accounts on QF Network" in font-body text-sm text-white/40 mb-6
Sort Controls:

Horizontal row of text toggles: "Total Balance" | "Free Balance" | "Transactions"
font-body text-sm. Active: text-white border-b border-white. Inactive: text-white/30 hover:text-white/50
mb-6 flex gap-6
Leaderboard Rows:

Sort all 30 accounts by total balance descending. Each row:

#1    [Avatar 32px] hardwired.qf                                14,040.00 QF    ████████████████
Rank: font-mono text-sm text-white/30 w-8
Avatar: 32px gradient circle
Identity: .qf name (white + green suffix) or truncated address
Balance: font-body font-semibold text-white right-aligned
Relative bar: a thin horizontal bar (h-1 rounded-full bg-white/10) whose width is proportional to this account's balance vs. the max. Max width ~120px.
Row: py-3 border-b border-white/5
For accounts with very large balances (the unnamed ones with 100M+ QF), format as "100.00M QF".

GLOBAL COMPONENTS TO BUILD
<QFName />
Renders a .qf name consistently everywhere:

Copy// Props: name: string (without .qf), size?: 'sm' | 'md' | 'lg'
// Renders: <span className="font-body font-medium text-white">{name}<span className="text-[#00D179]">.qf</span></span>
<TruncatedAddress />
Renders a truncated address:

Copy// Props: address: string, chars?: number (default 6)
// Renders: <span className="font-mono text-white/50">{first6}...{last6}</span>
<Identity />
Resolves an address to either a QFName or TruncatedAddress:

Copy// Props: address: string, showAvatar?: boolean, avatarSize?: number
// Looks up address in ACCOUNTS to find qfName
// If found: shows avatar + QFName
// If not: shows TruncatedAddress (no avatar)
<NumberScroller />
Animated number display where each digit rolls independently:

Copy// Props: value: number, decimals?: number
// Each digit is in its own overflow-hidden container
// When value changes, the digit column translates vertically to reveal the new digit
// Use Framer Motion animate with spring physics
<GradientAvatar />
Deterministic gradient circle:

Copy// Props: address: string, size: number
// Generates a unique 2-color gradient from the address hash
// Renders an inline SVG circle with that gradient
// Must be deterministic: same address always produces same gradient
<BurnBadge />
The flame + burn amount shown on QFPay transfers:

Copy// Props: amount: number
// Renders: 🔥 icon (SVG, 12px, #E85D25) + amount in font-mono text-xs text-white/30
<EmptyState />
Reusable empty state:

Copy// Props: icon: ReactNode, title: string, description: string
// Centered layout with faint icon, Clash Display title, Satoshi description
<PageTransition />
Wraps every page with Framer Motion AnimatePresence:

Copy// Wraps children in motion.div
// initial={{ opacity: 0, y: 8 }}
// animate={{ opacity: 1, y: 0 }}
// exit={{ opacity: 0 }}
// transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
ANIMATION SPECIFICATIONS
Every animation must use Framer Motion. NO CSS animations except the sync dot pulse.

Page transitions: fade + translateY(8→0), 200ms, ease [0.25, 0.1, 0.25, 1]
List stagger: each item delays 50ms after previous. Use variants with staggerChildren: 0.05
Number scroller digits: spring physics, { type: 'spring', stiffness: 100, damping: 20 }
Avatar on account page: scale 0.8→1 + opacity 0→1, spring, 400ms
Hover on rows: bg-white/[0.02] transition, 150ms. Subtle, barely perceptible.
Search bar focus: border color transition, 200ms
Copy button: icon swap (clipboard→checkmark) with a quick scale pulse (1→1.2→1), 200ms
Burn counter on mount: animate from 0 to final value over 2s with { type: 'tween', duration: 2, ease: 'easeOut' }
RESPONSIVE BEHAVIOR
Nav: always horizontal, never collapses to hamburger
Content: max-w-2xl on desktop, full-width on mobile with px-4
Transfer rows: on mobile, stack the sender/recipient vertically (sender on top, arrow + recipient below), with amount on the right
Leaderboard: on mobile, hide the relative bar, show rank + identity + balance only
Token directory: on mobile, each token becomes a card-style stacked layout
Burn source cards: side-by-side on desktop (grid-cols-2), stacked on mobile (grid-cols-1)
Charts: full-width within content column on all sizes
Account hero avatar: 80px on all sizes (don't shrink on mobile — it's the focal point)
KEYBOARD SHORTCUT: CMD+K SEARCH
Implement a Spotlight-style search modal:

Triggered by Cmd+K (Mac) or Ctrl+K (Windows)
Also accessible via clicking a subtle "⌘K" badge on the right side of the search bar
Opens a centered modal with a dimmed backdrop (bg-black/60 backdrop-blur-sm)
Modal: bg-[#111111] border border-white/10 rounded-2xl w-full max-w-lg mx-4 with a large input at top
Input: same styling as main search bar, auto-focused
Below input: filtered results from ACCOUNTS (match on .qf name or address substring)
Each result row: avatar + name/address, clickable, navigates to account view
Esc or clicking backdrop closes
Framer Motion: modal scales from 0.95→1 + fades in, backdrop fades in
ROUTING STRUCTURE
/                   → Home (redirects to /explorer)
/explorer           → Home / Activity Feed
/explorer/accounts  → Accounts Leaderboard
/explorer/:id       → Account View (id can be "alex.qf" or an address)
/tokens             → Token Directory
/gas                → Gas Tracker
/burn               → Burn Dashboard
Use React Router v6 with <AnimatePresence> wrapping the route outlet for page transitions.

FINAL QUALITY CHECKLIST
Before considering this done, verify:

 Background is exactly #0A0A0A everywhere. No other background color on the body/html.
 Cards/containers are exactly #111111. No other card color.
 NO shadows, NO gradients (except burn chart fill), NO heavy borders.
 All headlines use Clash Display. All body text uses Satoshi. All addresses use JetBrains Mono.
 ".qf" suffix is ALWAYS #00D179 (emerald green), NEVER any other color.
 QFPay blue (#0052FF) only appears on the burn source card border and QFPay labels.
 Burn orange (#E85D25) only appears on flame icons and burn amounts.
 Every page transition is animated with Framer Motion.
 The number scroller on the block counter actually works — digits roll when the number increments.
 The search bar placeholder cycles between the three phrases.
 Cmd+K opens the search modal.
 All transfers show the burn badge (flame icon + amount) when isQFPayTransfer is true.
 Account view shows avatar, name, balance, bio, and filtered activity.
 The leaderboard sorts 30 accounts correctly.
 The burn dashboard hero counter animates from 0 to the final value on mount.
 Mobile is pixel-perfect — no horizontal overflow, no squished elements, generous padding.
 The sync dot pulses. The block counter ticks every 6 seconds.
 Relative times show ("2 min ago", "3 hrs ago", "yesterday") not raw timestamps.
 The entire app feels like a premium fintech product, not a blockchain dev tool.
THE VISION
This is not just a blockchain explorer. This is the first explorer built for humans. Every address resolves to a name. Every transfer tells a story (who sent what to whom, and how much was burned). Every page feels intentional, considered, and beautiful. When someone shares a link to their .qf account page, the person clicking it should think "wait, this is a blockchain explorer?" — because it looks and feels like a world-class product.

The bar is Linear. The bar is Vercel. The bar is Apple. Build it to that standard.