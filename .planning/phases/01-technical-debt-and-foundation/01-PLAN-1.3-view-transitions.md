---
phase: 01-technical-debt-and-foundation
plan: "1.3"
type: execute
wave: 1
depends_on: []
files_modified:
  - src/layouts/Layout.astro
autonomous: true
requirements:
  - TECH-03

must_haves:
  truths:
    - "Navigating between pages triggers a View Transition animation (no full page flash)"
    - "The data-reveal IntersectionObserver re-runs after each View Transition navigation"
    - "All 11 pages benefit from View Transitions automatically via the shared Layout"
    - "bun run lint, bunx astro check, and bun run build all pass"
  artifacts:
    - path: "src/layouts/Layout.astro"
      provides: "Layout with ClientRouter and updated IntersectionObserver"
      contains: "ClientRouter"
      exports: ["ClientRouter import from astro:transitions", "astro:page-load event listener"]
  key_links:
    - from: "src/layouts/Layout.astro <head>"
      to: "Astro View Transitions runtime"
      via: "<ClientRouter /> component"
      pattern: "grep 'ClientRouter' src/layouts/Layout.astro"
    - from: "IntersectionObserver initReveal()"
      to: "data-reveal elements on navigated pages"
      via: "document.addEventListener('astro:page-load', initReveal)"
      pattern: "grep 'astro:page-load' src/layouts/Layout.astro"
---

<objective>
Add Astro View Transitions (`<ClientRouter />`) to Layout.astro and update the IntersectionObserver to re-run after each View Transition navigation.

Purpose: TECH-03 requires SPA-like page transitions. A single change to `Layout.astro` propagates View Transitions to all 11 pages. The existing IntersectionObserver for `data-reveal` animations only fires on initial load — after adding `<ClientRouter />`, it must also fire on `astro:page-load` so scroll-reveal animations work on navigated pages.
Output: Layout.astro with `<ClientRouter />` in `<head>` and IntersectionObserver correctly hooked into `astro:page-load`.
</objective>

<execution_context>
@/home/mauricio/gpus/.claude/get-shit-done/workflows/execute-plan.md
@/home/mauricio/gpus/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/01-technical-debt-and-foundation/01-CONTEXT.md
</context>

<interfaces>
<!-- Key code in Layout.astro that this task modifies. Extracted from current codebase. -->

Current head section (lines 60–126):
```astro
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="icon" href="/favicon.ico" sizes="32x32" />
  <meta name="generator" content={Astro.generator} />

  <!-- SEO ... -->

  <!-- Fonts (Astro 6 Fonts API) -->
  <Font cssVariable="--font-playfair" />
  <Font cssVariable="--font-inter" />

  <!-- JSON-LD ... -->

  <!-- noscript ... -->
</head>
```

Current IntersectionObserver script (lines 143–173):
```astro
<script>
  function initReveal() {
    const elements = document.querySelectorAll("[data-reveal]");
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px",
      },
    );

    for (const el of elements) {
      observer.observe(el);
    }
  }

  // Run on initial load
  initReveal();

  // Re-run after Astro page transitions (if ever added)
  document.addEventListener("astro:after-swap", initReveal);
</script>
```

Note: The comment says "if ever added" and uses `astro:after-swap`. After adding `<ClientRouter />`, this MUST be changed to `astro:page-load`.
</interfaces>

<tasks>

