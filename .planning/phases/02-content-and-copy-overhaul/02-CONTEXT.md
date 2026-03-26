# Phase 2: Content & Copy Overhaul - Context

**Gathered:** 2026-03-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Every text node in the site's data layer — 7 product JSONs (`src/content/products/`) + 13 team JSONs (`src/content/team/`) + 8 page meta descriptions in `src/pages/` — brought to a consistent standard: correct accents/typography, compelling copy aligned to brand voice, unique SEO meta per page.

New capabilities (analytics, new components, structural changes) are out of scope. This phase writes, not builds.

</domain>

<decisions>
## Implementation Decisions

### Copy Approach — Product JSONs

- **D-01:** **Audit-first, then act.** Agent reads each product JSON, assesses current quality, and only rewrites where needed. Products that already have strong copy (notably `curso-auriculo` after recent `/evolve` sessions) must be preserved — do not overwrite good content with generic rewrites.
- **D-02:** For products where copy is weak or placeholder-level, perform a full field-by-field rewrite covering: `name`, `tagline`, `description`, `hero.headline`, `hero.subheadline`, `painPoints[]`, `pillars[]`, `benefits[]`, `differentials[]`, `faqs[]`.
- **D-03:** For products with quality copy, only tighten/elevate specific weak fields identified in the audit — not a full rewrite pass.

### Copy Sources

- **D-04:** Both `docs/plans/aprimoramento/gpus-company-info.md` and `.planning/research/drasacha-content.md` are reference sources with equal weight. Agent uses judgment to blend the best elements from both per product. Neither strictly overrides the other.
- **D-05:** Brand voice: professional, acolhedor, inspirador, firme. Fala como "Nós". Key phrases: "Nós iluminamos", "Clareza é a nova gentileza", "Olhar de dono", "Excelência com entrega real".

### Redirect-Only Products

- **D-06:** Products that redirect away from grupous.com.br (comunidade-us, trintae3, neon-dash, na-mesa-certa, otb) render only their card-visible fields in this repo (`name`, `tagline`, `description`, `icon`, `image`). Agent should focus copy effort on those card-visible fields. Deep field rewrites (painPoints, pillars, faqs) for redirect products are **Claude's discretion** — only if sources have clear, high-quality content to draw from.

### Team Bios (COPY-04)

- **D-07:** Scope is **3 named profiles only**: Dra. Sacha Gualberto, Maurício Magalhães, Raquel. The other 10 team members (`andressa`, `ariane`, `bruno`, `erika`, `jessica`, `joao-vitor`, `lucas`, `renata`, `riller`, `roberta`) are out of scope for Phase 2.
- **D-08:** Bio enrichment goal: each of the 3 profiles should clearly convey expertise, credibility signals (certifications, years of experience), and their role within the Grupo US ecosystem.

### Meta Descriptions (COPY-03)

- **D-09:** All **8 content pages** in `src/pages/` need unique meta descriptions. Minimum ≥120 chars, targeted keyword per page, brand suffix "| Grupo US" in title.
- **D-10:** `termos.astro` and `politica-de-privacidade.astro` must be upgraded from placeholder ("Termos de uso do site do Grupo US") to ≥120 chars with relevant keywords (e.g., "Termos de Uso | Grupo US — confira as regras e condições do ecossistema de formação em Saúde Estética Avançada.").
- **D-11:** Pages with existing quality meta (home, sobre, contato, 404) — agent audits and only improves if clearly suboptimal.

### Accents & Typography (COPY-01)

- **D-12:** Systematic accent audit across all product + team JSONs AND hardcoded text in components/pages. Fix any unaccented Portuguese (e.g., "Saude" → "Saúde", "Estetica" → "Estética").
- **D-13:** Typographic quotes are nice-to-have — fix only if clearly wrong. No forced transformation of all straight quotes to curly quotes site-wide.

### Claude's Discretion

