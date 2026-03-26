# Codebase Structure

**Analysis Date:** 2026-03-25 — **sync:** 2026-03-26

## Directory Layout

```
gpus/                              # Project root
├── src/
│   ├── components/
│   │   ├── about/                 # About page section components
│   │   ├── home/                  # Home page section components
│   │   ├── landing/               # Reusable product landing section components
│   │   ├── layout/                # Header and Footer
│   │   ├── shared/                # Design system primitives (Button, Card, Logo, SectionHeading)
│   │   └── ui/                    # React Islands: Aceternity UI visual effects
│   ├── content/
│   │   ├── products/              # 7 product JSON files (Content Collection)
│   │   └── team/                  # 13 team member JSON files (Content Collection — expandido)
│   ├── layouts/
│   │   └── Layout.astro           # Single root layout for all pages
│   ├── lib/
│   │   ├── whatsapp.ts            # SDR Laura — wa.me URLs + mensagens padrão
│   │   ├── productsNav.ts         # Nav link builder from product collection
│   │   └── utils.ts               # cn() helper (clsx + tailwind-merge)
│   ├── pages/
│   │   ├── index.astro            # Home
│   │   ├── sobre.astro            # About
│   │   ├── contato.astro          # Contact
│   │   ├── curso-auriculo.astro   # Product landing page
│   │   ├── mentoria-black-neon.astro  # Product landing page
│   │   ├── termos.astro           # Terms of use
│   │   ├── politica-de-privacidade.astro  # Privacy policy (LGPD)
│   │   └── 404.astro              # Custom 404 page
│   └── styles/
│       └── global.css             # Design tokens (@theme {}), utilities, animations
├── astro.config.mjs               # Astro config: redirects, fonts, integrations, Vite plugins
├── src/content.config.ts          # Content Collections: Zod schemas for products + team
├── package.json
├── tsconfig.json
├── biome.json                     # Biome formatter + linter config
└── lefthook.yml                   # Git pre-commit hook (runs bun run lint)
```

## Pages / Routes

**Resumo:** 8 ficheiros `.astro` em `src/pages/` (conteúdo próprio) + 5 redirects só em `astro.config.mjs`. Landings “completas” no repo: **curso-auriculo** e **mentoria-black-neon**; os outros produtos resolvem para URLs externas via redirect ou `externalSiteUrl` na navegação.

| File | Route | Purpose |
|------|--------|---------|
| `src/pages/index.astro` | `/` | Home: Hero, ProductsGrid, JourneyTimeline, StatsSection, AboutPreview, CTASection |
| `src/pages/sobre.astro` | `/sobre` | About: Founders, Mission, Values, Culture, TeamGrid |
| `src/pages/contato.astro` | `/contato` | Contact form, WhatsApp Laura (`src/lib/whatsapp.ts`), channels |
| `src/pages/curso-auriculo.astro` | `/curso-auriculo` | Product landing — Curso Técnico |
| `src/pages/mentoria-black-neon.astro` | `/mentoria-black-neon` | Product landing — Mentoria (NeonStory, Bonus, Bio, etc.) |
| `src/pages/termos.astro` | `/termos` | Terms of use |
| `src/pages/politica-de-privacidade.astro` | `/politica-de-privacidade` | Privacy — LGPD |
| `src/pages/404.astro` | `/404` | Custom 404 |
| `astro.config.mjs` | `/na-mesa-certa` | → `https://namesa.gpus.com.br/` |
| `astro.config.mjs` | `/otb` | → `https://otb.gpus.com.br/` |
| `astro.config.mjs` | `/trintae3` | → `https://trintae3.drasacha.com.br/` |
| `astro.config.mjs` | `/comunidade-us` | → inscrição COMU (drasacha) |
| `astro.config.mjs` | `/neon-dash` | → `https://neondash.com.br/` |

## Component Organization

### `src/components/layout/`
Global chrome — present on every page.
- `Header.astro` — Fixed top bar: Logo, desktop nav with products dropdown, mobile hamburger/overlay menu, scroll border effect. Receives `productNavLinks` prop.
- `Footer.astro` — 4-column footer. Receives `productNavLinks` prop.

### `src/components/home/`
Sections exclusive to the home page (`/`).
- `Hero.astro` — Full-viewport hero with aurora background React island
- `ProductsGrid.astro` — Fetches all products, renders 3-column card grid sorted by `order`
- `JourneyTimeline.astro` — 5-stage customer journey (Astro estático; CTAs respeitam `externalSiteUrl` / rotas)
- `StatsSection.astro` — Numbers/statistics section
- `AboutPreview.astro` — Teaser section linking to `/sobre`
- `CTASection.astro` — Final call-to-action with React island effect

