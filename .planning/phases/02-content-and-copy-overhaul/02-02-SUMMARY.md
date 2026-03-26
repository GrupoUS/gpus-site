---
phase: 02-content-and-copy-overhaul
plan: "02"
subsystem: content
tags: [copy, seo, content-collections, product-json, brand-voice]

# Dependency graph
requires: []
provides:
  - "All 7 product JSONs with brand-aligned copy"
  - "comunidade-us tagline with brand lema 'Se sozinho você já brilha, juntos iluminamos'"
  - "mentoria-black-neon description >=120 chars, SEO-clean, no CTA language"
  - "curso-auriculo description >=120 chars, SEO-clean, no checkout reference"
affects: [02-03-seo, product landing pages, ProductsGrid cards]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "product description field = SEO meta description (via description={d.description} in Astro pages)"
    - "description field must be >=120 chars and free of CTA language for all products"
    - "brand lema 'Se sozinho você já brilha, juntos iluminamos' belongs in comunidade-us tagline"

key-files:
  created: []
  modified:
    - src/content/products/comunidade-us.json
    - src/content/products/neon-dash.json
    - src/content/products/curso-auriculo.json
    - src/content/products/mentoria-black-neon.json

key-decisions:
  - "trintae3, otb, na-mesa-certa card fields audited and confirmed strong — no changes needed"
  - "neon-dash tagline tightened with 'olhar de dono' brand phrase for stronger brand alignment"
  - "mentoria-black-neon description had 181 chars but still contained CTA language — replaced with SEO-clean copy"
  - "curso-auriculo description replaced to remove 'botão principal' reference; CTA language preserved only in FAQ answers and helperText (acceptable per plan)"

patterns-established:
  - "Audit-first approach: read current state, assess quality, rewrite only where measurable weakness found"
  - "description field is dual-purpose: product copy + SEO meta — must work in both contexts"

requirements-completed: [COPY-02]

# Metrics
duration: 3min
completed: 2026-03-26
---

# Phase 02 Plan 02: Product Copy Audit and Rewrite Summary

**Audit-first copy review for all 7 product JSONs: brand lema in comunidade-us tagline, SEO-clean descriptions for both landing pages, and 3 redirect products confirmed strong**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-03-26T03:48:59Z
- **Completed:** 2026-03-26T03:51:35Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- Fixed the confirmed gap: `mentoria-black-neon.json` description now 204 chars with no CTA language (was 181 chars but had "Fale no WhatsApp sobre vagas e próximo ciclo")
- Fixed `curso-auriculo.json` description: removed "botão principal" checkout reference, now 219 chars clean SEO copy
- Elevated `comunidade-us.json` tagline with brand lema "Se sozinho você já brilha, juntos iluminamos" (128 chars)
- Expanded `comunidade-us.json` description from 124 to 182 chars with Dra. Sacha curadoria framing
- Tightened `neon-dash.json` tagline with "olhar de dono" brand phrase (143 chars)
- Confirmed `trintae3`, `otb`, `na-mesa-certa` card fields as strong — zero changes needed

## Task Commits

Each task was committed atomically:

1. **Task 1: Audit and rewrite redirect-only product card fields** — `f91e72a` (feat)
2. **Task 2: Audit and fix landing product copy** — `f10eb19` (feat)

**Plan metadata:** (pending — created at summary commit)

## Files Created/Modified

- `src/content/products/comunidade-us.json` — tagline with brand lema, description expanded to 182 chars
- `src/content/products/neon-dash.json` — tagline tightened with "olhar de dono"
- `src/content/products/curso-auriculo.json` — description rewritten: no CTA language (219 chars)
- `src/content/products/mentoria-black-neon.json` — description rewritten: no CTA language (204 chars)

## Decisions Made

- `trintae3`, `otb`, `na-mesa-certa` audited and confirmed strong — no changes made (D-03 audit-first principle)
- `mentoria-black-neon` description was already >=120 chars in the repo (181 chars) but still had CTA language — replaced per plan spec
- `neon-dash` tagline tightened with brand phrase as optional improvement (D-06 Claude's discretion)
- FAQ answers in `curso-auriculo.json` still reference "botão principal" and "checkout" — this is intentional and acceptable per plan ("these phrases OK in other fields if present")

## Deviations from Plan

None — plan executed exactly as written. The plan's description of mentoria-black-neon as "87 chars" was outdated (repo had 181 chars), but the fix was still necessary due to CTA language present. Applied as planned.

## Issues Encountered

None — all builds and type checks passed on first attempt.

## Known Stubs

None — all product descriptions are wired to real data and render correctly in ProductsGrid cards and SEO meta tags.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- All 7 product JSONs are now brand-aligned, SEO-clean, and Zod-valid
- `mentoria-black-neon` and `curso-auriculo` descriptions are ready to serve as proper SEO meta descriptions
- Phase 02-03 (SEO technical layer) can proceed with clean product copy as input

---
*Phase: 02-content-and-copy-overhaul*
*Completed: 2026-03-26*
