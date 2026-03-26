# Phase 3: Visual Uplift & Animation System - Context

**Gathered:** 2026-03-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Transform the visual identity from "flat navy" to "premium immersive" across the entire site. Deliverables: navy/gold aurora hero, CSS mesh gradient on landing heroes, Liquid Glass glass-card refinement + bright variant, mousemove glow on ProductsGrid cards, Framer Motion spring reveals on 4 key sections (home hero, home CTA, landing heroes, stats with count-up), button glow consistency, mobile menu transition, and reduced-motion compliance for all new animations.

Requirements: VIS-01, VIS-02, VIS-03, VIS-04, VIS-05, VIS-06 + ADV-05 (pulled forward: StatsSection count-up).

</domain>

<decisions>
## Implementation Decisions

### Aurora Hero Colors (VIS-01)
- **D-01:** Replace default blue/indigo CSS variables in `aurora-background.tsx` with navy/gold brand palette: `--aurora` gradient using `gold`, `gold-light`, `navy-lighter`, `gold-dark` color stops. Keep the flowing aurora animation effect but in brand colors.
- **D-02:** The home hero already uses `AuroraBackground` with `client:idle` — this is a color customization, not a new component.

### Landing Hero Backgrounds (VIS-02)
- **D-03:** CSS mesh gradient via keyframes — no React Island. Animated radial gradients with gold/navy color stops and slow position animation (~20s cycle). Replaces current static radial gradient blur.
- **D-04:** CSS-only fallback for `prefers-reduced-motion` — static gradient, no animation.

### Glass-Card Evolution (VIS-03)
- **D-05:** Refine existing `glass-card` utility (slightly increase gold tint, soften shadows) — current implementation is already advanced (blur 18px, gradient border, gold radial).
- **D-06:** Add new `.glass-card-bright` variant for CTA sections only (home CTASection + LandingCTA). Stronger gold glow, more visible border, higher blur/saturation.
- **D-07:** Glass-card border stays static — no animated shimmer on hover. `card-hover-lift` provides sufficient motion.

### Scroll-Reveal Approach (VIS-05)
- **D-08:** Hybrid approach — keep CSS-only `data-reveal` system for most sections (zero JS framework, works now). Add Framer Motion spring physics only to 4 specific sections:
  1. Home Hero entrance (badge, headline, subtitle, CTA — staggered spring)
  2. Home CTA Section (spring entrance)
  3. Landing Hero entrances (badge, headline, subheadline)
  4. StatsSection (spring reveal + animated number count-up)
- **D-09:** All other sections keep `data-reveal="up|left|right|scale"` CSS animations untouched.
- **D-10:** StatsSection gets both spring reveal AND animated number count-up (ADV-05 pulled into Phase 3 scope). Numbers animate from 0 to final value when scrolled into view.

### Card Mousemove Glow (VIS-04)
- **D-11:** CSS custom properties + vanilla JS inline script. `mousemove` handler sets `--mouse-x`/`--mouse-y` on each card; CSS `radial-gradient` follows cursor position. Zero React, minimal JS.
- **D-12:** Scope: ProductsGrid cards only (home page). Landing page cards (Benefits, Differentials) do NOT get mousemove glow — they remain static hover.

### Button Hover States (VIS-06)
- **D-13:** Add matching glow shadows to outline and ghost button variants on hover. Primary already has `gold-glow`. Ensure consistent premium feel across all 4 variants (primary, outline, whatsapp, ghost).

### Header Animation
- **D-14:** Add slide-down + fade transition to mobile menu open/close. Desktop dropdown already has smooth slide+fade and needs no changes.

### Performance Budget
- **D-15:** Lighthouse Performance score must stay >= 90 after Phase 3 changes. Phase 6 QA targets >= 95 — Phase 3 must not drop below 90.

### Reduced Motion Compliance
- **D-16:** Every new Framer Motion island MUST call `useReducedMotion()` and render static content when `true`. This matches the CSS `prefers-reduced-motion` approach already in `global.css`.

### Claude's Discretion
- Spring physics parameters (stiffness, damping, mass) for Framer Motion reveals
- Exact stagger timing between animated elements
- Mesh gradient color stop positions and animation timing for landing heroes
- StatsSection count-up easing and duration
- Mobile menu transition timing and easing
- Whether to disable mousemove glow on touch devices (recommended: disable)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Rules
- `AGENTS.md` — Single source of truth for project rules (MPA, no ClientRouter, Bun only, no emoji icons, no hardcoded hex, transform/opacity only for animations)
- `.claude/CLAUDE.md` — Stack rules, negative constraints, component organization

