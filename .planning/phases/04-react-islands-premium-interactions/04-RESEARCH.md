# Phase 4: React Islands -- Premium Interactions - Research

**Researched:** 2026-03-26
**Domain:** React Islands (Framer Motion / Motion v12) in Astro 6 MPA
**Confidence:** HIGH

## Summary

Phase 4 adds three React islands to the Grupo US site: an animated Journey Timeline with scroll-linked progress line, a Framer Motion testimonial carousel with drag+autoplay, and a global WhatsApp floating button with scroll-triggered entrance. All three components are justified upgrades from static Astro to React for interactive animation state that CSS alone cannot achieve.

The project already has a mature Motion v12 island pattern established in Phase 3 (`LazyMotion + m + useReducedMotion`), with `MotionReveal.tsx`, `HeroEntrance.tsx`, and `AnimatedStats.tsx` as reference implementations. Phase 4 builds on this foundation using the same import paths (`motion/react`, `motion/react-m`), bundle optimization strategy (`LazyMotion` with `domAnimation`), and accessibility patterns (`useReducedMotion` with static fallback).

**Primary recommendation:** Build all three islands following the established Phase 3 LazyMotion pattern. Use `useScroll` + `useTransform` for the timeline progress line, `drag="x"` with `dragConstraints` for the testimonial carousel, and `useScroll` + `useMotionValueEvent` for the WhatsApp button scroll trigger. No new dependencies are needed -- Motion v12.38.0 already includes all required APIs.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** JourneyTimeline upgrade from Astro to React is approved. Justification: premium storytelling for the core 5-product journey with animated progress line -- not achievable with CSS alone.
- **D-02:** TestimonialCarousel as full Framer Motion carousel replaces Testimonials.astro. Justification: drag gesture, autoplay, and dot navigation are meaningful UX upgrades over static grid/scroll-snap.
- **D-03:** WhatsAppFloatingButton requires React for global persistence, scroll-triggered entrance, and animated spring entrance. Justified: interactive global element with animation state.
- **D-04:** Animated vertical progress line that draws downward as user scrolls into view. Each of the 5 nodes springs in with stagger. Line visually connects the stages.
- **D-05:** Nodes are clickable -- tapping a node navigates to the product page. Existing CTA buttons below each stage can be removed or kept as secondary.
- **D-06:** Mobile: horizontal scroll-snap carousel. One stage visible at a time, swipe to see next. Progress dots at bottom.
- **D-07:** Desktop: vertical layout with animated progress line (same as current JourneyTimeline.astro layout direction, but animated).
- **D-08:** Use `client:visible` -- timeline is below-fold on the home page.
- **D-09:** Data source: same `canonicalJourney` array currently in JourneyTimeline.astro, enriched with product data from `getCollection('products')`.
- **D-10:** Full Framer Motion carousel with drag gesture, autoplay (4s cycle), pause on hover, dot indicators.
- **D-11:** Multiple testimonials visible on desktop (2-3 cards), scrolls by 1. Single card on mobile.
- **D-12:** Replaces `Testimonials.astro` entirely across all landing pages that use it.
- **D-13:** Glass-card styling preserved on each testimonial card (matches current design).
- **D-14:** Use `client:visible` -- testimonials are always below-fold.
- **D-15:** Receives `testimonials[]` prop (same schema as current: `{name, role, quote}`).
- **D-16:** Scroll-triggered -- hidden until user scrolls past ~500px. Spring entrance on first appearance.
- **D-17:** Per-page message: on landing pages, use product-specific `cta.whatsappMessage` from JSON. On other pages, use `WHATSAPP_DEFAULT_SITE_MESSAGE` from `src/lib/whatsapp.ts`.
- **D-18:** Subtle `gold-pulse-glow` animation after entrance -- disabled on mobile (<768px) per existing pattern. Hover shows stronger glow.
- **D-19:** Icon: WhatsApp SVG (same as existing CTA buttons). Not Lucide MessageCircle.
- **D-20:** Use `client:load` -- must be available immediately for interaction after scroll threshold.
- **D-21:** Position: `fixed bottom-6 right-6 z-50`. Green WhatsApp background with white icon.
- **D-22:** Number/URL: import from `src/lib/whatsapp.ts` -- Laura SDR (+55 62 9470-5081).