- Whether to use a single plan or separate plans for 2.1 (accents), 2.2 (copy rewrite), and 2.3 (SEO meta) — planner decides based on parallelization opportunities.
- Depth of redirect product field rewrites beyond card-visible fields.
- Order in which products are rewritten within Plan 2.2.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Brand Voice & Content Sources
- `docs/plans/aprimoramento/gpus-company-info.md` — Manual de Inteligência Grupo US; primary brand voice and product positioning source
- `.planning/research/drasacha-content.md` — Research from drasacha.com.br; secondary reference for product framing and audience language

### Project Rules
- `AGENTS.md` — Single source of truth for all project rules (read first before any action)
- `.claude/CLAUDE.md` — Stack rules, negative constraints, content collections policy

### Content Files to Modify
- `src/content/products/curso-auriculo.json` — Has recent quality copy; audit before modifying
- `src/content/products/mentoria-black-neon.json` — Has quality copy; audit before modifying
- `src/content/products/comunidade-us.json` — Redirect product; card-visible fields only
- `src/content/products/trintae3.json` — Redirect product; card-visible fields only
- `src/content/products/neon-dash.json` — Redirect product; card-visible fields only
- `src/content/products/na-mesa-certa.json` — Redirect product; card-visible fields only
- `src/content/products/otb.json` — Redirect product; card-visible fields only
- `src/content/team/sacha.json` — In scope: full bio enrichment
- `src/content/team/mauricio.json` — In scope: full bio enrichment
- `src/content/team/raquel.json` — In scope: full bio enrichment

### Pages for Meta Description Audit
- `src/pages/index.astro` — Home; meta already quality, audit only
- `src/pages/sobre.astro` — About; meta already quality, audit only
- `src/pages/contato.astro` — Contact; meta already quality, audit only
- `src/pages/curso-auriculo.astro` — Uses `{d.description}` from JSON; JSON rewrite covers this
- `src/pages/mentoria-black-neon.astro` — Uses `{d.description}` from JSON; JSON rewrite covers this
- `src/pages/termos.astro` — Needs upgrade: currently placeholder ("Termos de uso do site do Grupo US")
- `src/pages/politica-de-privacidade.astro` — Needs upgrade: currently placeholder
- `src/pages/404.astro` — Already has quality meta; audit only

### Requirements
- `.planning/REQUIREMENTS.md` — COPY-01 through COPY-04 acceptance criteria

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/content.config.ts` — Zod schema for products and team collections; planner must check field names match schema before modifying JSONs
- `src/lib/whatsapp.ts` — WhatsApp centralization; copy changes must NOT inline wa.me URLs in content fields

### Established Patterns
- Content Collections: all product/team data lives in JSON files in `src/content/`. Component copy is in these JSONs — never hardcode in `.astro` / `.tsx` files.
- Landing pages (`curso-auriculo.astro`, `mentoria-black-neon.astro`) use `{d.description}` for meta description — updating the product JSON `description` field automatically updates the page meta.
- 5 redirect-only products have no local `.astro` page — their JSON fields only render in ProductsGrid cards on the home page.

### Integration Points
- `src/pages/termos.astro` and `src/pages/politica-de-privacidade.astro` — meta description is hardcoded in the page frontmatter (not from a JSON collection); must edit the `.astro` file directly.
- Home page (`index.astro`) and `sobre.astro`, `contato.astro`, `404.astro` — meta descriptions are also hardcoded in page frontmatter.

</code_context>

<specifics>
## Specific Ideas

- Key brand phrases to weave in where natural: "Nós iluminamos", "Clareza é a nova gentileza", "Olhar de dono", "Excelência com entrega real"
- Product `description` field doubles as the page meta for landing pages — write it to work both as a 1-2 sentence product summary AND as a ≥120 char meta description
- For `termos.astro` upgrade example: "Termos de Uso | Grupo US — confira as regras e condições do ecossistema de formação em Saúde Estética Avançada com a Dra. Sacha Gualberto."

</specifics>

<deferred>
## Deferred Ideas

- Bio enrichment for the 10 non-featured team members — outside Phase 2 scope, consider for a future content maintenance phase
- Deep copy rewrites for redirect product fields beyond card-visible (painPoints, pillars, faqs) — only if clear sources exist; otherwise defer to when those products get local pages

</deferred>

---

*Phase: 02-content-and-copy-overhaul*
*Context gathered: 2026-03-26*
