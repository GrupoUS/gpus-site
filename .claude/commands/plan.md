---
description: Unified planning workflow using parallel explorer + librarian agents for research and project-planner for synthesis. Delegates to planning skill for methodology.
---

# /plan — Planning Orchestration

**ARGUMENTS**: $ARGUMENTS

> **Methodology:** `Skill("planning")` — D.R.P.I.V workflow
> **Framework:** A.P.T.E (Analyze → Research → Think → Elaborate)
> **Executor:** `.claude/agents/project-planner.md` — Plan synthesis

---

## Core Principles

```yaml
PRINCIPLES:
  - "KISS: Keep It Simple — choose the simplest viable solution"
  - "YAGNI: Build only what's needed now"
  - "Chain of Thought: Step-by-step reasoning BEFORE final answer"
  - "Constitutional: Define what NOT to do, not just what to do"
  - "Few-Shot+Reasoning: Show INPUT → REASONING → OUTPUT, never INPUT → OUTPUT alone"
  - "Embedded Validation: Self-check after every response before delivering"

NEGATIVE_CONSTRAINTS:
  - "NEVER implement before researching"
  - "NEVER present vague instructions — always provide exact code"
  - "NEVER overwhelm with multiple questions simultaneously"
  - "NEVER skip the self-review gate before presenting a plan"
  - "NEVER hallucinate — if unknown, mark as Knowledge Gap"
  - "NEVER use jargon — sentences must be ≤20 words"
```

---

## Quick Assessment

```
Is it L1-L2 (bug fix, single file)?
├─► YES → Skip /plan, fix directly
└─► NO  → Continue workflow
```

---

## Domain Routing: Frontend → /design

**CRITICAL:** Any task involving **creation** of frontend UI must be delegated to `/design`.

### Frontend Creation Triggers

| Keyword Pattern                      | Action                              |
| ------------------------------------ | ----------------------------------- |
| "create component"                   | → `/design` with ui-ux-pro-max      |
| "new page" / "add page"              | → `/design` with ui-ux-pro-max      |
| "build UI" / "implement UI"          | → `/design` with ui-ux-pro-max      |
| "design [component/page/section]"    | → `/design` with ui-ux-pro-max      |
| "add dialog/modal"                   | → `/design` with ui-ux-pro-max      |
| "create form" + React/frontend       | → `/design` with ui-ux-pro-max      |
| "redesign" / "restyle"               | → `/design` with ui-ux-pro-max      |
| "improve UX" / "enhance UI"          | → `/design` with ui-ux-pro-max      |

### NOT Frontend Creation (stay in /plan)

- Content Collection schema changes
- Build configuration
- Deployment config
- Bug fixes in existing components
- CSS tweaks (L1-L2)

### Delegation Pattern

```typescript
// When frontend creation is detected, delegate to /design:
// DO NOT continue planning — redirect immediately

"Frontend creation detected. Delegating to /design for proper UI/UX research..."

// Then invoke /design workflow:
// 1. Phase 0: explorer + ui-ux-pro-max → design spec
// 2. frontend-specialist (background) → implementation
```

### Hybrid Tasks (Frontend + Backend)

For tasks with **both** frontend creation AND backend work:

```markdown
## Plan: [Feature Name]

### Phase 1: Data & Config (plan normally)
- Task 1.1: Define Content Collection schema
- Task 1.2: Add content data files
- Task 1.3: Configure build/deploy settings

### Phase 2: Frontend → DELEGATE TO /design
> Invoke /design for: "[specific frontend component/page]"
> Pass backend contract from Phase 1
```

**Workflow:**
1. Plan data/config tasks in `/plan`
2. Document data contract (content collection types, props)
3. Delegate frontend portion to `/design` with the contract

---

## Workflow

```
Phase 0        Phase 1        Phase 2        Phase 2.5      Phase 3
DISCOVER   →   RESEARCH   →   PLAN       →   SELF-REVIEW →  PRESENT
    ↓             ↓              ↓              ↓              ↓
 Dialogue     Parallel       Planner       5-Criteria      Handoff
              Agents         Runbook        Check
```

---

## Phase 0: DISCOVER (New Features / Ambiguous Requests)

**Trigger:** Requirements unclear, new feature, L3+

