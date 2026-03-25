# Architecture

**Analysis Date:** 2026-03-25

## Pattern Overview

**Overall:** Static Site Generation (SSG) — Multi-Page Application (MPA)

**Key Characteristics:**
- Zero client-side routing: all navigation uses `<a>` tags with full page reload
- Content Collections as the single source of truth for all product and team data
- Minimal JavaScript: React is used only for visual effect islands (Aceternity UI), not for state or routing
- All product landing pages share identical component composition with data-driven variation

## Rendering Strategy

**Mode:** SSG (Static Site Generation) — all pages pre-rendered at build time via `bun run build`

**Output:** `dist/` directory served as static files via Caddy on Railway

**JavaScript delivery:**
- Astro components: zero JS by default
- React Islands in `src/components/ui/`: hydrated with `client:load` (hero) or `client:visible` (CTA sections)
- Inline `<script>` tags in `Header.astro` and `Layout.astro` for mobile menu and scroll-reveal observer

## Layers

**Pages Layer:**
- Purpose: Route definitions and data orchestration
- Location: `src/pages/`
- Contains: `.astro` files — each calls `getCollection()`, finds product by slug, extracts `.data`, and composes landing components
- Depends on: Content Collections, Layout, landing components
- Used by: Astro file-based router

**Layout Layer:**
- Purpose: HTML shell, SEO meta, JSON-LD schemas, fonts, global scripts
- Location: `src/layouts/Layout.astro`
- Contains: `<head>` with Open Graph/Twitter meta, Organization + BreadcrumbList JSON-LD, font loading, skip-link, IntersectionObserver script
- Depends on: Header, Footer, `productsNav.ts`, Content Collections (nav links)
- Used by: Every page

**Component Layer:**
- Purpose: Presentational building blocks — receives plain JS objects, no data fetching
- Location: `src/components/`
- Contains: Section-level Astro components and React UI effect islands
- Depends on: `src/styles/global.css` design tokens
- Used by: Pages and Layout

**Data Layer:**
- Purpose: Structured content as JSON files, validated by Zod schemas
- Location: `src/content/products/` and `src/content/team/`
- Contains: 7 product JSON files, 13 team member JSON files
- Depends on: `src/content.config.ts` schema definitions
- Used by: Pages (via `getCollection()`), Layout (via `productsNav.ts`)

**Utilities Layer:**
- Purpose: Shared logic helpers
- Location: `src/lib/`
- Contains: `productsNav.ts` (builds nav links from product collection), `utils.ts` (clsx + tailwind-merge `cn()`)
- Depends on: `astro:content` types
- Used by: Layout.astro, Header.astro, React island components

## Data Flow

**Product Landing Page Flow:**

1. Request hits `src/pages/{slug}.astro`
2. Frontmatter calls `getCollection("products")` — returns all 7 product entries
3. Page finds target by `p.data.slug === "{slug}"` — throws if not found
4. Destructures `product.data` into variable `d`
5. Passes individual fields as explicit props to each landing section component:
   - `LandingHero` receives `{name, tagline, hero, type, cta}`
   - `PainPoints` receives `{audience, painPoints[]}`
   - `Pillars` receives `{pillars[]}`
   - `Benefits` / `Deliverables` receives `{benefits[]}` / `{deliverables[]}`
   - `Testimonials` receives `{testimonials[]}`
   - `FAQ` receives `{faqs[]}`
   - `LandingCTA` + `MobileCTABar` receive `{name, cta}`
6. Components render as static HTML — no client-side data fetching

**Navigation Link Flow:**

1. `Layout.astro` calls `getCollection("products")` at build time
2. Passes collection to `productNavLinksFromCollection()` in `src/lib/productsNav.ts`
3. Function sorts by `data.order`, maps to `{label, href, external?}` objects
4. `href` resolves to `externalSiteUrl` if present, else `/{slug}`
5. `external: true` products open in `target="_blank"` with `rel="noopener noreferrer"`
6. Nav links passed as props to `Header` and `Footer` for both desktop dropdown and mobile accordion

**Home Page Testimonials Aggregation:**

1. `src/pages/index.astro` calls `getCollection("products")`
2. Flat-maps all `testimonials` arrays across all products
3. Annotates each with `role: "{role} ({product.name})"`
4. Slices first 9 for the scroll-strip Testimonials component

## Routing

**File-based routing:** Astro maps `src/pages/*.astro` → URL paths automatically

**Static redirects** (defined in `astro.config.mjs` `redirects` key, HTTP 301):
- `/na-mesa-certa` → `https://namesa.gpus.com.br/`
- `/otb` → `https://otb.gpus.com.br/`
- `/trintae3` → `https://trintae3.drasacha.com.br/`
- `/comunidade-us` → `https://drasacha.com.br/pagina-de-inscricao-comu-us/`
- `/neon-dash` → `https://neondash.com.br/`

**Sitemap exclusion:** redirected routes are filtered out of `sitemap.xml` via the `sitemap` integration filter

**External product pattern:** Products with `externalSiteUrl` in their JSON have both a redirect route AND are linked externally from nav/cards. The `/slug` page redirects; card/nav links go directly to `externalSiteUrl`.

## Component Architecture

**Astro Components (`.astro`):** Server-side only, zero runtime JS unless they contain an explicit `<script>` tag. Props typed via `interface Props` in frontmatter.

**React Islands (`.tsx`):** Used exclusively in `src/components/ui/` for Aceternity UI visual effects (aurora background, spotlight, background beams, lamp, moving border, wavy background, text generate effect). These are imported into Astro pages with `client:load` or `client:visible` hydration directives.

**Button component pattern** (`src/components/shared/Button.astro`): Polymorphic — renders as `<a>` when `href` is provided, `<button>` otherwise. Four variants: `primary` (gold), `whatsapp` (green), `outline` (gold border), `ghost`. Three sizes: `sm`, `md`, `lg`.

**Landing page composition pattern:** Each product landing page in `src/pages/` follows the same structural template. More feature-rich products (e.g., `mentoria-black-neon`) conditionally render additional sections (`NeonStory`, `NeonBonus`, `NeonBio`, `Deliverables`) based on optional fields present in the product JSON.

## State Management

**No client-side state management.** This is a static site with no shared reactive state.

**Minimal inline JS for interactivity:**
- `src/layouts/Layout.astro` — IntersectionObserver for `data-reveal` scroll animations
- `src/components/layout/Header.astro` — mobile menu open/close, products accordion, scroll-based header border

## Cross-Cutting Concerns

**SEO:** Every page passes `title`, `description`, `ogImage`, `breadcrumbs` to `Layout.astro` which renders canonical URL, Open Graph tags, Twitter Card meta, and JSON-LD structured data (Organization schema always; BreadcrumbList when breadcrumbs prop provided).

**Accessibility:** Skip-link to `#conteudo-principal`, `aria-current="page"` on active nav links, `aria-label` on icon-only buttons, `role="dialog"` + `aria-modal` on mobile menu overlay, focus management on menu open/close.

**Animation:** CSS-only scroll-reveal via `data-reveal="up|left|right|scale"` attributes + `data-reveal-delay="1-6"` for stagger. IntersectionObserver in Layout adds `.revealed` class. `prefers-reduced-motion` disables all animations. Mobile disables infinite GPU animations (`gold-pulse-glow::after`, `float-gentle`).

**Design Tokens:** All colors and fonts defined as CSS custom properties in `src/styles/global.css` under `@theme {}` (Tailwind v4 syntax). Never hardcoded hex values in components.

---

*Architecture analysis: 2026-03-25*
