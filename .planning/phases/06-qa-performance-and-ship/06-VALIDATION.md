---
phase: 6
slug: qa-performance-and-ship
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-26
---

# Phase 6 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | No unit test runner (per CLAUDE.md) |
| **Config file** | N/A |
| **Quick run command** | `bun run lint && bunx astro check` |
| **Full suite command** | `bun run lint && bunx astro check && bun run build` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `bun run lint && bunx astro check && bun run build`
- **After every plan wave:** Full suite + grep verification checks
- **Before `/gsd:verify-work`:** Full suite green + Lighthouse script green + smoke test green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 06-01-01 | 01 | 1 | D-05 | build + grep | `bun run build && grep -rn 'width:.*rem' src/components/ui/lamp.tsx \|\| echo OK` | N/A | pending |
| 06-01-02 | 01 | 1 | D-06 | build | `bun run build` (passes without framer-motion/simplex-noise) | N/A | pending |
| 06-01-03 | 01 | 1 | D-07 | grep | `grep -rn 'bg-\[#' src/components/ \|\| echo OK` | N/A | pending |
| 06-01-04 | 01 | 1 | D-08 | grep | `grep -rn '"use client"' src/components/ \|\| echo OK` | N/A | pending |
| 06-01-05 | 01 | 1 | D-09 | manual | Read AGENTS.md team count/version | N/A | pending |
| 06-01-06 | 01 | 1 | D-15 | grep | `grep -rn 'background-attachment' src/ \|\| echo OK` | N/A | pending |
| 06-01-07 | 01 | 1 | D-17 | manual | Verify useReducedMotion in lamp/beams/text-gen | N/A | pending |
| 06-02-01 | 02 | 2 | D-04 | CI script | `node scripts/lighthouse-audit.mjs` | Wave 0 | pending |
| 06-03-01 | 03 | 2 | D-11 | CI script | `node scripts/smoke-test.mjs http://localhost:4321` | Wave 0 | pending |
| 06-03-02 | 03 | 2 | D-12 | script | `bun run lint && bunx astro check && bun run build` | Exists | pending |

*Status: pending / green / red / flaky*

---

## Wave 0 Requirements

- [ ] `scripts/lighthouse-audit.mjs` -- Lighthouse CI script (D-04)
- [ ] `scripts/smoke-test.mjs` -- Smoke test script (D-11)
- [ ] Google Chrome installation in WSL -- prerequisite for Lighthouse

*Note: No test framework to install -- project uses build gates and grep checks for validation.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| lamp.tsx visual unchanged after scaleX refactor | D-05 | Visual comparison only | Build, preview, compare lamp CTA section appearance |
| Aurora hero visual unchanged after removing fixed attachment | D-15 | Visual comparison only | Build, preview, verify aurora hero scrolls correctly |
| AGENTS.md team count and version correct | D-09 | Documentation review | Read AGENTS.md, verify team=13, motion=12.x, no contact/ note |

---

## Validation Sign-Off

- [ ] All tasks have automated verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
