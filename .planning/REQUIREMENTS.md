# Requirements: Portal Grupo US v2

**Defined:** 2026-03-25
**Core Value:** Cada visitante sente o nível de excelência do Grupo US em 3 segundos — design imersivo, copy de impacto, jornada clara.

## v1 Requirements (Current Milestone)

### Technical Debt & Foundation

- [x] **TECH-01**: Blocos `// #region agent log` removidos — *verificado 2026-03-26 (sem ocorrências no src)*
- [x] **TECH-02**: Fonts API ativa com `fontProviders.google()` em `astro.config.mjs` — *self-hosted via Astro Fonts API, sem CDN dependency. Verified Phase 1.*
- [x] **TECH-03**: ~~`<ClientRouter />` / View Transitions~~ — **superseded:** `AGENTS.md` exige MPA sem router client-side; não implementar sem decisão de produto
- [x] **TECH-04**: Página `404.astro` com branding Navy/Gold — *presente*
- [x] **TECH-05**: Favicon final de marca com gold #d4af37 — *6 ocorrências corrigidas. Verified Phase 1.*

### Content & Copy

- [x] **COPY-01**: Acentuação corrigida em todos os 7 JSONs de produtos e componentes Astro — *Verified Phase 2*
- [x] **COPY-02**: Copy dos 7 produtos reescrita com headlines e frases de impacto, descriptions ≥120 chars — *Verified Phase 2*
- [x] **COPY-03**: Meta descriptions únicas em todas as 8 páginas de conteúdo (137-219 chars) — *Verified Phase 2*
- [x] **COPY-04**: Bios equipe enriquecidos: CVO+CEEN+UFG (Sacha), "Mago das Finanças" (Maurício), TRINTAE3 (Raquel) — *Verified Phase 2*

### Visual & Animations

- [x] **VIS-01**: Aurora hero gold/navy ativo em aurora-background.tsx — *Verified Phase 3*
- [x] **VIS-02**: Landing heroes com mesh gradient animado 20s, disabled mobile/reduced-motion — *Verified Phase 3*
- [x] **VIS-03**: glass-card refinado (14% gold tint) + glass-card-bright em CTAs — *Verified Phase 3*
- [x] **VIS-04**: Mousemove glow em ProductsGrid cards (CSS + inline JS, touch excluído) — *Verified Phase 3*
- [x] **VIS-05**: 4 LazyMotion spring reveal islands (MotionReveal, HeroEntrance, LandingHeroEntrance, AnimatedStats) — *Verified Phase 3*
- [x] **VIS-06**: Hover glow em todos os 4 variantes de botão — *Verified Phase 3*

### React Islands

- [x] **ISLAND-01**: Jornada na home — **hoje:** `JourneyTimeline.astro` (estático). *Upgrade opcional:* `JourneyTimeline.tsx` com Framer Motion se justificado
- [x] **ISLAND-02**: `TestimonialCarousel.tsx` — carrossel Framer Motion com swipe, autoplay (4s), indicadores, usado em todas as landing pages substituindo `Testimonials.astro` estático
- [x] **ISLAND-03**: `WhatsAppFloatingButton.tsx` — botão flutuante `client:load`; **número e URL** devem usar `src/lib/whatsapp.ts` (Laura +55 62 9470-5081)

### SEO Técnico

- [ ] **SEO-01**: JSON-LD `Course`/`Product` onde há `.astro` local (**curso-auriculo**, **mentoria-black-neon**); redirects externos fora do escopo deste repo salvo nova página
- [ ] **SEO-02**: JSON-LD `Event` schema na página OTB e `Product` na página OTB
- [ ] **SEO-03**: OG images estáticas (1200×630) por página, criadas como SVG ou PNG e referenciadas no meta
- [ ] **SEO-04**: BreadcrumbList JSON-LD em todas as páginas internas (além do existente no layout global)
- [ ] **SEO-05**: `sitemap.xml` com prioridades — home (1.0), landings (0.9), sobre/contato (0.7), legais (0.3)
- [ ] **SEO-06**: `robots.txt` explícito com Disallow para `/404` e Allow para o restante

## v2 Requirements (Deferred)

### Analytics & Tracking

- **ANALYTICS-01**: Integração GA4 ou Plausible para rastreamento de conversões por produto
- **ANALYTICS-02**: UTM parameters automáticos nos links externos (na-mesa-certa, otb)
- **ANALYTICS-03**: Event tracking nos cliques de CTA WhatsApp e botões primários

### Advanced Features

- **ADV-01**: Blog/conteúdo editorial com Content Collection de artigos (SEO de cauda longa)
- **ADV-02**: Formulário de contato funcional conectado a HubSpot ou Formspree real
- **ADV-03**: Área de membros / login (requer SSR ou serviço externo)
- **ADV-04**: Mapa de localização na página de contato
- **ADV-05**: Counter animado nas StatsSection (scroll-triggered number count-up)

### Infrastructure

- **INFRA-01**: HTTP 301 no Caddy/Railway para `/otb` e `/na-mesa-certa` (em vez de meta refresh HTML)
- **INFRA-02**: Script `bun run check:external-urls` — *presente* (`scripts/check-external-urls.mjs`); manter ao mudar redirects ou `externalSiteUrl`
- **INFRA-03**: Domínio produção definitivo grupous.com.br (atualmente Railway subdomain)

## Out of Scope

| Feature | Razão |
|---------|--------|
| Dark/light mode toggle | Identidade Navy Dark é intencional — toggle dilui branding |
| CMS headless (Contentful, Sanity) | Volume estável, sem necessidade de edição não-técnica frequente |
| SSR / Server Islands | SSG é suficiente — sem dados dinâmicos por usuário |
| PWA / Service Worker | Nenhum caso de uso offline identificado |
| Multi-idioma (PT/EN/ES) | Foco no mercado brasileiro; internacionalização é v3+ |
| React Router / SPA | **MPA institucional** — sem `ClientRouter`; percepção de velocidade via SSG + assets, não SPA |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| TECH-01 | Phase 1 | Complete |
| TECH-02 | Phase 1 | Complete |
| TECH-03 | Phase 1 | Superseded (MPA) |
| TECH-04 | Phase 1 | Complete |
| TECH-05 | Phase 1 | Complete |
| COPY-01 | Phase 2 | Complete |
| COPY-02 | Phase 2 | Complete |
| COPY-03 | Phase 2 | Complete |
| COPY-04 | Phase 2 | Complete |
| VIS-01 | Phase 3 | Complete |
| VIS-02 | Phase 3 | Complete |
| VIS-03 | Phase 3 | Complete |
| VIS-04 | Phase 3 | Complete |
| VIS-05 | Phase 3 | Complete |
| VIS-06 | Phase 3 | Complete |
| ISLAND-01 | Phase 4 | Complete |
| ISLAND-02 | Phase 4 | Complete |
| ISLAND-03 | Phase 4 | Complete |
| SEO-01 | Phase 5 | Pending |
| SEO-02 | Phase 5 | Pending |
| SEO-03 | Phase 5 | Pending |
| SEO-04 | Phase 5 | Pending |
| SEO-05 | Phase 5 | Pending |
| SEO-06 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 24 total (1 superseded)
- Complete: 18
- Pending: 6 (SEO-01 through SEO-06 — Phase 5)
- Mapped to phases: 24
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-25*
*Last updated: 2026-03-26 — Phases 1-4 complete; all TECH/COPY/VIS/ISLAND requirements verified; SEO-01-06 pending Phase 5*
