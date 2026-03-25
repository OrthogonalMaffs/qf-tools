# QFTools — Product Specification & Design System

> The human-readable layer of QF Network.

---

## Table of Contents

1. [Identity & Positioning](#1-identity--positioning)
2. [Color System](#2-color-system)
3. [Typography](#3-typography)
4. [Design Principles](#4-design-principles)
5. [Navigation & Layout](#5-navigation--layout)
6. [Feature Set & Tiers](#6-feature-set--tiers)
7. [Page Specifications](#7-page-specifications)
   - [7.1 Home / Search](#71-home--search)
   - [7.2 Account View](#72-account-view)
   - [7.3 Burn Dashboard](#73-burn-dashboard)
   - [7.4 Token Directory](#74-token-directory)
   - [7.5 Gas Tracker](#75-gas-tracker)
   - [7.6 Accounts Leaderboard](#76-accounts-leaderboard)
   - [7.7 QNS Directory](#77-qns-directory)
8. [Global UX Patterns](#8-global-ux-patterns)
9. [Technical Context](#9-technical-context)
10. [What Makes This Different](#10-what-makes-this-different)

---

## 1. Identity & Positioning

**Product Name:** QFTools (one word, no space)

**Wordmark:** "QF" in #FFFFFF, "Tools" in rgba(255,255,255,0.5). Set in Clash Display 600.

**Tagline:** "The human-readable layer of QF Network."

**Positioning:** QFTools is the utility suite for QF Network — the place builders, curious users, and power users go to see what's happening on-chain. It is NOT a consumer dApp like QNS, QFPay, or QFLink. It is infrastructure with a face. It sits alongside those products as the neutral observation layer of the ecosystem.

**Naming Convention:** The product follows the ecosystem pattern (QNS, QFPay, QFLink, QFTools). Individual tools within QFTools do not have separate brand names — they are sections of one product: Explorer, Tokens, Gas, Burn, etc.

**Logo Mark:** To be designed. Direction: a geometric symbol communicating "lens," "window," or "clarity." Could be a stylized magnifying glass where the lens references the Q shape, or a square-bracket `[ ]` motif evoking code inspection. The mark sits on a #111111 rounded-square container for app icon usage, following the ecosystem convention.

**Philosophy:** QFTools is the stage, not the show. It displays the ecosystem's data and lets the dApp-specific colors (QNS green, QFPay blue, burn orange) provide the visual richness. The tool itself stays neutral and quiet.

---

## 2. Color System

### QFTools Own Palette (The Neutral Stage)

| Token | Value | Usage |
|---|---|---|
| `--bg-primary` | `#0A0A0A` | Page background, default surface |
| `--bg-card` | `#111111` | Cards, containers, input fields, nav elements |
| `--text-primary` | `#FFFFFF` | Headlines, primary content, interactive text |
| `--text-secondary` | `rgba(255,255,255,0.5)` | Labels, metadata, secondary information |
| `--text-tertiary` | `rgba(255,255,255,0.3)` | Timestamps, placeholders, de-emphasized data |
| `--border-default` | `rgba(255,255,255,0.05)` | Dividers, card borders, section separators |
| `--border-subtle` | `rgba(255,255,255,0.1)` | Input borders, hover states |
| `--border-focus` | `rgba(255,255,255,0.2)` | Focused input borders |

### Contextual Ecosystem Colors (Used Only When Displaying dApp-Specific Data)

| Token | Value | Source | Usage |
|---|---|---|---|
| `--qns-green` | `#00D179` | QNS (dotqf.xyz) | `.qf` suffix in names, QNS-related labels, sync status dot |
| `--qfpay-blue` | `#0052FF` | QFPay (qfpay.xyz) | QFPay transfer annotations, QFPay card border on Burn page |
| `--burn-orange` | `#E85D25` | Burn mechanic | Flame icons, burn amounts, burn chart accent |
| `--burn-gradient` | `#0A0A0A → #C13333 → #E85D25` | Burn animation | Used sparingly on the Burn Dashboard hero area if animation is warranted |

### Rules

- QFTools' own UI chrome (nav, borders, backgrounds, buttons) uses ONLY the neutral palette. No accent color in the tool's own identity.
- QNS green appears ONLY on `.qf` name suffixes and the sync status dot.
- QFPay blue appears ONLY when annotating QFPay-specific data (transfer labels, burn source cards).
- Burn orange appears ONLY on burn-related elements (flame icons, burn amounts, chart lines).
- No gradients on UI elements except the burn chart area fill and the Burn Dashboard hero if animated.
- No shadows. No borders heavier than `--border-subtle`.

---

## 3. Typography

| Role | Font | Weight | Usage |
|---|---|---|---|
| Headlines & large numbers | Clash Display | 600, 700 | Page titles, balance displays, counter numbers, section headings |
| Body & UI text | Satoshi | 400, 500, 600 | Labels, descriptions, transfer row text, nav items, metadata |
| Technical data | JetBrains Mono | 400, 500 | SS58 addresses, contract addresses, block numbers, hashes, nonce values |

**Font Sources:** Clash Display and Satoshi from [Fontshare](https://www.fontshare.com/). JetBrains Mono from [Google Fonts](https://fonts.google.com/).

### Scale

| Element | Font | Size | Weight | Color |
|---|---|---|---|---|
| Page title | Clash Display | 28px | 600 | `--text-primary` |
| Section heading | Clash Display | 18px | 600 | `--text-primary` |
| Large balance number | Clash Display | 36px | 700 | `--text-primary` |
| Burn counter (hero) | Clash Display | 48px | 700 | `--text-primary` |
| Body text | Satoshi | 14–15px | 400–500 | `--text-primary` or `--text-secondary` |
| Transfer amount | Satoshi | 15px | 600 | `--text-primary` |
| Metadata / timestamps | Satoshi | 12–13px | 400 | `--text-tertiary` |
| Stats line | Satoshi | 13px | 400 | `--text-secondary` |
| Addresses (full) | JetBrains Mono | 12px | 400 | `--text-tertiary` |
| Addresses (truncated) | JetBrains Mono | 14px | 400 | `--text-secondary` |
| "QF" unit after numbers | Satoshi | inherit | inherit | `--text-secondary` |

---

## 4. Design Principles

### From the Ecosystem (inherited, non-negotiable)

- **Full-screen, single-purpose screens.** No dashboards, no sidebars, no multi-panel layouts.
- **Dark-first.** `#0A0A0A` is the default. There is no light mode.
- **Mobile-first responsive.** Designed for phones, scales up gracefully.
- **Framer Motion on every transition.** Fade, slide, scale. Nothing appears or disappears without animation.
- **Generous whitespace.** Let the content breathe. Empty space is not wasted space.

### QFTools-Specific Principles

- **People, not hashes.** Every address attempts reverse resolution to a `.qf` name with avatar. Identity is always shown first, raw address second.
- **The 5-second rule.** A visitor should understand what they're looking at within 5 seconds of landing on any page.
- **The neutral stage.** The tool's own UI is deliberately understated so the ecosystem's data (names, burns, transfers) provides the visual interest.
- **No data density for its own sake.** This is not Etherscan. Show less, show it better. If information isn't useful to 80% of visitors, it goes behind a click or into a later tier.
- **Designed empty states.** Every section that can be empty (token list, gas chart, activity feed) has an intentionally designed empty state with an icon and explanatory text. Empty never means broken.

---

## 5. Navigation & Layout

### Content Width

- Desktop: max-width `720px`, centered horizontally. Ample negative space on both sides.
- Tablet: max-width `720px`, centered with 24px horizontal padding.
- Mobile: full-width with 16px horizontal padding.
- The narrow, focused layout is a deliberate design choice. Explorers are reading tools — wide layouts create unnecessary eye travel.

### Top Navigation Bar

- Persistent across all pages.
- Transparent background over `#0A0A0A`, with a `1px` bottom border in `--border-default`.
- **Left:** QFTools wordmark. "QF" in white, "Tools" in white/50. Clash Display 600, ~16px. Clickable, returns to home.
- **Right:** Horizontal text links — Explorer, Tokens, Gas, Burn. Satoshi 500, ~14px. Inactive items in `--text-secondary`, active item in `--text-primary` with a small dot indicator (4px circle, white) below the text.
- **Mobile:** Nav items compress into a scrollable horizontal row. No hamburger menu. The wordmark may abbreviate to just the logo mark if space is constrained.

### Page Structure

Every page follows the same vertical stack:

Copy
[Top Nav] [Stats Line — persistent, optional per page] [Page Content — varies]


No footer. No sidebar. No floating elements except the Cmd+K search modal.

---

## 6. Feature Set & Tiers

### Tier 1 — Ship Now (Core)

| Feature | URL | Description |
|---|---|---|
| **Home / Search** | `/explorer` | Search bar + live activity feed + compressed stats line |
| **Account View** | `/explorer/{name}.qf` or `/explorer/{address}` | Identity profile + balance + transaction history |
| **Token Directory** | `/tokens` | List of tokens deployed on QF Network |
| **Gas Tracker** | `/gas` | Current gas price + historical chart |

### Tier 2 — Ship Soon (Differentiators)

| Feature | URL | Description |
|---|---|---|
| **Burn Dashboard** | `/burn` | Total burned counter + source breakdown + chart + live burn feed |
| **Accounts Leaderboard** | `/explorer/accounts` | Ranked list of all funded accounts |
| **Network Pulse** | Integrated into stats line | Live block counter, time since last block, accounts, transfers |

### Tier 3 — Ship Later (Power Users & Ecosystem)

| Feature | URL | Description |
|---|---|---|
| **Contract Inspector** | `/explorer/{contract-address}` | Known contract labels, balance, interaction history |
| **Block View** | `/explorer/block/{number}` | Block details, extrinsics list, events |
| **Extrinsics Feed** | `/explorer/extrinsics` | Raw feed of all Substrate extrinsics |
| **QNS Directory** | `/names` | Browseable grid of all registered `.qf` names |

---

## 7. Page Specifications

### 7.1 Home / Search

**URL:** `/explorer`

**Purpose:** The front door. Search anything, see what's happening.

#### Stats Line
Centered, single line of text. Satoshi 400, `--text-secondary`, 13px.

Block 48,379,515 · 75 accounts · 3 transfers · Synced


- Block number ticks up in real-time with a smooth per-digit scroll animation (mechanical counter effect).
- "Synced" is preceded by a 4px pulsing green dot (`--qns-green`) — purely functional status indicator.
- Each stat separated by ` · ` (middle dot with spaces).

#### Search Bar
- Centered, full content-width.
- `#111111` background, `--border-subtle` border, 56px height, rounded-lg.
- Placeholder text cycles every 4 seconds with crossfade animation:
  - "Search a .qf name..."
  - "Search an address..."
  - "Search a block number..."
- Placeholder in Satoshi 400, `--text-tertiary`.
- On focus: border transitions to `--border-focus`.
- Enter-to-search. For `.qf` names, results can begin resolving as-you-type.
- No visible search button. Clean, input-only.
- On mobile: becomes sticky at top of viewport once user scrolls past its natural position.

#### Live Activity Feed
- Heading: "Activity" in Clash Display 600, `--text-primary`, 18px.
- Each transfer is a single row:

[Avatar 24px] sender.qf → [Avatar 24px] recipient.qf 1.00 QF Block 48,305,064 · 2 min ago


**Identity rendering rules:**
- If `.qf` name resolved: 24px circular avatar (QNS avatar or deterministic gradient from address hash) + name in Satoshi 500 `--text-primary` + ".qf" in `--qns-green`.
- If no `.qf` name: truncated SS58 address in JetBrains Mono 400, `--text-secondary`. No avatar.

**Arrow:** "→" in `--text-tertiary`, centered between sender and recipient.

**Amount:** Right-aligned. Satoshi 600, `--text-primary`. "QF" after the number in `--text-secondary`.

**Metadata:** Below the row. Satoshi 400, `--text-tertiary`, 12px. Format: "Block {number} · {relative time}".

**Row divider:** 1px line in `--border-default`.

**QFPay burn annotation:** When a transfer is identified as a QFPay transfer (associated 0.00 QF transfer to `0x...dEaD` in the same block), append after the amount: a small flame icon in `--burn-orange` and the burn amount in `--text-tertiary`. Example:

1.00 QF 🔥 0.001


**Animation:** New transfers slide in from top. Existing rows push down. Framer Motion `layoutId` transition, ~300ms. Fade + translateY(-8px → 0).

---

### 7.2 Account View

**URL:** `/explorer/{name}.qf` or `/explorer/{address}`

**Purpose:** The person page. Identity first, data second.

#### Hero Section (top ~30% of viewport)

**Avatar:** 80px circle, centered. Sources in order of priority:
1. QNS avatar (if set in text records)
2. Deterministic gradient circle generated from address hash (warm, soft gradients on dark tones)

**Name:** Below avatar. Clash Display 600, 28px. Name portion in `--text-primary`, ".qf" suffix in `--qns-green`.

**If no `.qf` name:** Show full SS58 address in JetBrains Mono 400, `--text-secondary`, 14px. This naturally communicates "unclaimed identity."

**Address line:** Below the name. Full SS58 address in JetBrains Mono 400, `--text-tertiary`, 12px. Copy icon (small clipboard SVG in `--text-tertiary`, flashes to `--text-primary` on click). Tooltip "Copied" fades in and out over 1 second.

**Bio:** If QNS profile has a bio, display below address. Satoshi 400, `--text-secondary`, 14px. Max 2 lines, ellipsis truncation.

**No-name CTA:** If the address has no `.qf` name, show a subtle line below the address: "This address doesn't have a .qf name yet. [Claim one →](https://dotqf.xyz)" in Satoshi 400, `--text-tertiary`, 12px. Link in `--qns-green`. Light ecosystem cross-promotion, not aggressive.

#### Balance Section

Centered below hero.

**Total balance:** Clash Display 700, 36px, `--text-primary`. Formatted with commas, 2 decimal places. "QF" after the number in `--text-secondary`.

**Breakdown:** Satoshi 400, `--text-secondary`, 13px. Format: "{free} free · {reserved} reserved". If reserved is 0.00, optionally omit and just show "{free} free".

**Transaction count:** Satoshi 400, `--text-tertiary`, 12px. Translate nonce to human language: "{nonce} transactions".

#### Activity Section

Heading: "Activity" in Clash Display 600, `--text-primary`, 18px.

Same row format as the home feed, but filtered to this account's transfers only. Additional context per row:

- If this account is the **sender**, the row reads: "→ {recipient}" with the arrow and amount.
- If this account is the **receiver**, the row reads: "{sender} →" with a very subtle green-tinted amount to indicate incoming (use `--qns-green` at ~20% opacity as a text tint, or simply keep it white — this is a refinement decision for implementation).

QFPay burn annotations appear as on the home page.

**Empty state:** If no activity, show: a faint clock icon in `rgba(255,255,255,0.05)` + "No activity yet" in Satoshi 400, `--text-tertiary`.

---

### 7.3 Burn Dashboard

**URL:** `/burn`

**Purpose:** A monument to QF's deflationary mechanics. The page people screenshot and share.

#### Hero Counter

Centered. Total QF burned all-time.

- Number in Clash Display 700, 48px, `--text-primary`.
- Animates in real-time as new burns occur (smooth number-scroll per digit).
- Below the number: "QF burned forever" in Satoshi 400, `--text-secondary`.

#### Source Breakdown

Two cards, side-by-side on desktop, stacked on mobile. Each card:

- Background: `#111111`. Border: `--border-default`. Rounded-lg. Padding: 24px.
- Top: small dApp logo mark (QFPay or QNS). dApp name in Satoshi 500, `--text-secondary`, 13px.
- Center: burn amount from this source. Clash Display 600, 24px, `--text-primary`.
- Bottom: mechanic description. Satoshi 400, `--text-tertiary`, 12px.
  - QFPay card: "0.1% of every transfer"
  - QNS card: "5% of every registration"
- Subtle top border accent: 2px, `--qfpay-blue` for QFPay card, `--qns-green` for QNS card. This is the one place where dApp colors appear as decorative elements in QFTools, contextually justified.

#### Burn Chart

Area chart showing cumulative QF burned over time.

- Background: transparent (sits on `#0A0A0A`).
- Line: `--burn-orange`, 2px.
- Fill: gradient from `--burn-orange` at 20% opacity to transparent.
- Axis labels: JetBrains Mono 400, `--text-tertiary`, 11px.
- Hover: tooltip with exact amount and date, `#111111` background, Satoshi 400.

#### Live Burn Feed

Heading: "Recent Burns" in Clash Display 600, `--text-primary`, 18px.

Each row:

🔥 0.001 QF burned · QFPay transfer by boobs.qf Block 48,305,064 · 2 min ago


- Flame icon in `--burn-orange`.
- Burn amount in Satoshi 600, `--text-primary`.
- Source and trigger context in Satoshi 400, `--text-secondary`.
- `.qf` names rendered with green suffix as everywhere else.
- Metadata in `--text-tertiary`, 12px.

---

### 7.4 Token Directory

**URL:** `/tokens`

#### Empty State (current)

Centered on page:
- Faint circular token icon in `rgba(255,255,255,0.05)`.
- "No tokens yet" in Clash Display 600, `--text-primary`, 20px.
- "Tokens will appear here as they're deployed on QF Network." in Satoshi 400, `--text-secondary`.

#### Populated State

Row-based list (not a card grid — rows are better for scanning data).

Each row:

TokenName SYMBOL 0xfa07...21e3 deployer.qf 1,000,000 supply ✓


- Token name: Satoshi 500, `--text-primary`.
- Symbol: Satoshi 400, `--text-secondary`.
- Contract address: JetBrains Mono 400, `--text-tertiary`, truncated.
- Deployer: resolved to `.qf` if possible (green suffix), otherwise truncated address.
- Total supply: Satoshi 400, `--text-secondary`.
- Verified badge: small checkmark icon in `--text-primary` if verified.

Disclaimer footnote at page bottom: Satoshi 400, `--text-tertiary`, 11px. Single line. Content: "Listing a token here does not constitute an endorsement. This is a directory of tokens detected on QF Network. Always DYOR."

---

### 7.5 Gas Tracker

**URL:** `/gas`

#### Empty State (current)

Centered on page:
- Faint gauge/meter icon in `rgba(255,255,255,0.05)`.
- Subtle animated sine wave: thin 1px line in `rgba(255,255,255,0.05)`, gently oscillating horizontally. Signals "alive and collecting."
- "Collecting gas data" in Clash Display 600, `--text-primary`, 20px.
- "Real-time gas prices will appear here as data accumulates." in Satoshi 400, `--text-secondary`.

#### Populated State

**Current gas price:** Clash Display 700, 36px, `--text-primary`. Displayed prominently at top.

**Historical chart:** Line chart of gas price over time. Same styling approach as burn chart but with a neutral white/20 line instead of burn orange.

**Cost estimates (contextual, ecosystem-aware):**
Below the chart, a small section:
- "Send QF via QFPay: ~{X} gas" 
- "Register a .qf name: ~{X} gas"
In Satoshi 400, `--text-secondary`. Ties the abstract gas number to real-world actions on QF Network.

---

### 7.6 Accounts Leaderboard

**URL:** `/explorer/accounts`

**Tier:** 2 (Ship Soon)

Heading: "Accounts" in Clash Display 600, `--text-primary`, 28px.

**Sort controls:** Subtle toggle buttons at top. Options: "Total Balance" | "Free Balance" | "Transactions". Satoshi 500, 13px. Active toggle in `--text-primary`, inactive in `--text-tertiary`. No heavy button styling — just text with a subtle underline on active.

Each row:

#1 [Avatar 32px] hardwired.qf 14,040.00 QF ████████████████ #2 [Avatar 32px] deployer.qf 49.09 QF ██ #3 5GsUbAaQ5Z...Qznr9h3g 52.93 QF ██


- Rank: JetBrains Mono 400, `--text-tertiary`.
- Identity: avatar + `.qf` name (green suffix) or truncated address.
- Balance: Satoshi 600, `--text-primary`, right-aligned.
- Relative bar: a thin horizontal bar (4px tall, white at 10% opacity) showing proportion of this account's balance vs. the largest account. Simple, scannable.

---

### 7.7 QNS Directory

**URL:** `/names`

**Tier:** 3 (Ship Later)

Heading: "Names" in Clash Display 600, `--text-primary`, 28px.
Subheading: "Everyone on QF Network" in Satoshi 400, `--text-secondary`.

Grid layout: 2 columns on mobile, 3 on tablet, 4 on desktop.

Each card:
- `#111111` background, `--border-default` border, rounded-lg.
- Avatar: 48px circle, centered at top of card.
- Name: Satoshi 500, `--text-primary` + ".qf" in `--qns-green`. Centered.
- Bio preview: Satoshi 400, `--text-tertiary`, 12px. 1 line, truncated. Centered.
- Click navigates to Account View.

---

## 8. Global UX Patterns

### Transitions

- **Route changes:** Framer Motion crossfade. Outgoing page: opacity 1→0 over 150ms. Incoming page: opacity 0→1 + translateY(8px→0) over 200ms. Easing: `[0.25, 0.1, 0.25, 1]`.
- **List items:** New items in feeds use `layoutId` animations. Existing items reposition smoothly. ~300ms duration.
- **Number changes:** Block counter, burn counter, balance displays use per-digit scroll animation (each digit column rolls independently).
- **Hover states:** Subtle opacity or background transitions, 150ms. No transforms (no scale, no lift). Keep it flat and controlled.

### Loading States

- **Never use spinners.** All loading states are skeleton screens.
- Skeleton rectangles: `#111111` on `#0A0A0A`, matching the exact layout dimensions of the content they replace.
- Shimmer effect: a `rgba(255,255,255,0.03)` gradient sweeps left-to-right across the skeleton surface every 1.5 seconds.
- When data loads, content fades in with opacity 0→1 over 200ms. No layout shift.

### Empty States

Every section that can have no data has a designed empty state:

- A faint thematic icon in `rgba(255,255,255,0.05)` (large, centered).
- A primary message in Clash Display 600, `--text-primary`.
- A supporting message in Satoshi 400, `--text-secondary`.
- Optionally, a subtle animation (sine wave for gas, gentle pulse for others).
- Empty states must never feel like errors. They communicate "not yet" rather than "something is wrong."

### Keyboard Shortcuts

- **Cmd/Ctrl + K:** Opens a quick-search modal (Spotlight/Linear style).
  - Centered floating input over a dimmed backdrop (`rgba(0,0,0,0.6)`).
  - Input field: `#111111`, white text, same styling as main search.
  - Results appear below the input as-you-type.
  - Enter navigates to the selected result. Esc closes.
  - This is a power-user feature for repeated, rapid lookups.

### Sound Design

- **Scope:** Minimal. Explorers are tools people keep open in background tabs.
- **Default:** Sound OFF. Togglable via a small speaker icon in the nav bar.
- **Events with sound:**
  - Copying an address: soft click/tick.
  - New transfer appearing in live feed: very subtle chime (only when tab is in focus).
- **No sound on:** page transitions, search, hover, navigation. These happen too frequently.
- **Quality bar:** Same tier as QNS and QFPay — subtle, satisfying, never intrusive.

### OG Images (Dynamic)

Every Account View URL generates a dynamic OG image for social sharing.

**URL:** `qftools.xyz/explorer/boobs.qf` → generates an OG card showing:
- Dark background (`#0A0A0A`).
- Avatar (80px).
- `.qf` name in Clash Display with green suffix.
- Balance in Satoshi.
- Small QFTools wordmark at bottom.

**Implementation:** Edge-based OG generation (e.g., `@vercel/og` or `satori`).

**Purpose:** Every share of an account page becomes ecosystem visibility. People sharing their QF profile on Twitter/Discord/Telegram get a beautiful, branded preview card.

### PWA

- **Manifest:** `theme_color: #0A0A0A`, `background_color: #0A0A0A`, `display: standalone`.
- **App name:** "QFTools".
- **Icon:** QFTools logo mark on `#111111` rounded-square.
- **Goal:** Installing QFTools on mobile should produce an experience indistinguishable from a native app.

---

## 9. Technical Context

### Chain

- **Type:** Substrate-based blockchain using `pallet-revive` with PolkaVM.
- **Smart contracts:** Solidity, compiled via `resolc`.
- **Native token:** QF.
- **RPC (Substrate):** `wss://mainnet.qfnode.net`
- **RPC (ETH-compatible):** `https://archive.mainnet.qfnode.net/eth`

### APIs

- **Substrate queries:** `polkadot-api` (PAPI) or legacy `@polkadot/api`.
- **ABI encoding:** `viem`.
- **Blockchain reads:** `typedApi.apis.ReviveApi.call()`
- **Blockchain writes:** `typedApi.tx.Revive.call().signAndSubmit()`

### Key Contract Addresses

| Contract | Address |
|---|---|
| QNS Registry | `0x595888...` |
| QNS Resolver | `0xd78e5b...` |
| QNS Registrar | `0xe65856...` |
| QFPay Router | `0xfa0756c626bd7d91a14292aa99326a48b3e921e3` |
| Burn Address | `0x000000000000000000000000000000000000dEaD` |

### QNS Reverse Resolution

- To display `.qf` names throughout the explorer, perform reverse resolution against QNS contracts for every address encountered.
- Cache resolved names client-side to avoid redundant lookups.
- Show avatars by reading the `avatar` text record from the QNS Resolver for resolved names.

### QFPay Transfer Detection

- QFPay transfers are identifiable by the presence of a 0.00 QF transfer to the burn address (`0x...dEaD`) in the same block as the main transfer, originating from the QFPay Router contract.
- The intended amount, burn amount (0.1% of intended), and net received amount can be derived from the pair of transfers.
- The explorer should label these distinctly with the flame icon and QFPay attribution.

### Tech Stack (Existing / Recommended)

| Layer | Technology |
|---|---|
| Framework | React + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| State | Zustand (consistent with QFPay) |
| Blockchain | polkadot-api (PAPI) |
| ABI | viem |
| OG Images | @vercel/og or satori |
| Fonts | Fontshare (Clash Display, Satoshi), Google Fonts (JetBrains Mono) |

---

## 10. What Makes This Different

### 1. People, Not Hashes

Every address in the explorer attempts reverse resolution to a `.qf` name with avatar. The visual hierarchy puts human identity first and raw addresses second. The color treatment — name in white, ".qf" in emerald green — creates a consistent, branded way to display human identities on-chain. When an address has no `.qf` name, it appears visually diminished (truncated, monospace, lower opacity), which naturally incentivizes QNS adoption without any explicit marketing.

QFTools is the first blockchain explorer where the default display is names, not hex. This is only possible because QF Network has a native name service with meaningful adoption from day one.

### 2. Burn-Aware by Default

No other explorer surfaces deflationary mechanics because no other chain has them coordinated across multiple dApps. QF's dual-burn model (0.1% on QFPay transfers, 5% on QNS registrations) is a unique economic feature that the explorer makes visible and shareable.

The flame icon on QFPay transfers, the dedicated Burn Dashboard with a live counter, and the source breakdown turn a technical mechanic into a cultural artifact. The Burn Dashboard is designed to be the page people screenshot — the "ultrasound.money" of QF.

### 3. The Stage, Not the Show

QFTools uses a deliberately neutral visual identity. Its own UI chrome has no accent color — just whites, grays, and the near-black backgrounds. The ecosystem's data provides the color: QNS green for identities, QFPay blue for payment annotations, burn orange for deflationary events. The tool is the lens. The chain is the subject.

This design philosophy means QFTools will never visually clash with the other dApps. As new dApps launch with their own accent colors, the explorer will naturally incorporate them as contextual data colors without any redesign needed.

---

*This document is the source of truth for QFTools product development. All design decisions, component implementations, and feature prioritization should reference this spec.*