---
name: planning
description: Use when the /plan command is executed, when creating implementation plans or architectural designs, when tasks have high uncertainty requiring research before coding, when brainstorming new features, when feature scope keeps expanding, when multiple approaches exist with unclear trade-offs, when third-party API integration is needed, when web scraping, crawling, or structured data extraction is required, when NotebookLM Deep Research feeds a Planning Knowledge Base before planning, when evolving the planning skill from research exports, or when the user asks "how should we build X".
---

# Planning Skill — D.R.P.I.V Methodology

> **Authority:** Canonical methodology for planning, brainstorming, web research, and knowledge synthesis.
> **Orchestration:** `.claude/commands/plan.md` — agent spawning patterns.
> **Execution:** `.claude/agents/project-planner.md` — plan creation.

---

## HARD GATE

<EXTREMELY-IMPORTANT>
Do NOT write any code until you have:
1. Presented a design
2. Received user approval

This applies to EVERY project regardless of perceived simplicity.
</EXTREMELY-IMPORTANT>

---

## When to Use

### Trigger Symptoms
- User executes `/plan` command
- High uncertainty or risk of hallucination
- Multi-step execution requiring decomposition
- Third-party integrations (APIs, frameworks)
- Feature scope keeps expanding
- Multiple valid approaches with unclear trade-offs
- Web scraping, structured data extraction, or site crawling needed
- Multi-source research aggregation required
- User mentions "NotebookLM", "project notebook", or "project brain"

### When NOT to Use
- Simple Q&A or explanations
- Single-file bug fixes with clear cause
- Minor adjustments to existing code

---

## D.R.P.I.V Workflow

```
DISCOVER → RESEARCH → PLAN → IMPLEMENT → VALIDATE
    ↓          ↓         ↓         ↓          ↓
  Brainstorm Eliminate  Create   Execute    Verify
  + Design   Unknowns   Runbook  Atomic     Quality
```

> **Phases 0-2 are planning. Phases 3-4 are execution (see /implement).**

---

## Phase 0: DISCOVER (Brainstorming)

**When:** Requirements ambiguous, new features, L6+
**Skip:** Bug fixes, well-scoped tasks, established patterns

### Checklist

1. Explore project context (files, docs, recent commits)
2. Ask clarifying questions **one at a time**
3. Propose 2-3 approaches with trade-offs
4. Present design incrementally, get approval each section
5. Write design doc: `docs/plans/YYYY-MM-DD-<topic>-design.md`
6. Continue to RESEARCH

### Rules

| Rule | Why |
|------|-----|
| One question at a time | Never overwhelm |
| Multiple choice preferred | Easier to answer |
| Lead with recommendation | User wants guidance |
| Incremental validation | Catch misunderstandings early |
| YAGNI ruthlessly | Prevent scope creep |

> See `references/01-discover.md` for full protocol.

---

## Phase 1: RESEARCH

**When:** Always (after discovery if needed)

### Research Cascade

```
1. Codebase → Grep/Glob/Read          → Confidence: 5
2. Tavily → search/context/QNA        → Confidence: 4-5
3. Crawl4AI → extract/scrape          → Confidence: 4-5 (live data)
4. NotebookLM → Deep Research + synthesis → Confidence: 4-5 (multi-source; see Planning Knowledge Base)
5. Sequential Thinking                → For synthesis
```

**Stop when confidence ≥ 4 for key findings.**

### Required Output

```markdown
| # | Finding | Confidence (1-5) | Source | Impact |
|---|---------|------------------|--------|--------|
| 1 | ... | 4 | codebase: file.ts | high |

**Knowledge Gaps:** [Unknowns]
**Assumptions:** [To validate]
**Edge Cases:** [Min 5 for L4+]
```

### Confidence Scoring

| Score | Meaning | Action |
|-------|---------|--------|
| **5** | Verified in codebase | Use directly |
| **4** | Multiple sources agree | Use with confidence |
| **3** | Community consensus | Note uncertainty |
| **2** | Single source | Flag as assumption |
| **1** | Speculation | Don't rely on it |

**Rule:** Findings ≤ 2 MUST be flagged.

---

## Phase 1A: Web Extraction (Crawl4AI) — Optional

