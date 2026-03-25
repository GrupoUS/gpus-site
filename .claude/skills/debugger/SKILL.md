---
name: debugger
description: Use when debugging failures in Astro SSG, React Islands, Tailwind CSS, Framer Motion, or full regression audits. Triggers on build errors, hydration mismatch, animation bugs, Content Collection validation, Lighthouse regressions, and post-change verification.
---

# Debugger

Production-grade debugging skill for Na Mesa Certa — combines root-cause rigor, parallel sub-agent research, and Playwright MCP browser evidence into a single canonical workflow for a static Astro landing page.

---

## Iron Law

1. **No fix without root cause.** Understand WHY before changing code.
2. **No "fixed" claim without fresh evidence.** Gates must pass, screenshots must confirm.
3. **No scope expansion during incident handling.** Log new issues, fix them later.

---

## When to Use

- Astro build failures, TypeScript errors, Content Collection issues
- React Island hydration mismatches, interaction failures
- Framer Motion animation bugs, prefers-reduced-motion violations
- Tailwind CSS v4 styling regressions, @theme directive issues
- Lighthouse performance regressions (LCP, CLS, bundle size)
- Broad post-change audit or release hardening checks

Use `performance-optimization` for dedicated speed/SEO optimization campaigns.

---

## Pack Selector

| Pack | Scope | Browser Evidence | Sub-agents |
|------|-------|:---:|:---:|
| `frontend-debug` | Astro component issues, React Island hydration, Framer Motion animation bugs | **YES** | 3 parallel |
| `build-debug` | Astro build failures, Content Collection validation, TypeScript errors | — | 2 parallel |
| `performance-debug` | Lighthouse metrics, CLS, LCP, bundle size, image optimization | **YES** | 2 parallel |
| `systematic-audit` | Full landing page stability sweep | **YES** | 3 parallel |

**Pack selection logic:**
1. If input names a pack explicitly -> use it
2. If symptom is visual/UI/React/animation -> `frontend-debug`
3. If symptom is build failure/TS error/Content Collection -> `build-debug`
4. If symptom is Lighthouse/CLS/LCP/bundle size -> `performance-debug`
5. If input says "audit" or scope is unclear -> `systematic-audit`
6. If ambiguous -> ask ONE clarifying question (multiple choice preferred)

---

## Phase 0: Pre-flight Check

Run these checks before any debugging work. Failure here blocks all subsequent phases.

```bash
# 1. Bun available
bun --version

# 2. Astro check (TypeScript + Content Collections)
bunx astro check 2>&1 | tail -20

# 3. Build succeeds
bun run build 2>&1 | tail -20
```

**For `frontend-debug`, `performance-debug`, and `systematic-audit` packs** — also verify Playwright MCP:

```typescript
// Playwright MCP is auto-enabled via enableAllProjectMcpServers in .claude/settings.json
// Verify by calling browser_install (idempotent — safe to call always)
mcp__plugin_playwright_playwright__browser_install();
```

> **Platform gate:** Playwright MCP browser tools require Linux/macOS/WSL. On native Windows, skip browser evidence steps and rely on static analysis only.

---

## Checklist: marketing / copy-only changes

Use after edits that touch headlines, `src/content/**/*.json`, `index.astro` intros, or JSON-LD — even when "no logic changed."

| Step | What to verify |
|------|----------------|
| 1 | `bunx astro check && bun run build` — collections must validate and SSG must complete |
| 2 | **Event schema** in `index.astro` — `startDate` / `endDate` match hero + countdown target; `offers.lowPrice` / `highPrice` match checkout; `performer` reflects `speakers` with `revealed: true` |
| 3 | **FAQ schema** — `faqSchema.mainEntity` built from `getCollection('faqs')`; every new/changed FAQ file has correct `order` if sort depends on it |
| 4 | **Countdown** — `CountdownTimer` `targetDate` ISO matches first day of event in TZ `-03:00` |
| 5 | **Islands** — FAQ/testimonial data still passed as plain `.data` objects, not `CollectionEntry` |
| 6 | **Optional UI pass** — Spot-check in browser: headings hierarchy, CTA anchors (`#ingresso`), mobile sticky CTA |

If anything fails, treat as **`build-debug`** until green, then optional **`frontend-debug`** for visual regression.

