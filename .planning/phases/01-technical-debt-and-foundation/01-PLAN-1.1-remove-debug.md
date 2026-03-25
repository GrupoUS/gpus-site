---
phase: 01-technical-debt-and-foundation
plan: "1.1"
type: execute
wave: 1
depends_on: []
files_modified:
  - astro.config.mjs
  - src/lib/productsNav.ts
  - src/components/home/ProductsGrid.astro
  - src/components/ui/text-generate-effect.tsx
  - src/components/ui/lamp.tsx
autonomous: true
requirements:
  - TECH-01

must_haves:
  truths:
    - "No file in src/ or astro.config.mjs makes a fetch to 127.0.0.1"
    - "All 5 files compile without errors after block removal"
    - "bun run lint, bunx astro check, and bun run build all pass"
  artifacts:
    - path: "astro.config.mjs"
      provides: "Astro config without debug instrumentation"
      contains: "No '127.0.0.1' string"
    - path: "src/lib/productsNav.ts"
      provides: "Product nav utility without debug instrumentation"
      contains: "No '127.0.0.1' string"
    - path: "src/components/home/ProductsGrid.astro"
      provides: "Products grid without debug instrumentation"
      contains: "No '127.0.0.1' string"
    - path: "src/components/ui/text-generate-effect.tsx"
      provides: "Text generate effect without debug instrumentation"
      contains: "No '127.0.0.1' string"
    - path: "src/components/ui/lamp.tsx"
      provides: "Lamp backdrop without debug instrumentation"
      contains: "No '127.0.0.1' string"
  key_links:
    - from: "astro.config.mjs"
      to: "clean build output"
      via: "no debug fetch at module level"
      pattern: "grep -c '127\\.0\\.0\\.1' astro.config.mjs returns 0"
    - from: "src/lib/productsNav.ts"
      to: "productNavLinksFromCollection()"
      via: "function body without debug block"
      pattern: "grep -c '127\\.0\\.0\\.1' src/lib/productsNav.ts returns 0"
---

<objective>
Remove all 5 `// #region agent log` debug instrumentation blocks that make fetch calls to `http://127.0.0.1:7777` in production code.

Purpose: Debug instrumentation reaching production is an active risk — it generates network errors in every user session and leaks implementation details. This is the highest-priority cleanup before any other work.
Output: 5 production files with debug blocks deleted, all build gates passing.
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

<tasks>

<task type="auto">
  <name>Task 1: Remove debug block from astro.config.mjs</name>
  <files>astro.config.mjs</files>
  <read_first>
    - astro.config.mjs — Read the full file before editing. The debug block is at lines 16–36.
  </read_first>
  <action>
    Delete lines 16 through 36 (inclusive) from `astro.config.mjs`. These lines are the entire block:

    ```
    // #region agent log
    void fetch(
    	"http://127.0.0.1:7777/ingest/0a9ce74c-a29a-4996-bf5d-a24a8b2822f7",
    	{
    		method: "POST",
    		headers: {
    			"Content-Type": "application/json",
    			"X-Debug-Session-Id": "5db282",
    		},
    		body: JSON.stringify({
    			sessionId: "5db282",
    			runId: "initial",
    			hypothesisId: "H1",
    			location: "astro.config.mjs:9",
    			message: "Astro redirect targets loaded",
    			data: redirectTargets,
    			timestamp: Date.now(),
    		}),
    	},
    ).catch(() => {});
    // #endregion
    ```

    After deletion, line 15 (`};`) ends the `redirectTargets` const and the next line is the blank line before `// https://astro.build/config`. The `const redirectTargets = { ... }` block and everything from `// https://astro.build/config` onward must remain untouched.

    Do NOT delete or modify `redirectTargets`, the `defineConfig` export, or anything else in the file.
  </action>
  <verify>
    <automated>grep -c "127.0.0.1" /home/mauricio/gpus/astro.config.mjs || echo "0"</automated>
  </verify>
  <acceptance_criteria>
    - `grep "127.0.0.1" astro.config.mjs` returns no output (exit code 1 or output is empty)
    - `grep "#region agent log" astro.config.mjs` returns no output
    - `grep "redirectTargets" astro.config.mjs` still returns matches (the const was NOT deleted)
    - `grep "defineConfig" astro.config.mjs` still returns a match (export was NOT deleted)
  </acceptance_criteria>
  <done>astro.config.mjs contains no 127.0.0.1 references and the redirectTargets const + defineConfig export remain intact.</done>