Use when research requires live web data, structured scraping, or documentation extraction from external sites.

### Prerequisites

```bash
crawl4ai-doctor   # Verify installation
# If issues: crawl4ai-setup
```

**Install when missing** (WSL/Linux; `pip3 --user` puts CLIs in `~/.local/bin` — ensure that directory is on `PATH`):

```bash
pip3 install --user crawl4ai
export PATH="$HOME/.local/bin:$PATH"
python3 -m playwright install chromium
crawl4ai-doctor
```

If `crawl4ai-doctor` still fails after browsers install, run it on your machine (some CI/sandbox hosts cannot launch Chromium). On Fedora/WSL you may need extra OS libs — follow prompts from `crawl4ai-setup`.

### When to Use

| Trigger | Action |
|---------|--------|
| External API docs needed | Crawl docs site, extract markdown |
| Structured data from websites | Schema-based CSS/JSON extraction |
| Competitor/market research | Batch multi-URL crawl |
| JavaScript-heavy pages | Dynamic content handling |

### Extraction Decision Tree

```
Structured, repetitive data? → Schema-based (no LLM, most efficient)
  └─► Generate schema once: scripts/extraction_pipeline.py --generate-schema <url> "<instruction>"
  └─► Reuse:               scripts/extraction_pipeline.py --use-schema <url> generated_schema.json

Irregular or one-time?       → LLM extraction
  └─► scripts/extraction_pipeline.py --llm <url> "<instruction>"

Simple markdown/docs?        → Basic crawl
  └─► scripts/basic_crawler.py <url>

Multiple URLs?               → Batch
  └─► scripts/batch_crawler.py urls.txt [--max-concurrent 5]
```

### Quick Patterns

```python
from crawl4ai import AsyncWebCrawler, CrawlerRunConfig

# Basic markdown extraction
async with AsyncWebCrawler() as crawler:
    result = await crawler.arun("https://docs.example.com")
    # result.markdown → clean content
    # result.links["internal"] → discovered links

# Batch (concurrent)
results = await crawler.arun_many(urls, max_concurrent=5)

# Wait for dynamic content
config = CrawlerRunConfig(wait_for="css:.content", page_timeout=60000)

# Focus on specific selector
config = CrawlerRunConfig(
    css_selector=".main-content",
    excluded_tags=["nav", "footer"]
)
```

### Inject into Research Table

```markdown
| 3 | Schema for product pages | 5 | crawl4ai: schema.json | high |
| 4 | Docs for Astro Content Collections | 4 | crawl4ai: docs.astro.build | high |
```

### Troubleshooting

| Problem | Fix |
|---------|-----|
| JS not loading | Increase `page_timeout`, add `wait_for` |
| Bot detection | `headless=False`, add `asyncio.sleep()` delays |
| Hangs | Cancel, retry without `--wait`, check source list |
| Playwright / “Executable doesn't exist” | `python3 -m playwright install chromium` |
| Browser launches then closes | Re-run `crawl4ai-doctor` locally; check `crawl4ai-setup` / OS deps |
| Chrome error `libatk-1.0.so.0` (Fedora/WSL) | `sudo dnf install -y atk at-spi2-atk at-spi2-core gtk3 libdrm mesa-libgbm libXcomposite libXdamage libXfixes libXrandr libXcursor alsa-lib` (pulls needed GTK/ATK stack for Playwright) |

> Full SDK reference: `references/crawl4ai-sdk.md`
> Scripts: `scripts/basic_crawler.py`, `scripts/batch_crawler.py`, `scripts/extraction_pipeline.py`

---

## Phase 1B: NotebookLM — Research-First Knowledge Pipeline (Optional)

Use when research involves **multi-source domain knowledge**, **plan-vs-research validation**, **project memory**, or **post-implementation retrospectives**.

**Outcome-first rule:** If NotebookLM is used, convert outputs into a **Planning Knowledge Base** (template in `references/notebooklm.md`) **before** Phase 2 PLAN. Do not treat a vague auto-summary alone as sufficient — run **targeted synthesis queries** (frameworks, steps, pitfalls, benchmarks).

### Prerequisites

```bash
which nlm && nlm doctor   # Verify before any NLM operation
# If auth expired: nlm login
```

