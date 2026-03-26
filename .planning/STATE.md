---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: completed
last_updated: "2026-03-26T23:43:38.900Z"
progress:
  total_phases: 5
  completed_phases: 4
  total_plans: 11
  completed_plans: 12
---

# Project State

**Project:** Portal Grupo US — Enhancement Milestone v2
**Initialized:** 2026-03-25
**Status:** Milestone complete

## Project Reference

See: `.planning/PROJECT.md` (updated 2026-03-26)

**Core value:** Excelência percebida em segundos — design, copy e jornada claros; conversão via WhatsApp **Laura (+55 62 9470-5081)** quando aplicável.

**Current focus:** Phase 05 in progress; Plan 05-01 (JSON-LD + OTB landing + breadcrumbs) complete

## Active Milestone

**v2 Enhancement** — visual, SEO, ilhas pontuais (6 fases no `ROADMAP.md`; vários itens já antecipados ou superseded).

## Phase Progress (realista)

| Phase | Name | Status |
|-------|------|--------|
| 1 | Technical Debt & Foundation | **Parcial** — debug removido; 404 OK; fonts API OK (Google provider); **sem** ClientRouter por decisão MPA |
| 2 | Content & Copy Overhaul | **Completo (02-01 a 02-03)** — accents, product copy, SEO meta descriptions (all 8 pages ≥120 chars), team bios enriched |
| 3 | Visual Uplift & Animations | **In progress** — All 3 plans complete (CSS foundation + micro-interactions + Motion reveals); human-verify checkpoint pending |
| 4 | React Islands | **Complete (04-01 + 04-02)** — JourneyTimeline.tsx, TestimonialCarousel.tsx, WhatsAppFloatingButton.tsx (all 3 islands built and wired) |
| 5 | SEO Technical Layer | **In progress (05-01 complete)** — JSON-LD Course/Product/Event per page; OTB local landing; breadcrumbs 7/9; Plans 5.2+5.3 pending |
| 6 | QA & Ship | Recorrente a cada release |

## Key Context for Future Sessions

- **WhatsApp:** `src/lib/whatsapp.ts` — não duplicar `wa.me/55…` em componentes
- **Rotas:** 9 páginas em `src/pages/` + 4 redirects; landings "full" no repo: `curso-auriculo`, `mentoria-black-neon`, `otb`
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

## Decisions (Phase 03)

- Removed invert filter trick from aurora-background.tsx -- site is always dark navy, no light mode toggle
- Used Tailwind v4 arbitrary shadow syntax hover:shadow-[...] for button variant glows instead of separate utility classes
- Kept glass-card border at 20% gold (no animated shimmer) per D-07 decision -- shimmer deferred
- Mousemove glow uses CSS custom properties (--mouse-x/--mouse-y) + vanilla JS inline script, no React Island
- Mobile menu transition uses CSS translate + opacity + visibility (300ms ease-out) replacing hidden/flex toggle
- HeroEntrance uses client:idle (above-fold); other new Motion islands use client:visible (below-fold)
- Spring configs: Hero/Landing/Stats 200/25/1; CTA 180/22/1 (softer for below-fold)
- Count-up uses useMotionValue + direct DOM updates (zero React re-renders per frame)
- data-reveal removed ONLY from 4 Motion-controlled sections (D-08/D-09 hybrid approach preserved)
- LazyMotion + m pattern established for all new Motion islands (4.6kb vs 34kb)

## Decisions (Phase 04)

- Used `<section>` instead of `<div role="region">` for carousel container -- Biome a11y lint requires semantic HTML elements
- Removed separate CTA buttons from timeline nodes -- clickable node card replaces secondary CTAs (per RESEARCH.md discretion)
- Static Lucide icon map with 5 imports (Ear, Users, GraduationCap, Rocket, Globe) -- no dynamic import
- canonicalJourney data prepared in index.astro frontmatter, not in React -- getCollection unavailable in islands
- Used biome-ignore for m.a anchor content rule -- Biome cannot resolve Motion m.a as standard anchor with aria-label
- client:load for WhatsApp button (not client:visible) -- fixed-position elements never trigger IntersectionObserver until footer

## Decisions (Phase 05)

- Layout.astro jsonLd prop renders per-page structured data in head alongside Organization and BreadcrumbList
- OTB externalSiteUrl removed for local page; cta.url kept as external enrollment link per CTA vs navigation distinction
- OTB landing uses standard template (no custom sections); event details in differentials/faqs
- Event JSON-LD uses MixedEventAttendanceMode (online modules + Dubai immersion)
- No pricing fields in JSON-LD per D-04 (external checkout via Kiwify/WhatsApp)

---
*Last updated: 2026-03-26 (Phase 05 Plan 01 complete -- JSON-LD Course/Product/Event, OTB landing page, breadcrumbs 7/9)*
