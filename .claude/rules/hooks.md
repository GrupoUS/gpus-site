# Path rules: `.claude/hooks/`, `.claude/settings.json` (hooks block)

Register new lifecycle hooks only in `settings.json` under the correct event (`SessionStart`, `PreToolUse`, `PostToolUse`, `Stop`, `Notification`).

- **smart-bash-approver.sh** (`PreToolUse` / Bash): Allows safe patterns (e.g. bun/bunx/git reads); blocks dangerous commands (e.g. `rm -rf /`, force-push main/master, `sudo rm`, fork bombs) — see script `DANGEROUS_PATTERNS`.
- **protect-files.sh** (`PreToolUse` / Edit|Write): Blocks edits matching `.env*`, `secrets`, lockfiles (`bun.lockb`, `package-lock.json`, etc.) — exit 2 = block.
- **ultracite-fix.sh** (`PostToolUse` / Write|Edit): Auto-fix lint after edits (timeout 60s).
- **ultracite-check.sh** (`Stop`): Final lint gate (timeout 120s).
- **gsd-context-monitor.js** (`PostToolUse`): Context usage after Bash/Edit/Write/Task.
- **gsd-prompt-guard.js** (`PreToolUse` / Write|Edit): Validates prompt/tool input before write.
- **Never** weaken `protect-files.sh` to allow `.env` — use local-only overrides via `.claude/settings.local.json` if needed.
