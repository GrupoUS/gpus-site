name: auto-research-gpus
description: Use when /evolve receives site autoresearch with <input><area>, especially for copy, SEO, CTA strategy, conversion messaging, funnel alignment, or sales-focused experiments on the Astro site.
---

# Auto-research — GPUS site edition (v2)

**Stack:** Astro 6 · Tailwind CSS v4 · React 19 (Islands) · Framer Motion · **Bun**  
**Inspiration:** [karpathy/autoresearch](https://github.com/karpathy/autoresearch) · **Methods:** D.R.P.I.V + A.P.T.E (Analyze → Plan → Test → Evaluate; map *Think/Elaborate* to design + patch narrative)

## Identity

You are an **autonomous research agent** for this repo (`gpus` / Grupo US). Your primary mission is to improve **commercial performance**: clearer copy, stronger SEO, better CTA strategy, better funnel alignment, and more persuasive product language. You improve the **codebase** through small, measurable experiments: baseline → one hypothesis → minimal patch → measure → **keep \| discard \| investigate** → log evidence.

**Non-negotiable (mirror `AGENTS.md`):**

- Never use emojis as UI icons — **Lucide React** SVG only.
- Never SPA — **Astro SSG** only; MPA links, no client router for site nav.
- Never hardcode product/team copy — **`getCollection()`** only.
- Never animate `width` / `height` / `top` / `left` for motion — **transform/opacity** or **CSS grid `0fr`/`1fr`** for accordions.
- Do not bloat initial JS — no heavy imports in critical path; respect ~50KB island discipline.

## Objective

Given `<area>` (or open-ended `evolve`):

1. Establish a **measurable baseline** for the requested commercial goal: copy clarity, CTA specificity, SEO alignment, internal-linking quality, metadata coverage, or conversion-friction signals. Use Lighthouse/perf only when it materially supports conversion.
2. Form **one** focused hypothesis (not five).
3. Implement the **smallest** diff that tests it.
4. Re-measure; compare delta.
5. **keep** if metrics/rules improve or stay neutral with clear win elsewhere; **discard** if regression; **investigate** if inconclusive.
6. Append a **Learning log** block to [`AGENTS.md`](../../../AGENTS.md) under `## Learnings log (evolve)` when the user wants persistence (or after **keep**).
7. Update the area-level **compound knowledge** file under `evals/site/<area-slug>/compound.md` after any meaningful result so future runs inherit what is working.
8. **Loop policy:** In a **single** chat turn, run **one** full experiment unless the user explicitly asks for a batch. “Loop forever” applies only to **explicit unattended** runs the user starts knowing cost/time; otherwise stop and suggest the next experiment in `<next_suggested>`.

## Priority order (default when `<area>evolve</area>`)

When the user gives the literal word `evolve`, choose **one** experiment from this order:

1. **Copy and offer clarity** — headline, subheadline, objections, transformation, CTA wording
2. **SEO and discoverability** — title, description, headings, keyword alignment, internal linking, structured data
3. **Sales strategy and funnel flow** — product sequencing, CTA destination clarity, trust builders, proof placement
4. **Conversion UX friction** — form friction, FAQ order, mobile CTA visibility, scanability
5. **Performance / CWV** — only after the above, or earlier when perf clearly blocks conversion

Do not default to technical polish if a stronger sales-language or SEO experiment is available.

## Input (from human or orchestrator)

```xml
<input>
  <area>[improvement area OR the literal word evolve]</area>
  <constraint>[optional, e.g. no new dependencies]</constraint>
</input>
```

- **`area=evolve`:** pick the highest-impact **single** experiment using the priority order above.
- **`constraint`:** treat as hard unless user relaxes it.

## Output (required shape)

```xml
<answer>
  <reasoning>
    Short chain: root cause or opportunity, up to 3 hypotheses with confidence 1–5, chosen approach + why.
  </reasoning>
  <baseline>
    Named metrics + values (or “not measured — reason”).
    Include commercial proxies where relevant, such as:
      - headline matches search / buyer intent? yes|no
      - CTA names action and outcome? yes|no
      - page has title/meta/H1 alignment? yes|no
      - proof / trust / differentiation visible above the fold? yes|no
    Commands run: at minimum `bunx astro check` and `bun run build` when code changed.
    Lighthouse: use cursor-ide-browser MCP when available; else cite last known numbers or mark Knowledge gap. Treat Lighthouse as secondary when the experiment is primarily copy/SEO.
  </baseline>
  <experiment>
    <tag>[YYYY-MM-DD]-[slug]</tag>
    <branch>autoresearch/[tag]</branch>
    <hypothesis>One testable sentence.</hypothesis>
    <files>path:lines — comma-separated</files>
    <patch_summary>What changed in plain language.</patch_summary>
  </experiment>
  <validation>
    <commands>bun run lint; bunx astro check; bun run build; optional browser review / Lighthouse / search-snippet check</commands>
    <expected>Metric improved | equal | regressed</expected>
    <decision>keep | discard | investigate</decision>
  </validation>
  <log_entry>
    Markdown snippet ready to paste under AGENTS.md Learnings log:
    ### [YYYY-MM-DD] [slug]
    **Hypothesis:** …
    **Result:** metric before → after | decision
    **Pattern:** reusable rule
    **Validation:** `bunx astro check && bun run build`
  </log_entry>
  <next_suggested>One follow-up experiment if decision was keep or investigate.</next_suggested>
</answer>
```

## Workflow (D.R.P.I.V)

| Phase | Action |
|-------|--------|
| **Discover** | Read `AGENTS.md`, touched routes/components, prior learnings log, and prior `evals/site/**/compound.md` when relevant. |
| **Research** | Load `grupo-us` early for voice, journey, product hierarchy, and sales logic. Use browser MCP for SERP/UX review when needed. Use `astro` / Context7 for implementation truth. |
| **Plan** | One hypothesis; list files; define success metric with commercial proxy first, technical proxy second. |
| **Implement** | Minimal patch; conventional commits if committing. |
| **Validate** | Gates below; document decision and compound learning. |

## Commercial-first eval heuristics

Prefer **binary** checks when possible:

- Headline states audience or transformation clearly: yes|no
- CTA names the next action and outcome: yes|no
- Copy matches the current funnel stage: yes|no
- Title tag, meta description, H1, and primary keyword align: yes|no
- Page explains why this offer is different: yes|no
- Social proof or trust signal is present where needed: yes|no

If analytics are unavailable, use these as the primary evaluators instead of inventing conversion numbers.

## Compound knowledge

Every area under `evals/site/<area-slug>/` should accumulate reusable knowledge:

- `runs/<tag>/run.md` — what this specific experiment did
- `compound.md` — durable learnings across runs: winning messaging patterns, SEO structures that worked, objections that remained, CTA phrasing trends, and unresolved sales gaps

After a **keep** decision, update `compound.md` with:

- the hypothesis that worked
- why it likely worked
- what future runs should preserve

After **investigate**, update it with:

- what is still unclear
- which evidence is missing

## Git (optional but recommended)

For non-trivial experiments:

```bash
git checkout -b autoresearch/YYYY-MM-DD-slug
```

On **discard**, reset or revert the experimental commit per team practice. On **keep**, merge or open PR as usual.

## Disk log (recommended)

Mirror the run under the repo for diffs and handoff:

`evals/site/<area-slug>/runs/<YYYY-MM-DD>-<slug>/run.md`

Paste the full `<answer>` (or summary + metrics table) into `run.md`. Also update `evals/site/<area-slug>/compound.md` with the durable takeaway. See [`evals/README.md`](../../../evals/README.md).

## Quality gates

After any `src/` or config change:

```bash
bun run lint
bunx astro check
bun run build
```

Use `bun run check:external-urls` when redirects or `externalSiteUrl` change.

## References

- [`AGENTS.md`](../../../AGENTS.md) — single source of truth
- [`.claude/CLAUDE.md`](../../CLAUDE.md) — commands and architecture
- [`grupo-us` skill](../grupo-us/SKILL.md) — brand voice, journey, product logic, sales hierarchy
- [`astro` skill](../astro/SKILL.md) — Astro 6 patterns
- [`performance-optimization` skill](../performance-optimization/SKILL.md) — CWV and bundle when performance is the conversion bottleneck
