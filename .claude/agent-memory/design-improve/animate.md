---
name: design-improve-animate
description: Impeccable animate (phase 3/5) of the Grupo US institutional HOME — filled the pure-Astro motion gaps the React islands didn't cover: ProgramsCompare desktop table row cascade + hover gold-sweep, SectionHeading divider draw-in, AboutPreview portrait scroll parallax. CSS + one vanilla rAF script; no new islands; Navy/Gold + all islands preserved.
metadata:
  type: project
---

# design-improve — PHASE 3/5: ANIMATE (impeccable) — HOME

> Supersedes the prior aula-trintae3-era animate record (different project/components).

## PHASE COMMITMENT
- The 6 React islands (HeroEntrance, AnimatedStats, NarrativeChapters scrub, JourneyTimeline scroll-line, TestimonialCarousel, CTA lamp) were ALREADY richly animated with reduced-motion branches — left untouched.
- Spent the motion budget on the STATIC pure-Astro gaps: the desktop ProgramsCompare table had ZERO reveal; SectionHeading divider was static; AboutPreview portrait was flat. These are the visible-movement wins.
- Layered ON TOP of gpus-theme with CSS-only motion + one tiny vanilla rAF parallax script. No new dependency, no new island, no shadcn, no copy/schema change.
- Reused the existing hardened `[data-reveal]` IntersectionObserver + `<noscript>` fallback in Layout.astro (did not duplicate it).

## Files touched (absolute) + one-line diff
- `F:\Projetos\gpus-site\src\styles\global.css` — added `row-rise` keyframe + `[data-row-reveal]` cascade (parent-`.revealed`-driven, `--row-index` stagger, `both` not `forwards`), `.heading-rule` scaleX draw-in, `[data-compare-row]::before` gold sweep + arrow nudge, `[data-parallax]` transform composing `--parallax-y`+`--parallax-scale`; reduced-motion neutralizes y-offset/sweep/rule, keeps scale.
- `F:\Projetos\gpus-site\src\components\shared\SectionHeading.astro` — divider gets `heading-rule` class + per-align `origin-*` so the gold rule grows from a point on reveal.
- `F:\Projetos\gpus-site\src\components\cinematic\ProgramsCompare.astro` — desktop table shell now `data-reveal="up"`; each row `data-compare-row` + `data-row-reveal` + `style="--row-index:N"`; CTA arrow tagged `data-row-arrow`; row transition narrowed to border/bg (transform freed for cascade).
- `F:\Projetos\gpus-site\src\components\home\AboutPreview.astro` — portrait split: outer keeps `data-reveal="right"`, NEW inner `[data-parallax]` layer (`--parallax-scale:1.08`, speed 0.06) owns the free transform; added a self-terminating, try/catch'd, rAF-throttled vanilla parallax `<script>` (no-op under reduced-motion / ≤768px).

## Motion inventory
| Animation | Trigger | Property | Reduced-motion fallback |
|---|---|---|---|
| ProgramsCompare row cascade | shell `.revealed` | opacity + translateY (`row-rise`, `both`) | rows opacity:1, no transform/anim |
| Compare row gold sweep | row :hover | ::before translateX + opacity | global block ~0ms (cosmetic) |
| Compare CTA arrow nudge | row :hover | arrow translate(2px,-2px) | transition ~0ms |
| SectionHeading divider draw-in | heading `.revealed` | scaleX(0→1) origin per-align | rule at scaleX(1), no transition |
| AboutPreview portrait parallax | scroll near viewport | translate3d Y (rAF JS) | script no-ops; CSS scale-only, y off |

## DEFERRED items (later phases)
- **colorize** (content step, CONFIRM-FIRST schema): Stats numbers + AboutPreview prose → home-narrative.json. NOT touched.
- **overdrive**: StatsSection divider motion / gold glow pulse rhythm; possible hero filament intensity ramp; section-to-section atmosphere transitions if more drama wanted.
- Flags (content, not motion): typos "estagios"/"Experiencias" in JourneyTimeline.tsx; orphaned `aurora-background.tsx` export (harmless cleanup).

## Maestro 6-gate self-check
- **Safe Split** — PASS. No new split-hero; AboutPreview stays 7/5 asymmetric.
- **Bento Trap** — PASS. No bento; ProgramsCompare is a justified comparison table.
- **Blue Trap** — PASS. All new motion uses Navy/Gold tokens (gold sweep, gold rule). No fintech blue / purple.
- **Line Trap** — PASS. Animated divider is the existing hierarchy rule (now draws in); row borders are structure markers.
- **Glass/glow w/o intent** — PASS. Sweep + arrow nudge + divider = state/feedback motion on real content; parallax = depth on brand portrait. No decorative-only glow added.
- **prefers-reduced-motion** — PASS on EVERY new animation: row cascade + heading rule + sweep neutralized in global + scoped `@media (prefers-reduced-motion: reduce)`; parallax script early-returns on reduce; CSS forces `--parallax-y` off (keeps scale so image fills). CLS=0 preserved (img width/height intact; parallax on inner over-scaled layer never shifts layout).

## Hex scan
Touched component files: 0 hardcoded hex (grep clean). global.css hex all inside `@theme`. PASS.

## Gate
`bunx astro check` → 0 errors, 0 warnings (only pre-existing `z` deprecation hints in protected content.config.ts). Did NOT run build/lint/verify per task constraints.
