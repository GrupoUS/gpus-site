---
name: performance-optimization
description: Use when optimizing runtime and build performance, running security baseline checks, or improving SEO/GEO readiness in one workflow. Triggers on slow pages, poor LCP/INP/CLS, large bundles, high API latency, vulnerability checks, headers, robots/sitemap, and search visibility regressions.
---

# Performance Optimization

Single performance skill for three goals: speed, security baseline, and SEO/GEO baseline.

## Core Rules

1. Measure before changing code.
2. Change one bottleneck at a time.
3. Re-measure with the same tool and scenario.
4. Keep fixes minimal (KISS) and only for active issues (YAGNI).

## Packs

Pick one pack per run:

| Pack                | Use When                                                      | Minimum Output                               |
| ------------------- | ------------------------------------------------------------- | -------------------------------------------- |
| `performance-core`  | Slow load, sluggish interaction, high API p95, large bundle   | before/after metrics + exact fixes           |
| `security-baseline` | Release hardening, OWASP sanity, dependency and header checks | findings by severity + mitigation            |
| `seo-geo-baseline`  | Search visibility, crawlability, AI citation readiness        | indexability/schema/CWV report + action list |

## Baseline Commands

```bash
bunx astro check                  # TypeScript + Content Collection validation
bun run build                     # Full static build
bun run build 2>&1 | tail -30    # Build with error context
```

> **Note:** This project has no test framework or linter configured. Validation gates are `bunx astro check` (types) and `bun run build` (full build).
> **Cross-reference:** Load `Skill("astro")` for Astro 6 patterns. See `references/performance.md` for detailed optimization guide.

## Pack Commands

### `performance-core`

```bash
CHROME_PATH=/usr/bin/google-chrome npx lighthouse http://localhost:4321 --preset=desktop --port=9222 --chrome-flags="--headless=new --disable-gpu --no-first-run --no-default-browser-check --disable-background-networking --disable-extensions"
CHROME_PATH=/usr/bin/google-chrome npx lighthouse https://<your-domain.com> --preset=desktop --port=9333 --chrome-flags="--headless=new --disable-gpu --no-first-run --no-default-browser-check --disable-background-networking --disable-extensions"
npx -y react-doctor@latest . --yes --verbose
```

React Doctor remediation loop (required in `performance-core`):

1. Run `npx -y react-doctor@latest . --yes --verbose` and capture diagnostics.
2. Fix `error` severity suggestions first (correctness/security/performance).
3. Fix high-impact `warning` suggestions (render churn, dead code, bundle bloat).
4. Re-run `npx -y react-doctor@latest . --yes --score`.
5. Repeat until score reaches target for the sprint (recommended: `>= 75`).

Use `--project` for monorepos when needed:

```bash
npx -y react-doctor@latest . --yes --project . --verbose
```

Optional auto-fix assistant mode:

```bash
npx -y react-doctor@latest . --yes --fix
```

Always review generated changes before keeping them.

Common React Doctor fixes to apply immediately:

- `React Hook called conditionally`: move hook calls to top-level and guard inside effect/body.
- `Import "m" with LazyMotion`: replace `motion` import with `LazyMotion` + `m` to reduce bundle size.
- `heavy library (recharts)`: lazy-load chart modules with `React.lazy` and `Suspense`.
- `component too large`: split into focused subcomponents and move logic to hooks/services.
- `useState initialized from prop`: derive value in render or sync explicitly with guarded effect.
- `array index as key`: use stable IDs (`id`, `slug`, `uuid`) to avoid list bugs.
- `default [] prop`: hoist default arrays/objects to module-level constants for stable references.

After each batch of fixes, run:

```bash
npx -y react-doctor@latest . --yes --score
bun run check && bun run lint:check && bun run test
```

Use DevTools Performance/Memory and `react-scan` for render hotspots.

### `security-baseline`

```bash
bun audit
gitleaks detect --source .
curl -I http://localhost:4321
```

Check at least: access control, injection resistance, auth flows, misconfiguration, secrets.

### `seo-geo-baseline`

