# Roadmap: Portal Grupo US v2

**Milestone:** Enhancement — Visual Premium + SEO + React Islands
**Stack:** Astro 6 + Tailwind v4 + React 19 + Framer Motion + Bun
**Gates por fase:** `bun run lint` + `bunx astro check` + `bun run build`
**Sync codigo (2026-03-26):** 8 paginas em `src/pages/` + 5 redirects; WhatsApp SDR **+55 62 9470-5081** (`src/lib/whatsapp.ts`); **MPA sem `ClientRouter`** (ver `AGENTS.md`).

---

## Phase 1 — Technical Debt & Foundation

**Goal:** Limpar divida tecnica e consolidar fundamentos Astro 6 antes de trabalho visual pesado.

**Why first:** Instrumentacao de debug e inconsistencias de rota/CTA bloqueiam confianca no deploy.

**Status (2026-03-26):** TECH-01 feito (sem `agent log`). TECH-04 feito (404). Fonts API ativa com provider Google em `astro.config.mjs`. **TECH-03 nao implementar** sem revisao de produto — o site institucional permanece **MPA** (reload completo), nao SPA-like.

**Plans:** 3 plans (ajustar expectativas)

Plans:
- [x] 01-PLAN-1.1-remove-debug.md — Remocao de blocos de debug (TECH-01) — **feito no codigo**
- [ ] 01-PLAN-1.2-favicon-and-verify.md — Favicon de marca + auditar Fonts (TECH-02 parcial, TECH-05)
- [ ] 01-PLAN-1.3-view-transitions.md — **Superseded:** ClientRouter conflita com `AGENTS.md`; manter como referencia historica apenas

**Requirements:** TECH-01, TECH-02, TECH-03 (superseded), TECH-04, TECH-05

---

## Phase 2 — Content & Copy Overhaul

**Goal:** Todo o conteudo do site com acentuacao correta, copy de impacto e meta descriptions unicas para SEO.

**Why now:** Copy e a base de tudo. Sem conteudo correto, visual e SEO nao tem substancia. Fazer antes do visual para nao retrabalhar animacoes sobre conteudo errado.

**Plans:** 3 plans

**Status (2026-03-26):** Complete — COPY-01/02/03/04 verified (7/7 must-haves passed)

Plans:
- [x] 02-01-PLAN.md — Audit e correcao de acentuacao em todos os JSONs e componentes Astro (COPY-01)
- [x] 02-02-PLAN.md — Reescrita e elevacao do copy dos 7 produtos com audit-first (COPY-02)
- [x] 02-03-PLAN.md — Upgrade meta descriptions termos/privacidade + enriquecimento bios equipe (COPY-03, COPY-04)

**Requirements:** COPY-01, COPY-02, COPY-03, COPY-04

---

## Phase 3 — Visual Uplift & Animation System

**Goal:** Transformar a identidade visual de "flat navy" para "premium imersivo" com aurora hero, Liquid Glass real e micro-interacoes em todo o site.

**Why now:** Base tecnica e conteudo prontos. Agora o visual pode ser construido sobre fundacao solida.

### Plans

**3.1 — Aurora Hero Backgrounds**
- `src/components/ui/aurora-background.tsx` ja existe — ativar e integrar no `HomeHero`
- Configurar cores navy/gold no componente aurora
- Hero das landings: mesh gradient animado via CSS keyframes (sem React Island para performance)
- Fallback CSS puro para `prefers-reduced-motion`

**3.2 — Liquid Glass Design System Upgrade**
Atualizar `src/styles/global.css`:
- `.glass-card`: adicionar `backdrop-filter: blur(16px)`, `background: rgba(26, 26, 46, 0.6)`, borda com `linear-gradient` sutil dourado
- `.gold-glow`: ampliar shadow com multiplas camadas
- `.card-hover-lift`: adicionar `box-shadow` dinamico no hover
- Novo utility `.glass-card-bright` para secoes de destaque

**3.3 — Micro-interactions & Scroll Reveals**
- ProductsGrid cards: `mousemove` glow dinamico via CSS custom properties (sem React)
- Botoes: `scale(1.02)` + glow no hover, `scale(0.98)` no active
- `data-reveal` animations: migrar de CSS puro para Framer Motion `motion.div` com `client:visible` nas secoes principais
- Header dropdown: animacao smooth de slide + fade

**Status (2026-03-26):** Plan 01 complete (CSS foundation). Plans 02-03 in progress.

Plans:
- [x] 03-01-PLAN.md -- CSS foundation: aurora navy/gold, mesh gradient, glass-card-bright, button hover glows (VIS-01, VIS-02, VIS-03, VIS-06)
- [x] 03-02-PLAN.md -- Micro-interactions: mousemove glow, mobile menu transition (VIS-04, VIS-05)
- [ ] 03-03-PLAN.md -- Motion reveals: Framer Motion spring entrances for hero, CTA, stats (remaining VIS items)

