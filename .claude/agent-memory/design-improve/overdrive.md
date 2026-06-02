---
name: design-improve-overdrive
description: Impeccable overdrive (phase 5/5, FINAL) of the Grupo US institutional HOME — five scroll-separated drama peaks (hero filament ignite + layered deep echo, stat-number glow breathe, section seam atmosphere bloom on reveal via :has(), CTA climax halo, compare-row depth-on-hover). All transform/opacity/filter/box-shadow only; reduced-motion + mobile guarded; zero new hex; gold budget held. All 6 Maestro gates re-pass.
metadata:
  type: project
---

# design-improve — PHASE 5/5: OVERDRIVE (impeccable, FINAL) — HOME

> Supersedes the prior aula-trintae3-era overdrive record (different project).
> Register = brand (institutional landing). Did NOT undo animate's reveal system,
> colorize's depth/seam color, or any of the 6 React islands.

## PHASE COMMITMENT
Five surgical drama peaks placed at DIFFERENT scroll depths so the viewer sees at most one
breathing element at a time — focus, not noise (overdrive.md "layering competing extraordinary
moments creates noise"). All compositor-safe (opacity/transform/filter/box-shadow), all degrade
under reduced-motion AND ≤768px, zero new hex (every value color-mix of Navy/Gold tokens). No new
island, no shadow/blur spam beyond intent, no copy/schema change. The page was already motion-dense
from animate; overdrive deepens atmosphere and gives each scroll act a signature beat rather than
adding scattered micro-interactions.

## Files touched (absolute) + one-line diff
- `F:\Projetos\gpus-site\src\styles\global.css` — added: `hero-ignite` one-shot keyframe + `hero-filament-deep` utility (second offset filament, ignites then breathes on offset cycle); `seam-bloom` utility (radial gold wash above seam, lifts via `:has([data-reveal].revealed)`); `stat-glow-breathe` keyframe + `stat-glow` utility (numeral text-shadow swell, resting glow baked in); `cta-halo-breathe` keyframe + `cta-halo` utility (climax box-shadow halo, z-index:-1); `[data-compare-row]:hover` box-shadow depth lift (transform left free for cascade). Every new block has a `@media (max-width:768px)` + `@media (prefers-reduced-motion: reduce)` off-switch with a static resting state.
- `F:\Projetos\gpus-site\src\components\home\Hero.astro` — added a `hero-filament-deep` aria-hidden layer beneath the primary `hero-filament` cone (layered light source).
- `F:\Projetos\gpus-site\src\components\cinematic\ProgramsCompare.astro` — section gets `seam-bloom`; inner container `relative z-[1]` (rides above bloom); row drops redundant Tailwind transition (now owned by the `[data-compare-row]` rule incl. box-shadow).
- `F:\Projetos\gpus-site\src\components\home\AboutPreview.astro` — section gets `seam-bloom`; inner grid `relative z-[1]`.
- `F:\Projetos\gpus-site\src\components\home\StatsSection.astro` — section gets `seam-bloom`; inner container `relative z-[1]` (note: AnimatedStats uses motion/react useInView, NOT [data-reveal], so its bloom stays at the dim static resting state — graceful, no breakage).
- `F:\Projetos\gpus-site\src\components\ui\AnimatedStats.tsx` — numeral span: removed inline `style` textShadow, added `stat-glow` class (resting glow + breathe owned by CSS so the count-up logic stays untouched).
- `F:\Projetos\gpus-site\src\components\home\CTASection.astro` — CTA glass card gets `cta-halo` (single climax surface).

## Drama inventory (peak → property → reduced-motion + mobile fallback)
| Peak moment | Property animated | Reduced-motion + mobile fallback |
|---|---|---|
| Hero filament ignite + layered deep echo | opacity + scale + filter blur (one-shot ignite, then loop) | both `@media` → animation:none, opacity:0.6, transform:none, blur:60px (static layered glow) |
| Stat numeral glow breathe | text-shadow spread/intensity (paint only) | both `@media` → animation:none; `stat-glow` carries a baked resting text-shadow so glow persists |
| Section seam atmosphere bloom | opacity + scaleY of a `::before` wash, lifted on `:has(.revealed)` | reduced-motion → opacity:0.6, transform:none, transition:none; sections w/o [data-reveal] (Stats) stay dim static |
| CTA climax halo | opacity + box-shadow swell on `::after` (z-index:-1) | both `@media` → animation:none, opacity:0.5 (static halo) |
| Compare-row depth on hover | box-shadow only (transform reserved for cascade reveal) | hover effect cosmetic; global reduced-motion ~0ms transition |

## Maestro Template Test RESULT (post-overdrive, full re-run)
- **Safe Split** — PASS. No split-hero introduced; Hero is centered typographic, AboutPreview stays 7/5 asymmetric. Untouched structurally.
- **Bento Trap** — PASS. No bento; ProgramsCompare remains a justified comparison table.
- **Blue Trap** — PASS. Every new value is Navy/Gold token color-mix. Zero fintech-blue / purple / new hex (diff-verified clean).
- **Line Trap** — PASS. No side-stripe accents added; seam-bloom is a full-width centered radial WASH (not a hairline/stripe); compare-row depth is box-shadow, not a 4–8px border. The colorize-era stripe ban stays remediated.
- **Glass-intent** — PASS. No new glass surface; CTA reuses the single existing `glass-card-bright` climax. cta-halo is a box-shadow bloom, not a new blur layer.
- **Glow-intent** — PASS (dialed for focus). Glows are scroll-separated (hero top / stats mid / CTA bottom) so they never stack in one viewport; each marks a real act of the page (atmosphere → proof → close). No decorative-orphan glow. seam-bloom default opacity kept low (0.35) so seams read as transitions, not flares.
- **Template Test overall** — PASS. Layered cinematic Navy/Gold atmosphere that ignites, a living stats band, blooming section transitions, and a climax halo on a Playfair-led institutional page ≠ a generic Vercel/Stripe template. No FAIL gates; nothing needed dialing back (the focus discipline was built in from the start rather than retrofitted).

## Gold budget self-estimate
Still ≤ ~10% surface. Overdrive added NO new gold fill — only intensified existing gold light (filament, numeral glow, seam wash, CTA halo) which is atmospheric/transient, not surface coverage. Gold surface coverage unchanged from colorize; the perceived gold *presence* rose via motion/glow (impact), which is exactly gold-as-impact, not gold-as-flood.

## Hex scan (touched files)
Components: `NO_HEX_IN_COMPONENTS` (grep clean, SVG paths excluded). global.css diff: `NO_NEW_HEX_IN_CSS_DIFF`. All additions color-mix of `--color-*`. PASS.

## Gate
`bunx astro check` → **0 errors, 0 warnings, 121 hints** (hints = pre-existing `z` ts(6385) deprecation in protected content.config.ts — not mine). Did NOT run lint/build/verify or commit per task constraints (chain controller runs /verify quick next).

## Residual risk for final /verify (browser pass)
- **Simultaneous-glow audit:** confirm in browser that no single viewport shows hero filament + stat-glow + cta-halo together at any scroll position (they're spaced by full sections; expected clear, but verify on a tall monitor).
- **`:has()` support:** seam-bloom lift relies on `:has()` (all current evergreen browsers). Fallback if unsupported = bloom stays at dim resting state (0.35) — still looks intentional, no breakage.
- **CTA halo z-index:-1:** verify the halo paints behind the glass card and is not clipped by the `overflow-hidden` lamp section ancestor; if clipped, halo simply won't bleed past the card edge (acceptable, not broken). CLS=0 preserved (all effects absolute/pseudo, no layout).
