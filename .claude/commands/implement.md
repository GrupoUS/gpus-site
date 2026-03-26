---
description: Execute implementation plans created by orchestrator. Parses plan for agent assignments, handles parallel/sequential phases, spawns correct specialist per task.
---

# /implement — Execution Engine

**ARGUMENTS**:$ARGUMENTS

> **Plans come from:** `orchestrator` with D.R.P.I.V methodology
> **Plan format:** `docs/plans/YYYY-MM-DD-<feature>.md`

---

## 0. Pre-flight Check

### Verify Plan Exists

```bash
# Check for plan files
ls docs/plans/*.md 2>/dev/null || ls PLAN-*.md 2>/dev/null
```

| Source           | Action                                        |
| ---------------- | --------------------------------------------- |
| **File exists**  | Load `docs/plans/YYYY-MM-DD-*.md`             |
| **Chat context** | Extract tasks from current conversation       |
| **None found**   | **Suggest `/plan` first**                     |

---

## 1. Parse Plan Structure

### Extract from Plan File

```markdown
# [Feature Name] Implementation Plan

**Goal:** ...
**Complexity:** L[1-10]

### Phase 1: Foundation [SEQUENTIAL]

### Task 1: [Name]
**Files:** `src/components/Hero.astro:10-45`
**Agent:** `frontend-specialist`
**Dependencies:** None — PARALLEL-SAFE
...

### Phase 2: Core [PARALLEL]
> PARALLEL-SAFE

### Task 2: [Name]
**Agent:** `frontend-specialist`
...
```

### Parse Rules

1. **Complexity Level** — Determines execution mode
2. **Phase Type** — `[SEQUENTIAL]` or `[PARALLEL]`
3. **Agent Assignment** — `**Agent:** \`agent-name\``
4. **Dependencies** — Order or parallelize tasks

---

## 2. Mode Selection

| Complexity | Mode        | Action                            |
| ---------- | ----------- | --------------------------------- |
| **L1-L2**  | DIRECT      | Execute in main agent             |
| **L3-L5**  | SUBAGENTS   | `Task()` with `run_in_background` |
| **L6+**    | AGENT TEAMS | `TeamCreate` + `TaskCreate`       |

---

## 3. Agent Assignment Matrix

| Task Type                          | Agent                   | Skills                                    |
| ---------------------------------- | ----------------------- | ----------------------------------------- |
| Astro components, layouts, pages   | `frontend-specialist`   | `astro`, gpus-theme, ui-ux-pro-max        |
| React Islands, animations          | `frontend-specialist`   | `astro` (islands-architecture), gpus-theme |
| Content Collections, JSON data     | `frontend-specialist`   | `astro` (content-collections)             |
| Styling, Tailwind v4, @theme       | `frontend-specialist`   | `astro` (styling-tailwind), gpus-theme    |
| View Transitions, ClientRouter     | `frontend-specialist`   | `astro` (view-transitions)                |
| Performance, a11y, SEO             | `performance-optimizer` | performance-optimization, `astro` (performance) |
| Build errors, TypeScript           | `debugger`              | `astro` (troubleshooting), debugger       |
| Codebase research                  | `explorer`              | planning                                  |
| External docs research             | `librarian`             | —                                         |
| Astro docs research                | `librarian`             | Context7: `/websites/v6_astro_build_en`   |
| Architecture consultation          | `oracle`                | read-only analysis                        |

**Rule:** Every task in the plan MUST specify `**Agent:**`. If missing, use domain detection above.

---

## 4. Mode A: DIRECT (L1-L2)

Single domain, 1-3 tasks, no parallelism needed.

```bash
# Execute tasks directly, run gates after each
bunx astro check
```

---

## 5. Mode B: SUBAGENTS (L3-L5)

Multi-domain, parallel tasks, no complex dependencies.

### Sequential Phase Execution

```typescript
// SEQUENTIAL phase - execute one at a time
for (const task of phase1Tasks) {
  await Task({
    subagent_type: task.agent, // From **Agent:** field
    prompt: `Execute: ${task.name}

FILE: ${task.file}
${task.code}

Run: bunx astro check`,
    run_in_background: false, // Sequential
  });
}
```

### Parallel Phase Execution

```typescript
// PARALLEL phase - spawn all simultaneously
const parallelTasks = phase2Tasks.map(task =>
  Task({
    subagent_type: task.agent, // From **Agent:** field
    prompt: `Execute: ${task.name}

FILE: ${task.file}
${task.code}

Run: bunx astro check`,
    run_in_background: true, // Parallel background task
  })
);

// Wait for all and collect background output
await Promise.all(parallelTasks.map(id => background_output(id)));
```

### PARALLEL-FIRST Default

