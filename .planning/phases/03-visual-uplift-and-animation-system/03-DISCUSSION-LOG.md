# Phase 3: Visual Uplift & Animation System - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-26
**Phase:** 03-visual-uplift-and-animation-system
**Areas discussed:** Aurora hero palette, Glass-card evolution, Scroll-reveal approach, Card mousemove glow, Button hover refinement, Header animation, Performance budget, Reduced motion for FM

---

## Aurora Hero Colors

| Option | Description | Selected |
|--------|-------------|----------|
| Navy/gold aurora | Replace blue/indigo CSS vars with navy-lighter, gold, gold-light gradients | ✓ |
| Gold-only aurora | Aurora uses only gold tones — more dramatic, less variety | |
| Keep blue aurora | Default Aceternity blue/indigo for visual contrast | |

**User's choice:** Navy/gold aurora (Recommended)
**Notes:** None

## Landing Hero Backgrounds

| Option | Description | Selected |
|--------|-------------|----------|
| CSS mesh gradient | Animated mesh gradient via CSS keyframes, no React Island | ✓ |
| Static radial (enhanced) | Keep static approach, add more layers | |
| Shared aurora component | Reuse AuroraBackground React Island in landings | |

**User's choice:** CSS mesh gradient (Recommended)
**Notes:** None

## Glass-Card Evolution

| Option | Description | Selected |
|--------|-------------|----------|
| Refine existing + add variant | Tune glass-card, add glass-card-bright for CTA sections | ✓ |
| Deeper overhaul | Significantly rework with more transparency/refraction | |
| Glass-card is fine as-is | Just add bright variant | |

**User's choice:** Refine existing + add variant (Recommended)
**Notes:** None

### Glass-Card-Bright Usage

| Option | Description | Selected |
|--------|-------------|----------|
| CTA sections only | CTASection home + LandingCTA product pages | ✓ |
| Hero + CTA sections | Also hero content areas | |
| Claude decides | Implementer tests and picks | |

**User's choice:** CTA sections only (Recommended)
**Notes:** None

### Glass-Card Border FX

| Option | Description | Selected |
|--------|-------------|----------|
| Static border | Keep solid gold/20, card-hover-lift provides motion | ✓ |
| Shimmer on hover | Gold shimmer via conic-gradient on hover | |
| Claude decides | Implementer tests both | |

**User's choice:** Static border (Recommended)
**Notes:** None

## Scroll-Reveal Approach

| Option | Description | Selected |
|--------|-------------|----------|
| Keep CSS reveals | Zero JS, respect reduced motion, already deployed | |
| Migrate to Framer Motion | Spring physics everywhere, ~30KB bundle | |
| Hybrid approach | CSS reveals for most, Framer only for 2-3 key sections | ✓ |

**User's choice:** Hybrid approach
**Notes:** None

### Framer Motion Sections

| Option | Description | Selected |
|--------|-------------|----------|
| Home Hero entrance | Badge, headline, subtitle, CTA staggered spring | ✓ |
| Home CTA Section | Spring entrance for conversion CTA | ✓ |
| Landing Hero entrances | Badge, headline, subheadline on product landings | ✓ |
| StatsSection counters | Spring reveal for stats cards | ✓ |

**User's choice:** All four selected
**Notes:** None

### StatsSection Scope

| Option | Description | Selected |
|--------|-------------|----------|
| Spring reveal only | Numbers appear instantly, just Framer entrance | |
| Spring reveal + count-up | Also animate numbers 0 → final value (pulls ADV-05) | ✓ |
| Claude decides | If trivial include count-up, otherwise just reveal | |

**User's choice:** Spring reveal + count-up
**Notes:** Pulls ADV-05 into Phase 3 scope

## Card Mousemove Glow

| Option | Description | Selected |
|--------|-------------|----------|
| CSS custom props + inline script | Vanilla JS mousemove, CSS radial-gradient follows cursor | ✓ |
| Enhanced hover only | Skip cursor tracking, improve existing card-glow-hover | |
| React Island approach | React onMouseMove handler | |

**User's choice:** CSS custom props + inline script (Recommended)
**Notes:** None

### Glow Scope

| Option | Description | Selected |
|--------|-------------|----------|
| ProductsGrid only | Home page product cards only | ✓ |
| All hoverable cards | Every Card with hoverable=true | |
| Claude decides | Implementer tests both | |

**User's choice:** ProductsGrid only (Recommended)
**Notes:** None

## Button Hover Refinement

| Option | Description | Selected |
|--------|-------------|----------|
| Add glow shadow to all variants | Consistent gold glow across outline/ghost variants | ✓ |
| Buttons are fine as-is | Mark VIS-06 as already satisfied | |
| Deeper rework | Gradient backgrounds, animated borders | |

**User's choice:** Add glow shadow to all variants (Recommended)
**Notes:** None

## Header Animation

| Option | Description | Selected |
|--------|-------------|----------|
| Mobile menu transition | Slide-down + fade for mobile menu open/close | ✓ |
| Header is fine as-is | Desktop dropdown already smooth | |
| Full rework | Both desktop and mobile redesigned | |

**User's choice:** Mobile menu transition (Recommended)
**Notes:** Desktop dropdown already has slide+fade

## Performance Budget

| Option | Description | Selected |
|--------|-------------|----------|
| >= 90 Performance | Breathing room for Framer, Phase 6 targets 95 | ✓ |
| >= 85 Performance | More lenient, Phase 6 optimizes | |
| >= 95 Performance | Strict, may constrain Framer islands | |

**User's choice:** >= 90 Performance (Recommended)
**Notes:** None

## Reduced Motion for Framer Motion

| Option | Description | Selected |
|--------|-------------|----------|
| useReducedMotion() hook | Each island checks and renders static when true | ✓ |
| Claude decides implementation | Rule is set, implementer picks pattern | |

**User's choice:** useReducedMotion() hook (Recommended)
**Notes:** None

## Claude's Discretion

- Spring physics parameters (stiffness, damping, mass)
- Exact stagger timing between animated elements
- Mesh gradient color stops and animation timing
- StatsSection count-up easing and duration
- Mobile menu transition timing
- Whether to disable mousemove glow on touch devices

## Deferred Ideas

- Animated border shimmer on glass-card hover — discussed and rejected
- Mousemove glow on landing page cards — scoped out, ProductsGrid only
- Full Framer Motion migration for all data-reveal — rejected for hybrid approach
