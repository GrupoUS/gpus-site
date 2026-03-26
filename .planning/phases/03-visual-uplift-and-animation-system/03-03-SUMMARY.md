---
phase: 03-visual-uplift-and-animation-system
plan: 03
subsystem: ui
tags: [framer-motion, react-islands, spring-animation, count-up, LazyMotion, useReducedMotion]

# Dependency graph
requires:
  - phase: 03-visual-uplift-and-animation-system/01
    provides: CSS foundation (glass-card-bright, landing-mesh-bg, button glows, aurora navy/gold)
provides:
  - MotionReveal shared spring reveal wrapper component
  - HeroEntrance staggered spring entrance for home hero
  - LandingHeroEntrance staggered spring entrance for landing heroes
  - AnimatedStats count-up + spring reveal island for StatsSection
  - Integration of all 4 Motion islands into host Astro components
affects: [phase-03-verification, phase-06-qa]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "LazyMotion + m from motion/react-m for bundle-optimized Motion islands (4.6kb vs 34kb)"
    - "useReducedMotion() in every new Motion island for a11y compliance (D-16)"
    - "useMotionValue + animate + direct DOM updates for count-up (no React re-renders per frame)"
    - "parseStatValue() for Brazilian number format parsing (prefix, suffix, thousandsSep)"

key-files:
  created:
    - src/components/ui/MotionReveal.tsx
    - src/components/ui/HeroEntrance.tsx
    - src/components/ui/LandingHeroEntrance.tsx
    - src/components/ui/AnimatedStats.tsx
  modified:
    - src/components/home/Hero.astro
    - src/components/home/CTASection.astro
    - src/components/home/StatsSection.astro
    - src/components/landing/LandingHero.astro

key-decisions:
  - "HeroEntrance uses client:idle (above-fold); all other new islands use client:visible (below-fold)"
  - "Spring configs: Hero/Landing/Stats 200/25/1; CTA 180/22/1 (slightly softer for below-fold)"
  - "Count-up uses useMotionValue + direct DOM updates via spanRef (zero React re-renders per frame)"
  - "Stagger timing: 80ms for hero children, 60ms for stat items"
  - "data-reveal removed ONLY from 4 Motion-controlled sections (D-08/D-09 hybrid approach)"

patterns-established:
  - "LazyMotion + m pattern: all new Motion islands must use domAnimation features import and m components"
  - "Reduced motion: every new island checks useReducedMotion() and renders static fallback"
  - "Count-up parsing: parseStatValue() handles +prefix, suffix+, Brazilian dot thousands, plain numbers"

requirements-completed: [VIS-05, ADV-05]

# Metrics
duration: 6min
completed: 2026-03-26
---

# Phase 3 Plan 03: Motion Reveals & Count-Up Summary

**4 LazyMotion spring reveal islands (MotionReveal, HeroEntrance, LandingHeroEntrance, AnimatedStats) with staggered entrance animations and scroll-triggered count-up for StatsSection numbers in Brazilian format**

## Performance

- **Duration:** 6 min
- **Started:** 2026-03-26T16:32:43Z
- **Completed:** 2026-03-26T16:38:44Z
- **Tasks:** 2 of 2 auto tasks completed (Task 3 is checkpoint:human-verify -- pending)
- **Files modified:** 8

## Accomplishments
- Created 4 new React island components using LazyMotion + m pattern for optimal bundle size
- Integrated spring reveal animations into Home Hero, Home CTA, Landing Hero, and StatsSection
- Implemented scroll-triggered count-up animation for stats numbers preserving Brazilian format (+5.000, 26, 10+, 7)
- Removed data-reveal from all 4 Motion-controlled sections to avoid double-animation conflict (D-08/D-09)
- All components call useReducedMotion() for accessibility compliance (D-16)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create Motion island components** - `0953226` (feat)
2. **Task 2: Integrate Motion islands into host Astro components** - `ac274a9` (feat)
3. **Task 3: Visual verification checkpoint** - pending (checkpoint:human-verify)

## Files Created/Modified
- `src/components/ui/MotionReveal.tsx` - Shared LazyMotion spring reveal wrapper (stiffness 180, damping 22)
- `src/components/ui/HeroEntrance.tsx` - Home hero staggered spring entrance (80ms stagger)
- `src/components/ui/LandingHeroEntrance.tsx` - Landing hero staggered spring entrance (80ms stagger)
- `src/components/ui/AnimatedStats.tsx` - Stats count-up + spring reveal island with parseStatValue
- `src/components/home/Hero.astro` - Wrapped content in HeroEntrance (client:idle), removed data-reveal
- `src/components/home/CTASection.astro` - Wrapped content in MotionReveal (client:visible), removed data-reveal
- `src/components/home/StatsSection.astro` - Replaced static grid with AnimatedStats island (client:visible)
- `src/components/landing/LandingHero.astro` - Wrapped content in LandingHeroEntrance (client:visible), removed data-reveal

## Decisions Made
- Used `client:idle` for HeroEntrance (above-fold, matches existing AuroraBackground pattern) and `client:visible` for all below-fold islands
- Spring physics: Hero/Landing/Stats at 200/25/1 (stiffness/damping/mass), CTA at 180/22/1 for slightly softer feel
- Count-up uses direct DOM updates via `useMotionValue` + `spanRef.current.textContent` to avoid React re-renders per frame
- AnimatedStats outer container uses scale entrance (0.96 to 1) while individual stats use y-translate entrance with 60ms stagger
- Used string-template keys (`hero-entrance-${i}`) instead of bare index keys to satisfy Biome lint rule

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed Biome lint error for array index keys**
- **Found during:** Task 2 (integration)
- **Issue:** HeroEntrance and LandingHeroEntrance used `key={i}` which Biome flags as `noArrayIndexKey`
- **Fix:** Changed to `key={\`hero-entrance-${String(i)}\`}` and `key={\`landing-entrance-${String(i)}\`}`
- **Files modified:** src/components/ui/HeroEntrance.tsx, src/components/ui/LandingHeroEntrance.tsx
- **Verification:** `bun run lint` passes clean
- **Committed in:** ac274a9 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug fix)
**Impact on plan:** Lint compliance fix, no scope change.

## Issues Encountered
None - all validation gates (lint, astro check, build) pass.

## User Setup Required
None - no external service configuration required.

## Checkpoint Status

**Task 3 (checkpoint:human-verify) is pending.** This checkpoint requires visual verification of the complete Phase 3 visual uplift across Home page, Landing pages, mobile viewport, and reduced-motion mode. The orchestrator will present the checkpoint to the user.

## Next Phase Readiness
- All 4 Motion islands created and integrated
- Spring reveals working on Home Hero, Home CTA, StatsSection, and Landing Hero
- Count-up animation preserves Brazilian number formatting
- Reduced-motion compliance verified in all new components
- Ready for human visual verification (Task 3 checkpoint)

## Self-Check: PASSED

- All 8 created/modified files exist on disk
- Commit 0953226 (Task 1) verified in git log
- Commit ac274a9 (Task 2) verified in git log
- Validation gates: lint (0 errors), astro check (0 errors), build (complete)

---
*Phase: 03-visual-uplift-and-animation-system*
*Plan: 03*
*Completed: 2026-03-26 (auto tasks only; checkpoint pending)*
