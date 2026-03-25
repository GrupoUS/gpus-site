# Análise Completa do Estado Atual — gpus-site

## Data: 2026-03-25

## 1. O QUE JÁ FOI IMPLEMENTADO (Estado Atual)

### Tech Stack (Validado — Build OK)
- Astro 6.0.8 + React 19 + Tailwind CSS v4 + Framer Motion + Lucide React
- Biome + oxlint + Lefthook (linting/hooks)
- TypeScript strict mode
- Content Collections com Zod schemas (products, team)
- SSG output (10 páginas geradas)
- Sitemap automático

### Páginas (10 total)
1. **index.astro** — Home: Hero + ProductsGrid + StatsSection + AboutPreview + CTASection
2. **sobre.astro** — Sobre: Mission + Values + TeamGrid + CTA
3. **contato.astro** — Formulário (Formspree placeholder) + WhatsApp + Info
4. **trintae3.astro** — Landing completa com funil (Hero → PainPoints → Pillars → Benefits → Differentials → Testimonials → FAQ → CTA)
5. **mentoria-black-neon.astro** — Landing completa (mesmo template)
6. **comunidade-us.astro** — Landing completa
7. **curso-auriculo.astro** — Landing completa
8. **neon-dash.astro** — Landing completa
9. **politica-de-privacidade.astro** — Texto legal
10. **termos.astro** — Texto legal

### Redirects (astro.config)
- /na-mesa-certa → https://namesacerta.com.br/
- /otb → https://ota-dubai.lovable.app/

### Componentes (22 total)
- **Layout:** Header.astro (mobile menu, products dropdown, scroll effect), Footer.astro (4 colunas)
- **Home:** Hero, ProductsGrid, StatsSection, AboutPreview, CTASection
- **About:** Mission, Values, TeamGrid
- **Landing (reutilizáveis):** LandingHero, PainPoints, Pillars, Benefits, Differentials, FAQ, LandingCTA, MobileCTABar, Testimonials
- **Shared:** Button, Card, SectionHeading

### Content Collections
- **7 produtos** com dados completos (painPoints, pillars, benefits, differentials, FAQs, testimonials, CTAs)
- **3 membros da equipe** (Sacha, Maurício, Raquel)

### Design System
- Tema Navy Dark (#0F1A2E) + Gold (#D4AF37)
- Tipografia: Playfair Display (headings) + Inter (body)
- CSS custom properties + Tailwind utilities
- Glass-card, gold-glow, card-hover-lift utilities
- Scroll-reveal animations (IntersectionObserver)
- Accessibility: skip-link, focus-visible, prefers-reduced-motion
- Responsive breakpoints

### SEO
- JSON-LD Organization schema
- Open Graph + Twitter cards
- Canonical URLs
- Meta description por página

---

## 2. GAPS E PROBLEMAS IDENTIFICADOS

### CRÍTICOS (P0)
1. **Zero imagens reais** — Nenhuma imagem no /public (apenas favicon). Team photos são placeholders (/images/team/*.jpg não existem). Product images idem. Hero sem background visual.
2. **Logo é texto puro** — "Grupo US" em texto, sem logo SVG/PNG real.
3. **Formulário de contato não funcional** — action="https://formspree.io/f/placeholder" (literal "placeholder").
4. **Acentuação ausente em todo o conteúdo** — Todos os textos estão sem acentos (ex: "Saude Estetica Avancada" em vez de "Saúde Estética Avançada"). Isso é grave para SEO e credibilidade.

### IMPORTANTES (P1)
5. **Sem componentes React Islands** — Apesar de React 19 e Framer Motion estarem instalados, NENHUM componente .tsx existe. Tudo é Astro puro. O carrossel de depoimentos é estático, sem animação.
6. **Sem seção de Jornada do Aluno** — O documento da empresa define 5 estágios (Auriculoterapia → Comunidade → TRINTAE3 → Black Neon → OTB), mas não há visualização dessa jornada/timeline.
7. **About Preview na home é fraco** — Apenas texto + placeholder de foto. Sem impacto visual.
8. **Sem analytics** — Nenhum GA4, Plausible ou similar.
9. **Sem favicon real** — favicon.svg é genérico do Astro.
10. **Sem OG image real** — Referencia /og-image.jpg que não existe.

### MELHORIAS (P2)
11. **Sem animações de scroll sofisticadas** — Apenas fade-in básico via CSS. Framer Motion não é utilizado.
12. **Sem efeito Liquid Glass** — O design system recomendou Liquid Glass mas não foi implementado.
13. **Sem background patterns/gradients no Hero** — Hero é flat, sem mesh gradient ou partículas.
14. **Product cards sem ícones reais** — Usa 2 letras do nome como placeholder (ex: "GR" para TRINTAE3).
15. **Sem página de Blog/Conteúdo** — Poderia ter artigos para SEO.
16. **Sem WhatsApp floating button** — CTA de WhatsApp só no footer e CTA section.
17. **Sem loading/skeleton states** — Páginas carregam sem transição.
18. **Sem View Transitions** — Astro 6 suporta nativamente.
19. **Fonts via Google Fonts CDN** — Deveria usar Astro 6 Fonts API built-in para self-hosting.
20. **Sem dark/light toggle** — Apenas dark mode fixo (ok para o conceito, mas sem opção).
21. **Contato: sem mapa** — Poderia ter localização.
22. **Sem micro-interações** — Botões, cards sem feedback tátil refinado.
23. **Header Products dropdown** — Funciona mas sem animação suave.
24. **Sem breadcrumbs** nas páginas internas.
25. **Sem 404 page** personalizada.