### Claude's Discretion
- Whether to show WhatsApp floating button on landing pages (which already have WhatsApp CTAs) -- evaluate redundancy vs accessibility
- Spring physics parameters for timeline node entrances
- Autoplay pause duration when carousel is interacted with
- Progress line drawing animation timing and easing
- Exact scroll threshold for WhatsApp button appearance
- Whether to remove or keep CTA buttons below timeline nodes when nodes become clickable

### Deferred Ideas (OUT OF SCOPE)
- Animated border shimmer on glass-card (deferred from Phase 3) -- could enhance testimonial cards in future polish
- Mousemove glow on landing page cards (deferred from Phase 3)
- Testimonial video support (would require new schema field and player component)
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| ISLAND-01 | JourneyTimeline.tsx -- animated journey with Framer Motion progress line, 5-node stagger entrance, clickable nodes, mobile horizontal scroll-snap | Motion v12 `useScroll`+`useTransform` for progress line; `useInView`+spring stagger for node entrance; existing `canonicalJourney` data pattern; established LazyMotion pattern |
| ISLAND-02 | TestimonialCarousel.tsx -- Framer Motion carousel with swipe, autoplay (4s), dot indicators, replaces Testimonials.astro across 3 pages | Motion v12 `drag="x"` + `dragConstraints` + `onDragEnd` for swipe; `setInterval` for autoplay; glass-card utility preserved; same `{name,role,quote}` schema |
| ISLAND-03 | WhatsAppFloatingButton.tsx -- floating button `client:load`, scroll-triggered entrance, per-page message, imports from `src/lib/whatsapp.ts` | Motion v12 `useScroll`+`useMotionValueEvent` for scroll threshold; spring entrance animation; `whatsappUrlWithText` from existing utility; Layout.astro integration |
</phase_requirements>

## Standard Stack

### Core (already installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| motion | 12.38.0 | Animation engine for all 3 islands | Already installed, Phase 3 pattern established |
| motion/react | 12.38.0 | React hooks: `useScroll`, `useInView`, `useReducedMotion`, `useTransform`, `useMotionValueEvent` | Standard import path for hooks |
| motion/react-m | 12.38.0 | Tree-shakeable `m.div` components with `LazyMotion` | 4.6kb vs 34kb (full `motion` import) |
| react | 19.2.4 | React runtime | Already installed |
| lucide-react | 1.6.0 | Icons for timeline nodes | Already installed, per project rules |
| clsx + tailwind-merge | 2.1.1 / 3.5.0 | `cn()` utility for conditional classes | Already installed, used by all Phase 3 islands |

### Supporting (no new installs needed)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@/lib/whatsapp` | project module | WhatsApp URL builder, SDR number | WhatsApp floating button |
| `@/lib/utils` | project module | `cn()` class merge | All three components |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Custom drag carousel | Embla Carousel | Adds dependency; Motion drag is sufficient for simple swipe + snap |
| `useScroll` for WhatsApp trigger | `IntersectionObserver` via `useInView` | `useScroll` gives pixel-precise threshold; `useInView` is element-based, not pixel-offset |
| Full `motion` import | `LazyMotion + m` | Full import adds ~30kb; LazyMotion keeps ~4.6kb per island |

**Installation:** No new packages needed. All dependencies already in `package.json`.

## Architecture Patterns

### Recommended Component Structure
```
src/components/
├── home/
│   ├── JourneyTimeline.astro  → DELETED (replaced by React island)
│   └── JourneyTimeline.tsx    → NEW (client:visible)
├── landing/
│   ├── Testimonials.astro     → DELETED (replaced by React island)
│   └── TestimonialCarousel.tsx → NEW (client:visible)
└── shared/
    └── WhatsAppFloatingButton.tsx → NEW (client:load, in Layout.astro)
```

### Pattern 1: LazyMotion + m (Established Phase 3 Pattern)
**What:** Use `LazyMotion` with `domAnimation` feature set and `m.*` components instead of `motion.*` for tree-shaking.
**When to use:** Every new React island in this project.
**Example:**
```typescript
// Source: Established in Phase 3 MotionReveal.tsx
"use client";
import { domAnimation, LazyMotion, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";

export function MyComponent() {
  const prefersReducedMotion = useReducedMotion();
  if (prefersReducedMotion) return <StaticFallback />;
  return (
    <LazyMotion features={domAnimation}>
      <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {/* content */}
      </m.div>
    </LazyMotion>
  );
}
```