---

## Phase 1: Parallel Research

**Applies to:** all packs

Before ANY fix attempt, launch sub-agents to gather evidence. All agents run in background simultaneously.

### Sub-agent A: Evidence Collector

**For `frontend-debug`, `performance-debug`, and `systematic-audit` only.** Captures live browser state.

```typescript
Task({
  subagent_type: "debugger",
  name: "evidence-collector",
  description: "Capture browser evidence",
  run_in_background: true,
  prompt: `TASK: Capture browser evidence for debugging

CONTEXT: [paste bug description or failing URL]

MISSION:
1. Install browser if needed:
   mcp__plugin_playwright_playwright__browser_install()

2. Navigate to the failing URL:
   mcp__plugin_playwright_playwright__browser_navigate({ url: "http://localhost:4321" })

3. Capture accessibility snapshot:
   mcp__plugin_playwright_playwright__browser_snapshot()

4. Take initial screenshot:
   mcp__plugin_playwright_playwright__browser_take_screenshot({ path: "e2e-screenshots/debug/00-initial.png", fullPage: true })

5. Capture console messages:
   mcp__plugin_playwright_playwright__browser_console_messages()

6. Capture network requests (filter 4xx/5xx):
   mcp__plugin_playwright_playwright__browser_network_requests()

7. If React error overlay visible, capture:
   mcp__plugin_playwright_playwright__browser_evaluate({ expression: "document.querySelector('[data-astro-error]')?.textContent || 'no error overlay'" })

RETURN:
- Screenshot path
- Console errors (filtered — ignore extension noise)
- Failed network requests (status >= 400)
- Astro error overlay text if present
- Accessibility snapshot summary

DO NOT fix anything. Evidence collection only.`,
});
```

### Sub-agent B: Code Archaeologist

**For all packs.** Identifies code context around the failure.

```typescript
Task({
  subagent_type: "explorer",
  name: "code-archaeologist",
  description: "Investigate failing code",
  run_in_background: true,
  prompt: `TASK: Investigate code context for debugging

SYMPTOM: [paste error message or failing behavior]
AFFECTED AREA: [component/page/layout name if known]

MISSION:
1. Search codebase for the failing component, page, or layout
2. Identify the EXACT file:line where the error originates
3. Run: git log --oneline -10 -- <affected-files> to find last commits
4. Map related dependencies:
   - Astro layout/page chain
   - React Island props and client directives
   - Content Collection schemas and entries
   - Tailwind classes and @theme tokens
   - Framer Motion variants and hooks
5. Check for recent changes that could have caused regression

RETURN (Findings Table format):
| # | Finding | Confidence (1-5) | Source | Impact |
|---|---------|------------------|--------|--------|

Plus:
- Affected file paths with line ranges
- Last 3 commits touching those files
- Dependency chain (page -> layout -> component -> island)
- Knowledge Gaps identified`,
});
```

### Sub-agent C: Regression Hunter

**For all packs.** Matches symptom against known patterns.

```typescript
Task({
  subagent_type: "explorer",
  name: "regression-hunter",
  description: "Match against known patterns",
  run_in_background: true,
  prompt: `TASK: Match debugging symptom against known patterns

SYMPTOM: [paste error message or failing behavior]

MISSION:
1. Read .claude/skills/debugger/references/ for domain rules if available
2. Scan the Common Root Causes Catalog in this SKILL.md
3. Search MEMORY.md for matching patterns (project auto-memory)

If MATCH found:
- Return: pattern name, root cause, recommended fix, file guidance

If NO MATCH:
- Generate top-3 hypotheses ranked by probability
- For each: hypothesis statement, evidence for/against, suggested investigation step

RETURN:
- Match status: MATCHED / NO_MATCH
- If matched: pattern details + fix guidance
- If not matched: ranked hypotheses with investigation plan`,
});
```

---

## Phase 2: Hypothesis Selection

After all sub-agents return, consolidate findings:

1. **Merge evidence** from all sub-agents into a single view
2. **Cross-reference** — does browser evidence match code analysis?
3. **Rank hypotheses** by probability:
   - Evidence from 2+ sub-agents -> HIGH probability
   - Evidence from 1 sub-agent -> MEDIUM probability
   - Speculation without evidence -> LOW probability
