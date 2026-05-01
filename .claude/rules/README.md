# Rules — Tier 2 Domain Guardrails

> Project-specific authoritative rules for **Grupo US — Site Institucional** (gpus-site).
> Loaded on demand by `/prime` per the routing matrix in `.claude/CLAUDE.md`.

## Files

| File | Scope |
|---|---|
| `frontend.md` | Render mode, components, hydration, Content Collections, WhatsApp SSOT, redirect tri-sync, Google Fonts, Railway, accessibility, performance |
| `DESIGN.md` | Navy/Gold tokens, typography, components spec, motion, custom utilities |
| `stability.md` | Universal A–L checklist, smoke tests (`/verify`), anti-patterns by domain (`/debug`), debug triage matrix, escalation triggers |
| `seo.md` | pt-BR locale, route SEO requirements, sitemap filter, JSON-LD Organization + BreadcrumbList, CWV thresholds |

## How rules are loaded

1. `/prime` (auto / backend / frontend / fullstack) reads `.claude/CLAUDE.md` § routing matrix
2. Routing matrix says "task type X loads rule Y"
3. Loader reads `.claude/rules/Y.md`
4. Stops once minimum-viable context loaded

## Project conventions reflected

- Static-only Astro 6 (no SSR adapter, no SPA, no `prerender = false`)
- Bun-only runtime + package manager
- Lucide React icons (no emoji, Material Symbols, Font Awesome)
- Content Collections SSOT for products + team
- WhatsApp SDR Laura SSOT in `src/lib/whatsapp.ts`
- External redirect tri-sync (`externalSiteUrl` ↔ `astro.config.mjs::redirects` ↔ sitemap `filter()`)
- GPUS Theme — Navy/Gold dark mode only
- Playfair Display + Inter typography
- Railway static deploy via GitHub
