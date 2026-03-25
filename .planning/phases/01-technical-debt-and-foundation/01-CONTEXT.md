# Phase 1: Technical Debt & Foundation - Context

**Gathered:** 2026-03-25
**Status:** Ready for planning

<domain>
## Phase Boundary

Remove active debug instrumentation from 5 production files, validate and fix pre-existing font/404/favicon implementations, and add View Transitions (`<ClientRouter />`) to Layout.astro. This phase delivers a clean technical foundation — no CDN dependencies, no debug code in production, SPA-like navigation, consistent branding assets.

</domain>

<decisions>
## Implementation Decisions

### Pre-existing Items: Review Results

- **D-01:** TECH-02 (Fonts API) is COMPLETE. `astro.config.mjs` uses `fontProviders.google()` (self-hosted at build time) + `<Font cssVariable="..." />` in `Layout.astro`. No Google CDN `<link>` tag exists anywhere. Planner must include a verify-only task (run `bun run build` and confirm no external font requests).

- **D-02:** TECH-04 (404 page) is COMPLETE. `src/pages/404.astro` exists with Navy/Gold branding, Playfair Display "404" in gold, links to home and /contato. Planner must include a verify-only task (confirm page renders at `/404` route after build).

- **D-03:** TECH-05 (Favicon) needs a ONE-LINE fix. `public/favicon.svg` exists as a custom US monogram but uses color `#C9A96E` (lighter gold) instead of the brand token `#d4af37`. Fix: replace all `#C9A96E` occurrences in `public/favicon.svg` with `#d4af37`. Verify with `grep "#d4af37" public/favicon.svg` after fix.

### Debug Instrumentation Removal

- **D-04:** Remove ALL `// #region agent log` blocks from all 5 files. Each block contains a `void fetch("http://127.0.0.1:7777/ingest/...")` call. The removal is exact: delete the `// #region agent log` comment through `// #endregion`. Verify: `grep -r "127.0.0.1" src/ astro.config.mjs` returns empty.

  Files to clean:
  - `astro.config.mjs` (lines 16–36)
  - `src/lib/productsNav.ts` (lines 39–59)
  - `src/components/home/ProductsGrid.astro` (lines 18–38)
  - `src/components/ui/text-generate-effect.tsx` (lines 25–45)
  - `src/components/ui/lamp.tsx` (lines 8–32)

### View Transitions

- **D-05:** Add `<ClientRouter />` using Astro defaults only — no custom configuration. Implementation:
  ```ts
  import { ClientRouter } from 'astro:transitions';
  ```
  Place `<ClientRouter />` inside `<head>` in `src/layouts/Layout.astro`, after the `<Font />` tags. No `fallback` prop, no `transition:animate` directives, no element-level `transition:name` in Phase 1. Visual polish with transition:name and custom animations belongs in Phase 3.

- **D-06:** Note that IntersectionObserver for `data-reveal` animations currently has a comment "Re-run after Astro page transitions (if ever added)" — the planner must ensure the IntersectionObserver re-runs after view transitions. The existing listener in `Layout.astro` must hook into `document.addEventListener('astro:page-load', ...)` or equivalent Astro lifecycle event.

### Claude's Discretion

- Order of operations within the debug removal task: files can be cleaned in any order.
- Whether TECH-02/04 verify tasks are standalone plans or sub-tasks folded into Plan 1.3 — planner decides based on wave structure.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Rules
- `CLAUDE.md` — Stack rules, negative constraints (Bun only, no emoji icons, no hardcoded hex, etc.)
- `AGENTS.md` — Single source of truth for project rules (read first before any action)

### Files Being Modified
- `astro.config.mjs` — Debug block at lines 16–36; font config at lines 43–58
- `src/layouts/Layout.astro` — Head section where `<ClientRouter />` must be added; IntersectionObserver script that needs `astro:page-load` hook
- `src/lib/productsNav.ts` — Debug block at lines 39–59
- `src/components/home/ProductsGrid.astro` — Debug block at lines 18–38
- `src/components/ui/text-generate-effect.tsx` — Debug block at lines 25–45
- `src/components/ui/lamp.tsx` — Debug block at lines 8–32
- `public/favicon.svg` — Color fix: #C9A96E → #d4af37

### Requirements
- `.planning/REQUIREMENTS.md` — TECH-01 through TECH-05 acceptance criteria

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/layouts/Layout.astro` — All pages use this layout; one change to `<head>` propagates to all 11 pages automatically
- `public/favicon.svg` — Custom US monogram already exists; only color update needed

### Established Patterns
- Astro Fonts API with `fontProviders.google()`: fonts are downloaded at build time and self-hosted (no runtime CDN). This pattern is correct and complete.
- `data-reveal` IntersectionObserver: currently fires only on initial page load. After adding `<ClientRouter />`, must also fire on `astro:page-load` event for SPA-like navigations.
- Build gates: `bun run lint` → `bunx astro check` → `bun run build` must all pass after Phase 1 changes.

### Integration Points
- `<ClientRouter />` goes inside `<head>` in `Layout.astro` — affects all 11 pages automatically
- Debug blocks are self-contained fetch calls wrapped in `void` — can be deleted without touching surrounding code

</code_context>

<specifics>
## Specific Ideas

- Favicon color fix is a one-line change: replace `stroke="#C9A96E"` and `fill="#C9A96E"` with `#d4af37` in `public/favicon.svg`.
- The `astro:page-load` event is the correct Astro lifecycle hook for re-running IntersectionObserver after view transitions. The `astro:after-swap` event fires before the DOM is fully settled; `astro:page-load` fires when the new page is ready.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 01-technical-debt-and-foundation*
*Context gathered: 2026-03-25*
