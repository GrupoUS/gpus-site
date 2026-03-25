# Roadmap: Portal Grupo US v2

**Milestone:** Enhancement — Visual Premium + SEO + React Islands
**Stack:** Astro 6 + Tailwind v4 + React 19 + Framer Motion + Bun
**Gates por fase:** `bun run lint` + `bunx astro check` + `bun run build`

---

## Phase 1 — Technical Debt & Foundation

**Goal:** Limpar dívida técnica acumulada e migrar para APIs modernas do Astro 6 antes de qualquer trabalho visual.

**Why first:** Debug instrumentation no código e dependência de CDN externo são riscos ativos. View Transitions e Fonts API são pré-requisitos para o visual das fases seguintes.

### Plans

**1.1 — Remove Debug Instrumentation**
Remove os 5 blocos `// #region agent log` com fetch para `127.0.0.1:7777` de:
- `astro.config.mjs` (linhas 16–36)
- `src/lib/productsNav.ts` (linhas 39–59)
- `src/components/home/ProductsGrid.astro` (linhas 18–38)
- `src/components/ui/text-generate-effect.tsx` (linhas 25–45)
- `src/components/ui/lamp.tsx` (linhas 8–32)

Verificar: `grep -r "127.0.0.1" src/` retorna vazio.

**1.2 — Astro 6 Fonts API Migration**
- Adicionar `fonts` config em `astro.config.mjs` com `fontProviders.google()` para Playfair Display e Inter
- Remover `<link>` Google Fonts do `Layout.astro`
- Adicionar `<Font cssVariable="..." />` no `<head>`
- Atualizar `@theme` no `global.css` com variáveis das fontes self-hosted

**1.3 — View Transitions + 404 + Favicon**
- `<ClientRouter />` no `Layout.astro` (import de `astro:transitions`)
- `src/pages/404.astro` com design Navy/Gold, mensagem amigável, link para home
- Favicon real: criar `public/favicon.svg` com símbolo do Grupo US (stylized "US" dourado)

**Requirements:** TECH-01, TECH-02, TECH-03, TECH-04, TECH-05

---

## Phase 2 — Content & Copy Overhaul

**Goal:** Todo o conteúdo do site com acentuação correta, copy de impacto e meta descriptions únicas para SEO.

**Why now:** Copy é a base de tudo. Sem conteúdo correto, visual e SEO não têm substância. Fazer antes do visual para não retrabalhar animações sobre conteúdo errado.

### Plans

**2.1 — Fix Accents & Typography**
Corrigir todos os arquivos JSON em `src/content/products/*.json` e `src/content/team/*.json`:
- Acentuação: "Saude Estetica Avancada" → "Saúde Estética Avançada"
- Aspas tipográficas onde relevante
- Verificar componentes Astro com texto hardcoded (Header, Footer, páginas)

**2.2 — Product Copy Rewrite**
Reescrever campos `name`, `tagline`, `description`, `hero.headline`, `hero.subheadline`, `painPoints`, `pillars`, `benefits`, `differentials`, `faqs` para todos os 7 produtos usando:
- Fonte: `docs/plans/aprimoramento/gpus-company-info.md` (Manual de Inteligência)
- Fonte: `.planning/research/drasacha-content.md` (pesquisa do drasacha.com.br — quando disponível)
- Tom: profissional, acolhedor, inspirador, firme. Fala como "Nós".
- Frases-chave: "Nós iluminamos", "Clareza é a nova gentileza", "Olhar de dono", "Excelência com entrega real"

**2.3 — SEO Meta & Team**
- Meta descriptions únicas por página (max 160 chars, com palavra-chave)
- Bio da equipe enriquecidas (`src/content/team/*.json`)
- Título de cada página com formato "[Produto/Seção] | Grupo US"

**Requirements:** COPY-01, COPY-02, COPY-03, COPY-04

---

## Phase 3 — Visual Uplift & Animation System

**Goal:** Transformar a identidade visual de "flat navy" para "premium imersivo" com aurora hero, Liquid Glass real e micro-interações em todo o site.

**Why now:** Base técnica e conteúdo prontos. Agora o visual pode ser construído sobre fundação sólida.

### Plans

**3.1 — Aurora Hero Backgrounds**
- `src/components/ui/aurora-background.tsx` já existe — ativar e integrar no `HomeHero`
- Configurar cores navy/gold no componente aurora
- Hero das landings: mesh gradient animado via CSS keyframes (sem React Island para performance)
- Fallback CSS puro para `prefers-reduced-motion`

**3.2 — Liquid Glass Design System Upgrade**
Atualizar `src/styles/global.css`:
- `.glass-card`: adicionar `backdrop-filter: blur(16px)`, `background: rgba(26, 26, 46, 0.6)`, borda com `linear-gradient` sutil dourado
- `.gold-glow`: ampliar shadow com múltiplas camadas
- `.card-hover-lift`: adicionar `box-shadow` dinâmico no hover
- Novo utility `.glass-card-bright` para seções de destaque

