# Codebase Concerns

**Analysis Date:** 2026-03-25

---

## Critical Issues

### Agent Debug Telemetry Left in Production Code — CRITICAL

Four source files contain active `fetch` calls to a localhost debug endpoint
(`http://127.0.0.1:7777/ingest/0a9ce74c-a29a-4996-bf5d-a24a8b2822f7`) inside
`// #region agent log` ... `// #endregion` blocks. These calls execute in
production and fail silently (`.catch(() => {})`), but they:
- Expose internal debug session IDs and UUIDs in source and built bundles
- Add unnecessary network calls on every page render/hydration
- Leak structural metadata (route resolution, DOM state) to any local listener
- Will generate browser console noise in some security policies

Files affected:
- `src/components/ui/text-generate-effect.tsx` (lines 26–44) — fires on every
  hero headline hydration
- `src/components/ui/lamp.tsx` (lines 8–31) — fires on every CTA section
  visibility
- `src/lib/productsNav.ts` (lines 39–58) — fires on every page load (called
  from `Layout.astro`)
- `src/components/home/ProductsGrid.astro` (lines 18–37) — fires at build-time
  AND runtime via Astro SSG inline
- `astro.config.mjs` (lines 16–36) — fires at build time during every `bun run
  build`

Fix: Remove all `// #region agent log` ... `// #endregion` blocks entirely.
No functionality depends on them; each block ends with `.catch(() => {})`.

---

### `prefers-reduced-motion` Not Implemented in React Islands — HIGH

AGENTS.md mandates wrapping all Framer Motion animations in `useReducedMotion()`
from `motion/react`. None of the four animated React islands implement this:
- `src/components/ui/lamp.tsx` — width and opacity animations via
  `whileInView`
- `src/components/ui/background-beams.tsx` — continuous path animation
- `src/components/ui/text-generate-effect.tsx` — staggered word fade
- `src/components/ui/aurora-background.tsx` — continuous CSS animation (no
  `useReducedMotion` hook, but the aurora animation is CSS-driven so a CSS
  media query approach is needed)

Impact: Users with vestibular disorders or motion sensitivity receive
unmitigated animations. Violates WCAG 2.1 SC 2.3.3 (AAA) and the explicit
project accessibility requirement.

---

### `lamp.tsx` Animates `width` — HIGH

`src/components/ui/lamp.tsx` uses four `motion.div` elements that animate the
`width` property (`initial: { width: "15rem" }` → `whileInView: { width:
"30rem" }`). AGENTS.md explicitly prohibits animating `width`, `height`,
`top`, or `left` because these trigger layout reflow. This directly violates
the performance gate (CLS = 0, INP < 100ms).

---

### Contact Form Non-Functional Without Env Var — HIGH

`src/pages/contato.astro` renders a text notice instead of a form when
`PUBLIC_FORMSPREE_ACTION` is not set. There is no `.env.example` file in the
repo to document required environment variables. In a Railway deployment without
this env var configured, the primary contact conversion path silently degrades
to a placeholder message.

Check: No `.env`, `.env.example`, or `README.md` documenting required env vars
exists in the repository root.

---

## Technical Debt

### Hardcoded Hex Colors in Tailwind Inline — MEDIUM

Two landing components use `bg-[#fafaf9]` in violation of the "NEVER hardcode
hex values" rule:
- `src/components/landing/NeonStory.astro:14`
- `src/components/landing/NeonBio.astro:14`

The value `#fafaf9` is `--color-text-primary` in `src/styles/global.css`. Fix:
replace with `bg-text-primary`.

### Hardcoded Hex in Aceternity UI Components — LOW

`src/components/ui/aurora-background.tsx` hardcodes Tailwind blue/indigo/violet
hex values as inline CSS custom properties. These are visual effects from the
original Aceternity UI library and do not conflict with project tokens, but they
are invisible to the design system and cannot be updated via `global.css`.

`src/components/ui/background-beams.tsx` (lines 116–132) hardcodes gold and
gray gradient stop hex values. The gold values (`#d4af37`, `#b8960c`,
`#e8c96a`) duplicate `--color-gold*` tokens and will diverge if tokens change.

`src/components/home/Hero.astro:10` passes `fill="#d4af37"` as a prop to
`<Spotlight>` instead of a CSS variable reference.

### `"use client"` Directives on All Aceternity UI Files — LOW

