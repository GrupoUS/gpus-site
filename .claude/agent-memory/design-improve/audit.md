# Audit — Grupo US institutional HOME (design-improve phase 1/5)

## PHASE COMMITMENT
- This pass is DIAGNOSTIC + cheap correctness fixes only. No visual/drama changes.
- Fixed in-phase: missing `<h1>` (SEO/a11y) and fixed-header anchor-obscuring (WCAG 2.4.11).
- Stays: Navy/Gold tokens, all React islands, motion canon, reduced-motion plumbing (all sound).
- Deferred to later phases: Hero Aurora/mesh "Blue Trap" tell, hardcoded marketing copy (Stats/About — schema confirm-first), bolder hierarchy + section atmosphere.

## Current-state map (one line/section)
- **Header** — solid: real `<a>`/`<button>`, ARIA, Esc-close, focus return, scroll border. Fixed @60px.
- **Hero** — AuroraBackground + Spotlight + TextGenerateEffect, 3 idle islands. NOW has real `<h1>` (was missing). AI-slop "aurora/mesh" tell — defer to colorize/bolder.
- **NarrativeChapters** (React client:visible) — scroll-scrubbed motion, reduced-motion fallback, multiple `<h2>` w/ aria-labelledby. Solid.
- **ProgramsCompare** (Astro) — desktop table / mobile `<details>` accordion, real anchors, external rel. Solid. Weak: dense table, low drama.
- **JourneyTimeline** (React client:visible) — animated progress line, mobile snap-carousel + dots, reduced-motion grid fallback. Solid. Copy typos ("estagios","Experiencias") — flag, lives in .tsx not JSON.
- **TestimonialCarousel** (React client:visible) — drag+autoplay, dot buttons w/ aria-label, reduced-motion grid. Solid.
- **StatsSection** (Astro) — AnimatedStats count-up, sr-only h2, glass-card. Weak: numbers hardcoded in `.astro` (content drift).
- **AboutPreview** (Astro) — data-reveal split, real alt, lazy img + dims. Weak: body prose hardcoded in `.astro` (content drift).
- **CTASection** (Astro) — LampBackdrop + glass-card-bright + WhatsApp via helper. Solid, intentional premium depth.
- **Footer** — semantic, labeled social/contact, real anchors, legal nav. Solid.

## Defects fixed in-phase
- `src/components/home/Hero.astro:22` — no `<h1>` on page (headline was `<div>/<p>` via TextGenerateEffect). Wrapped in real `<h1>`: sr-only text + `aria-hidden` animated layer (single semantic h1, no double-read). [P1 a11y/SEO]
- `src/styles/global.css:64` — `scroll-behavior:smooth` + fixed 60px header, no `scroll-padding-top` → in-page anchors (`#programas`,`#chapter-1`) land under header. Added `scroll-padding-top:5rem`. [P1 WCAG 2.2 SC 2.4.11]

## Files touched (absolute)
- `F:\Projetos\gpus-site\src\components\home\Hero.astro` — headline now real `<h1>` (sr-only + aria-hidden animated span).
- `F:\Projetos\gpus-site\src\styles\global.css` — added `scroll-padding-top:5rem` to `html`.

Hex scan on touched files: 0 outside `@theme`. PASS.

## Deferred opportunities
| Opportunity | Owning phase | Target |
|---|---|---|
| Hero Aurora/mesh bg reads AI-generic (Blue Trap tell) — replace w/ intentional Navy/Gold atmosphere or typographic hero | colorize / bolder | Hero.astro + ui/aurora-background |
| Bolder headline hierarchy (`--text-display` token unused; h1 only text-6xl) | bolder | Hero.astro, global.css scale |
| ProgramsCompare table flat/dense — depth, row reveal, gold accent rhythm | animate / bolder | ProgramsCompare.astro |
| StatsSection more dramatic (gold glow rhythm, divider motion) | overdrive | StatsSection / AnimatedStats |
| Richer section-to-section atmosphere/transitions across home | animate | index.astro shells |
| Stats numbers + About prose hardcoded → home-narrative.json (schema-shape = CONFIRM FIRST) | colorize (content step) | StatsSection.astro, AboutPreview.astro, home-narrative.json |
| Copy typos "estagios"/"Experiencias" (sem acento) in island | content (flag) | JourneyTimeline.tsx |

## Maestro self-check (6 gates)
- **Safe Split** — PASS. Hero center-staggered; About 7-5 grid, not static 50/50.
- **Bento Trap** — PASS. No bento on landing; ProgramsCompare is a justified comparison table.
- **Blue Trap** — FLAG (deferred). Hero AuroraBackground = mesh/aurora gradient AI tell; palette is Navy/Gold (not fintech blue) so not a hard fail, but bg lacks intent. Owned by colorize/bolder.
- **Line Trap** — PASS. JourneyTimeline line is meaningful scroll-linked progression w/ nodes, not decorative.
- **Glass/glow w/o intent** — PASS. glass-card / glass-card-bright / LampBackdrop / gold glow ride layered depth tokens (depth-4/5/6) + real content — intentional premium depth.
- **prefers-reduced-motion** — PASS. Global CSS block + every island (Narrative, Journey, Testimonial, AnimatedStats, TextGenerate) branches on `useReducedMotion`.