</task>

<task type="auto">
  <name>Task 2: Remove debug block from src/lib/productsNav.ts</name>
  <files>src/lib/productsNav.ts</files>
  <read_first>
    - src/lib/productsNav.ts — Read the full file before editing. The debug block is at lines 39–59.
  </read_first>
  <action>
    Delete lines 39 through 59 (inclusive) from `src/lib/productsNav.ts`. These lines are the entire block:

    ```
    // #region agent log
    void fetch(
    	"http://127.0.0.1:7777/ingest/0a9ce74c-a29a-4996-bf5d-a24a8b2822f7",
    	{
    		method: "POST",
    		headers: {
    			"Content-Type": "application/json",
    			"X-Debug-Session-Id": "5db282",
    		},
    		body: JSON.stringify({
    			sessionId: "5db282",
    			runId: "initial",
    			hypothesisId: "H3",
    			location: "src/lib/productsNav.ts:23",
    			message: "Shared product nav links resolved",
    			data: { links: trackedLinks },
    			timestamp: Date.now(),
    		}),
    	},
    ).catch(() => {});
    // #endregion
    ```

    After deletion, the line `const trackedLinks = entries...` block (lines 31–37) must be followed immediately by the blank line and then `return links;`. The `return links;` statement MUST remain — it is not part of the debug block.

    Do NOT delete `trackedLinks`, `links`, `return links;`, or any other surrounding code.
  </action>
  <verify>
    <automated>grep -c "127.0.0.1" /home/mauricio/gpus/src/lib/productsNav.ts || echo "0"</automated>
  </verify>
  <acceptance_criteria>
    - `grep "127.0.0.1" src/lib/productsNav.ts` returns no output
    - `grep "#region agent log" src/lib/productsNav.ts` returns no output
    - `grep "return links;" src/lib/productsNav.ts` returns a match (return statement was NOT deleted)
    - `grep "productNavLinksFromCollection" src/lib/productsNav.ts` returns a match (export was NOT deleted)
  </acceptance_criteria>
  <done>src/lib/productsNav.ts contains no 127.0.0.1 references and the function's return statement remains intact.</done>
</task>

<task type="auto">
  <name>Task 3: Remove debug block from src/components/home/ProductsGrid.astro</name>
  <files>src/components/home/ProductsGrid.astro</files>
  <read_first>
    - src/components/home/ProductsGrid.astro — Read the full file before editing. The debug block is at lines 18–38.
  </read_first>
  <action>
    Delete lines 18 through 38 (inclusive) from `src/components/home/ProductsGrid.astro`. These lines are the entire block:

    ```
    // #region agent log
    void fetch(
    	"http://127.0.0.1:7777/ingest/0a9ce74c-a29a-4996-bf5d-a24a8b2822f7",
    	{
    		method: "POST",
    		headers: {
    			"Content-Type": "application/json",
    			"X-Debug-Session-Id": "5db282",
    		},
    		body: JSON.stringify({
    			sessionId: "5db282",
    			runId: "initial",
    			hypothesisId: "H2",
    			location: "src/components/home/ProductsGrid.astro:10",
    			message: "Home grid product links resolved",
    			data: { links: trackedExternalProducts },
    			timestamp: Date.now(),
    		}),
    	},
    ).catch(() => {});
    // #endregion
    ```

    The block sits inside the Astro frontmatter (between `---` delimiters). After deletion, `trackedExternalProducts` definition (lines 10–16) is followed by the closing `---` and then the HTML template. The `trackedExternalProducts` const declaration MUST remain — only the fetch block is removed.

    Note: After removal, `trackedExternalProducts` is no longer used anywhere in the file (it was only used by the debug block). The linter will flag it as an unused variable. Delete the `trackedExternalProducts` const as well (lines 10–16):

    ```
    const trackedExternalProducts = products
    	.filter(({ data }) => data.slug === "na-mesa-certa" || data.slug === "otb")
    	.map(({ data }) => ({
    		slug: data.slug,
    		href: data.externalSiteUrl ?? `/${data.slug}`,
    		external: Boolean(data.externalSiteUrl),
    	}));
    ```

    After removing both the `trackedExternalProducts` const AND the debug block, the frontmatter should contain only:
    ```
    import { getCollection } from "astro:content";
    import Card from "../shared/Card.astro";
    import SectionHeading from "../shared/SectionHeading.astro";

    const products = (await getCollection("products")).sort(
    	(a, b) => a.data.order - b.data.order,
    );
    ```
  </action>
  <verify>
    <automated>grep -c "127.0.0.1" /home/mauricio/gpus/src/components/home/ProductsGrid.astro || echo "0"</automated>
  </verify>
  <acceptance_criteria>
    - `grep "127.0.0.1" src/components/home/ProductsGrid.astro` returns no output
    - `grep "#region agent log" src/components/home/ProductsGrid.astro` returns no output
    - `grep "trackedExternalProducts" src/components/home/ProductsGrid.astro` returns no output (unused var removed)
    - `grep "getCollection" src/components/home/ProductsGrid.astro` returns a match (imports remain)
  </acceptance_criteria>
  <done>ProductsGrid.astro contains no 127.0.0.1 references, no unused trackedExternalProducts variable, and the products const + imports remain intact.</done>
