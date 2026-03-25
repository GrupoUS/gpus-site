# Requirements: Portal Grupo US v2

**Defined:** 2026-03-25
**Core Value:** Cada visitante sente o nível de excelência do Grupo US em 3 segundos — design imersivo, copy de impacto, jornada clara.

## v1 Requirements (Current Milestone)

### Technical Debt & Foundation

- [ ] **TECH-01**: Blocos `// #region agent log` removidos de todos os 5 arquivos de produção (astro.config.mjs, productsNav.ts, ProductsGrid.astro, text-generate-effect.tsx, lamp.tsx)
- [ ] **TECH-02**: Astro 6 Fonts API configurada — Playfair Display e Inter self-hosted via `fontProviders.google()` sem CDN externo
- [ ] **TECH-03**: `<ClientRouter />` adicionado ao Layout.astro para View Transitions entre páginas
- [ ] **TECH-04**: Página 404.astro customizada com branding Navy/Gold e link para a home
- [ ] **TECH-05**: Favicon real do Grupo US substituindo o genérico do Astro

### Content & Copy

- [ ] **COPY-01**: Acentuação corrigida em todos os arquivos JSON de produtos (mínimo 7 arquivos) e nos componentes Astro com texto hardcoded
- [ ] **COPY-02**: Copy de todos os 7 produtos reescrita com headlines e frases de impacto baseados em drasacha.com.br e no Manual de Inteligência
- [ ] **COPY-03**: Meta descriptions únicas e otimizadas para SEO em todas as 11 páginas (não mais genéricas)
- [ ] **COPY-04**: Textos da equipe (Dra. Sacha, Maurício, Raquel) revisados e enriquecidos

### Visual & Animations

- [ ] **VIS-01**: Hero da home com background aurora/mesh gradient animado via CSS ou React Island com `client:load`
- [ ] **VIS-02**: Heroes das landing pages de produto com fundo animado consistente (variação do mesh gradient)
- [ ] **VIS-03**: Utility `glass-card` atualizada para Liquid Glass real — `backdrop-filter: blur(12px)`, borda com gradiente, profundidade visual
- [ ] **VIS-04**: Micro-interações nos ProductsGrid cards — glow dinâmico acompanhando o mouse (CSS ou React)
- [ ] **VIS-05**: Animações de scroll-reveal mais expressivas com spring physics (Framer Motion `client:visible`)
- [ ] **VIS-06**: Hover states refinados em todos os botões (scale + glow + shadow)

### React Islands

- [ ] **ISLAND-01**: `JourneyTimeline.tsx` na Home — representa os 5 estágios da jornada do aluno com animação de progresso, ícones e CTAs por estágio
- [ ] **ISLAND-02**: `TestimonialCarousel.tsx` — carrossel Framer Motion com swipe, autoplay (4s), indicadores, usado em todas as landing pages substituindo `Testimonials.astro` estático
- [ ] **ISLAND-03**: `WhatsAppFloatingButton.tsx` — botão flutuante `client:load`, número dinâmico por página via prop, animação de entrada suave

### SEO Técnico

- [ ] **SEO-01**: JSON-LD `Course` schema em cada landing page de produto (trintae3, mentoria-black-neon, comunidade-us, curso-auriculo, neon-dash)
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
- **INFRA-02**: Script `bun run check:external-urls` para validar drift entre JSON, astro.config e URLs reais
- **INFRA-03**: Domínio produção definitivo grupous.com.br (atualmente Railway subdomain)

## Out of Scope

| Feature | Razão |
|---------|--------|
| Dark/light mode toggle | Identidade Navy Dark é intencional — toggle dilui branding |
| CMS headless (Contentful, Sanity) | Volume estável, sem necessidade de edição não-técnica frequente |
| SSR / Server Islands | SSG é suficiente — sem dados dinâmicos por usuário |
| PWA / Service Worker | Nenhum caso de uso offline identificado |
| Multi-idioma (PT/EN/ES) | Foco no mercado brasileiro; internacionalização é v3+ |
| React Router / SPA | View Transitions do Astro resolve percepção de velocidade sem complexidade |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| TECH-01 | Phase 1 | Pending |
| TECH-02 | Phase 1 | Pending |
| TECH-03 | Phase 1 | Pending |
| TECH-04 | Phase 1 | Pending |
| TECH-05 | Phase 1 | Pending |
| COPY-01 | Phase 2 | Pending |
| COPY-02 | Phase 2 | Pending |
| COPY-03 | Phase 2 | Pending |
| COPY-04 | Phase 2 | Pending |
| VIS-01 | Phase 3 | Pending |
| VIS-02 | Phase 3 | Pending |
| VIS-03 | Phase 3 | Pending |
| VIS-04 | Phase 3 | Pending |
| VIS-05 | Phase 3 | Pending |
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
*Last updated: 2026-03-25 after initial definition*
