# Phase 3: Visual Uplift & Animation System - Research

**Researched:** 2026-03-26
**Domain:** CSS animations, Framer Motion (Motion 12), glassmorphism, scroll-triggered reveals, count-up animations
**Confidence:** HIGH

## Summary

Phase 3 transforms the Grupo US site from "flat navy" to "premium immersive" via six requirement areas: aurora hero (VIS-01), landing mesh gradients (VIS-02), glass-card evolution (VIS-03), mousemove glow on ProductsGrid (VIS-04), Framer Motion spring reveals on 4 specific sections (VIS-05), and button hover refinements (VIS-06). Additionally, ADV-05 (StatsSection count-up) is pulled forward.

The project already has Motion 12 (`motion@^12.38.0`) installed and uses the `"motion/react"` import path across all existing islands (lamp, text-generate-effect, background-beams, moving-border). The existing `global.css` design system has a mature foundation: `glass-card` already uses `backdrop-filter: blur(18px) saturate(125%)` with gold radial gradient and multi-layer shadows, `data-reveal` CSS animations with IntersectionObserver, and `prefers-reduced-motion` coverage. The work is mostly additive refinement and targeted React island additions, not a rewrite.

**Primary recommendation:** Use the hybrid approach from CONTEXT.md: keep CSS `data-reveal` for most sections, add Motion springs only to 4 specific sections via `LazyMotion` + `m` components with `client:visible`, and implement all CSS-only features (mesh gradient, glass-card-bright, mousemove glow, button hovers) as `@utility` / `@keyframes` additions to `global.css`.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Replace default blue/indigo CSS variables in `aurora-background.tsx` with navy/gold brand palette: `--aurora` gradient using `gold`, `gold-light`, `navy-lighter`, `gold-dark` color stops. Keep the flowing aurora animation effect but in brand colors.
- **D-02:** The home hero already uses `AuroraBackground` with `client:idle` -- this is a color customization, not a new component.
- **D-03:** CSS mesh gradient via keyframes -- no React Island. Animated radial gradients with gold/navy color stops and slow position animation (~20s cycle). Replaces current static radial gradient blur.
- **D-04:** CSS-only fallback for `prefers-reduced-motion` -- static gradient, no animation.
- **D-05:** Refine existing `glass-card` utility (slightly increase gold tint, soften shadows) -- current implementation is already advanced (blur 18px, gradient border, gold radial).
- **D-06:** Add new `.glass-card-bright` variant for CTA sections only (home CTASection + LandingCTA). Stronger gold glow, more visible border, higher blur/saturation.
- **D-07:** Glass-card border stays static -- no animated shimmer on hover. `card-hover-lift` provides sufficient motion.
- **D-08:** Hybrid approach -- keep CSS-only `data-reveal` system for most sections. Add Framer Motion spring physics only to 4 specific sections: (1) Home Hero entrance, (2) Home CTA Section, (3) Landing Hero entrances, (4) StatsSection (spring reveal + count-up).
- **D-09:** All other sections keep `data-reveal="up|left|right|scale"` CSS animations untouched.
- **D-10:** StatsSection gets both spring reveal AND animated number count-up (ADV-05 pulled into Phase 3). Numbers animate from 0 to final value when scrolled into view.
- **D-11:** CSS custom properties + vanilla JS inline script. `mousemove` handler sets `--mouse-x`/`--mouse-y` on each card; CSS `radial-gradient` follows cursor position. Zero React, minimal JS.
- **D-12:** Scope: ProductsGrid cards only (home page). Landing page cards do NOT get mousemove glow.
- **D-13:** Add matching glow shadows to outline and ghost button variants on hover. Primary already has `gold-glow`. Ensure consistent premium feel across all 4 variants.
- **D-14:** Add slide-down + fade transition to mobile menu open/close.
- **D-15:** Lighthouse Performance score must stay >= 90 after Phase 3 changes.
- **D-16:** Every new Framer Motion island MUST call `useReducedMotion()` and render static content when `true`.

### Claude's Discretion
- Spring physics parameters (stiffness, damping, mass) for Framer Motion reveals
- Exact stagger timing between animated elements
- Mesh gradient color stop positions and animation timing for landing heroes
- StatsSection count-up easing and duration
- Mobile menu transition timing and easing
- Whether to disable mousemove glow on touch devices (recommended: disable)

