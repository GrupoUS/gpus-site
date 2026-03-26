---
phase: 4
slug: react-islands-premium-interactions
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-26
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None (no unit test runner in project) |
| **Config file** | None |
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
| 04-01-01 | 01 | 1 | ISLAND-01 | build + lint | `bun run build && bun run lint` | N/A (build) | ⬜ pending |
| 04-02-01 | 02 | 1 | ISLAND-02 | build + lint | `bun run build && bun run lint` | N/A (build) | ⬜ pending |
| 04-03-01 | 03 | 2 | ISLAND-03 | build + lint | `bun run build && bun run lint` | N/A (build) | ⬜ pending |
| 04-ALL | ALL | 2 | ALL | manual a11y | Tab test + reduced motion | N/A (manual) | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. No test framework install or stub files needed — project uses build/lint validation gates only.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Reduced motion fallback renders static content | ALL | Requires OS setting toggle | Enable reduced motion in OS, reload page, verify all 3 islands show static fallback |
| Keyboard navigation through timeline nodes | ISLAND-01 | Focus/tab behavior | Tab through timeline nodes, verify focus ring visible, Enter navigates |
| Carousel drag/swipe on mobile | ISLAND-02 | Touch gesture interaction | Open DevTools mobile mode, drag carousel left/right, verify snap and autoplay resume |
| WhatsApp button doesn't overlap MobileCTABar | ISLAND-03 | Visual layout overlap check | Open landing page on mobile viewport, scroll past 500px, verify no button overlap |
| WhatsApp button per-page message | ISLAND-03 | Per-page behavior | Click floating button on different pages, verify WhatsApp message matches product context |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