4. **Select highest-probability hypothesis** for first fix attempt
5. **Document** the selected hypothesis before proceeding:

```markdown
### Selected Hypothesis
**Statement:** [one sentence]
**Evidence:** [what supports this]
**Counter-evidence:** [what might disprove this]
**Fix target:** [exact file:line]
```

---

## Phase 3: Minimal Fix

Apply ONE change at a time. Never batch fixes.

1. **Read the target file** — never reference line numbers without reading first
2. **Apply the smallest possible change** that addresses the root cause
3. **Verify the change compiles:** `bunx astro check 2>&1 | tail -20`
4. If the change introduces new errors -> **revert immediately** and reconsider

### Fix Constraints

- One file per fix attempt (exceptions: type + implementation when tightly coupled)
- Always use `Edit` tool for targeted changes, not `Write` for full file rewrites
- Preserve existing code style and patterns
- Add comments only when the fix is non-obvious

---

## Phase 4: Verification Gate

**Mandatory before ANY "fixed" claim.** Run all gates sequentially:

```bash
# Gate 1: Astro check (TypeScript + Content Collections)
bunx astro check

# Gate 2: Build succeeds
bun run build
```

**All gates must exit 0.** If any gate fails:
- Read full error output
- Determine if failure is related to the fix or pre-existing
- If related -> revert and return to Phase 2
- If pre-existing -> document and continue

---

## Phase 5: Evidence Confirmation

### For `frontend-debug`: Browser Evidence

After verification gates pass, confirm the fix visually:

```typescript
// 1. Navigate to the affected URL
mcp__plugin_playwright_playwright__browser_navigate({ url: "http://localhost:4321" });

// 2. Capture snapshot (verify DOM state)
mcp__plugin_playwright_playwright__browser_snapshot();

// 3. Screenshot post-fix
mcp__plugin_playwright_playwright__browser_take_screenshot({
  path: "e2e-screenshots/debug/after-fix-1.png",
  fullPage: true,
});

// 4. Verify console is clean
mcp__plugin_playwright_playwright__browser_console_messages();

// 5. Verify no failed network requests
mcp__plugin_playwright_playwright__browser_network_requests();
```

**If the symptom persists visually** -> the fix is incomplete. Return to Phase 2.

#### Responsive Verification

After fix is confirmed on desktop, test at 3 viewports:

```typescript
// Mobile (375x812)
mcp__plugin_playwright_playwright__browser_resize({ width: 375, height: 812 });
mcp__plugin_playwright_playwright__browser_take_screenshot({
  path: "e2e-screenshots/debug/viewport-mobile.png",
});

// Tablet (768x1024)
mcp__plugin_playwright_playwright__browser_resize({ width: 768, height: 1024 });
mcp__plugin_playwright_playwright__browser_take_screenshot({
  path: "e2e-screenshots/debug/viewport-tablet.png",
});

// Desktop (1440x900)
mcp__plugin_playwright_playwright__browser_resize({ width: 1440, height: 900 });
mcp__plugin_playwright_playwright__browser_take_screenshot({
  path: "e2e-screenshots/debug/viewport-desktop.png",
});
```

#### Astro Hydration Mismatch

If the error is a hydration mismatch in a React Island, additionally run:

```typescript
mcp__plugin_playwright_playwright__browser_evaluate({
  expression: "JSON.stringify(Array.from(document.querySelectorAll('[data-astro-cid]')).map(el => ({ tag: el.tagName, id: el.id, directive: el.getAttribute('client:load') || el.getAttribute('client:visible') || 'none' })), null, 2)",
});
```

### For `performance-debug`: Lighthouse Metrics

After verification gates pass, capture performance evidence:

```typescript
// Navigate and wait for full load
mcp__plugin_playwright_playwright__browser_navigate({ url: "http://localhost:4321" });

// Check for layout shifts
mcp__plugin_playwright_playwright__browser_evaluate({
  expression: "new PerformanceObserver(list => {}).observe({type: 'layout-shift', buffered: true}); JSON.stringify(performance.getEntriesByType('layout-shift').map(e => ({ value: e.value, sources: e.sources?.map(s => s.node?.nodeName) })))",
});

// Check LCP
mcp__plugin_playwright_playwright__browser_evaluate({
  expression: "JSON.stringify(performance.getEntriesByType('largest-contentful-paint').map(e => ({ renderTime: e.renderTime, size: e.size, element: e.element?.tagName })))",
});

// Check total bundle size
mcp__plugin_playwright_playwright__browser_network_requests();
```

