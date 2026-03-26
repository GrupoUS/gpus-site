# Phase 5: SEO Technical Layer + Cleanup - Research

**Researched:** 2026-03-26
**Domain:** SEO structured data, Open Graph, sitemap optimization, Astro static site
**Confidence:** HIGH

## Summary

Phase 5 closes the final 6 orphaned requirements (SEO-01 through SEO-06) from the v1.0 milestone audit. The work spans four distinct areas: (1) JSON-LD structured data per product page (Course, Product, Event schemas), (2) static per-page OG images, (3) sitemap priorities with `@astrojs/sitemap` serialize callback plus robots.txt fix, and (4) deprecated component cleanup. A significant addition is a full local OTB landing page replacing the current redirect, which becomes the host for Event schema and expands the site from 8 to 9 content pages.

The existing `Layout.astro` already implements Organization JSON-LD and conditional BreadcrumbList rendering. The per-product JSON-LD schemas follow the same `<script is:inline type="application/ld+json">` pattern established in the layout. The `@astrojs/sitemap@3.7.1` installed in the project exports `ChangeFreqEnum` and supports the `serialize` callback for per-page priority/changefreq. OG images are static PNGs -- no build-time generation library needed (D-06 specifies SVG source + manual export workflow).

**Primary recommendation:** Implement in three plans: Plan 5.1 handles JSON-LD schemas + OTB landing page + breadcrumb audit (heaviest lift, as OTB page creation is a prerequisite for its Event schema); Plan 5.2 handles OG images (SVG source files + ogImage prop wiring); Plan 5.3 handles sitemap serialize + robots.txt fix + deprecated cleanup (config-level changes).

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** curso-auriculo gets Schema.org `Course` (name, description, provider: Grupo US, educationalLevel). No pricing fields.
- **D-02:** mentoria-black-neon gets Schema.org `Product` (name, description, brand: Grupo US). No pricing fields.
- **D-03:** OTB gets a full local landing page (`otb.astro`) with Schema.org `Event` schema. SEO-02 addressed via local page, not redirect.
- **D-04:** No pricing fields (`offers`, `price`) in any JSON-LD schema. Checkout is external (Kiwify, WhatsApp). Avoids stale data and schema warnings.
- **D-05:** Static PNG files (1200x630) for all 8 content pages + OTB page (9 total). Placed in `public/og/`.
- **D-06:** Claude creates SVG source files with navy background, gold Playfair Display title, and Grupo US logo. User exports to PNG. No build-time generation dependency.
- **D-07:** Add breadcrumbs to `termos` + `politica-de-privacidade` (Inicio -> Termos/Privacidade). Skip `index` (root) and `404` (not indexable).
- **D-08:** New OTB landing page gets breadcrumbs (Inicio -> OTB). Same pattern as curso-auriculo and mentoria-black-neon.
- **D-09:** Final coverage: 7/9 pages with breadcrumbs (sobre, contato, curso-auriculo, mentoria-black-neon, termos, privacidade, OTB).
- **D-10:** Use `@astrojs/sitemap` `serialize` callback for per-page priorities. No custom integration.
- **D-11:** Priorities: home 1.0, landings 0.9, sobre/contato 0.7, legais 0.3.
- **D-12:** Include `changefreq`: home weekly, landings monthly, sobre/contato monthly, legais yearly.
- **D-13:** Minimal fix: `Disallow: /404` only. Remove current Disallow for `/termos` and `/politica-de-privacidade`. No crawl-delay or bot-specific rules.
- **D-14:** High-fidelity replication of `otb.gpus.com.br` design within Astro. Researcher must scrape the external site for content, UI patterns, and event data.
- **D-15:** Keep Grupo US header/footer (standard `Layout.astro` wrapper). OTB page is part of Grupo US ecosystem.
- **D-16:** Optional `event` object added to products Zod schema in `content.config.ts`: `{ startDate?, endDate?, location?, attendanceMode?, organizer? }`. Only OTB uses it.
- **D-17:** Remove `/otb` redirect from `astro.config.mjs` in the same plan as creating `otb.astro` (clean cutover). Update sitemap filter to include `/otb`.
- **D-18:** Remove `src/components/home/JourneyTimeline.astro` (0 importers, replaced by JourneyTimeline.tsx in Phase 4).
- **D-19:** Remove `src/components/landing/Testimonials.astro` (0 importers, replaced by TestimonialCarousel.tsx in Phase 4).
- **D-20:** Remove `/otb` redirect from `astro.config.mjs` and update sitemap filter (bundled with D-17).

