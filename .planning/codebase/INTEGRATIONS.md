# External Integrations

**Analysis Date:** 2026-03-25 — **sync:** 2026-03-26

## APIs & External Services

**Form Handling:**
- Formspree — contact form submission (`/contato` page)
  - Endpoint pattern: `https://formspree.io/f/xxxx`
  - Auth: `PUBLIC_FORMSPREE_ACTION` env var (full URL)
  - If unset, form is replaced with a fallback instructions message
  - Implementation: `src/pages/contato.astro` lines 5-8, 50

**Messaging:**
- WhatsApp Business — primary CTA channel across all landing pages
  - Base URL: `src/lib/whatsapp.ts` → `https://wa.me/556294705081` (SDR Laura)
  - Used in: `src/components/landing/LandingHero.astro`, `src/components/landing/LandingCTA.astro`, `src/components/home/CTASection.astro`, `src/components/layout/Footer.astro`, `src/pages/contato.astro`
  - Per-product messages: `cta.whatsappMessage` in each product JSON, URL-encoded at runtime

**Social:**
- Instagram — `https://instagram.com/drasachagualberto`
  - Used in: `src/components/layout/Footer.astro`, `src/layouts/Layout.astro` (JSON-LD `sameAs`)

## External Product URLs / Redirects

Five routes in `astro.config.mjs` redirect to external domains. These must stay aligned with `externalSiteUrl` in the corresponding product JSON files. Validated by `scripts/check-external-urls.mjs`.

| Route | External URL |
|-------|-------------|
| `/na-mesa-certa` | `https://namesa.gpus.com.br/` |
| `/otb` | `https://otb.gpus.com.br/` |
| `/trintae3` | `https://trintae3.drasacha.com.br/` |
| `/comunidade-us` | `https://drasacha.com.br/pagina-de-inscricao-comu-us/` |
| `/neon-dash` | `https://neondash.com.br/` |

Source of truth: `astro.config.mjs` `redirectTargets` constant (lines 8-14).
Integrity script: `bun run check:external-urls` (`scripts/check-external-urls.mjs`).

## Data Storage

**Databases:**
- None — no database connection

**File Storage:**
- Local filesystem only — static assets in `public/`, product data in `src/content/products/*.json`, team data in `src/content/team/*.json`

**Caching:**
- None — static site, no server-side caching layer

## Authentication & Identity

**Auth Provider:**
- None — no user authentication

## Fonts

**Delivery:** Astro 6 Fonts API with Google Fonts provider (self-hosted at build time — fonts are downloaded and bundled, not loaded from Google CDN at runtime)

**Fonts used:**
- Playfair Display — weights 400, 600, 700; normal style; CSS variable `--font-playfair`
- Inter — weights 300, 400, 500, 600, 700; normal style; CSS variable `--font-inter`

Configuration: `astro.config.mjs` `fonts` array, `fontProviders.google()`.

## Icons

**Delivery:** Lucide React — bundled SVG components, no CDN, no font files
- Package: `lucide-react@^1.6.0`
- Import pattern: `import { IconName } from "lucide-react"` in React island components

## SEO & Structured Data

**Sitemap:**
- `@astrojs/sitemap@^3.7.1` — auto-generated at build
- Excludes redirect-only routes: `/na-mesa-certa`, `/otb`, `/trintae3`, `/comunidade-us`, `/neon-dash`
- Site URL: `https://grupous.com.br` (set in `astro.config.mjs`)

**JSON-LD:**
- Organization schema — in `src/layouts/Layout.astro`
- BreadcrumbList schema — in `src/layouts/Layout.astro`
- `sameAs` includes `https://instagram.com/drasachagualberto`

## Deployment & Infrastructure

**Hosting:**
- Railway — GitHub integration auto-deploy on push to main
- Build command: `bun run build`
- Output directory: `dist/`
- Static files served by Caddy

**CI Pipeline:**
- None — no separate CI service (Railway builds on deploy)
- Git pre-commit hooks via Lefthook (`lefthook.yml`) run `bun run lint`
- `prepare` script uses `|| true` to skip Lefthook install on Railway (no `.git`)

## Environment Variables

**Required for full functionality:**

| Variable | Used In | Purpose |
|----------|---------|---------|
| `PUBLIC_FORMSPREE_ACTION` | `src/pages/contato.astro` | Formspree endpoint URL (full `https://formspree.io/f/xxxx`). If absent, contact form shows instructions instead of the form. |

**No other `import.meta.env` references detected in `src/`.**

**Secrets location:** Environment variables configured in Railway dashboard (not committed).

## Webhooks & Callbacks

**Incoming:** None

**Outgoing:** None — form submissions go directly to Formspree via browser `<form action>` POST

## Security Notice — Injected Telemetry Hooks (histórico)

**2026-03-25:** Vários ficheiros tinham `fetch` para `127.0.0.1:7777` dentro de `// #region agent log`.  
**2026-03-26:** Blocos removidos do código; `grep 127.0.0.1` em `src/` e `astro.config.mjs` deve permanecer vazio. Manter esta secção como registro de auditoria.

---

*Integration audit: 2026-03-25; telemetry section closed 2026-03-26*