```bash
CHROME_PATH=/usr/bin/google-chrome npx lighthouse http://localhost:4321 --preset=desktop --port=9222 --chrome-flags="--headless=new --disable-gpu --no-first-run --no-default-browser-check --disable-background-networking --disable-extensions"
CHROME_PATH=/usr/bin/google-chrome npx lighthouse https://<your-domain.com> --preset=desktop --port=9333 --chrome-flags="--headless=new --disable-gpu --no-first-run --no-default-browser-check --disable-background-networking --disable-extensions"
curl http://localhost:4321/robots.txt
curl https://<your-domain.com>/robots.txt
```

Use distinct explicit ports for sequential runs (`9222` for staging, `9333` for production).
If you run in WSL, prefer Linux Chrome via `CHROME_PATH=/usr/bin/google-chrome` to avoid Windows temp permission cleanup errors.

Check at least: metadata, structured data, canonical links, robots, sitemap, CWV.

## SEO Optimization Playbook (Robots + Sitemap)

Use this playbook when improving indexability for `<your-domain.com>`.

### Phase 0 - Discover First

Always confirm stack before implementation:

- frontend framework and router (`Next.js App Router` vs `Astro SSG`)
- existing robots/sitemap files and runtime endpoints
- private and dynamic routes that must not be indexed
- metadata strategy (global + route-level)

Current project baseline (verified):

- frontend is `Astro 6 SSG + React Islands + Tailwind CSS v4`
- no `app/robots.ts` or `app/sitemap.ts` structure exists
- check `public/robots.txt` and `public/sitemap.xml` for existing files
- verify `http://localhost:4321/robots.txt` and `/sitemap.xml` return correct content
- Tailwind v4 configured via `@tailwindcss/vite` plugin (no `tailwind.config.js`)
- Content Collections use Astro 6 auto-inference (no `config.ts`)
- View Transitions via `ClientRouter` (not deprecated `ViewTransitions`)

### Findings Table Template

Use this table in every SEO execution report:

| #   | Finding                                  | Confidence (1-5) | Source                                                    | Impact |
| --- | ---------------------------------------- | ---------------- | --------------------------------------------------------- | ------ |
| 1   | Current robots.txt status                | 5                | `public/` + curl response                                 | High   |
| 2   | Sitemap generation strategy              | 5                | `public/` + curl response                                 | High   |
| 3   | Existing metadata patterns               | 5                | `src/layouts/` + Astro frontmatter                        | Medium |
| 4   | Dynamic/private routes needing exclusion | 5                | `src/pages/` directory structure                           | High   |
| 5   | Core Web Vitals current state            | 4                | Lighthouse run artifacts                                  | High   |

### Edge Cases to Check (Minimum)

1. Private or draft routes indexed by accident.
2. Missing canonical for public pages.
3. Missing `og:image` absolute URL for public sharing.
4. Sitemap present but serving HTML fallback instead of XML.
5. robots/sitemap returning 200 with wrong content-type (`text/html` instead of `text/plain`/`application/xml`).

### Implementation Strategy by Stack

#### A) Next.js App Router projects (reference pattern)

Use native metadata files:

- `app/robots.ts`
- `app/sitemap.ts`
- `metadataBase` in `app/layout.tsx`

For robots policy, always disallow private routes and keep crawler allowlist behavior safe:

- disallow at least: `/api/`, `/dashboard/`, `/admin/`, `/_next/`, `/auth/`
- include `sitemap` and `host`
- do not globally block all crawlers

#### B) Current Na Mesa Certa stack (Astro 5 SSG + React Islands + Tailwind CSS v4)

Use static assets served by Astro build output:

- create `public/robots.txt`
- create `public/sitemap.xml` (or use `@astrojs/sitemap` integration)

Recommended `robots.txt` policy for this repo:

```txt
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/

User-agent: GPTBot
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

Sitemap: https://<your-domain.com>/sitemap.xml
Host: https://<your-domain.com>
```

Sitemap rules for this repo:

- include only public pages (all statically generated pages)
- exclude any draft or private routes
- include `<lastmod>` for every URL