### Claude's Discretion
- Event schema field selection for OTB (beyond the required startDate/endDate/location) -- Claude picks fields based on what's available from otb.gpus.com.br content
- SVG OG image layout details (exact positioning, font sizes) -- Claude designs to match navy/gold brand
- Specific Zod validators for optional event fields

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SEO-01 | JSON-LD `Course`/`Product` on local product pages (curso-auriculo, mentoria-black-neon) | Schema.org Course and Product patterns documented below; existing Layout.astro JSON-LD pattern for injection; D-01/D-02 lock schema types |
| SEO-02 | JSON-LD `Event` schema on OTB page + `Product` on OTB | Requires local OTB page (D-03/D-14); Event schema fields from Schema.org + Google; OTB JSON already has event dates in differentials[0] |
| SEO-03 | OG images (1200x630) per page, referenced in meta | 9 static PNGs in `public/og/`; Layout.astro already accepts `ogImage` prop; SVG-first workflow (D-06) |
| SEO-04 | BreadcrumbList JSON-LD on all internal pages | Currently 4/9 pages have breadcrumbs; need to add termos, privacidade, OTB (D-07/D-08); final 7/9 (index + 404 excluded) |
| SEO-05 | `sitemap.xml` with priorities | `@astrojs/sitemap@3.7.1` serialize callback; `ChangeFreqEnum` export verified; D-10/D-11/D-12 lock values |
| SEO-06 | `robots.txt` with Disallow `/404` only | Simple file edit; D-13 locks content |
</phase_requirements>

## Project Constraints (from CLAUDE.md)

- **Package manager:** Bun only -- never npm/yarn/pnpm
- **Validation gates:** `bun run lint` + `bunx astro check` + `bun run build`
- **No React islands without justification** -- OTB landing must use Astro components (no new islands)
- **Content Collections:** No hardcoded content in components -- use `getCollection()`
- **Tailwind v4:** Use `@theme` tokens, never hardcode hex
- **Fonts:** `font-serif` (Playfair Display) for headings, `font-sans` (Inter) for body
- **MPA:** Full page reload, no SPA routing
- **External URL alignment:** Keep `externalSiteUrl`, `cta.url`, redirects, and sitemap filter in sync when changing OTB
- **Commit format:** Conventional Commits
- **Icons:** Lucide React SVG only, never emojis

## Standard Stack

