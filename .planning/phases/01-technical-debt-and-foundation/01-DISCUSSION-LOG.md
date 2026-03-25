# Phase 1: Technical Debt & Foundation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-25
**Phase:** 01-technical-debt-and-foundation
**Areas discussed:** Pre-existing items status, View Transitions behavior

---

## Pre-existing Items Status

| Option | Description | Selected |
|--------|-------------|----------|
| Mark as done, skip in plans | Plans focus only on TECH-01 and TECH-03 | |
| Include verification tasks | Plans include verify-only tasks for TECH-02/04/05 | |
| Review and potentially enhance | Read current impl of each, add enhancement tasks if needed | ✓ |

**User's choice:** Review and potentially enhance

**Follow-up — Favicon color:**

| Option | Description | Selected |
|--------|-------------|----------|
| Yes — align to #d4af37 | One-line SVG color fix to match brand token | ✓ |
| No — leave as-is | Favicon is close enough at small sizes | |

**Notes:** Scout found `public/favicon.svg` uses `#C9A96E` for stroke/fill colors; brand design system uses `#d4af37` (gold token). User confirmed fix.

---

## View Transitions Behavior

**Q1 — ClientRouter configuration:**

| Option | Description | Selected |
|--------|-------------|----------|
| Astro defaults — just add the import | `import { ClientRouter } from 'astro:transitions'` and `<ClientRouter />` in head | ✓ |
| Custom fallback behavior | Add `fallback="none"` or `fallback="swap"` | |
| Custom animation style | Use `transition:animate` on key layout elements | |

**User's choice:** Astro defaults — just add the import

**Q2 — Element-level transition:name directives:**

| Option | Description | Selected |
|--------|-------------|----------|
| No — keep it simple | Just ClientRouter globally | ✓ |
| Yes — header + logo | Add transition:name to Header/Logo | |

**User's choice:** No — keep it simple. Visual polish with transition:name deferred to Phase 3.

---

## Claude's Discretion

- Order of debug removal across 5 files
- Whether TECH-02/04 verify tasks are standalone plans or sub-tasks within Plan 1.3

## Deferred Ideas

None surfaced during discussion.
