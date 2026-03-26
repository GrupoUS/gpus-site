# Phase 5: SEO Technical Layer + Cleanup - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-26
**Phase:** 05-seo-technical-layer
**Areas discussed:** JSON-LD schemas, OG image strategy, Breadcrumb coverage, Cleanup scope, OTB landing design, OTB content schema, Sitemap implementation, robots.txt extras

---

## JSON-LD Schemas

### curso-auriculo schema type

| Option | Description | Selected |
|--------|-------------|----------|
| Course (Recommended) | Schema.org Course — fits educational product. Fields: name, description, provider, educationalLevel. No price. | ✓ |
| Course + hasCourseInstance | Course with nested CourseInstance for session dates/duration. Richer but needs real schedule data. | |
| Product | Generic Product schema. Less semantic for education. | |

**User's choice:** Course (Recommended)
**Notes:** Straightforward — curso-auriculo is clearly an educational product.

### mentoria-black-neon schema type

| Option | Description | Selected |
|--------|-------------|----------|
| Product (Recommended) | Schema.org Product — mentoria is a paid offering, not a traditional course. | ✓ |
| Course | Could argue mentoria is educational. | |
| Service | Schema.org Service — mentoria as consulting/coaching. Less common in rich results. | |

**User's choice:** Product (Recommended)
**Notes:** None.

### OTB Event schema (SEO-02)

| Option | Description | Selected |
|--------|-------------|----------|
| Mark N/A (Recommended) | OTB has no local page — schema on external site. | |
| Create minimal OTB page | Local otb.astro with Event schema + auto-redirect. | |

**User's choice:** Create minimal OTB page
**Notes:** User later escalated to full landing page (not just minimal).

### OTB page type (follow-up)

| Option | Description | Selected |
|--------|-------------|----------|
| Schema-only + meta-redirect | Minimal HTML with JSON-LD Event + redirect. | |
| Landing stub + redirect | Brief hero with redirect message. | |
| Full landing page | Standard landing template. Removes redirect, treats OTB as local product page. | ✓ |

**User's choice:** Full landing page
**Notes:** Significant scope expansion. User confirmed keeping in Phase 5 after scope warning.

### Pricing fields

| Option | Description | Selected |
|--------|-------------|----------|
| No pricing (Recommended) | Omit offers/price. Checkout is external. | ✓ |
| Free-text price range | Use priceRange field without exact values. | |
| You decide | Claude picks based on best practices. | |

**User's choice:** No pricing (Recommended)
**Notes:** None.

### OTB event data source

| Option | Description | Selected |
|--------|-------------|----------|
| Use what's in JSON | Build Event schema from existing otb.json fields. | |
| I'll provide details | User shares event data in planning phase. | |
| You decide | Claude uses best judgment. | |

**User's choice:** (Other) "use todo o conteudo e ui e design do site otb.gpus.com.br"
**Notes:** Researcher must scrape otb.gpus.com.br for all content, UI, and event data.

---

## OG Image Strategy

### Creation method

| Option | Description | Selected |
|--------|-------------|----------|
| Static PNGs (Recommended) | Create 1200x630 PNG files. Place in public/og/. | ✓ |
| SVG → PNG build script | SVG templates converted at build time. | |
| Satori/OG generation | @vercel/og or satori JSX generation. | |
| You decide | Claude picks simplest approach. | |

**User's choice:** Static PNGs (Recommended)
**Notes:** None.

### Coverage

| Option | Description | Selected |
|--------|-------------|----------|
| All 8 content pages (Recommended) | Complete coverage. Legal pages share a variant. | ✓ |
| Key pages only | Home + 2 landings + sobre + contato (5). | |
| Landings + home only | Home + landings (4). Highest ROI. | |

**User's choice:** All 8 content pages (Recommended)
**Notes:** Plus OTB page = 9 total.

### Design approach

| Option | Description | Selected |
|--------|-------------|----------|
| Claude creates SVGs | Claude writes SVG files with navy bg, gold title, logo. User exports to PNG. | ✓ |
| I'll provide PNGs | User designs externally. Claude wires them. | |
| You decide | Claude picks most practical approach. | |

**User's choice:** Claude creates SVGs
**Notes:** None.

---

## Breadcrumb Coverage

### Remaining pages

| Option | Description | Selected |
|--------|-------------|----------|
| Legal pages only (Recommended) | Add to termos + privacidade. Skip index and 404. 6/8 covered. | ✓ |
| All internal except 404 | Add to termos, privacidade, AND index. 7/8. | |
| Keep current 4 only | Focus effort elsewhere. | |

