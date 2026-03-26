---
phase: 04-react-islands-premium-interactions
plan: 01
subsystem: ui
tags: [react, framer-motion, motion, carousel, timeline, islands, astro]

# Dependency graph
requires:
  - phase: 03-visual-uplift-animation-system
    provides: LazyMotion + m pattern, useReducedMotion convention, spring configs, glass-card utility
provides:
  - JourneyTimeline.tsx -- animated 5-node journey timeline with scroll-linked progress line
  - TestimonialCarousel.tsx -- drag carousel with autoplay, dot indicators, responsive card count
  - All 3 consuming pages wired with client:visible
affects: [04-02-PLAN, phase-06-qa]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "useScroll + useTransform + useSpring for scroll-linked scaleY animation"
    - "Motion drag='x' carousel with dragDirectionLock and dragElastic"
    - "IntersectionObserver for mobile scroll-snap dot tracking"
    - "ResizeObserver for responsive slide width measurement"
    - "Autoplay with useRef interval ID and functional setState"

key-files:
  created:
    - src/components/home/JourneyTimeline.tsx
    - src/components/landing/TestimonialCarousel.tsx
  modified:
    - src/pages/index.astro
    - src/pages/curso-auriculo.astro
    - src/pages/mentoria-black-neon.astro

key-decisions:
  - "Used <section> instead of <div role='region'> for carousel container -- Biome a11y lint requires semantic elements over role attributes"
  - "Removed separate CTA buttons and 'Ver pagina do programa' link from timeline nodes -- clickable node card replaces secondary CTAs (per RESEARCH.md discretion recommendation)"
  - "Lucide icon map with 5 specific imports (Ear, Users, GraduationCap, Rocket, Globe) -- no dynamic import, direct icon map lookup"
  - "canonicalJourney data moved from JourneyTimeline.astro frontmatter into index.astro frontmatter -- React component receives pre-computed props only"

patterns-established:
  - "Data preparation in Astro page frontmatter, not in React islands -- getCollection unavailable in React"
  - "Autoplay timer cleanup: useRef for interval ID, clearInterval on unmount/hover/drag, 8s delayed resume"
  - "Mobile scroll-snap with IntersectionObserver dot tracking (no drag on mobile timeline)"

requirements-completed: [ISLAND-01, ISLAND-02]

# Metrics
duration: 7min
completed: 2026-03-26
---

# Phase 04 Plan 01: JourneyTimeline + TestimonialCarousel Summary

**Animated 5-node journey timeline with scroll-linked gold progress line (desktop) / scroll-snap carousel (mobile), plus drag testimonial carousel with 4s autoplay and responsive 1/2/3-card layout -- both using LazyMotion + m pattern with useReducedMotion static fallbacks**

## Performance

- **Duration:** 7 min
- **Started:** 2026-03-26T18:56:51Z
- **Completed:** 2026-03-26T19:03:28Z
- **Tasks:** 3
- **Files modified:** 5

## Accomplishments

- JourneyTimeline.tsx: scroll-linked gold progress line on desktop (useScroll + useSpring + scaleY), staggered spring entrance for 5 nodes, horizontal scroll-snap carousel on mobile with IntersectionObserver dot tracking
- TestimonialCarousel.tsx: Motion drag="x" carousel with dragDirectionLock, 4s autoplay (functional setState avoids stale closure), responsive card count (1/2/3) via ResizeObserver, glass-card blockquote styling
- All 3 consuming pages (index, curso-auriculo, mentoria-black-neon) wired with client:visible, old Astro component imports removed
- Both islands include useReducedMotion fallback rendering equivalent static output to the replaced Astro components

## Task Commits

Each task was committed atomically:

1. **Task 1: Build JourneyTimeline.tsx React island** - `134dda3` (feat)
2. **Task 2: Build TestimonialCarousel.tsx React island** - `1b97167` (feat)
3. **Task 3: Wire both islands into all pages** - `fa62545` (feat)

## Files Created/Modified

- `src/components/home/JourneyTimeline.tsx` - Animated 5-node journey timeline with scroll-linked progress line, mobile scroll-snap, Lucide icons
- `src/components/landing/TestimonialCarousel.tsx` - Drag carousel with autoplay, dot indicators, responsive card count, glass-card blockquotes
- `src/pages/index.astro` - Imports both new React islands, prepares canonicalJourney + complementary data in frontmatter
- `src/pages/curso-auriculo.astro` - Replaced Testimonials.astro import with TestimonialCarousel client:visible
- `src/pages/mentoria-black-neon.astro` - Replaced Testimonials.astro import with TestimonialCarousel client:visible

## Decisions Made

- Used `<section>` instead of `<div role="region">` for carousel container -- Biome a11y lint (useSemanticElements) requires semantic HTML elements over ARIA role attributes
- Removed separate CTA buttons and "Ver pagina do programa" link from timeline nodes -- per RESEARCH.md discretion recommendation, the entire clickable node card serves as the primary navigation
- Used direct Lucide icon imports with a static iconMap (5 icons) instead of dynamic import -- simpler, tree-shakeable, all icons known at build time
- Moved `canonicalJourney` data preparation from `JourneyTimeline.astro` frontmatter into `index.astro` frontmatter -- React islands cannot call `getCollection()`

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Changed `<div role="region">` to `<section>` for carousel container**
- **Found during:** Task 2 (TestimonialCarousel.tsx)
- **Issue:** Biome lint rule `a11y/useSemanticElements` flags `role="region"` on `<div>` elements -- requires `<section>` instead
- **Fix:** Changed the carousel container from `<div role="region">` to `<section>`, removed explicit `role` attribute (implicit on `<section>`)
- **Files modified:** src/components/landing/TestimonialCarousel.tsx
- **Verification:** `bun run lint` exits 0
- **Committed in:** 1b97167 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Minor semantic HTML adjustment required by linter. No scope creep.

## Issues Encountered

None -- all tasks executed cleanly. Pre-existing `z` deprecation warnings in `content.config.ts` and a CSS "flex" build warning are unrelated to this plan.

## Known Stubs

None -- both components receive real data from Content Collections via Astro page frontmatter props. No placeholder or hardcoded data.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Plan 04-02 (WhatsAppFloatingButton) can proceed independently -- no dependency on this plan's artifacts
- Old Astro components (`JourneyTimeline.astro`, `Testimonials.astro`) left in place -- no importers remain in page files, cleanup deferred to Phase 6

## Self-Check: PASSED

- All 6 files verified present on disk
- All 3 task commits verified in git log (134dda3, 1b97167, fa62545)
- `bun run lint` exits 0
- `bunx astro check` exits 0
- `bun run build` exits 0

---
*Phase: 04-react-islands-premium-interactions*
*Completed: 2026-03-26*
