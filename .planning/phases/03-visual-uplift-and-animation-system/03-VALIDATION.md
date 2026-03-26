---
phase: 3
slug: visual-uplift-and-animation-system
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-26
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None (no unit test runner — validation via lint, type check, build) |
| **Config file** | `biome.json` (lint), `tsconfig.json` (type check) |
| **Quick run command** | `bun run lint && bunx astro check` |
| **Full suite command** | `bun run lint && bunx astro check && bun run build` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `bun run lint && bunx astro check`
- **After every plan wave:** Run `bun run lint && bunx astro check && bun run build`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 03-01-01 | 01 | 1 | VIS-01 | Build + grep | `grep 'color-gold' src/components/ui/aurora-background.tsx && bun run build` | N/A | ⬜ pending |
| 03-01-02 | 01 | 1 | VIS-03 | Build + grep | `grep 'glass-card-bright' src/styles/global.css && bun run build` | N/A | ⬜ pending |
| 03-01-03 | 01 | 1 | VIS-06 | Build + grep | `grep 'box-shadow' src/components/shared/Button.astro && bun run build` | N/A | ⬜ pending |
| 03-01-04 | 01 | 1 | VIS-02 | Build + grep | `grep 'mesh-drift' src/styles/global.css && bun run build` | N/A | ⬜ pending |
| 03-02-01 | 02 | 2 | VIS-04 | Build + grep | `grep 'data-glow-card' src/components/home/ProductsGrid.astro && bun run build` | N/A | ⬜ pending |
| 03-02-02 | 02 | 2 | VIS-05 | Build + type check | `bunx astro check && bun run build` | N/A | ⬜ pending |
| 03-02-03 | 02 | 2 | ADV-05 | Build + type check | `bunx astro check && bun run build` | N/A | ⬜ pending |
| 03-02-04 | 02 | 2 | D-14 | Build + grep | `grep 'transition' src/components/layout/Header.astro && bun run build` | N/A | ⬜ pending |
| 03-03-01 | 03 | 3 | D-16 | Code grep | `grep -r 'useReducedMotion' src/components/ui/MotionReveal.tsx src/components/ui/AnimatedStats.tsx` | N/A | ⬜ pending |
| 03-03-02 | 03 | 3 | D-15 | Full build | `bun run lint && bunx astro check && bun run build` | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements.* No test framework to install — validation relies on lint (Biome + oxlint), type check (`bunx astro check`), and build (`bun run build`).

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Aurora appears navy/gold, not blue/indigo | VIS-01 | Visual color verification | Open home page, verify aurora has gold/navy tones |
| Mesh gradient animates slowly on landing heroes | VIS-02 | Animation timing visual check | Open any landing page, verify ~20s gradient cycle |
| Mousemove glow follows cursor on ProductsGrid | VIS-04 | Pointer interaction | Hover over product cards on home page, verify gold glow follows mouse |
| Count-up animates from 0 to target value | ADV-05 | Scroll-triggered visual | Scroll to StatsSection, verify numbers count up |
| Mobile menu slides down with transition | D-14 | Mobile interaction | Open mobile menu, verify slide-down + fade animation |
| Lighthouse Performance >= 90 | D-15 | No local Chrome for Lighthouse | Run Lighthouse via PageSpeed Insights after deploy |
| `prefers-reduced-motion` disables all new animations | D-16 | OS setting toggle | Enable reduced-motion in OS, verify static rendering |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