### Core (already installed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| astro | 6.0.8 | Static site framework | Project foundation |
| @astrojs/sitemap | 3.7.1 | Sitemap generation with serialize callback | Already installed; supports priority/changefreq |
| @astrojs/react | 5.0.1 | React island support | Existing islands (not needed for this phase's new components) |

### No New Dependencies

This phase requires **zero new npm packages**. All work uses:
- Built-in Astro features (Content Collections, `<script is:inline>`, page routing)
- `@astrojs/sitemap` serialize callback (already installed)
- Static file creation (SVG/PNG for OG images, robots.txt edit)
- Schema.org JSON-LD (plain JavaScript objects serialized to JSON)

## Architecture Patterns

### JSON-LD Injection Pattern (Established)

The project already uses this pattern in `Layout.astro` for Organization schema:

```astro
<!-- In page frontmatter, build the schema object -->
const courseSchema = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: d.name,
  description: d.description,
  provider: {
    "@type": "Organization",
    name: "Grupo US",
    url: "https://grupous.com.br"
  }
};

<!-- In page template, inject into Layout's head via a slot or inline -->
<script
  is:inline
  type="application/ld+json"
  set:html={JSON.stringify(courseSchema)}
/>
```

**Constraint:** Layout.astro does not currently have a `<slot name="head">` or similar mechanism to inject page-specific `<script>` tags into `<head>`. Two approaches:

1. **Add a `jsonLd` prop to Layout.astro** -- accepts an object, renders it as `<script is:inline type="application/ld+json">` alongside the existing Organization schema. Clean, centralized.
2. **Inject JSON-LD in page body** -- Google explicitly accepts JSON-LD anywhere in the document (head or body). Place it after the Layout component in the page file. Simpler, no Layout change.

**Recommendation:** Option 1 (Layout prop) is cleaner and keeps all structured data in `<head>`. Add an optional `jsonLd?: Record<string, unknown>` prop to Layout.astro.

### OTB Landing Page Pattern

The OTB page follows the established landing page pattern from `curso-auriculo.astro` and `mentoria-black-neon.astro`:

```
1. Page frontmatter: getCollection('products') -> find by slug 'otb' -> extract .data
2. Pass data fields to reusable landing components
3. Wrap in Layout.astro with breadcrumbs, ogImage, jsonLd
```

**Available landing components (12 total):**
- LandingHero, PainPoints, Pillars, Benefits, Differentials, FAQ, LandingCTA, MobileCTABar (standard)
- TestimonialCarousel (React island), Deliverables, NeonStory, NeonBonus, NeonBio (product-specific)

OTB can use the standard components. Per D-14 (high-fidelity), OTB may need 1-2 custom sections for event-specific content (calendar/schedule, AMWC info). The OTB JSON already contains rich content in `painPoints`, `pillars`, `benefits`, `differentials`, `faqs`, `testimonials`.

**Key integration points when creating OTB page:**
1. Remove `/otb` from `redirectTargets` in `astro.config.mjs`
2. Remove `/otb` from sitemap `filter` exclusion list
3. Update `externalSiteUrl` in `otb.json` (remove it or keep for external CTA only)
4. The `productsNav.ts` will auto-resolve: if `externalSiteUrl` is removed, nav links go to `/otb` instead of external

### Breadcrumb Coverage Map

Current state (verified by grep):

| Page | Has Breadcrumbs | Action |
|------|----------------|--------|
| `/` (index) | No | Skip (root page) |
| `/sobre` | Yes | None |
| `/contato` | Yes | None |
| `/curso-auriculo` | Yes | None |
| `/mentoria-black-neon` | Yes | None |
| `/termos` | No | Add (D-07) |
| `/politica-de-privacidade` | No | Add (D-07) |
| `/otb` (new page) | N/A | Add (D-08) |
| `/404` | No | Skip (not indexable) |

Target: 7/9 pages with breadcrumbs.

### Sitemap Serialize Pattern

```javascript
import sitemap, { ChangeFreqEnum } from '@astrojs/sitemap';

sitemap({
  filter: (page) => { /* existing filter logic */ },
  serialize(item) {
    const pathname = new URL(item.url).pathname.replace(/\/$/, '') || '/';

    if (pathname === '/') {
      item.priority = 1.0;
      item.changefreq = ChangeFreqEnum.WEEKLY;
    } else if (['/curso-auriculo', '/mentoria-black-neon', '/otb'].includes(pathname)) {
      item.priority = 0.9;
      item.changefreq = ChangeFreqEnum.MONTHLY;
    } else if (['/sobre', '/contato'].includes(pathname)) {
      item.priority = 0.7;
      item.changefreq = ChangeFreqEnum.MONTHLY;
    } else if (['/termos', '/politica-de-privacidade'].includes(pathname)) {
      item.priority = 0.3;
      item.changefreq = ChangeFreqEnum.YEARLY;
    }

    return item;
  },
})
```

**Verified:** `@astrojs/sitemap@3.7.1` exports `ChangeFreqEnum` (re-exported from `sitemap` package as `EnumChangefreq`). The `serialize` callback type is `(item: SitemapItem) => SitemapItem | Promise<SitemapItem | undefined> | undefined`. SitemapItem has `url`, `lastmod`, `changefreq`, `priority`, `links` properties.

### Content Collection Schema Extension for Event

```typescript
// Add to products schema in content.config.ts
event: z.object({
  startDate: z.string(), // ISO 8601: "2026-10-18"
  endDate: z.string(),   // ISO 8601: "2026-10-23"
  location: z.object({
    name: z.string(),
    address: z.string(),
    city: z.string().optional(),
    country: z.string().optional(),
  }),
  attendanceMode: z.enum(["offline", "online", "mixed"]).optional(),
  organizer: z.string().optional(),
}).optional(),
```

**OTB event data (from otb.json differentials[0]):**
- Dates: October 18-23, 2026 (immersion Oct 18-20, AMWC Oct 21-23)
- Location: Dubai (Taj Dubai mentioned, AMWC venue)
- Mode: Mixed (online modules + in-person Dubai immersion)

### OG Image File Structure

```
public/
  og-image.png          # Default fallback (existing)
  og/
    home.png            # / (index)
    sobre.png           # /sobre
    contato.png         # /contato
    curso-auriculo.png  # /curso-auriculo
    mentoria-black-neon.png  # /mentoria-black-neon
    otb.png             # /otb
    termos.png          # /termos
    privacidade.png     # /politica-de-privacidade
    404.png             # /404 (optional, not indexed but shared links may preview)
```

SVG source files in a separate directory (not served):
```
.planning/assets/og-svg/   # or similar non-public location
  home.svg
  sobre.svg
  ...
```

Each page then passes `ogImage="/og/{slug}.png"` to `<Layout>`.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Sitemap priorities | Custom XML generation | `@astrojs/sitemap` serialize callback | Already installed, type-safe, maintained by Astro team |
| JSON-LD validation | Custom schema validator | Google Rich Results Test (manual) | Google's tool is the authority on what works in search |
| OG image generation at build time | Satori + resvg-js pipeline | Static PNG files (D-06) | User decision: SVG source + manual export avoids build dependency |
| BreadcrumbList logic | Custom breadcrumb builder | Simple array prop to Layout.astro | Pattern already established in 4 pages |

## Common Pitfalls

### Pitfall 1: JSON-LD Content Must Match Visible Page Content
**What goes wrong:** Google penalizes structured data that describes content not visible on the page (e.g., pricing in JSON-LD but not on page).
**Why it happens:** Temptation to add rich schema fields for better search appearance.
**How to avoid:** D-04 already prevents this -- no pricing fields. Ensure `name`, `description` in JSON-LD match what the user sees on the page.
**Warning signs:** Google Search Console "Structured data" warnings.

### Pitfall 2: OTB URL Alignment During Cutover
**What goes wrong:** After creating the local OTB page, navigation, CTAs, or external links still point to the old redirect target.
**Why it happens:** Multiple files reference OTB: `astro.config.mjs` (redirect), `otb.json` (`externalSiteUrl`, `cta.url`), `productsNav.ts` (reads `externalSiteUrl`), sitemap filter.
**How to avoid:** In a single atomic commit: (1) create `otb.astro`, (2) remove redirect from `astro.config.mjs`, (3) remove `externalSiteUrl` from `otb.json` (keep `cta.url` pointing to `https://otb.gpus.com.br/` for the CTA button if desired), (4) remove `/otb` from sitemap filter exclusion, (5) run `bun run check:external-urls`.
**Warning signs:** Build succeeds but navigation goes to external site instead of local page.

### Pitfall 3: Stale OG Image Cache
**What goes wrong:** After deploying new OG images, social media previews show the old default `og-image.png`.
**Why it happens:** Facebook/Twitter/LinkedIn cache OG images aggressively. Also, if `ogImage` prop is not passed to Layout, it defaults to `/og-image.png`.
**How to avoid:** Verify every page's `<Layout>` call includes the `ogImage="/og/{slug}.png"` prop. After deploy, use Facebook Sharing Debugger to force refresh.
**Warning signs:** Sharing a page on social media shows generic image instead of page-specific one.

### Pitfall 4: BreadcrumbList URLs Must Be Absolute
**What goes wrong:** BreadcrumbList JSON-LD with relative URLs (`/sobre` instead of `https://grupous.com.br/sobre`) may not be recognized by Google.
**Why it happens:** Copy-paste from internal links without adding the full domain.
**How to avoid:** The existing pattern already uses absolute URLs (`https://grupous.com.br/`). Follow it consistently.
**Warning signs:** Google Rich Results Test shows breadcrumb warnings.

### Pitfall 5: Sitemap Filter vs Serialize Confusion
**What goes wrong:** Trying to set priority in `filter` (which only returns boolean) or trying to exclude pages in `serialize` by returning wrong value.
**Why it happens:** Two different callbacks with similar but distinct purposes.
**How to avoid:** `filter(page: string) => boolean` -- include/exclude. `serialize(item: SitemapItem) => SitemapItem | undefined` -- modify properties or exclude (return undefined).
**Warning signs:** TypeScript errors, pages missing from sitemap, or priorities not appearing.

### Pitfall 6: OTB externalSiteUrl and CTA Misalignment
**What goes wrong:** Removing `externalSiteUrl` from otb.json causes nav links to go to `/otb` (correct), but `cta.url` still points to `https://otb.gpus.com.br/` -- or vice versa.
**Why it happens:** `externalSiteUrl` controls navigation destination; `cta.url` controls conversion CTA. They serve different purposes per CLAUDE.md rules.
**How to avoid:** After creating local page: remove `externalSiteUrl` (nav goes to `/otb`), but keep `cta.url` as the external enrollment link (WhatsApp or external funnel). Run `bun run check:external-urls` to validate.
**Warning signs:** Nav link and CTA button go to same place, or CTA goes to the local page instead of enrollment.

## Code Examples

### JSON-LD Course Schema (curso-auriculo)

```astro
---
// In curso-auriculo.astro frontmatter
const courseSchema = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: d.name,
  description: d.description,
  provider: {
    "@type": "Organization",
    name: "Grupo US",
    url: "https://grupous.com.br",
  },
  educationalLevel: "Beginner",
};
---
```
Source: [Schema.org Course](https://schema.org/Course), [Google Course Structured Data](https://developers.google.com/search/docs/appearance/structured-data/course)

### JSON-LD Product Schema (mentoria-black-neon)

```astro
---
const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: d.name,
  description: d.description,
  brand: {
    "@type": "Organization",
    name: "Grupo US",
    url: "https://grupous.com.br",
  },
  image: `https://grupous.com.br${d.image}`,
};
---
```
Source: [Schema.org Product](https://schema.org/Product)

### JSON-LD Event Schema (OTB)

```astro
---
const eventSchema = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: d.name,
  description: d.description,
  startDate: d.event?.startDate,  // "2026-10-18"
  endDate: d.event?.endDate,      // "2026-10-23"
  location: {
    "@type": "Place",
    name: d.event?.location?.name,
    address: {
      "@type": "PostalAddress",
      addressLocality: d.event?.location?.city,
      addressCountry: d.event?.location?.country,
    },
  },
  organizer: {
    "@type": "Organization",
    name: "Grupo US",
    url: "https://grupous.com.br",
  },
  eventAttendanceMode: "https://schema.org/MixedEventAttendanceMode",
  image: `https://grupous.com.br/og/otb.png`,
};
---
```
Source: [Schema.org Event](https://schema.org/Event), [Google Event Structured Data](https://developers.google.com/search/docs/appearance/structured-data/event)

**Note on Google Event rich results:** Google requires physical location with address for Event rich results. The OTB event in Dubai qualifies. Google states: "Virtual experiences that have no real-world component aren't supported." OTB is mixed (online modules + Dubai immersion), so `MixedEventAttendanceMode` is appropriate.

### Layout.astro jsonLd Prop Addition

```astro
---
interface Props {
  title: string;
  description?: string;
  ogImage?: string;
  activeNav?: string;
  breadcrumbs?: Array<{ name: string; url: string }>;
  whatsappMessage?: string;
  hasBottomBar?: boolean;
  jsonLd?: Record<string, unknown>;  // NEW
}