**Skip if:** Request is crystal-clear and well-scoped.

### Step 0: Load Historical Context (ALWAYS)

Before any research or discovery, load learnings from previous sessions:

Read relevant MEMORY.md topic files based on the task domain:

```typescript
// Read auto-memory for accumulated patterns
Read({ file_path: "MEMORY.md" });

// Read domain-specific topic files if relevant to the task
```

> **Why:** `/evolve` captures anti-patterns, root causes, and stability rules after every fix.
> Without loading this context, `/plan` risks repeating known mistakes.

### Rules

- **One question at a time** — never overwhelm with multiple questions
- **Multiple choice preferred** — easier to answer than open-ended
- **Explore 2-3 approaches** — always present alternatives with trade-offs, lead with your recommendation and reasoning
- **Incremental validation** — present design in small sections (200-300 words), check after each
- **YAGNI ruthlessly** — remove unnecessary features from all designs

### Process

```typescript
// 1. Check current project state
Glob({ pattern: "**/*.ts", path: relevantDirectory });
Read({ file_path: "docs/plans/recent.md" });

// 2. Ask questions one at a time
AskUserQuestion({
  questions: [{
    question: "What is the primary user problem this feature solves?",
    header: "Goal",
    options: [
      { label: "Reduce manual work", description: "Automate repetitive tasks" },
      { label: "Enable new workflow", description: "Support a new use case" },
      { label: "Improve performance", description: "Speed up existing operations" },
    ],
  }],
});

// 3. Once understood, propose 2-3 approaches with trade-offs
// 4. Present chosen design incrementally, validate each section
// 5. Document validated design as input to RESEARCH phase
```

> **Reference:** `.claude/skills/planning/references/01-discover.md`

---

## Phase 1: RESEARCH (Always)

**Eliminate unknowns and lock in best-practice approach.**

### Research Cascade (in order)

```
1. Load `astro` skill (`.claude/skills/astro/`) — check relevant references first
2. Search codebase for patterns, conventions
3. Query Context7 for Astro v6 docs (library IDs below)
4. Tavily web search for best practices (only if 1-3 insufficient)
5. Sequential Thinking for complex decisions
```

### Context7 Astro Library IDs (Pre-resolved)

| Library ID | Best For |
| --- | --- |
| `/websites/v6_astro_build_en` | Astro 6 features, breaking changes |
| `/llmstxt/astro_build_llms-full_txt` | Comprehensive reference, code examples |

### Research Agent Routing

Route each research task to the correct agent based on **where the answer lives**:

> [!CRITICAL]
> **`explorer` = CUSTOM agent at `.claude/agents/explorer-agent.md`** — structured output with confidence scores, knowledge gaps, librarian requests.
> **NOT the built-in `Explore` agent.** Always use `subagent_type: "explorer"` (lowercase, exact).

| Research Type                | Agent       | Reason                        | Astro Skill Ref |
| ---------------------------- | ----------- | ----------------------------- | --------------- |
| Existing code patterns       | `explorer`  | Lives in codebase             | — |
| Files to modify              | `explorer`  | Lives in codebase             | — |
| Current conventions          | `explorer`  | Lives in codebase             | — |
| Astro components/pages       | `explorer`  | + Load `astro` skill          | core-concepts.md |
| Content Collections          | `explorer`  | + Load `astro` skill          | content-collections.md |
| Islands/hydration            | `explorer`  | + Load `astro` skill          | islands-architecture.md |
| Tailwind v4/@theme           | `explorer`  | + Load `astro` skill          | styling-tailwind.md |
| Library/package docs         | `librarian` | External knowledge            | — |
| Astro official docs          | `librarian` | Use Context7 library IDs      | configuration.md |
| Security best practices      | `librarian` | External knowledge (OWASP)    | — |
| Performance patterns         | `librarian` | External knowledge            | performance.md |

### Agent Allocation by Complexity

> [!IMPORTANT]
> **ALL research agents MUST use `run_in_background: true`** — always, regardless of complexity.
> The hook `task-routing-guard.sh` blocks any research agent call without it.