Always spawn parallel when tasks are in a `[PARALLEL]` phase or marked `PARALLEL-SAFE`:

```typescript
// Spawn ALL parallel tasks in single message (one tool call block)
Task({ subagent_type: "frontend-specialist", prompt: "...", run_in_background: true });
Task({ subagent_type: "performance-optimizer", prompt: "...", run_in_background: true });
// Wait for background outputs before proceeding to next phase
```

> Rule: `run_in_background: true` is MANDATORY for all parallel tasks.
> Never spawn parallel tasks sequentially — that defeats the purpose.

### Complete Spawn Pattern

```typescript
// Example: Plan with mixed phases

// Phase 1: Foundation [SEQUENTIAL]
await Task({
  subagent_type: "frontend-specialist",
  prompt: `Execute: Create Astro layout and base page structure...`,
  run_in_background: false,
});

// Phase 2: Core [PARALLEL]
// PARALLEL-SAFE
Task({ subagent_type: "frontend-specialist", prompt: `Execute: Hero section component...`, run_in_background: true });
Task({ subagent_type: "frontend-specialist", prompt: `Execute: React Island (Countdown)...`, run_in_background: true });

// Wait for parallel tasks, then continue
// Phase 3: Polish [SEQUENTIAL]
await Task({
  subagent_type: "performance-optimizer",
  prompt: `Execute: Performance audit and optimization...`,
  run_in_background: false,
});

// Final quality gates
bunx astro check && bun run build
```

---

## 6. Mode C: AGENT TEAMS (L6+)

4+ domains, complex dependencies, requires coordination.

### Orchestrator Pattern

```typescript
// 1. Create Team
TeamCreate({
  team_name: "implement-feature",
  description: "Multi-domain development team for feature X",
});

// 2. Create Tasks with Dependencies (from plan)
// Parse plan for dependencies
TaskCreate({
  subject: "Hero Section",
  description: "Build hero with animated headline and CTA",
  addBlocks: ["performance-audit"], // Blocks perf audit
});
TaskCreate({
  subject: "React Islands",
  description: "Implement Countdown, FAQ, and Testimonials islands",
  addBlocks: ["performance-audit"], // Blocks perf audit
});
TaskCreate({
  subject: "Content Collections",
  description: "Define schemas and populate event data",
  // No dependencies - parallelizable
});
TaskCreate({
  subject: "Performance Optimization",
  description: "Lighthouse audit, image optimization, a11y checks",
  addBlockedBy: ["hero-section", "react-islands"], // Depends on components
});

// 3. Assign Tasks to Specialists (from **Agent:** field)
TaskUpdate({ taskId: "Hero Section", owner: "frontend-specialist" });
TaskUpdate({ taskId: "React Islands", owner: "frontend-specialist" });
TaskUpdate({ taskId: "Content Collections", owner: "frontend-specialist" });
TaskUpdate({ taskId: "Performance Optimization", owner: "performance-optimizer" });

// 4. Enter Delegate Mode (Coordination Only)
// Press Shift+Tab to enter Delegate Mode
```

### Team Operations & Communication

```typescript
// Direct Message
SendMessage({
  type: "message",
  recipient: "frontend-specialist",
  content: "Content collections are ready for component integration.",
});

// Broadcast (Critical Blockers Only)
SendMessage({
  type: "broadcast",
  content: "Changing layout structure, please hold.",
});

// Graceful Shutdown
SendMessage({
  type: "shutdown_request",
  recipient: "frontend-specialist",
  content: "Work complete",
});

// Cleanup
TeamDelete();
```

---

## 7. Execution Flow

```
1. PARSE plan — Extract: complexity, phases, tasks, agents, dependencies
2. SELECT mode — Based on complexity (L1-L10)
3. SPAWN agents — Based on **Agent:** field in each task
4. EXECUTE phases — Sequential or parallel per plan
5. VALIDATE — Run quality gates after each phase
6. COMPLETE — Present options to user
```

### Phase Execution Order

```markdown
### Phase 1: Foundation [SEQUENTIAL]
> Execute tasks one-by-one, wait for each

### Phase 2: Core [PARALLEL]
> PARALLEL-SAFE
> Spawn all tasks simultaneously, wait for all

### Phase 3: Polish [SEQUENTIAL]
> Execute tasks one-by-one, wait for each
```

---

## 8. Quality Gates

```bash
# After each task
bun run lint              # Biome + oxlint
bunx astro check          # TypeScript + Astro validation

# After each phase
bun run lint && bunx astro check && bun run build   # Full validation

# Final
bun run lint && bunx astro check && bun run build   # Full validation must succeed
```

### Gate Enforcement

- **After each task:** Run `bunx astro check` (quick)
- **After each phase:** Run `bunx astro check && bun run build`
- **Final:** Run `bunx astro check && bun run build`

