#!/usr/bin/env bash
# Stop hook: full-project lint gate (no --write). Fails the hook if Biome or oxlint report errors.
set -euo pipefail

ROOT="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/../.." && pwd)}"
cd "$ROOT"

exec bun run lint
