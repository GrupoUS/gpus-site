---
phase: 5
slug: seo-technical-layer
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-26
---

# Phase 5 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | No unit test runner (per CLAUDE.md) |
| **Config file** | None |
| **Quick run command** | `bun run lint && bunx astro check` |
| **Full suite command** | `bun run lint && bunx astro check && bun run build` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `bun run lint && bunx astro check`
- **After every plan wave:** Run `bun run lint && bunx astro check && bun run build`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 05-01-01 | 01 | 1 | SEO-01 | build+grep | `bun run build && grep 'application/ld+json' dist/curso-auriculo/index.html` | N/A (build) | ⬜ pending |
| 05-01-02 | 01 | 1 | SEO-01 | build+grep | `bun run build && grep 'application/ld+json' dist/mentoria-black-neon/index.html` | N/A (build) | ⬜ pending |
| 05-01-03 | 01 | 1 | SEO-02 | build+grep | `bun run build && grep 'Event' dist/otb/index.html` | N/A (build) | ⬜ pending |
| 05-01-04 | 01 | 1 | SEO-04 | build+grep | `bun run build && grep -c 'BreadcrumbList' dist/termos/index.html` | N/A (build) | ⬜ pending |
| 05-02-01 | 02 | 1 | SEO-03 | file check | `ls public/og/*.png \| wc -l` (expect 9) | N/A (static) | ⬜ pending |
| 05-02-02 | 02 | 1 | SEO-03 | build+grep | `bun run build && grep 'og/' dist/sobre/index.html` | N/A (build) | ⬜ pending |
| 05-03-01 | 03 | 2 | SEO-05 | build+grep | `bun run build && grep 'priority' dist/sitemap-0.xml` | N/A (build) | ⬜ pending |
| 05-03-02 | 03 | 2 | SEO-06 | file check | `cat public/robots.txt` (expect Disallow: /404 only) | ✅ exists | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements.* No test framework needed — validation is via build success + dist/ output inspection. The project explicitly has no unit test runner (CLAUDE.md).

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| OG image visual quality | SEO-03 | SVG-to-PNG visual design quality | Open each SVG in browser, verify navy bg + gold Playfair title + Grupo US logo |
| JSON-LD rich results eligibility | SEO-01, SEO-02 | Google validation tool required | Paste built HTML into Google Rich Results Test |
| Social preview rendering | SEO-03 | External cache/rendering | Share URLs on Facebook Sharing Debugger after deploy |

*All other phase behaviors have automated verification via build output inspection.*

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
