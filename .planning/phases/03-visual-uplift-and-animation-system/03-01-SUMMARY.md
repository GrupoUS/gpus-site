---
phase: 03-visual-uplift-and-animation-system
plan: 01
subsystem: ui
tags: [css, tailwind-v4, aurora, glassmorphism, animation, mesh-gradient]

# Dependency graph
requires:
  - phase: 02-content-and-copy-overhaul
    provides: "Content Collections with product/team data, copy ready for visual enhancement"
provides:
  - "glass-card-bright utility for CTA conversion sections"
  - "landing-mesh-bg animated mesh gradient for landing hero backgrounds"
  - "mesh-drift keyframe (20s cycle with mobile/reduced-motion fallbacks)"
  - "Navy/gold aurora hero replacing Aceternity blue/indigo defaults"
  - "Hover glow box-shadows on all 4 Button variants"
  - "data-glow-card mousemove radial gradient CSS foundation"
  - "Refined glass-card with stronger gold tint (14%) and outer glow"
affects: [03-02, 03-03, 04-react-islands]

# Tech tracking
tech-stack:
  added: []
  patterns: ["@utility for reusable CSS effects", "CSS-only mesh gradient animation with mobile disable", "Tailwind v4 arbitrary shadow syntax for variant-specific glow"]

key-files:
  created: []
  modified:
    - src/components/ui/aurora-background.tsx
    - src/styles/global.css
    - src/components/shared/Button.astro
    - src/components/landing/LandingHero.astro
    - src/components/landing/LandingCTA.astro
    - src/components/home/CTASection.astro

key-decisions:
  - "Removed invert filter trick from aurora (site is always dark, no light mode)"
  - "Used Tailwind v4 arbitrary shadow syntax hover:shadow-[...] for button glow instead of separate utility classes"
  - "Kept glass-card border at 20% gold (no shimmer) per D-07 decision"

patterns-established:
  - "glass-card-bright: higher-intensity glass-card reserved for CTA conversion sections only"
  - "landing-mesh-bg: animated mesh background for landing hero sections, disabled on mobile via existing @media pattern"
  - "data-glow-card: CSS-only mousemove radial gradient foundation (JS handler added by Plan 02)"

requirements-completed: [VIS-01, VIS-02, VIS-03, VIS-06]

# Metrics
duration: 15min
completed: 2026-03-26
---

# Phase 3 Plan 01: CSS Foundation Summary

**Navy/gold aurora hero, animated mesh gradient for landing heroes, glass-card-bright CTA variant, and consistent button hover glows across all 4 variants**

## Performance

- **Duration:** 15 min
- **Started:** 2026-03-26T16:09:22Z
- **Completed:** 2026-03-26T16:24:58Z
- **Tasks:** 3
- **Files modified:** 6

## Accomplishments
- Aurora background now renders navy/gold brand gradient instead of Aceternity default blue/indigo, with all dark: class prefixes and invert filter removed
- New CSS utilities (glass-card-bright, landing-mesh-bg, data-glow-card) and mesh-drift keyframe established as the visual foundation for Phase 3
- CTA sections (home + landing) upgraded with glass-card-bright for stronger gold glow at conversion moments
- All 4 Button variants now have consistent hover glow shadows (outline/gold, ghost/gold, whatsapp/green)

## Task Commits

Each task was committed atomically:

1. **Task 1: Aurora navy/gold color customization (VIS-01)** - `19d7033` (feat)
2. **Task 2: CSS utilities and keyframes in global.css (VIS-02, VIS-03, VIS-06)** - `37a3126` (feat)
3. **Task 3: Apply CSS classes to Button, LandingHero, LandingCTA, CTASection** - `35fb363` (feat)

## Files Created/Modified
- `src/components/ui/aurora-background.tsx` - Replaced blue/indigo gradient with navy/gold tokens, removed dark: prefixes and invert filter
- `src/styles/global.css` - Added glass-card-bright utility, mesh-drift keyframe, landing-mesh-bg utility, data-glow-card styles; refined glass-card gold tint 12%->14% with outer glow
- `src/components/shared/Button.astro` - Added hover glow box-shadows to outline, ghost, and whatsapp variants
- `src/components/landing/LandingHero.astro` - Replaced static radial blur blobs with animated landing-mesh-bg utility
- `src/components/landing/LandingCTA.astro` - Added glass-card-bright with rounded-2xl padding to inner content div
- `src/components/home/CTASection.astro` - Added glass-card-bright with rounded-2xl padding to inner content div

## Decisions Made
- Removed the invert filter trick from aurora-background.tsx entirely. The original Aceternity component used invert to work in both light and dark modes. Since the site is always dark navy, the invert is unnecessary and was producing washed-out colors.
- Used Tailwind v4 arbitrary shadow syntax `hover:shadow-[...]` with `color-mix()` for button variant glows instead of creating separate utility classes in global.css. This keeps the glow values co-located with their variants and the build confirmed Tailwind v4 processes them correctly.
- Kept glass-card border at 20% gold per D-07 (no animated shimmer) -- shimmer is deferred.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- Biome formatter required multi-line formatting for `background-position` and `background-size` shorthand values in the mesh-drift keyframe. Auto-fixed with `bun run lint:fix`.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- CSS foundation is complete: glass-card-bright, landing-mesh-bg, mesh-drift, data-glow-card styles are all available for Plan 02 (micro-interactions) and Plan 03 (Motion reveals)
- ProductsGrid cards can now receive `data-glow-card` attribute (Plan 02 Task: mousemove glow script)
- Framer Motion spring reveals (Plan 03) can be layered on top of existing CSS utilities without conflicts
- All validation gates pass: lint, astro check, build

## Self-Check: PASSED

All 7 modified/created files verified present. All 3 task commits (19d7033, 37a3126, 35fb363) verified in git history.

---
*Phase: 03-visual-uplift-and-animation-system*
*Completed: 2026-03-26*
