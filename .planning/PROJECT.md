# Portal Grupo US — Enhancement Milestone v2

## What This Is

Site institucional do Grupo US (grupous.com.br / Railway), ecossistema educacional em Saúde Estética Avançada, Negócios e Mentalidade. Stack: **Astro 6 SSG + Tailwind v4 + React 19 (ilhas pontuais) + Framer Motion**, design Navy/Gold, conteúdo via Content Collections. Esta milestone documenta evolução de “funcional” para **premium, conversão clara e SEO** — com **MPA** (sem SPA / sem `ClientRouter`), conforme `AGENTS.md`.

## Core Value

Cada visitante deve sentir o nível de excelência do Grupo US em poucos segundos — design coerente, copy alinhado ao funil, CTAs que levam à **Laura (SDR)** no WhatsApp quando o canal é mensagem.

## Estado sincronizado com o código (2026-03-26)

| Tema | Situação |
|------|-----------|
| **Rotas** | **8** páginas `.astro` em `src/pages/`; **5** redirects estáticos em `astro.config.mjs` (`/trintae3`, `/comunidade-us`, `/neon-dash`, `/na-mesa-certa`, `/otb`) para destinos externos alinhados aos JSON |
| **Produtos / equipe** | **7** JSON em `src/content/products/`; **13** JSON em `src/content/team/` |
| **WhatsApp** | Número único no site: **+55 62 9470-5081** (Laura, SDR) — fonte `src/lib/whatsapp.ts` |
| **Navegação** | MPA com reload completo; **não** usar `ClientRouter` / View Transitions como SPA |
| **Debug** | Sem `#region agent log` / `127.0.0.1:7777` no código |
| **404 / legal** | `404.astro`, `termos.astro`, `politica-de-privacidade.astro` presentes |
| **Fontes** | Astro Fonts API em `astro.config.mjs` com `fontProviders.google()` (Playfair + Inter) |
| **Jornada na home** | `JourneyTimeline.astro` (Astro estático), não `JourneyTimeline.tsx` |
| **Integridade URLs** | `bun run check:external-urls` para redirects vs `externalSiteUrl` |

## Requirements

### Validated (já refletidos no repositório)

- ✓ Rotas de conteúdo + redirects documentados acima
- ✓ Design system Navy/Gold (`src/styles/global.css` + tokens)
- ✓ Content Collections: 7 produtos + 13 equipe, Zod em `src/content.config.ts`
- ✓ Template de landing reutilizável (`src/components/landing/*`)
- ✓ Header/Footer com `productNavLinks`
- ✓ Redirects estáticos e filtro do sitemap para rotas só-redirect
- ✓ JSON-LD Organization + BreadcrumbList; WhatsApp no schema alinhado à Laura
- ✓ Open Graph + Twitter via `Layout.astro`
- ✓ Sitemap (`@astrojs/sitemap`)
- ✓ CTAs WhatsApp centralizados em `src/lib/whatsapp.ts` + copy “Falar com a Laura” onde aplicável

### Active (backlog da milestone — revisar prioridade)

**Technical Foundation**

- [x] **TECH-03 (superseded):** View Transitions / `ClientRouter` — fora de escopo por decisão explícita em `AGENTS.md` (anti-SPA). Não implementar.
- [x] **TECH-02:** Fonts self-hosted via Astro Fonts API com `fontProviders.google()` — sem CDN dependency. Preconnects removidos do Layout.astro. *Validated in Phase 1: Technical Debt & Foundation*
- [x] **TECH-05:** Favicon usa brand gold `#d4af37` — 6 ocorrências corrigidas. *Validated in Phase 1: Technical Debt & Foundation*

**Content & Copy**