### Metadata Rules

For Next.js projects:

- always set `metadataBase`
- always use title template (`%s | Na Mesa Certa`)
- always set canonical and OG/Twitter image metadata

For current Astro project:

- maintain base metadata in `src/layouts/Layout.astro` (or equivalent base layout)
- add page-level title/description/canonical via Astro frontmatter props
- ensure meaningful images do not use empty `alt` text

### Core Web Vitals Targets

- `LCP < 2.5s`
- `INP < 200ms`
- `CLS < 0.1`
- `TTFB < 600ms`

### Validation Commands

```bash
# Robots and sitemap must be real files (not SPA HTML)
curl -I http://localhost:4321/robots.txt
curl -I http://localhost:4321/sitemap.xml

# Verify content type + payload start
python3 - <<'PY'
import urllib.request
for u in ['http://localhost:4321/robots.txt','http://localhost:4321/sitemap.xml']:
    with urllib.request.urlopen(u, timeout=30) as r:
        body = r.read(80).decode('utf-8', errors='replace')
        print(u, r.status, r.headers.get('content-type'), repr(body))
PY

# Lighthouse SEO/Performance (dev)
CHROME_PATH=/usr/bin/google-chrome npx lighthouse http://localhost:4321 --preset=desktop --port=9222 --chrome-flags="--headless=new --disable-gpu --no-first-run --no-default-browser-check --disable-background-networking --disable-extensions" --output json --output-path=/tmp/lh-dev-seo.json

# Lighthouse SEO/Performance (production)
CHROME_PATH=/usr/bin/google-chrome npx lighthouse https://<your-domain.com> --preset=desktop --port=9333 --chrome-flags="--headless=new --disable-gpu --no-first-run --no-default-browser-check --disable-background-networking --disable-extensions" --output json --output-path=/tmp/lh-prod-seo.json
```

### Non-Negotiable Constraints

- Never index private areas (`/api/`, `/dashboard/`, `/admin/`, `/auth/`, and equivalent private business paths).
- Never apply Next.js `app/robots.ts` guidance to non-Next stacks.
- Never ship sitemap entries without `lastmod`.
- Never block all crawlers globally.
- Never skip post-deploy curl validation.

### Success Criteria

- `/robots.txt` returns 200 with `text/plain` and expected disallow rules.
- `/sitemap.xml` returns 200 with XML content-type and valid URL set.
- URLs in sitemap return 200 and are public pages.
- Lighthouse SEO score reaches `>= 0.95` on production.
- Public pages have unique and stable title/description/canonical strategy.

## Targets

| Metric      | Target   |
| ----------- | -------- |
| LCP         | <= 2.5s  |
| INP         | <= 200ms |
| CLS         | <= 0.1   |
| API p95     | <= 140ms |
| Main bundle | <= 200KB |

## Bottleneck Routing

- Initial load slow -> inspect critical rendering path and bundle split.
- Interaction slow -> inspect re-renders and long handlers.
- API slow -> inspect N+1 patterns and missing indexes.
- Memory growth -> inspect subscription/listener/interval cleanup.

## High-Value Fixes

### Astro SSG (This Project)

**Zero-JS by default:**
- Ensure static sections use `.astro` components (zero JS shipped)
- Only 3 React islands allowed: CountdownTimer (`client:load`), FAQAccordion (`client:visible`), Testimonials (`client:visible`)
- Prefer `client:visible` over `client:load` for below-fold islands

**Image optimization (from `astro` skill → performance.md):**
- Use `<Image>` from `astro:assets` for all images — auto WebP/AVIF conversion
- Hero image: `loading="eager"` + `fetchpriority="high"` (LCP candidate)
- Below-fold: `loading="lazy"` (default)
- Always set explicit `width` and `height` — prevents CLS
- Use `<Picture>` for multiple format fallbacks (`formats={['avif', 'webp']}`)

**Font optimization:**
- Google Fonts with `display=swap` — prevents FOIT
- Preconnect: `<link rel="preconnect" href="https://fonts.googleapis.com" />`
- Only load weights actually used: Playfair Display (400, 600, 700) + Inter (300-700)

