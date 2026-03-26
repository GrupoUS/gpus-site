---
phase: 05-seo-technical-layer
plan: 01
subsystem: seo
tags: [json-ld, schema.org, structured-data, breadcrumbs, astro, landing-page]

# Dependency graph
requires:
  - phase: 04-react-islands
    provides: TestimonialCarousel.tsx React island used in new OTB landing page
provides:
  - jsonLd optional prop on Layout.astro for per-page structured data injection
  - OTB local landing page at /otb replacing redirect-only route
  - JSON-LD Course schema on curso-auriculo
  - JSON-LD Product schema on mentoria-black-neon
  - JSON-LD Event schema on OTB
  - BreadcrumbList on 7/9 internal pages
  - Optional event field in products Zod schema
affects: [05-02, 05-03, sitemap, navigation]

# Tech tracking
tech-stack:
  added: []
  patterns: [per-page JSON-LD via Layout jsonLd prop, Event schema for physical events]

key-files:
  created:
    - src/pages/otb.astro
  modified:
    - src/layouts/Layout.astro
    - src/content.config.ts
    - src/content/products/otb.json
    - src/pages/curso-auriculo.astro
    - src/pages/mentoria-black-neon.astro
    - src/pages/termos.astro
    - src/pages/politica-de-privacidade.astro
    - astro.config.mjs

key-decisions:
  - "Layout.astro jsonLd prop renders structured data in head alongside Organization and BreadcrumbList"
  - "OTB externalSiteUrl removed for local page; cta.url kept as external enrollment link"
  - "OTB uses standard landing template (no custom sections) -- event details in differentials/faqs"
  - "Event JSON-LD uses MixedEventAttendanceMode (online modules + Dubai immersion)"

patterns-established:
  - "Per-page JSON-LD: build schema object in page frontmatter, pass via jsonLd prop to Layout"
  - "Product schema extension: optional event field in Zod for event-type products"

requirements-completed: [SEO-01, SEO-02, SEO-04]

# Metrics
duration: 4min
completed: 2026-03-26
---

# Phase 5 Plan 1: SEO Structured Data + OTB Landing Summary

**Per-page JSON-LD (Course/Product/Event) on 3 product pages, OTB local landing replacing redirect, BreadcrumbList on 7/9 pages via Layout jsonLd prop**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-26T22:11:26Z
- **Completed:** 2026-03-26T22:15:24Z
- **Tasks:** 2
- **Files modified:** 9

## Accomplishments
- Layout.astro extended with jsonLd optional prop for per-page structured data injection in head
- OTB local landing page created at /otb with full 9-section landing template and Event JSON-LD
- Course JSON-LD added to curso-auriculo, Product JSON-LD added to mentoria-black-neon
- BreadcrumbList coverage expanded from 4/9 to 7/9 pages (added termos, privacidade, OTB)
- OTB redirect removed from astro.config.mjs; sitemap filter updated to include /otb
- Products Zod schema extended with optional event field for event-type products

## Task Commits

Each task was committed atomically:

1. **Task 1: Add jsonLd prop to Layout.astro + extend content schema + prepare OTB data** - `50ae21a` (feat)
2. **Task 2: Create OTB landing page + JSON-LD on all 3 product pages + breadcrumb completion + OTB cutover** - `bac8802` (feat)

## Files Created/Modified
- `src/layouts/Layout.astro` - Added jsonLd prop and conditional JSON-LD rendering in head
- `src/content.config.ts` - Added optional event Zod schema to products collection
- `src/content/products/otb.json` - Added event data, removed externalSiteUrl
- `src/pages/otb.astro` - New OTB landing page with Event JSON-LD schema
- `src/pages/curso-auriculo.astro` - Added Course JSON-LD schema
- `src/pages/mentoria-black-neon.astro` - Added Product JSON-LD schema
- `src/pages/termos.astro` - Added breadcrumbs prop
- `src/pages/politica-de-privacidade.astro` - Added breadcrumbs prop
- `astro.config.mjs` - Removed /otb redirect and sitemap filter exclusion

## Decisions Made
- Layout.astro jsonLd prop renders structured data in head alongside existing Organization and BreadcrumbList schemas
- OTB externalSiteUrl removed for local page navigation; cta.url kept as external enrollment link (https://otb.gpus.com.br/) per CTA vs navigation distinction
- OTB landing uses the standard curso-auriculo template pattern (no custom sections) since event details are already embedded in differentials[0] and faqs
- Event JSON-LD uses MixedEventAttendanceMode (online modules + Dubai in-person immersion)
- No pricing fields in any JSON-LD schema per D-04 (external checkout via Kiwify/WhatsApp)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Known Stubs
None - all data is wired from Content Collections JSON.

## Next Phase Readiness
- JSON-LD structured data foundation complete; Plan 5.2 (OG images) and Plan 5.3 (sitemap priorities + robots.txt + cleanup) can proceed
- OTB local page is now live and indexed in sitemap -- navigation links from header/footer will resolve to /otb instead of external redirect
- The ogImage="/og/otb.png" is referenced in otb.astro but the file does not yet exist in public/og/ -- Plan 5.2 will create all OG images

## Self-Check: PASSED

All 9 files verified present. Both task commits (50ae21a, bac8802) verified in git log. Build output confirms JSON-LD Course/Product/Event schemas and BreadcrumbList in expected dist/ HTML files.

---
*Phase: 05-seo-technical-layer*
*Completed: 2026-03-26*
