# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Prerequisites

- Read root `AGENTS.md` before any action — it is the single source of truth for project rules, design system, and constraints.

## Commands

| Task             | Command            |
| ---------------- | ------------------ |
| Install          | `bun install`      |
| Dev server       | `bun run dev`      |
| Build            | `bun run build`    |
| Preview          | `bun run preview`  |
| Type check       | `bunx astro check` |
| Lint (no fix)    | `bun run lint`     |
| Lint + fix       | `bun run lint:fix` |

**Package manager: Bun only.** Never use npm/yarn/pnpm.

**Lint:** [Biome](https://biomejs.dev) covers `src/**` and `astro.config.mjs` (format + lint). [oxlint](https://oxc.rs/docs/guide/usage/linter.html) covers `src` JS/TS/JSX. No unit test runner. Validation gates: `bun run lint`, `bunx astro check`, and `bun run build`. Git pre-commit runs `bun run lint` via [Lefthook](https://github.com/evilmartians/lefthook). The `prepare` script uses `|| true` to avoid failure on CI/Railway (no `.git`).

## Architecture

**Stack:** Astro 6 + Tailwind CSS v4 + React 19 (Islands) + Framer Motion + Lucide React.

**Type:** Multi-product institutional website for Grupo US (health aesthetics education ecosystem). Static site with 11 pages, deployed to Railway.

### Site structure (10 Astro pages + 2 redirect routes)

- `/` — Home (hero + product grid + stats + about preview + CTA)
- `/sobre` — About company (mission/vision + values + team)
- `/trintae3` — Landing page: Pos-graduacao + Mentoria
- `/otb` — Redirect estatico para deck OTB Dubai (`externalSiteUrl` + `astro.config` redirects)
- `/mentoria-black-neon` — Landing page: Mentoria de Negocios
- `/comunidade-us` — Landing page: Educacao Continuada
- `/curso-auriculo` — Landing page: Curso Tecnico
- `/neon-dash` — Landing page (produto neon-dash)
- `/na-mesa-certa` — Redirect estatico para site Na Mesa Certa
- `/contato` — Contact form + WhatsApp + channels
- `/termos` — Terms of use
- `/politica-de-privacidade` — Privacy policy (LGPD)

### Component organization

```
src/components/
├── layout/    # Header.astro, Footer.astro (sticky header, 4-col footer)
├── home/      # Hero, ProductsGrid, StatsSection, AboutPreview, CTASection
├── about/     # Mission, Values, TeamGrid
├── landing/   # Reusable product landing page sections (9 components)
├── shared/    # SectionHeading, Card (glass-card), Button (4 variants)
└── contact/   # ContactForm (if extracted)
```

### Key architectural decisions

- **Tailwind v4 via Vite plugin** — configured in `astro.config.mjs` as `@tailwindcss/vite`. No `tailwind.config.js`. All custom tokens live in `src/styles/global.css` using `@theme {}` directive.
- **Content Collections with config.ts** — `src/content.config.ts` defines Zod schemas + glob loaders for `products` (6 JSON files) and `team` (3 JSON files). Data is fetched via `getCollection()` in page/component frontmatter.
- **Zero React Islands** — All components are `.astro` (zero client JS). FAQ uses native `<details>`/`<summary>` with CSS. Testimonials are static cards. Do NOT add React islands without justification.
- **Multi-page (MPA)** — All navigation uses standard `<a>` tags with full page reload. No client-side router. No SPA patterns.
- **Layout** — `src/layouts/Layout.astro` provides `<head>`, SEO meta, JSON-LD Organization schema, Google Fonts (Playfair Display + Inter), skip-link, noscript reveal fallback, IntersectionObserver for `data-reveal`. Language is `pt-BR`.

### Data flow for product landing pages

```
1. Page frontmatter: getCollection('products') → find by slug → extract .data
2. Pass data fields as individual props to landing components:
   LandingHero ← {name, tagline, hero, type, cta}
   PainPoints  ← {audience, painPoints[]}
   Pillars     ← {pillars[]}
   Benefits    ← {benefits[]}
   Differentials ← {differentials[]}
   Testimonials ← {testimonials[]}
   FAQ         ← {faqs[]}
   LandingCTA  ← {name, cta}
   MobileCTABar ← {cta}
```

Components receive plain JS objects, not Astro collection entries.

### Content Collections schema

**products** (`src/content/products/*.json`): name, slug, tagline, description, type, audience, icon (Lucide name), image, order, hero {headline, subheadline}, painPoints[] (min 3), pillars[] (3), benefits[] (min 4), differentials[] (min 2), faqs[] (min 3), cta {label, url, whatsappMessage, type}, testimonials[] (min 2).

**team** (`src/content/team/*.json`): name, role, bio, photo, order, social {instagram?, linkedin?, twitter?}.

To add a new product: create JSON in `src/content/products/` + create page in `src/pages/` using the landing template pattern.

### Styling

- `src/styles/global.css` defines color tokens via `@theme {}` and custom utilities.
- **Colors:** `navy` (#1a1a2e), `navy-light` (#2a2a40), `navy-lighter` (#3d3d5c), `gold` (#d4af37), `gold-light` (#e8c96a), `gold-dark` (#b8960c), `text-primary` (#fafaf9), `text-muted` (#94a3b8), `whatsapp` (#25d366).
- **Fonts:** `font-serif` (Playfair Display) for headings, `font-sans` (Inter) for body.
- **Utilities:** `glass-card` (glassmorphism), `gold-glow` (shadow), `card-hover-lift` (hover translateY), `gold-pulse-glow` (animated glow).
- **Animations:** `data-reveal="up|left|right|scale"` + `data-reveal-delay="N"` for scroll-triggered CSS animations via IntersectionObserver.
- Dark navy is the only theme — no light/dark toggle.
- NEVER hardcode hex values — always use Tailwind tokens.

### Negative constraints

- NEVER use emojis as icons — Lucide React SVG only.
- NEVER hardcode content in components — use Content Collections.
- NEVER add React Islands without justification — Astro zero-JS default.
- NEVER use SPA routing — full page reload (MPA).
- NEVER animate width/height/top/left — use transform/opacity only.
- NEVER use npm/yarn/pnpm — Bun only.

## Behavior

- Implement directly, don't just suggest.
- Environment: Linux (WSL Ubuntu).
- Prefer non-interactive, self-terminating commands.
- Always run commands with timeout to avoid stuck processes.
- Commit format: Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `chore:`).

## Deploy

Railway via GitHub integration. Build: `bun run build` → output: `dist/`. Static site served by Caddy.
