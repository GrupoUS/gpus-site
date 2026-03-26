---
phase: 04-react-islands-premium-interactions
plan: 02
subsystem: ui
tags: [react, whatsapp, floating-button, motion, islands, astro, layout]

# Dependency graph
requires:
  - phase: 03-visual-uplift-animation-system
    provides: LazyMotion + m pattern, useReducedMotion convention, gold-pulse-glow utility
  - phase: 04-react-islands-premium-interactions
    provides: Plan 01 established Motion island wiring pattern (client:visible/client:load)
provides:
  - WhatsAppFloatingButton.tsx -- scroll-triggered floating WhatsApp button with spring entrance, per-page message support
  - Layout.astro whatsappMessage/hasBottomBar props for per-page WhatsApp customization
affects: [phase-06-qa]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "useScroll + useMotionValueEvent for scroll-threshold visibility trigger (400px)"
    - "client:load for fixed-position interactive elements (client:visible would never trigger)"
    - "hasBottomBar responsive offset pattern: bottom-24 md:bottom-6 to clear MobileCTABar"

key-files:
  created:
    - src/components/shared/WhatsAppFloatingButton.tsx
  modified:
    - src/layouts/Layout.astro
    - src/pages/curso-auriculo.astro
    - src/pages/mentoria-black-neon.astro

key-decisions:
  - "Used biome-ignore for lint/a11y/useAnchorContent on m.a -- Biome cannot resolve Motion m.a as standard anchor with aria-label"
  - "client:load for WhatsApp button (not client:visible) -- fixed-position elements are never 'visible' in viewport observer sense until footer scrolls into view"

patterns-established:
  - "Layout.astro prop passthrough for per-page island customization (whatsappMessage, hasBottomBar)"
  - "Product JSON cta.whatsappMessage as source of truth for page-specific WhatsApp messages"

requirements-completed: [ISLAND-03]

# Metrics
duration: 4min
completed: 2026-03-26
---

# Phase 04 Plan 02: WhatsAppFloatingButton Summary

**Global WhatsApp floating button React island with scroll-triggered spring entrance at 400px, Laura SDR URL from whatsapp.ts, product-specific messages on landing pages, and MobileCTABar overlap avoidance via responsive bottom offset**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-26T19:08:00Z
- **Completed:** 2026-03-26T19:12:05Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- WhatsAppFloatingButton.tsx: scroll-triggered (400px) spring entrance using useScroll + useMotionValueEvent, WhatsApp SVG icon, gold-pulse-glow on desktop, useReducedMotion immediate fallback
- Layout.astro: globally renders WhatsAppFloatingButton with client:load, supports optional whatsappMessage and hasBottomBar props for per-page customization
- Landing pages (curso-auriculo, mentoria-black-neon) pass product-specific cta.whatsappMessage and hasBottomBar=true; all other pages get default institutional message and standard positioning

## Task Commits

Each task was committed atomically:

1. **Task 1: Build WhatsAppFloatingButton.tsx React island** - `443f178` (feat)
2. **Task 2: Wire WhatsAppFloatingButton into Layout.astro and landing pages** - `6e4e010` (feat)

## Files Created/Modified

- `src/components/shared/WhatsAppFloatingButton.tsx` - Scroll-triggered floating WhatsApp button with spring entrance, LazyMotion + m pattern, per-page message support
- `src/layouts/Layout.astro` - Added WhatsAppFloatingButton import, whatsappMessage/hasBottomBar props, client:load island rendering
- `src/pages/curso-auriculo.astro` - Added whatsappMessage={d.cta.whatsappMessage} and hasBottomBar={true} props
- `src/pages/mentoria-black-neon.astro` - Added whatsappMessage={d.cta.whatsappMessage} and hasBottomBar={true} props

## Decisions Made

- Used `biome-ignore lint/a11y/useAnchorContent` on `<m.a>` element -- Biome's a11y rule does not understand Motion's `m.a` component as a standard `<a>` with `aria-label`. The rendered output is a proper anchor with accessible label.
- Used `client:load` (not `client:visible`) for the WhatsApp button per D-20 -- since the button is `position: fixed`, IntersectionObserver would not trigger until the footer scrolls into view, making `client:visible` inappropriate for immediate-after-scroll interaction.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added biome-ignore for m.a anchor content lint rule**
- **Found during:** Task 1 (WhatsAppFloatingButton.tsx)
- **Issue:** Biome `lint/a11y/useAnchorContent` does not recognize Motion's `m.a` component as a standard anchor, reporting missing accessible content despite `aria-label` being present
- **Fix:** Added `biome-ignore lint/a11y/useAnchorContent` comment with explanation that m.a renders `<a>` with aria-label
- **Files modified:** src/components/shared/WhatsAppFloatingButton.tsx
- **Verification:** `bun run lint` exits 0
- **Committed in:** 443f178 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Minor lint suppression needed for Motion component compatibility. No scope creep.

## Issues Encountered

None -- all tasks executed cleanly. Pre-existing `z` deprecation warnings in `content.config.ts` are unrelated to this plan.

## Known Stubs

None -- WhatsAppFloatingButton receives message via props from Layout.astro, which sources from product JSON `cta.whatsappMessage` or falls back to `WHATSAPP_DEFAULT_SITE_MESSAGE`. No placeholder data.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Phase 04 (React Islands) is now complete -- all 3 islands (JourneyTimeline, TestimonialCarousel, WhatsAppFloatingButton) built and wired
- Old Astro components (JourneyTimeline.astro, Testimonials.astro) remain in codebase with no importers -- cleanup deferred to Phase 6
- Phase 05 (SEO Technical Layer) can proceed independently

## Self-Check: PASSED

- All 4 files verified present on disk
- All 2 task commits verified in git log (443f178, 6e4e010)
- `bun run lint` exits 0
- `bunx astro check` exits 0
- `bun run build` exits 0

---
*Phase: 04-react-islands-premium-interactions*
*Completed: 2026-03-26*
