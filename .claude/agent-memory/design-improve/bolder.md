---
name: design-improve-bolder
description: Impeccable bolder (phase 2/5) of the Grupo US institutional HOME — Hero Blue Trap resolved (aurora→intentional Navy/Gold hero-backdrop), display-scale headline hierarchy, stats/ProgramsCompare/About amplified. Navy/Gold + all islands preserved.
metadata:
  type: project
---

# design-improve — PHASE 2/5: BOLDER (impeccable) — HOME

> Supersedes the prior aula-trintae3-era bolder record (different project/components).

## PHASE COMMITMENT
- Register: PREMIUM/RESTRAINED institutional — boldness via hierarchy, scale ratios, depth and intentional atmosphere, NOT theatrics.
- Resolved Phase-1 Blue Trap FLAG: removed the generic aurora (`repeating-linear-gradient` + `mix-blend-difference`) and replaced with an intentional Navy/Gold composition (`hero-backdrop` static wash + slow `hero-filament` gold cone + existing Spotlight). Activated the unused `--text-display` scale on the hero h1.
- Amplified hierarchy: hero display headline, larger gold stats (5xl→7xl), bolder SectionHeading rule, depth + gold-accent rhythm on ProgramsCompare, 7/5 asymmetric About split + depth-5 portrait.
- Stays untouched: Navy/Gold token anchors, all React islands (none added/removed), motion canon, reduced-motion plumbing, ALL copy (no content-drift schema change — confirm-first, deferred).

## Files touched (absolute) + one-line diff
- `F:\Projetos\gpus-site\src\styles\global.css` — added `hero-backdrop` + `hero-filament` utilities + `hero-drift` keyframe (token-only; reduced-motion + mobile fallbacks).
- `F:\Projetos\gpus-site\src\components\home\Hero.astro` — dropped AuroraBackground; section = `hero-backdrop` + decorative `hero-filament`; h1 uses `--text-display` clamp, tighter leading/tracking, badge tracking+backdrop-blur; max-w-5xl, more dramatic vertical rhythm.
- `F:\Projetos\gpus-site\src\components\ui\text-generate-effect.tsx` — inner size `text-2xl`→`text-[length:inherit]` (+ fallback `<p>`) so parent `--text-display` controls the animated layer.
- `F:\Projetos\gpus-site\src\components\shared\SectionHeading.astro` — accent rule `h-0.5 w-15`→`h-1 w-20 rounded-full gold-glow`.
- `F:\Projetos\gpus-site\src\components\cinematic\ProgramsCompare.astro` — table shell `depth-4` + `border-gold/25`; header `border-b-2 border-gold/40` bold gold caps; rows `group` + left gold accent border on hover; program name `text-lg`→`text-xl`.
- `F:\Projetos\gpus-site\src\components\ui\AnimatedStats.tsx` — number scale `4xl/5xl`→`5xl/6xl/7xl`, stronger glow, uppercase tracked labels; dividers `gold/10`→`gold/25`.
- `F:\Projetos\gpus-site\src\components\home\AboutPreview.astro` — split `grid-cols-2`→`grid-cols-[7fr_5fr]`; h2 uses `--text-h1` clamp; portrait `border-gold/25 depth-5`; badge tracking up.

## Gold budget self-estimate
~7-9% surface. Gold concentrated on hero filament/spotlight + badge, stats numbers (hero moment), SectionHeading rule, ProgramsCompare header caps + row hover accent, About badge/portrait edge. Backgrounds stay Navy-dominant. Within ≤10% premium ceiling.

## DEFERRED items (later phases)
- **animate**: section-to-section atmosphere/transitions; ProgramsCompare row reveal stagger; SectionHeading divider draw-in; stats count-up shimmer.
- **colorize** (content step): Stats numbers + About prose → home-narrative.json (schema-shape = CONFIRM FIRST — NOT done here).
- **overdrive**: StatsSection divider motion / gold glow pulse rhythm.
- Flags (content): typos "estagios"/"Experiencias" in JourneyTimeline.tsx; `aurora-background.tsx` export now orphaned (harmless — remove in cleanup).

## Maestro 6-gate self-check
- **Safe Split** — PASS. Hero center-staggered (massive display headline); About now 7/5 asymmetric (was near-50/50).
- **Bento Trap** — PASS. No bento; ProgramsCompare is a justified comparison table.
- **Blue Trap** — RESOLVED. Aurora/mesh AI tell removed; `hero-backdrop` = deliberate single-source gold-dawn + navy-depth on brand tokens. No fintech blue/purple.
- **Line Trap** — PASS. SectionHeading rule + stat dividers + ProgramsCompare borders are hierarchy/structure markers, not filler.
- **Glass/glow w/o intent** — PASS. depth-4/5, glass-card(-bright), gold-glow ride layered-depth tokens on real content; hero-filament is the intentional hero light source.
- **prefers-reduced-motion** — PASS. `hero-filament` animation killed under reduced-motion + mobile; islands branch on `useReducedMotion`; global block intact.

## Hex scan
Touched component files: 0 hardcoded hex. global.css hex all inside `@theme`. PASS.

## Gate
`bunx astro check` → 0 errors, 0 warnings on touched files (pre-existing `z` deprecation hints in protected content.config.ts only). Did NOT run build/lint/verify per task constraints.
