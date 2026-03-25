---
description: Deep research mode - parallel exploration of codebase and external docs. Returns structured findings only, no code changes.
---

# /research - Parallel Research Only

**ARGUMENTS**:$ARGUMENTS

<command-instruction>
Trigger Phase 2A of the orchestrator protocol in RESEARCH-ONLY mode.

## Agent Routing (MANDATORY — choose based on WHERE the answer lives)

> [!CRITICAL]
> **`explorer` = CUSTOM agent at `.claude/agents/explorer-agent.md`** — structured Findings Table with confidence scores (1-5), Knowledge Gaps, Librarian Requests.
> **NOT the built-in `Explore` agent.** Use `subagent_type: "explorer"` (exact case, no substitution).

| Question Type                        | Agent       | Why                        |
| ------------------------------------ | ----------- | -------------------------- |
| What exists in our codebase?         | `explorer`  | Answer lives in filesystem |
| How does this code pattern work?     | `explorer`  | Answer lives in filesystem |
| Which files need to change?          | `explorer`  | Answer lives in filesystem |
| How does this library/API work?      | `librarian` | Answer lives externally    |
| What are the best practices for X?   | `librarian` | Answer lives externally    |
| Is this package behavior documented? | `librarian` | Answer lives externally    |

## Astro Knowledge Sources (Priority Order)

For Astro-specific research, use this cascade:

1. **`astro` skill** (`.claude/skills/astro/`) — First check: covers components, Content Collections, islands, styling, config, performance, View Transitions, troubleshooting
2. **Context7 MCP** — Query Astro v6 docs: `resolve-library-id("astro")` → `query-docs(libraryId, query)`
3. **Codebase explorer** — Check existing patterns in `src/`
4. **Tavily/Web** — Only if 1-3 are insufficient

### Context7 Astro Library IDs (Pre-resolved)

| Library ID | Source | Best For |
| --- | --- | --- |
| `/websites/v6_astro_build_en` | Astro v6 official docs | Latest Astro 6 features, breaking changes |
| `/llmstxt/astro_build_llms-full_txt` | LLM-optimized docs | Comprehensive reference, code examples |
| `/llmstxt/astro_build_llms_txt` | LLM-small docs | Quick lookups, concise answers |

## Execution

1. **Check `astro` skill first** — Read relevant reference file from `.claude/skills/astro/references/`
2. Fire `explorer` (custom agent, NOT built-in `Explore`) in background for codebase structure analysis
3. Fire `librarian` in background for external documentation **IF** any library, package, or external API is mentioned
   - For Astro docs, instruct librarian to use Context7 with library IDs above
4. Continue reading immediately — do not wait
5. Collect background results
6. Output structured findings table with Confidence (1-5), Source, Impact
7. Do NOT implement. Research only.

## Findings Format

| #   | Finding | Confidence | Source              | Impact |
| --- | ------- | ---------- | ------------------- | ------ |
| 1   | ...     | 4          | codebase: path/file | high   |
| 2   | ...     | 5          | docs: URL           | high   |

## Knowledge Gaps

[List what remains unknown after both agents complete]

## Astro Skill References Used

[List which `.claude/skills/astro/references/*.md` files were consulted]

## Recommended Next Step

[One suggested action based on findings]
</command-instruction>