### For `systematic-audit`

Run browser evidence steps for all critical sections of the landing page (hero, countdown, FAQ, testimonials, footer).

---

## Phase 6: Report

Always output this structured report at the end of a debug session:

```markdown
## Debug Session Complete

**Pack used:** [frontend-debug | build-debug | performance-debug | systematic-audit]
**Root cause:** [one sentence explaining WHY the bug occurred]
**Fix applied:** [file:line — what changed and why]
**Evidence:**
- Screenshots: [paths to e2e-screenshots/debug/*.png]
- Console: [clean / N errors remaining]
- Network: [clean / N failed requests remaining]
**Verification:** [gate commands + exit codes]
**Remaining risks:** [any open concerns or related issues found but not fixed]
```

---

## Pack-Specific Execution Guides

### `frontend-debug`

**Scope:** React Island regressions, hydration errors, Framer Motion animation failures, visual glitches.

**Execution flow:**
1. Pre-flight (Phase 0) + Playwright MCP check
2. Launch 3 sub-agents: Evidence Collector + Code Archaeologist + Regression Hunter
3. While agents work, run quality gates as baseline
4. Consolidate findings -> select hypothesis
5. Apply minimal fix
6. Verification gates
7. Browser evidence: screenshot + console + network + responsive viewports
8. Report

**Key rules:**
- NEVER fix without capturing initial screenshot first
- NEVER interact with page without calling `browser_snapshot` first (refs invalidate after DOM changes)
- Always check `browser_console_messages()` after EACH interaction step
- Default target: `http://localhost:4321` (override with `url=` argument)

### `build-debug`

**Scope:** Astro build failures, Content Collection schema errors, TypeScript compilation issues.

**Execution flow:**
1. Pre-flight (Phase 0)
2. Launch 2 sub-agents: Code Archaeologist + Regression Hunter
3. Consolidate -> hypothesis
4. Minimal fix
5. Verification gates (`bunx astro check && bun run build`)
6. Report

**Key rules:**
- Always run `bunx astro check` before `bun run build` — Astro check catches type errors build may miss
- **Astro 6**: Content Collection schemas are inferred from data files. No `src/content/config.ts` needed. If one exists and causes errors, consider deleting it.
- For import errors, verify file paths and Astro component vs React component distinction
- Check `astro.config.mjs` for correct integration setup (`@tailwindcss/vite` plugin, `@astrojs/react`)
- Use `ClientRouter` from `astro:transitions` — `ViewTransitions` was removed in Astro 6

**Astro 6 build error quick fixes:**
- `ViewTransitions is not exported` → Replace with `ClientRouter` from `astro:transitions`
- `config.ts schema error` → Delete `src/content/config.ts` (Astro 6 infers schemas)
- `Cannot find module` → Check case sensitivity (Linux), add file extensions
- `Unknown client directive` → `client:*` only on framework components (.tsx), never on .astro

> **Cross-reference:** Load `Skill("astro")` → `references/troubleshooting.md` for comprehensive error catalog

### `performance-debug`

**Scope:** Lighthouse score regressions, CLS, LCP, bundle size, image optimization.

**Execution flow:**
1. Pre-flight (Phase 0) + Playwright MCP check
2. Launch 2 sub-agents: Evidence Collector (with perf metrics) + Code Archaeologist
3. Consolidate -> hypothesis
4. Minimal fix
5. Verification gates
6. Performance evidence: LCP, CLS, bundle sizes, network waterfall
7. Report

**Key rules:**
- Lighthouse 95+ is non-negotiable
- Check `<Image>` component usage — Astro Image optimization must be used for all images
- Verify no unnecessary JS is shipped — React Islands only for Countdown, FAQ, Testimonials
- Check Framer Motion bundle impact — use `LazyMotion` + `domAnimation` for tree-shaking

### `systematic-audit`

**Scope:** Full landing page stability sweep. Post-release hardening or periodic health check.