### Pattern 2: Scroll-Linked Progress (Journey Timeline)
**What:** Use `useScroll` with `target` ref to track an element's scroll progress through the viewport, then map to a visual progress line via `useTransform`.
**When to use:** Timeline progress line that draws as user scrolls.
**Example:**
```typescript
// Source: motion.dev/docs/react-use-scroll
const sectionRef = useRef<HTMLDivElement>(null);
const { scrollYProgress } = useScroll({
  target: sectionRef,
  offset: ["start end", "end center"],
});
// Map scroll progress to line height (0% -> 100%)
const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
// Smooth the value with spring
const smoothHeight = useSpring(lineHeight, { stiffness: 100, damping: 30 });
```

### Pattern 3: Drag Carousel (Testimonials)
**What:** Use `drag="x"` with pixel-based `dragConstraints` and `onDragEnd` to detect swipe direction, then animate to the next/previous page.
**When to use:** Testimonial carousel with drag+snap behavior.
**Example:**
```typescript
// Source: motion.dev/docs/react-drag
<m.div
  drag="x"
  dragConstraints={{ left: -maxDrag, right: 0 }}
  dragElastic={0.1}
  onDragEnd={(_, info) => {
    const threshold = 50;
    if (info.offset.x < -threshold) nextSlide();
    else if (info.offset.x > threshold) prevSlide();
  }}
  animate={{ x: -currentIndex * slideWidth }}
  transition={{ type: "spring", stiffness: 300, damping: 30 }}
>
  {/* slides */}
</m.div>
```

### Pattern 4: Scroll-Triggered Entrance (WhatsApp Button)
**What:** Use `useScroll` + `useMotionValueEvent` to detect when scroll passes a pixel threshold, then trigger a spring entrance animation.
**When to use:** WhatsApp floating button that appears after ~500px scroll.
**Example:**
```typescript
// Source: motion.dev/docs/react-use-scroll
const { scrollY } = useScroll();
const [visible, setVisible] = useState(false);
useMotionValueEvent(scrollY, "change", (latest) => {
  if (latest > 500 && !visible) setVisible(true);
});
```

### Pattern 5: Data Passing from Astro to React Islands
**What:** Astro frontmatter fetches Content Collections data, then passes plain JS objects as props to React islands. React components receive typed props, not Astro entries.
**When to use:** JourneyTimeline (needs product data enrichment), TestimonialCarousel (receives `testimonials[]`), WhatsAppFloatingButton (receives optional `message` prop).
**Example:**
```astro
---
// In page frontmatter
import { getCollection } from "astro:content";
const products = await getCollection("products");
const testimonialData = products.find(p => p.data.slug === "curso-auriculo")?.data.testimonials ?? [];
---
<TestimonialCarousel client:visible testimonials={testimonialData} />
```

### Anti-Patterns to Avoid
- **Importing full `motion` components:** Always use `m.div` via `motion/react-m` + `LazyMotion`. The full `motion.div` import pulls ~34kb.
- **Animating width/height:** Per CLAUDE.md, use `transform`/`opacity` only. The progress line uses `scaleY` with `transformOrigin: "top"`, not height animation.
- **Nested LazyMotion providers:** One `LazyMotion` wrapper per island component root. Do not nest them.
- **Missing useReducedMotion:** Every island MUST check `useReducedMotion()` and render a static fallback. This is a hard rule from `.claude/rules/a11y.md`.
- **Using `useState` for autoplay timer in carousel:** Use `useRef` for the interval ID to avoid stale closure issues. Clear on unmount.
- **Hardcoding hex values:** Use Tailwind token classes (`bg-whatsapp`, `text-gold`, `bg-navy-light`). No inline hex.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Scroll progress tracking | Manual scroll event listener + RAF | `useScroll({ target: ref })` from Motion | Handles resize, SSR, and GPU-accelerated ScrollTimeline automatically |
| Drag gesture detection | `touchstart`/`touchmove`/`touchend` handlers | `drag="x"` + `onDragEnd` from Motion | Handles pointer events, touch, mouse, momentum, elastic boundaries |
| Reduced motion detection | `matchMedia("(prefers-reduced-motion: reduce)")` | `useReducedMotion()` from Motion | SSR-safe, reactive, handles system changes |
| Spring physics | Manual spring math | `transition: { type: "spring", stiffness, damping, mass }` | Interruptible, GPU-optimized, battle-tested |
| Smooth scroll value | Manual `requestAnimationFrame` lerp | `useSpring(motionValue, config)` from Motion | Composable with `useTransform`, no manual cleanup |

