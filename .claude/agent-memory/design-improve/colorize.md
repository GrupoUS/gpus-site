---
name: design-improve-colorize
description: Impeccable colorize (phase 4/5) of the Grupo US institutional HOME — refined COLOR STRATEGY on existing Navy/Gold tokens: navy depth-step rhythm (surface-recess/raise + section-seam) gives the flat pure-Astro sections tonal weight; gold-gradient on the AboutPreview focal word; fixed a Line-Trap (2px gold left-stripe → full hairline + gold tint on compare rows). Zero new hex; all token-derived color-mix.
metadata:
  type: project
---

# design-improve — PHASE 4/5: COLORIZE (impeccable) — HOME

> Supersedes the prior aula-trintae3-era colorize record (different project/components).

## PHASE COMMITMENT
- Strategy = **Committed Navy depth, Restrained gold** (per gpus-theme dark-first canon): navy owns the page; gold stays hierarchy/impact, well under ~10% surface.
- The page had a rhythm gap — island sections carry their own bg, but the pure-Astro ProgramsCompare + AboutPreview sat FLAT on body navy with no tonal step. Gave them deliberate light→dark cadence so sections read as distinct planes.
- Color introduced ONLY via existing semantic tokens + `color-mix` of the Navy/Gold palette. NO new hex anywhere.
- Fixed a colorize ABSOLUTE BAN (2px gold left-accent stripe on compare-row hover) → full hairline border + gold background tint.
- No copy/schema change (Stats/About JSON is confirm-first — untouched).

## Files touched (absolute) + one-line diff
- `F:\Projetos\gpus-site\src\styles\global.css` — added 3 token-derived utilities: `surface-recess` (navy→navy+black8% gradient, a deeper pool), `surface-raise` (navy-light28%→navy, a lifted panel), `section-seam` (1px gold@12% full-width top rule). All `color-mix` of existing tokens; 0 new hex.
- `F:\Projetos\gpus-site\src\components\cinematic\ProgramsCompare.astro` — section gets `surface-recess section-seam` (dense table = deeper plane); **Line-Trap fix**: row hover `border-l-2 border-transparent hover:border-gold` (2px side stripe) → `border border-transparent hover:border-gold/30 hover:bg-gold/[0.06]` (full hairline + tint).
- `F:\Projetos\gpus-site\src\components\home\AboutPreview.astro` — section gets `surface-raise section-seam` (authority/portrait = lifted panel); focal word `transformação` `text-gold` → `text-gradient-gold` (the section's one impact accent).
- `F:\Projetos\gpus-site\src\components\home\StatsSection.astro` — added `section-seam` to keep the seam cadence consistent (kept its existing `bg-navy-light/20` step).

## Color decisions (token → where → why)
- `surface-recess` (navy + black 8%) → ProgramsCompare: comparison table is dense/utilitarian; a darker pool lets gold row-accents + text pop and separates it from the brighter island above.
- `surface-raise` (navy-light 28%) → AboutPreview: the authority/portrait moment lifts toward the viewer; warmer/lighter plane frames the gold portrait wash.
- `section-seam` (gold @12%, full hairline top) → Compare + About + Stats: marks section seams with a faint gold thread — wayfinding, never a side stripe.
- `text-gradient-gold` → "transformação": single graduated-gold focal word = gold-as-impact at the right calm moment (CTA already gold-dense, left flat to respect dosage).
- `hover:bg-gold/[0.06]` + `hover:border-gold/30` on compare rows → state feedback via tint, replacing the banned stripe.

## Contrast check results (WCAG AA, computed)
- text-primary / surface-recess-top: **16.72:1** PASS
- text-muted / surface-recess-top: **6.81:1** PASS
- gold / surface-recess-top: **8.30:1** PASS
- text-primary / surface-raise-top: **15.60:1** PASS
- text-muted / surface-raise-top: **6.36:1** PASS
- gold / surface-raise-top: **7.75:1** | gold-light: **10.08:1** PASS (gradient word both stops ≥7.75)
- gold / navy (row-hover bg): **8.11:1** PASS
All ≥4.5:1 (body) and ≥3:1 (large/non-text). The darker recess raises ratios vs prior flat navy — no regression.

## BLOCKERS (missing color roles)
- **none.** Every needed role (navy depth steps, gold impact, gold seam, hover state tint) was expressible with existing tokens via `color-mix`. No status/error color needed on HOME (no form/feedback surface here; forms live on /contato, out of scope).

## Deferred items owned by overdrive
- Possible gold-glow pulse rhythm on StatsSection divider / section-to-section atmosphere transitions (drama, not color-strategy).
- Hero filament intensity ramp.
- Content-step (confirm-first, NOT color): Stats numbers + About prose → home-narrative.json; typos "estagios"/"Experiencias" in JourneyTimeline.tsx; orphaned aurora-background.tsx cleanup.

## Maestro 6-gate self-check
- **Safe Split** — PASS. No split-hero touched; AboutPreview stays 7/5 asymmetric.
- **Bento Trap** — PASS. No bento; ProgramsCompare is a justified comparison table.
- **Blue Trap** — PASS. All color is Navy/Gold token-derived; zero fintech-blue / purple / new hex.
- **Line Trap** — PASS + **REMEDIATED**: killed the 2px gold left-accent stripe on compare rows (the exact colorize ban) → full hairline + tint. `section-seam` is a full-width top rule, not a side stripe.
- **Glass/glow w/o intent** — PASS. No new glass/glow added; surfaces are flat tonal planes (depth via tone, not blur). Existing glass-card islands untouched.
- **prefers-reduced-motion** — N/A (no animation touched this phase; static color only). Reveal/parallax motion from phase 3 unchanged and still reduced-motion-guarded.

## Hex scan (touched files)
ProgramsCompare / AboutPreview / StatsSection: **0** hardcoded hex (grep clean). global.css additions: all `color-mix(var(--color-*)…)` — 0 hex outside `@theme`. PASS.

## Gate
`bunx astro check` → **0 errors, 0 warnings** (only pre-existing `z` deprecation hints in protected content.config.ts). Did NOT run build/lint/verify or commit per task constraints.
