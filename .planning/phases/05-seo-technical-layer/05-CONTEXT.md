# Phase 5: SEO Technical Layer + Cleanup - Context

**Gathered:** 2026-03-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Close all 6 orphaned SEO requirements (SEO-01 through SEO-06) from the v1.0 milestone audit. Deliver: JSON-LD structured data per product page, per-page OG images, sitemap with priorities, robots.txt fix, breadcrumb coverage completion, deprecated component removal, and a **full local OTB landing page** (replacing the redirect-only route) with Event schema and high-fidelity design from otb.gpus.com.br.

</domain>

<decisions>
## Implementation Decisions

### JSON-LD Schemas (SEO-01, SEO-02)
- **D-01:** curso-auriculo gets Schema.org `Course` (name, description, provider: Grupo US, educationalLevel). No pricing fields.
- **D-02:** mentoria-black-neon gets Schema.org `Product` (name, description, brand: Grupo US). No pricing fields.
- **D-03:** OTB gets a full local landing page (`otb.astro`) with Schema.org `Event` schema. SEO-02 addressed via local page, not redirect.
- **D-04:** No pricing fields (`offers`, `price`) in any JSON-LD schema. Checkout is external (Kiwify, WhatsApp). Avoids stale data and schema warnings.

### OG Images (SEO-03)
- **D-05:** Static PNG files (1200x630) for all 8 content pages + OTB page (9 total). Placed in `public/og/`.
- **D-06:** Claude creates SVG source files with navy background, gold Playfair Display title, and Grupo US logo. User exports to PNG. No build-time generation dependency.

### Breadcrumb Coverage (SEO-04)
- **D-07:** Add breadcrumbs to `termos` + `politica-de-privacidade` (Inicio -> Termos/Privacidade). Skip `index` (root) and `404` (not indexable).
- **D-08:** New OTB landing page gets breadcrumbs (Inicio -> OTB). Same pattern as curso-auriculo and mentoria-black-neon.
- **D-09:** Final coverage: 7/9 pages with breadcrumbs (sobre, contato, curso-auriculo, mentoria-black-neon, termos, privacidade, OTB).

### Sitemap (SEO-05)
- **D-10:** Use `@astrojs/sitemap` `serialize` callback for per-page priorities. No custom integration.
- **D-11:** Priorities: home 1.0, landings 0.9, sobre/contato 0.7, legais 0.3.
- **D-12:** Include `changefreq`: home weekly, landings monthly, sobre/contato monthly, legais yearly.

### robots.txt (SEO-06)
- **D-13:** Minimal fix: `Disallow: /404` only. Remove current Disallow for `/termos` and `/politica-de-privacidade`. No crawl-delay or bot-specific rules.

### OTB Landing Page (expanded scope)
- **D-14:** High-fidelity replication of `otb.gpus.com.br` design within Astro. Researcher must scrape the external site for content, UI patterns, and event data.
- **D-15:** Keep Grupo US header/footer (standard `Layout.astro` wrapper). OTB page is part of Grupo US ecosystem.
- **D-16:** Optional `event` object added to products Zod schema in `content.config.ts`: `{ startDate?, endDate?, location?, attendanceMode?, organizer? }`. Only OTB uses it.
- **D-17:** Remove `/otb` redirect from `astro.config.mjs` in the same plan as creating `otb.astro` (clean cutover). Update sitemap filter to include `/otb`.

### Cleanup
- **D-18:** Remove `src/components/home/JourneyTimeline.astro` (0 importers, replaced by JourneyTimeline.tsx in Phase 4).
- **D-19:** Remove `src/components/landing/Testimonials.astro` (0 importers, replaced by TestimonialCarousel.tsx in Phase 4).
- **D-20:** Remove `/otb` redirect from `astro.config.mjs` and update sitemap filter (bundled with D-17).