### Deferred Ideas (OUT OF SCOPE)
- Animated border shimmer on glass-card hover -- rejected for Phase 3
- Mousemove glow on landing page cards (Benefits, Differentials) -- scoped to ProductsGrid only
- Full Framer Motion migration for all data-reveal sections -- hybrid approach chosen
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| VIS-01 | Hero da home com background aurora/mesh gradient animado | Aurora color customization in `aurora-background.tsx` -- replace blue/indigo CSS vars with navy/gold tokens. Already using `client:idle`. |
| VIS-02 | Heroes das landing pages com fundo animado consistente | CSS mesh gradient via `@keyframes` animating `background-position` of layered radial-gradients. No React Island needed. |
| VIS-03 | Utility `glass-card` atualizada para Liquid Glass real | Refine existing `glass-card` (gold tint increase) + new `glass-card-bright` variant via `@utility`. Foundation already solid. |
| VIS-04 | Micro-interacoes nos ProductsGrid cards -- glow dinamico | Vanilla JS `mousemove` setting `--mouse-x`/`--mouse-y` custom properties; CSS radial-gradient follows cursor. |
| VIS-05 | Animacoes de scroll-reveal mais expressivas com spring physics | `LazyMotion` + `m` from `"motion/react"` / `"motion/react-m"` with `useInView` + `useReducedMotion`. 4 sections only. |
| VIS-06 | Hover states refinados em todos os botoes | Add `box-shadow` glow on hover to outline, ghost, and whatsapp variants in `Button.astro`. CSS-only. |
| ADV-05 | Counter animado nas StatsSection (scroll-triggered count-up) | `useMotionValue` + `animate` + `useTransform(Math.round)` + `useInView` from `"motion/react"`. Free API, no motion-plus needed. |
</phase_requirements>

## Standard Stack

### Core (already installed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| motion | 12.38.0 | Spring animations, useInView, useReducedMotion | Already in project. All existing islands import from `"motion/react"` |
| Astro | ^6.0.8 | Static site framework | Project framework |
| Tailwind CSS | ^4.2.2 | Utility CSS via `@theme` / `@utility` | Project styling system |
| React | 19.2.4 | Islands runtime | Project framework |

### Supporting (no new dependencies)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| clsx + tailwind-merge | (installed) | Class merging via `cn()` | Already in `src/lib/utils.ts` |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Motion `useMotionValue` count-up | `motion-plus` AnimateNumber | Paid component ($), more features but unnecessary for simple count-up |
| Motion `useMotionValue` count-up | `react-countup` / `countup.js` | Extra dependency; Motion already installed and can do this with ~20 lines |
| CSS mesh gradient | Three.js / WebGL gradient | Overkill for subtle background animation; would bloat JS bundle |
| LazyMotion + m | Full `motion` component | 4.6kb vs 34kb initial load; LazyMotion is the performance-correct choice |

**Installation:** No new packages needed. All dependencies already in `package.json`.

## Architecture Patterns

### New Files to Create

```
src/components/ui/
  MotionReveal.tsx          # Shared LazyMotion wrapper for spring reveals (used by 4 sections)
  AnimatedStats.tsx         # StatsSection React island with count-up + spring reveal
  HeroEntrance.tsx          # Home Hero spring entrance wrapper (badge, headline, subtitle, CTA)
  LandingHeroEntrance.tsx   # Landing Hero spring entrance wrapper (badge, headline, subheadline)

src/styles/global.css       # Modified: mesh-gradient keyframes, glass-card-bright, button glow
```

### Pattern 1: LazyMotion Wrapper for Bundle Optimization

**What:** Wrap all new Motion islands in `LazyMotion` with `domAnimation` features and use the `m` component instead of `motion` to keep bundle size minimal.
**When to use:** Every new React island that uses Motion animations.

```tsx
// src/components/ui/MotionReveal.tsx
"use client";
import { LazyMotion, domAnimation } from "motion/react";
import * as m from "motion/react-m";
import { useReducedMotion, useInView } from "motion/react";
import { useRef, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  stagger?: number;
}

export function MotionReveal({ children, className, stagger = 0 }: Props) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        ref={ref}
        className={className}
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 25,
          mass: 1,
          delay: stagger,
        }}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}
```