If `nlm` is not found after `pip3 install --user notebooklm-mcp-cli`, add `export PATH="$HOME/.local/bin:$PATH"` (same as Crawl4AI).

**If either check fails:** Skip all NLM steps. Log: `NotebookLM unavailable — skipping.` Never block the main workflow.

### Research pack pattern (multi-angle)

1. Bootstrap notebook + sources (requirements, `AGENTS.md`, existing plans).
2. Run **2–3** Deep Research queries on **different angles** (e.g. frameworks / tooling / failure modes); `research import` into the same notebook.
3. **Synthesis:** ask NotebookLM specific questions so the skill-grade knowledge is **actionable**, not generic.
4. Fill **Planning Knowledge Base** → then merge distilled rows into the Required Output research table.
5. After drafting the plan, **add plan as source** and run coverage / risk / contradiction queries.

### Notebook strategy

- **Reuse** a notebook only when title/topic **matches** the current initiative.
- Otherwise **create** a new notebook per topic.
- `nlm notebook list` → scan titles → create or reuse.

### Quick command spine (full detail + cheatsheet: `references/notebooklm.md`)

**Bootstrap:**
`nlm notebook list` → `nlm notebook create "…"` → `nlm alias set …` → `nlm source add … --wait`

**Deep Research:**
`nlm research start "…" --notebook-id <id> --mode deep` → `nlm research status <id> --max-wait 300` → `nlm research import <id> <task-id>`

**Synthesis (examples):**
`nlm notebook query <id> "What core principles recur across sources? Cite."`
`nlm notebook query <id> "List frameworks, edge cases, and failure modes."`

**Plan validation:**
`nlm source add <id> --file docs/PLAN-slug.md --title "Plan v1" --wait` → gap / risk / contradiction queries (see `references/notebooklm.md`)

### Constraints

| Issue | Fix |
|-------|-----|
| CLI not installed | `uv tool install notebooklm-mcp-cli` |
| Auth expired | `nlm login` |
| Rate limit (~50/day) | Batch queries; `fast` for recon, `deep` for primary; fall back to Tavily |
| Source hangs | Cancel, retry without `--wait`, check `nlm source list` |
| Research returns nothing | Broader query, `--mode deep`, fall back to Tavily |
| Breaking API change | `uv tool upgrade notebooklm-mcp-cli` |

**Always use `--wait`** when adding sources — they aren't queryable until processed.
**Never reuse notebooks from unrelated topics.**

> **Single reference:** `references/notebooklm.md` (method + D.R.P.I.V mapping + full `nlm` cheatsheet)  
> **Upgrade planning skill from research packs:** `references/planning-skill-from-notebooklm-prompt.md`

---

## Phase 2: PLAN

**When:** After research complete
**Save to:** `docs/plans/YYYY-MM-DD-<feature-name>.md`

### Plan Header

```markdown
# [Feature Name] Implementation Plan

**Goal:** [One sentence]
**Architecture:** [2-3 sentences]
**Tech Stack:** [Key technologies]
**Complexity:** L[1-10] — [Justification]
```

### Task Granularity

**Each step = ONE action (2-5 minutes):**

```
❌ "Implement auth"
✅ "Add Zod schema for login form"
```

### Task Template

```markdown
### Task N: [Name]

**Files:** `path/file.ts:123-145`

**Step 1:** [Action]
\`\`\`typescript
[code]
\`\`\`

**Step 2:** Validate
\`\`\`bash
bun run check
# Expected: No errors
\`\`\`
```

### Required Task Elements

1. Exact file path with line ranges
2. Complete code (never "add validation")
3. Validation command with expected output
4. Dependencies marked with `⚡ PARALLEL-SAFE`

### Phase Organization

```markdown
### Phase 1: Foundation [SEQUENTIAL]
### Phase 2: Core [PARALLEL]
> ⚡ PARALLEL-SAFE
### Phase 3: Integration [SEQUENTIAL]
```

### L6+ Additions
- **Risk Assessment:** See `references/03-risk.md`
- **ADR:** Document non-obvious decisions

> See `references/02-plan.md` for complete template.

---

## Phase 2.5: SELF-REVIEW

**Before presenting, check:**