All six files in `src/components/ui/` have `"use client"` as the first line.
This directive is a Next.js/React Server Components convention and is a no-op
in Astro. It adds minor bundle annotation noise but causes no runtime error.
Can be removed during a cleanup pass.

### Dual Animation Library Dependency — LOW

`package.json` lists both `framer-motion` (`^12.38.0`) and `motion`
(`^12.38.0`) as separate dependencies. All actual imports in source use
`motion/react` (from the `motion` package). The `framer-motion` entry is unused
dead weight (~50–100KB). AGENTS.md references Framer Motion 11.x, but the
installed version is 12.x.

Verify: `grep -r "from 'framer-motion'" src/` returns no results.

Fix: Remove `framer-motion` from `package.json`; update AGENTS.md version table
to 12.x.

### AGENTS.md Team Count Stale — LOW

AGENTS.md states `team/ — 3 JSON files (Sacha, Mauricio, Raquel)` but the
actual content directory `src/content/team/` contains 13 JSON files (orders
1–13). The schema documentation is 10 members out of date.

### Product `image` Field Unused in Components — LOW

All 7 product JSON files define an `image` field and corresponding assets exist
in `public/images/products/`. The `image` field is declared `optional()` in
`src/content.config.ts` but no component in `src/components/landing/` reads
`product.data.image`. The landing page hero (`LandingHero.astro`) renders only
text and gradient backgrounds. This field is schema dead weight, or the image
display feature is unimplemented.

### Inline SVG Icon Paths Duplicated in ProductsGrid — LOW

`src/components/home/ProductsGrid.astro` maintains a local `iconPaths` record
(lines 41–57) with raw SVG path strings keyed by Lucide icon name. This
duplicates Lucide icon data and must be manually kept in sync when Lucide
updates paths. The rest of the codebase uses `lucide-react` components directly.

---

## Missing Features

### No `.env.example` Documentation — MEDIUM

`PUBLIC_FORMSPREE_ACTION` is the only known required environment variable and
there is no `.env.example` or environment documentation file. New contributors
or Railway deployments cannot discover required vars without reading
`src/pages/contato.astro` source.

### No OG Image Per Page — MEDIUM

`src/layouts/Layout.astro` defaults all pages to `/og-image.png`. Landing pages
for individual products (`/mentoria-black-neon`, `/curso-auriculo`) share the
same generic OG image. Per-product OG images would improve social share
previews significantly for conversion-oriented landing pages.

### Hero LCP Image Not Optimized — MEDIUM

The home Hero section (`src/components/home/Hero.astro`) renders text only —
there is no hero image subject to LCP scoring from image content. However,
`AuroraBackground` is hydrated with `client:load`, meaning React + animation
JS loads on the critical path. No `fetchpriority="high"` or `<link rel="preload">`
is present for any asset in `src/layouts/Layout.astro`. The LCP candidate is
likely the generated headline text.

### No Form Success/Error States — LOW

`src/pages/contato.astro` renders a basic HTML form posting to Formspree but
has no client-side feedback for submission success or error states. After
submitting, the user receives Formspree's default redirect unless Formspree is
configured with a custom return URL. No loading spinner or disabled submit
button is present.

---

## Performance Concerns

### AuroraBackground + TextGenerateEffect Both Load on Critical Path — HIGH

`src/components/home/Hero.astro` uses `client:load` on both `AuroraBackground`
and `TextGenerateEffect`. This means React and Framer Motion hydrate
synchronously on page load rather than being deferred. Combined, these islands
contribute to Time to Interactive before the hero content is interactive.
`client:visible` or `client:idle` would be more appropriate for visual-only
effects.

### Aurora Background `background-attachment: fixed` — MEDIUM

`src/components/ui/aurora-background.tsx` line 49 applies
`[background-attachment:fixed]` via an `after:` pseudo-element. This property
disables GPU compositing for that layer on many browsers (especially mobile
Safari) and forces a repaint on every scroll tick. This is the primary
background effect on the home page hero.

### `simplex-noise` Loaded for Unused WavyBackground — LOW

`simplex-noise` is listed as a production dependency and is imported by
`src/components/ui/wavy-background.tsx`. However, `WavyBackground` is never
imported or used in any `.astro` page or component. The package (~5KB min+gz)
is bundled unnecessarily.

