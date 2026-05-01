# LLM Evaluation Frameworks

> Eval harness patterns for AI features. Cited by `evaluator` agent (Mode 3 — Architecture Analysis) and `/evolve` autoresearch loop.

References:
- Karpathy autoresearch: https://github.com/karpathy/autoresearch
- `evolve-autoresearch` skill (this repo) — Karpathy-style optimize loop bound to project

---

## 1. Why eval before prompt

Without an eval harness, prompt iteration is a feeling. With one, every change is scored against fixed test cases — drift becomes visible, regressions are caught.

**Project convention:** evals live under `evals/<scope>/<run-name>/` with `experiments.tsv` recording every run + `best_skill_prompt.txt` capturing the winning variant. See AGENTS.md learnings log entries `[2026-03-26]` for examples.

---

## 2. Minimum viable eval

Three components:

1. **Frozen test set** — N inputs (3-30), each annotated with `expected_traits` or a reference output. Frozen means: do not edit during a run; create a new test set if requirements change.
2. **Grader** — function that scores an output against a single test case. Returns 0-1.
3. **Harness** — runs candidate prompt against every test case, averages, persists the result.

```python
# evals/<scope>/<run>/grade.py
def grade(output: str, expected: dict) -> float:
    score = 0
    if expected["max_chars"] and len(output) <= expected["max_chars"]: score += 1
    if expected["mentions"] and all(m in output for m in expected["mentions"]): score += 1
    if expected["forbidden"] and not any(f in output for f in expected["forbidden"]): score += 1
    return score / 3
```

---

## 3. Grader patterns

| Grader | When | Cost |
|---|---|---|
| **Heuristic checks** (string contains, regex, length) | Deterministic traits (no emoji, max 90 chars, contains brand phrase) | ~free |
| **JSON schema validation** | Structured outputs | ~free |
| **LLM-as-judge** | Subjective traits (tone, persuasiveness, brand alignment) | tokens — keep judge prompts short |
| **Embedding similarity** | Semantic retrieval relevance | embedding API call per pair |
| **Human-in-loop** | Final tie-break or trust calibration | slow; use sparingly |

**Best practice:** combine ≥2 grader types to catch both objective + subjective failures.

---

## 4. Karpathy autoresearch loop (Anthropic-aligned)

The `evolve-autoresearch` skill in this repo implements a fixed-budget optimization loop:

```
1. Freeze the harness (init-run): seed test set, grader, baseline prompt
2. Score baseline → record in experiments.tsv
3. Generate candidate mutations of the prompt (seed-candidates)
4. Score each candidate against the SAME budget (samples_per_iteration)
5. Pick winner (highest score; tiebreaker: lower variance)
6. Persist winner to best_skill_prompt.txt
7. Optional: iterate (winner becomes new baseline)
```

**Hard rules from `evolve-autoresearch` skill:**
- One artifact pointed at per run (no editing two skills concurrently).
- Crash discipline: max 1 quick fix on candidate generation; if still broken, discard candidate, do not contaminate harness.
- experiments.tsv is append-only.

See `.claude/skills/evolve-autoresearch/SKILL.md` for the canonical pattern + Python toolchain (`evolve_autoresearch_*.py` scripts).

---

## 5. RAG-specific eval

When an AI feature involves retrieval (e.g., FAQ semantic search over `src/content/`):

| Metric | What | How |
|---|---|---|
| **Retrieval recall@k** | Did the top-k chunks contain the gold answer? | Annotate gold chunk IDs per query |
| **Retrieval precision@k** | How much of top-k is on-topic? | Manual or LLM-judge per query/chunk pair |
| **Answer faithfulness** | Does the generated answer stick to retrieved content? | LLM-judge with `<context>...</context>` + `<answer>...</answer>` |
| **Answer relevance** | Does the answer address the query? | LLM-judge or heuristic on query-keyword presence |
| **Hallucination rate** | Claims not supported by retrieved content | LLM-judge: "list claims; mark each grounded/ungrounded" |

Track all five over time. A change that lifts faithfulness but drops recall is a **regression**, even if generation looks better.

---

## 6. Eval anti-patterns

| Anti-pattern | Why bad | Fix |
|---|---|---|
| **Eyeball eval** | Drift; biased toward last-seen output | Persist scores; compare to baseline |
| **Test set grows mid-run** | Confounds prompt change with harness change | Freeze before run; new test set ⇒ new run |
| **Single test case** | High variance; not statistically meaningful | Min 5 cases; aim for 10+ |
| **All easy cases** | Misses regressions on edge cases | Include 1-2 hard cases that span the decision boundary |
| **LLM-judge on the same model being graded** | Self-consistency bias | Use a different model (or human) as judge |
| **Grading on aggregate only** | Hides per-case regressions | Always inspect per-case scores too |

---

## 7. Where evals live in this repo

| Path | Purpose |
|---|---|
| `evals/<scope>/<run-name>/` | One folder per run |
| `evals/<scope>/<run-name>/experiments.tsv` | Append-only score log |
| `evals/<scope>/<run-name>/best_skill_prompt.txt` | Winning prompt variant |
| `evals/<scope>/<run-name>/run.md` | Run summary cited from AGENTS.md learnings log |
| `evals/README.md` | Cross-run conventions |

The `evolve-autoresearch` skill provides Python scripts that enforce this layout — use them rather than rolling custom scaffolding.

Last updated: 2026-05-01. Owner: `senior-prompt-engineer` skill.
