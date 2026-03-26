---
phase: 05-seo-technical-layer
plan: 02
subsystem: seo
tags: [og-image, svg, meta-tags, open-graph, social-sharing]

# Dependency graph
requires:
  - phase: 02-content-copy-overhaul
    provides: unique page titles and descriptions for OG image copy
provides:
  - 9 SVG OG image source files in .planning/assets/og-svg/ (navy/gold brand template)
  - ogImage prop wired on all 8 existing content pages pointing to /og/{slug}.png
  - public/og/ directory ready for PNG exports
affects: [05-seo-technical-layer]

# Tech tracking
tech-stack:
  added: []
  patterns: [SVG source -> PNG export workflow for OG images, per-page ogImage prop pattern]

key-files:
  created:
    - .planning/assets/og-svg/home.svg
    - .planning/assets/og-svg/sobre.svg
    - .planning/assets/og-svg/contato.svg
    - .planning/assets/og-svg/curso-auriculo.svg
    - .planning/assets/og-svg/mentoria-black-neon.svg
    - .planning/assets/og-svg/otb.svg
    - .planning/assets/og-svg/termos.svg
    - .planning/assets/og-svg/privacidade.svg
    - .planning/assets/og-svg/404.svg
    - public/og/.gitkeep
  modified:
    - src/pages/index.astro
    - src/pages/sobre.astro
    - src/pages/contato.astro
    - src/pages/termos.astro
    - src/pages/politica-de-privacidade.astro
    - src/pages/404.astro
    - src/pages/curso-auriculo.astro
    - src/pages/mentoria-black-neon.astro

key-decisions:
  - "OTB page ogImage SVG created but page wiring deferred to Plan 01 (page does not exist yet)"
  - "mentoria-black-neon ogImage changed from d.image (product icon SVG) to /og/mentoria-black-neon.png (proper OG image)"

patterns-established:
  - "OG image SVG template: 1200x630, navy bg (#1a1a2e), gold Playfair Display title, Inter subtitle, gold accent line, Grupo US brand wordmark"
  - "Legal page variant: 48px title instead of 64px for termos/privacidade/404"
  - "Per-page ogImage prop: every content page passes ogImage=\"/og/{slug}.png\" to Layout"

requirements-completed: [SEO-03]

# Metrics
duration: 3min
completed: 2026-03-26
---

# Phase 5 Plan 02: OG Image SVGs + Per-Page ogImage Prop Wiring Summary

**9 SVG OG image source files (1200x630 navy/gold brand template) plus ogImage prop wired on all 8 content pages for per-page social media previews**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-26T22:11:17Z
- **Completed:** 2026-03-26T22:14:29Z
- **Tasks:** 3 (2 auto + 1 checkpoint auto-approved)
- **Files modified:** 18 (9 SVG created, 8 pages modified, 1 .gitkeep)

## Accomplishments
- Created 9 SVG OG image source files following the UI-SPEC visual contract: navy background, gold Playfair Display title, Inter subtitle, gold accent line, Grupo US brand wordmark
- Wired ogImage prop on all 8 existing content pages (index, sobre, contato, termos, privacidade, 404, curso-auriculo, mentoria-black-neon)
- Fixed mentoria-black-neon ogImage from `{d.image}` (product icon) to proper `/og/mentoria-black-neon.png`
- Created `public/og/.gitkeep` directory for user to place exported PNGs
- Build verified: all 8 pages emit correct `og:image` and `twitter:image` meta tags

## Task Commits

Each task was committed atomically:

1. **Task 1: Create 9 SVG OG image source files** - `f7bc6e7` (feat)
2. **Task 2: Wire ogImage prop on all content pages** - `57bfac3` (feat)
3. **Task 3: Verify OG image SVG visual quality** - auto-approved (no commit needed)

## Files Created/Modified
- `.planning/assets/og-svg/*.svg` (9 files) - SVG source templates for OG images
- `public/og/.gitkeep` - Placeholder for PNG export directory
- `src/pages/index.astro` - Added `ogImage="/og/home.png"`
- `src/pages/sobre.astro` - Added `ogImage="/og/sobre.png"`
- `src/pages/contato.astro` - Added `ogImage="/og/contato.png"`
- `src/pages/termos.astro` - Added `ogImage="/og/termos.png"`
- `src/pages/politica-de-privacidade.astro` - Added `ogImage="/og/privacidade.png"`
- `src/pages/404.astro` - Added `ogImage="/og/404.png"`
- `src/pages/curso-auriculo.astro` - Added `ogImage="/og/curso-auriculo.png"`
- `src/pages/mentoria-black-neon.astro` - Changed `ogImage={d.image}` to `ogImage="/og/mentoria-black-neon.png"`

## Decisions Made
- **OTB page ogImage deferred:** The `otb.astro` page does not exist yet (created by Plan 01). The OTB SVG source file was created, and Plan 01 will wire `ogImage="/og/otb.png"` when creating the page.
- **mentoria-black-neon ogImage replaced:** Changed from `{d.image}` (which was the product icon SVG path, not an OG image) to the proper `/og/mentoria-black-neon.png` path for consistency across all pages.
- **Unaccented SVG text:** SVG text uses unaccented characters intentionally per plan spec. Font rendering at PNG export time is what matters. User may add accents when exporting via design tool.

## Deviations from Plan

None - plan executed exactly as written.

## Known Stubs

- **public/og/*.png (9 files):** PNG files do not exist yet. User needs to export SVGs to PNG (1200x630) using Figma, Inkscape, or browser screenshot and place in `public/og/`. The ogImage prop wiring is complete and will reference the correct paths once PNGs are in place.

## Issues Encountered
None.

## User Setup Required

**PNG export from SVG source files required before deploy:**
1. Open SVG files from `.planning/assets/og-svg/` in a design tool (Figma, Inkscape, or browser)
2. Export each as PNG at 1200x630 resolution
3. Place exported PNGs in `public/og/` with matching filenames (home.png, sobre.png, etc.)
4. Fonts: Install Playfair Display + Inter locally for accurate rendering, or trace text to paths in design tool

## Next Phase Readiness
- All 8 existing content pages have ogImage prop wired and ready for per-page social media previews
- OTB page ogImage will be wired by Plan 01 when the page is created
- Once PNGs are exported to `public/og/`, the site will have full per-page OG image coverage

## Self-Check: PASSED

- All 10 created files verified on disk
- Both task commits (f7bc6e7, 57bfac3) found in git log

---
*Phase: 05-seo-technical-layer*
*Completed: 2026-03-26*