| Complexity | Agents                          | Multiple agents? |
| ---------- | ------------------------------- | ---------------- |
| L3         | 1 `explorer`                    | No (1 only)      |
| L4-L5      | 1-2 `explorer` + 1 `librarian`  | **YES**          |
| L6-L8      | 2-3 `explorer` + 2 `librarian`  | **YES**          |
| L9-L10     | 3+ `explorer` + 2+ `librarian`  | **MANDATORY**    |

### L3: Single Domain

> **AGENT NOTE:** `subagent_type: "explorer"` invokes the CUSTOM agent (`.claude/agents/explorer-agent.md`), NOT the built-in `Explore`. The custom agent returns structured Findings Tables with confidence scores. Do NOT substitute with `"Explore"`.

```typescript
Task({
  subagent_type: "explorer",
  prompt: `Research [topic] in codebase.

  Required outputs:
  - Findings Table with confidence scores (1-5)
  - Knowledge Gaps identified
  - Librarian Requests (if external docs needed)`,
  run_in_background: true,
});
```

### L4-L5: Multi-Domain (Parallel)

```typescript
// Internal codebase research
Task({
  subagent_type: "explorer",
  name: "codebase-research",
  prompt: `Research codebase for [feature]: find existing patterns, files to modify, conventions.`,
  run_in_background: true,
});

// External docs research (only if library/API involved)
Task({
  subagent_type: "librarian",
  name: "docs-research",
  prompt: `Find official documentation and best practices for [library/framework]. Focus on: version behavior, breaking changes, recommended patterns.`,
  run_in_background: true,
});
```

### L6+: Full Research Swarm

```typescript
// Internal
Task({ subagent_type: "explorer", name: "codebase-patterns", run_in_background: true });
Task({ subagent_type: "explorer", name: "impact-analysis", run_in_background: true });

// External
Task({ subagent_type: "librarian", name: "docs-official", run_in_background: true });
Task({ subagent_type: "librarian", name: "security-practices", run_in_background: true });
Task({ subagent_type: "librarian", name: "performance-patterns", run_in_background: true });
```

### Required Research Outputs

```markdown
## Findings Table
| # | Finding | Confidence (1-5) | Source | Impact |
|---|---------|------------------|--------|--------|
| 1 | ...     | 4                | code   | High   |

## Knowledge Gaps
- What remains unknown

## Assumptions to Validate
- Explicit assumptions needing confirmation

## Edge Cases (min 5 for L4+)
1. ...
2. ...
```

---

## Phase 2: PLAN (Before Implementation)

**Convert research into an execution runbook with bite-sized tasks.**

### Task Granularity — Each Step = One Atomic Action (2-5 minutes)

```
Step 1: Write the failing test          ← one action
Step 2: Run test to verify it fails     ← one action
Step 3: Implement minimal code          ← one action
Step 4: Run test to verify it passes    ← one action
Step 5: Commit                          ← one action
```

### Each Task Must Specify

- **Exact file paths** (with line ranges when modifying: `path/to/file.ts:123-145`)
- **Complete code** — never "add validation", provide the actual code
- **Exact validation commands** with expected output
- **Rollback steps**
- **Dependencies mapped** — mark `⚡ PARALLEL-SAFE` when independent

### Agent Assignment (Required for Each Task)

Every task must declare `**Agent:**`. Use this matrix:

| Task Domain                  | Agent                   | Skills to Load |
| ---------------------------- | ----------------------- | -------------- |
| General debugging            | `debugger`              | `debugger`, `astro` |
| Astro components, layouts    | `frontend-specialist`   | `astro`, `gpus-theme` |
| React Islands, animations    | `frontend-specialist`   | `astro` (islands-architecture) |
| Content Collections, data    | `frontend-specialist`   | `astro` (content-collections) |
| Tailwind v4, styling         | `frontend-specialist`   | `astro` (styling-tailwind), `gpus-theme` |
| Performance, security        | `performance-optimizer` | `performance-optimization`, `astro` (performance) |
| Documentation                | `oracle`                | — |
| Codebase research only       | `explorer`              | — |
| External docs research only  | `librarian`             | — |

### Task Template