**Execution flow:**
1. Pre-flight (Phase 0) + Playwright MCP check
2. Launch 3 sub-agents:
   - Evidence Collector (browser baseline of all landing page sections)
   - Code Archaeologist (scan for unstable patterns across codebase)
   - Regression Hunter (cross-reference known issues)
3. **Inventory first, NO fixes** — classify all findings as P0/P1/P2/P3
4. Present findings table to user for prioritization
5. Fix P0 issues one at a time, with verification after each
6. Then P1, then P2
7. Final gates: `bunx astro check && bun run build`
8. Browser evidence of all sections post-fix at 3 viewports
9. Full report with remaining P3 items logged

**Key rules:**
- NEVER fix during inventory phase
- One fix at a time, validate after each
- Verify semantic token usage (no hardcoded hex values)
- Verify `prefers-reduced-motion` on all animated components

---

## Escalation Rule

- **1-2 fix attempts fail** -> restart investigation from Phase 1 with fresh hypothesis
- **3 fix attempts fail** -> STOP. Challenge architecture assumptions:
  - Is the design fundamentally flawed?
  - Is the symptom a consequence of a deeper structural issue?
  - Should this be escalated for read-only architectural consultation?

---

## Common Root Causes Catalog

Quick lookup for frequently encountered issues in this project.

### Astro & Build Patterns

| Symptom | Root Cause | Fix Guidance |
|---------|------------|--------------|
| `Cannot find module '@/...'` after file move | tsconfig paths not updated | Update `tsconfig.json` paths + restart TS server |
| Content Collection validation error | Data file doesn't match expected structure | In Astro 6: schemas are inferred — fix the JSON data. In Astro 4-5: align with `defineCollection` schema in `config.ts` |
| `getCollection()` returns empty array | Collection name typo or missing `src/content/<name>/` dir | Verify directory exists with at least one valid data file |
| Build fails with "Unknown directive" | Using `client:load` on `.astro` component instead of React | Only React/Preact/Vue/Svelte components support `client:*` directives |
| `Could not resolve import` in Astro file | Missing file extension in import (Astro requires them) | Add explicit `.astro`, `.tsx`, `.ts` extensions to imports |
| `ViewTransitions is not exported` | Astro 6 removed `ViewTransitions` | Replace with `import { ClientRouter } from 'astro:transitions'` |
| `Pre-transform error: Failed to resolve` | Vite cache stale after dependency changes | Clear cache: `rm -rf node_modules/.vite .astro` + restart |
| Content Collection not found after adding | New collection directory not detected by dev server | Restart dev server — new collections require restart |
| `config.ts` schema validation fails | Explicit schemas conflict with Astro 6 inference | In Astro 6: delete `src/content/config.ts` — schemas are auto-inferred |
| Tailwind classes missing in build | Dynamic class names assembled via concatenation | Use complete class strings — Tailwind v4 purges by scanning for full tokens |

### React Island & Hydration Patterns

| Symptom | Root Cause | Fix Guidance |
|---------|------------|--------------|
| Hydration mismatch in React Island | Server/client render different output (e.g., `Date.now()`, `window` access) | Move dynamic values to `useEffect` or `useState` with initial `null` |
| Island not interactive after page load | Wrong client directive — `client:visible` on above-fold component | Use `client:load` for above-fold, `client:visible` for below-fold |
| Island flashes/disappears on load | CSS not loaded before hydration | Ensure Tailwind styles are in global CSS, not island-scoped |
| `Select is changing from uncontrolled to controlled` | `value={undefined}` transitioning to string | Use `value={val ?? ""}` to keep controlled |
| Infinite re-render in Island | `useEffect` dep array includes unstable reference | Memoize objects/arrays with `useMemo`, functions with `useCallback` |
| Props undefined in React Island | Passing `CollectionEntry` instead of plain data | Map to `.data` first: `collection.map(e => e.data)` before passing as props |
| `TypeError: Cannot read properties of undefined` | Island receiving non-serializable props (functions, Dates, class instances) | Props must be plain objects — serialize Dates to strings, remove functions |
| Island renders but shows stale data | Content Collection data not re-fetched after content change | Restart dev server — Content Collection changes may need restart |

### Framer Motion & Animation Patterns

