# Plan: Agent Orchestration & senior-prompt-engineer Wiring

**Complexity:** L6 — Architecture-grade refactor across 3 surfaces (`.claude/agents/*`, `.claude/skills/senior-prompt-engineer/`, `.claude/commands/_shared.md` + `.claude/CLAUDE.md`). Multi-file, irreversible-ish (changes how every command spawns agents).
**Layers:** Skill content (SKILL.md + references) → Agent frontmatter (`skills:` preload + system prompts) → Shared orchestration contract (`_shared.md`) → Project rules (`CLAUDE.md` routing matrix + stopping conditions) → Command consumers (`/plan`, `/implement`, `/delegate`, `/debug`, `/verify`, `/research`, `/design`).
**Assumptions:**
- `[ASSUMED]` user wants the existing `senior-prompt-engineer` skill rewired (not a new skill) — name is correct, role mismatch is the problem.
- `[ASSUMED]` we keep the 12 existing agents; no new agent files.
- `[ASSUMED]` Claude Code runtime supports the `skills:` frontmatter field on subagents (verified against official docs https://code.claude.com/docs/en/sub-agents § "Preload skills into subagents").
- `[ASSUMED]` `disable-model-invocation` is **not** set on `senior-prompt-engineer` (precondition for preloading per docs).

---

## Context — Why this change

**User request:** Audit Claude Code best practices, see how `.claude/agents/` use the `senior-prompt-engineer` skill, improve agent handoff/orchestration, and verify commands invoke agents efficiently with clear orchestration rules in `.claude/CLAUDE.md`.

**What audit found (3 parallel Explore agents + Anthropic official docs):**

| # | Finding | Confidence | Source |
|---|---|---|---|
| 1 | **Zero of 12 agents reference `senior-prompt-engineer`** in body or frontmatter. The skill is dead-wired into the system. | 5 | grep across `.claude/agents/*.md` |
| 2 | `senior-prompt-engineer/SKILL.md` is generic ML/MLOps boilerplate (Python toolchain, K8s, Prometheus) — **no Claude Code subagent contracts, no handoff schemas, no agent-design templates**. The "agent_orchestrator.py" script is a stub. | 5 | `SKILL.md:1-227` direct read |
| 3 | `_shared.md § 6 Skill-to-Domain Matrix` lists `senior-prompt-engineer` only for "Plan / decompose (if AI feature)" + "Prompt engineering / LLM apps / RAG" — never for **agent prompt construction itself**, which is its real opportunity. | 5 | `_shared.md:148-160` |
| 4 | Agents that DO invoke skills (`debugger`, `frontend-specialist`, `mobile-developer`, `orchestrator`, `performance-optimizer`, `project-planner`) call `Skill()` from inside the body. **None use the `skills:` frontmatter preload field** (Anthropic-recommended pattern). | 4 | agent file reads + Anthropic docs |
| 5 | **Handoff contracts are markdown prose**, not validated schemas. `## Context Handoff` block format varies between `debugger`, `frontend-specialist`, `mobile-developer`. Parallel-batch agents (`/research`, `/debug`) have **no shared output schema** — consolidation is manual. | 4 | agent files + `_shared.md § 7` |
| 6 | `orchestrator.md` mandates 5 context fields when spawning (`MANDATORY CONTEXT` block, line 269-280) — best practice in this repo. **Not adopted** by `/delegate`, `/implement`, `/debug`, `/research`. | 5 | command files |
| 7 | Anthropic official guidance: "tool documentation often more important than prompts" + "skill descriptions are loaded into context so Claude knows what's available, but full skill content only loads when invoked. Subagents with preloaded skills work differently: the full skill content is injected at startup." (`code.claude.com/docs/en/skills`, `code.claude.com/docs/en/sub-agents`) | 5 | WebFetch verbatim |
| 8 | `senior-prompt-engineer` description (`SKILL.md:3`) is generic enough that Claude won't reliably auto-trigger it from agent context — Anthropic docs warn: "Make the description more specific" / "Front-load the key use case". | 4 | docs + grep no auto-triggers in 5 sessions of agent runs |
| 9 | Coordinator pattern in `/implement § 6` lacks max-iteration limit; an agent can loop on REVISION_REQUIRED forever. | 4 | `implement.md:150-215` |
| 10 | `/perf fix` mode spawns 1 agent per failing route without clustering by root cause — wastes spawns. Hits the 5-spawn cap fast. | 3 | `perf.md:119-127` |

**Root cause:** `senior-prompt-engineer` was added as a "knowledge" skill but never wired into the place it belongs — **agent prompt construction + handoff schema authoring**. Meanwhile, the orchestration layer is functional but uneven: `orchestrator.md` is rigorous, other agents drift from its contract. CLAUDE.md routes to skills/rules but doesn't enforce a **single canonical handoff schema** that every parallel batch must satisfy.

**Intended outcome:** `senior-prompt-engineer` becomes the **single source of truth for Claude Code agent prompt contracts** in this repo. It ships (a) the canonical handoff JSON schema, (b) the orchestrator-spawn template (5 context fields), (c) parallel-batch return contracts, (d) coordinator failure-recovery semantics. Key process agents (`orchestrator`, `project-planner`, `evaluator`, `debugger`) preload it via the `skills:` frontmatter field. CLAUDE.md routing matrix gains a "Handoff schema" row pointing at it. Net effect: less ambient drift, mechanical consolidation of parallel agent output, fewer wasted spawns.

---

## Phase 1 — Refactor `senior-prompt-engineer` into an Agent-Orchestration Skill [SEQUENTIAL]

**Why first:** Every later phase preloads this skill or references its files. Need it correct before wiring agents.

### 1.1 Rewrite `SKILL.md` (project scope)

- [ ] `.claude/skills/senior-prompt-engineer/SKILL.md` — rewrite frontmatter + body. **Delete the generic ML/MLOps content** (Python K8s/Prometheus stack, latency targets, "Senior-Level Responsibilities").
  - **New `description`** (front-load Claude Code intent): `"Canonical contract for Claude Code subagent design, handoff schemas, orchestrator spawn templates, parallel-batch return contracts, and coordinator failure-recovery rules. Use when authoring or editing .claude/agents/*.md, designing multi-agent commands in .claude/commands/, building handoff schemas, or when a parallel batch needs a shared return contract. Also covers prompt engineering for application-level LLM features (RAG, structured outputs, eval harnesses)."`
  - **Keep `name: senior-prompt-engineer`** (existing references in `_shared.md § 6` and elsewhere stay valid).
  - **Body sections (≤ 500 lines per Anthropic guidance):**
    1. *Purpose & scope* — "this skill governs how Claude Code agents talk to each other in this repo".
    2. *Subagent file contract* — required frontmatter fields per Anthropic spec (`name`, `description`, `tools` or `disallowedTools`, `model`, optional `skills`, `permissionMode`, `maxTurns`, `isolation`); minimum body sections (Role · Iron Laws · Phases · Handoff Format · Stopping Conditions).
    3. *Description guidelines* — front-load use case, include trigger phrases ("Use when…"), max 1,536 chars (per Anthropic doc).
    4. *Spawn template* — the 5 mandatory context fields from `orchestrator.md:269-280` (Original request · User decisions · Prior agent findings · Current plan state · Do NOT redo) — promoted to canonical.
    5. *Handoff Contract Schema* — the markdown + JSON shape returned by every agent (links to `references/agent-handoff-contracts.md`).
    6. *Parallel-batch shared contract* — when ≥2 agents run in one message, all must return same columns/severity scale (links to `references/parallel-batch-contracts.md`).
    7. *Coordinator failure recovery* — max 2 resubmissions per task before escalating to main agent → `/debug recover` (closes Gap 5 from audit).
    8. *Skill preload pattern* — when to use `skills:` frontmatter vs. body-level `Skill()` calls (Anthropic-recommended for process agents that always need the same context).
    9. *Application-level prompt engineering* — short pointer section (RAG, structured outputs, evals) deferred to references.
  - **Verify:** `bunx astro check` (no impact, but baseline) + manual review that file < 500 lines.

### 1.2 Add new reference: handoff contract schema

- [ ] `.claude/skills/senior-prompt-engineer/references/agent-handoff-contracts.md` — new file. Defines the canonical structured handoff:
  ```markdown
  ## Context Handoff
  - **Status:** COMPLETED | BLOCKED | REVISION_REQUIRED
  - **Confidence:** 1-5
  - **Artifacts:** [{ path, lines, action }]
  - **Quality gates:** [{ name, status: PASS|FAIL, evidence }]
  - **Decisions:** [{ what, why }]
  - **Risks:** [{ desc, mitigation }]
  - **Next agent:** <name> | NONE
  - **Resume hint:** <one sentence for the next agent>
  ```
  Also ship a **JSON variant** for tooling (`/verify` consolidator). Document field semantics + invariants (e.g., `BLOCKED` requires `Risks[].mitigation`; `REVISION_REQUIRED` requires explicit failure list).

### 1.3 Add new reference: parallel-batch return contracts

- [ ] `.claude/skills/senior-prompt-engineer/references/parallel-batch-contracts.md` — new file.
  - Findings table schema (used by `/research`, `/debug` parallel agents): `# | Finding | Confidence (1-5) | Source | Impact (Low/Med/High)`.
  - Severity scale: P0 (ship-blocker) · P1 (must fix this PR) · P2 (next sprint) · P3 (nice-to-have).
  - Consolidation rule: when N parallel agents return, the parent merges by deduping `Finding` strings and taking max(`Confidence`, `Impact`).

### 1.4 Reduce / repurpose existing references

- [ ] `.claude/skills/senior-prompt-engineer/references/prompt_engineering_patterns.md` — keep as **application-level RAG / few-shot / CoT reference** (not agent-handoff). Trim ML/MLOps boilerplate.
- [ ] `.claude/skills/senior-prompt-engineer/references/llm_evaluation_frameworks.md` — keep as **eval harness reference** for AI features (used by `evaluator` Mode 3 and `/evolve`).
- [ ] `.claude/skills/senior-prompt-engineer/references/agentic_system_design.md` — **rewrite** as Claude Code-specific: "agent vs. agent team", "subagent spawn vs. skill preload", linking back to Anthropic docs URLs.
- [ ] `.claude/skills/senior-prompt-engineer/scripts/` — **leave dormant**. Stub Python scripts (`prompt_optimizer.py`, `rag_evaluator.py`, `agent_orchestrator.py`) are unused; don't waste effort but document in SKILL.md that scripts/ is reserved for future eval harness automation.

**Verify Phase 1:** `bunx astro check` (sanity) + `wc -l .claude/skills/senior-prompt-engineer/SKILL.md` < 500 + grep `senior-prompt-engineer` returns the new description.

---

## Phase 2 — Wire `senior-prompt-engineer` into process agents via `skills:` preload [PARALLEL]

**Why parallel:** four agent files, independent edits.

### 2.1 `orchestrator.md`

- [ ] `.claude/agents/orchestrator.md` — add `skills:` to frontmatter:
  ```yaml
  skills:
    - senior-prompt-engineer
    - planning
    - evolution-core
  ```
  Per Anthropic docs: "Subagents don't inherit skills from the parent conversation; you must list them explicitly." Replace the body's `Skill("planning")` MANDATORY block with a one-liner: "Methodology preloaded via `skills:` frontmatter." Replaces 4 lines of repetition.
- [ ] Update body section "Agent Assignment Matrix" to **point at `senior-prompt-engineer/references/agent-handoff-contracts.md` for the spawn template** instead of duplicating the 5 mandatory context fields inline (single source of truth).

### 2.2 `project-planner.md`

- [ ] `.claude/agents/project-planner.md` — add `skills:` frontmatter:
  ```yaml
  skills:
    - senior-prompt-engineer
    - planning
  ```
  Replace inline self-review checklist references with a pointer to handoff schema for the plan output.

### 2.3 `evaluator.md`

- [ ] `.claude/agents/evaluator.md` — add `skills:` frontmatter:
  ```yaml
  skills:
    - senior-prompt-engineer
  ```
  Mode 3 (Architecture Analysis) needs the multi-lens patterns — preload guarantees they're there.
  Update Mode 1 (Plan Review) + Mode 2 (Sprint QA) to **score plans/sprints against the handoff contract schema** (new gate: "Plan defines handoff schema for each agent it assigns? Y/N").

### 2.4 `debugger.md`

- [ ] `.claude/agents/debugger.md` — add `skills:` frontmatter:
  ```yaml
  skills:
    - debugger
    - senior-prompt-engineer
  ```
  Why: when debugger escalates to evaluator after 3 fix failures, it must hand off using the canonical schema — preloading guarantees consistency. No body changes; just frontmatter.

**Verify Phase 2:** for each agent file, `head -20 .claude/agents/<file>.md` shows new `skills:` field; manually re-read each `Skill("…")` body call — remove duplicates that the preload now covers.

**Out of scope this phase:**
- `frontend-specialist`, `performance-optimizer`, `mobile-developer`, `code-reviewer`, `verification-agent`, `oracle`, `librarian`, `explorer-agent` — they're domain/leaf agents; preloading prompt-engineering content would waste their context. They keep body-level `Skill()` calls only when actually needed. Re-evaluate after Phase 5 with usage data.

---

## Phase 3 — Add canonical Handoff Schema to `_shared.md` [SEQUENTIAL after Phase 1]

**Why now:** commands consume `_shared.md`. Once the schema exists in the skill, `_shared.md` references it as the SSOT.

- [ ] `.claude/commands/_shared.md` — insert new **Section 7.5: Handoff Contract Schema** between current § 7 (Parallel Spawn) and § 8 (Sequential Phase Gating). One paragraph + link:
  ```markdown
  ## Section 7.5: Handoff Contract Schema
  All agents — single, parallel-batch, or coordinator-managed — return findings using the canonical schema in
  `.claude/skills/senior-prompt-engineer/references/agent-handoff-contracts.md`. Parallel batches additionally
  conform to `references/parallel-batch-contracts.md` (shared columns + severity scale).
  Spawn template (5 mandatory context fields) lives in the same skill. Commands MUST inject these fields into
  every `Agent()` prompt; do not duplicate the field list in command bodies — link to the SSOT.
  ```
- [ ] `.claude/commands/_shared.md § 6 Skill-to-Domain Matrix` — change row "Plan / decompose / architecture decision" to list `senior-prompt-engineer` as **mandatory supporting skill for any task that spawns ≥2 agents** (not "if AI feature"). Add a new row: "Multi-agent orchestration / handoff design" → primary `senior-prompt-engineer`.
- [ ] `.claude/commands/_shared.md § 3 Agent Assignment Matrix` — add a footnote: "Every spawn must carry the 5 mandatory context fields from `senior-prompt-engineer`. See § 7.5."

**Verify Phase 3:** `grep "agent-handoff-contracts" .claude/commands/*.md` returns hits in commands that previously duplicated handoff format.

---

## Phase 4 — CLAUDE.md routing + stopping conditions [SEQUENTIAL after Phase 3]

**Why now:** CLAUDE.md is Tier 1 always-loaded. Tighten orchestration rules with the new SSOT.

- [ ] `.claude/CLAUDE.md § Routing matrix` — append row:
  ```
  | Agent prompt or new agent file | senior-prompt-engineer skill | .claude/agents/<name>.md (frontmatter + body) |
  | Multi-agent command (parallel batch) | senior-prompt-engineer + _shared § 7.5 | .claude/commands/<cmd>.md |
  ```
- [ ] `.claude/CLAUDE.md § Stopping conditions` — add explicit coordinator rule (closes audit Gap 5):
  ```
  - **Coordinator max-iteration:** any agent-team coordinator returns BLOCKED to main after 2 consecutive
    REVISION_REQUIRED on the same task → main calls /debug recover (do not escalate to user mid-loop).
  ```
- [ ] `.claude/CLAUDE.md § Skill invocation` — clarify: "Process skills (`planning`, `debugger`, `evolution-core`, `senior-prompt-engineer`) used by an agent SHOULD be preloaded via the `skills:` frontmatter field (Anthropic-recommended). Body-level `Skill()` calls remain valid for ad-hoc / conditional invocation."

**Verify Phase 4:** `wc -l .claude/CLAUDE.md` still under tier-1 budget (combined with `AGENTS.md` < 500 lines per existing constraint at `CLAUDE.md:3`).

---

## Phase 5 — Command consumers: cite the new SSOT, remove duplication [PARALLEL]

**Why parallel:** independent command files, mechanical replacements.

### 5.1 `/delegate`

- [ ] `.claude/commands/delegate.md` — replace the manually-listed 7-section delegation declaration with: "Use the spawn template from `senior-prompt-engineer/references/agent-handoff-contracts.md § Spawn template`." Keep `REQUIRED_SKILLS` field but make it auto-derived from file paths via `_shared § 6` (deterministic skill binding — closes audit Gap 2).

### 5.2 `/implement`

- [ ] `.claude/commands/implement.md § 6 Coordinator pattern` — append max-iteration rule (closes Gap 5):
  ```
  Max 2 agent resubmissions per task on REVISION_REQUIRED. After the 2nd → coordinator returns
  `BLOCKED: <criterion>` to main agent (NOT user). Main agent invokes /debug recover.
  ```
- [ ] Replace inline 5-context-field block with link to `senior-prompt-engineer/references/agent-handoff-contracts.md`.

### 5.3 `/research`

- [ ] `.claude/commands/research.md` — when spawning `explorer` + `librarian` in parallel, both prompts must reference `parallel-batch-contracts.md` for the shared findings table. Inject **tool-precedence guidance** into librarian prompt (Context7 first for API signatures; Tavily fallback for CVE/community news — closes audit Gap 3).

### 5.4 `/debug`, `/verify`, `/perf`, `/design`

- [ ] Mechanical: replace each command's local handoff format prose with a one-line link to the SSOT. No behavior change.
- [ ] `.claude/commands/perf.md § 2.5` — add cluster-by-root-cause step before spawning per-route fixers (closes Gap 6/10):
  ```
  Cluster failing routes by suspected shared root cause (e.g., unoptimized hero image, missing preconnect)
  before spawning. One agent per cluster, not per route. Re-measure all routes after each cluster fix.
  ```
- [ ] `.claude/commands/verify.md § 0.2` — add codex-plugin availability check before Phases 5-6 (closes audit Gap 4): if missing → ask user (skip / escalate to evaluator / abort), don't silently fall through.

**Verify Phase 5:** for each touched command, `grep "agent-handoff-contracts\|parallel-batch-contracts" .claude/commands/<cmd>.md` returns ≥1 hit; `grep -c "MANDATORY CONTEXT"` returns 1 (only in skill, not duplicated in commands).

---

## Phase 6 — Validation & docs [SEQUENTIAL final]

- [ ] **Sanity gates:** `bun run lint && bunx astro check && bun run build` — repo build must still pass (no `src/` changes, but `_shared.md` and CLAUDE.md changes can affect skill listings if frontmatter malformed).
- [ ] **Skill-listing smoke:** start a fresh Claude Code session, run `/agents` (Library tab), confirm `senior-prompt-engineer` description shows the new front-loaded text and is < 1,536 chars.
- [ ] **Preload smoke:** spawn `orchestrator` agent on a trivial planning task; confirm in transcript that `senior-prompt-engineer` content was injected at startup (look for handoff schema being referenced without explicit `Skill()` call).
- [ ] **Parallel-batch smoke:** run `/research <small question>`; confirm `explorer` + `librarian` return rows in the same column shape per `parallel-batch-contracts.md`.
- [ ] **AGENTS.md learnings log entry:** append a `[2026-05-01]` block summarizing the rewire (per existing chronological log convention at `AGENTS.md § Learnings log`).

---

## Critical files to modify (summary)

| File | Phase | Change type |
|---|---|---|
| `.claude/skills/senior-prompt-engineer/SKILL.md` | 1.1 | Rewrite |
| `.claude/skills/senior-prompt-engineer/references/agent-handoff-contracts.md` | 1.2 | New |
| `.claude/skills/senior-prompt-engineer/references/parallel-batch-contracts.md` | 1.3 | New |
| `.claude/skills/senior-prompt-engineer/references/{prompt_engineering_patterns,llm_evaluation_frameworks,agentic_system_design}.md` | 1.4 | Trim / rewrite |
| `.claude/agents/orchestrator.md` | 2.1 | Frontmatter + body trim |
| `.claude/agents/project-planner.md` | 2.2 | Frontmatter |
| `.claude/agents/evaluator.md` | 2.3 | Frontmatter + Mode 1/2 gate |
| `.claude/agents/debugger.md` | 2.4 | Frontmatter |
| `.claude/commands/_shared.md` | 3 | Insert § 7.5 + matrix updates |
| `.claude/CLAUDE.md` | 4 | Routing matrix + stopping conditions + skill invocation note |
| `.claude/commands/{delegate,implement,research,debug,verify,perf,design}.md` | 5 | Replace local handoff prose with SSOT links + targeted gap fixes |
| `AGENTS.md` (root) | 6 | Learnings log entry |

**Existing utilities to reuse (do not recreate):**
- `orchestrator.md:269-280` 5 mandatory context fields → promote to skill SSOT, don't reinvent.
- `evaluator.md` 3-mode dispatcher → already correct; just gain handoff-schema gate.
- `_shared.md § 7 Parallel spawn pattern` → already correct; gain § 7.5 cross-link.
- `_shared.md § 9 Verdict Matrix` → already correct; cite handoff schema as source for `Status` cells.

---

## Risks & Mitigations

| Risk | Mitigation |
|---|---|
| **Preloading `senior-prompt-engineer` into 4 process agents inflates their context window cost** | Skill body capped at 500 lines per Anthropic guidance; 4 agents × ~5K tokens = ~20K tokens preloaded — acceptable (well below 200K context). Re-evaluate after Phase 5 with measured token cost. |
| **Existing agents that previously called `Skill("planning")` etc. lose the skill if we delete the body call before frontmatter is correct** | Phase 2 sequencing: add `skills:` frontmatter THEN remove body call (not the inverse). Verify with `/agents` Library tab inspection between sub-tasks. |
| **`disable-model-invocation` accidentally set on `senior-prompt-engineer`** | Phase 1.1 explicitly does NOT set this field. Per Anthropic: "You cannot preload skills that set `disable-model-invocation: true`." |
| **Description rewrite breaks `_shared.md § 6` matrix lookups** | Skill `name` stays `senior-prompt-engineer`. Lookups are by name, not description. |
| **Coordinator max-iteration rule (`/implement § 6`) breaks an in-flight long-running implementation** | Rule applies forward-only; existing implementations finish with old logic. Document in PR notes. |
| **Tier-1 line budget overrun (CLAUDE.md + AGENTS.md < 500)** | Phase 4 changes are < 15 lines net. Verify in Phase 6 with `wc -l`. |
| **Plugin-published skills (gsd:, codex:, caveman:) might also reference handoff schema** | Out of scope — those skills are external. Project-level SSOT lives in `senior-prompt-engineer`; plugins remain self-governed. |

---

## Verification — end-to-end

```bash
# Phase 6 commands, run in order:
bun run lint
bunx astro check
bun run build
wc -l .claude/CLAUDE.md AGENTS.md          # combined < 500
wc -l .claude/skills/senior-prompt-engineer/SKILL.md   # < 500
grep -l "senior-prompt-engineer" .claude/agents/*.md   # ≥ 4 hits (orchestrator, project-planner, evaluator, debugger)
grep -l "agent-handoff-contracts.md" .claude/commands/*.md  # ≥ 5 hits
grep -rn "MANDATORY CONTEXT" .claude/agents .claude/commands  # exactly 1 (skill SSOT only)
```

Then in a fresh Claude Code session:
1. `/agents` → Library tab → confirm `senior-prompt-engineer` description front-loads "Canonical contract for Claude Code subagent design…"
2. `/research "how is whatsapp.ts wired?"` → confirm `explorer` + `librarian` return identical-shape findings tables.
3. `/plan` on a small fake feature → confirm orchestrator/project-planner reference handoff schema in plan output without re-citing 5 fields verbatim.
4. Force a REVISION_REQUIRED loop in `/implement` → confirm coordinator escalates to `/debug recover` after 2 iterations (not user).

---

## Out of Scope

- New agents (kept existing 12).
- New commands (kept existing).
- Rewriting `frontend-specialist`, `performance-optimizer`, `mobile-developer`, `code-reviewer`, `verification-agent`, `oracle`, `librarian`, `explorer-agent` body prompts — they remain leaf/domain agents.
- Replacing `Skill()` body calls with `skills:` frontmatter on leaf agents — re-evaluate post-Phase 5 with usage telemetry.
- Building actual eval harness from `senior-prompt-engineer/scripts/*.py` stubs — defer to a follow-up plan.
- Migrating Tavily / Context7 tool precedence into a deterministic helper function — Phase 5.3 prose injection is the MVP; helper function is a `/evolve` candidate.

---

## Sprint Contracts (L6+)

**Sprint 1 — Skill rewrite (Phase 1):**
Done when:
- [ ] `SKILL.md` < 500 lines, description front-loads Claude Code intent, body has 9 sections from 1.1.
- [ ] Two new reference files exist (`agent-handoff-contracts.md`, `parallel-batch-contracts.md`).
- [ ] `bunx astro check` passes (no skill schema regression).
Out: leaf-agent rewires.

**Sprint 2 — Process-agent preload (Phase 2):**
Done when:
- [ ] 4 agents (orchestrator, project-planner, evaluator, debugger) have `skills: [..., senior-prompt-engineer, ...]` in frontmatter.
- [ ] Body-level duplicate `Skill("…")` calls for the preloaded skills removed.
- [ ] `/agents` Library tab shows the preload metadata.
Out: leaf-agent edits.

**Sprint 3 — Shared contract & CLAUDE.md (Phases 3+4):**
Done when:
- [ ] `_shared.md § 7.5` exists and is referenced from § 3 + § 6.
- [ ] `CLAUDE.md` routing matrix + stopping conditions updated; combined Tier-1 budget intact.
Out: command consumer edits.

**Sprint 4 — Command consumers (Phase 5):**
Done when:
- [ ] 7 command files (delegate, implement, research, debug, verify, perf, design) link to SSOT for handoff schema.
- [ ] Coordinator max-iteration rule + tool-precedence injection + perf clustering + verify codex pre-check all in place.
- [ ] `grep -c "MANDATORY CONTEXT"` across `.claude/` returns 1.
Out: AGENTS.md learnings entry.

**Sprint 5 — Validation (Phase 6):**
Done when:
- [ ] All Phase 6 verify commands pass.
- [ ] AGENTS.md learnings log gains `[2026-05-01]` entry.
- [ ] Smoke tests in fresh session pass.

---

## Evaluator gate

- **Required before /implement:** spawn `evaluator` (Mode 1: Plan Review). Thresholds: Completeness ≥ 8, Atomicity ≥ 7, Risk coverage ≥ 7, Dependency order ≥ 8. Max 3 revision iterations before escalating to user.

## Next steps

After approval: `/implement` to execute Sprint 1 → ... → Sprint 5 sequentially with parallel sub-tasks per phase.