</task>

<task type="auto">
  <name>Task 4: Remove debug blocks from text-generate-effect.tsx and lamp.tsx</name>
  <files>src/components/ui/text-generate-effect.tsx, src/components/ui/lamp.tsx</files>
  <read_first>
    - src/components/ui/text-generate-effect.tsx — Read before editing. The debug block is at lines 25–45 (a useEffect hook).
    - src/components/ui/lamp.tsx — Read before editing. The debug block is at lines 8–32 (a useEffect hook).
  </read_first>
  <action>
    **text-generate-effect.tsx — delete lines 25–45:**

    The block to remove is:
    ```
    // #region agent log
    useEffect(() => {
    	if (!runMotion) return;
    	fetch("http://127.0.0.1:7777/ingest/0a9ce74c-a29a-4996-bf5d-a24a8b2822f7", {
    		method: "POST",
    		headers: {
    			"Content-Type": "application/json",
    			"X-Debug-Session-Id": "651d29",
    		},
    		body: JSON.stringify({
    			sessionId: "651d29",
    			location: "text-generate-effect.tsx:runMotion",
    			message: "motion headline phase active",
    			data: { wordCount: wordsArray.length },
    			timestamp: Date.now(),
    			hypothesisId: "C",
    			runId: "verify",
    		}),
    	}).catch(() => {});
    }, [runMotion, wordsArray.length]);
    // #endregion
    ```

    After deletion, the three remaining `useEffect` hooks must remain. Specifically: the `setRunMotion(true)` useEffect (lines 21–23) and the animation useEffect with the `biome-ignore` comment (lines 47–61 in the original) must both remain.

    **lamp.tsx — delete lines 8–32:**

    The block to remove starts immediately after the opening of `LampBackdrop`:
    ```
    // #region agent log
    useEffect(() => {
    	const section = document.getElementById("cta-lamp-section");
    	fetch("http://127.0.0.1:7777/ingest/0a9ce74c-a29a-4996-bf5d-a24a8b2822f7", {
    		method: "POST",
    		headers: {
    			"Content-Type": "application/json",
    			"X-Debug-Session-Id": "651d29",
    		},
    		body: JSON.stringify({
    			sessionId: "651d29",
    			location: "lamp.tsx:LampBackdrop",
    			message: "data-reveal nodes in CTA section vs document",
    			data: {
    				revealInCtaSection:
    					section?.querySelectorAll("[data-reveal]").length ?? -1,
    				revealInDocument: document.querySelectorAll("[data-reveal]").length,
    			},
    			timestamp: Date.now(),
    			hypothesisId: "B",
    			runId: "verify",
    		}),
    	}).catch(() => {});
    }, []);
    // #endregion
    ```

    After removing this block from lamp.tsx, the `useEffect` import at the top (`import { useEffect } from "react"`) is no longer used. Remove the `useEffect` from that import statement. The import line should become:
    ```
    import { cn } from "@/lib/utils";
    ```
    (The `motion` import from `"motion/react"` must remain. Only `useEffect` is removed from the react import.)

    Actually, check: lamp.tsx imports `import { useEffect } from "react";` on line 3 and `import { motion } from "motion/react";` on line 2. After deleting the debug block, `useEffect` is unused. Change line 3 to remove the unused import entirely: delete `import { useEffect } from "react";`.
  </action>
  <verify>
    <automated>grep -rn "127.0.0.1" /home/mauricio/gpus/src/components/ui/text-generate-effect.tsx /home/mauricio/gpus/src/components/ui/lamp.tsx</automated>
  </verify>
  <acceptance_criteria>
    - `grep "127.0.0.1" src/components/ui/text-generate-effect.tsx` returns no output
    - `grep "127.0.0.1" src/components/ui/lamp.tsx` returns no output
    - `grep "#region agent log" src/components/ui/text-generate-effect.tsx` returns no output
    - `grep "#region agent log" src/components/ui/lamp.tsx` returns no output
    - `grep "useEffect" src/components/ui/lamp.tsx` returns no output (unused import removed)
    - `grep "motion" src/components/ui/lamp.tsx` returns a match (motion import remains)
    - `grep "setRunMotion" src/components/ui/text-generate-effect.tsx` returns a match (other useEffects remain)
  </acceptance_criteria>
  <done>Both React files contain no 127.0.0.1 references. lamp.tsx has the unused useEffect import removed. text-generate-effect.tsx retains its two legitimate useEffect hooks.</done>
