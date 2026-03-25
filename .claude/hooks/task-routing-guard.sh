#!/bin/bash

INPUT=$(timeout 0.3 cat || true)

if [ -z "$INPUT" ]; then
  echo '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"allow"}}'
  exit 0
fi

SUBAGENT=$(echo "$INPUT" | python3 -c 'import json,sys; d=json.load(sys.stdin); print((d.get("tool_input") or {}).get("subagent_type") or "")' 2>/dev/null)
CATEGORY=$(echo "$INPUT" | python3 -c 'import json,sys; d=json.load(sys.stdin); print((d.get("tool_input") or {}).get("category") or "")' 2>/dev/null)

if [ -n "$SUBAGENT" ]; then
  case "$SUBAGENT" in
    backend-specialist|database-architect|debugger|documentation-writer|explorer-agent|explorer|frontend-specialist|mobile-developer|oracle|orchestrator|performance-optimizer|project-planner|explore|librarian|metis|momus|general-purpose|Explore|Plan|claude-code-guide|statusline-setup|\
    generalPurpose|shell|best-of-n-runner|design-implementation-reviewer|design-iterator|figma-design-sync|ankane-readme-writer|best-practices-researcher|framework-docs-researcher|git-history-analyzer|learnings-researcher|repo-research-analyst|agent-native-reviewer|architecture-strategist|code-simplicity-reviewer|data-integrity-guardian|data-migration-expert|deployment-verification-agent|dhh-rails-reviewer|julik-frontend-races-reviewer|kieran-python-reviewer|kieran-rails-reviewer|kieran-typescript-reviewer|pattern-recognition-specialist|performance-oracle|schema-drift-detector|security-sentinel|bug-reproduction-validator|every-style-editor|lint|pr-comment-resolver|spec-flow-analyzer)
      ;;
    *)
      echo '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"Unknown or unavailable subagent_type for this project."}}'
      exit 0
      ;;
  esac
fi

# Cursor / Claude Code: allow Task when subagent_type is omitted but prompt/description exist (legacy payloads).
if [ -z "$SUBAGENT" ] && [ -z "$CATEGORY" ]; then
  HAS_BODY=$(echo "$INPUT" | python3 -c 'import json,sys; d=json.load(sys.stdin); t=d.get("tool_input") or {}; print(1 if t.get("prompt") or t.get("description") else 0)' 2>/dev/null || echo 0)
  if [ "$HAS_BODY" = "1" ]; then
    echo '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"allow"}}'
    exit 0
  fi
  echo '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"Task requires category or subagent_type."}}'
  exit 0
fi

# Note: run_in_background validation is now handled by plan.md
# This hook only validates that subagent_type is known

echo '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"allow"}}'
exit 0
