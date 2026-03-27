---
phase: 06-qa-performance-and-ship
plan: 03
subsystem: testing
tags: [smoke-test, post-deploy, routes, redirects, sitemap, og-images, cross-browser]

# Dependency graph
requires:
  - phase: 06-qa-performance-and-ship
    provides: Plan 01 tech debt cleanup (reduced motion, unused deps)
  - phase: 05-seo-technical-layer
    provides: OG image props, sitemap priorities, JSON-LD
provides:
  - Post-deploy smoke test script (scripts/smoke-test.mjs)
  - Validation of 7 content + 2 legal routes, 4 redirects, sitemap + robots.txt, 9 OG images
  - Cross-browser audit documentation (backdrop-filter, details/summary, Framer Motion -- all safe)
  - D-10 .env.example explicitly skipped per user decision
affects: [deploy-pipeline, ci-cd]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Smoke test uses Node 22 built-in fetch (no extra deps)"
    - "Meta-refresh fallback detection for Astro SSG preview redirects"
    - "AbortController 10s timeout per request"

key-files:
  created:
    - scripts/smoke-test.mjs
  modified:
    - package.json

key-decisions:
  - "Handle Astro SSG meta-refresh redirect pages (200 with meta http-equiv=refresh) alongside real 301/302 -- preview vs production behavior difference"
  - "OG image checks included even though PNG files not yet generated (public/og/ has .gitkeep only) -- test correctly detects missing assets"
  - "Cross-browser audit confirmed safe: backdrop-filter 96%+ support with literal blur values, details/summary native HTML5, grid-template-rows:0fr NOT used, Framer Motion 12.x supports all major browsers"
  - "D-10 .env.example skipped -- contact form already has graceful fallback for missing PUBLIC_FORMSPREE_ACTION"

patterns-established:
  - "Smoke test pattern: safeFetch with AbortController timeout, colored console output, structured summary with exit code"
  - "Dual redirect detection: real HTTP 301/302 (production) OR meta-refresh HTML (Astro SSG preview)"

requirements-completed: [D-10, D-11, D-13, D-14, D-16]

# Metrics
duration: 4min
completed: 2026-03-27
---

# Phase 06 Plan 03: Smoke Test + Cross-Browser Audit Summary

**Post-deploy smoke test validating all routes, redirects, sitemap/robots.txt, OG images with dual redirect detection (301 + meta-refresh); cross-browser audit confirmed safe across backdrop-filter, details/summary, and Framer Motion**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-27T00:56:03Z
- **Completed:** 2026-03-27T01:00:36Z
- **Tasks:** 1
- **Files modified:** 2

## Accomplishments

- Created comprehensive smoke test script (378 lines) that validates 24 endpoints: 7 content routes + 2 legal routes (200), 4 redirects (301/302 or meta-refresh), 2 assets (sitemap + robots.txt), 9 OG images (200 with image/* content-type)
- Script accepts BASE_URL argument for local (`bun run smoke-test`) and production (`bun run smoke-test https://grupous.com.br`) use
- Handles Astro SSG preview behavior where redirects are served as HTML pages with `<meta http-equiv="refresh">` instead of real HTTP 301/302 redirects
- Documented cross-browser audit findings: all CSS patterns in use (backdrop-filter, details/summary, Framer Motion) are safe across modern browsers -- no code changes needed

## Task Commits

Each task was committed atomically:

1. **Task 1: Create smoke test script + wire package.json + document cross-browser audit** - `5c2d578` (feat)

## Files Created/Modified

- `scripts/smoke-test.mjs` - Post-deploy smoke test: validates content routes, redirects, assets, OG images
- `package.json` - Added `smoke-test` script entry

## Decisions Made

1. **Dual redirect detection** -- Astro SSG preview serves redirect pages as HTML with `<meta http-equiv="refresh">` (status 200), while production servers return real 301/302. The smoke test accepts both, checking for the correct target domain in either case. This ensures the test works locally and in production.

2. **OG image checks included despite missing PNGs** -- The `public/og/` directory only contains `.gitkeep` (no actual PNG files). The smoke test correctly reports these as failures, which is the intended behavior -- it detects the missing assets. When OG images are generated, the test will pass.

3. **Cross-browser audit closure (D-14, D-16)** -- Per RESEARCH.md findings:
   - `backdrop-filter`: 96%+ global support. glass-card uses literal `blur(18px)`, not CSS vars in backdrop-filter (Safari-safe). Solid gradient background provides fallback. **SAFE.**
   - `details/summary FAQ`: Native HTML5, universal browser support. **SAFE.**
   - `grid-template-rows: 0fr`: NOT used in this project (FAQ uses details/summary). **N/A.**
   - `background-attachment: fixed`: Already removed in Plan 01. **RESOLVED.**
   - `Framer Motion / motion 12.x`: Supports Chrome 64+, Firefox 78+, Safari 13.1+, Edge 79+. LazyMotion + m pattern used correctly. **SAFE.**

4. **D-10 .env.example skipped** -- Per user decision, the contact form already has a graceful fallback with clear instructions when `PUBLIC_FORMSPREE_ACTION` is not set.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Redirect checks failing in Astro preview mode**
- **Found during:** Task 1 (smoke test creation)
- **Issue:** Astro SSG preview serves redirect routes as 200 HTML pages with `<meta http-equiv="refresh">` instead of real 301/302 redirects. Initial implementation only checked for HTTP 301/302.
- **Fix:** Added fallback detection for meta-refresh HTML pages, verifying the expected domain appears in the page body.
- **Files modified:** scripts/smoke-test.mjs
- **Verification:** All 4 redirect routes pass in preview mode
- **Committed in:** 5c2d578

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Essential fix for the script to work in local development. No scope creep.

## Issues Encountered

- **OG images missing:** All 9 OG image checks fail because `public/og/` only contains `.gitkeep`. This is a pre-existing issue from Phase 5 (SVG sources created but PNG files not generated). The smoke test correctly detects this -- no action taken in this plan.

## Known Stubs

None -- no stubs introduced. The OG image failures are a pre-existing condition documented in Issues Encountered.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Smoke test ready for use in deploy pipeline: `bun run smoke-test https://grupous.com.br`
- OG images need to be generated (PNG files in `public/og/`) for the smoke test to pass fully
- All cross-browser audit items closed -- no code changes required

---
*Phase: 06-qa-performance-and-ship*
*Completed: 2026-03-27*
