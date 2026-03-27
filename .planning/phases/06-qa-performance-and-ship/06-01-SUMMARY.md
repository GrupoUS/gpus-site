---
phase: 06-qa-performance-and-ship
plan: 01
subsystem: ui
tags: [motion, accessibility, reduced-motion, tech-debt, framer-motion, scaleX]

# Dependency graph
requires:
  - phase: 03-visual-uplift-and-animations
    provides: Aceternity UI islands (lamp, aurora, text-generate, background-beams)
  - phase: 04-react-islands
    provides: JourneyTimeline, TestimonialCarousel, WhatsAppFloatingButton islands
provides:
  - Zero AGENTS.md violations across all React islands
  - useReducedMotion guards on lamp.tsx, text-generate-effect.tsx, background-beams.tsx
  - Clean dependency tree (framer-motion and simplex-noise removed)
  - Accurate AGENTS.md documentation (team count, motion version, directory tree)
affects: [06-02-lighthouse-audit, 06-03-ship]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "scaleX + transformOrigin pattern for width-like animations (lamp.tsx)"
    - "useReducedMotion early return with static fallback JSX"
    - "Conditional animate/transition props for reduced motion (background-beams.tsx)"

key-files:
  created: []
  modified:
    - src/components/ui/lamp.tsx
    - src/components/ui/aurora-background.tsx
    - src/components/ui/text-generate-effect.tsx
    - src/components/ui/background-beams.tsx
    - src/components/landing/NeonBio.astro
    - src/components/home/Hero.astro
    - package.json
    - AGENTS.md

key-decisions:
  - "Used scaleX with transformOrigin instead of width animation for lamp.tsx -- preserves visual effect while using GPU-composited transform"
  - "background-beams.tsx uses conditional animate/transition props (not early return) to keep static beam paths visible for decorative effect"
  - "text-generate-effect.tsx uses instant animate() call with duration:0 for reduced motion instead of early return, so existing span structure stays intact"

patterns-established:
  - "scaleX + transformOrigin: animate apparent width using transform for GPU compositing"
  - "useReducedMotion static fallback: duplicate JSX with plain divs for complex animated components"
  - "Conditional motion props: use ternary on animate/transition for components where static structure must remain"

requirements-completed: [D-05, D-06, D-07, D-08, D-09, D-15, D-17]

# Metrics
duration: 5min
completed: 2026-03-27
---

# Phase 06 Plan 01: Tech Debt Cleanup Summary

**scaleX lamp animation, useReducedMotion on 3 Aceternity islands, framer-motion/simplex-noise removed, all "use client" directives stripped, AGENTS.md corrected**

## Performance

- **Duration:** 5 min
- **Started:** 2026-03-27T00:44:02Z
- **Completed:** 2026-03-27T00:49:33Z
- **Tasks:** 2/2
- **Files modified:** 18

## Accomplishments

- lamp.tsx refactored from width animation to scaleX with transformOrigin, plus full useReducedMotion static fallback
- useReducedMotion added to text-generate-effect.tsx (instant reveal) and background-beams.tsx (static gradient positions)
- Removed framer-motion and simplex-noise from package.json (2 unused deps)
- Deleted wavy-background.tsx and moving-border.tsx (dead code, zero importers)
- Stripped "use client" from all 11 React island files (no-op in Astro, Next.js RSC artifact)
- Fixed 2 hardcoded hex values: NeonBio.astro (bg-[#fafaf9] -> bg-text-primary), Hero.astro (fill="#d4af37" -> fill="var(--color-gold)")
- Removed background-attachment:fixed from aurora-background.tsx
- Updated AGENTS.md: 13 team members, motion 12.x, removed stale contact/ directory

## Task Commits

Each task was committed atomically:

1. **Task 1: Fix lamp.tsx width animation + add useReducedMotion, remove aurora bg-attachment:fixed, fix hex values** - `1ea55d3` (fix)
2. **Task 2: Remove unused deps + dead files + "use client" directives + update AGENTS.md** - `123d7b0` (chore)

## Files Created/Modified

- `src/components/ui/lamp.tsx` - scaleX animation with useReducedMotion static fallback
- `src/components/ui/aurora-background.tsx` - Removed "use client" and background-attachment:fixed
- `src/components/ui/text-generate-effect.tsx` - Added useReducedMotion (instant reveal), removed "use client"
- `src/components/ui/background-beams.tsx` - Added useReducedMotion (conditional animate), removed "use client"
- `src/components/ui/HeroEntrance.tsx` - Removed "use client"
- `src/components/ui/LandingHeroEntrance.tsx` - Removed "use client"
- `src/components/ui/MotionReveal.tsx` - Removed "use client"
- `src/components/ui/AnimatedStats.tsx` - Removed "use client"
- `src/components/home/JourneyTimeline.tsx` - Removed "use client"
- `src/components/landing/TestimonialCarousel.tsx` - Removed "use client"
- `src/components/shared/WhatsAppFloatingButton.tsx` - Removed "use client"
- `src/components/landing/NeonBio.astro` - bg-[#fafaf9] replaced with bg-text-primary
- `src/components/home/Hero.astro` - fill="#d4af37" replaced with fill="var(--color-gold)"
- `src/components/ui/wavy-background.tsx` - **Deleted** (zero importers)
- `src/components/ui/moving-border.tsx` - **Deleted** (zero importers)
- `package.json` - Removed framer-motion and simplex-noise dependencies
- `bun.lock` - Updated lockfile
- `AGENTS.md` - Corrected team count (13), motion version (12.x), removed contact/ directory

## Decisions Made

- Used scaleX with transformOrigin instead of width animation for lamp.tsx -- preserves the visual expansion effect while using GPU-composited transform (no layout reflow)
- background-beams.tsx uses conditional animate/transition props rather than early return, keeping static beam paths visible as decorative elements even with reduced motion
- text-generate-effect.tsx uses instant `animate("span", ..., { duration: 0 })` for reduced motion rather than early return, so the existing span-based rendering structure stays intact

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Known Stubs

None - no stubs or placeholder content found.

## Next Phase Readiness

- Codebase is clean of all known AGENTS.md violations
- All 3 Aceternity UI islands (lamp, text-generate-effect, background-beams) have useReducedMotion guards
- Ready for Lighthouse audit in Plan 02 which will measure performance on a compliant codebase
- Build passes cleanly: `bun run lint && bun run build` exit 0

## Self-Check: PASSED

- All 8 modified files confirmed present
- Both deleted files confirmed absent
- Both task commits (1ea55d3, 123d7b0) found in git log
- Summary file confirmed at expected path

---
*Phase: 06-qa-performance-and-ship*
*Completed: 2026-03-27*