const {
  jsonLd,
  // ...existing destructuring
} = Astro.props;
---

<!-- In <head>, after existing Organization schema -->
{jsonLd && (
  <script
    is:inline
    type="application/ld+json"
    set:html={JSON.stringify(jsonLd)}
  />
)}
```

### Sitemap Configuration

```javascript
import sitemap, { ChangeFreqEnum } from '@astrojs/sitemap';

sitemap({
  filter: (page) => {
    try {
      const pathname = new URL(page).pathname.replace(/\/$/, '') || '/';
      // OTB removed from exclusion list (now a local page)
      if (
        pathname === '/na-mesa-certa' ||
        pathname === '/trintae3' ||
        pathname === '/comunidade-us' ||
        pathname === '/neon-dash'
      ) {
        return false;
      }
    } catch { /* keep page */ }
    return true;
  },
  serialize(item) {
    const pathname = new URL(item.url).pathname.replace(/\/$/, '') || '/';

    const config: Record<string, { priority: number; changefreq: string }> = {
      '/': { priority: 1.0, changefreq: 'weekly' },
      '/curso-auriculo': { priority: 0.9, changefreq: 'monthly' },
      '/mentoria-black-neon': { priority: 0.9, changefreq: 'monthly' },
      '/otb': { priority: 0.9, changefreq: 'monthly' },
      '/sobre': { priority: 0.7, changefreq: 'monthly' },
      '/contato': { priority: 0.7, changefreq: 'monthly' },
      '/termos': { priority: 0.3, changefreq: 'yearly' },
      '/politica-de-privacidade': { priority: 0.3, changefreq: 'yearly' },
    };

    const entry = config[pathname];
    if (entry) {
      item.priority = entry.priority;
      item.changefreq = entry.changefreq;
    }

    return item;
  },
})
```

### robots.txt (Fixed)

```
User-agent: *
Allow: /
Disallow: /404