```markdown
### Task 1: [Action verb] [component]

**File:** `src/components/CountdownTimer.tsx:45-67`
**Agent:** `debugger` | `frontend-specialist` | `performance-optimizer`
**Dependencies:** None ⚡ PARALLEL-SAFE | Depends on: Task X

**Code:**
```typescript
// Complete code here
```

**Validation:**
```bash
bunx astro check  # Expected: no errors
bun run build     # Expected: builds successfully
```

**Rollback:**
```bash
git checkout -- src/components/CountdownTimer.tsx
```
```

### Parallel Execution (L5+)

Group tasks without mutual dependencies under `[PARALLEL]` tags:

```markdown
[PARALLEL]
### Task 1: Add schema field
### Task 2: Update types
### Task 3: Add migration
[/PARALLEL]

### Task 4: Update router (depends on 1-3)
```

### Risk Assessment (L6+)

Run a pre-mortem analysis:

```markdown
## Pre-Mortem: "The plan failed. Why?"

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| ...  | High        | Medium | ...        |
```

> **Reference:** `.claude/skills/planning/references/pre-mortem-analysis.md`

### Architecture Decisions (L6+)

Document non-obvious choices with lightweight ADRs:

```markdown
## ADR-001: [Decision Title]

**Context:** Why this decision was needed
**Decision:** What was decided
**Consequences:** Trade-offs and implications
```

> **Reference:** `.claude/skills/planning/references/architecture-decisions.md`

**Output:** `docs/plans/YYYY-MM-DD-<feature-name>.md`

> **Reference:** `.claude/skills/planning/references/02-plan.md`

---

## Phase 2.5: PLAN SELF-REVIEW (Before Presenting)

**Before presenting the plan, self-evaluate against these 5 criteria:**

| # | Criterion            | Check                                                           |
|---|----------------------|-----------------------------------------------------------------|
| 1 | **Completeness**     | Does every requirement map to at least one task?                |
| 2 | **Atomicity**        | Is every step a single action (2-5 min)?                        |
| 3 | **Risk coverage**    | Are top risks identified with mitigations? (L6+)                |
| 4 | **Dependency order** | Can tasks execute in the listed order without blockers?         |
| 5 | **Rollback feasible**| Can each task be undone without cascading failures?             |
| 6 | **History check**    | Does the plan avoid known anti-patterns from MEMORY.md/MEMORY.md? |

**If any criterion fails:** Iterate on the plan before presenting. Do not present a plan that fails self-review.

> This implements the evaluator-optimizer pattern — the agent reviews its own output before human review.

---

## Phase 3: CONSOLIDATE & PRESENT

**After research complete, spawn project-planner:**

```typescript
Task({
  subagent_type: "project-planner",
  prompt: `Create implementation plan for: [user request]

## Research Findings
[Paste findings from explorer + librarian agents]

## Historical Context (from MEMORY.md)
[Paste relevant learnings from load_context output]
[Include known anti-patterns from MEMORY.md topic files that apply to this task domain]

## Requirements
[From discovery phase]

## Self-Review Checklist
- [ ] Completeness: All requirements mapped
- [ ] Atomicity: Each step = 2-5 min
- [ ] Risk coverage: Top risks mitigated
- [ ] History check: No known anti-patterns from MEMORY.md/MEMORY.md
- [ ] Dependency order: No blockers
- [ ] Rollback: Each task reversible

## Output
docs/plans/YYYY-MM-DD-<feature-name>.md

Use Skill("planning") for methodology.`,
});
```

### Present Format

```markdown
✅ Plan created: docs/plans/YYYY-MM-DD-<feature-name>.md

📊 Complexity: L{X} | Tasks: {N} | Parallel: {M} | Risks: {R}

✓ Self-Review Passed (5/5 criteria)

📋 Next:
1. /implement → Execute the plan
2. Review → Open plan file
3. Modify → Adjust before execution
4. **Full Auto** → Clear context + auto-accept edits + execute plan
   Step 1: `/clear`           — limpa o contexto da conversa
   Step 2: Ativar auto-accept  — pressione Shift+Tab para aceitar edições automaticamente
   Step 3: `/implement`        — executa o plano gerado
```

---

## Output Format (XML Tags)

For structured responses, use this template:

```xml
<answer>
  <reasoning>[step-by-step thinking]</reasoning>
  <main_point>[core finding or decision]</main_point>
  <evidence>[supporting facts with confidence score 1-5]</evidence>
  <conclusion>[actionable output]</conclusion>
</answer>
```

