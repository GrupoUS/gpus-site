# Plano — Landing Cinemática de Produto GPUS (homepage `/`)

> Complexidade: **L5 — Medium**. Não promove para L6. Sem nova arquitetura de animação, sem pipeline de render, sem migração de design system, sem reestruturação de rotas, sem cross-site shared package.
>
> Plano de implementação. **Não executar até o usuário aprovar.**

---

## 1. Executive Summary (≤5 linhas)

Promover a homepage `/` a uma narrativa cinematográfica estilo Apple **enriquecendo `src/pages/index.astro`** com 5 capítulos sticky entre `<Hero />` (preservado) e `<ProductsGrid />` (recolocado como capítulo de comparação final). Usar **`motion` v12.38 já instalado** com `useScroll` + `useTransform` em **uma única ilha consolidada** `<NarrativeChapters client:visible>` para preservar o budget de <50KB JS. Copy passa por **nova coleção `site` em Content Collections** (Zod), nunca em literais de componente. **Diferir** Remotion, Hyperframes, GSAP, shadcn Radix e polyfill de scroll-timeline — sem justificativa de necessidade. Hero sem novo asset; opção de poster `sacha-hero.webp` atrás de Aurora se decisão de LCP for um único elemento.

---

## 2. Codebase Findings

| # | Achado | Arquivo:linhas | Confiança | Implicação |
|---|---|---|---|---|
| F1 | Homepage compõe 7 seções: Hero (Aurora+Spotlight+TextGenerate+HeroEntrance) → ProductsGrid → JourneyTimeline (client:idle) → TestimonialCarousel → StatsSection → AboutPreview → CTASection | `src/pages/index.astro:96-109` | 5 | Inserção de capítulos é mecânica entre `<Hero />` e `<ProductsGrid />`; nenhuma reescrita necessária |
| F2 | Hero CTA aponta para `#produtos` (id de `<ProductsGrid>`) | `src/components/home/Hero.astro:43` | 5 | **Risco A** — capítulos novos entre Hero e Products fazem CTA pular toda a narrativa. Reapontar para `#chapter-1` ou remover anchor |
| F3 | `motion` v12.38.0 instalado em `dependencies` | `package.json:21-44` | 5 | `useScroll` / `useTransform` / `useReducedMotion` / `LazyMotion+domAnimation` já no bundle via `JourneyTimeline.tsx`. Custo marginal por capítulo ≈ 0 se ilha única |
| F4 | NÃO instalados: gsap, lenis, three, lottie, remotion, hyperframes, scroll-timeline polyfill, Radix UI primitives | `package.json` (ausência) | 5 | Confirma que devem ser **diferidos**; cada um exige `[REQUIRES APPROVAL]` |
| F5 | shadcn/ui **configurado** via `components.json` (registry `new-york`) mas sem Radix instalado | `components.json:1-32` | 5 | Pode-se adicionar primitives shadcn pontuais sem instalar tudo. Por ora, sem necessidade — `Button.astro` + `Card.astro` + `SectionHeading.astro` cobrem |
| F6 | `@theme` SSOT em Tailwind v4: Navy `#1a1a2e/#2a2a40/#3d3d5c`, Gold `#d4af37/#e8c96a/#b8960c`, WhatsApp `#25d366`, motion tokens (`--duration-hover 150ms`, `--ease-out-soft cubic-bezier(0.16,1,0.3,1)`), depth-1..6 shadows | `src/styles/global.css:6-59` | 5 | Toda paleta + curvas + sombras já parametrizadas. Capítulos consomem tokens — zero hex novo |
| F7 | 13 `@utility` helpers já prontos: `gold-glow`, `glass-card`, `glass-card-bright`, `card-hover-lift`, `gold-pulse-glow`, `float-gentle`, `animate-spotlight`, `animate-aurora`, `card-glow-hover`, `landing-mesh-bg`, `text-shimmer`, `text-gradient-gold`, `depth-1..6` | `src/styles/global.css:77-543` | 5 | Capítulos reutilizam `landing-mesh-bg`, `depth-3..5`, `glass-card`, `text-gradient-gold`. Aurora/Spotlight **restritos ao Hero** |
| F8 | IntersectionObserver `[data-reveal]` ownership no Layout, com stagger `[data-reveal-delay="1..6"]`, mobile GPU bypass `max-width: 768px` | `src/layouts/Layout.astro:164-190`, `src/styles/global.css:220-287` | 5 | Reuso direto para reveals não-scrubbed. **Risco C** — sticky + IntersectionObserver fire imediato; reveals só em irmãos não-pinned |
| F9 | `prefers-reduced-motion` honrado em 3 blocos CSS + `useReducedMotion()` em todos os islands de motion | `src/styles/global.css:131-144,279-287,512-517`; `src/components/ui/*.tsx` | 5 | Padrão pronto. Novo island consolidado deve seguir |
| F10 | 11-section landing template canônico (mentoria-black-neon): LandingHero → NeonStory? → PainPoints → Pillars → Deliverables/Benefits → NeonBonus? → Differentials → TestimonialCarousel → NeonBio? → FAQ → LandingCTA → MobileCTABar | `src/pages/mentoria-black-neon.astro:1-85` | 5 | NÃO replicar 11 seções na home — Apple narrative ≠ landing de produto. Home cinemática usa 5 capítulos diferentes |
| F11 | Content Collections SSOT: schemas Zod em `src/content.config.ts` (file protegido). Coleções: `products`, `team` | `src/content.config.ts:1-138` | 5 | Adicionar coleção `site` exige edit em arquivo protegido — comunicar antes (cardinal #5 + arquivo protegido) |
| F12 | WhatsApp helper exporta `WHATSAPP_SDR_E164="556294705081"`, `whatsappUrlWithText(message)`, `isWhatsAppDestination(url)` | `src/lib/whatsapp.ts:1-26` | 5 | Qualquer CTA WhatsApp via helper. Nunca `wa.me/...` inline (cardinal #6) |
| F13 | Layout aceita props: `title`, `description`, `ogImage`, `activeNav`, `breadcrumbs`, `whatsappMessage`, `hasBottomBar`, `jsonLd`. Organization schema hardcoded + opcional BreadcrumbList + custom jsonLd | `src/layouts/Layout.astro:10-19,100-129` | 5 | Home cinemática pode passar `jsonLd` extra (WebPage / ItemList dos programas) |
| F14 | Sitemap filtra 4 slugs externos (`na-mesa-certa`, `trintae3`, `comunidade-us`, `neon-dash`); redirects em `astro.config.mjs:8-13` | `astro.config.mjs:8-78` | 5 | Tri-sync intacto. Capítulo de "comparação" deve mostrar TODOS os 7 produtos (4 internos + 3 redirects), respeitando destino externo via `externalSiteUrl` |
| F15 | Scripts validation verbatim: `dev`, `build`, `preview`, `astro`, `check:external-urls`, `smoke-test`, `lint` (biome + oxlint), `lint:fix`, `lighthouse:audit`, `predeploy` (lint + astro check + build) | `package.json:8-20` | 5 | Comandos reais a usar. **Nunca inventar** |
| F16 | Deploy Railway, output estático, sem `railway.json`/`vercel.json`/`Dockerfile`. Confirmado cardinal #4 static-only | (ausência) + `.claude/CLAUDE.md:14,66` | 5 | Render-mode invariant absoluto |
| F17 | `public/images/` tem `sacha-hero.webp`, `sacha-about.webp`, logos, produtos `.webp`/`.svg`. Sem vídeos `.mp4`/`.webm` | `public/images/*` | 5 | Não há asset cinematográfico atual. Decisão: usar Aurora+Spotlight existente OU layer poster estático. Sem video pipeline = sem Remotion |
| F18 | `MotionReveal.tsx` (client:idle) já existe com `useReducedMotion`, `useInView`, `LazyMotion`. `LandingHeroEntrance.tsx` (client:visible) staggered entrance | `src/components/ui/MotionReveal.tsx`, `src/components/ui/LandingHeroEntrance.tsx` | 5 | **Reuso obrigatório**. Não criar `ChapterReveal.tsx` redundante |
| F19 | `SectionHeading.astro` já é eyebrow+title+subtitle reutilizável | `src/components/shared/SectionHeading.astro` | 5 | **Reuso obrigatório**. Não criar `ChapterChrome.astro` |
| F20 | Brand canon (Skill grupo-us): missão "Transformar profissionais da saúde em referências"; valores: Excelência com entrega real, Autorresponsabilidade, Olhar de dono, Clareza, Simplicidade eficaz; 5-stage student journey | `.claude/skills/grupo-us/references/values/gpus-site/manual-resumo.md` | 4 | Copy dos capítulos ancora nesses valores. NÃO citar Apple. NÃO copiar voz da Apple |
| F21 | JourneyTimeline.tsx é o SSOT da jornada (cardinal de routing matrix) — alterar a ordem exige editar `src/content/products/<slug>.json::order` | `src/components/home/JourneyTimeline.tsx`; `.claude/CLAUDE.md § Routing matrix` | 5 | **Risco B** — não repropor JourneyTimeline como "comparison matrix". Construir capítulo separado `ProgramsCompare.astro` que lê a mesma coleção mas apresenta matriz |
| F22 | LCP atual provável = AuroraBackground (acima da dobra). Hero não usa `<Image>` com prioridade explícita | `src/components/home/Hero.astro:1-52` (sem `<Image fetchpriority="high">`) | 3 | Antes de adicionar poster `<img>`, medir LCP atual com `lighthouse:audit`. Decidir UM elemento LCP |
| F23 | Lighthouse harness existe (`scripts/lighthouse-audit.mjs`, dep `lighthouse` v13 + `chrome-launcher`); sem Playwright; sem `.lighthouseci/` | `scripts/lighthouse-audit.mjs`, `package.json:36-38` | 5 | Gate de performance disponível pré-merge |

---

## 3. External Findings

> **Apple, shadcn, Remotion, Hyperframes, MDN — reference only. Nenhum asset, copy, layout, vídeo, nomenclatura ou identidade da Apple será copiado.**

| # | Achado | Fonte | Confiança | Impacto na implementação |
|---|---|---|---|---|
| E1 | Apple usa narrativa de produto em blocos: hero claim → reveal → feature chapters → sticky anchor + scroll copy → comparison/upgrade → CTA tardia | apple.com/macbook-pro, apple.com/iphone-17-pro | 4 | **Mecânica adaptada**: 5 capítulos = (1) Promise, (2) Métodos, (3) Resultados, (4) Quem somos, (5) Trilha completa (comparison). CTA aparece só após capítulo 3 + final |
| E2 | shadcn/ui é "open code" — adiciona componentes copiados, não dependência fechada | ui.shadcn.com/docs | 4 | Não justifica instalação massiva. Se um primitive (e.g., `accordion`) ajudar, copiar isolado — mas FAQ atual usa `<details>` nativo já compatível |
| E3 | `motion` v12 (rebrand de Framer Motion) — `useScroll({ target, offset })` + `useTransform(scrollYProgress, [0,1], [valueA, valueB])` é o padrão runtime sticky-scrub | motion.dev (Context7), JourneyTimeline.tsx existente | 5 | Padrão escolhido. Sem GSAP |
| E4 | Remotion = React + frame-based, requer headless Chrome para renderizar MP4/WebM | remotion.dev/docs | 4 | **Diferir.** Sem demanda concreta de vídeo. Reabrir só se hero film for produzido |
| E5 | Hyperframes vs Remotion: ambos determinísticos; Hyperframes = HTML, Remotion = React | hyperframes.mintlify.app | 4 | **Diferir.** Mesma justificativa de Remotion |
| E6 | CSS scroll-driven animations (`animation-timeline: view()/scroll()`): Chromium 115+, Safari 26 (2026), Firefox em flag | developer.chrome.com/docs/css-ui/scroll-driven-animations | 4 | **Enhancement via `@supports`** dentro de capítulos selecionados, com `motion useScroll` como fallback. Sem polyfill JS |
| E7 | `prefers-reduced-motion`: substituir motion não-essencial; nunca remover conteúdo | developer.mozilla.org | 5 | Padrão obrigatório. Já adotado pelo site |
| E8 | Apple também degrada para stack estático em mobile com fade-in reveals | apple.com (iphone-17-pro mobile) | 4 | Reforça: capítulos sticky scrubbed = **desktop only**. Mobile = stack vertical + `[data-reveal]` |

---

## 4. Assumptions & Unknowns

- [ASSUMED] Target é a homepage `/`, não nova rota. (Recomendação validada — ver §6.)
- [ASSUMED] Site é static-only Astro 6 (cardinal #4) e permanecerá assim.
- [ASSUMED] Identidade visual mantida: Navy + Gold, Playfair (serif) + Inter (sans). Sem ampliar paleta.
- [ASSUMED] Capítulo de comparação reusa coleção `products` existente — não nova fonte de truth de programas.
- [UNVERIFIED] Existe asset visual cinematográfico aprovado pra hero (poster, ilustração, foto editorial). Atualmente só `sacha-hero.webp` (foto da fundadora). **Bloqueia produção visual premium** se Aurora+Spotlight não bastar.
- [UNVERIFIED] LCP atual da home é Aurora ou outro elemento. Medir antes de modificar.
- [UNVERIFIED] Decisão de produto: aceita-se Hero CTA mudar de `#produtos` para `#chapter-1`? Impacto analytics/funil.
- [UNVERIFIED] Existe budget de copywriting para 5 capítulos curados (eyebrow + headline + 3-5 linhas + KPI/quote por capítulo).
- [UNVERIFIED] Trilha cinematográfica (capítulo 5) deve incluir os 3 produtos com `externalSiteUrl` (na-mesa-certa, trintae3, comunidade-us, neon-dash) na matriz comparativa, ou só os 3 internos (mentoria-black-neon, curso-auriculo, otb)?

---

## 5. Layer Map

`Data → Service/API → Router → Client/query → Presentation → Cross-cutting → Verification`

### Data
- **Novo arquivo de dados:** `src/content/site/home-narrative.json` — 5 capítulos. Schema cobre: `id`, `eyebrow`, `headline`, `subheadline`, `body[]`, `visual{type:"aurora"|"glass"|"image", src?, alt?}`, `kpis[]?`, `quote{text,author,role}?`, `ctaSlot?`.
- **Schema novo:** `src/content.config.ts` ganha collection `site` (loader JSON, glob `site/**.json`). **Arquivo protegido — confirmar com usuário antes.**
- Reuso: `src/content/products/*.json` (capítulo 5 comparison consome).

### Service/API
- N/A — site estático, sem CMS/API.

### Router
- Sem nova rota. Editar `src/pages/index.astro`.
- N/A nova entrada em `astro.config.mjs::redirects` ou `sitemap.filter()`.

### Client/query
- N/A — sem hooks de fetch/CMS. Dados via `getEntry('site', 'home-narrative')` em build time.

### Presentation (novos componentes)
- `src/components/cinematic/NarrativeChapters.tsx` — **ÚNICA ilha** consolidada (`client:visible`). Wrapper com `LazyMotion features={domAnimation}` único. Internamente itera capítulos sticky-scrubbed via `useScroll` + `useTransform`. Honra `useReducedMotion()` → renderiza estático.
- `src/components/cinematic/ChapterSticky.astro` — wrapper CSS-only `<section>` com layout `grid lg:grid-cols-[1fr_1fr]`, `position: sticky` no painel visual desktop; mobile colapsa para stack vertical.
- `src/components/cinematic/ProgramsCompare.astro` — capítulo 5: matriz comparativa lendo `getCollection('products')`. Reusa `<a href={externalSiteUrl ?? '/${slug}'}>` (respeita tri-sync). Pode ou não substituir `<ProductsGrid />` (decisão §6).

### Presentation (reuso obrigatório — NÃO duplicar)
- `src/components/home/Hero.astro` — preservado integralmente.
- `src/components/shared/SectionHeading.astro` — eyebrow + título dos capítulos.
- `src/components/shared/Button.astro` — CTAs (variantes primary/outline/whatsapp).
- `src/components/ui/MotionReveal.tsx` — reveals não-scrubbed dentro de capítulos.
- `src/lib/whatsapp.ts::whatsappUrlWithText()` — qualquer CTA WhatsApp.
- `[data-reveal]` + `[data-reveal-delay]` no Layout para mobile fallback.

### Presentation (edits)
- `src/pages/index.astro` — composição: Hero → `<NarrativeChapters client:visible />` (capítulos 1-4) → `<ProgramsCompare />` (capítulo 5, substitui ou precede ProductsGrid) → ProductsGrid (manter ou remover, decisão §6) → JourneyTimeline (preservar como Journey, não comparison) → TestimonialCarousel → StatsSection → AboutPreview → CTASection.
- `src/components/home/Hero.astro:43` — `href="#produtos"` → `href="#chapter-1"` (ou âncora final). **Risco A mitigado.**

### Cross-cutting
- **SEO**: `index.astro` frontmatter passa `jsonLd` extra (ItemList dos 7 programas) ao `<Layout>`. `title`/`description` revistos para refletir promessa cinematográfica. OG image continua default `og-image.png` (ou novo se asset for produzido).
- **Analytics**: nenhum analytics atual confirmado — não inventar.
- **Performance**: 1 ilha (`client:visible`) abaixo da dobra. Hero permanece `client:idle` (já é). Sem aumento de hydration roots além de 1.
- **Reduced motion**: `NarrativeChapters` curto-circuita; `ChapterSticky` não anima; mobile bypass via media query.
- **Image/video**: sem vídeo. Se poster `<img>` adicionado, `loading="eager" fetchpriority="high" width height` para o **único** elemento LCP.
- **Design tokens**: sem novos hex. Se nova cor surgir, adicionar ao `@theme` em `src/styles/global.css` (cardinal #7).

### Verification
- `bun run lint` (biome + oxlint)
- `bunx astro check` (tipos + Zod content schema)
- `bun run build` (gera `dist/`)
- `bun run check:external-urls` (cardinal #1)
- `bun run smoke-test` (anti-pattern scan)
- `bun run lighthouse:audit` (gates de perf)
- Smoke manual em browser: teclado, reduced-motion DevTools, JS-off `<noscript>`, responsivo (375/768/1280), `ls -lh dist/_astro/*.js | sort -k5 -rh | head -5` (budget < 50KB)

### Auth Scope
- Página pública. N/A endpoints autenticados.

---

## 6. Recommended Approach + Alternatives

### Primary — **Enhanced homepage `/` com ilha consolidada motion**

1. Preservar Hero (Aurora + Spotlight + HeroEntrance) como abertura.
2. Trocar `Hero.astro:43` CTA `#produtos` → `#chapter-1`.
3. Inserir `<NarrativeChapters client:visible />` (capítulos 1-4 sticky-scrubbed via `motion useScroll`).
4. Adicionar `<ProgramsCompare />` como capítulo 5 — matriz comparativa dos 7 programas (4 internos + 3 redirects respeitando `externalSiteUrl`).
5. Decisão sobre `<ProductsGrid />`: manter logo após ProgramsCompare como "veja em detalhe" OU remover (ProgramsCompare já lista). **Recomenda remover** para evitar duplicação visual.
6. JourneyTimeline preservado como Journey (cardinal de routing matrix § Update home journey order).
7. TestimonialCarousel / StatsSection / AboutPreview / CTASection inalterados.
8. Novo schema `site` em `src/content.config.ts` (`[REQUIRES APPROVAL]` — arquivo protegido).
9. Novo arquivo `src/content/site/home-narrative.json` com copy curada.
10. Zero novas deps. Bundle marginal estimado: +8-15KB gzip (LazyMotion já compartilhado).

**Trade-offs**: performance OK se ilha for única; manutenibilidade alta (todo motion num arquivo); impacto visual alto sem mudar identidade; risco implementação MÉDIO (necessita teste mobile rigoroso).

### Alternative A — Conservativa (CSS-only)
Apenas CSS `position: sticky` + `[data-reveal]` + `@supports (animation-timeline: view())` para enhancement. Zero ilha React nova.

**Trade-offs**: bundle JS inalterado (best); maintainability máxima; impacto visual MENOR (sem scroll-scrub real fora de Chromium 115+/Safari 26); cobertura cross-browser pior; risco implementação BAIXO.

### Alternative B — Cinemática+ (com `lenis` + poster image)
Primary + adicionar `lenis` (~5KB) para smooth-scroll global + commission poster hero estático. **`[REQUIRES APPROVAL]` — nova dep, custo budget.**

**Trade-offs**: polimento alto; +5KB main bundle; risco de conflito com IntersectionObserver root do Layout; risco implementação MÉDIO-ALTO.

### Alternative C — Pipeline de vídeo (Remotion ou Hyperframes)
Render programático de hero film MP4. **`[REQUIRES APPROVAL]` — múltiplas deps + asset pipeline.**

**Trade-offs**: visual premium; alta complexidade; nova esteira CI; LCP risco alto se autoplay; **rejeitada por YAGNI** até existir asset humano produzido.

---

## 7. Atomic Task Plan

### TASK-01: Inventory & decision lock-in
- **Layer:** discovery
- **Goal:** Confirmar com usuário escopo (homepage `/`), assets disponíveis, cobertura ProgramsCompare (4 vs 7 produtos), e copy budget.
- **Scope:** Incluído — leitura código, decisões. Excluído — qualquer edit.
- **Files:** N/A (planning conversation)
- **Subtasks:**
  - [ ] Confirmar target = `/`
  - [ ] Confirmar OK para alterar Hero CTA anchor
  - [ ] Confirmar coleção `site` aceitável (edit em `src/content.config.ts` protegido)
  - [ ] Confirmar inclusão de redirects externos em ProgramsCompare
  - [ ] Confirmar disponibilidade copywriter / responsável de copy
- **Dependencies:** none
- **Parallel:** —
- **Validation:** Usuário responde
- **Rollback:** N/A
- **Acceptance:** Todas as 5 perguntas respondidas
- **Risk:** Low
- **Approval needed:** Yes

### TASK-02: Measure baseline performance
- **Layer:** verification
- **Goal:** Capturar Lighthouse + LCP element atual da home.
- **Scope:** Incluído — rodar audits. Excluído — alterações.
- **Files:** N/A
- **Subtasks:**
  - [ ] `bun run build`
  - [ ] `bun run lighthouse:audit`
  - [ ] `ls -lh dist/_astro/*.js | sort -k5 -rh | head -5` (top-5 chunks)
  - [ ] Registrar LCP, CLS, INP, TBT, top-5 chunks em `docs/baseline-perf.md` (novo)
- **Dependencies:** TASK-01
- **Parallel:** [PARALLEL] com TASK-03
- **Validation:** Comando completa sem erro
- **Rollback:** Remover `docs/baseline-perf.md`
- **Acceptance:** Baseline registrado
- **Risk:** Low
- **Approval needed:** No

### TASK-03: Define schema `site` collection
- **Layer:** data
- **Goal:** Adicionar collection `site` em `src/content.config.ts` (arquivo protegido — explicar diff antes).
- **Scope:** Incluído — schema Zod + glob loader. Excluído — copy concreta.
- **Files:** `src/content.config.ts` (edit no final, sem remover collections existentes)
- **Subtasks:**
  - [ ] Definir `siteSchema` (eyebrow string, headline string, subheadline string, body string[], visual `{type: enum, src?, alt?}`, kpis `[{label, value}]?`, quote `{text, author, role}?`, ctaSlot `{label, url, whatsappMessage?}?`)
  - [ ] Definir `siteCollection = defineCollection({ loader: glob({pattern: '**/*.json', base: './src/content/site'}), schema: siteSchema })`
  - [ ] Exportar em `collections` export
- **Dependencies:** TASK-01
- **Parallel:** [PARALLEL] com TASK-02
- **Validation:** `bunx astro check`
- **Rollback:** git revert do hunk
- **Acceptance:** `astro check` passa; collection registrada
- **Risk:** Medium (file protegido)
- **Approval needed:** **Yes**

### TASK-04: Write narrative copy
- **Layer:** data
- **Goal:** Criar `src/content/site/home-narrative.json` com 5 capítulos curados, voz Grupo US, sem citação Apple.
- **Scope:** Incluído — copy + estrutura. Excluído — imagens novas.
- **Files:** `src/content/site/home-narrative.json` (novo)
- **Subtasks:**
  - [ ] Capítulo 1 — Promessa (autoridade + agenda + faturamento)
  - [ ] Capítulo 2 — Método (Black NEON, OTB, Aurículo, etc. — sem expor produtos ainda)
  - [ ] Capítulo 3 — Resultados (KPI inline ou quote)
  - [ ] Capítulo 4 — Quem somos (Dra. Sacha + estrutura)
  - [ ] Capítulo 5 — `ProgramsCompare` consome `products` direto (sem entry no JSON)
- **Dependencies:** TASK-03
- **Parallel:** —
- **Validation:** `bunx astro check` (Zod valida)
- **Rollback:** rm `src/content/site/home-narrative.json`
- **Acceptance:** 4 capítulos JSON válidos; voz coerente com `manual-resumo.md`
- **Risk:** Low
- **Approval needed:** Yes (copy)

### TASK-05: Build `ChapterSticky.astro`
- **Layer:** presentation
- **Goal:** Wrapper CSS-only sticky para capítulo (zero JS).
- **Scope:** Incluído — layout grid + `position:sticky` painel visual + área de conteúdo scroll-flow + mobile colapso. Excluído — animation logic.
- **Files:** `src/components/cinematic/ChapterSticky.astro` (novo)
- **Subtasks:**
  - [ ] Props: `id`, `eyebrow`, `headline`, `subheadline`, slot `visual`, slot `body`
  - [ ] Layout: `grid lg:grid-cols-2 gap-12`, painel visual `lg:sticky lg:top-0 lg:h-screen`
  - [ ] Reuso `SectionHeading.astro` para eyebrow+headline
  - [ ] Mobile (`max-width: 768px`): painel visual estático, stack vertical, painel visual `aspect-ratio: 4/5`
  - [ ] `data-chapter-id={id}` para hook do `NarrativeChapters` island
- **Dependencies:** TASK-03
- **Parallel:** [PARALLEL] com TASK-06
- **Validation:** `bun run lint`; `bunx astro check`
- **Rollback:** rm file
- **Acceptance:** Renderiza sem JS; mobile colapsa corretamente
- **Risk:** Low
- **Approval needed:** No

### TASK-06: Build `NarrativeChapters.tsx` (ÚNICA ilha)
- **Layer:** presentation
- **Goal:** Ilha consolidada `client:visible` que aplica scroll-scrub aos `<ChapterSticky>` filhos.
- **Scope:** Incluído — `LazyMotion` único, hooks por capítulo, `useReducedMotion` short-circuit. Excluído — Aurora/Spotlight (Hero-only).
- **Files:** `src/components/cinematic/NarrativeChapters.tsx` (novo)
- **Subtasks:**
  - [ ] Componente que detecta `data-chapter-id` dentro do DOM (children portal pattern OU receber chapters como prop)
  - [ ] Para cada capítulo, `useScroll({ target, offset: ['start end', 'end start'] })` + `useTransform` para opacity/translateY/scale do painel visual
  - [ ] `useReducedMotion()` → return null wrapper (DOM já static)
  - [ ] `LazyMotion features={domAnimation}` único na raiz
  - [ ] **Apenas `transform` + `opacity`** (cardinal #8)
- **Dependencies:** TASK-05
- **Parallel:** [PARALLEL] com TASK-05
- **Validation:** `bun run lint`; `bunx astro check`
- **Rollback:** rm file + remover uso em `index.astro`
- **Acceptance:** Sem warning React 19; reduced-motion = static
- **Risk:** Medium (motion API + Astro hydration)
- **Approval needed:** No

### TASK-07: Build `ProgramsCompare.astro`
- **Layer:** presentation
- **Goal:** Matriz comparativa dos programas (capítulo 5).
- **Scope:** Incluído — leitura `getCollection('products')`, sort por `order`, render em matriz com colunas: programa, audience, type, deliverables count OU pillars summary, CTA (interno via slug ou externo via `externalSiteUrl`). Excluído — duplicar Journey.
- **Files:** `src/components/cinematic/ProgramsCompare.astro` (novo)
- **Subtasks:**
  - [ ] Layout responsivo (table-like desktop, accordion vertical mobile)
  - [ ] CTAs: interno usa `<a href="/${slug}">`; externo usa `<a href={externalSiteUrl} target="_blank" rel="noopener noreferrer">`
  - [ ] Respeitar tri-sync — sem URL hardcoded
  - [ ] CTA WhatsApp opcional via `whatsappUrlWithText(product.data.cta.whatsappMessage)`
  - [ ] Reuso de `glass-card`, `depth-3`, `text-gradient-gold` se aplicável
- **Dependencies:** TASK-05
- **Parallel:** [PARALLEL] com TASK-06
- **Validation:** `bunx astro check`; `bun run lint`; `bun run check:external-urls`
- **Rollback:** rm file + remover uso em `index.astro`
- **Acceptance:** Lista 7 programas (ou 4, conforme TASK-01); externos abrem em nova aba com `noopener`
- **Risk:** Medium (tri-sync respeitado)
- **Approval needed:** No

### TASK-08: Integrate in homepage
- **Layer:** router/presentation
- **Goal:** Editar `src/pages/index.astro` para compor a nova narrativa.
- **Scope:** Incluído — imports, layout, JSON-LD extra. Excluído — alterar outras pages.
- **Files:** `src/pages/index.astro`, `src/components/home/Hero.astro` (1-line edit `#produtos` → `#chapter-1`)
- **Subtasks:**
  - [ ] `import { getEntry } from 'astro:content'`
  - [ ] `const narrative = await getEntry('site', 'home-narrative')`
  - [ ] Compor: `<Hero />` → `<NarrativeChapters client:visible>` envolvendo 4× `<ChapterSticky>` → `<ProgramsCompare />` → (manter ou remover `<ProductsGrid>` conforme TASK-01) → `<JourneyTimeline client:idle />` → resto
  - [ ] Atualizar `<Layout>` props: `title`, `description` refletindo nova promessa; `jsonLd={itemListSchema(products)}` se aplicável
  - [ ] Editar `Hero.astro:43` âncora
- **Dependencies:** TASK-04, TASK-05, TASK-06, TASK-07
- **Parallel:** —
- **Validation:** `bun run lint`; `bunx astro check`; `bun run build`
- **Rollback:** git revert do commit
- **Acceptance:** Build passa; renderiza local com `bun run dev`
- **Risk:** Medium (touches multiple integration points)
- **Approval needed:** Yes (Hero CTA change)

### TASK-09: Performance & a11y verification
- **Layer:** verification
- **Goal:** Garantir budget e gates.
- **Scope:** Incluído — Lighthouse + smoke + manual. Excluído — refactor reativo.
- **Files:** N/A (read-only)
- **Subtasks:**
  - [ ] `bun run smoke-test`
  - [ ] `bun run lighthouse:audit` — comparar contra baseline TASK-02
  - [ ] `ls -lh dist/_astro/*.js | sort -k5 -rh | head -5` (orçamento <50KB top initial)
  - [ ] Browser smoke: Tab → skip link primeiro; DevTools `prefers-reduced-motion: reduce` → sticky scrub desligado; JS-off → `<noscript>` reveal visível
  - [ ] Responsivo: 375 (mobile), 768 (tablet), 1280 (desktop) — sticky só desktop
  - [ ] INP < 100ms mobile (DevTools Performance panel)
- **Dependencies:** TASK-08
- **Parallel:** —
- **Validation:** Gates pass (`gates` em `.claude/config.json`)
- **Rollback:** N/A (read-only)
- **Acceptance:** LCP < 2.5s; CLS = 0; INP < 100ms; bundle < 50KB top chunk
- **Risk:** Medium (perf regression possível)
- **Approval needed:** No

### TASK-10: SEO + JSON-LD verification
- **Layer:** verification
- **Goal:** Garantir SEO/GEO mantido.
- **Scope:** Incluído — validar meta, canonical, sitemap, schemas. Excluído — Search Console submission.
- **Files:** N/A
- **Subtasks:**
  - [ ] View source `/` — confirma `<title>`, `<meta description>`, `og:image`, `canonical`
  - [ ] `dist/sitemap-index.xml` — `/` ainda presente; redirects excluídos
  - [ ] Validador Schema.org / Rich Results Test no HTML gerado
  - [ ] Verificar tagline ≤ 90 chars; description ≥ 120 chars (per `.claude/rules/seo.md § AI citation`)
- **Dependencies:** TASK-08
- **Parallel:** [PARALLEL] com TASK-09
- **Validation:** Schema validator passa
- **Rollback:** N/A
- **Acceptance:** Sem erros Rich Results; metadata server-rendered
- **Risk:** Low
- **Approval needed:** No

### TASK-11: Commit + PR
- **Layer:** verification
- **Goal:** Empacotar trabalho via fluxo `dev-test → PR` (cardinal — branch protection).
- **Scope:** Incluído — commit + PR. Excluído — merge (usuário aprova).
- **Files:** N/A (git ops)
- **Subtasks:**
  - [ ] Branch `dev-test` (já existe, ver git history) ou nova `feat/cinematic-home`
  - [ ] `bun run predeploy` — gate final
  - [ ] Commit messages Conventional Commits, escopo `site` ou `content`
  - [ ] `gh pr create` direcionado a `main`
- **Dependencies:** TASK-09, TASK-10
- **Parallel:** —
- **Validation:** Hooks lefthook passam
- **Rollback:** `git revert` no PR
- **Acceptance:** PR aberto, CI passa, usuário revisa
- **Risk:** Low
- **Approval needed:** **Yes** (merge fica com usuário — branch protection)

---

## 8. Sprint Contracts (não obrigatório em L5; incluído para clareza)

```text
Sprint 1 — Arquitetura travada
Scope: TASK-01 a TASK-04
Done when:
  - [ ] Escopo, copy budget e collection `site` aprovados pelo usuário
  - [ ] Baseline Lighthouse registrada
  - [ ] Schema `site` em src/content.config.ts; copy `home-narrative.json` validada
Out of scope: build de componentes

Sprint 2 — Implementação cinematográfica
Scope: TASK-05 a TASK-08
Done when:
  - [ ] ChapterSticky.astro + NarrativeChapters.tsx + ProgramsCompare.astro entregues
  - [ ] index.astro integra capítulos; Hero CTA reaponta
  - [ ] bun run predeploy passa
Out of scope: novos assets de mídia, novas dependências

Sprint 3 — Verificação + entrega
Scope: TASK-09 a TASK-11
Done when:
  - [ ] Lighthouse mantém ou melhora baseline
  - [ ] Mobile/tablet/desktop validados; reduced-motion OK; JS-off OK
  - [ ] PR aberto contra main
Out of scope: merge em main (usuário); Remotion/GSAP/lenis
```

---

## 9. Validation Plan (comandos REAIS do `package.json`)

| Categoria | Comando |
|---|---|
| Lint | `bun run lint` |
| Auto-fix | `bun run lint:fix` |
| Type-check + Zod schema | `bunx astro check` |
| Build | `bun run build` |
| Predeploy chain | `bun run predeploy` (= lint + astro check + build) |
| External URLs (tri-sync) | `bun run check:external-urls` |
| Anti-pattern smoke | `bun run smoke-test` |
| Lighthouse | `bun run lighthouse:audit` |
| Bundle top chunks | `ls -lh dist/_astro/*.js \| sort -k5 -rh \| head -5` (manual) |
| Dev server | `bun run dev` (browser smoke) |
| Manual a11y | Tab from top → skip link; DevTools reduce-motion; JS-off; responsive 375/768/1280 |
| Manual SEO | View source; Rich Results Test (web) |
| Hooks | `lefthook` (auto via `bun run prepare`) |

Sem `vitest`/`playwright` no projeto. **Não inventar.**

---

## 10. Risks & Rollback (top 5)

| # | Risco | Mitigação | Rollback |
|---|---|---|---|
| R1 | Hero CTA `#produtos` quebrado pela inserção de capítulos | Reapontar para `#chapter-1` na TASK-08 (1-line edit) | Reverter para `#produtos` |
| R2 | Bundle JS estoura 50KB top chunk com nova ilha | Ilha ÚNICA com `LazyMotion` único; auditar com `ls dist/_astro/*.js` | Remover scrub motion, manter sticky CSS + `[data-reveal]` (degradar para Alternative A) |
| R3 | Sticky + IntersectionObserver fire imediato → reveals colapsam | `[data-reveal]` apenas em irmãos não-pinned do sticky; ChapterSticky NÃO usa data-reveal no painel visual | Remover sticky no capítulo afetado |
| R4 | Repropor JourneyTimeline como "comparison matrix" viola SSOT de brand canon | Construir `ProgramsCompare.astro` separado; manter Journey intacto | Reverter ProgramsCompare, manter ProductsGrid+Journey originais |
| R5 | Edit em `src/content.config.ts` (arquivo protegido) quebra schemas existentes | Diff revisado pelo usuário antes; adicionar collection sem mexer `products`/`team`; rodar `bunx astro check` imediato | git revert do hunk |

---

## 11. Acceptance Criteria

- [ ] Homepage `/` renderiza Hero preservado + 4 capítulos sticky + ProgramsCompare + Journey + Testimonials + Stats + About + CTA
- [ ] `bun run predeploy` passa (lint + astro check + build)
- [ ] `bun run check:external-urls` passa
- [ ] `bun run smoke-test` passa (zero hex hardcoded, zero `wa.me/` inline, zero `console.log`)
- [ ] Lighthouse: Performance ≥ 95, Accessibility ≥ 95, BP ≥ 95, SEO ≥ 95 (mantém ou supera baseline TASK-02)
- [ ] LCP < 2.5s, CLS = 0, INP < 100ms (mobile mid-tier)
- [ ] Initial JS top chunk < 50KB
- [ ] `prefers-reduced-motion: reduce` → toda animação sticky/scrub desativada; conteúdo legível
- [ ] JS-off → conteúdo visível (`<noscript>` reveal fallback)
- [ ] Keyboard: skip link primeiro Tab → `<main>`; foco visível em todos os CTAs; Esc fecha menu mobile
- [ ] Mobile (375): sem sticky; stack vertical com reveals; CTA WhatsApp acessível
- [ ] Cardinals: render-mode static-only intacto; zero hex novo fora `@theme`; copy via `getEntry`; WhatsApp via `whatsappUrlWithText()`; redirects tri-sync intactos; nenhum `client:only` introduzido
- [ ] PR aberto contra `main`; CI verde; usuário aprova merge

---

## 12. Implementation Order

```
TASK-01 → TASK-02 (background) + TASK-03 (foreground) → TASK-04 →
TASK-05 + TASK-06 + TASK-07 (parallel) → TASK-08 →
TASK-09 + TASK-10 (parallel) → TASK-11
```

Critical path: **01 → 03 → 04 → 05 → 08 → 09 → 11** (≈7 etapas serialmente bloqueantes).

---

## Handoff (resumo)

```text
## Context Handoff
- Status: COMPLETED (planning)
- Confidence: 5 stack | 5 render-mode | 5 animation lib | 5 content model | 3 hero asset | 4 deferred-deps
- Artifacts: [
    { path: "docs/claude-code-planning-glistening-perlis.md", action: "created" }
  ]
- Quality gates: [
    { name: "codebase exploration", status: "DONE", evidence: "3 Explore agents covered routes/animation/content" },
    { name: "architecture review", status: "DONE", evidence: "Plan agent validated approach + 3 risk flags" },
    { name: "cardinal compliance", status: "DONE", evidence: "section §6 + §10 + §11" }
  ]
- Decisions: [
    { what: "Enhance / not new route", why: "SEO authority + funnel concentration" },
    { what: "Single consolidated motion island", why: "<50KB JS budget; one hydration root" },
    { what: "site collection new (not src/data/.ts)", why: "Cardinal #5 SSOT + Zod gate" },
    { what: "Defer Remotion/Hyperframes/GSAP/lenis/Radix", why: "YAGNI; no concrete demand" },
    { what: "Preserve JourneyTimeline; build separate ProgramsCompare", why: "Brand-canon SSOT (Routing matrix)" },
    { what: "Hero CTA #produtos → #chapter-1", why: "Risk A — avoid scroll-jump past narrative" }
  ]
- Risks: [
    { desc: "Bundle stoura 50KB", mitigation: "consolidated island + LazyMotion shared; degrade to CSS-only" },
    { desc: "Sticky vs IntersectionObserver", mitigation: "[data-reveal] only outside sticky descendants" },
    { desc: "Brand-canon SSOT drift via JourneyTimeline repurpose", mitigation: "build separate ProgramsCompare" }
  ]
- Next agent: NONE (awaiting user approval via ExitPlanMode)
- Resume hint: usuário aprova → /implement docs/claude-code-planning-glistening-perlis.md
```

---

## Self-Check

- Codebase before web · ✓
- LEVER (Leverage Existing) applied · ✓ (motion, MotionReveal, SectionHeading, Button, data-reveal reused)
- No copying Apple assets/copy · ✓ (reference only)
- Layers ordered + N/A dropped · ✓
- Tasks atomic + testable · ✓ (≤5min cada subtask típica)
- Assumptions labeled · ✓
- No implementation · ✓ (plan only)
- Destructive flagged · ✓ (`src/content.config.ts` protected → `[REQUIRES APPROVAL]`)
- Validation cmds real · ✓ (from `package.json`)
- Project rules honored · ✓ (cardinals 1-8 verificados em §10/11)
- Confidence ≤2 flagged · ✓ ([UNVERIFIED] hero asset)
- Reduced motion included · ✓ (R2, TASK-06, TASK-09)
- Performance budget considered · ✓ (§4 Q4 da crítica; §10 R2)
- Remotion/Hyperframes justified · ✓ (rejeitado por YAGNI, §6 Alternative C)
