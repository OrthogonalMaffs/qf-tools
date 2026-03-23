# CLAUDE.md — QF Tools

**Last updated:** 2026-03-23
**Status:** Initial build — explorer live, token directory and gas station built, verifier and sniffer scaffolded

---

## Session Startup — Do This First, Every Session

1. Run `git status` — confirm correct branch, no unexpected uncommitted changes
2. Run `git pull` — ensure working directory is current with remote
3. Read this file before writing a single line of code

If `git pull` reports conflicts — stop immediately, report the conflict, do not attempt to resolve autonomously.

## Session End — Do This Last, Every Session

1. Test pages locally (open in browser, check API calls work)
2. Run `git status` — confirm you know exactly what changed
3. Commit with a clear descriptive message — what changed and why
4. Run `git push` — never leave with unpushed commits
5. Update this file if anything significant changed

## Who You Are

Implementation engine only. Architecture decisions come from Jon. Implement faithfully. Flag problems immediately with specific reason and concrete alternative. No unilateral redesigns.

## How to Work

- State ambiguities specifically — ask one focused question — do not assume and proceed
- Commit little and often — each commit does one thing
- When stuck — say so, state what you tried, what failed, what you think the problem is
- Do not refactor, restructure, or "improve" code unless explicitly asked
- Do not add features beyond what was requested
- Do not change styling, layout, or UX without approval
- If a change touches more than one concern — stop and discuss before proceeding
- British English in all comments and user-facing text

## What NOT to Do

- Never make sweeping changes across multiple files without asking first
- Never rewrite working code for "cleanliness" or "best practices"
- Never add dependencies without explicit approval
- Never change the API endpoint URLs without checking backend compatibility
- Never commit API keys, private keys, or sensitive configuration
- If you think something should be done differently — say so and wait for approval
- Never refer to automated checks as an "audit" — use "automated safety score" or "automated analysis"

## Project Overview

QF Tools is a suite of free community tools for QF Network, hosted on GitHub Pages.

### Tools

### Visible on site (in nav and landing page)

| Tool | Path | Status | Cost |
|------|------|--------|------|
| Explorer | `/explorer/` | Live | Free |
| Token Directory | `/tokens/` | Built | Free |
| Gas Station | `/gas/` | Built | Free |

### Hidden (built but not linked — accessible by direct URL)

| Tool | Path | Status | Cost |
|------|------|--------|------|
| Contract Verifier | `/verify/` | Scaffolded | Free |
| Token Scout | `/scout/` | Scaffolded | Free scan, paid verified badge |
| Portfolio Tracker | `/portfolio/` | Scaffolded | Free |
| Pool Explorer | `/pools/` | Scaffolded (24hr delay on new pairs) | Free |
| Revoke Approvals | `/revoke/` | Scaffolded | Small QF fee (adjustable) |
| Network Stats | `/stats/` | Scaffolded | Free |
| Validator Dashboard | `/validators/` | Scaffolded | Free |

### Long-term vision: evolve into DexScreener-style platform for QF Network

### Token Scout — Important Wording Rules

- NEVER call it an "audit" — it is an "automated analysis" or "automated contract score"
- NEVER use the word "safe" or "safety" — we provide information, not guarantees
- Free tier: basic automated checks available to everyone
- Paid tier: QF Tools Verified badge — developers pay in QF, a portion burned, remainder funds development
- A verified badge means "passed automated checks and developer staked QF" — nothing more
- Every page must include disclaimer: not a security audit, not financial advice, DYOR

### Pool Explorer — Delay Rule

- New pairs are shown only after 24 hours — this is non-negotiable
- Frame as "we verify pairs are active before listing"
- Never show cross-pool price comparisons (protects arb bot edge)

### Backend (Hetzner VM — NOT in this repo)

- Location: `ubuntu@37.27.219.31:~/qf-explorer/`
- Node.js indexer + Express API, managed by pm2
- API base: `https://qf-explorer.mathswins.co.uk/api`
- Port 3848 on the VM, exposed via Cloudflare Tunnel

### API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/stats` | Chain stats (total txs, last indexed block) |
| `GET /api/txs/:address?limit=50` | Last N transactions for an address (max 200) |
| `GET /api/txs?limit=50` | Latest transactions across all addresses |
| `GET /api/gas` | Current gas prices |
| `GET /api/tokens` | Token directory listing |
| `GET /api/health` | Health check |

## Tech Stack

- Vanilla HTML/CSS/JavaScript — no frameworks, no bundler, no build step
- Shared CSS in `/shared/styles.css`
- Shared navigation in `/shared/nav.js`
- Fetch API for backend calls
- Optional MetaMask integration via `window.ethereum`

## Infrastructure

- **Frontend hosting:** GitHub Pages (qftools.xyz)
- **Repo:** OrthogonalMaffs/qf-tools
- **Backend API:** qf-explorer.mathswins.co.uk (Hetzner VM)
- **Domain registrar:** Fasthosts (transferring to IONOS after 60 days)

## QF Network

- Chain ID: 42
- Block time: 0.1 seconds
- Native token: QF
- RPC: `https://archive.mainnet.qfnode.net/eth`

## Division of Labour

Jon owns all design, UX, architecture, and business decisions. Claude Code implements. Jon reviews and approves all changes. No autonomous redesigns, feature additions, or "improvements" — ever.
