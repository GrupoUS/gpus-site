# Project Overlay — Grupo US · Site Institucional (gpus-site)

> Tier 1 supplement. Loaded by `.claude/CLAUDE.md` after the generic behavioral framework.
> Single source for project identity, cardinal rules, routing matrix, layer chain.

---

## Project identity

**Grupo US — Site Institucional (`grupous.com.br`)** — multi-product institutional landing for the Grupo US ecosystem (saúde estética avançada, negócios, mentalidade). Static site, no backend, no auth, no payments. Conversion via WhatsApp SDR Laura + external product hubs (`drasacha.com.br`, `namesacerta.com.br`, `ota-dubai.lovable.app`, `neondash.com.br`, `trintae3.drasacha.com.br`, Kiwify).

Stack: **Astro 6 (static-only)** · **Bun** · Tailwind CSS v4 · React 19 (islands; minimal — only justified above-the-fold animations + persistent floating WhatsApp) · **Railway** (static deploy via GitHub) · GPUS Theme (Navy/Gold) · Lucide React · Playfair Display + Inter · pt-BR.

Architecture map / commands / pre-delivery checklist live in root `AGENTS.md`. Brand voice / products / journey: `gpus-theme` skill + `grupo-us` skill.

---

## Behavior overrides (project-specific)

- **Bun-only.** Never `npm` / `yarn` / `pnpm`.
- **Static generation only.** Astro 6 default `prerender = true` for every route. No SSR adapter, no hybrid output, no `prerender = false`.
- **MPA (no SPA).** Plain `<a href>` navigation triggers full page reload. No `ClientRouter`, no View Transitions, no `astro:after-swap` listeners.
- **Lucide React only.** No emoji as UI icons. No Material Symbols. No Font Awesome. No SVG inline custom.
- **WhatsApp SDR Laura is the single contact channel.** Always built via `src/lib/whatsapp.ts` (`WHATSAPP_SDR_E164 = "556294705081"`). Never inline `wa.me/...` URLs.
- **Content is data, not code.** Products + team live in `src/content/products/*.json` + `src/content/team/*.json`. Never hardcode landing copy in `.astro` / `.tsx`.
- **Conventional Commits:** `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`, `perf:`.

---

## Routing matrix

These rows extend the generic matrix in `.claude/CLAUDE.md`. All overlay rule files live at `${overlay}/rules/`.

| Task touches | Load (overlay-first) | Implement in |
|---|---|---|
| New page / product landing | `${overlay}/rules/frontend.md` + `${overlay}/rules/DESIGN.md` | `src/pages/<slug>.astro` (mirror `mentoria-black-neon.astro`) + `src/content/products/<slug>.json` |
| New external product redirect | `${overlay}/rules/frontend.md § External redirect tri-sync` | `src/content/products/<slug>.json::externalSiteUrl` + `astro.config.mjs::redirects` + `astro.config.mjs::sitemap.filter()` (3-way sync) |
| Edit landing copy / CTA / FAQ / testimonial | `${overlay}/rules/frontend.md § Content Collections` + `grupo-us` skill | `src/content/products/<slug>.json` only — never component file |
| Update home journey order | `${overlay}/rules/frontend.md § Home journey order` + `grupo-us` skill | `src/content/products/<slug>.json::order` |
| WhatsApp message / CTA | `${overlay}/rules/frontend.md § WhatsApp SDR Laura` | `cta.whatsappMessage` in product JSON (always prefixed `Olá, Laura!`) — `src/lib/whatsapp.ts` is SSOT for URL building |
| WhatsApp number / E.164 | `${overlay}/rules/frontend.md § WhatsApp SDR Laura` | `src/lib/whatsapp.ts::WHATSAPP_SDR_E164` — single source |
| Theme token / new utility | `${overlay}/rules/DESIGN.md` | `src/styles/global.css` `@theme` block + `@layer utilities` |
| New landing section component | `${overlay}/rules/frontend.md` + `${overlay}/rules/DESIGN.md` | `src/components/landing/*.astro` (pure Astro by default; promote to `.tsx` only when interactivity required) |
| Hero island animation | `${overlay}/rules/frontend.md § Hydration directives` | `src/components/landing/<island>.tsx` with `client:idle` (never `client:load`) |
| FAQ behavior | `${overlay}/rules/frontend.md § Accessibility` | `src/components/landing/FAQ.astro` — native `<details>` or CSS grid `0fr/1fr`; never Framer height tween |
| SEO meta / JSON-LD | `${overlay}/seo-supplement.md` | `src/layouts/Layout.astro` (Organization + BreadcrumbList) + per-page frontmatter (`title`, `description`, `ogImage`) |
| A11y plumbing | `${overlay}/rules/frontend.md § Accessibility` | `src/layouts/Layout.astro` (skip link, `<main id="conteudo-principal">`, `<noscript>` reveal) + `src/styles/global.css` |
| Performance budget | `${overlay}/rules/stability.md § Performance gates` | `Layout.astro` (preconnect Google Fonts) + Astro `<Image>` discipline + hydration audits |
| External LP / vitrine alignment | `grupo-us` skill (`produtos-e-rotas.md`) | `src/content/products/<slug>.json::cta.url` (drasacha funnel) + `externalSiteUrl` (when applicable) |
| Smoke tests / anti-patterns / debug | `${overlay}/rules/stability.md` | filesystem (greps + Lighthouse + `bun run check:external-urls`) |