**Key insight:** Motion v12 provides all the animation primitives needed for this phase. Adding external carousel libraries or scroll libraries would add bundle weight without meaningful benefit, since the project already pays the Motion bundle cost.

## Common Pitfalls

### Pitfall 1: Carousel Drag vs Page Scroll Conflict on Mobile
**What goes wrong:** Horizontal drag on the carousel intercepts vertical scroll gestures, making the page feel stuck.
**Why it happens:** `drag="x"` can capture touch events that the user intended as vertical scrolls.
**How to avoid:** Use `dragDirectionLock` on the carousel container. This forces Motion to detect the initial drag direction (x or y) and lock to it, allowing vertical scrolls to pass through.
**Warning signs:** Testing on mobile -- try scrolling past the carousel section vertically while touching the carousel area.

### Pitfall 2: Autoplay Timer Not Cleaned Up
**What goes wrong:** Autoplay continues after component unmounts, causing "Can't perform a React state update on an unmounted component" warnings.
**Why it happens:** `setInterval` set in `useEffect` without proper cleanup.
**How to avoid:** Store interval ID in `useRef`, clear in the useEffect cleanup function. Pause on hover/focus/drag by clearing and restarting the interval.
**Warning signs:** Console warnings in development when navigating away from a page with the carousel.

### Pitfall 3: Layout Shift When Islands Hydrate
**What goes wrong:** Static Astro HTML has different dimensions than the hydrated React island, causing visible layout shift (CLS).
**Why it happens:** React island renders differently than the server-rendered HTML placeholder.
**How to avoid:** Ensure the React component's initial render (before any animation) matches the dimensions of what Astro would have rendered. Use `initial={{ opacity: 0 }}` so the "pop-in" is a fade, not a layout jump. For the timeline, match the vertical space exactly.
**Warning signs:** CLS score increase in Lighthouse; visible "jump" when scrolling to island.

### Pitfall 4: WhatsApp Button Overlapping MobileCTABar
**What goes wrong:** The fixed WhatsApp button at `bottom-6 right-6` overlaps with the `MobileCTABar` fixed at the bottom of landing pages.
**Why it happens:** Landing pages have `<MobileCTABar>` which is also fixed at the bottom. Two fixed elements at `z-50` conflict.
**How to avoid:** On landing pages that have `MobileCTABar`, either (a) raise the WhatsApp button position to `bottom-24` to clear the bar, or (b) hide the WhatsApp button on landing pages entirely (discretion item from CONTEXT.md). Recommendation: add a `bottomOffset` prop or detect the MobileCTABar presence via a CSS class on the page wrapper.
**Warning signs:** Visual overlap on mobile when scrolling landing pages.

### Pitfall 5: Progress Line Not Animating on Short Viewports
**What goes wrong:** The `useScroll` progress line completes instantly because the section is already fully visible in the viewport on tall desktop monitors.
**Why it happens:** The `offset` configuration doesn't account for the section being shorter than the viewport.
**How to avoid:** Use offset `["start 0.8", "end 0.4"]` or similar so animation spans the section's travel through the viewport center, not just its full visibility. Test on 1440px tall viewports.
**Warning signs:** Progress line appears already fully drawn on large monitors.

### Pitfall 6: Stale Closure in Carousel State
**What goes wrong:** Autoplay callback reads stale `currentIndex` state, causing it to always go to slide 1.
**Why it happens:** `setInterval` captures the initial `currentIndex` value in its closure.
**How to avoid:** Use the functional form of setState: `setCurrentIndex(prev => (prev + 1) % total)`.
**Warning signs:** Autoplay always shows the same two slides alternating.

## Code Examples