<task type="auto">
  <name>Task 1: Add ClientRouter to Layout.astro head (per D-05)</name>
  <files>src/layouts/Layout.astro</files>
  <read_first>
    - src/layouts/Layout.astro — Read the full file before editing. Pay attention to:
      - Line 2: existing imports in the frontmatter (Font is imported from "astro:assets")
      - Lines 88–90: the two Font components in `<head>` — ClientRouter goes immediately after them
      - The existing `astro:after-swap` listener in the script block (will be fixed in Task 2)
  </read_first>
  <action>
    Make exactly two edits to `src/layouts/Layout.astro`:

    **Edit 1 — Add import in frontmatter (top of file, inside `---` block):**

    The current frontmatter starts with:
    ```
    ---
    import { Font } from "astro:assets";
    import { getCollection } from "astro:content";
    ```

    Add `ClientRouter` import after the existing imports. Add this line:
    ```
    import { ClientRouter } from "astro:transitions";
    ```

    Place it after the last import in the frontmatter block. The frontmatter imports section should become:
    ```
    import { Font } from "astro:assets";
    import { getCollection } from "astro:content";
    import Footer from "../components/layout/Footer.astro";
    import Header from "../components/layout/Header.astro";
    import { productNavLinksFromCollection } from "../lib/productsNav";
    import "../styles/global.css";
    import { ClientRouter } from "astro:transitions";
    ```

    **Edit 2 — Place `<ClientRouter />` inside `<head>`, after the Font components:**

    Find this block in the `<head>`:
    ```astro
    <!-- Fonts (Astro 6 Fonts API) -->
    <Font cssVariable="--font-playfair" />
    <Font cssVariable="--font-inter" />
    ```

    Add `<ClientRouter />` immediately after the two Font components and the blank line. The result:
    ```astro
    <!-- Fonts (Astro 6 Fonts API) -->
    <Font cssVariable="--font-playfair" />
    <Font cssVariable="--font-inter" />
    <ClientRouter />
    ```

    No `fallback` prop. No other attributes. No `transition:animate` or `transition:name` directives anywhere in the file. This is Astro's default View Transitions — minimal, no custom configuration.

    Do NOT move or change the noscript block, JSON-LD scripts, meta tags, or any other part of the head.
  </action>
  <verify>
    <automated>grep -n "ClientRouter" /home/mauricio/gpus/src/layouts/Layout.astro</automated>
  </verify>
  <acceptance_criteria>
    - `grep "ClientRouter" src/layouts/Layout.astro` returns exactly 2 matches:
      one for the import (`import { ClientRouter } from "astro:transitions"`)
      and one for the component usage (`<ClientRouter />`)
    - `grep 'from "astro:transitions"' src/layouts/Layout.astro` returns exactly 1 match
    - `grep "fallback" src/layouts/Layout.astro` returns no output (no fallback prop added)
    - `grep "transition:animate" src/layouts/Layout.astro` returns no output
    - The `<Font cssVariable="--font-playfair" />` and `<Font cssVariable="--font-inter" />` lines still exist (not deleted)
  </acceptance_criteria>
  <done>ClientRouter imported from astro:transitions and placed inside &lt;head&gt; after the Font components. No custom props or transition directives added. TECH-03 implementation complete.</done>
</task>

<task type="auto">
  <name>Task 2: Fix IntersectionObserver to use astro:page-load (per D-06)</name>
  <files>src/layouts/Layout.astro</files>
  <read_first>
    - src/layouts/Layout.astro — Read the script block at the bottom of the body (after Task 1 edits). The current listener uses `astro:after-swap` which fires before DOM is settled. It must be changed to `astro:page-load`.
  </read_first>
  <action>
    In the `<script>` block at the bottom of `Layout.astro`, make exactly two changes:

    **Change 1 — Replace the event listener from `astro:after-swap` to `astro:page-load`:**

    Find this line:
    ```js
    document.addEventListener("astro:after-swap", initReveal);
    ```

    Replace it with:
    ```js
    document.addEventListener("astro:page-load", initReveal);
    ```

    **Change 2 — Update the comment above it to reflect the new reality:**

    Find this comment:
    ```js
    // Re-run after Astro page transitions (if ever added)
    ```

    Replace it with:
    ```js
    // Re-run after each View Transition navigation (astro:page-load fires when DOM is ready)
    ```

    The `initReveal` function body itself must NOT be changed. The `// Run on initial load` comment and `initReveal();` call must also remain unchanged.

    Reason for `astro:page-load` over `astro:after-swap`: `astro:after-swap` fires immediately after the DOM is swapped but before scripts run and before the page is fully settled — querying `[data-reveal]` at that point may miss elements. `astro:page-load` fires after the new page is fully loaded and ready, equivalent to `DOMContentLoaded` for the incoming page. This is the correct lifecycle hook for re-initializing observers.
  </action>
  <verify>
    <automated>grep -n "astro:page-load\|astro:after-swap" /home/mauricio/gpus/src/layouts/Layout.astro</automated>
  </verify>
  <acceptance_criteria>
    - `grep "astro:page-load" src/layouts/Layout.astro` returns exactly 1 match (the event listener)
    - `grep "astro:after-swap" src/layouts/Layout.astro` returns no output (old listener removed)
    - `grep "initReveal" src/layouts/Layout.astro` returns at least 3 matches:
      the function declaration (`function initReveal()`),
      the initial call (`initReveal();`),
      and the page-load listener
    - `grep "function initReveal" src/layouts/Layout.astro` returns exactly 1 match (function unchanged)
  </acceptance_criteria>
  <done>IntersectionObserver now re-runs on astro:page-load. data-reveal animations will work correctly after View Transition navigations. astro:after-swap listener fully replaced.</done>