### `src/components/about/`
Sections exclusive to the about page (`/sobre`).
- `Founders.astro` — Founders profiles (Dra. Sacha + Maurício)
- `Mission.astro` — Mission/vision statement
- `Values.astro` — Company values grid
- `Culture.astro` — Culture narrative section
- `TeamGrid.astro` — Fetches `team` collection, renders team member cards sorted by `order`

### `src/components/landing/`
Reusable sections composed into product landing pages. All receive plain JS objects as props — no collection fetching inside components.

| Component | Props | Purpose |
|-----------|-------|---------|
| `LandingHero.astro` | `name, tagline, hero, type, cta` | Product hero with headline, subheadline, primary CTA + WhatsApp CTA |
| `PainPoints.astro` | `audience, painPoints[]` | Problem identification cards (min 3) |
| `Pillars.astro` | `pillars[]` | Three core methodology pillars (always exactly 3) |
| `Benefits.astro` | `benefits[]` | Bulleted benefits list (min 4) |
| `Deliverables.astro` | `deliverables[]` | Structured deliverable cards (optional, replaces Benefits) |
| `Differentials.astro` | `differentials[]` | Differentiators vs competitors (min 2) |
| `Testimonials.astro` | `testimonials[], layout?` | Social proof cards — `layout="strip"` for scroll-snap strip on home |
| `FAQ.astro` | `faqs[]` | Accordion using native `<details>`/`<summary>` — zero JS |
| `LandingCTA.astro` | `name, cta` | Final conversion section |
| `MobileCTABar.astro` | `cta` | Fixed bottom bar on mobile (`pb-[calc(5rem+env(safe-area-inset-bottom,0px))]`) |
| `NeonStory.astro` | `story` | Optional empathy/origin story section (mentoria-black-neon) |
| `NeonBonus.astro` | `bonus[]` | Optional bonus items section (mentoria-black-neon) |
| `NeonBio.astro` | `bio` | Optional founder bio section (mentoria-black-neon) |

### `src/components/shared/`
Design system primitives used across all layers.
- `Button.astro` — Polymorphic CTA: `<a>` when `href` set, `<button>` otherwise. Variants: `primary | whatsapp | outline | ghost`. Sizes: `sm | md | lg`.
- `Card.astro` — Glass-card container with optional `href` (becomes `<a>`), `hoverable` prop adds `card-hover-lift` class
- `Logo.astro` — Grupo US logo SVG
- `SectionHeading.astro` — Reusable `<h2>` + subtitle pattern used by all sections

### `src/components/ui/`
React Islands for Aceternity UI visual effects. All are `.tsx` files, imported with `client:load` or `client:visible` in Astro pages.
- `aurora-background.tsx` — Animated aurora gradient background (used in Hero)
- `spotlight.tsx` — Radial spotlight effect
- `background-beams.tsx` — Animated beam lines
- `lamp.tsx` — Lamp glow effect
- `moving-border.tsx` — Animated border gradient
- `text-generate-effect.tsx` — Letter-by-letter text animation
- `wavy-background.tsx` — Animated wavy gradient

## Content Collections

### `src/content/products/` — 7 files

| File | Slug | Product | Type | Has externalSiteUrl |
|------|------|---------|------|---------------------|
| `curso-auriculo.json` | `curso-auriculo` | Curso de Aurículo | Curso Técnico | No |
| `comunidade-us.json` | `comunidade-us` | Comunidade US | Educação Continuada | Yes |
| `trintae3.json` | `trintae3` | Trintae3 | Pós-graduação + Mentoria | Yes |
| `mentoria-black-neon.json` | `mentoria-black-neon` | Mentoria Black Neon | Mentoria de Negócios | No |
| `otb.json` | `otb` | OTB | MBA Internacional | Yes |
| `neon-dash.json` | `neon-dash` | Neon Dash | Programa de Execução | Yes |
| `na-mesa-certa.json` | `na-mesa-certa` | Na Mesa Certa | Evento Presencial | Yes |

**Canonical journey order** (by `order` field): `curso-auriculo` (5) → `comunidade-us` → `trintae3` → `mentoria-black-neon` → `otb`. `neon-dash` and `na-mesa-certa` are complementary — not in the 5-stage sequence.