Sitemap: https://grupous.com.br/sitemap-index.xml
```

### SVG OG Image Template (Conceptual)

```svg
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <!-- Navy background -->
  <rect width="1200" height="630" fill="#1a1a2e"/>

  <!-- Subtle gold accent line -->
  <rect x="60" y="480" width="200" height="3" fill="#d4af37" rx="1.5"/>

  <!-- Page title in Playfair Display -->
  <text x="60" y="320" font-family="Playfair Display, serif" font-size="64"
        font-weight="700" fill="#d4af37">
    Curso de Auriculo
  </text>

  <!-- Subtitle in Inter -->
  <text x="60" y="380" font-family="Inter, sans-serif" font-size="24"
        fill="#94a3b8">
    Grupo US - Formacao em Saude Estetica
  </text>

  <!-- Grupo US logo area (bottom-right) -->
  <text x="1060" y="580" font-family="Playfair Display, serif" font-size="28"
        font-weight="600" fill="#d4af37" text-anchor="end">
    Grupo US
  </text>
</svg>
```

**Note:** SVGs with embedded fonts require the fonts to be available at render time. For SVG-to-PNG export, the user will need Playfair Display and Inter installed locally, or the SVG should use `<text>` with system fallback fonts. Alternative: use a design tool (Figma, Inkscape) to trace the text to paths before export.

## OTB Landing Page Content

### Content Source

The OTB JSON (`src/content/products/otb.json`) already contains comprehensive content:
- **name:** "OTB -- Out Of The Box"
- **type:** "MBA Internacional"
- **tagline:** Full MBA description with MEC seal, 320 hours, Dubai
- **painPoints:** 3 items (business gap, international proof, differentiation)
- **pillars:** 3 items (recognition, vision, practice)
- **benefits:** 7 items including pricing reference, AMWC, Dubai
- **differentials:** 3 items including precise Dubai calendar (Oct 18-23, 2026)
- **faqs:** 5 items covering audience, Dubai experience, format, investment, modules
- **testimonials:** 2 items

### Event Data to Add to otb.json

```json
{
  "event": {
    "startDate": "2026-10-18",
    "endDate": "2026-10-23",
    "location": {
      "name": "Taj Dubai / AMWC Dubai",
      "address": "Dubai, United Arab Emirates",
      "city": "Dubai",
      "country": "AE"
    },
    "attendanceMode": "mixed",
    "organizer": "Grupo US"
  }
}
```

### OTB Page vs External Site

The WebFetch of `https://otb.gpus.com.br/` returned only the title "OTB - O Primeiro MBA em Business Aesthetic Health" -- the external site appears to be a minimal landing or uses heavy client-side rendering that WebFetch cannot capture. **This means the OTB landing page must be built from the rich content already in `otb.json`** rather than scraped from the external site. The JSON already contains all the structured content needed for a full landing page using existing landing components.

