# Requirements: Portal Grupo US v2

**Defined:** 2026-03-25
**Core Value:** Cada visitante sente o nível de excelência do Grupo US em 3 segundos — design imersivo, copy de impacto, jornada clara.

## v1 Requirements (Current Milestone)

### Technical Debt & Foundation

- [x] **TECH-01**: Blocos `// #region agent log` removidos — *verificado 2026-03-26 (sem ocorrências no src)*
- [ ] **TECH-02**: Fonts API ativa com `fontProviders.google()` em `astro.config.mjs` — *opcional evoluir para self-host completo sem Google CDN*
- [ ] **TECH-03**: ~~`<ClientRouter />` / View Transitions~~ — **superseded:** `AGENTS.md` exige MPA sem router client-side; não implementar sem decisão de produto
- [x] **TECH-04**: Página `404.astro` com branding Navy/Gold — *presente*
- [ ] **TECH-05**: Favicon final de marca (auditar `public/favicon.*`)

### Content & Copy

- [ ] **COPY-01**: Acentuação corrigida em todos os arquivos JSON de produtos (mínimo 7 arquivos) e nos componentes Astro com texto hardcoded
- [ ] **COPY-02**: Copy de todos os 7 produtos reescrita com headlines e frases de impacto baseados em drasacha.com.br e no Manual de Inteligência
- [ ] **COPY-03**: Meta descriptions únicas em todas as **8** páginas de conteúdo em `src/pages/` (e revisão contínua nas landings/redirects conforme necessidade)
- [ ] **COPY-04**: Textos da equipe (Dra. Sacha, Maurício, Raquel) revisados e enriquecidos

### Visual & Animations

- [ ] **VIS-01**: Hero da home com background aurora/mesh gradient animado via CSS ou React Island com `client:load`
- [ ] **VIS-02**: Heroes das landing pages de produto com fundo animado consistente (variação do mesh gradient)
- [ ] **VIS-03**: Utility `glass-card` atualizada para Liquid Glass real — `backdrop-filter: blur(12px)`, borda com gradiente, profundidade visual
- [ ] **VIS-04**: Micro-interações nos ProductsGrid cards — glow dinâmico acompanhando o mouse (CSS ou React)
- [x] **VIS-05**: Animações de scroll-reveal mais expressivas com spring physics (Framer Motion `client:visible`)
- [ ] **VIS-06**: Hover states refinados em todos os botões (scale + glow + shadow)

### React Islands

- [ ] **ISLAND-01**: Jornada na home — **hoje:** `JourneyTimeline.astro` (estático). *Upgrade opcional:* `JourneyTimeline.tsx` com Framer Motion se justificado
- [ ] **ISLAND-02**: `TestimonialCarousel.tsx` — carrossel Framer Motion com swipe, autoplay (4s), indicadores, usado em todas as landing pages substituindo `Testimonials.astro` estático
- [ ] **ISLAND-03**: `WhatsAppFloatingButton.tsx` — botão flutuante `client:load`; **número e URL** devem usar `src/lib/whatsapp.ts` (Laura +55 62 9470-5081)

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
| TECH-01 | Phase 1 | Done |
| TECH-02 | Phase 1 | Partial |
| TECH-03 | Phase 1 | Superseded (MPA) |
| TECH-04 | Phase 1 | Done |
| TECH-05 | Phase 1 | Pending |
| COPY-01 | Phase 2 | Pending |
| COPY-02 | Phase 2 | Pending |
| COPY-03 | Phase 2 | Pending |
| COPY-04 | Phase 2 | Pending |
| VIS-01 | Phase 3 | Pending |
| VIS-02 | Phase 3 | Pending |
| VIS-03 | Phase 3 | Pending |
| VIS-04 | Phase 3 | Pending |
| VIS-05 | Phase 3 | Complete |
| VIS-06 | Phase 3 | Pending |
| ISLAND-01 | Phase 4 | Pending |
| ISLAND-02 | Phase 4 | Pending |
| ISLAND-03 | Phase 4 | Pending |
| SEO-01 | Phase 5 | Pending |
| SEO-02 | Phase 5 | Pending |
| SEO-03 | Phase 5 | Pending |
| SEO-04 | Phase 5 | Pending |
| SEO-05 | Phase 5 | Pending |
| SEO-06 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 24 total
- Mapped to phases: 24
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-25*  
*Last updated: 2026-03-26 — sync rotas, WhatsApp Laura, TECH-03 superseded, TECH-01/04 done*