| # | Criterion | Check |
|---|-----------|-------|
| 1 | Completeness | Every requirement → task? |
| 2 | Atomicity | Each step = 2-5 min? |
| 3 | Risk coverage | Top risks identified? (L6+) |
| 4 | Dependency order | Can execute in order? |
| 5 | Rollback | Can undo each task? |

**If any fails:** Iterate before presenting.

---

## Complexity Levels

| Level | Indicators | Discovery | L6+ Extras |
|-------|------------|-----------|------------|
| L1-L2 | Bug fix, single file | Skip | None |
| L3-L5 | Feature, multi-file | If ambiguous | None |
| L6-L8 | Architecture, integration | Always | Risk + ADR |
| L9-L10 | Migrations, multi-service | Always | Pre-mortem |

### Complexity Indicators

| +1 to +2 | -1 |
|----------|-----|
| Multi files | Patterns exist |
| DB changes | Similar code |
| Auth | Isolated |
| 3rd party APIs | Tests exist |
| Breaking changes | |
| Security | |

---

## Anti-Patterns

| Bad | Good |
|-----|------|
| "Implement auth" | Discover → Research → Plan |
| Skip research | ALWAYS research first |
| "Add validation" in plan | Provide exact code |
| 5 questions at once | One question at a time |
| Present without self-review | Run 5-criterion check |
| Low-confidence as-is | Flag, validate, alternatives |
| Use NLM without checking `which nlm` | Always verify CLI first |
| Not using `--wait` on NLM sources | Sources not queryable until processed |
| Paste only the vague NLM summary into a plan | Run targeted synthesis queries; fill Planning Knowledge Base first |
| Plan domain moves without NLM traceability | Mark gaps; cite NotebookLM/source or downgrade confidence |
| Schema-less scraping for repetitive data | Generate schema once, reuse |
| Block workflow on NLM/Crawl4AI failure | Always optional — degrade gracefully |

---

## Red Flags — STOP

| Red Flag | Action |
|----------|--------|
| Coding before plan approved | Stop. Complete plan first. |
| Plan has "TBD" | Research the unknown NOW. |
| Finding scores ≤ 2 | Find better sources. |
| Self-review failed | Fix plan, don't present. |

---

## Quick Reference

```
D.R.P.I.V: DISCOVER → RESEARCH → PLAN → IMPLEMENT → VALIDATE

RESEARCH CASCADE:
1. Codebase (Grep/Glob/Read)
2. Tavily (web search)
3. Crawl4AI (live extraction)    ← optional, non-blocking
4. NotebookLM (Deep Research → Planning KB) ← optional, non-blocking
5. Sequential Thinking

GOLDEN RULES:
✓ DESIGN FIRST — present design, get approval
✓ RESEARCH ALWAYS — never implement blind
✓ BITE-SIZED STEPS — each = one action (2-5 min)
✓ EXACT CODE — complete code, never vague
✓ ONE QUESTION — never overwhelm
✓ 2-3 APPROACHES — always explore alternatives
✓ SELF-REVIEW — 5 criteria before presenting
✓ CONFIDENCE TAG — score every finding 1-5
✓ OPTIONAL TOOLS — NLM and Crawl4AI degrade gracefully
```

---

## References

- `references/01-discover.md` — Brainstorming protocol
- `references/02-plan.md` — Plan template
- `references/03-risk.md` — Pre-mortem + ADR (L6+)
- `references/notebooklm.md` — NotebookLM method + Planning Knowledge Base + `nlm` cheatsheet
- `references/planning-skill-from-notebooklm-prompt.md` — NotebookLM research → skill upgrade prompt + **PlanningSkillCoach** SYSTEM prompt (tool-agnostic CEO planning)
- `references/notebooklm-cli.md` — Redirect → `notebooklm.md`
- `references/notebooklm-hooks.md` — Redirect → `notebooklm.md`
- `references/crawl4ai-sdk.md` — Complete Crawl4AI SDK reference
- `scripts/basic_crawler.py` — Simple markdown extraction with screenshots
- `scripts/batch_crawler.py` — Multi-URL concurrent processing
- `scripts/extraction_pipeline.py` — Schema generation + CSS/LLM extraction