**Implication for D-14 (high-fidelity replication):** Since the external site's content is not extractable, the local page will be a high-quality landing built from the product JSON data using the established component library. This is actually the better outcome -- the local page will be consistent with the rest of the Grupo US site. Custom OTB-specific sections (similar to how mentoria-black-neon has NeonStory/NeonBonus/NeonBio) may be needed for event calendar/schedule visualization.

### OTB CTA Strategy After Cutover

When `externalSiteUrl` is removed from otb.json:
- **Nav links:** Will resolve to `/otb` (local page) -- correct
- **CTA button:** `cta.url` stays as `https://otb.gpus.com.br/` -- points to external enrollment
- **WhatsApp:** `cta.whatsappMessage` already set for SDR Laura
- **JourneyTimeline on home:** `pageHref` in `index.astro` reads `product.externalSiteUrl ?? /product.slug` -- will correctly resolve to `/otb`

**Important:** The `cta.url` in otb.json should NOT be changed to `/otb`. It should remain as the external enrollment URL (or WhatsApp). The CTA is for conversion (external checkout), not navigation.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `robots.txt` disallowing legal pages | Allow all except 404 | Google recommends indexing legal pages | Legal pages now indexable for brand searches |
| Single default OG image | Per-page OG images | Industry standard since 2020+ | Better social media click-through |
| No structured data beyond Organization | Per-page Course/Product/Event JSON-LD | Google rich results continually expanding | Eligible for rich snippets, event carousels |
| sitemap without priorities | Per-page priority and changefreq | sitemap protocol standard | Hints to crawlers about page importance |