> **Files NOT applicable to this project:** `${overlay}/rules/backend.md`, `${overlay}/rules/database.md` (no API, no DB). If a future serverless contact-form endpoint appears, generic `.claude/rules/backend.md` becomes the fallback authority — at that point, write `${overlay}/rules/backend.md` to capture project-specific endpoint conventions.

---

## Cardinal rules (non-negotiable for this project)

1. **Never assume correctness.** Verify against official docs, runtime build, or `bun run check:external-urls` before applying changes.
2. **Always debug after changes.** Every modification ends with `bun run lint && bunx astro check && bun run build`. Never mark a task done without evidence.
3. **NEVER use emojis as UI icons.** Lucide React SVG only.
4. **NEVER use SPA.** Astro static MPA only — no `ClientRouter`, no `prerender = false`, no SSR adapter.
5. **NEVER hardcode product / team / landing copy** in `.astro` or `.tsx`. Always `getCollection()` from `src/content/`.
6. **NEVER inline `wa.me/...` URLs.** Always go through `src/lib/whatsapp.ts` (`whatsappUrlWithText`, `WHATSAPP_DEFAULT_SITE_MESSAGE`, `isWhatsAppDestination`).
7. **NEVER hardcode hex** outside `src/styles/global.css` `@theme` block. Semantic tokens (`bg-background`, `text-foreground`, `bg-primary`) or custom navy/gold utilities only.
8. **NEVER animate layout properties** (`width`, `height`, `top`, `left`, `padding`, `margin`). FAQ panels use CSS grid `grid-template-rows: 0fr ↔ 1fr`. Other animations: `transform` + `opacity` only.

---

## Project-specific guards

- **Static only.** Every page implicit `prerender = true` (Astro 6 default with no adapter). Adding `prerender = false` requires written justification + roadmap line.
- **External redirect tri-sync.** When a product becomes external (or destination URL changes), three places move together: (a) `src/content/products/<slug>.json::externalSiteUrl`, (b) `astro.config.mjs::redirects`, (c) `astro.config.mjs::sitemap.filter()` exclusion. Run `bun run check:external-urls` after.
- **WhatsApp dedup.** When `cta.url` is already a WhatsApp destination, `LandingHero` / `LandingCTA` automatically suppress the secondary green button via `isWhatsAppDestination(url)`. Don't bypass with inline buttons.
- **Hero hydration discipline.** Pure-visual islands (`AuroraBackground`, `TextGenerateEffect`) hydrate `client:idle` — never `client:load`. Only `client:load` allowed is `WhatsAppFloatingButton` in `Layout.astro`.
- **A11y wired infrastructure.** Skip link → `<main id="conteudo-principal" tabindex="-1">`; `<noscript>` block forces `[data-reveal]` visible; `prefers-reduced-motion` disables CSS reveal; focus ring `2px solid #d4af37 + offset 2px`. Don't remove without like-for-like replacement.
- **Initial JS budget < 50KB** on every prerendered page. Heavy libs stay out of main bundle.
- **CLS = 0** on all images. Astro `<Image>` (or plain `<img>` with explicit `width`/`height`) — no exceptions.

---