### Journey Timeline -- Progress Line with useScroll
```typescript
// Source: motion.dev/docs/react-use-scroll + established project pattern
"use client";
import {
  domAnimation,
  LazyMotion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import * as m from "motion/react-m";
import { useRef } from "react";

interface TimelineProps {
  stages: Array<{
    slug: string;
    stage: string;
    eyebrow: string;
    summary: string;
    productName: string;
    tagline: string;
    pageHref: string;
    ctaLabel: string;
    ctaHref: string;
    iconName: string;
  }>;
}

export function JourneyTimeline({ stages }: TimelineProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.8", "end 0.4"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });
  const lineScaleY = useTransform(smoothProgress, [0, 1], [0, 1]);

  if (prefersReducedMotion) {
    return <StaticTimeline stages={stages} />;
  }

  return (
    <LazyMotion features={domAnimation}>
      <div ref={sectionRef} className="relative">
        {/* Progress line */}
        <m.div
          className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-gold/30 origin-top"
          style={{ scaleY: lineScaleY }}
        />
        {/* Nodes with stagger */}
        {stages.map((stage, i) => (
          <TimelineNode key={stage.slug} stage={stage} index={i} />
        ))}
      </div>
    </LazyMotion>
  );
}
```

### Testimonial Carousel -- Drag + Autoplay
```typescript
// Source: motion.dev/docs/react-drag + project conventions
"use client";
import { domAnimation, LazyMotion, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { useCallback, useEffect, useRef, useState } from "react";

interface Testimonial {
  name: string;
  role: string;
  quote: string;
}

export function TestimonialCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const startAutoplay = useCallback(() => {
    autoplayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);
  }, [testimonials.length]);

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
  }, []);

  useEffect(() => {
    startAutoplay();
    return stopAutoplay;
  }, [startAutoplay, stopAutoplay]);

  if (prefersReducedMotion) {
    return <StaticTestimonials testimonials={testimonials} />;
  }

  return (
    <LazyMotion features={domAnimation}>
      <div
        onMouseEnter={stopAutoplay}
        onMouseLeave={startAutoplay}
      >
        <m.div
          drag="x"
          dragConstraints={{ left: -(testimonials.length - 1) * slideWidth, right: 0 }}
          dragElastic={0.1}
          onDragEnd={(_, info) => {
            if (info.offset.x < -50) setCurrentIndex(prev => Math.min(prev + 1, testimonials.length - 1));
            else if (info.offset.x > 50) setCurrentIndex(prev => Math.max(prev - 1, 0));
          }}
          animate={{ x: -currentIndex * slideWidth }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {testimonials.map((t) => (
            <TestimonialCard key={t.name} testimonial={t} />
          ))}
        </m.div>
        <DotIndicators total={testimonials.length} current={currentIndex} onChange={setCurrentIndex} />
      </div>
    </LazyMotion>
  );
}
```

### WhatsApp Floating Button -- Scroll-Triggered
```typescript
// Source: motion.dev/docs/react-use-scroll + src/lib/whatsapp.ts
"use client";
import {
  domAnimation,
  LazyMotion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import * as m from "motion/react-m";
import { useState } from "react";
import { whatsappUrlWithText, WHATSAPP_DEFAULT_SITE_MESSAGE } from "@/lib/whatsapp";

interface WhatsAppFloatingButtonProps {
  message?: string;
}

export function WhatsAppFloatingButton({ message }: WhatsAppFloatingButtonProps) {
  const [visible, setVisible] = useState(false);
  const { scrollY } = useScroll();
  const prefersReducedMotion = useReducedMotion();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 500) setVisible(true);
  });

  const href = whatsappUrlWithText(message ?? WHATSAPP_DEFAULT_SITE_MESSAGE);

  if (!visible && !prefersReducedMotion) return null;

  return (
    <LazyMotion features={domAnimation}>
      <m.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar com a Laura no WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-lg"
        initial={prefersReducedMotion ? { scale: 1 } : { scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
      >
        {/* WhatsApp SVG icon */}
      </m.a>
    </LazyMotion>
  );
}
```

## Integration Points

### Pages That Need Changes

| Page | Current | Change |
|------|---------|--------|
| `src/pages/index.astro` | Imports `JourneyTimeline.astro` + `Testimonials.astro` | Import `JourneyTimeline.tsx` with `client:visible` + `TestimonialCarousel.tsx` with `client:visible` |
| `src/pages/mentoria-black-neon.astro` | Imports `Testimonials.astro` | Import `TestimonialCarousel.tsx` with `client:visible` |
| `src/pages/curso-auriculo.astro` | Imports `Testimonials.astro` | Import `TestimonialCarousel.tsx` with `client:visible` |
| `src/layouts/Layout.astro` | No WhatsApp button | Add `WhatsAppFloatingButton.tsx` with `client:load` + optional `whatsappMessage` prop |

