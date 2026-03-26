---
description: Debug workflow com investigacao paralela, auditoria de landing page e frontend debug com browser automation
---

# /debug - Grupo US Debug Workflow

**ARGUMENTS**: $ARGUMENTS

---

## 0. MODE SELECTION

Parse `$ARGUMENTS` for mode:

- `mode=debug` (default) — Bug investigation with root cause analysis
- `mode=audit` — Full landing page quality audit (build, a11y, perf, responsive)
- `mode=frontend-debug` — React Islands / Astro component debugging with Playwright browser automation

Aliases accepted:

| Mode             | Aliases                                              |
| ---------------- | ---------------------------------------------------- |
| `audit`          | `audit`, `full-audit`, `quality`, `lighthouse`       |
| `frontend-debug` | `frontend-debug`, `ui-debug`, `react-debug`, `e2e`, `playwright` |

---

## 0.1 IRON LAW (NEVER VIOLATE)

```
NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST.
```

If you have not completed Phase 1, you CANNOT propose fixes.

---

## 1. PHASE 0: Collect Errors (ALWAYS FIRST)

### Quality Gates (canonical reference)

```bash
bun run lint 2>&1 | tail -10         # Biome + oxlint
bunx astro check 2>&1 | tail -30    # TypeScript + Astro validation
bun run build 2>&1 | tail -30       # Static build check
```

### Astro-Specific Diagnostics

```bash
# TypeScript + Content Collection validation
bunx astro check 2>&1 | tail -30

# Build with full output for error context
bun run build 2>&1 | tail -50

# Check for common anti-patterns
grep -r "as any" src/ --include="*.ts" --include="*.tsx" -c 2>/dev/null
grep -r "console\.log" src/ --include="*.ts" --include="*.tsx" --include="*.astro" -c 2>/dev/null
grep -r "TODO\|FIXME\|HACK" src/ --include="*.ts" --include="*.tsx" --include="*.astro" -c 2>/dev/null

# Astro 6 anti-patterns
grep -r "ViewTransitions" src/ --include="*.astro" 2>/dev/null        # Should be ClientRouter
grep -r "config\.ts" src/content/ 2>/dev/null                          # Astro 6 infers schemas
grep -r "client:" src/ --include="*.astro" 2>/dev/null                 # client:* on .astro = error
grep -rn "hardcoded.*#[0-9a-fA-F]" src/ --include="*.astro" 2>/dev/null  # Hardcoded hex colors
```

### Astro Skill Reference

> Load `Skill("astro")` for detailed troubleshooting patterns. See `.claude/skills/astro/references/troubleshooting.md` for:
> - Build errors (module not found, Content Collection errors, Vite errors)
> - Hydration mismatches (Date/timezone, random values, browser-only APIs)
> - Styling issues (Tailwind v4, scoped styles, CLS)
> - Dev server issues (port conflicts, HMR, cache)

---

> For complex bugs that span multiple sessions or require persistent state across context resets, use `/gsd:debug` instead — it maintains a debug log and checkpoints across context windows.

---

## 2. MODE A: DEBUG (mode=debug)

### 2.1 Phase 1 — Parallel Investigation

Spawn parallel research agents targeting the relevant layers:

| Layer              | What to investigate                                         | Skill Reference |
| ------------------ | ----------------------------------------------------------- | --------------- |
| Astro Pages/Layout | `.astro` files, slots, head injection, Content Collections  | `astro` → core-concepts, content-collections |
| React Islands      | Hydration, client directives, props serialization, state    | `astro` → islands-architecture |
| Styling/Tailwind   | CSS v4 @theme, semantic tokens, glass utilities, responsive | `astro` → styling-tailwind |
| View Transitions   | ClientRouter (not ViewTransitions), lifecycle events         | `astro` → view-transitions |
| Build/Deploy       | astro.config.mjs, Railway, static output, env vars          | `astro` → configuration |

```typescript
// Agent 1: Astro layer investigation
Task({
  subagent_type: "debugger",
  run_in_background: true,
  prompt: `TASK: Investigate Astro layer for bug
CONTEXT: $ARGUMENTS
SKILLS: Load Skill("astro") for Astro 6 patterns
MISSION:
1. Read relevant .astro pages and layouts
2. Check Content Collections usage — Astro 6 infers schemas (no config.ts)
3. Verify component imports, slot usage, and Astro.props typing
4. Check ClientRouter usage (not deprecated ViewTransitions)
5. Look for build-time vs runtime confusion (frontmatter = server, template = HTML)
6. Verify getCollection() data flow — map to .data before passing to React islands
RETURN: Files analyzed with line numbers, hypothesis of root cause. DO NOT FIX YET.`,
});

// Agent 2: React Islands + client-side investigation
Task({
  subagent_type: "debugger",
  run_in_background: true,
  prompt: `TASK: Investigate React Islands for bug