---

## Agent Team Alternative (L6+)

For complex cross-layer work:

```typescript
TeamCreate({ team_name: "plan-{slug}" });

TaskCreate({ subject: "Backend research", owner: "debugger" });
TaskCreate({ subject: "Frontend research", owner: "debugger" });
TaskCreate({ subject: "Database research", owner: "debugger" });
TaskCreate({ subject: "Security review", owner: "performance-optimizer" });
TaskCreate({ subject: "Create plan", owner: "project-planner" });
TaskCreate({ subject: "Self-review plan", owner: "project-planner", addBlockedBy: ["5"] });

TaskUpdate({ taskId: "1", owner: "debugger" });
TaskUpdate({ taskId: "2", owner: "debugger" });
TaskUpdate({ taskId: "3", owner: "debugger" });
TaskUpdate({ taskId: "4", owner: "performance-optimizer" });
TaskUpdate({ taskId: "5", owner: "project-planner" });
TaskUpdate({ taskId: "6", owner: "project-planner" });
```

---

## Quick Reference

```yaml
/plan → ROUTE → DISCOVER → RESEARCH → PLAN → SELF-REVIEW → PRESENT

DOMAIN ROUTING (CHECK FIRST):
Frontend creation → DELEGATE to /design (ui-ux-pro-max + frontend-specialist)
Config/Content    → Continue /plan workflow
Hybrid (FE + Data)→ Plan data/config, delegate frontend to /design

COMPLEXITY ROUTING:
L1-L2  → Direct fix (no /plan)
L3     → DISCOVER? → 1 explorer (background) → project-planner → self-review
L4-L5  → DISCOVER  → explorer + librarian (parallel background) → project-planner → self-review
L6-L8  → DISCOVER  → 2-3 explorers + 2 librarians (parallel bg) → project-planner → self-review OR Team
L9-L10 → DISCOVER  → 3+ explorers + 2+ librarians (mandatory parallel bg) → Team → self-review

GOLDEN RULES:
✓ LOAD HISTORY — MEMORY.md load_context + MEMORY.md BEFORE anything else
✓ ROUTE FIRST — frontend creation → /design immediately
✓ DISCOVER FIRST — clarify before researching
✓ RESEARCH ALWAYS — never implement blind, use background agents
✓ BITE-SIZED STEPS — each step = one action (2-5 min)
✓ EXACT CODE — complete code in plan, never vague instructions
✓ EXACT PATHS — file paths with line ranges
✓ ONE QUESTION — never overwhelm during discovery
✓ 2-3 APPROACHES — always explore alternatives
✓ YAGNI — remove unnecessary features ruthlessly
✓ SELF-REVIEW — evaluate plan against 6 criteria before presenting (includes history check)
✓ PRE-MORTEM (L6+) — imagine failure, identify and mitigate risks
✓ CONFIDENCE TAG — score every research finding 1-5
✓ AGENT ASSIGNMENT — every task must declare **Agent:** before /implement runs it
✓ PARALLEL-FIRST — default to [PARALLEL] phases; only use [SEQUENTIAL] when truly dependent
```

---

## References

- **Astro Framework:** `.claude/skills/astro/SKILL.md` — Components, Collections, Islands, Styling, Config, Performance, Troubleshooting
- **Methodology:** `.claude/skills/planning/SKILL.md`
- **Executor:** `.claude/agents/orchestrator.md`
- **Codebase Researcher:** `.claude/agents/explorer-agent.md` (internal)
- **External Researcher:** `.claude/agents/librarian.md` (external docs)
- **Implementation:** `.claude/commands/implement.md`
- **Frontend Design:** `.claude/commands/design.md` — DELEGATE for frontend creation tasks
- **Data Extraction:** `.claude/skills/planning/SKILL.md`
- **Discovery Protocol:** `.claude/skills/planning/references/01-discover.md`
- **Plan Template:** `.claude/skills/planning/references/02-plan.md`
- **Risk Classification:** `.claude/skills/planning/references/03-risk.md`
- **Pre-Mortem Analysis:** `.claude/skills/planning/references/pre-mortem-analysis.md`
- **Architecture Decisions:** `.claude/skills/planning/references/architecture-decisions.md`

---