| Symptom | Root Cause | Fix Guidance |
|---------|------------|--------------|
| Animation plays on every scroll | Using `whileInView` without `once: true` | Add `viewport={{ once: true }}` to `motion` component |
| Animation janky/low FPS | Animating `width`/`height`/`top`/`left` | Use only `transform` and `opacity` — HARD GATE |
| Animation plays despite `prefers-reduced-motion` | Missing motion preference check | Wrap with `useReducedMotion()` hook, disable animation when true |
| Layout shift from animation | Element changes size during animation | Use `layout` prop carefully, prefer `transform`-only animations |

### Tailwind CSS v4 Patterns

| Symptom | Root Cause | Fix Guidance |
|---------|------------|--------------|
| Custom token not applying | `@theme` directive syntax error in CSS | Verify `@theme { --color-*: ... }` syntax — Tailwind v4 uses CSS-first config |
| `.glass-card` or `.bg-mesh` not working | Custom utility not defined or CSS file not imported | Check `src/styles/global.css` for `@utility` definitions |
| Styles work in dev but not in build | Tailwind purging classes not found in templates | Ensure dynamic class names are complete strings, not concatenated |
| `tailwind.config.js` errors | Tailwind v4 doesn't use JS config files | Delete `tailwind.config.js` — use `@theme {}` in CSS instead |
| `@tailwind base` not recognized | Tailwind v4 changed import syntax | Use `@import "tailwindcss"` instead of `@tailwind base/components/utilities` |
| `@astrojs/tailwind` integration errors | Wrong integration for Tailwind v4 | Use `@tailwindcss/vite` as Vite plugin, not `@astrojs/tailwind` integration |
| Token not available as utility class | Missing `--color-` prefix in `@theme` | Tailwind v4 requires `--color-*` prefix for color tokens, `--font-*` for fonts |

### Image & Performance Patterns

| Symptom | Root Cause | Fix Guidance |
|---------|------------|--------------|
| LCP > 2.5s | Hero image not optimized or missing `fetchpriority="high"` | Use Astro `<Image>` component with `loading="eager"` for hero |
| CLS > 0.1 | Images without explicit width/height | Always set `width` and `height` on `<Image>` components |
| Large bundle size | Framer Motion fully imported | Use `LazyMotion` + `domAnimation` feature bundle |
| FOUT (flash of unstyled text) | Font not preloaded | Add `<link rel="preload" as="font">` in layout `<head>` |

---

## NEVER Constraints

> These constraints are absolute. Violating any of them invalidates the debug session.

1. **NEVER** skip pre-flight checks (Phase 0)
2. **NEVER** claim "fixed" before ALL verification gate commands pass AND evidence is captured
3. **NEVER** expand scope during an active debug session — log new issues for later
4. **NEVER** take more than 3 fix attempts on the same hypothesis before escalating
5. **NEVER** hallucinate file paths — always `Read` the actual file before referencing line numbers
6. **NEVER** interact with browser elements without calling `browser_snapshot` first (refs invalidate)
7. **NEVER** leave `console.log` or `debugger` statements in production code after fixing
8. **NEVER** use `as any` to silence type errors introduced by a fix — find the real type
9. **NEVER** animate `width`/`height`/`top`/`left` — use `transform`/`opacity` only
10. **NEVER** add React Islands beyond the 3 specified (Countdown, FAQ, Testimonials)
11. **NEVER** create `src/content/config.ts` — Astro 6 infers schemas automatically
12. **NEVER** use `ViewTransitions` — use `ClientRouter` from `astro:transitions`
13. **NEVER** use `tailwind.config.js` — Tailwind v4 uses `@theme {}` in CSS
14. **NEVER** pass `CollectionEntry` objects to React islands — always map to `.data` first

---

## Cross-References

- **`astro` skill** — `.claude/skills/astro/SKILL.md` — Full Astro 6 reference with 8 detailed references
  - `references/troubleshooting.md` — Comprehensive error catalog with fixes
  - `references/islands-architecture.md` — Client directives, hydration patterns
  - `references/content-collections.md` — getCollection, data flow, common issues
  - `references/styling-tailwind.md` — Tailwind v4 @theme, @utility, class:list
- **`performance-optimization` skill** — For dedicated speed/SEO campaigns
- **`gpus-theme` skill** — GPUS Navy+Gold design tokens
