---
description: Repo-aware design workflow for Grupo US. Tiered plan-first gates (A.P.T.E inside D.R.P.I.V), Astro-first UI, skill routing, and validation with project gates.
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

## Methodology: D.R.P.I.V + A.P.T.E

Map reasoning onto the delivery phases:

| D.R.P.I.V phase | A.P.T.E step | Purpose in `/design` |
| --- | --- | --- |
| Discover | **Analyze** | Inspect target files, classify blast radius, pick workstream. |
| Research | **Research** | Reconcile SoT, facts (URLs, pricing, copy), patterns in repo. |
| Plan | **Think** + **Elaborate** | Choose approach, state non-goals, produce plan or `UI-SPEC`. |
| Implement | (execution) | Astro-first changes per repo rules. |
| Validate | (evidence) | CLI gates + browser/a11y checks below. |

**Fast path does not skip Discover:** even Tier A requires reading the target file(s) and parent layout; "fast" means no written mini-plan, not no audit.

## Scope tiers (gates)

Classify the task **after** Phase 0 audit:

| Tier | When | Plan artifact | `/gsd:ui-phase` |
| --- | --- | --- | --- |
| **A** | Single obvious fix, one component or style tweak, no journey/tokens/global layout change | None beyond mental checklist | Not required |
| **B** | Multiple files, new section variant, typography/spacing system touch, or any CTA/journey/copy change | Short mini-plan: goal, files, approach, assumptions, non-goals | Optional; use if layout/interaction is ambiguous |
| **C** | New page, major redesign, or new reusable visual system across pages | Written plan + **`UI-SPEC.md`** via `/gsd:ui-phase` before code | **Required** before implementation |

**Tier B mini-plan (before code):** one paragraph goal, bullet list of files, chosen approach + one alternative rejected briefly, explicit assumptions, what you will **not** change.

**Tier C:** Do not implement until `UI-SPEC.md` exists and user has approved direction if they asked for review.

## Skill and context routing (order)

Load in this order unless the task is pure copy with zero layout (then `grupo-us` + content JSON may come first):

1. **`astro`** — Content Collections, `.astro` patterns, islands policy, images, Tailwind v4 in this repo.
2. **`gpus-theme`** — Tokens, `glass-card`, navy/gold; **repo wins** over portable theme docs (this site is dark-only, MPA).
3. **`.claude/rules/frontend.md`** and **`.claude/rules/a11y.md`** — Hard gates for components and layout.
4. **`grupo-us`** — When changing or validating copy, CTAs, product messaging, journey order, or `src/content/products/*.json`.
5. **`ui-ux-pro-max`** — Only for meaningful visual/UX invention (new layout language, ambiguous hierarchy). Treat as **heuristic library**; follow the skill’s **Grupo US Astro** override block so stack advice matches this repo (not mobile/RN defaults).
6. **GSD UI** — `/gsd:ui-phase` / `gsd-ui-phase` skill for Tier C; `gsd-ui-review` after large passes if useful.

**Do not** lean on `ui-ux-pro-max` for every small tweak.

## Available Tooling

- **Primary skills:** `astro`, `gpus-theme` (plus path rules above).
- **Conditional:** `grupo-us` (copy/journey/CTA/content), `ui-ux-pro-max` (substantial new surfaces or unclear visual direction).
- **UI design contract:** `/gsd:ui-phase` — `UI-SPEC.md` for Tier C (and optional for Tier B when unclear).
- **UI verification:** browser MCP (check `AGENTS.md` for the correct `serverIdentifier`).
- **Do not depend on:** Stitch MCP, hardcoded prototype workflows, or fixed "3 islands" rules.

## Source-of-Truth Order

Use this order whenever content or routing conflicts appear:

1. Current approved repo state
2. Direct user instruction
3. Live canonical pages for factual product data (`drasacha.com.br`, `namesa.gpus.com.br`, `otb.gpus.com.br`)
4. Historical docs in `docs/plans/aprimoramento/`

Notes:

- For factual conflicts like location, dates, pricing, and product destination URLs, prefer the live canonical page over historical docs unless the user says otherwise.
- For implementation strategy, prefer the repo rules over older prompts.
- If a fact cannot be verified, state **Knowledge gap** and do not invent.

## Mandatory Phase 0: Current-State Audit First

Before changing anything:

