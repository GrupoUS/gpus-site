# Path rules: `src/content/`, `src/content.config.ts`

SSOT: `AGENTS.md` (schemas, collections). Checklist for data and URLs.

- **Data:** No long-lived product/team/copy in `.astro` / `.tsx` — use `getCollection()` / `.data`.
- **External products:** Keep `externalSiteUrl` aligned with `redirects` in `astro.config.mjs` and `@astrojs/sitemap` `filter` for redirect-only routes.
- **CTA vs navigation:** `cta.url` (conversion) ≠ card/page destination (`externalSiteUrl ?? /slug`) — do not normalize domains blindly.
- **Home journey:** `curso-auriculo` → `comunidade-us` → `trintae3` → `mentoria-black-neon` → `otb`.
- **Complementary:** `neon-dash` and `na-mesa-certa` stay out of that five-step sequence.
- **URL change checklist:** Update `externalSiteUrl`, `cta.url` (if applicable), `redirects`, and sitemap `filter` together; run `bun run check:external-urls` when touching externals.