### Gate Timing

- **After each task:** `bunx astro check` (fast Astro/TypeScript gate)
- **After each [SEQUENTIAL] phase:** `bunx astro check && bun run build`
- **After all [PARALLEL] tasks complete:** `bunx astro check && bun run build`
- **Final:** `bunx astro check && bun run build`

---

## 9. Failure Handling

1. **Pause** — Don't retry immediately
2. **Identify** — Which task failed?
3. **Debug** — Run `/debug` workflow
4. **Fix** — Minimal, targeted fix
5. **Verify** — Re-run gates before continuing

### Retry Policy

| Failure Count | Action |
|---------------|--------|
| 1st | Retry same task |
| 2nd | Break into smaller tasks |
| 3rd | Switch mode OR escalate to oracle |

---

## 10. Cleanup (Agent Teams)

```typescript
// Graceful shutdown all teammates
SendMessage({ type: "shutdown_request", recipient: "frontend-specialist", content: "Complete" });
SendMessage({ type: "shutdown_request", recipient: "performance-optimizer", content: "Complete" });
// ... for all teammates

// After confirmations
TeamDelete();
```

---

## 11. Completion Options

After all tasks pass gates, present:

```
Implementation complete!

Summary:
  - Tasks completed: {N}
  - Phases: {sequential_count} sequential, {parallel_count} parallel
  - Agents used: frontend-specialist, performance-optimizer

What would you like to do?

1. **Merge back to <base-branch> locally**
2. **Push and create a Pull Request**
3. **Keep the branch as-is**
4. **Discard this work**

Which option?
```

| Option     | Actions                                                                                           |
| ---------- | ------------------------------------------------------------------------------------------------- |
| 1. Merge   | `git checkout base && git pull && git merge branch && bun run build && git branch -d branch`      |
| 2. PR      | `git push -u origin branch && gh pr create`                                                       |
| 3. Keep    | Report branch name                                                                                |
| 4. Discard | Require "discard" confirmation — `git branch -D branch`                                           |

---

## 12. Proximos Passos (Pos-Implementacao)

```
Implementacao completa!

Proximos passos:
1. /evolve — Autoresearch (opcional, com <evolve_request>) + captura de aprendizados (recomendado)
2. Testar em staging — Validar em ambiente real
3. Documentar — Atualizar README se necessario
```

O `/evolve` pode primeiro rodar **EVOLVE_AUTORESEARCH** (baseline, evals objetivos, keep/discard) quando houver `<evolve_request>`; depois executa simplify/gates, memory, GSD e session-report. Sem request, apenas a fase de captura.

---

## Quick Reference Card

```
/implement workflow:

PARSE > SELECT MODE > SPAWN AGENTS > EXECUTE PHASES > VALIDATE > COMPLETE

Complexity > Mode:
  L1-L2  > DIRECT (main agent)
  L3-L5  > SUBAGENTS (Task with run_in_background)
  L6+    > AGENT TEAMS (TeamCreate + TaskCreate)

Agent Routing:
  **Agent:** `frontend-specialist` > Task({ subagent_type: "frontend-specialist" })
  **Agent:** `performance-optimizer` > Task({ subagent_type: "performance-optimizer" })
  **Agent:** `explorer` > Task({ subagent_type: "explorer" })

Phase Execution:
  [SEQUENTIAL] > One at a time
  [PARALLEL]   > All at once (run_in_background: true as parallel task)

Quality Gates:
  After task  > bunx astro check
  After phase > bunx astro check && bun run build
  Final       > bunx astro check && bun run build
```

---

## Astro Implementation Checklist

Before marking any Astro task as complete, verify:

- [ ] `.astro` components for static content (zero JS default)
- [ ] React islands only for Aceternity UI visual effects (`src/components/ui/`) — `client:idle` (hero visual-only) ou `client:visible` (below fold); `client:load` só se houver interação crítica imediata
- [ ] Content data via `getCollection()` — mapped to `.data` for React props
- [ ] Tailwind v4 tokens from `@theme {}` — no hardcoded hex
- [ ] Fonts via Astro 6 Fonts API (self-hosted) — no Google CDN
- [ ] Images with explicit `width`/`height` — LCP image: `loading="eager"` + `fetchpriority="high"`
- [ ] Animations: `transform`/`opacity` only, `prefers-reduced-motion` support
- [ ] `bun run lint && bunx astro check && bun run build` passes

## References

- **astro skill** — `.claude/skills/astro/SKILL.md` — Full Astro 6 reference
- **orchestrator.md** — Plan creation with D.R.P.I.V methodology
- **CLAUDE.md** — Orchestration, agent types, skill routing
- **planning skill** — D.R.P.I.V workflow reference
