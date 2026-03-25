# Testing Patterns

**Analysis Date:** 2026-03-25

## Testing Stack

**Unit Test Runner:** None. No unit test framework is installed or configured.

**Type Checking:**
- `@astrojs/check` — Astro-aware TypeScript type checker
- TypeScript strict mode (`astro/tsconfigs/strict`) via `tsconfig.json`

**Linting:**
- Biome `^2.4.9` — format + lint for `src/**` and `astro.config.mjs`
- oxlint `^1.57.0` — secondary JS/TS/JSX linter for `src/` (excludes `src/layouts/*`)

**Build Verification:**
- Astro build — static site generation catches template errors, prop type mismatches, and schema violations at build time

**External URL Checker:**
- `scripts/check-external-urls.mjs` — custom Node script to validate external product URLs are reachable

## Validation Gates

Three gates must all pass before any change is considered complete:

```bash
bun run lint          # Gate 1: Biome + oxlint
bunx astro check      # Gate 2: TypeScript + Astro type checking
bun run build         # Gate 3: Full static site build
```

**Gate 1 — Lint (`bun run lint`):**
```bash
bunx biome check src astro.config.mjs && bunx oxlint src --ignore-pattern 'src/layouts/*'
```
- Biome enforces: formatting (tabs, double quotes), recommended lint rules, import organization
- oxlint provides secondary JS/TS/JSX analysis; `src/layouts/*` is excluded from oxlint scope
- Biome overrides: `noUnusedImports` and `noUnusedVariables` are disabled for `.astro` files; `noImportantStyles` is disabled for `global.css`

**Gate 2 — Type Check (`bunx astro check`):**
- Validates TypeScript across all `.astro`, `.ts`, `.tsx` files
- Catches prop type mismatches between pages and landing components
- Validates Content Collection access patterns (`getCollection`, `CollectionEntry`)
- Catches missing required props on `Layout.astro` (title, description, breadcrumbs)

**Gate 3 — Build (`bun run build`):**
- Full Astro static site generation to `dist/`
- Validates all `getCollection()` calls resolve correctly
- Validates Zod schema constraints (min lengths, required fields, URL formats)
- Validates redirect configuration in `astro.config.mjs`
- Catches broken imports and missing files
- Sitemap generation validates route exclusions

**External URL Check (as-needed):**
```bash
bun run check:external-urls
```
- Run when changing `externalSiteUrl`, `cta.url`, or redirect destinations
- Validates that external product URLs (`na-mesa-certa`, `otb`) are reachable

**Full validation sequence for external product routing changes:**
```bash
bun run check:external-urls && bunx astro check && bun run build
```

## Pre-commit Hooks

**Tool:** Lefthook `^2.1.4`

**Config:** `lefthook.yml` at project root

**Hook:**
```yaml
pre-commit:
  commands:
    lint:
      run: bun run lint
      glob: "{src/**,astro.config.mjs}"
```

- Runs `bun run lint` (Biome + oxlint) on every commit
- Only triggers when files matching `{src/**,astro.config.mjs}` are staged
- Lefthook is installed via the `prepare` script: `lefthook install || true`
- The `|| true` prevents failures on Railway CI where `.git` is absent

## Quality Tools

### Biome (`biome.json`)

- **Schema:** `https://biomejs.dev/schemas/2.4.9/schema.json`
- **VCS integration:** enabled, uses `.gitignore` for file exclusions
- **Scope:** `src/**` and `astro.config.mjs`
- **Formatter:** tabs for indentation, double quotes for JS strings
- **Linter:** recommended rule set enabled
- **Import Organizer:** `source.organizeImports` set to `"on"` — runs automatically
- **CSS parser:** `tailwindDirectives: true` — understands `@theme`, `@utility`, etc.

**Key overrides in `biome.json`:**
- `.astro` files: `noUnusedImports` and `noUnusedVariables` both `"off"` (Astro frontmatter creates false positives)
- `global.css`: `noImportantStyles` set to `"off"` (Tailwind base/utilities require `!important` in some cases)

**Auto-fix command:**
```bash
bun run lint:fix
# runs: bunx biome check src astro.config.mjs --write && bunx oxlint src --ignore-pattern 'src/layouts/*' --fix --fix-suggestions
```

### oxlint

- **Scope:** `src/` directory
- **Exclusion:** `src/layouts/*` is excluded via `--ignore-pattern`
- No separate config file detected (`.oxlintrc` not present) — uses CLI defaults

### TypeScript

- **Base config:** `astro/tsconfigs/strict`
- **Path alias:** `@/*` → `src/*`
- **JSX:** `react-jsx` with `jsxImportSource: "react"` for React Island files
- **Includes:** `.astro/types.d.ts` + all project files
- **Excludes:** `dist/`

## Build Validation Process

The Astro build (`bun run build`) acts as the primary integration test by verifying:

1. **Content schema compliance** — All JSON in `src/content/products/` and `src/content/team/` is validated against Zod schemas in `src/content.config.ts`. Missing required fields or wrong types cause build failure.

2. **Template rendering** — Every `.astro` page is fully rendered. Missing component props, broken imports, or unresolved slugs surface as build errors.

3. **Redirect resolution** — `astro.config.mjs` redirect entries are validated against target URLs.

4. **Sitemap generation** — `@astrojs/sitemap` generates with filtered routes; config errors surface here.

5. **Output** — Build outputs to `dist/` (static HTML/CSS/JS). Served by Caddy on Railway.

## Manual Testing Notes

**No automated browser or E2E tests exist.** Manual validation is required for:

- Visual regression on viewport breakpoints: 375px, 768px, 1024px, 1440px
- All CTA link destinations (WhatsApp, external checkout, external product sites)
- Mobile sticky CTA bar visibility/behavior on all landing pages
- `prefers-reduced-motion` — verify Framer Motion animations are disabled
- Keyboard navigation through FAQ accordions and header mobile menu
- Skip link functionality (visible on focus, correct target `#conteudo-principal`)
- `noscript` fallback — content must be visible when JS is disabled (`[data-reveal]` elements)
- Lighthouse scores must meet hard gates: Performance ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95

**Pre-delivery checklist (from `AGENTS.md`):**
- [ ] Lighthouse Performance ≥ 95
- [ ] Lighthouse Accessibility ≥ 95
- [ ] Lighthouse SEO ≥ 95
- [ ] CLS = 0
- [ ] LCP < 2.5s
- [ ] Responsive at 375px, 768px, 1024px, 1440px
- [ ] No emojis as icons
- [ ] `prefers-reduced-motion` respected
- [ ] CTA links functional
- [ ] Data sourced from Content Collections (no hardcoding)
- [ ] Mobile sticky CTA bar present on all landing pages
- [ ] `bun run lint` clean
- [ ] `bunx astro check` clean
- [ ] `bun run build` clean

---

*Testing analysis: 2026-03-25*