**Schema location:** `src/content.config.ts` — Zod schema with required and optional fields. Key optional fields: `externalSiteUrl`, `deliverables[]`, `bonus[]`, `story`, `bio`.

### `src/content/team/` — 13 files
Team members: `sacha.json`, `mauricio.json`, `andressa.json`, `ariane.json`, `bruno.json`, `erika.json`, `jessica.json`, `joao-vitor.json`, `lucas.json`, `raquel.json`, `renata.json`, `riller.json`, `roberta.json`. Sorted by `order` field in `TeamGrid.astro`.

## Layout Hierarchy

```
Layout.astro                        ← All pages wrap in this
├── <head>
│   ├── SEO meta (title, description, canonical, OG, Twitter)
│   ├── JSON-LD (Organization always; BreadcrumbList if breadcrumbs prop)
│   └── Astro Fonts API (Playfair Display + Inter)
├── <body>
│   ├── .skip-link                  ← Accessibility skip nav
│   ├── Header.astro                ← Fixed top nav
│   ├── <main id="conteudo-principal">
│   │   └── <slot />                ← Page-specific content injected here
│   ├── Footer.astro
│   └── <script>                    ← IntersectionObserver for data-reveal
```

## Key File Locations

**Entry Points:**
- `src/pages/index.astro` — Home page
- `src/layouts/Layout.astro` — Universal HTML shell

**Configuration:**
- `astro.config.mjs` — Site URL, redirects, fonts, integrations (React, sitemap), Vite plugins (Tailwind v4)
- `src/content.config.ts` — Content Collection schemas (Zod)
- `src/styles/global.css` — Design tokens `@theme {}`, custom utilities, animation keyframes
- `biome.json` — Formatter + linter (covers `src/**` and `astro.config.mjs`)

**Core Logic:**
- `src/lib/productsNav.ts` — Converts product collection entries to typed nav link objects
- `src/lib/utils.ts` — `cn()` helper for React components

**Content:**
- `src/content/products/*.json` — All product data
- `src/content/team/*.json` — All team member data

## Naming Conventions

**Files:**
- Astro components: PascalCase (e.g., `LandingHero.astro`, `ProductsGrid.astro`)
- React components: kebab-case matching Aceternity UI convention (e.g., `aurora-background.tsx`, `moving-border.tsx`)
- Pages: kebab-case matching URL slug (e.g., `curso-auriculo.astro`, `mentoria-black-neon.astro`)
- Content JSON: kebab-case matching product slug (e.g., `curso-auriculo.json`)
- Lib utilities: camelCase (e.g., `productsNav.ts`, `utils.ts`)

**Directories:** lowercase (`components/`, `content/`, `layouts/`, `lib/`, `pages/`, `styles/`)

## Where to Add New Code

**New product landing page:**
1. Create `src/content/products/{slug}.json` with full schema (use `curso-auriculo.json` as baseline template)
2. Create `src/pages/{slug}.astro` using the landing page template pattern from `src/pages/curso-auriculo.astro`
3. If product is external-only: add `externalSiteUrl` to JSON + add redirect to `astro.config.mjs` `redirects` object
4. Product auto-appears in nav dropdown and home grid (sorted by `order` field)

**New landing section component:**
- Place in `src/components/landing/`
- Accept plain JS object props (no `CollectionEntry` types)
- Use `interface Props {}` in frontmatter

**New home page section:**
- Place in `src/components/home/`

**New about page section:**
- Place in `src/components/about/`

**New shared primitive:**
- Place in `src/components/shared/`

**New React visual effect island:**
- Place in `src/components/ui/` as `.tsx`
- Import `cn` from `@/lib/utils`
- Use `client:load` or `client:visible` at the usage site

**New utility/helper:**
- Place in `src/lib/` as `.ts`

**New team member:**
- Create `src/content/team/{name}.json` — auto-appears in TeamGrid sorted by `order`

## Special Directories

**`.planning/codebase/`:**
- Purpose: GSD codebase analysis documents
- Generated: By GSD map-codebase agent
- Committed: Yes

**`dist/`:**
- Purpose: Build output (SSG static files)
- Generated: Yes (`bun run build`)
- Committed: No (in `.gitignore`)

**`node_modules/`:**
- Purpose: Dependencies
- Generated: Yes (`bun install`)
- Committed: No

---

*Structure analysis: 2026-03-25; synced 2026-03-26*
