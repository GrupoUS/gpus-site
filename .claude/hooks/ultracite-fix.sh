#!/usr/bin/env bash
# PostToolUse: Biome check --write + oxlint --fix on edited files (scoped to src/ + astro.config.mjs).
set -euo pipefail

INPUT=$(timeout 1 cat || true)
FILE_PATH=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('tool_input',{}).get('file_path',''))" 2>/dev/null || true)

if [ -z "$FILE_PATH" ]; then
	exit 0
fi

ROOT="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/../.." && pwd)}"
cd "$ROOT"

# Normalize to absolute path
if [[ "$FILE_PATH" != /* ]]; then
	FILE_PATH="$ROOT/$FILE_PATH"
fi

# Only files inside this repository
case "$FILE_PATH" in
"$ROOT"/*) ;;
*) exit 0 ;;
esac

rel="${FILE_PATH#"$ROOT"/}"

biome_target=0
if [[ "$rel" == src/* || "$rel" == "astro.config.mjs" ]]; then
	case "$FILE_PATH" in
	*.ts | *.tsx | *.js | *.jsx | *.json | *.astro | *.css | *.mjs) biome_target=1 ;;
	esac
fi

oxlint_target=0
if [[ "$rel" == src/* ]]; then
	case "$FILE_PATH" in
	*.ts | *.tsx | *.js | *.jsx | *.mjs) oxlint_target=1 ;;
	esac
fi

if [ "$biome_target" -eq 1 ]; then
	bunx biome check "$FILE_PATH" --write
fi

if [ "$oxlint_target" -eq 1 ]; then
	bunx oxlint "$FILE_PATH" --fix --fix-suggestions
fi

exit 0