## Layer chain (compressed from former `layer-map.md`)

```
Content Collection JSON (src/content/<col>/*.json)
  → Zod schema (src/content.config.ts)
    → Astro Page (src/pages/*.astro)  ← getCollection() / getEntry()
      → Layout (src/layouts/Layout.astro)  ← SEO + JSON-LD + skip-link + reveal
        → Section components (src/components/{home,landing,layout,about,shared}/*.astro)
          → Theme tokens (src/styles/global.css `@theme`)
            → Astro build → static `dist/`
```

Walk top-to-bottom when adding a product or page. Skipping a layer (hardcoding copy in a section) breaks SSOT.

### Key paths

| Layer | Path |
|---|---|
| Product / team SSOT | `src/content/{products,team}/<slug>.json` |
| Schema | `src/content.config.ts` |
| Public page | `src/pages/<slug>.astro` |
| Base layout | `src/layouts/Layout.astro` |
| Section components | `src/components/{home,landing,layout,about,shared}/*.astro` |
| Floating CTA island | `src/components/WhatsAppFloatingButton.tsx` (only `client:load` allowed) |
| Design tokens | `src/styles/global.css` `@theme` block |
| WhatsApp SSOT | `src/lib/whatsapp.ts` |
| Astro config (redirects + sitemap) | `astro.config.mjs` |
| External URL check | `scripts/check-external-urls.*` (`bun run check:external-urls`) |

### Verification commands

```bash
bunx astro check                 # type check
bun run lint                     # Biome
bun run build                    # static dist/
bun run dev                      # dev server
bun run check:external-urls      # redirect target reachability
```

### Auth scope

**None — public institutional site.** No `requireAdmin`, no RLS, no cookie session, no protected routes. Agents must NOT hallucinate auth checks, admin guards, or service-role clients.

### Key invariants

1. **Static only** — no SSR adapter, no `prerender = false`, no `output: 'server'|'hybrid'`.
2. **MPA, never SPA** — no `ClientRouter`, no `astro:after-swap` listeners.
3. **Content Collections are SSOT** — product / team copy in JSON; never inline.
4. **External redirect tri-sync** — JSON ↔ redirects ↔ sitemap filter together.
5. **WhatsApp SSOT** — `src/lib/whatsapp.ts` is the only producer of `wa.me/...` URLs.
6. **Lucide-only icons** — no emoji, Material Symbols, Font Awesome.
7. **No hardcoded hex** outside `src/styles/global.css` `@theme`.
8. **`transform` / `opacity` animations only** — FAQ uses CSS grid `0fr ↔ 1fr`.
9. **CLS = 0** — every image has explicit `width`/`height`.
10. **Initial JS < 50KB** on every prerendered page.
11. **Bun-only** — no npm/yarn/pnpm in scripts or docs.

---

## Pointers (Tier 3 — read on demand)

- `${overlay}/rules/frontend.md` — pages, components, hydration, Content Collections, WhatsApp SSOT, redirects, fonts, a11y, performance.
- `${overlay}/rules/DESIGN.md` — Navy/Gold tokens, typography, components spec, motion, custom utilities.
- `${overlay}/rules/stability.md` — universal checklist + smoke tests + anti-patterns + debug triage.
- `${overlay}/seo-supplement.md` — pt-BR locale, JSON-LD Organization, sitemap filter (auto-loaded by `performance-optimization` skill).
- `${overlay}/protected-files.json` — protected paths (loaded by `protect-files.sh` hook).
- `${overlay}/README.md` — file index + load chain.
- `.claude/skills/gpus-theme/` — Navy/Gold tokens canon (HSL, dark-only contract).
- `.claude/skills/grupo-us/` — products / journey / brand voice (`manual-resumo.md`, `produtos-e-rotas.md`, `cultura-activa.md`, `conflitos-fontes.md`).
- `AGENTS.md` — root cardinal rules + architecture map + commands + pre-delivery checklist + chronological learnings log.
- `.claude/commands/_shared.md § 0` — overlay resolution recipe + optional supplements list.

---

## Removing or replacing this overlay

1. Delete `${overlay}/` (this directory) or rename it.
2. Update `.claude/config.json::overlay` to point at another overlay or `null`.
3. Without an overlay, commands fall back to generic `.claude/rules/*.md` scaffolds.
