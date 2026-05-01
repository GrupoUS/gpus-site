# Prompt Engineering Patterns (application-level)

> Patterns for building Claude API / LLM features INSIDE the product (not Claude Code subagent design — see `agentic_system_design.md` for that).
> Use when the GPUS site or a related app gains an AI feature: copy generation, RAG over manuals, structured output extraction, eval-driven iteration.

References:
- Anthropic prompt design: https://docs.claude.com/en/docs/build-with-claude/prompt-engineering
- Claude API: `claude-api` skill (auto-triggers on `@anthropic-ai/sdk` imports)

---

## 1. Pattern: XML-tagged structured input

Claude follows XML tags reliably. Use them to delimit roles, context, and instructions when a prompt has ≥2 distinct parts.

```xml
<role>You are a copywriter for a Brazilian aesthetic-medicine brand.</role>

<brand_voice>
Sentence case · Olhar de dono · Excelência com entrega real
Avoid: ed-tech tropes, exclamation marks, English jargon.
</brand_voice>

<task>Write 3 hero headline variants for the product below.</task>

<product>
{json_dump(product)}
</product>

<output_format>
Return a JSON array of 3 strings. Each ≤ 90 characters. No emoji.
</output_format>
```

**Why:** sectioned prompts beat blob prompts on adherence. Tag names don't matter (`<role>` ≡ `<persona>`); consistency does.

---

## 2. Pattern: Few-shot before zero-shot

When a task has subjective output (copy, classification with edge cases, format extraction), 2-3 worked examples beat instructions alone.

```xml
<examples>
<example>
  <input>{ "product": "Curso de Aurículo", "audience": "esteticistas" }</input>
  <output>["Em 3 dias presenciais, técnica que vira protocolo na sua cabine.", …]</output>
</example>
<example>
  <input>{ "product": "Mentoria Black NEON", "audience": "donos de clínica" }</input>
  <output>["6 meses para sair de operadora a dona de operação.", …]</output>
</example>
</examples>

<input>{ "product": "TRINTAE3", "audience": "iniciantes" }</input>
```

Examples should span the **decision boundary** (one easy case, one hard case, one tricky case). Not 5 trivial cases.

---

## 3. Pattern: Chain-of-thought scaffold

For multi-step reasoning (debugging copy, explaining tradeoffs, applying brand rules):

```xml
<task>Decide whether this hero copy passes the brand voice gate.</task>

<input>{copy}</input>

<reasoning_steps>
1. Identify the 5 brand anchors used.
2. List violations (anchors absent + anti-patterns present).
3. Verdict: PASS | REVISION_REQUIRED.
4. If REVISION_REQUIRED: propose minimal edits.
</reasoning_steps>

<output_format>
Return JSON: { "anchors": [...], "violations": [...], "verdict": "...", "edits": [...] }
</output_format>
```

Explicit numbered steps outperform "think step by step" alone — they constrain the shape of reasoning.

**Caveat:** for Claude 4+ models, "ultrathink" extended thinking often replaces hand-rolled CoT. Choose one or the other; don't stack.

---

## 4. Pattern: Structured output via JSON schema

Use Claude's tool-use API to enforce schemas instead of asking for "JSON in a code block".

```python
tools = [{
  "name": "submit_headlines",
  "description": "Submit 3 hero headline variants",
  "input_schema": {
    "type": "object",
    "properties": {
      "headlines": {
        "type": "array",
        "items": { "type": "string", "maxLength": 90 },
        "minItems": 3, "maxItems": 3
      }
    },
    "required": ["headlines"]
  }
}]

response = client.messages.create(
  model="claude-opus-4-7",
  tools=tools,
  tool_choice={"type": "tool", "name": "submit_headlines"},
  messages=[...]
)
```

**Why:** the API rejects malformed output before it reaches your app. No regex parsing, no JSON-in-markdown extraction.

---

## 5. Pattern: Prompt caching for stable context

When prompts include large stable blocks (manuals, brand guides, schema docs), use prompt caching to skip re-tokenization on every call.

```python
client.messages.create(
  model="claude-opus-4-7",
  system=[
    {
      "type": "text",
      "text": brand_manual_50kb,
      "cache_control": {"type": "ephemeral"}
    }
  ],
  messages=[{"role": "user", "content": user_prompt}]
)
```

**Cost:** cache hits ~10× cheaper, ~2× faster. TTL 5 min (refresh on every hit).

**Use cases in this repo (hypothetical):** `grupo-us` manual cache for copy generators, FAQ corpus cache for RAG retrievers.

---

## 6. Pattern: Eval-driven prompting

Don't iterate prompts on vibes. Build a small eval harness:

```python
test_cases = [
  {"input": {...}, "expected_traits": ["mentions Laura", "≤ 90 chars", "no emoji"]},
  ...
]

def grade(output, traits):
  return sum(check(output, t) for t in traits) / len(traits)

# Run candidate prompt against every test case, score, average.
```

Each prompt mutation gets scored against the same fixed harness. Pick the highest-scoring variant — not the one that "feels best".

See `llm_evaluation_frameworks.md` for the full eval pattern + repo conventions for storing test cases under `evals/`.

---

## 7. Anti-patterns

| Anti-pattern | Why bad | Fix |
|---|---|---|
| "Be creative" / "Use your best judgment" | Underspecified → high variance | Specify decision criteria explicitly |
| Stacking 8 instructions in one paragraph | Claude follows last instruction strongest | Use numbered list or XML sections |
| Asking for JSON without schema | Free-form output, brittle parsing | Use tool-use with `input_schema` |
| Prompt-injecting user content | Untrusted text bypasses guardrails | Wrap user input in `<user_input>…</user_input>` and instruct Claude to treat it as data |
| Tweaking prompts without an eval | Drift; "improvements" regress on edge cases | Build minimal eval first |
| Hand-rolled CoT + extended thinking | Conflicting reasoning channels | Pick one |

---

## 8. Project-specific notes

- This repo (gpus-site) ships **no runtime AI** — it's a static Astro site. These patterns apply when adding AI features (e.g., a content-collection generator, FAQ semantic search).
- For copy/conversion experiments at build time, prefer the `evolve-autoresearch` skill + Karpathy autoresearch loop over ad-hoc prompting.
- Brand voice constraints + product taxonomy live in the `grupo-us` skill — preload it when building copy generators.

Last updated: 2026-05-01. Owner: `senior-prompt-engineer` skill.
