#!/bin/bash
# session-context.sh - Session context injection (optimized, compressed)

# Get source to differentiate startup vs resume vs compact
INPUT=$(timeout 0.2 cat || true)
SOURCE=$(grep -oP '"source"\s*:\s*"\K[^"]+' <<< "$INPUT" 2>/dev/null || echo "")

# Fast git info
BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")

if [ "$SOURCE" = "startup" ]; then
    echo "[GPUS] Bun | branch:$BRANCH | gates: bun run lint + build"
elif [ "$SOURCE" = "compact" ]; then
    echo "[GPUS] Bun, bun run lint, bun run build"
fi
# resume: no output needed - context already present
