---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: in_progress
last_updated: "2026-03-26T16:24:58.000Z"
progress:
  total_phases: 6
  completed_phases: 2
  total_plans: 6
  completed_plans: 4
---

# Project State

**Project:** Portal Grupo US — Enhancement Milestone v2  
**Initialized:** 2026-03-25  
**Status:** In progress — Phase 3 Plans 01+02 complete (CSS foundation + micro-interactions), advancing to Plan 03

## Project Reference

See: `.planning/PROJECT.md` (updated 2026-03-26)

**Core value:** Excelência percebida em segundos — design, copy e jornada claros; conversão via WhatsApp **Laura (+55 62 9470-5081)** quando aplicável.

**Current focus:** Phase 3 — Visual Uplift & Animation System. Plans 01 (CSS foundation) and 02 (micro-interactions) complete. Plan 03 (Motion reveals) remains.

## Active Milestone

**v2 Enhancement** — visual, SEO, ilhas pontuais (6 fases no `ROADMAP.md`; vários itens já antecipados ou superseded).

## Phase Progress (realista)

| Phase | Name | Status |
|-------|------|--------|
| 1 | Technical Debt & Foundation | **Parcial** — debug removido; 404 OK; fonts API OK (Google provider); **sem** ClientRouter por decisão MPA |
| 2 | Content & Copy Overhaul | **Completo (02-01 a 02-03)** — accents, product copy, SEO meta descriptions (all 8 pages ≥120 chars), team bios enriched |
| 3 | Visual Uplift & Animations | **In progress** — Plans 01 (CSS foundation) + 02 (micro-interactions) complete; Plan 03 (Motion reveals) pending |
| 4 | React Islands | Parcial — ilhas Aceternity na home/CTA; `JourneyTimeline` é **`.astro`**, não `.tsx` |
| 5 | SEO Technical Layer | Parcial — JSON-LD org/breadcrumb; falta Course/Product per page etc. |
| 6 | QA & Ship | Recorrente a cada release |

## Key Context for Future Sessions

- **WhatsApp:** `src/lib/whatsapp.ts` — não duplicar `wa.me/55…` em componentes
- **Rotas:** 8 páginas em `src/pages/` + 5 redirects; landings “full” no repo: `curso-auriculo`, `mentoria-black-neon`
- **Codebase map:** `.planning/codebase/` — **STACK.md** e **STRUCTURE.md** atualizados 2026-03-26
- **Jornada:** curso-auriculo → comunidade-us → trintae3 → mentoria-black-neon → otb
- **Gates:** `bun run lint` + `bunx astro check` + `bun run build`
- **Integridade:** `bun run check:external-urls` após mudar redirects ou `externalSiteUrl`

## Artifacts

- `.planning/PROJECT.md` — requisitos e estado sincronizado
- `.planning/REQUIREMENTS.md` — IDs + traceability (atualizar status com git)
- `.planning/ROADMAP.md` — fases; notas de supersession onde necessário
- `.planning/codebase/*` — mapa técnico
- `evals/site/**` — experimentos /evolve comerciais
- `AGENTS.md` — regras canônicas do repo (MPA, WhatsApp, collections)

## Decisions (Phase 02)

- COPY-03 complete: all 8 content pages have unique meta descriptions >=120 chars; legal pages upgraded from placeholders (34/36 chars) to 165/197 chars
- COPY-04 complete: team bios enriched with source-verified credentials -- CVO+CEEN+UFG for Sacha, "Mago das Financas"+CFO for Mauricio, TRINTAE3 curadoria for Raquel
- Raquel bio intentionally conservative -- limited by available source material per RESEARCH.md; stakeholder input may enrich further

## Decisions (Phase 03, Plans 01+02)

- Removed invert filter trick from aurora-background.tsx -- site is always dark navy, no light mode toggle
- Used Tailwind v4 arbitrary shadow syntax hover:shadow-[...] for button variant glows instead of separate utility classes
- Kept glass-card border at 20% gold (no animated shimmer) per D-07 decision -- shimmer deferred
- Mousemove glow uses CSS custom properties (--mouse-x/--mouse-y) + vanilla JS inline script, no React Island
- Mobile menu transition uses CSS translate + opacity + visibility (300ms ease-out) replacing hidden/flex toggle

---
*Last updated: 2026-03-26 (Phase 03, Plans 01+02 complete -- CSS foundation + micro-interactions)*