**Deprecated/outdated:**
- `changefreq` and `priority` in sitemaps: Google has stated they largely ignore these fields, but they remain part of the sitemap protocol and other search engines (Bing, Yandex) may use them. Including them has no downside.

## Open Questions

1. **OTB externalSiteUrl removal scope**
   - What we know: Removing `externalSiteUrl` makes nav links point to `/otb`. The `cta.url` remains external for conversion.
   - What's unclear: Should the external URL `https://otb.gpus.com.br/` still be referenced anywhere on the local OTB page (e.g., a "Visit official OTB site" link)?
   - Recommendation: Keep `cta.url` as the external enrollment link. The local page IS the informational landing; the CTA button drives to external enrollment. No need for a separate "visit external site" link.

2. **OTB CTA.url update**
   - What we know: Current `cta.url` is `https://otb.gpus.com.br/`. After creating local page, should this change?
   - What's unclear: Is `https://otb.gpus.com.br/` the actual enrollment page, or just the informational site we're replacing?
   - Recommendation: Keep current `cta.url` unchanged initially. If the external site is purely informational (which we're replacing), the CTA should eventually point to WhatsApp or a checkout link. The implementer should flag this for human decision if unclear.

3. **SVG Font Embedding for OG Images**
   - What we know: SVGs with text need fonts at render time for PNG export.
   - What's unclear: Whether the user has Playfair Display + Inter installed locally for SVG-to-PNG conversion.
   - Recommendation: Create SVGs with fallback fonts (`serif`, `sans-serif`) and note that the user should install the fonts or use a design tool for final PNG export.

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | No unit test runner (per CLAUDE.md) |
| Config file | None |
| Quick run command | `bun run lint && bunx astro check` |
| Full suite command | `bun run lint && bunx astro check && bun run build` |

### Phase Requirements -> Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SEO-01 | JSON-LD Course/Product on product pages | build + manual | `bun run build && grep -l 'application/ld+json' dist/curso-auriculo/index.html` | N/A (build output) |
| SEO-02 | JSON-LD Event on OTB page | build + manual | `bun run build && grep -l 'Event' dist/otb/index.html` | N/A (build output) |
| SEO-03 | OG images per page | build + manual | `bun run build && ls public/og/*.png` | N/A (static assets) |
| SEO-04 | BreadcrumbList on internal pages | build + manual | `bun run build && grep -c 'BreadcrumbList' dist/termos/index.html` | N/A (build output) |
| SEO-05 | Sitemap with priorities | build | `bun run build && grep 'priority' dist/sitemap-0.xml` | N/A (build output) |
| SEO-06 | robots.txt correct | manual-only | `cat public/robots.txt` | Existing file |

### Sampling Rate
- **Per task commit:** `bun run lint && bunx astro check && bun run build`
- **Per wave merge:** Full build + grep verification of dist/ output for structured data
- **Phase gate:** Full suite green + manual check of JSON-LD in dist/ HTML files

### Wave 0 Gaps
None -- no test framework needed. Validation is via build success + dist/ output inspection. The project explicitly has no unit test runner (CLAUDE.md: "No unit test runner").

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Bun | Package manager, build | Yes | (installed) | -- |
| Astro | Build, SSG | Yes | 6.0.8 | -- |
| @astrojs/sitemap | Sitemap priorities | Yes | 3.7.1 | -- |

**No external dependencies required beyond what's already installed.** This phase is purely code/config changes plus static asset creation.

## Sources

### Primary (HIGH confidence)
- `src/layouts/Layout.astro` -- Existing JSON-LD Organization + BreadcrumbList pattern
- `src/content.config.ts` -- Current Zod schema for products collection
- `astro.config.mjs` -- Current redirect targets and sitemap filter
- `node_modules/@astrojs/sitemap/dist/index.d.ts` -- Verified `ChangeFreqEnum` export and `serialize` callback type
- [Google Event Structured Data](https://developers.google.com/search/docs/appearance/structured-data/event) -- Required/recommended Event properties
- [Google Course Structured Data](https://developers.google.com/search/docs/appearance/structured-data/course) -- Required/recommended Course properties
- [Schema.org Product](https://schema.org/Product) -- Product schema minimum fields
- [Schema.org Course](https://schema.org/Course) -- Course schema properties
- [Schema.org Event](https://schema.org/Event) -- Event schema properties
- [@astrojs/sitemap docs](https://docs.astro.build/en/guides/integrations-guide/sitemap/) -- serialize callback, filter function

### Secondary (MEDIUM confidence)
- `https://otb.gpus.com.br/` -- WebFetch returned minimal content (JS-rendered site); OTB content sourced from `otb.json` instead
- [Static OG Images in Astro](https://arne.me/blog/static-og-images-in-astro/) -- SVG/PNG workflow patterns
- [Google General Structured Data Guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies) -- JSON-LD must match visible content

### Tertiary (LOW confidence)
- Google's actual crawling behavior for `priority`/`changefreq` in sitemaps (they may largely ignore these values, but other search engines may use them)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- zero new packages, all features verified in installed versions
- Architecture: HIGH -- patterns established by existing codebase (Layout.astro JSON-LD, breadcrumbs, Content Collections)
- JSON-LD schemas: HIGH -- verified against Schema.org and Google documentation
- OTB landing page: MEDIUM -- external site not scrapable, but otb.json has rich content for building the page
- OG images: MEDIUM -- SVG-to-PNG workflow depends on user's local tooling for final export
- Sitemap/robots: HIGH -- `@astrojs/sitemap` serialize callback verified against installed package types
- Pitfalls: HIGH -- based on direct codebase analysis of integration points

**Research date:** 2026-03-26
**Valid until:** 2026-04-26 (stable domain, no fast-moving dependencies)