### Data Flow for JourneyTimeline

Current data flow in `JourneyTimeline.astro`:
1. Frontmatter: `getCollection('products')` + hardcoded `canonicalJourney` array
2. Maps slugs to product data, computes `pageHref` and `ctaHref`
3. Renders `<ol>` with glass-card `<li>` items

New data flow for `JourneyTimeline.tsx`:
1. **Astro page frontmatter** (not the React component) runs `getCollection('products')` and builds the stages array
2. Passes the fully-resolved stages as a typed prop to the React island
3. React component only handles rendering and animation -- no data fetching

This is critical: React islands cannot call `getCollection()`. The Astro page must prepare all data.

### Data Flow for WhatsApp Button

1. `Layout.astro` gains an optional `whatsappMessage?: string` prop
2. Each page passes the product-specific message: `whatsappMessage={d.cta.whatsappMessage}`
3. Pages without product context (home, sobre, contato, legais) omit the prop, defaulting to `WHATSAPP_DEFAULT_SITE_MESSAGE`
4. The React component imports directly from `@/lib/whatsapp` for URL building

### WhatsApp SVG Icon (reuse)

The WhatsApp SVG path already exists in `LandingHero.astro` (line 82-87). Extract to a shared constant or inline in the floating button. The SVG viewBox is `0 0 24 24` with `fill="currentColor"`.

```html
<svg class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
</svg>
```

## Discretion Recommendations

### WhatsApp Button on Landing Pages
**Recommendation: Show it, but with offset.** Landing pages already have WhatsApp CTAs in `LandingHero` and `LandingCTA`, but the floating button provides "always available" access as users scroll through long content. Use `bottom-24 right-6` on pages with `MobileCTABar` (detected via prop) to avoid overlap.

### CTA Buttons Below Timeline Nodes
**Recommendation: Remove secondary CTA buttons, keep nodes as the primary interaction.** The current `JourneyTimeline.astro` has both a `<Button>` CTA and a "Ver pagina do programa" link per node. With clickable nodes (D-05), the node itself becomes the primary navigation. Simplify to: clicking the node navigates to `pageHref`. For products where `ctaHref !== pageHref`, add a subtle CTA label inside the node card.

### Spring Physics for Timeline
**Recommendation:** Use the established Phase 3 spring configs:
- Node entrance: `stiffness: 200, damping: 25, mass: 1` (matches HeroEntrance)
- Stagger: `0.12s` per node (5 nodes total = 0.6s full sequence)
- Progress line: `useSpring` with `stiffness: 100, damping: 30` for smooth scroll tracking

### Autoplay Pause Duration
**Recommendation:** 8 seconds pause after user interaction (drag or dot click), then resume autoplay. This gives users time to read the testimonial they navigated to.

### Scroll Threshold for WhatsApp
**Recommendation:** 400px (slightly below initial viewport on most devices). This ensures the button doesn't compete with hero CTAs but appears early enough in the scroll journey.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `framer-motion` package | `motion` package | Mid-2025 | Import path: `motion/react` instead of `framer-motion` |
| `motion.div` | `LazyMotion` + `m.div` | Motion v10+ | 30kb bundle savings per island |
| CSS scroll-snap carousel | Motion `drag="x"` carousel | Continuous | Better UX with momentum, elastic bounds, programmable snap |
| IntersectionObserver for scroll progress | `useScroll({ target })` + ScrollTimeline | Motion v11+ | GPU-accelerated, no manual observer management |

**Deprecated/outdated:**
- `ViewTransitions` import from Astro: renamed to `ClientRouter` in Astro 5+ (not relevant here -- MPA project)
- `useDragControls()` for simple carousels: direct `drag` prop is simpler; `useDragControls` is for imperative start from external triggers

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None (no unit test runner in project) |
| Config file | None |
| Quick run command | `bun run lint && bunx astro check` |
| Full suite command | `bun run lint && bunx astro check && bun run build` |

### Phase Requirements to Validation Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| ISLAND-01 | JourneyTimeline.tsx renders, animates, builds cleanly | build + lint | `bun run build && bun run lint` | N/A (build validation) |
| ISLAND-02 | TestimonialCarousel.tsx replaces Testimonials.astro across 3 pages | build + lint | `bun run build && bun run lint` | N/A (build validation) |
| ISLAND-03 | WhatsAppFloatingButton.tsx in Layout.astro, builds cleanly | build + lint | `bun run build && bun run lint` | N/A (build validation) |
| All | Accessibility: useReducedMotion, aria-labels, keyboard nav | manual | Tab through each island, enable reduced motion | N/A (manual) |
| All | Mobile layout: no overlap, proper responsive behavior | manual | Browser DevTools responsive mode | N/A (manual) |

