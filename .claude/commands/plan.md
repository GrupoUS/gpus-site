---
description: Repo-aware planning workflow for Grupo US. Audit first, research with real tools, and delegate only true UI design work to /design.
---

# /plan — Grupo US

**ARGUMENTS**: $ARGUMENTS

> Use this command to build implementation plans grounded in the current repo, not in stale assumptions.

## Project Contract

- Read `AGENTS.md` and `.claude/CLAUDE.md` first.
- If a `memory-bank/` exists, read the relevant files before planning. If it does not exist, continue with repo docs and note the gap instead of assuming `MEMORY.md`.
- Audit the current repo state before using historical prompts or past plans.
- Use only the tools and MCPs that actually exist in this environment.

## Route Before You Plan

Decide the lane first:

| Request shape | Route |
| --- | --- |
| Single-file fix, obvious bug, trivial CSS tweak | Skip `/plan`, implement directly |
| New page or substantial visual surface | Audit first, then hand the UI portion to `/design` |
| Copy, legal, SEO, metadata, content sync, redirects, external URL alignment | Stay in `/plan` |
| Hybrid task (data/config + UI) | Plan data/content/config here, then delegate the visual slice to `/design` |
| Substantial new feature (multi-file, multi-phase) | Use `/gsd:discuss-phase` first to capture decisions, then `/gsd:plan-phase` for a research-backed plan |

Do **not** send every frontend-adjacent task to `/design`. Many tasks in this repo are content integrity or routing work, not visual invention.

## Phase 0: Current-State Audit First

Before research or planning:

1. Inspect the existing implementation and modified worktree.
2. Identify whether the task is:
   - preserve and finish
   - refactor existing flow
   - add net-new work
3. Check the relevant validation status:
   - `bun run check:external-urls` when external products are involved
   - `bunx astro check`
   - `bun run build`
   - `bun run lint`
4. Record rule conflicts early:
   - Astro-first vs any historical React-heavy prompt
   - static-site rule vs SPA assumptions
   - current repo behavior vs older docs

If the repo already partially implements the requested feature, the plan must start from that real state.

## Phase 0.5: Socratic Gate (new features and non-trivial refactors)

**Skip if:** bug fix, copy change, redirect alignment, or single-file tweak.

Before researching or planning, surface hidden constraints by asking at least **3 strategic questions**:

1. **Scope** — What must this change *not* break? (journey order, CTA destinations, external routing, existing sections)
2. **Assumption** — What are you assuming about the user's intent that might be wrong?
3. **Constraint** — Are there performance, a11y, or conversion impacts from the chosen approach?

Add domain-specific questions when relevant:

| Task domain | Additional question |
| --- | --- |
| UI change | "Does this replace an existing section or add alongside it?" |
| Content change | "Is this copy already live on the canonical page, or proposed new?" |
| Architecture | "Are there other pages or components sharing this pattern that must change together?" |
| CTA / journey | "Which part of the conversion funnel does this affect?" |

Wait for answers before starting research. If the user says "just plan it", proceed with **explicit stated assumptions** instead of implicit ones.

## Phase 1: Research

> For substantial tasks (new feature spanning multiple files or days), capture implementation decisions first with `/gsd:discuss-phase [N]` before researching — this prevents late-stage pivots when assumptions surface too late.

Use the right research source for the question:

| Question type | Preferred source |
| --- | --- |
| Existing code patterns, files to edit, current conventions | `explorer` / direct repo reading |
| Framework or library behavior | `context7` / official docs / `librarian` |
| Live product facts, live LP copy, dates, locations, pricing | canonical live pages |
| Historical rationale or older scope | `docs/plans/aprimoramento/` |

### Source priority during research

1. Direct user instruction
2. Current approved repo state
3. Live canonical pages for factual product information
4. Historical docs and prompts

### Research rules

- Prefer background `explorer` and `librarian` agents for broader research.
- Keep research parallel only when domains are independent.
- If the question is narrow, use repo tools directly instead of launching agents.
- Explicitly call out knowledge gaps rather than filling them with guesses.

## Phase 2: Build the Plan

Convert findings into a runbook with:

- atomic tasks
- exact file paths
- dependencies between tasks
- validation commands
- risk notes when needed

### Required task shape

Use GSD XML format for each task:

```xml
<task type="auto">
  <name>Task name</name>
  <files>exact/file/path.ts, another/file.astro</files>
  <action>What to do and how — be specific enough to execute without reinterpretation</action>
  <verify>Command or check that proves the task is complete (e.g., bun run build passes)</verify>
  <done>Acceptance criterion — what done looks like</done>
</task>
```

**Wave grouping:** Group independent tasks into parallel waves. Tasks that depend on prior output form separate sequential waves. Label waves explicitly when dependencies exist:

```
WAVE 1 (parallel): task A + task B   # no dependencies
WAVE 2: task C                        # depends on WAVE 1 output
```

### Recommended workstream labels

Use these labels when helpful:

- `home`
- `about`
- `landing`
- `legal-seo-copy`
- `external-product-redirect`
- `shared-system`

### External product requirements

If the plan touches `na-mesa-certa` or `otb`, the plan must explicitly cover:

- `src/content/products/*.json`
- `astro.config.mjs` redirects
- sitemap behavior
- any shared navigation/grid logic
- `bun run check:external-urls`

### Journey and CTA requirements

If the plan touches home journey or product CTA logic, preserve these rules:

- canonical 5-stage journey:
  `curso-auriculo` -> `comunidade-us` -> `trintae3` -> `mentoria-black-neon` -> `otb`
- `neon-dash` and `na-mesa-certa` are complementary experiences
- page destination and `cta.url` are different concepts and may intentionally diverge

## Delegating to `/design`

Delegate only when the task truly needs UI design execution.

When delegating, pass:

- exact section or page scope
- current repo files involved
- content source of truth
- constraints from `AGENTS.md`
- any data/config work already completed in `/plan`

Examples that **should** delegate:

- new homepage section
- landing page redesign
- major visual overhaul

Examples that usually **should not** delegate:

- OG image/meta fixes
- favicon/logo path fixes
- legal page copy
- redirect alignment
- content collection updates

## Self-Review Before Presenting

Check the plan against these questions:

1. Did I start from the current repo state?
2. Did I avoid stale tool assumptions?
3. Did I route only genuine UI work to `/design`?
4. Are external product rules and validation gates included where needed?
5. Are the tasks specific enough to execute without reinterpretation?

If any answer is "no", revise the plan before presenting it.

## Anti-Patterns

Never do the following in `/plan`:

- Assume `MEMORY.md` exists when it does not
- Route every frontend-sounding request to `/design`
- Plan from historical prompts before auditing the current repo
- Depend on unavailable tooling like Stitch
- Ignore the static Astro rule and suggest SPA behavior by default
- Treat `cta.url` and navigational destination as the same thing without checking

## Output

The plan should end with:

- the ordered tasks
- dependencies or parallel blocks when relevant
- validation commands
- unresolved questions or knowledge gaps
- the handoff to `/design` only if one is genuinely needed
