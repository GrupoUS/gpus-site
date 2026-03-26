# Path rules: `src/layouts/Layout.astro`, `src/pages/*.astro`, `astro.config.mjs` (sitemap)

SSOT: `Layout.astro` implements title, description, canonical, robots, OG, Twitter Card, JSON-LD Organization + BreadcrumbList.

- **Per page:** Unique `title`; `description` aim **≥ 120 characters** when it is the main SEO blurb; pass `ogImage` when the page needs a custom share image (path under `public/`, e.g. `/images/...`).
- **Default OG:** Prop default is `/og-image.png` — **ensure** `public/og-image.png` exists or override `ogImage` on every route until it does.
- **Organization JSON-LD:** Canonical org URL stays `https://grupous.com.br` — do not change without stakeholder approval.
- **Breadcrumbs:** Pass `breadcrumbs: [{ name, url }]` for product landings and legal pages where hierarchy matters.
- **Canonical:** Built from `Astro.site` + `Astro.url.pathname` — avoid duplicate conflicting `<link rel="canonical">`.
- **lang:** `<html lang="pt-BR">` — keep.
- **Sitemap:** External redirect routes must stay in sitemap `filter` exclusions; verify `bun run build` produces `dist/sitemap-index.xml`.
