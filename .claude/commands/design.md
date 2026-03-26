---
description: Repo-aware design workflow for Grupo US. Audit current state first, reconcile content sources, implement Astro-first UI with available tools, and validate with the real project gates.
---

# /design — Grupo US

**ARGUMENTS**: $ARGUMENTS

> Use this command for real UI work in this Astro repo. Start from the current codebase, not from historical prompts.

## Project Contract

- Read `AGENTS.md` and `.claude/CLAUDE.md` before doing anything else.
- Audit the current repo state before proposing or implementing UI changes.
- This site is static Astro. Do **not** introduce SPA behavior or `ClientRouter` unless the user explicitly overrides the repo rules.
- Prefer `.astro` components. Use React islands only when the interaction truly requires client JS, and pair motion with `useReducedMotion()` when React/Framer is used.
- Use the real project tokens and fonts already configured in the repo: GPUS navy/gold, Playfair Display, Inter, Lucide icons.
- Validate every change with runtime evidence. A design task is not done until the relevant checks pass.

## Available Tooling

- **Primary skills:** `astro`, `gpus-theme`
- **Optional design support:** `ui-ux-pro-max` for substantial new surfaces or when visual direction is unclear
- **UI design contract:** `/gsd:ui-phase` — generates `UI-SPEC.md` with layout, interactions, and empty states before implementation. Use for new pages or major visual redesigns.
- **UI verification:** browser MCP (check AGENTS.md for the correct `serverIdentifier`) for screenshots and spot checks
- **Do not depend on:** Stitch MCP, hardcoded prototype workflows, or fixed "3 islands" rules

## Source-of-Truth Order

Use this order whenever content or routing conflicts appear:

1. Current approved repo state
2. Direct user instruction
3. Live canonical pages for factual product data (`drasacha.com.br`, `namesa.gpus.com.br`, `otb.gpus.com.br`)
4. Historical docs in `docs/plans/aprimoramento/`

Notes:

- For factual conflicts like location, dates, pricing, and product destination URLs, prefer the live canonical page over historical docs unless the user says otherwise.
- For implementation strategy, prefer the repo rules over older prompts.

## Mandatory Phase 0: Current-State Audit First

Before changing anything:

1. Inspect the files that already implement the target surface.
2. Check whether the work is:
   - new UI
   - refinement of an existing section
   - copy/legal/SEO
   - external product redirect-only
3. Confirm whether related checks already fail (`bun run check:external-urls`, `bunx astro check`, `bun run build`, `bun run lint`).
4. Identify existing patterns to preserve before inventing new ones.
5. **If this is a new page or major visual redesign**, run `/gsd:ui-phase` first to generate a `UI-SPEC.md` design contract (layout, interactions, empty states, tokens) before writing any code.

If the repo already contains the feature in partial form, treat the task as **preserve and finish**, not "start from zero."

## Workstream Routing

Choose the branch that matches the task:

| Workstream | Typical Scope | Default Approach |
| --- | --- | --- |
| `home` | Hero, product grid, journey, stats, CTA, testimonials | Astro-first, preserve section order |
| `about` | Mission, values, team, credibility | Astro-first, content-driven |
| `landing` | Product landing sections | Reuse `src/components/landing/*` patterns |
| `legal-seo-copy` | metadata, legal pages, copy alignment, OG, favicon | Usually no heavy design loop needed |
| `external-product-redirect` | `externalSiteUrl`, redirects, sitemap, nav/grid consistency | Treat as routing/content integrity work first |

If the task is mainly `legal-seo-copy` or `external-product-redirect`, do **not** force a heavyweight visual design process.

## Implementation Rules

### 1. Load the right context

- Read `astro` skill first for Astro patterns.
- Read `gpus-theme` skill when changing visual styling, tokens, utilities, or branding surfaces.
- Use `ui-ux-pro-max` only when the task is a meaningful UI invention problem, not for every small tweak.

### 2. Preserve structural guards from the repo

- Home order must stay coherent with the current conversion flow.
- Product landing pages must respect the established section order in `AGENTS.md`.
- Legal links must point to real routes.
- `skip-link` and no-JS reveal fallback must remain intact.
- FAQ behavior must stay accessible and avoid height tween anti-patterns.

### 3. External product guardrails

When touching `na-mesa-certa` or `otb`:

- Keep `externalSiteUrl`, `cta.url`, `astro.config.mjs` redirects, and sitemap filtering aligned.
- Avoid hardcoded external URLs outside the approved pattern.
- Run `bun run check:external-urls` before considering the task complete.

### 4. Journey and CTA guardrails

- The home journey must follow the canonical 5-stage order:
  `curso-auriculo` -> `comunidade-us` -> `trintae3` -> `mentoria-black-neon` -> `otb`
- `neon-dash` and `na-mesa-certa` are complementary experiences, not part of that 5-stage sequence.
- Distinguish page destination from CTA destination:
  - navigation/info link: `externalSiteUrl ?? /slug`
  - conversion link: `cta.url`
- Do not "normalize" heterogeneous CTA destinations unless the user explicitly asks for that product strategy change.

## Agent / Tool Routing

Use the lightest workflow that fits:

- **Small tweak / single file / obvious fix:** implement directly
- **New or substantially redesigned surface:** use `frontend-specialist`
- **Accessibility or behavior review:** add `debugger`
- **Performance or Lighthouse-sensitive work:** add `performance-optimizer`
- **Browser verification after visible UI changes:** use browser tooling

Prefer background subagents only when the task is large enough to benefit from them.

## Validation Gates

Run the gates that match the change:

### Always for substantive code changes

- `bunx astro check`
- `bun run build`
- `bun run lint`

### Additionally when external products are touched

- `bun run check:external-urls`

### Additionally when visible UI changes are touched

- Browser review or screenshot-based validation on the affected pages
- Quick responsive sanity check at mobile and desktop widths
- Reduced-motion sanity check when motion changed

## Anti-Patterns

Never do the following in this repo:

- Depend on Stitch MCP or any unavailable design tool
- Assume the task needs a prototype before reading the existing code
- Hardcode `Na Mesa Certa` or any single product as the default design context
- Hardcode "only 3 React islands"
- Introduce `ClientRouter` or SPA behavior by default
- Replace data-driven URLs with manual links in components
- Skip `bun run check:external-urls` when changing external product flows
- Ignore dirty worktree context and overwrite unrelated existing changes

## Definition of Done

A `/design` task is done only when:

- The implementation follows the repo's Astro-first rules
- The chosen source of truth is explicit and consistent
- Any external product routing stays aligned
- Required validation commands pass
- Visible UI changes were reviewed in the browser