### Pattern 2: Count-Up with useMotionValue (free, no motion-plus)

**What:** Animate numbers from 0 to final value using Motion's free `useMotionValue` + `animate` + `useTransform`.
**When to use:** StatsSection count-up (ADV-05).

```tsx
// Inside AnimatedStats.tsx
"use client";
import { useMotionValue, useTransform, animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const prefersReducedMotion = useReducedMotion();
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    if (!isInView) return;
    if (prefersReducedMotion) {
      count.set(target);
      return;
    }
    const controls = animate(count, target, {
      duration: 2,
      ease: "easeOut",
    });
    return controls.stop;
  }, [isInView, target, count, prefersReducedMotion]);

  // Subscribe to rounded value and update DOM directly
  // (avoids React re-renders on each frame)
  // ...
}
```

### Pattern 3: CSS Mesh Gradient for Landing Heroes (zero JS)

**What:** Animated radial-gradient background using CSS `@keyframes` to shift `background-position` of layered gradients over a ~20s cycle.
**When to use:** All landing hero sections (VIS-02).

```css
/* In global.css */
@keyframes mesh-drift {
  0%, 100% {
    background-position: 0% 50%, 100% 50%, 50% 0%;
  }
  33% {
    background-position: 100% 50%, 0% 100%, 50% 100%;
  }
  66% {
    background-position: 50% 100%, 50% 0%, 0% 50%;
  }
}

@utility landing-mesh-bg {
  background:
    radial-gradient(ellipse at 25% 25%, color-mix(in srgb, var(--color-gold) 8%, transparent) 0%, transparent 50%),
    radial-gradient(ellipse at 75% 75%, color-mix(in srgb, var(--color-gold-dark) 6%, transparent) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, color-mix(in srgb, var(--color-navy-lighter) 15%, transparent) 0%, transparent 60%);
  background-size: 200% 200%, 200% 200%, 200% 200%;
  animation: mesh-drift 20s ease-in-out infinite;
}
```

### Pattern 4: Mousemove Glow via CSS Custom Properties

**What:** Vanilla JS `mousemove` handler sets `--mouse-x` / `--mouse-y` on each card. CSS `radial-gradient` at `var(--mouse-x) var(--mouse-y)` creates a "flashlight" gold glow following the cursor.
**When to use:** ProductsGrid cards only (VIS-04, D-11/D-12).

```html
<!-- Inline script in ProductsGrid.astro -->
<script>
  const grid = document.querySelector('[data-glow-grid]');
  if (grid && !window.matchMedia('(pointer: coarse)').matches) {
    grid.addEventListener('mousemove', (e) => {
      for (const card of grid.querySelectorAll('[data-glow-card]')) {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
      }
    });
  }
</script>
```

CSS for the glow effect:
```css
[data-glow-card] {
  --mouse-x: 50%;
  --mouse-y: 50%;
}
[data-glow-card]::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(
    300px circle at var(--mouse-x) var(--mouse-y),
    color-mix(in srgb, var(--color-gold) 12%, transparent),
    transparent 60%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 1;
}
[data-glow-card]:hover::before {
  opacity: 1;
}
```

### Pattern 5: Mobile Menu Slide-Down + Fade Transition

**What:** CSS transition on the mobile menu overlay: `transform: translateY(-100%)` + `opacity: 0` when hidden, transitioning to `translateY(0)` + `opacity: 1` when open.
**When to use:** Header mobile menu (D-14).

The current implementation uses `hidden`/`flex` classes. Replace with CSS transition state management:
- Default state: `translate-y-full opacity-0 pointer-events-none` (or `translate-y-[-100%]`)
- Open state: `translate-y-0 opacity-100 pointer-events-auto`
- Transition: `transition-all duration-300 ease-out`

### Anti-Patterns to Avoid