### Claude's Discretion
- Event schema field selection for OTB (beyond the required startDate/endDate/location) — Claude picks fields based on what's available from otb.gpus.com.br content
- SVG OG image layout details (exact positioning, font sizes) — Claude designs to match navy/gold brand
- Specific Zod validators for optional event fields

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Gap Closure Source
- `.planning/v1.0-MILESTONE-AUDIT.md` — Identifies SEO-01 through SEO-06 as orphaned requirements. Phase 5 exists to close these gaps.

### Requirements & Rules
- `.planning/REQUIREMENTS.md` — SEO-01 through SEO-06 definitions and acceptance criteria
- `AGENTS.md` — Project rules, CTA/journey constraints, MPA requirement, content collection rules
- `.claude/rules/seo.md` — SEO implementation rules (title, description, canonical, OG, JSON-LD, sitemap)
- `.claude/rules/content.md` — Content collection rules, CTA vs navigation, external URL alignment
- `.claude/rules/frontend.md` — Component patterns, island justification, Tailwind v4 tokens

### OTB Content Source
- `https://otb.gpus.com.br/` — **CRITICAL:** Researcher must scrape this site for OTB landing page content, UI design, colors, imagery, and event data. This is the source of truth for the local OTB page.

### Existing Implementation
- `src/layouts/Layout.astro` — Existing JSON-LD Organization, OG meta, breadcrumbs conditional, ogImage prop
- `src/content.config.ts` — Zod schema for products collection (event field extension needed)
- `astro.config.mjs` — Redirects (OTB redirect to remove), sitemap config (serialize callback to add), sitemap filter
- `public/robots.txt` — Current robots.txt with incorrect Disallows (to fix)
- `src/pages/curso-auriculo.astro` — Reference landing page pattern for OTB
- `src/pages/mentoria-black-neon.astro` — Reference landing page pattern (custom sections: NeonStory, NeonBonus, NeonBio)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `Layout.astro` already handles OG meta (`ogImage` prop), JSON-LD Organization, and conditional BreadcrumbList — JSON-LD Course/Product/Event can follow the same `<script is:inline type="application/ld+json">` pattern
- Landing page template pattern (`curso-auriculo.astro`) — reusable for OTB if adapting to standard components
- `src/components/landing/*` — 12 reusable section components, but OTB may need custom sections for high-fidelity design
- `src/lib/whatsapp.ts` — WhatsApp URL generation for CTA
- `src/lib/productsNav.ts` — Nav link builder (OTB will auto-appear in nav after redirect removal)

### Established Patterns
- JSON-LD rendered as `<script is:inline type="application/ld+json" set:html={JSON.stringify(schema)} />`
- Breadcrumbs passed as `Array<{ name: string; url: string }>` prop to Layout.astro
- Product data accessed via `getCollection('products')` + `find()` by slug + `const d = product.data`
- Content Collection Zod schema with optional fields for product-specific features (story, bonus, bio)

### Integration Points
- `astro.config.mjs` — Remove OTB redirect, update sitemap `serialize` callback, update sitemap `filter`
- `content.config.ts` — Add optional `event` object to products schema
- `src/content/products/otb.json` — Enrich with event-specific fields from otb.gpus.com.br
- `public/og/` — New directory for per-page OG images
- `public/robots.txt` — Fix Disallow rules
- Each page's `<Layout>` call — Add `ogImage` prop pointing to `/og/[slug].png`

</code_context>

<specifics>
## Specific Ideas

- OTB landing page: high-fidelity replication of otb.gpus.com.br design, not adapted to standard landing template. May require custom OTB-specific components similar to how mentoria-black-neon has NeonStory/NeonBonus/NeonBio.
- OG images: SVG-first workflow — Claude writes SVG templates, user exports to PNG. Navy bg + gold Playfair Display heading + Grupo US logo.
- Legal pages (termos, privacidade) can share a similar OG image variant ("Grupo US — Termos de Uso" / "Grupo US — Politica de Privacidade").

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 05-seo-technical-layer*
*Context gathered: 2026-03-26*