**3.3 — Micro-interactions & Scroll Reveals**
- ProductsGrid cards: `mousemove` glow dinâmico via CSS custom properties (sem React)
- Botões: `scale(1.02)` + glow no hover, `scale(0.98)` no active
- `data-reveal` animations: migrar de CSS puro para Framer Motion `motion.div` com `client:visible` nas seções principais
- Header dropdown: animação smooth de slide + fade

**Requirements:** VIS-01, VIS-02, VIS-03, VIS-04, VIS-05, VIS-06

---

## Phase 4 — React Islands: Premium Interactions

**Goal:** Adicionar os 3 componentes React de alto impacto que diferenciam o site de institucional comum para experiência premium.

**Why now:** Visual system pronto. Islands são os "momentos wow" que se apoiam na base visual.

### Plans

**4.1 — Journey Timeline**
`src/components/home/JourneyTimeline.tsx` (`client:visible`):
- 5 nós animados: Auriculoterapia → Comunidade US → TRINTAE3 → Mentoria Black Neon → OTB
- Linha de progresso animada com Framer Motion
- Cada nó: ícone Lucide + nome do produto + ticket de entrada + CTA
- Mobile: scroll horizontal snap
- Integrar na `index.astro` entre `StatsSection` e `AboutPreview`

**4.2 — Testimonial Carousel**
`src/components/landing/TestimonialCarousel.tsx` (`client:visible`):
- Swipe com drag gesture (Framer Motion `useDragControls`)
- Autoplay 4s com pause no hover
- Indicadores de navegação (dots)
- Substituir `Testimonials.astro` em todas as landing pages
- Recebe `testimonials[]` como prop (mesmo schema atual)

**4.3 — WhatsApp Floating Button**
`src/components/shared/WhatsAppFloatingButton.tsx` (`client:load`):
- Posição: `fixed bottom-6 right-6 z-50`
- Ícone: `MessageCircle` Lucide ou SVG WhatsApp
- Animação de entrada: `scale` spring após 2s
- Prop `message` por página (passado via `Layout.astro`)
- Cor: `#25d366` (token `whatsapp` já existente no design system)
- Número: +55 11 92047-4028 (do gpus-company-info.md)

**Requirements:** ISLAND-01, ISLAND-02, ISLAND-03

---

## Phase 5 — SEO Technical Layer

**Goal:** Structured data completa, OG images reais e sitemap otimizado para rankeamento orgânico dos produtos.

**Why now:** Visual e conteúdo prontos. SEO técnico agora tem copy real para indexar.

### Plans

**5.1 — JSON-LD Per Product**
Adicionar em cada landing page (`trintae3.astro`, `mentoria-black-neon.astro`, `comunidade-us.astro`, `curso-auriculo.astro`, `neon-dash.astro`):
- Schema `Course` para formações (TRINTAE3, Curso Auriculo, Comunidade US)
- Schema `Product` + `Offer` para Mentoria Black Neon e NeonDash
- Campos: `name`, `description`, `provider` (Grupo US), `offers.price`, `educationalCredentialAwarded`

**5.2 — OG Images**
- Criar `public/og/` com imagens 1200×630 por página
- Formato: fundo navy, título em Playfair Display dourado, logo Grupo US
- Geração: script `scripts/generate-og.ts` ou SVG estático
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

**Goal:** Lighthouse ≥ 95, acessibilidade, cross-browser, deploy limpo no Railway.

**Why last:** Só faz sentido auditar após tudo implementado.

### Plans

**6.1 — Lighthouse & Performance Audit**
- Rodar Lighthouse em home, 2 landings e contato
- Otimizar imagens pesadas (WebP, lazy loading)
- Verificar CLS (Cumulative Layout Shift) em islands
- Ajustar `client:load` vs `client:visible` conforme resultado

**6.2 — Accessibility & Cross-browser**
- `alt` em todas as imagens
- Contraste mínimo 4.5:1 (especialmente Liquid Glass sobre navy)
- Focus visible em todos os elementos interativos
- Testar em Firefox, Safari, Chrome mobile

**6.3 — Final Build & Deploy**
- `bun run lint` ✓
- `bunx astro check` ✓
- `bun run build` ✓
- Deploy Railway via push main
- Smoke test nas 11 páginas em produção

**Requirements:** Todos os requisitos v1 verificados

---

## Summary

| Phase | Focus | Requirements | Est. Complexity |
|-------|-------|-------------|-----------------|
| 1 | Technical Debt & Foundation | TECH-01…05 | Low |
| 2 | Content & Copy Overhaul | COPY-01…04 | Medium |
| 3 | Visual Uplift & Animations | VIS-01…06 | High |
| 4 | React Islands | ISLAND-01…03 | High |
| 5 | SEO Technical Layer | SEO-01…06 | Medium |
| 6 | QA & Ship | All v1 | Low |

**Total v1 requirements:** 24
**Phases:** 6
**Granularity:** Standard (3–5 plans per phase)

---
*Roadmap created: 2026-03-25*
*Milestone: v2 Enhancement — Visual Premium + SEO + React Islands*