- **Animating `width` in Motion:** The existing `lamp.tsx` animates `width` via `whileInView` -- this is an Aceternity pattern already in place. Do NOT replicate this for new components. New Motion animations must use `transform`/`opacity` only per AGENTS.md rules.
- **Using `motion` instead of `m` in new islands:** Always use `LazyMotion` + `m` from `"motion/react-m"` to keep bundle size at 4.6kb instead of 34kb.
- **Adding `client:load` to below-fold islands:** StatsSection and CTASection islands must use `client:visible`. Only the home hero entrance (above-fold) may use `client:idle`.
- **Hardcoding hex values:** All colors must reference `var(--color-*)` tokens from `@theme` in `global.css`.
- **Creating separate React islands per section:** Create one `MotionReveal` wrapper and compose, rather than duplicating `LazyMotion` setup in every component.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Scroll detection for animations | Custom IntersectionObserver in React | `useInView` from `"motion/react"` | 0.6kb hook, handles cleanup, ref-based, options like `once` and `amount` |
| Reduced motion detection | `window.matchMedia("prefers-reduced-motion")` polling | `useReducedMotion()` from `"motion/react"` | Reactive hook, auto re-renders on system preference change |
| Spring physics curves | Manual `cubic-bezier` approximations | Motion `type: "spring"` transition | Real physics simulation, handles velocity from gestures |
| Number counting animation | `setInterval` + `useState` (causes re-renders) | `useMotionValue` + `animate` + `useTransform` | Directly updates DOM, no React re-renders per frame, smooth |
| Bundle-optimized Motion | Importing full `motion` component | `LazyMotion` + `domAnimation` + `m` | 4.6kb vs 34kb initial load |

**Key insight:** The project already has Motion 12 installed. Every animation primitive needed (spring, useInView, useReducedMotion, useMotionValue, animate, useTransform) is available from `"motion/react"` at zero extra dependency cost. The `m` + `LazyMotion` pattern keeps the incremental bundle cost of new islands minimal.

## Common Pitfalls

### Pitfall 1: Data-Reveal Conflict with Framer Motion
**What goes wrong:** Elements with `data-reveal` start with `opacity: 0` in CSS. If those same elements are also wrapped in a Framer Motion component, the CSS `opacity: 0` and the Motion `initial={{ opacity: 0 }}` can conflict, causing double-hide or reveal flicker.
**Why it happens:** The IntersectionObserver in `Layout.astro` adds `.revealed` class which triggers CSS animation. Meanwhile, Motion also controls opacity independently.
**How to avoid:** For the 4 sections getting Framer Motion reveals, **remove** `data-reveal` attributes from those specific elements. Motion controls them entirely. Other sections keep `data-reveal` untouched.
**Warning signs:** Elements flicker or briefly appear then disappear on scroll.

### Pitfall 2: LazyMotion Not Wrapping All m Components
**What goes wrong:** Using `m.div` without a `LazyMotion` ancestor throws a runtime error: "m components require a LazyMotion ancestor."
**Why it happens:** `m` components are feature-stripped and need `LazyMotion` to provide animation capabilities.
**How to avoid:** Create a shared `MotionReveal` wrapper that always includes `LazyMotion`. Use it as the top-level component in every new island.
**Warning signs:** Console error about missing LazyMotion.

### Pitfall 3: Aurora Background Dark Mode Classes
**What goes wrong:** `aurora-background.tsx` has `dark:` prefixed Tailwind classes (`dark:bg-zinc-900`, `dark:invert-0`, `dark:[background-image:...]`). The site does not use Tailwind dark mode toggle -- it is always dark.
**Why it happens:** The component is from Aceternity UI and assumes a light/dark toggle setup.
**How to avoid:** When replacing colors, also replace `dark:` conditional classes with direct classes. The site is always "dark mode" (navy background). Remove the `bg-zinc-50 text-slate-950 dark:bg-zinc-900` wrapper class and replace with `bg-navy`.
**Warning signs:** Aurora appears with wrong background or blue tint instead of navy.

### Pitfall 4: Mesh Gradient Performance on Mobile
**What goes wrong:** Animated CSS gradients with `background-size` changes cause high repaint cost, draining mobile battery and causing jank.
**Why it happens:** Gradient animations are not GPU-composited like `transform`/`opacity`. The browser repaints the gradient every frame.
**How to avoid:** Use `background-position` animation (cheaper than `background-size`). Keep gradient layers to 3 maximum. Add `will-change: background-position` sparingly. Disable animation at `max-width: 768px` or `prefers-reduced-motion: reduce`.
**Warning signs:** Choppy scrolling on mobile, high paint time in DevTools.