**Requirements:** VIS-01, VIS-02, VIS-03, VIS-04, VIS-05, VIS-06

---

## Phase 4 — React Islands: Premium Interactions

**Goal:** Adicionar os 3 componentes React de alto impacto que diferenciam o site de institucional comum para experiencia premium.

**Why now:** Visual system pronto. Islands sao os "momentos wow" que se apoiam na base visual.

**Plans:** 2 plans

Plans:
- [ ] 04-01-PLAN.md — JourneyTimeline.tsx + TestimonialCarousel.tsx: animated timeline with scroll-linked progress line + drag carousel with autoplay (ISLAND-01, ISLAND-02)
- [ ] 04-02-PLAN.md — WhatsAppFloatingButton.tsx: global floating button with scroll-triggered entrance + per-page messages via Layout.astro (ISLAND-03)

**Requirements:** ISLAND-01, ISLAND-02, ISLAND-03

---

## Phase 5 — SEO Technical Layer

**Goal:** Structured data completa, OG images reais e sitemap otimizado para rankeamento organico dos produtos.

**Why now:** Visual e conteudo prontos. SEO tecnico agora tem copy real para indexar.

### Plans

**5.1 — JSON-LD Per Product**
Adicionar schema rico nas rotas que **geram HTML no repo** (`curso-auriculo.astro`, `mentoria-black-neon.astro`) e, se no futuro voltarem paginas Astro para outros produtos, repetir o padrao.
Rotas que hoje sao **apenas redirect** (`/trintae3`, `/comunidade-us`, `/neon-dash`, etc.) nao tem `.astro` local — schema ficaria no destino externo ou exigiria pagina intermediaria (decisao de produto).

- Schema `Course` para formacoes (ex.: Curso Auriculo; TRINTAE3/COMU se houver pagina propria no futuro)
- Schema `Product` + `Offer` para Mentoria Black Neon e NeonDash
- Campos: `name`, `description`, `provider` (Grupo US), `offers.price`, `educationalCredentialAwarded`

**5.2 — OG Images**
- Criar `public/og/` com imagens 1200x630 por pagina
- Formato: fundo navy, titulo em Playfair Display dourado, logo Grupo US
- Geracao: script `scripts/generate-og.ts` ou SVG estatico
- Atualizar `Layout.astro` para referenciar `/og/[slug].png`

**5.3 — Sitemap Priorities + robots.txt**
- Configurar `@astrojs/sitemap` com `customPages` e prioridades manuais:
  - home: 1.0 | landings: 0.9 | sobre/contato: 0.7 | termos/privacidade: 0.3
- Criar `public/robots.txt`:
  ```
  User-agent: *
  Allow: /
  Disallow: /404
  Sitemap: https://grupous.com.br/sitemap-index.xml
  ```

**Requirements:** SEO-01, SEO-02, SEO-03, SEO-04, SEO-05, SEO-06

---

## Phase 6 — QA, Performance & Ship

**Goal:** Lighthouse >= 95, acessibilidade, cross-browser, deploy limpo no Railway.

**Why last:** So faz sentido auditar apos tudo implementado.

### Plans

**6.1 — Lighthouse & Performance Audit**
- Rodar Lighthouse em home, 2 landings e contato
- Otimizar imagens pesadas (WebP, lazy loading)
- Verificar CLS (Cumulative Layout Shift) em islands
- Ajustar `client:load` vs `client:visible` conforme resultado

**6.2 — Accessibility & Cross-browser**
- `alt` em todas as imagens
- Contraste minimo 4.5:1 (especialmente Liquid Glass sobre navy)
- Focus visible em todos os elementos interativos
- Testar em Firefox, Safari, Chrome mobile

**6.3 — Final Build & Deploy**
- `bun run lint`
- `bunx astro check`
- `bun run build`
- Deploy Railway via push main
- Smoke test: 8 rotas de conteudo + 5 redirects + assets criticos (WhatsApp, formulario)

**Requirements:** Todos os requisitos v1 verificados

---

## Summary

| Phase | Focus | Requirements | Est. Complexity |
|-------|-------|-------------|-----------------|
| 1 | Technical Debt & Foundation | TECH-01...05 | Low |
| 2 | Content & Copy Overhaul | COPY-01...04 | Medium |
| 3 | Visual Uplift & Animations | VIS-01...06 | High |
| 4 | React Islands | ISLAND-01...03 | High |
| 5 | SEO Technical Layer | SEO-01...06 | Medium |
| 6 | QA & Ship | All v1 | Low |

**Total v1 requirements:** 24
**Phases:** 6
**Granularity:** Standard (3-5 plans per phase)

---
*Roadmap created: 2026-03-25*
*Last synced with codebase: 2026-03-26 (rotas, MPA, WhatsApp Laura, Phase 1 status)*
*Phase 2 plans created: 2026-03-26*
*Phase 4 plans created: 2026-03-26*
*Milestone: v2 Enhancement — Visual Premium + SEO + React Islands*
