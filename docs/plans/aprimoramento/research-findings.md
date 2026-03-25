# Research Findings - GPUS Site Institucional

## Findings Table

| # | Finding | Confidence | Source | Impact |
|---|---------|-----------|--------|--------|
| 1 | Astro 6 é ideal para sites institucionais/corporativos - zero JS por padrão | 5 | astro.build/blog/astro-6, fullstackevolved.com | Alto |
| 2 | Islands Architecture: JS só carrega para componentes interativos (client:visible, client:load) | 5 | Docs oficiais Astro, namesa repo | Alto |
| 3 | Astro 6 Fonts API built-in: download, cache, self-hosting automático | 5 | astro.build/blog/astro-6 | Médio |
| 4 | Content Collections com Zod schemas para dados tipados (produtos, equipe, depoimentos) | 5 | Docs Astro, namesa repo | Alto |
| 5 | Tailwind v4 via @tailwindcss/vite plugin (sem tailwind.config.js) | 5 | namesa repo, tailkits.com | Alto |
| 6 | O repo namesa já usa Astro 6 + React 19 + Tailwind v4 + Framer Motion (padrão validado) | 5 | GrupoUS/namesa | Alto |
| 7 | O repo gpus-site já tem scaffold Astro básico com skills de tema GPUS definidos | 5 | GrupoUS/gpus-site | Alto |
| 8 | Tema GPUS existente: Gold (#D4AF37 / HSL 38 60% 45%), Navy dark (#0F1A2E / HSL 211 49% 10%) | 5 | gpus-site/gpus-theme | Alto |
| 9 | OTB-DUBAI: Vite+React+shadcn/ui, tema Gold & White, Framer Motion | 5 | GrupoUS/OTB-DUBAI | Médio |
| 10 | NeonDash: Monorepo Turbo, Bun, API tRPC, marketing/email system | 5 | GrupoUS/neondash | Médio |
| 11 | Performance Astro: Lighthouse 98-100, FCP < 0.8s, JS 15-40KB vs Next.js 120-200KB | 4 | fullstackevolved.com | Alto |
| 12 | Astro 6 requer Node 22+ | 5 | infoq.com/news/astro-v6-beta | Médio |
| 13 | Astro 6 CSP API estável para segurança | 4 | astro.build/blog/astro-6 | Baixo |
| 14 | Site atual drasacha.com.br é focado na persona Dra. Sacha, não na empresa | 5 | drasacha.com.br | Alto |
| 15 | Empresa tem 6 produtos, jornada do aluno em 5 estágios, 3 pessoas-chave | 5 | Google Docs empresa | Alto |

## Padrões Existentes nos Repos

### namesa (Astro 6 + React 19 + Tailwind v4)
- Islands: CountdownTimer (client:load), Testimonials (client:visible), FAQAccordion (client:visible)
- Content Collections: speakers, testimonials, faqs (JSON)
- Tema: Navy (#1a1a2e) + Gold (#D4AF37) - sem toggle dark/light
- Biome + oxlint para linting
- Lefthook para git hooks

### gpus-site (Astro scaffold)
- Scaffold básico Astro 6.0.8
- Skills definidos: astro, gpus-theme, performance-optimization, planning, debugger
- Tema GPUS com CSS variables (HSL), glass-card, bg-mesh, bg-noise utilities
- Suporte dark/light mode via CSS variables

### OTB-DUBAI (Vite + React)
- shadcn/ui components
- Framer Motion animations
- Tema Gold/White premium
- Slides interativos

## Knowledge Gaps
- Domínio final do site institucional (grupous.com.br? gpus.com.br?)
- Hospedagem preferida (Vercel, Cloudflare, Netlify?)
- Necessidade de CMS headless ou content collections estáticas são suficientes?
- Integração com analytics (GA4, Plausible?)

## Assumptions
- O site será estático (SSG) sem necessidade de server-side rendering
- Conteúdo gerenciado via Content Collections (sem CMS externo inicialmente)
- Deploy via Vercel ou Cloudflare Pages
- Reutilizar tema GPUS existente (Gold + Navy) como base