### Design System
- `src/styles/global.css` — All current utilities (glass-card, card-hover-lift, gold-pulse-glow, text-shimmer, data-reveal system, reduced-motion rules, mobile infinite-animation disable)
- `.claude/rules/frontend.md` — Motion rules, islands justification, Tailwind v4 tokens
- `.claude/rules/a11y.md` — Contrast, focus, reduced-motion, no-JS fallback rules

### Components Being Modified
- `src/components/ui/aurora-background.tsx` — Aurora color customization (D-01)
- `src/components/home/Hero.astro` — Already uses AuroraBackground; may need Framer Motion spring entrance
- `src/components/home/CTASection.astro` — Gets glass-card-bright + Framer Motion spring reveal
- `src/components/home/StatsSection.astro` — Gets Framer Motion spring + count-up animation
- `src/components/home/ProductsGrid.astro` — Gets mousemove glow script
- `src/components/shared/Card.astro` — May need glow-card class support
- `src/components/shared/Button.astro` — Glow shadow additions to outline/ghost variants
- `src/components/landing/LandingHero.astro` — Gets CSS mesh gradient + Framer Motion spring entrance
- `src/components/landing/LandingCTA.astro` — Gets glass-card-bright variant
- `src/components/layout/Header.astro` — Mobile menu transition animation

### Requirements
- `.planning/REQUIREMENTS.md` — VIS-01 through VIS-06 + ADV-05 acceptance criteria

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `aurora-background.tsx`: Aceternity UI aurora component, already in Hero.astro with `client:idle`. Needs color var override only.
- `glass-card` utility: Already has backdrop-filter blur(18px), saturate(125%), gold radial gradient, multi-layer shadow. Foundation is solid.
- `card-hover-lift` + `card-glow-hover` utilities: Existing hover patterns for cards.
- `gold-pulse-glow`, `text-shimmer`, `text-gradient-gold`: Existing gold animation utilities.
- `data-reveal` system: CSS keyframes + IntersectionObserver in Layout.astro. Must coexist with new Framer Motion reveals.
- Reduced-motion media queries: Already cover CSS animations, `gold-pulse-glow`, `float-gentle`, `text-shimmer`.

### Established Patterns
- Tailwind v4 `@theme` for color tokens — all new utilities must use `var(--color-*)` tokens, not hex.
- `@utility` directive for new utilities (glass-card-bright, etc.).
- Mobile infinite-animation disable at `max-width: 768px` — new infinite animations must follow same pattern.
- `client:idle` for above-fold React Islands (hero), `client:visible` for below-fold.

### Integration Points
- `src/layouts/Layout.astro` — IntersectionObserver script for `data-reveal`; must coexist with Framer Motion.
- `src/components/landing/LandingHero.astro` — Currently pure Astro; adding Framer Motion entrance means a new React wrapper component with `client:visible`.
- `src/components/home/StatsSection.astro` — Currently pure Astro static numbers; needs React Island for count-up.
- `src/components/home/CTASection.astro` — Currently pure Astro; needs React wrapper for spring entrance.

</code_context>

<specifics>
## Specific Ideas

- Aurora should feel like "navy sky with gold light leaking through" — not a flat gold wash.
- Mesh gradient on landing heroes should be subtle and slow (~20s cycle) — not distracting from the headline text.
- Glass-card-bright is for "conversion moments" only — CTA sections where the card literally glows to draw the eye.
- Mousemove glow on ProductsGrid should feel like a flashlight hovering over the card — gold radial gradient following cursor.
- StatsSection count-up should feel satisfying — not too fast, not too slow. Numbers like "200+" or "7 produtos" should count naturally.

</specifics>

<deferred>
## Deferred Ideas

- Animated border shimmer on glass-card hover — discussed and rejected for Phase 3 (static border preferred). Could revisit in future polish pass.
- Mousemove glow on landing page cards (Benefits, Differentials) — scoped to ProductsGrid only for now.
- Full Framer Motion migration for all data-reveal sections — rejected in favor of hybrid approach. CSS reveals stay for most sections.

</deferred>

---

*Phase: 03-visual-uplift-and-animation-system*
*Context gathered: 2026-03-26*
