# Portal Grupo US — Enhancement Milestone v2

## What This Is

Site institucional do Grupo US (grupous.com.br / Railway), ecossistema educacional em Saúde Estética Avançada, Negócios e Mentalidade. Construído em Astro 6 SSG + Tailwind v4 + React 19 + Framer Motion, com 11 páginas, 7 produtos em Content Collections e design Navy/Gold. Esta milestone transforma o site de "funcional" para **premium e imersivo** — elevando visual, animações, conteúdo e SEO técnico para refletir o posicionamento de luxo do ecossistema.

## Core Value

Cada visitante deve sentir o nível de excelência do Grupo US em 3 segundos — através de design imersivo, copy de impacto e jornada de produto clara.

## Requirements

### Validated

- ✓ 11 páginas Astro geradas (SSG) com rotas corretas — v1
- ✓ Design system Navy/Gold com tokens CSS — v1
- ✓ Content Collections: 7 produtos + 3 equipe com Zod schemas — v1
- ✓ Landing page template reutilizável (9 componentes) — v1
- ✓ Header/Footer responsivos com menu mobile — v1
- ✓ Redirects estáticos: /na-mesa-certa e /otb — v1
- ✓ JSON-LD Organization + BreadcrumbList no layout — v1
- ✓ Open Graph + Twitter cards por página — v1
- ✓ Sitemap automático — v1

### Active

**Technical Foundation:**
- [ ] Remover 5 blocos de debug instrumentation (`#region agent log`) deixados no código
- [ ] Migrar para Astro 6 Fonts API (self-hosted Playfair Display + Inter, sem Google CDN)
- [ ] Adicionar View Transitions (`<ClientRouter />`) para navegação SPA-like
- [ ] Criar página 404 customizada com branding Navy/Gold
- [ ] Substituir favicon genérico por favicon real do Grupo US

**Content & Copy:**
- [ ] Corrigir acentuação em todos os arquivos JSON (produtos + team) e componentes Astro
- [ ] Reescrever copy de todos os produtos usando drasacha.com.br + Manual de Inteligência como fonte
- [ ] Melhorar meta descriptions por página para SEO on-page

**Visual & Animations:**
- [ ] Aurora/mesh gradient animado no Hero da home e nas landings
- [ ] Upgrade do `glass-card` utility para Liquid Glass real (backdrop-blur, gradiente sutil)
- [ ] Micro-interações refinadas: glow dinâmico nos cards, button feedback tátil
- [ ] Scroll-reveal animations mais expressivos (spring physics via Framer Motion)

**React Islands:**
- [ ] `JourneyTimeline.tsx` na Home — 5 estágios da jornada do aluno com animação
- [ ] `TestimonialCarousel.tsx` — Framer Motion swipe + autoplay em todos os produtos
- [ ] `WhatsAppFloatingButton.tsx` — botão flutuante global em todas as páginas

**SEO Técnico:**
- [ ] JSON-LD Product/Course schema por landing page de produto
- [ ] OG images estáticas por página (não mais placeholder inexistente)
- [ ] BreadcrumbList em todas as páginas internas (além do layout global)
- [ ] Sitemap com prioridades por tipo de página
- [ ] robots.txt explícito

### Out of Scope

- Blog/conteúdo editorial — alto custo de manutenção, não é o canal atual do Grupo US
- Dark/light mode toggle — tema Navy Dark é identidade da marca, sem alternativa
- CMS headless — Content Collections JSON são suficientes para o volume atual
- Mapa no contato — baixa prioridade de conversão vs. WhatsApp
- Analytics (GA4/Plausible) — decisão de marketing, fora do escopo técnico desta milestone
- OAuth / área de membros — complexidade de backend incompatível com SSG

## Context

- **Stack:** Astro 6.0.8 + Tailwind v4 via Vite plugin + React 19 + Framer Motion + Lucide React + Bun
- **Codebase:** Ver `.planning/codebase/` para mapa completo (STACK.md, ARCHITECTURE.md, etc.)
- **Deploy:** Railway via GitHub integration. Build: `bun run build` → `dist/`. Static served by Caddy.
- **Linting:** Biome + oxlint + Lefthook. Gates: `bun run lint` + `bunx astro check` + `bun run build`.
- **Referência de conteúdo:** drasacha.com.br (site da Dra. Sacha), Manual de Inteligência Grupo US em `docs/plans/aprimoramento/gpus-company-info.md`
- **Jornada canônica:** curso-auriculo → comunidade-us → trintae3 → mentoria-black-neon → otb
- **Dívida técnica ativa:** 5 blocos `#region agent log` com fetch para `127.0.0.1:7777` devem ser removidos antes de qualquer outro trabalho

## Constraints

- **Tech Stack:** Astro 6 SSG + Bun only. Nenhum framework de roteamento client-side. Nenhum npm/yarn/pnpm.
- **Performance:** Lighthouse ≥ 95 em Performance. Não usar `client:load` para componentes fora da primeira dobra.
- **Design:** Nunca hardcodar hex — apenas tokens Tailwind. Nunca usar emojis como ícones — Lucide React SVG only.
- **React Islands:** Apenas com justificativa clara. Preferir Astro puro + CSS animations quando possível.
- **Animações:** Nunca animar `width/height/top/left` — apenas `transform/opacity`.
- **Build:** `bun run lint` + `bunx astro check` + `bun run build` devem passar após cada fase.
- **Conteúdo:** Nunca hardcodar conteúdo em componentes — usar Content Collections.

## Key Decisions

| Decisão | Racional | Outcome |
|----------|-----------|---------|
| Astro 6 SSG + MPA (sem SPA) | Zero JS por padrão, performance máxima, sem router client-side | ✓ Good |
| React Islands apenas para interatividade real | Evita JS desnecessário, mantém Lighthouse alto | ✓ Good |
| Navy Dark como único tema | Identidade visual da marca — premium/luxo sem ambiguidade | ✓ Good |
| Content Collections JSON (sem CMS) | Volume de conteúdo estável, sem overhead de CMS externo | ✓ Good |
| View Transitions para navegação | Melhora percepção de velocidade sem SPA real | — Pending |
| Astro Fonts API (self-hosted) | Remove dependência Google CDN, melhora privacy + CWV | — Pending |

---
*Last updated: 2026-03-25 after project initialization (v2 Enhancement Milestone)*