**User's choice:** Legal pages only (Recommended)
**Notes:** None.

### OTB breadcrumbs

| Option | Description | Selected |
|--------|-------------|----------|
| Yes (Recommended) | Inicio → OTB. Consistent with other landings. | ✓ |
| No | Skip for now. | |

**User's choice:** Yes (Recommended)
**Notes:** Total: 7 pages with breadcrumbs.

---

## Cleanup Scope

### Beyond 2 deprecated components

| Option | Description | Selected |
|--------|-------------|----------|
| Just the 2 files (Recommended) | Remove JourneyTimeline.astro + Testimonials.astro. Minimal and safe. | ✓ |
| Audit for more dead code | Researcher scans for other unused code. | |
| Include OTB redirect removal | Also remove /otb redirect from astro.config. | |

**User's choice:** Just the 2 files (Recommended)
**Notes:** OTB redirect removal handled separately in OTB content schema discussion.

### OTB redirect

| Option | Description | Selected |
|--------|-------------|----------|
| Remove redirect (Recommended) | Since otb.astro will exist, remove config redirect. Update sitemap filter. | ✓ |
| Keep both temporarily | Keep redirect as fallback during build. | |

**User's choice:** Remove redirect (Recommended)
**Notes:** None.

---

## OTB Landing Design

### Design approach

| Option | Description | Selected |
|--------|-------------|----------|
| Grupo US design system (Recommended) | Same landing template with navy/gold. | |
| Replicate external style | Mirror otb.gpus.com.br look and feel. | ✓ |
| Hybrid | Template structure + external visual elements. | |

**User's choice:** Replicate external style
**Notes:** OTB page will have different visual identity from rest of site.

### Fidelity level

| Option | Description | Selected |
|--------|-------------|----------|
| High fidelity | Match colors, typography, layout, imagery as closely as possible. | ✓ |
| Content + layout only | Same content/structure, Tailwind utilities may diverge. | |
| You decide | Claude judges right fidelity. | |

**User's choice:** High fidelity
**Notes:** May require custom color tokens and section components.

### Chrome (header/footer)

| Option | Description | Selected |
|--------|-------------|----------|
| Keep Grupo US header/footer (Recommended) | Standard Layout.astro wrapper. Part of ecosystem. | ✓ |
| Standalone layout | No Grupo US nav. Feels like its own site. | |

**User's choice:** Keep Grupo US header/footer (Recommended)
**Notes:** None.

---

## OTB Content Schema

### Schema extension approach

| Option | Description | Selected |
|--------|-------------|----------|
| Optional event object (Recommended) | Add optional `event` field to products Zod schema. Only OTB uses it. | ✓ |
| Separate events collection | New Content Collection for events. | |
| Inline in otb.json only | Top-level optional fields in existing schema. | |

**User's choice:** Optional event object (Recommended)
**Notes:** None.

### Redirect cutover timing

| Option | Description | Selected |
|--------|-------------|----------|
| Remove in same plan | Clean cutover when creating otb.astro. | ✓ |
| Remove in cleanup plan | Keep redirect during build/test. | |

**User's choice:** Remove in same plan
**Notes:** None.

---

## Sitemap Implementation

### Priority implementation

| Option | Description | Selected |
|--------|-------------|----------|
| Serialize hook (Recommended) | @astrojs/sitemap serialize callback. Map routes to priority values. | ✓ |
| Custom sitemap generation | Skip @astrojs/sitemap. Write custom integration. | |
| You decide | Claude researches capabilities. | |

**User's choice:** Serialize hook (Recommended)
**Notes:** None.

### changefreq

| Option | Description | Selected |
|--------|-------------|----------|
| Yes — basic values | home: weekly, landings: monthly, sobre/contato: monthly, legais: yearly. | ✓ |
| No — priorities only | Google largely ignores changefreq. | |
| You decide | Claude decides based on SEO best practices. | |

**User's choice:** Yes — basic values
**Notes:** None.

---

## robots.txt Extras

### Additional rules

| Option | Description | Selected |
|--------|-------------|----------|
| Minimal fix only (Recommended) | Disallow /404 only. No crawl-delay or bot rules. | ✓ |
| Add crawl-delay | Crawl-delay: 10 for non-Google bots. | |
| Bot-specific rules | Disallow AI crawlers (GPTBot, CCBot). | |

**User's choice:** Minimal fix only (Recommended)
**Notes:** None.

---

## Claude's Discretion

- Event schema field selection for OTB (beyond required fields)
- SVG OG image layout details (positioning, font sizes)
- Zod validators for optional event fields

## Deferred Ideas

None — discussion stayed within phase scope.