CONTEXT: $ARGUMENTS
SKILLS: Load Skill("astro") → islands-architecture reference
MISSION:
1. Check client:* directives — only on React/Vue/Svelte, NEVER on .astro components
   - client:idle = deferred hydration (Hero visual effects: AuroraBackground, TextGenerateEffect — reduz TBT; SSR mantém layout/texto legível)
   - client:visible = viewport (CTA effects: LampBackdrop, BackgroundBeams)
   - Only Aceternity UI visual effects in src/components/ui/ — no interactive React islands
2. Verify props serialization — map CollectionEntry to .data before passing
   - No functions, Dates, class instances — only plain objects
3. Check hydration mismatch risks — Date/timezone, Math.random(), window/document
4. Check Framer Motion: only transform/opacity animations, prefers-reduced-motion via useReducedMotion()
5. Verify Lucide React icon usage (no emoji icons)
RETURN: Files analyzed with line numbers, hypothesis of root cause. DO NOT FIX YET.`,
});
```

### 2.2 Phase 2 — Consolidate Hypotheses

When agents complete:

1. Read all reports
2. Identify convergence (where 2+ agents found the same problem)
3. Form PRIMARY HYPOTHESIS
4. List alternative hypotheses

### 2.3 Phase 3 — Fix (ONE AT A TIME)

- ONE fix at a time
- Fix at the SOURCE, not the symptom
- NEVER "while I'm here..."
- Run Quality Gates after EACH fix
- Commit atomically after each validated fix: `git commit -m "fix: <description>"`

### 2.4 Phase 4 — Validate

Run Quality Gates (Section 1). If they fail: DO NOT add more fixes. Analyze and return to Phase 1 if needed.

---

## 3. MODE B: AUDIT (mode=audit)

### 3.0 Iron Laws

```
NO FIX WITHOUT FULL INVENTORY FIRST.
NO OBSERVATION WITHOUT CODE EVIDENCE.
```

### 3.1 Severity Classification

| Severity     | Code | Criteria                                             | Action          |
| ------------ | ---- | ---------------------------------------------------- | --------------- |
| **Critical** | P0   | Build failure, broken page, security vulnerability   | Fix immediately |
| **Important**| P1   | a11y violation, performance regression, broken mobile| Fix this sprint |
| **Moderate** | P2   | Code smell, inconsistency, minor visual bug          | Plan fix        |
| **Minor**    | P3   | Optimization, docs, marginal improvement             | Backlog         |

### 3.2 Parallel Audit Agents (4 Groups)

> **GLOBAL RULE:** DO NOT APPLY FIXES — report only. Format: `File:line | Severity (P0-P3) | Description | Recommendation`

```typescript
// Group A: Astro Build Validation
Task({ subagent_type: "debugger", run_in_background: true,
  prompt: `Audit Group A — Astro Build. Run bunx astro check + bun run build.
Check: astro.config.mjs (integrations, output, site URL, @tailwindcss/vite plugin),
Content Collections (Astro 6 schema inference — NO config.ts needed),
.astro imports, head metadata (title, OG, favicon), ClientRouter (not ViewTransitions).
RETURN: File:line | P0-P3 | Description | Recommendation` });

// Group B: Frontend (React Islands + Components)
Task({ subagent_type: "debugger", run_in_background: true,
  prompt: `Audit Group B — Frontend. Check:
- React islands must have a real client-JS justification; Aceternity UI visual effects
  (aurora-background, spotlight, background-beams, lamp, text-generate-effect) are the primary use case.
  Flag any island that could be a static .astro component instead.
- client:* directives ONLY on .tsx components (NEVER on .astro),
- props: getCollection().map(e => e.data) before passing to React islands,
- prefers-reduced-motion on ALL Framer Motion (useReducedMotion hook),
- Lucide React only (no emoji icons), @theme tokens only (no hardcoded hex),
- Content Collections via getCollection/getEntry (no hardcoded data),
- glass utilities (.glass-card, .bg-mesh), Tailwind v4 @utility directives.
RETURN: File:line | P0-P3 | Description | Recommendation` });

// Group C: Performance & Accessibility
Task({ subagent_type: "debugger", run_in_background: true,
  prompt: `Audit Group C — Perf & a11y.
