# Phase 6: QA, Performance & Ship - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-26
**Phase:** 06-qa-performance-and-ship
**Areas discussed:** Lighthouse audit scope, Technical debt cleanup, Deploy & smoke test, Cross-browser scope

---

## Lighthouse Audit Scope

### Pages to Audit

| Option | Description | Selected |
|--------|-------------|----------|
| Core 4 | Home + curso-auriculo + mentoria-black-neon + contato | |
| All 9 content pages | Home + sobre + all 5 landings + contato + OTB | ✓ |
| Home + 1 landing + contato | Minimal representative set | |

**User's choice:** All 9 content pages
**Notes:** Comprehensive audit across every content page.

### Score Targets

| Option | Description | Selected |
|--------|-------------|----------|
| >= 95 all categories | Performance, A11y, Best Practices, SEO all >= 95 | ✓ |
| >= 95 Perf + SEO, >= 90 A11y + BP | Strict on main differentiators, relaxed elsewhere | |
| >= 90 across the board | Solid baseline with trade-off room | |

**User's choice:** >= 95 all categories
**Notes:** None

### Fallback for Heavy Pages

| Option | Description | Selected |
|--------|-------------|----------|
| Optimize until 95 | Aggressively optimize, accept 90 only if no further optimization possible | ✓ |
| Accept 90 for heavy pages | Home gets 90 floor, others target 95 | |
| You decide | Claude optimizes and documents shortfalls | |

**User's choice:** Optimize until 95
**Notes:** None

### Audit Method

| Option | Description | Selected |
|--------|-------------|----------|
| Manual + documented | Run Lighthouse CLI locally, capture scores in markdown | |
| CI script with threshold | Bun script running Lighthouse CLI, fails if < 95 | ✓ |
| You decide | Claude picks approach | |

**User's choice:** CI script with threshold
**Notes:** Reusable for future deploys.

---

## Technical Debt Cleanup

### Items to Fix (multi-select)

| Option | Description | Selected |
|--------|-------------|----------|
| lamp.tsx width animation (HIGH) | Refactor width anim to transform | ✓ |
| Unused deps + components | Remove framer-motion, wavy-background, moving-border, simplex-noise | ✓ |
| Hardcoded hex + "use client" | Fix 2 hex values, remove 6 "use client" no-ops | ✓ |
| AGENTS.md stale info | Update team count, FM version, contact/ note | ✓ |

**User's choice:** All 4 items selected
**Notes:** Full cleanup pass.

### .env.example

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, add .env.example | Create root .env.example with PUBLIC_FORMSPREE_ACTION | |
| Skip | Contact form already has graceful fallback | ✓ |

**User's choice:** Skip
**Notes:** Graceful degradation already in place.

---

## Deploy & Smoke Test

### Smoke Test Coverage

| Option | Description | Selected |
|--------|-------------|----------|
| Full checklist | All 9 routes, 4 redirects, WhatsApp, form, OG images, sitemap, robots.txt | ✓ |
| Routes + redirects only | Verify 13 routes resolve, skip asset verification | |
| You decide | Claude builds practical checklist | |

**User's choice:** Full checklist
**Notes:** None

### Smoke Test Automation

| Option | Description | Selected |
|--------|-------------|----------|
| Automated script | Bun script curling routes, checking status codes, verifying redirects | ✓ |
| Manual checklist in markdown | Markdown checklist to tick off in browser | |
| Both | Automated for routes + manual for visual regressions | |

**User's choice:** Automated script
**Notes:** Reusable for future deploys.

### Pre-Deploy Gate

| Option | Description | Selected |
|--------|-------------|----------|
| Lint + check + build + Lighthouse CI | Existing gates plus Lighthouse CI must pass | ✓ |
| Existing gates only | lint + check + build, Lighthouse post-deploy only | |
| You decide | Claude picks gate chain | |

**User's choice:** Lint + check + build + Lighthouse CI
**Notes:** None

---

## Cross-Browser Scope

### Verification Method

| Option | Description | Selected |
|--------|-------------|----------|
| Code audit only | Audit CSS for known cross-browser issues, fix what's found | ✓ |
| Playwright headless checks | Headless Chromium/Firefox screenshots (~200MB dep) | |
| Manual after deploy | Check live URL in real browsers | |

**User's choice:** Code audit only
**Notes:** SSG + standard CSS inherently cross-browser safe.

### Known Issues + Scope

| Option | Description | Selected |
|--------|-------------|----------|
| Fix known issues | background-attachment:fixed, backdrop-filter fallback, grid 0fr accordion | |
| Fix + audit all islands | Above + audit all 14 React islands for hydration and FM browser compat | ✓ |
| You decide | Claude audits what's risky | |

**User's choice:** Fix + audit all islands
**Notes:** None

---

## Claude's Discretion

- Lighthouse CI script implementation details
- Smoke test script implementation
- lamp.tsx transform approach
- Tailwind token for NeonBio hex replacement
- Spotlight fill CSS variable approach
- Plan ordering

## Deferred Ideas

None — discussion stayed within phase scope.
