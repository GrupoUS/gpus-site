# NotebookLM for Planning — Method + CLI

> **Single reference** for D.R.P.I.V planning with Google NotebookLM (`nlm`). Replaces the split between hooks-only and CLI-only docs.
> **Upstream CLI docs:** [notebooklm-mcp-cli CLI Guide](https://github.com/jacob-bd/notebooklm-mcp-cli/blob/main/docs/CLI_GUIDE.md)

---

## When to Use

| Situation | Use NotebookLM? |
|-----------|-----------------|
| Multi-source domain research before a plan | Yes |
| Validating a draft plan against gathered sources | Yes |
| Project memory, ADRs, retrospectives | Yes |
| Single-file bug with known fix | No |
| NLM CLI unavailable or rate-limited | Skip; use Tavily/codebase only |

**Principle:** Plans must be **grounded in evidence**. NotebookLM is optional tooling — the **Planning Knowledge Base** (below) is mandatory whenever NLM research was used; if NLM is skipped, the research table still stands.

---

## Session Guard (run once per session)

```bash
which nlm && nlm doctor
```

| Outcome | Action |
|---------|--------|
| `which nlm` fails | Log `NotebookLM CLI not installed — skipping NLM`. Continue workflow. |
| Auth / doctor errors | Try `nlm login`; if it fails, skip NLM. |
| OK | Proceed with NLM steps. |

**Never block** D.R.P.I.V on NotebookLM failure.

---

## Research-First Pipeline (Deep Research → Skill-Grade Knowledge)

This aligns with a proven pattern: **NotebookLM gathers and cites**; the planner **extracts structure** before writing tasks.

1. **Scope** — One notebook per planning topic. Reuse a notebook **only** if the title/subject matches the current initiative; otherwise create new.
2. **Bootstrap** — Add requirements, `AGENTS.md`, existing design/plan files as sources (`--wait`).
3. **Multi-angle Deep Research** — Run **2–3** `nlm research start ... --mode deep` queries with different angles, e.g.:
   - frameworks / standard process
   - tools / implementation patterns
   - failure modes / anti-patterns / benchmarks  
   Poll with `nlm research status`, then `nlm research import` so sources land in the notebook.
4. **Synthesis layer** — The auto summary can be high-level. Run **targeted** `nlm notebook query` prompts to extract specifics (frameworks, steps, pitfalls). Do **not** treat vague summaries as sufficient for planning.
5. **Planning Knowledge Base** — Condense query outputs into the template below **before** Phase 2 PLAN. Every planning claim tied to NLM should trace to a cited source or be marked as a gap.
6. **Plan validation** — Add the plan file as a source; query for gaps, risks, contradictions; iterate.
7. **Implement / Validate** — Log ADRs and blockers as sources; optional Studio artifacts for retrospectives.

---

## Planning Knowledge Base (required when using NLM)

Paste or maintain this block in the design doc or plan appendix:

```markdown
## Planning Knowledge Base (NotebookLM)

### 1) Domain Brief
[What this domain/problem is, in 3–6 bullets — sourced]

### 2) Core Planning Tasks
[Standard phases/steps experts use — sourced]

### 3) Expert Heuristics
[Rules of thumb, prioritization — sourced]

### 4) Decision Rules
[How to choose between options — sourced]

### 5) Validation Rules
[Quality bars, checkpoints, metrics — sourced]

### 6) Edge Cases & Risks
[Min 5 — sourced; label thin areas as GAP]

**Unsupported claims:** [none | list]
**Research gaps:** [what to research next]
```

If research is thin, **explicitly list gaps** — do not invent domain facts.

---

## D.R.P.I.V Phase Mapping

### Phase 0 — DISCOVER (notebook bootstrap)

```bash
nlm notebook list
# Match? reuse ID. Else:
nlm notebook create "<Project> - <Topic>"
nlm alias set <slug> <notebook-id>

nlm source add <slug> --text "Requirements: ..." --title "Requirements" --wait
nlm source add <slug> --file AGENTS.md --wait
nlm source add <slug> --file docs/existing-plan.md --wait   # if exists
```

### Phase 1 — RESEARCH (aggregation + synthesis)

```bash
nlm research start "<focused question>" --notebook-id <id> --mode deep
nlm research status <id> --max-wait 300
nlm research import <id> <task-id>

nlm source add <id> --url "https://..." --wait
nlm source add <id> --youtube "https://..." --wait
```

**Synthesis queries (examples — batch when rate-limited):**

```bash
nlm notebook query <id> "What core principles recur across all sources? Cite sources."
nlm notebook query <id> "List frameworks or named methodologies mentioned most often."
nlm notebook query <id> "What does good execution look like step-by-step in this domain?"
nlm notebook query <id> "List edge cases, failure modes, and how to avoid them."
nlm notebook query <id> "Extract security, compliance, or ethics considerations."
nlm notebook query <id> "What quantitative benchmarks or thresholds appear?"
```

Inject distilled rows into the main research table:

```markdown
| # | Finding | Confidence (1-5) | Source | Impact |
|---|---------|------------------|--------|--------|
| n | ... | 4 | NotebookLM Q&A (N sources) | high |
```

### Phase 2 — PLAN (validation & gap analysis)

```bash
nlm source add <id> --file docs/PLAN-<slug>.md --title "Plan v1" --wait

nlm notebook query <id> "What requirements or research findings are NOT addressed by this plan?"
nlm notebook query <id> "Top 3 risks the plan does not mitigate?"
nlm notebook query <id> "Contradictions between the plan and the sources?"
```

If gaps appear: update plan → re-add source → document validation in the research summary.

### Phase 3 — IMPLEMENT (decision logging)

```bash
nlm source add <id> --text "Decision: ..." --title "ADR: ..." --wait
nlm source add <id> --text "Blocker: ..." --title "Implementation Note" --wait
```

### Phase 4 — VALIDATE (retrospective, optional)

```bash
nlm audio create <id> --format deep_dive --length long --confirm
nlm report create <id> --format "Briefing Doc" --confirm
nlm flashcards create <id> --difficulty medium --confirm
nlm mindmap create <id> --confirm
nlm studio status <id>
nlm download report <id> <artifact-id> --output docs/briefing.md
```

**Sharing (if requested):**

```bash
nlm share public <id>
nlm share invite <id> colleague@company.com --role editor
```

---

## Rate Limits & Degradation

- Free tier: on the order of **~50 queries/day** (varies by product tier).
- Prefer `--mode fast` for reconnaissance; **`--mode deep`** for primary topics.
- Batch related questions into fewer queries when needed.
- Cache notebook IDs and important query results in repo docs.
- If rate-limited or unavailable: log and continue with Tavily + codebase only.

---

## Troubleshooting

| Issue | Mitigation |
|-------|------------|
| CLI missing | `uv tool install notebooklm-mcp-cli` |
| Auth | `nlm login` |
| Source hangs | Retry without `--wait`; `nlm source list` |
| Empty research | Broaden query; confirm `--mode deep`; fall back to Tavily |
| API drift | `uv tool upgrade notebooklm-mcp-cli` |

**Rule:** Always use `--wait` when adding sources — they are not queryable until indexed.

---

## Appendix A — Command Cheatsheet (`nlm`)

### Install & auth

```bash
uv tool install notebooklm-mcp-cli   # recommended
# or: pip install notebooklm-mcp-cli

nlm login
nlm login --check
nlm login switch <profile>
nlm login profile list
nlm doctor
```

### Notebooks

```bash
nlm notebook list
nlm notebook list --json
nlm notebook create "Title"
nlm notebook get <id>
nlm notebook describe <id>
nlm notebook rename <id> "New"
nlm notebook delete <id> --confirm
nlm notebook query <id> "question"
```

### Sources

```bash
nlm source list <notebook>
nlm source add <notebook> --url "https://..." --wait
nlm source add <notebook> --text "content" --title "T" --wait
nlm source add <notebook> --file doc.pdf --wait
nlm source add <notebook> --youtube "https://..." --wait
nlm source add <notebook> --drive <doc-id> --wait
nlm source get <source-id>
nlm source describe <source-id>
nlm source stale <notebook>
nlm source sync <notebook> --confirm
nlm source delete <source-id> --confirm
```

### Research

```bash
nlm research start "query" --notebook-id <id> --mode fast
nlm research start "query" --notebook-id <id> --mode deep
nlm research start "query" --notebook-id <id> --source drive
nlm research status <notebook> --max-wait 300
nlm research import <notebook> <task-id>
```

### Studio & downloads

```bash
nlm audio create <notebook> --format deep_dive --length long --confirm
nlm video create <notebook> --format explainer --style classic --confirm
nlm report create <notebook> --format "Briefing Doc" --confirm
nlm quiz create <notebook> --count 10 --difficulty medium --confirm
nlm flashcards create <notebook> --difficulty hard --confirm
nlm mindmap create <notebook> --confirm
nlm slides create <notebook> --confirm
nlm infographic create <notebook> --orientation landscape --confirm
nlm data-table create <notebook> --description "..." --confirm

nlm download audio <notebook> <artifact-id> --output file.mp3
nlm download video <notebook> <artifact-id> --output file.mp4
nlm download report <notebook> <artifact-id> --output file.md
nlm download mind-map <notebook> <artifact-id> --output file.json
nlm download slide-deck <notebook> <artifact-id> --output file.pdf
nlm download infographic <notebook> <artifact-id> --output file.png
nlm download data-table <notebook> <artifact-id> --output file.csv
nlm download quiz <notebook> <artifact-id> --format html --output quiz.html
nlm download flashcards <notebook> <artifact-id> --format markdown --output cards.md
```

### Sharing & misc

```bash
nlm share status <notebook>
nlm share public <notebook>
nlm share private <notebook>
nlm share invite <notebook> email@example.com
nlm share invite <notebook> email --role editor

nlm alias set <name> <notebook-id>
nlm studio status <notebook>
nlm studio delete <notebook> <id> --confirm
nlm chat configure <notebook> --goal learning_guide --length longer
nlm setup add antigravity
```

### CLI output flags

| Flag | Use |
|------|-----|
| (none) | Rich table |
| `--json` | Machine-readable |
| `--quiet` | IDs only |
| `--title` | `ID: Title` |
| `--full` | All columns |

---

## Appendix B — Overlap resolved (historical)

Former `notebooklm-hooks.md` covered phase hooks and rate limits; former `notebooklm-cli.md` listed commands. This file keeps **method first**, **commands last**, so agents optimize for outcomes (knowledge base → plan) rather than command memorization.
