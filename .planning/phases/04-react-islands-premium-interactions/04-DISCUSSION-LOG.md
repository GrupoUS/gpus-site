# Phase 4: React Islands — Premium Interactions - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-26
**Phase:** 04-react-islands-premium-interactions
**Areas discussed:** Island Justification, Journey Timeline, Testimonial Carousel, WhatsApp Floating Button

---

## Island Justification Bar

| Option | Description | Selected |
|--------|-------------|----------|
| All 4 areas | Discuss all gray areas | ✓ |

**User's choice:** Selected all 4 areas for discussion.
**Notes:** AGENTS.md requires justification for React Islands. All 3 were evaluated and approved with explicit justification.

---

## Journey Timeline

### Upgrade decision

| Option | Description | Selected |
|--------|-------------|----------|
| Keep Astro version | Skip ISLAND-01, save bundle | |
| Upgrade to React | Animated progress line, staggered nodes | ✓ |
| You decide | Claude evaluates | |

**User's choice:** Upgrade to React
**Notes:** User wants premium storytelling for the core 5-product journey.

### Layout style

| Option | Description | Selected |
|--------|-------------|----------|
| Animated progress line | Vertical line draws as user scrolls, spring node entrances | ✓ |
| Horizontal on desktop | Left-to-right timeline | |
| Keep layout, add springs | Same layout, just spring reveals | |

**User's choice:** Animated progress line (vertical)

### Node interaction

| Option | Description | Selected |
|--------|-------------|----------|
| Purely visual | Line and nodes are decorative only | |
| Nodes are clickable | Each node navigates to product page | ✓ |

**User's choice:** Nodes are clickable

### Mobile behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Stay vertical | Same vertical layout on mobile | |
| Horizontal scroll-snap | One stage at a time, swipe, progress dots | ✓ |

**User's choice:** Horizontal scroll-snap on mobile

---

## Testimonial Carousel

### Carousel type

| Option | Description | Selected |
|--------|-------------|----------|
| Full carousel (Recommended) | Framer Motion drag + autoplay + dots, replaces Testimonials.astro | ✓ |
| Enhance strip only | Keep Astro, add autoplay+dots via CSS/JS | |
| You decide | Claude evaluates | |

**User's choice:** Full carousel

### Card density

| Option | Description | Selected |
|--------|-------------|----------|
| One at a time | Single card visible, swipe cycles | |
| Multiple visible | 2-3 cards on desktop, 1 on mobile | ✓ |
| You decide | Claude picks | |

**User's choice:** Multiple visible on desktop

---

## WhatsApp Floating Button

### Visibility

| Option | Description | Selected |
|--------|-------------|----------|
| Always visible | Fixed from page load | |
| Scroll-triggered | Appears after ~500px scroll | ✓ |
| You decide | Claude decides per page type | |

**User's choice:** Scroll-triggered

### Scope (which pages)

| Option | Description | Selected |
|--------|-------------|----------|
| All pages | Global on every page | |
| Non-landing only | Skip landing pages with existing WhatsApp CTAs | |
| You decide | Claude evaluates redundancy | ✓ |

**User's choice:** Claude decides (evaluate redundancy)

### Message

| Option | Description | Selected |
|--------|-------------|----------|
| Per-page message | Product-specific on landings, default on others | ✓ |
| Single default | Always uses institutional default | |

**User's choice:** Per-page message

### Animation

| Option | Description | Selected |
|--------|-------------|----------|
| Subtle gold-pulse-glow | Pulsing gold shadow, disabled on mobile | ✓ |
| Static after entrance | Spring entrance only, hover glow | |
| You decide | Claude picks | |

**User's choice:** Subtle gold-pulse-glow

### Icon

| Option | Description | Selected |
|--------|-------------|----------|
| WhatsApp SVG | Brand icon, matches existing CTAs | ✓ |
| Lucide MessageCircle | Generic chat icon, follows Lucide-only rule | |

**User's choice:** WhatsApp SVG

---

## Claude's Discretion

- WhatsApp button scope on landing pages (redundancy evaluation)
- Spring physics parameters for all new islands
- Carousel autoplay pause behavior
- Progress line drawing timing
- Scroll threshold for WhatsApp button
- Whether to keep CTA buttons below clickable timeline nodes

## Deferred Ideas

- Animated border shimmer on glass-card (from Phase 3)
- Testimonial video support (new capability)