**CSS optimization (Tailwind v4):**
- Tailwind v4 auto-purges unused classes at build time
- Use `@theme` tokens — never hardcode hex values
- Astro auto-inlines small stylesheets (`inlineStylesheets: "auto"`)
- Scoped styles in `.astro` components prevent CSS bloat

**Third-party video / iframes (Hero, above the fold):**
- **Never** let a YouTube (or any) iframe be the LCP candidate on first paint — use a **poster image** + **click-to-play** (or inject iframe only after user gesture / late idle).
- Prefer **`youtube-nocookie.com`** embed URLs; set `title` on iframe for a11y; no autoplay with sound.
- Keep the **logo or static hero image** as the primary LCP target (`loading="eager"`, `fetchpriority="high"`, explicit dimensions) per `AGENTS.md`.
- After changing embed strategy, re-run Lighthouse (LCP, TBT) on mobile and desktop — compare to previous run.
- Reference implementation: `Hero.astro` (placeholder + `iframe` appended on click).

**Animation performance:**
- Only animate `transform` and `opacity` (GPU-composited)
- Never animate `width`, `height`, `top`, `left`, `margin`, `padding`
- Use Framer Motion `LazyMotion` + `domAnimation` to reduce bundle
- `prefers-reduced-motion` via `useReducedMotion()` — mandatory

**JS budget:**

| Category | Target |
|----------|--------|
| Initial JS bundle | < 50KB |
| Per-island JS | As small as possible |
| Total page JS | < 100KB |

### Frontend (General)

- Route-level lazy loading for heavy pages and modals.
- Remove unstable props/callbacks causing unnecessary re-renders.
- Virtualize long lists.

### Backend/DB (If Applicable)

- Remove N+1 queries with joins or batch strategy.
- Ensure FK columns are indexed.
- Avoid unbounded list queries.

## Guardrails

- Do not optimize based on intuition only.
- Do not over-memoize cheap operations.
- Do not expand scope to unrelated refactors.
- Do not claim improvement without before/after evidence.
- Do not add new React islands for "optimization" — fewer islands = faster.
- Do not replace Astro `<Image>` with raw `<img>` — Astro Image handles optimization.
- Do not create `tailwind.config.js` — Tailwind v4 uses CSS-first `@theme`.

## Astro Performance Diagnostic Commands

```bash
# Full health check
bunx astro check && bun run build

# Build output analysis (check for oversized assets)
ls -lhS dist/_astro/ 2>/dev/null | head -20

# Check JS bundle count and sizes
find dist/ -name "*.js" -exec ls -lh {} \; 2>/dev/null | sort -k5 -rh | head -10

# Check image sizes in output
find dist/ -name "*.jpg" -o -name "*.png" -o -name "*.webp" -o -name "*.avif" | xargs ls -lh 2>/dev/null | sort -k5 -rh | head -10

# Clear caches for clean measurement
rm -rf node_modules/.vite dist .astro && bun run build
```

## Report Template

```markdown
## Optimization Report

Pack: [performance-core|security-baseline|seo-geo-baseline]

| Metric | Before | After | Delta |
| ------ | ------ | ----- | ----- |
| ...    | ...    | ...   | ...   |

### Changes

1. [change] -> [impact]
2. [change] -> [impact]

### Risks / Follow-up

- [remaining risk]
```

## Cross-References

- **`astro` skill** — `.claude/skills/astro/SKILL.md` — Full Astro 6 reference
  - `references/performance.md` — Core Web Vitals, image optimization, font loading, JS budget, animation performance
  - `references/islands-architecture.md` — Client directives (when to use `client:load` vs `client:visible`)
  - `references/styling-tailwind.md` — Tailwind v4 CSS optimization, `@theme` tokens
  - `references/configuration.md` — Build options, `inlineStylesheets`, adapters
- **`debugger` skill** — `performance-debug` pack for debugging performance regressions
- **`gpus-theme` skill** — GPUS design tokens (ensure all colors use semantic tokens)