1. Inspect the files that already implement the target surface (trace page → components → content JSON when relevant).
2. Check whether the work is:
   - new UI
   - refinement of an existing section
   - copy/legal/SEO
   - external product redirect-only
3. Confirm whether related checks already fail (`bun run check:external-urls`, `bunx astro check`, `bun run build`, `bun run lint`).
4. Identify existing patterns to preserve before inventing new ones.
5. **Assign Tier A / B / C** and satisfy that tier’s plan gate before coding.
6. **Tier C:** run `/gsd:ui-phase` first to generate `UI-SPEC.md` (layout, interactions, empty states, tokens) before writing implementation code.

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

If the task is mainly `legal-seo-copy` or `external-product-redirect`, do **not** force a heavyweight visual design process (Tier A/B only unless user asks for redesign).

## Implementation Rules

### 1. Load the right context

Follow **Skill and context routing (order)** above.

### 2. Preserve structural guards from the repo

- Home order must stay coherent with the current conversion flow.
- Product landing pages must respect the established section order in `AGENTS.md`.
- Legal links must point to real routes.
- `skip-link` and no-JS reveal fallback must remain intact.
- FAQ behavior must stay accessible and avoid height tween anti-patterns.
- Content and schema: prefer `getCollection()` / JSON in `src/content/`; no hardcoded product copy in components; hero images need explicit dimensions per `AGENTS.md`.

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

- **Tier A / small scoped change:** implement after Phase 0; no subagent required.
- **Tier B / multi-file or ambiguous UX:** optional `frontend-specialist` or short plan-only pass first.
- **Tier C / large surface:** `frontend-specialist` or GSD UI workflow as appropriate after `UI-SPEC`.
- **Accessibility or behavior review:** add `debugger` skill/agent.
- **Performance or Lighthouse-sensitive work:** add `performance-optimizer` skill/agent.
- **Visible UI verification:** browser MCP after changes.

**MCP:** Before any MCP tool call, read the tool schema under `AGENTS.md` paths and use the correct `serverIdentifier` (e.g. browser MCP for screenshots).

Prefer background subagents only when the task is large enough to benefit from them.

## Validation Gates

Run the gates that match the change:

### Always for substantive code changes

- `bunx astro check`
- `bun run build`
- `bun run lint`

### Additionally when external products are touched

- `bun run check:external-urls`

### Additionally when visible UI changes are touched (acceptance minimum)

- **Routes:** every affected route loaded (or redirect behavior verified if redirect-only).
- **Viewports:** at least **375px** and **1280px** (add **1024px** if layout has desktop breakpoints).
- **Keyboard:** tab through primary navigation, first CTA, and any new interactive control; focus visible (gold outline per `global.css`).
- **Motion:** if CSS reveal, Framer, or infinite animations changed — verify `prefers-reduced-motion` behavior (or `useReducedMotion()` on islands).
- **Browser:** screenshot or live check on affected pages; spot-check heading order (`h1` once, logical `h2`/`h3`).
- **Content/images:** meaningful `alt` on changed images; no new arbitrary hex — use tokens from `@theme` / approved utilities.

For marketing-critical pages, align with `AGENTS.md` performance/a11y targets (Lighthouse, LCP, CLS) or note explicit waiver with the user.

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
- Skip Tier B mini-plan or Tier C `UI-SPEC` when the tier applies
- Implement from generic skill advice when it conflicts with `AGENTS.md` (MPA, islands, tokens)

## Definition of Done

A `/design` task is done only when:

- The implementation follows the repo's Astro-first rules
- The chosen source of truth is explicit and consistent
- The scope tier and its plan gate were satisfied (A/B/C)
- Any external product routing stays aligned
- Required validation commands pass
- Visible UI changes meet the **acceptance minimum** in Validation Gates
- **Tier B/C visual changes: Maestro Auditor check passed:**
  - **Template Test** — "Can I find this exact layout in a Tailwind UI/generic template?" If yes, push harder for distinctiveness before shipping.
  - **Memory Test** — "Will the user remember one specific visual element 24 hours later?" If nothing stands out, the design is forgettable.
  - **Differentiation Test** — "Does this feel like Grupo US / Dra. Sacha, or like any health/education SaaS template?" Generic = reject.

> `MAESTRO RULE: "If I can find this layout in a Tailwind UI template, I have failed."`
