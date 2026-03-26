# EVOLVE_AUTORESEARCH scripts

These scripts turn the skill from "documented protocol" into a local, auditable workflow.

## Files

- `evolve_autoresearch_harness.py`
  - Parses `<evolve_request>`
  - Freezes the run harness
  - Creates `request.json`, `harness.json`, `test_cases.jsonl`, `candidates/`, and `grades/`
- `evolve_autoresearch_mutate.py`
  - Generates deterministic prompt variants from the baseline prompt + constraints
- `evolve_autoresearch_score.py`
  - Validates a candidate grade sheet against the frozen harness
  - Computes aggregate score
  - Applies `keep | discard | crash`
  - Updates `experiments.tsv` and `best_skill_prompt.txt`
- `evolve_autoresearch_report.py`
  - Builds `evolve-response.xml`
  - Optionally appends `knowledge_gaps` and `next_actions` into `backlog.md`
- `evolve_autoresearch_log.py`
  - TSV-focused utility for init/import/stats and backward-compatible workflows

## Suggested flow

```bash
# 1. Bootstrap the run from an evolve request
python3 .claude/skills/evolve-autoresearch/scripts/evolve_autoresearch_harness.py init-run \
  --file /tmp/evolve-request.xml

# 2. Seed deterministic candidates
python3 .claude/skills/evolve-autoresearch/scripts/evolve_autoresearch_mutate.py seed-candidates \
  --run-dir evals/<skill-slug>/runs/<run-id>

# 3. Score baseline and each candidate using filled grade JSON files
python3 .claude/skills/evolve-autoresearch/scripts/evolve_autoresearch_score.py score-candidate \
  --run-dir evals/<skill-slug>/runs/<run-id> \
  --grade-file evals/<skill-slug>/runs/<run-id>/grades/baseline.json

# 4. Build evolve-response.xml
python3 .claude/skills/evolve-autoresearch/scripts/evolve_autoresearch_report.py build-response \
  --run-dir evals/<skill-slug>/runs/<run-id> \
  --append-backlog
```

## Why this split

- Keeps the "frozen harness" separate from scoring and reporting
- Makes each step reviewable in git diffs
- Avoids a monolithic runner that hides how candidates were generated or graded
- Mirrors the spirit of `karpathy/autoresearch`: small surfaces, fixed evaluation, append-only history