Verify: `grep -r "WavyBackground\|wavy-background" src/ --include="*.astro"`
returns no results.

---

## Dependency Risks

### TypeScript 6.0.x (Pre-Release) — MEDIUM

`package.json` pins `"typescript": "^6.0.2"`. TypeScript 6 was in pre-release
/ beta as of the analysis date. The `^` semver range will auto-upgrade through
all 6.x breaking changes. Astro's `@astrojs/check@^0.9.8` may not support TS6
yet. Risk: a Bun lock update could pull a breaking TS6 minor and silently break
`bunx astro check`.

Mitigation: Pin to a specific tested version (`"typescript": "6.0.2"`) or
wait for TS6 stable and confirmed Astro support.

### Framer Motion 12.x vs AGENTS.md 11.x — LOW

AGENTS.md documents Framer Motion as version 11.x but `package.json` has
`"framer-motion": "^12.38.0"` and `"motion": "^12.38.0"`. The API is largely
compatible but agent instructions referencing 11.x-specific behavior could
cause confusion. Update AGENTS.md to reflect 12.x.

---

## Scalability Concerns

### Sitemap Filter Hardcodes Route Paths — LOW

`astro.config.mjs` lines 66–71 hardcode five redirect paths in the sitemap
filter (`/na-mesa-certa`, `/otb`, `/trintae3`, `/comunidade-us`, `/neon-dash`).
When a new external product is added, this list must be manually updated in
three places: `redirectTargets`, sitemap filter, and the product JSON
`externalSiteUrl`. There is no single source of truth that auto-excludes
external products from the sitemap.

### ProductsGrid Icon Registry Manual — LOW

`src/components/home/ProductsGrid.astro` maintains a local `iconPaths` Record
with 8 SVG path strings. Adding a new product with a Lucide icon not in this
registry results in a silently empty icon (falls back to `'' || ''`). The
failure is invisible — no warning, no fallback icon.

---

## Documentation Gaps

### AGENTS.md Stack Table Stale — MEDIUM

Multiple discrepancies between AGENTS.md documentation and the actual
installed packages:
- Framer Motion listed as 11.x, installed at 12.x
- Team collection listed as "3 JSON files", actual count is 13
- Architecture section lists `contact/` directory with comment "(if extracted)"
  suggesting it may or may not exist — it is absent from the filesystem

### No CHANGELOG or Migration Notes — LOW

No `CHANGELOG.md`, `HISTORY.md`, or annotated release notes exist. The
`AGENTS.md` "Learnings log" section has three entries but is append-only with no
structure for finding breaking changes. Future agents making major changes (e.g.,
Astro 7 upgrade, redirect refactor) have no documented history to reference.

---

## Opportunities

### Remove Agent Debug Telemetry (Quick Win) — CRITICAL priority
Delete the `// #region agent log` blocks from 5 files. Zero functional impact.
Reduces bundle size and eliminates production network calls. Estimated effort:
10 minutes.

### Remove Unused `framer-motion` Dependency (Quick Win) — LOW priority
Remove `"framer-motion"` from `package.json`. All imports use `motion/react`.
Saves ~50–100KB from the dependency tree. Run `bun install` after removal.
Estimated effort: 5 minutes.

### Remove Unused `WavyBackground` + `MovingBorder` Components (Quick Win)
`src/components/ui/wavy-background.tsx` and `src/components/ui/moving-border.tsx`
are never imported. Deleting them removes the `simplex-noise` dependency and
reduces the `src/components/ui/` surface area. Estimated effort: 10 minutes.

### Add `.env.example` File (Quick Win) — LOW priority
Create a root `.env.example` documenting `PUBLIC_FORMSPREE_ACTION`. Prevents
the silent contact form degradation for new deployments. Estimated effort:
5 minutes.

### Consolidate External Redirect Configuration (Medium Win)
Derive the sitemap filter and `redirectTargets` from a single source: the
product JSON files that have `externalSiteUrl` set. This would eliminate the
manual three-way sync and prevent future drift. Estimated effort: 1–2 hours.

### Add Per-Product OG Images (Medium Win)
Render product-specific OG images by passing `ogImage` prop from each landing
page. Assets partially exist in `public/images/products/`. Would improve social
sharing CTR for conversion pages. Estimated effort: 2–3 hours.

---

*Concerns audit: 2026-03-25*