### Sampling Rate
- **Per task commit:** `bun run lint && bunx astro check`
- **Per wave merge:** `bun run lint && bunx astro check && bun run build`
- **Phase gate:** Full suite green + manual accessibility check before `/gsd:verify-work`

### Wave 0 Gaps
None -- existing build/lint infrastructure covers all automated validation needs. No test files to create since the project has no test runner.

## Open Questions

1. **Carousel slide width calculation on SSR**
   - What we know: The carousel needs to know the slide width to calculate drag constraints and animate x position
   - What's unclear: During SSR, `window.innerWidth` is unavailable. The component must handle this.
   - Recommendation: Use `useRef` + `useEffect` to measure the container width after mount. Set initial drag constraints to 0 and update after measurement. Or use CSS-based width with `%` units and calculate pixel offsets from the measured container.

2. **Home page testimonials -- mixed product sources**
   - What we know: `index.astro` collects testimonials from ALL products (flattened, sliced to 9). The `role` field is enriched with product name: `t.role (product.name)`.
   - What's unclear: Whether the carousel should show all 9 or fewer for better UX.
   - Recommendation: Keep the current 9 limit. With 2-3 visible on desktop, this gives 3-4 pages of carousel content -- enough to feel substantial without being excessive.

## Project Constraints (from CLAUDE.md)

- **Package manager:** Bun only -- never npm/yarn/pnpm
- **Islands justification:** All 3 islands are approved in CONTEXT.md (D-01, D-02, D-03)
- **No SPA routing:** MPA, standard `<a>` tags for navigation (timeline nodes use `<a>` elements)
- **No emoji icons:** Lucide React SVG for timeline icons, WhatsApp SVG for floating button
- **No hardcoded hex:** Use Tailwind tokens (`bg-whatsapp`, `text-gold`, `bg-navy-light`)
- **No animating width/height/top/left:** Use `transform` + `opacity` only (progress line uses `scaleY`)
- **Validation gates:** `bun run lint` + `bunx astro check` + `bun run build`
- **Commit format:** Conventional Commits (`feat:`, `fix:`, `refactor:`)
- **Motion pattern:** `LazyMotion` + `m` from `motion/react-m` -- not full `motion` import
- **Reduced motion:** `useReducedMotion()` with static fallback in every island
- **Content Collections:** Data passed as plain JS props from Astro frontmatter to React islands
- **WhatsApp source:** Import from `src/lib/whatsapp.ts` only -- never hardcode numbers or URLs

## Sources

### Primary (HIGH confidence)
- motion v12.38.0 installed in project -- APIs verified against `node_modules/motion/package.json`
- [Motion useScroll docs](https://motion.dev/docs/react-use-scroll) -- scroll progress, target ref, offset configuration
- [Motion scroll animations docs](https://motion.dev/docs/react-scroll-animations) -- scroll-linked vs scroll-triggered patterns
- [Motion drag docs](https://motion.dev/docs/react-drag) -- drag prop, dragConstraints, dragElastic, onDragEnd
- Phase 3 established patterns -- `MotionReveal.tsx`, `HeroEntrance.tsx`, `AnimatedStats.tsx` (direct code review)
- Existing codebase -- `JourneyTimeline.astro`, `Testimonials.astro`, `whatsapp.ts`, `Layout.astro` (direct code review)

### Secondary (MEDIUM confidence)
- [Motion carousel docs](https://motion.dev/docs/react-carousel) -- official carousel component (Motion+ premium, not needed for our custom implementation)
- Motion v12 upgrade guide -- confirmed `motion/react` import path is standard

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all packages already installed and verified, no new dependencies
- Architecture: HIGH -- patterns established in Phase 3, Motion v12 APIs verified against official docs
- Pitfalls: HIGH -- identified from code review of existing components + known Motion patterns
- Integration points: HIGH -- all affected files identified and read directly

**Research date:** 2026-03-26
**Valid until:** 2026-04-26 (stable -- no dependency changes expected)
