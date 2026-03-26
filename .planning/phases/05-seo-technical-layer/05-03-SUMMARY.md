---
phase: 05-seo-technical-layer
plan: 03
subsystem: seo
tags: [sitemap, robots.txt, dead-code-cleanup, astro-sitemap]

requires:
  - phase: 05-01
    provides: OTB landing page exists for sitemap priority assignment
provides:
  - Sitemap with per-page priorities and changefreq
  - Corrected robots.txt disallowing only /404
  - Deprecated JourneyTimeline.astro and Testimonials.astro removed
affects: []

tech-stack:
  added: []
  patterns:
    - "@astrojs/sitemap serialize callback for per-page priority/changefreq"

key-files:
  created: []
  modified:
    - astro.config.mjs
    - public/robots.txt
  deleted:
    - src/components/home/JourneyTimeline.astro
    - src/components/landing/Testimonials.astro

key-decisions:
  - "Used plain string literals for changefreq instead of importing ChangeFreqEnum — simpler and avoids TypeScript type compatibility issues"

patterns-established:
  - "Sitemap serialize callback: URL-keyed config map for priority/changefreq assignment"

requirements-completed: [SEO-05, SEO-06]

duration: 5min
completed: 2026-03-26
---

# Plan 05-03: Sitemap Priorities + Robots.txt + Cleanup Summary

**Sitemap with per-page priorities (1.0/0.9/0.7/0.3) and changefreq, robots.txt fixed to disallow only /404, deprecated .astro components removed**

## Performance

- **Duration:** 5 min
- **Started:** 2026-03-26T20:30:00Z
- **Completed:** 2026-03-26T20:35:00Z
- **Tasks:** 2
- **Files modified:** 4 (1 modified, 1 rewritten, 2 deleted)

## Accomplishments
- Sitemap now includes priority and changefreq for all 8 indexed pages
- robots.txt corrected — legal pages (/termos, /politica-de-privacidade) no longer blocked
- Deprecated JourneyTimeline.astro and Testimonials.astro removed (zero importers confirmed)

## Task Commits

1. **Task 1: Sitemap serialize callback** - `34d0321` (feat)
2. **Task 2: Fix robots.txt + remove deprecated components** - `1bb87b1` (feat)

## Files Created/Modified
- `astro.config.mjs` - Added serialize callback with per-page priority/changefreq config map
- `public/robots.txt` - Disallow /404 only, removed incorrect /termos and /politica-de-privacidade blocks
- `src/components/home/JourneyTimeline.astro` - Deleted (replaced by JourneyTimeline.tsx in Phase 4)
- `src/components/landing/Testimonials.astro` - Deleted (replaced by TestimonialCarousel.tsx in Phase 4)

## Decisions Made
- Used plain string literals ("weekly", "monthly", "yearly") for changefreq values instead of importing ChangeFreqEnum — simpler and avoids TypeScript enum compatibility issues with the @astrojs/sitemap types

## Deviations from Plan
None - plan executed exactly as written

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All SEO-05 and SEO-06 requirements complete
- Sitemap verified in build output (dist/sitemap-0.xml)
- Build passes with 78 files checked, 0 errors

---
*Phase: 05-seo-technical-layer*
*Completed: 2026-03-26*