- [x] **COPY-01:** Acentuação corrigida em todos os 7 JSONs de produtos e componentes Astro. *Validated in Phase 2: Content & Copy Overhaul*
- [x] **COPY-02:** Copy dos 7 produtos reescrita com headlines e frases de impacto, descriptions ≥120 chars. *Validated in Phase 2: Content & Copy Overhaul*
- [x] **COPY-03:** Meta descriptions únicas em todas as 8 páginas de conteúdo (≥120 chars). *Validated in Phase 2: Content & Copy Overhaul*
- [x] **COPY-04:** Bios da equipe enriquecidos — CVO+CEEN+UFG (Sacha), "Mago das Finanças" (Maurício), TRINTAE3 (Raquel). *Validated in Phase 2: Content & Copy Overhaul*

**Visual & Animations**

- [x] **VIS-01:** Aurora hero com cores navy/gold (gold, gold-light, navy-lighter, gold-dark). *Validated in Phase 3: Visual Uplift & Animation System*
- [x] **VIS-02:** Landing heroes com mesh gradient animado (20s ciclo), desabilitado mobile/reduced-motion. *Validated in Phase 3*
- [x] **VIS-03:** glass-card refinado (14% gold tint) + glass-card-bright em CTAs. *Validated in Phase 3*
- [x] **VIS-04:** Mousemove glow em ProductsGrid cards (CSS + inline JS, touch excluído). *Validated in Phase 3*
- [x] **VIS-05:** Spring reveals em 4 seções (hero, CTA, landing hero, stats) com LazyMotion+m. *Validated in Phase 3*
- [x] **VIS-06:** Hover glow em todos os 4 variantes de botão. *Validated in Phase 3*
- [x] **ADV-05:** Count-up animado nos stats com formato brasileiro (+5.000, 26, 10+, 7). *Validated in Phase 3*
- [ ] Onde couber, preferir Astro + CSS antes de novas ilhas React (`AGENTS.md`)

**React Islands (só com justificativa)**

- [ ] Carrossel de depoimentos com Framer (se sair do padrão atual em Astro)
- [ ] Botão flutuante WhatsApp global (número: já definido em `src/lib/whatsapp.ts`)

**SEO Técnico**

- [ ] JSON-LD `Course`/`Product` por produto (onde fizer sentido sem inventar preços)
- [ ] OG images dedicadas por rota
- [ ] `robots.txt` explícito (se ainda não existir em `public/`)

### Out of Scope

- Blog editorial de alto volume; toggle light/dark; CMS headless; SSR; PWA — ver secção equivalente em `REQUIREMENTS.md`

## Context

- **Stack:** Astro 6 + Tailwind v4 (Vite plugin) + React 19 + Framer Motion + Lucide + **Bun**
- **Codebase:** `.planning/codebase/` (atualizado em 2026-03-26)
- **Deploy:** Railway; `bun run build` → `dist/`
- **Gates:** `bun run lint` + `bunx astro check` + `bun run build`
- **Conteúdo / voz:** `docs/plans/aprimoramento/gpus-company-info.md`, skill `grupo-us`, Manual Google Doc
- **Jornada canônica (cards):** curso-auriculo → comunidade-us → trintae3 → mentoria-black-neon → otb

## Constraints

- Astro SSG, **Bun only**, sem npm/yarn/pnpm
- Sem hardcode de hex fora de tokens; ícones Lucide (sem emoji como ícone)
- Conteúdo de produto/equipe só via Content Collections
- Animações: `transform`/`opacity` ou grid `0fr`/`1fr` em acordeões — ver `AGENTS.md`

## Key Decisions

| Decisão | Racional | Outcome |
|---------|-----------|---------|
| MPA sem ClientRouter | Performance, simplicidade, alinhamento “anti-SPA” institucional | ✓ Ativo |
| WhatsApp via `src/lib/whatsapp.ts` | Um número (Laura), mensagens consistentes | ✓ Ativo |
| Redirects para landings externas | TRINTAE3, COMU, Neon Dash, Na Mesa, OTB hospedados fora do Astro | ✓ Ativo |
| View Transitions | Planejado na v2 doc original | ⏸ Supersedido até decisão contrária |

---
*Last updated: 2026-03-26 — Phase 3 (Visual Uplift & Animation System) complete. VIS-01/02/03/04/05/06 + ADV-05 verified (17/17 must-haves). Phases 1-2 also complete.*