### Pitfall 5: Count-Up Parsing Non-Numeric Stat Values
**What goes wrong:** StatsSection has values like `"+5.000"`, `"26"`, `"10+"`, `"7"`. Parsing these into numeric targets requires stripping non-numeric characters while preserving the suffix/prefix.
**Why it happens:** Stats are defined as display strings, not raw numbers.
**How to avoid:** Parse the numeric portion in the React component: extract digits, animate to that number, then append the original prefix/suffix. For "+5.000": animate 0 to 5000, format with `.` thousands separator, prepend "+". For "10+": animate 0 to 10, append "+".
**Warning signs:** `NaN` displayed, or the formatted output looks different from the original.

### Pitfall 6: StatsSection Hardcoded Data
**What goes wrong:** StatsSection currently has stats hardcoded in frontmatter as an array of `{ number, label }`. The numbers are strings with formatting. If the count-up component expects a different data structure, mismatches will occur.
**Why it happens:** Stats are defined inline in the `.astro` file, not from Content Collections.
**How to avoid:** Keep the data in the `.astro` frontmatter but pass both the display string and a numeric target to the React island. E.g., `{ target: 5000, display: "+5.000", suffix: "", prefix: "+", label: "..." }`. The island counts to `target` and formats with the given prefix/suffix.
**Warning signs:** The count-up number format does not match the original static display.

## Code Examples

### Aurora Color Customization (VIS-01)

Current `aurora-background.tsx` uses blue/indigo CSS variables. Replace the inline style block:

```tsx
// BEFORE (Aceternity default)
"--aurora": "repeating-linear-gradient(100deg,#3b82f6_10%,#a5b4fc_15%,#93c5fd_20%,#ddd6fe_25%,#60a5fa_30%)"

// AFTER (Navy/Gold brand)
"--aurora": "repeating-linear-gradient(100deg,var(--color-gold)_10%,var(--color-gold-light)_15%,var(--color-navy-lighter)_20%,var(--color-gold-dark)_25%,var(--color-gold)_30%)"
```

Also replace the wrapper classes:
```tsx
// BEFORE
className="bg-zinc-50 text-slate-950 dark:bg-zinc-900"
// AFTER
className="bg-navy"
```

And the dark-mode conditional inner classes need simplification since there is no light mode.

### Glass-Card-Bright Utility (VIS-03)

```css
@utility glass-card-bright {
  background:
    linear-gradient(
      180deg,
      color-mix(in srgb, var(--color-navy-light) 85%, white 8%) 0%,
      color-mix(in srgb, var(--color-navy) 88%, transparent) 100%
    ),
    radial-gradient(
      circle at top left,
      color-mix(in srgb, var(--color-gold) 18%, transparent) 0%,
      transparent 50%
    );
  border: 1px solid color-mix(in srgb, var(--color-gold) 35%, transparent);
  backdrop-filter: blur(24px) saturate(140%);
  box-shadow:
    0 0 40px color-mix(in srgb, var(--color-gold) 15%, transparent),
    0 24px 70px color-mix(in srgb, var(--color-navy) 45%, transparent),
    inset 0 1px 0 color-mix(in srgb, white 10%, transparent);
}
```

### Button Glow Hover States (VIS-06)

```css
/* Outline button hover glow */
.btn-outline:hover {
  box-shadow:
    0 0 20px color-mix(in srgb, var(--color-gold) 25%, transparent),
    0 4px 12px color-mix(in srgb, var(--color-gold) 10%, transparent);
}

/* Ghost button hover glow */
.btn-ghost:hover {
  box-shadow:
    0 0 15px color-mix(in srgb, var(--color-gold) 15%, transparent);
}

/* WhatsApp button hover glow */
.btn-whatsapp:hover {
  box-shadow:
    0 0 20px color-mix(in srgb, var(--color-whatsapp) 25%, transparent),
    0 4px 12px color-mix(in srgb, var(--color-whatsapp) 10%, transparent);
}
```

Note: Button.astro uses string concatenation for classes (`variantClasses`), not utility composition. The glow needs to be added to the `variantClasses` record hover states directly.

### Spring Physics Recommended Values

Based on Motion documentation and UI/UX best practices:

| Section | Stiffness | Damping | Mass | Stagger (ms) | Rationale |
|---------|-----------|---------|------|--------------|-----------|
| Home Hero entrance | 200 | 25 | 1 | 80ms | Gentle entrance, staggered badge > headline > subtitle > CTA |
| Home CTA entrance | 180 | 22 | 1 | 0 (single element) | Slightly softer for below-fold |
| Landing Hero entrance | 200 | 25 | 1 | 80ms | Match home hero feel |
| StatsSection reveal | 200 | 25 | 1 | 60ms per stat | Tight stagger for 4 stat items |