PERF: Astro Image (webp/avif, lazy), no layout animations (only transform/opacity),
font loading (preload, font-display), minimal client JS, no large deps.
A11Y (WCAG AA): alt text, labels, heading hierarchy, contrast via tokens,
keyboard nav, aria-*, prefers-reduced-motion on ALL animations, skip-to-content.
RETURN: File:line | P0-P3 | Description | Recommendation` });

// Group D: Responsive (375px, 768px, 1024px, 1440px)
Task({ subagent_type: "debugger", run_in_background: true,
  prompt: `Audit Group D — Responsive at 375/768/1024/1440px.
Check: Tailwind responsive classes, text scaling, mobile nav, glass-card overflow,
CTA touch targets (44x44px min), no horizontal scroll, responsive images.
Use Playwright MCP if available: browser_navigate + browser_resize + browser_take_screenshot.
RETURN: File:line | P0-P3 | Description | Recommendation + screenshots` });
```

### 3.3 Consolidation & Fix

When ALL agents complete, produce summary table (Group x Severity) + Action Plan (P0 first). Then apply fixes ONE AT A TIME, highest severity first. Run Quality Gates after each fix.

---

## 4. MODE C: FRONTEND-DEBUG (mode=frontend-debug)

### 4.0 Iron Laws

```
NO FIX WITHOUT STATIC DIAGNOSTIC + VISUAL EVIDENCE FIRST.
NO INTERACTION WITHOUT SNAPSHOT BEFORE.
NO FIX WITHOUT SCREENSHOT EVIDENCE.
```

### 4.1 Phase Pre-0 — Static Diagnostics

```typescript
Task({
  subagent_type: "debugger",
  description: "Static frontend diagnostics",
  run_in_background: true,
  prompt: `TASK: Static diagnostic of frontend issue
CONTEXT: $ARGUMENTS
MISSION:
1. Analyze affected Astro components and React Islands
2. Check hydration directives, props, state management
3. Verify Tailwind classes and semantic token usage
4. Check Framer Motion config and reduced-motion support
5. Look for SSG vs client-side rendering confusion
RETURN: Problematic files with line numbers, hypothesis. DO NOT FIX YET.`,
});
```

### 4.2 Phase 1 — Browser Session Setup

Determine target URL (default: `http://localhost:4321`):

```typescript
// Start dev server if not running
Bash({ command: "bun run dev &", timeout: 5000 });

// Use Playwright MCP tools (check AGENTS.md for serverIdentifier):
// browser_navigate({ url: targetUrl })
// browser_snapshot({})             — accessibility tree
// browser_take_screenshot({})      — visual state
```

### 4.3 Phase 2 — Investigate with Browser Evidence

For each suspected issue:

1. **Navigate** to the affected page/section
2. **Snapshot** the accessibility tree (`browser_snapshot`)
3. **Screenshot** the visual state (`browser_take_screenshot`)
4. **Check console** for errors (`browser_console_messages`)
5. **Check network** for failed requests (`browser_network_requests`)
6. **Resize** to test responsive behavior (`browser_resize`)

### 4.4 Phase 3 — Responsive Testing

Test at all breakpoints with evidence:

```typescript
const breakpoints = [
  { width: 375, height: 812, name: "mobile" },
  { width: 768, height: 1024, name: "tablet" },
  { width: 1024, height: 768, name: "laptop" },
  { width: 1440, height: 900, name: "desktop" },
];

// For each breakpoint, use Playwright MCP tools:
// browser_resize({ width: bp.width, height: bp.height })
// browser_take_screenshot({})
// Check for horizontal overflow, broken layouts, hidden content
```

### 4.5 Phase 4 — Fix and Validate

1. Apply ONE fix at a time
2. Reload browser page
3. Re-screenshot to confirm visual fix
4. Run Quality Gates (Section 1)
5. Commit atomically after each validated fix: `git commit -m "fix: <description>"`
6. Repeat until resolved

---

## 5. RED FLAGS — STOP IMMEDIATELY

**STOP if you:**

- Propose a fix before finding root cause
- Make multiple changes at once
- "Just try this and see"
- Skip Quality Gates verification
- Ignore evidence that contradicts your hypothesis

**If 3+ fixes have failed:**

- Question the approach
- Communicate with the user
- DO NOT attempt another fix

---

## 6. QUALITY GATE (Final Validation)

After ALL fixes, run the full gate:

```bash
bun run lint && bunx astro check && bun run build
```

All commands must pass with zero errors. If any fails, return to investigation.

---

## 7. USAGE EXAMPLES

```bash
/debug the countdown component is not rendering          # mode=debug (default)
/debug mode=audit                                        # Full landing page audit
/debug mode=audit escopo=performance                     # Focused audit
/debug mode=frontend-debug the hero section overlaps     # Browser-assisted debug
/debug mode=frontend-debug url=http://localhost:4321     # Custom URL
```
