# Phase 4: React Islands — Premium Interactions - Context

**Gathered:** 2026-03-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Add 3 high-impact React components that elevate the site from institutional to premium experience: an animated Journey Timeline with progress line, a Framer Motion testimonial carousel with drag+autoplay, and a global WhatsApp floating button with scroll-triggered entrance.

Requirements: ISLAND-01, ISLAND-02, ISLAND-03

</domain>

<decisions>
## Implementation Decisions

### Island Justification (all 3 approved)
- **D-01:** JourneyTimeline upgrade from Astro to React is approved. Justification: premium storytelling for the core 5-product journey with animated progress line — not achievable with CSS alone.
- **D-02:** TestimonialCarousel as full Framer Motion carousel replaces Testimonials.astro. Justification: drag gesture, autoplay, and dot navigation are meaningful UX upgrades over static grid/scroll-snap.
- **D-03:** WhatsAppFloatingButton requires React for global persistence, scroll-triggered entrance, and animated spring entrance. Justified: interactive global element with animation state.

### Journey Timeline (ISLAND-01)
- **D-04:** Animated vertical progress line that draws downward as user scrolls into view. Each of the 5 nodes springs in with stagger. Line visually connects the stages.
- **D-05:** Nodes are clickable — tapping a node navigates to the product page. Existing CTA buttons below each stage can be removed or kept as secondary.
- **D-06:** Mobile: horizontal scroll-snap carousel. One stage visible at a time, swipe to see next. Progress dots at bottom.
- **D-07:** Desktop: vertical layout with animated progress line (same as current JourneyTimeline.astro layout direction, but animated).
- **D-08:** Use `client:visible` — timeline is below-fold on the home page.
- **D-09:** Data source: same `canonicalJourney` array currently in JourneyTimeline.astro, enriched with product data from `getCollection('products')`.

### Testimonial Carousel (ISLAND-02)
- **D-10:** Full Framer Motion carousel with drag gesture, autoplay (4s cycle), pause on hover, dot indicators.
- **D-11:** Multiple testimonials visible on desktop (2-3 cards), scrolls by 1. Single card on mobile.
- **D-12:** Replaces `Testimonials.astro` entirely across all landing pages that use it.
- **D-13:** Glass-card styling preserved on each testimonial card (matches current design).
- **D-14:** Use `client:visible` — testimonials are always below-fold.
- **D-15:** Receives `testimonials[]` prop (same schema as current: `{name, role, quote}`).

### WhatsApp Floating Button (ISLAND-03)
- **D-16:** Scroll-triggered — hidden until user scrolls past ~500px. Spring entrance on first appearance.
- **D-17:** Per-page message: on landing pages, use product-specific `cta.whatsappMessage` from JSON. On other pages, use `WHATSAPP_DEFAULT_SITE_MESSAGE` from `src/lib/whatsapp.ts`.
- **D-18:** Subtle `gold-pulse-glow` animation after entrance — disabled on mobile (<768px) per existing pattern. Hover shows stronger glow.
- **D-19:** Icon: WhatsApp SVG (same as existing CTA buttons). Not Lucide MessageCircle.
- **D-20:** Use `client:load` — must be available immediately for interaction after scroll threshold.
- **D-21:** Position: `fixed bottom-6 right-6 z-50`. Green WhatsApp background with white icon.
- **D-22:** Number/URL: import from `src/lib/whatsapp.ts` — Laura SDR (+55 62 9470-5081).

### Claude's Discretion
- Whether to show WhatsApp floating button on landing pages (which already have WhatsApp CTAs) — evaluate redundancy vs accessibility
- Spring physics parameters for timeline node entrances
- Autoplay pause duration when carousel is interacted with
- Progress line drawing animation timing and easing
- Exact scroll threshold for WhatsApp button appearance
- Whether to remove or keep CTA buttons below timeline nodes when nodes become clickable

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Rules
- `AGENTS.md` — MPA, no ClientRouter, Bun only, no emoji icons, no hardcoded hex, islands need justification
- `.claude/CLAUDE.md` — Stack rules, negative constraints, component organization
- `.claude/rules/frontend.md` — Motion rules, `client:visible` below-fold, Tailwind v4 tokens
- `.claude/rules/a11y.md` — Contrast, focus, reduced-motion, no-JS fallback

### Phase 3 Patterns (reference for new islands)
- `src/components/ui/MotionReveal.tsx` — LazyMotion + m pattern, useReducedMotion, spring config
- `src/components/ui/HeroEntrance.tsx` — Children.toArray stagger pattern
- `src/components/ui/AnimatedStats.tsx` — useMotionValue + useInView + count-up pattern

### Components Being Replaced/Modified
- `src/components/home/JourneyTimeline.astro` — Current static implementation (being upgraded to React)
- `src/components/landing/Testimonials.astro` — Current grid/strip layout (being replaced by carousel)
- `src/lib/whatsapp.ts` — WhatsApp utilities (number, URL builder, default message)
- `src/layouts/Layout.astro` — WhatsApp floating button will be added here globally

### Content Collections
- `src/content/products/*.json` — Product data for timeline enrichment and per-page WhatsApp messages
- `src/content.config.ts` — Zod schemas for products (includes `testimonials[]`, `cta.whatsappMessage`)

### Requirements
- `.planning/REQUIREMENTS.md` — ISLAND-01, ISLAND-02, ISLAND-03 acceptance criteria

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Phase 3 Motion islands: `MotionReveal.tsx`, `HeroEntrance.tsx`, `AnimatedStats.tsx` — established LazyMotion + m + useReducedMotion pattern
- `glass-card` utility — used on testimonial cards currently, must be preserved in carousel
- `gold-pulse-glow` utility — reuse for WhatsApp button pulsing glow
- `whatsapp.ts` — `whatsappUrlWithText()`, `WHATSAPP_DEFAULT_SITE_MESSAGE`, `WHATSAPP_SDR_E164`
- `isWhatsAppDestination()` — useful for conditional rendering logic

### Established Patterns
- LazyMotion + `m` from `motion/react-m` for bundle optimization (not full `motion` component)
- `useReducedMotion()` renders static fallback when reduced motion enabled
- `client:visible` for below-fold islands, `client:load` only when immediate availability needed
- Content Collections data passed as plain JS props to components
- Inline `<script>` for lightweight interactions (mousemove glow pattern from Phase 3)

### Integration Points
- `src/pages/index.astro` — JourneyTimeline is between StatsSection and AboutPreview
- `src/pages/*.astro` (landing pages) — Testimonials component used in product landings
- `src/layouts/Layout.astro` — Global WhatsApp button added here, receives optional `whatsappMessage` prop
- Product JSON `cta.whatsappMessage` field — per-product WhatsApp message source

</code_context>

<specifics>
## Specific Ideas

- Journey Timeline progress line should feel like "building a path" — the line draws as you scroll, revealing each stage as a milestone on the journey.
- Testimonial carousel: glass-card styling maintained. Multiple cards visible on desktop gives a sense of community/social proof density.
- WhatsApp button: scroll-triggered avoids competing with hero CTAs. Gold-pulse-glow after entrance draws attention subtly. WhatsApp SVG icon for instant recognition.
- All 3 islands follow Phase 3's LazyMotion pattern — consistency across the island layer.

</specifics>

<deferred>
## Deferred Ideas

- Animated border shimmer on glass-card (deferred from Phase 3) — could enhance testimonial cards in future polish
- Mousemove glow on landing page cards (deferred from Phase 3)
- Testimonial video support (would require new schema field and player component)

</deferred>

---

*Phase: 04-react-islands-premium-interactions*
*Context gathered: 2026-03-26*