These values produce a "gentle spring" feel -- no visible bounce but natural deceleration. Stagger at 60-80ms creates a perceptible wave without feeling slow.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `import { motion } from "framer-motion"` | `import { motion } from "motion/react"` | 2025 (Motion v12) | Package renamed; same API. Project already uses `"motion/react"`. |
| Full `motion` component (34kb) | `LazyMotion` + `m` component (4.6kb) | Motion v4+ | Significant bundle reduction. Existing islands do NOT use LazyMotion -- new islands should. |
| CSS `@keyframes background-size` for gradients | CSS `@keyframes background-position` for gradients | 2024-2025 | `background-position` is cheaper to animate than `background-size` |
| `framer-motion` + `motion` dual packages | `motion` package only | 2025 | `framer-motion` is now a re-export of `motion`. Project has both installed -- `motion` is canonical. |

**Deprecated/outdated:**
- `framer-motion` package import path -- still works but `"motion/react"` is canonical. Project already migrated.
- `ViewTransitions` from Astro -- replaced by `ClientRouter` in Astro 5+. Not relevant here (MPA site, no client router).

## Open Questions

1. **Existing Motion islands lack `useReducedMotion`**
   - What we know: `lamp.tsx`, `text-generate-effect.tsx`, `background-beams.tsx` do NOT call `useReducedMotion()`. They also animate `width` (lamp) which violates project rules.
   - What's unclear: Whether Phase 3 scope includes retrofitting accessibility to existing islands or only ensuring new ones comply.
   - Recommendation: Phase 3 should add `useReducedMotion()` to new islands only. Flag existing island accessibility gaps for Phase 6 QA.

2. **`framer-motion` vs `motion` dual installation**
   - What we know: `package.json` lists both `"framer-motion": "^12.38.0"` and `"motion": "^12.38.0"`. All imports use `"motion/react"`.
   - What's unclear: Whether `framer-motion` is needed at all (it re-exports `motion`).
   - Recommendation: Leave both for now. Removing `framer-motion` is a cleanup task for Phase 6 QA (verify no deep dependency needs it).

3. **Stats data structure for count-up**
   - What we know: Stats are hardcoded strings like `"+5.000"`, `"26"`, `"10+"`, `"7"` in StatsSection.astro.
   - What's unclear: The exact parsing rules for each format.
   - Recommendation: Create a `parseStatValue` helper that extracts numeric target, prefix, suffix, and thousands separator from the display string. Pass parsed values to the React island.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Bun | Build/dev/lint | Yes | 1.3.11 | -- |
| Motion 12 | Spring reveals, count-up | Yes | 12.38.0 | -- |
| React 19 | Islands runtime | Yes | 19.2.4 | -- |
| Google Chrome | Lighthouse perf validation | No | -- | Use production Lighthouse via PageSpeed Insights API or skip local audit |

**Missing dependencies with no fallback:**
- None. All required tools are available.

**Missing dependencies with fallback:**
- Google Chrome not available locally for Lighthouse. Use `bunx astro check && bun run build` as validation gate. Performance validation (D-15: Lighthouse >= 90) can be verified post-deploy or via CI.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None (no unit test runner) |
| Config file | None |
| Quick run command | `bun run lint && bunx astro check` |
| Full suite command | `bun run lint && bunx astro check && bun run build` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| VIS-01 | Aurora uses navy/gold colors | Build + visual | `bun run build` (no build errors) | N/A |
| VIS-02 | Landing heroes have mesh gradient | Build + visual | `bun run build` | N/A |
| VIS-03 | glass-card refined, glass-card-bright exists | Build + lint | `bun run lint && bun run build` | N/A |
| VIS-04 | ProductsGrid cards have mousemove glow | Build + visual | `bun run build` | N/A |
| VIS-05 | 4 sections use Framer Motion spring reveals | Build + type check | `bunx astro check && bun run build` | N/A |
| VIS-06 | All 4 button variants have hover glow | Build + visual | `bun run build` | N/A |
| ADV-05 | StatsSection count-up animates numbers | Build + type check | `bunx astro check && bun run build` | N/A |
| D-15 | Lighthouse >= 90 | Manual / CI | Lighthouse audit (no local Chrome) | N/A |
| D-16 | useReducedMotion in all new islands | Code review + type check | `bunx astro check` | N/A |