</task>

<task type="auto">
  <name>Task 5: Verify all debug instrumentation removed and run build gates</name>
  <files></files>
  <read_first>
    No files to read — this task runs verification commands only.
  </read_first>
  <action>
    Run the following commands in order. Each must succeed before proceeding to the next.

    1. Verify no debug instrumentation remains anywhere:
       ```
       grep -r "127.0.0.1" src/ astro.config.mjs
       ```
       Expected: No output (exit code 1). If any output appears, return to tasks 1–4 and fix.

    2. Verify no region markers remain:
       ```
       grep -r "#region agent log" src/ astro.config.mjs
       ```
       Expected: No output.

    3. Run lint (Biome + oxlint):
       ```
       bun run lint
       ```
       Expected: Exits 0, no errors.

    4. Run TypeScript check:
       ```
       bunx astro check
       ```
       Expected: Exits 0, no type errors.

    5. Run build:
       ```
       bun run build
       ```
       Expected: Exits 0, `dist/` directory created.
  </action>
  <verify>
    <automated>cd /home/mauricio/gpus && grep -r "127.0.0.1" src/ astro.config.mjs; echo "grep exit: $?"</automated>
  </verify>
  <acceptance_criteria>
    - `grep -r "127.0.0.1" src/ astro.config.mjs` produces zero lines of output
    - `bun run lint` exits with code 0
    - `bunx astro check` exits with code 0
    - `bun run build` exits with code 0 and creates `dist/` directory
  </acceptance_criteria>
  <done>All 5 debug blocks confirmed removed. All three build gates pass. TECH-01 requirement is satisfied.</done>
</task>

</tasks>

<verification>
Final verification commands to run after all tasks complete:

```bash
# No debug instrumentation
grep -r "127.0.0.1" src/ astro.config.mjs

# No region markers
grep -r "#region agent log" src/ astro.config.mjs

# Build gates
bun run lint
bunx astro check
bun run build
```

All four commands must produce clean output.
</verification>

<success_criteria>
- Zero occurrences of `127.0.0.1` in any file under `src/` or in `astro.config.mjs`
- Zero occurrences of `#region agent log` in those same files
- `bun run lint` passes with exit code 0
- `bunx astro check` passes with exit code 0
- `bun run build` passes with exit code 0
- TECH-01 requirement: confirmed satisfied
</success_criteria>

<output>
After completion, create `.planning/phases/01-technical-debt-and-foundation/01-1.1-SUMMARY.md` with:
- What was removed (list of 5 files and block locations)
- Lint/build gate results
- Confirmation that TECH-01 is satisfied
</output>