</task>

<task type="auto">
  <name>Task 3: Run build gates</name>
  <files></files>
  <read_first>
    No files to read — this task runs build commands only.
  </read_first>
  <action>
    Run the following commands in order. Each must succeed (exit code 0) before proceeding to the next.

    1. `bun run lint` — Biome format + lint + oxlint on `src/**`. Must pass with 0 errors.
    2. `bunx astro check` — TypeScript type checking including Astro components. Must pass with 0 type errors. The `ClientRouter` import from `astro:transitions` is a built-in Astro module — no package install needed.
    3. `bun run build` — Full static site build. Must produce `dist/` with 0 errors.

    If `bunx astro check` reports an error about `astro:transitions` not found, confirm that `astro` version >= 3.0 is installed (Astro 6 is confirmed in the stack). The `astro:transitions` virtual module is built into Astro and requires no additional dependencies.

    If lint reports any issues with Layout.astro (e.g., import ordering), fix the import order per Biome's rules (typically: external packages first, then internal paths, then side-effect imports).
  </action>
  <verify>
    <automated>cd /home/mauricio/gpus && bun run lint && bunx astro check && bun run build</automated>
  </verify>
  <acceptance_criteria>
    - `bun run lint` exits with code 0
    - `bunx astro check` exits with code 0 (no type errors for ClientRouter or astro:transitions)
    - `bun run build` exits with code 0
    - `dist/` directory exists and contains built pages after build
    - No warnings about unresolved `astro:transitions` module
  </acceptance_criteria>
  <done>All three build gates pass. View Transitions are compiled into the site. TECH-03 requirement fully satisfied.</done>
</task>

</tasks>

<verification>
Final verification commands to run after all tasks complete:

```bash
# ClientRouter added
grep "ClientRouter" src/layouts/Layout.astro         # must return 2 matches (import + usage)
grep 'from "astro:transitions"' src/layouts/Layout.astro  # must return 1 match

# IntersectionObserver fixed
grep "astro:page-load" src/layouts/Layout.astro      # must return 1 match
grep "astro:after-swap" src/layouts/Layout.astro     # must return nothing

# Build gates
bun run lint
bunx astro check
bun run build
```
</verification>

<success_criteria>
- `<ClientRouter />` present in `<head>` of `src/layouts/Layout.astro`, after the `<Font />` components
- `import { ClientRouter } from "astro:transitions"` present in Layout.astro frontmatter
- `document.addEventListener("astro:page-load", initReveal)` present (not `astro:after-swap`)
- `bun run lint` passes with exit code 0
- `bunx astro check` passes with exit code 0
- `bun run build` passes with exit code 0
- TECH-03 requirement: confirmed satisfied
</success_criteria>

<output>
After completion, create `.planning/phases/01-technical-debt-and-foundation/01-1.3-SUMMARY.md` with:
- ClientRouter placement confirmation (which line in head)
- IntersectionObserver fix confirmation (astro:after-swap → astro:page-load)
- Build gate results
- Confirmation that TECH-03 is satisfied
</output>