### Sampling Rate
- **Per task commit:** `bun run lint && bunx astro check`
- **Per wave merge:** `bun run lint && bunx astro check && bun run build`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- None. No test framework to configure. Validation relies on existing gates: lint, type check, build.

## Project Constraints (from CLAUDE.md)

**Required tools and gates:**
- Package manager: Bun only. Never npm/yarn/pnpm.
- Lint: `bun run lint` (Biome + oxlint). Pre-commit hook via Lefthook.
- Type check: `bunx astro check`
- Build: `bun run build`

**Forbidden patterns:**
- NEVER use emojis as icons -- Lucide React SVG only.
- NEVER hardcode content in components -- use Content Collections.
- NEVER add React Islands without justification -- Astro zero-JS default.
- NEVER use SPA routing -- full page reload (MPA).
- NEVER animate width/height/top/left -- use transform/opacity only.
- NEVER hardcode hex values -- always use Tailwind tokens from `@theme`.
- NEVER use npm/yarn/pnpm.

**Coding conventions:**
- Tailwind v4 via Vite plugin. Custom tokens in `src/styles/global.css` using `@theme {}`.
- New utilities via `@utility` directive in `global.css`.
- `client:visible` for below-fold islands, `client:idle` for non-critical above-fold.
- Commit format: Conventional Commits.
- `prefers-reduced-motion` coverage mandatory for all animations.
- Mobile infinite-animation disable at `max-width: 768px`.

**Specific to Phase 3:**
- Islands that animate via Motion must import from `"motion/react"` (existing pattern).
- New islands should use `LazyMotion` + `m` from `"motion/react-m"` for bundle optimization.
- The `data-reveal` system in Layout.astro must be preserved for non-Motion sections.
- `glass-card` modifications must not break existing usage across the site.

## Sources

### Primary (HIGH confidence)
- `motion` package (installed v12.38.0) -- verified via `bun pm ls`
- [LazyMotion docs](https://motion.dev/docs/react-lazy-motion) -- API for `domAnimation`, `m` component, bundle optimization
- [Reduce bundle size](https://motion.dev/docs/react-reduce-bundle-size) -- `LazyMotion` 4.6kb vs `motion` 34kb, tree-shaking strategies
- [useReducedMotion docs](https://motion.dev/docs/react-use-reduced-motion) -- import from `"motion/react"`, returns boolean
- [useInView docs](https://motion.dev/motion/use-in-view/) -- `once`, `amount`, `margin` options, ref-based
- `src/styles/global.css` -- verified current glass-card, data-reveal, reduced-motion implementation
- `src/components/ui/aurora-background.tsx` -- verified current Aceternity aurora with blue/indigo vars
- `src/components/ui/lamp.tsx`, `text-generate-effect.tsx` -- verified existing `"motion/react"` import pattern

### Secondary (MEDIUM confidence)
- [Animated Counter (buildui.com)](https://buildui.com/recipes/animated-counter) -- useMotionValue + useTransform count-up pattern
- [CSS mesh gradient techniques](https://www.lexo.ch/blog/2025/01/animating-gradients-with-pure-css/) -- background-position animation approach
- [Spring physics best practices](https://blog.maximeheckel.com/posts/the-physics-behind-spring-animations/) -- stiffness/damping/mass guidelines
- Motion transition docs -- spring defaults (stiffness: 100, damping: 10, mass: 1); recommended adjustment to 200/25/1

### Tertiary (LOW confidence)
- AnimateNumber from `motion-plus/react` -- confirmed as paid/premium component. NOT recommended for this project.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all packages verified as already installed, imports confirmed in codebase
- Architecture: HIGH -- patterns derived from existing code + official Motion docs
- Pitfalls: HIGH -- identified from actual codebase analysis (data-reveal conflict, aurora dark classes, stats parsing)
- Performance: MEDIUM -- mesh gradient performance on mobile is theoretical; needs validation post-implementation

**Research date:** 2026-03-26
**Valid until:** 2026-04-25 (stable domain, no fast-moving changes expected)
