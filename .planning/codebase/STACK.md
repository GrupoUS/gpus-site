# Technology Stack

**Analysis Date:** 2026-03-25

## Languages

**Primary:**
- TypeScript 6.x — all source files under `src/` (`.ts`, `.tsx`, `.astro` frontmatter)

**Secondary:**
- JavaScript (ESM) — `astro.config.mjs`, `scripts/check-external-urls.mjs`
- CSS — `src/styles/global.css` (Tailwind v4 `@import` + `@theme` + `@utility`)

## Runtime

**Environment:**
- Node.js >=22.12.0 (declared in `package.json` `engines`)
- Runtime on CI/Railway: Node-compatible; dev runtime is Bun

**Package Manager:**
- Bun (only — never npm/yarn/pnpm)
- Lockfile: `bun.lock` (present — committed)

## Frameworks

**Core:**
- Astro 6.x (`astro@^6.0.8`) — static site generator, MPA, 11 pages + 2 redirect routes

**UI / Islands:**
- React 19.x (`react@^19.2.4`, `react-dom@^19.2.4`) — React Islands via `@astrojs/react@^5.0.1`
- Framer Motion 12.x (`framer-motion@^12.38.0`, `motion@^12.38.0`) — animation primitives for Aceternity UI components

**Styling:**
- Tailwind CSS v4 (`tailwindcss@^4.2.2`) — loaded via Vite plugin (`@tailwindcss/vite@^4.2.2`), no `tailwind.config.js`
- All design tokens in `src/styles/global.css` using `@theme {}` directive

**Icons:**
- Lucide React (`lucide-react@^1.6.0`) — sole icon library; no emoji icons

**Build / Dev:**
- Vite — embedded in Astro 6; Tailwind injected as Vite plugin
- TypeScript compiler — via `@astrojs/check@^0.9.8` (`bunx astro check`)

**Testing:**
- No test runner — validation gates are lint + type-check + build

## Key Dependencies

**Critical (runtime):**
- `astro@^6.0.8` — framework core
- `@astrojs/react@^5.0.1` — React island integration
- `@tailwindcss/vite@^4.2.2` — Tailwind CSS v4 Vite integration
- `tailwindcss@^4.2.2` — CSS utility framework
- `react@^19.2.4` / `react-dom@^19.2.4` — React 19 runtime
- `framer-motion@^12.38.0` — animation library (Aceternity UI components)
- `motion@^12.38.0` — motion library companion
- `lucide-react@^1.6.0` — SVG icon set

**Utilities (runtime):**
- `clsx@^2.1.1` — conditional className concatenation
- `tailwind-merge@^3.5.0` — Tailwind class conflict resolution
- `simplex-noise@^4.0.3` — noise generation (used in Aceternity UI `aurora-background`)
- `@astrojs/sitemap@^3.7.1` — auto-generates sitemap, excludes redirect-only routes

**Type definitions:**
- `@types/react@^19.2.14`
- `@types/react-dom@^19.2.3`
- `typescript@^6.0.2`

## Dev Dependencies

- `@biomejs/biome@^2.4.9` — formatter + linter for `src/**` and `astro.config.mjs`
- `oxlint@^1.57.0` — additional JS/TS/JSX linter for `src/` (excludes `src/layouts/*`)
- `lefthook@^2.1.4` — git hooks manager; pre-commit runs `bun run lint`

## Configuration

**TypeScript:**
- `tsconfig.json` extends `astro/tsconfigs/strict`
- Path alias: `@/*` → `src/*`
- JSX: `react-jsx`, `jsxImportSource: "react"`

**Biome:**
- `biome.json` — covers `src/**` and `astro.config.mjs`
- Indent style: tabs; quote style: double
- Tailwind directives enabled in CSS parser
- Recommended rules on; `noUnusedImports`/`noUnusedVariables` suppressed for `.astro` files
- `noImportantStyles` suppressed for `global.css`
- Import organization: auto on assist

**Lefthook:**
- `lefthook.yml` — pre-commit: runs `bun run lint` on `{src/**,astro.config.mjs}`
- `prepare` script uses `|| true` to prevent CI failure when `.git` is absent

**Lint commands:**
```bash
bun run lint          # biome check + oxlint (no fix)
bun run lint:fix      # biome check --write + oxlint --fix
bunx astro check      # TypeScript type check
bun run build         # Full build validation
```

## Styling System

**Theme tokens** defined in `src/styles/global.css` via `@theme {}`:

| Token | Value |
|-------|-------|
| `--color-navy` | `#1a1a2e` |
| `--color-navy-light` | `#2a2a40` |
| `--color-navy-lighter` | `#3d3d5c` |
| `--color-gold` | `#d4af37` |
| `--color-gold-light` | `#e8c96a` |
| `--color-gold-dark` | `#b8960c` |
| `--color-text-primary` | `#fafaf9` |
| `--color-text-muted` | `#94a3b8` |
| `--color-whatsapp` | `#25d366` |
| `--font-serif` | Playfair Display → Georgia fallback |
| `--font-sans` | Inter → system-ui fallback |

**Custom utilities** (`@utility`):
- `glass-card` — glassmorphism background + gold border + backdrop blur
- `gold-glow` — gold-tinted box shadow
- `card-hover-lift` — translateY hover transition
- `gold-pulse-glow` — animated gold glow with pseudo-element
- `float-gentle` — infinite float animation
- `animate-spotlight` — Aceternity spotlight entry animation
- `animate-aurora` — Aceternity aurora background animation
- `card-glow-hover` — border + shadow glow on hover
- `text-shimmer` — animated gold shimmer gradient on text
- `text-gradient-gold` — static gold gradient on text

**Scroll-reveal system** — `data-reveal="up|left|right|scale"` + `data-reveal-delay="1-6"` attributes; IntersectionObserver in `src/layouts/Layout.astro` adds `.revealed` class; animations defined as `@keyframes` in `global.css`.

## Platform Requirements

**Development:**
- Bun runtime (latest stable)
- Node.js >=22.12.0 compatible environment
- Linux or WSL2 (project developed on WSL2 Ubuntu)

**Production:**
- Railway (static site hosting via GitHub integration)
- Build: `bun run build` → output: `dist/`
- Served by Caddy static file server

---

*Stack analysis: 2026-03-25*
