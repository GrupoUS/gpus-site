---
globs: src/**, .claude/**, public/**, scripts/**, astro.config.mjs, package.json, src/content/**
---

# Commit Format + Pre-Commit Gate (Tier 2 — Auto-loaded)

> Canonical for all commits in gpus-site. Conventional Commits + lefthook pre-commit hook + manual gate checklist.

## Conventional Commits

Format: `<type>(<scope>): <subject>` — `feat | fix | docs | refactor | chore | test | perf | style | build | ci`.

**Scopes** (this repo): `site`, `theme`, `content`, `seo`, `astro`, `redirects`, `config`, `scripts`, `.claude`, `deps`, `a11y`, `perf`.

Examples:
- `feat(site): add /mentoria-black-neon landing`
- `fix(redirects): tri-sync /neon-dash exclusion in sitemap filter`
- `chore(.claude): create rules/{commit,mcp,commands,astro}.md adapted from NeonDash`
- `refactor(theme): collapse Gold/Navy token aliases per gpus-theme skill`
- `fix(content): WhatsApp message prefix "Olá, Laura!" per grupo-us SSOT`

One logical change per commit. Reference touched rule when relevant (e.g., `fix(astro): redirect tri-sync per .claude/rules/astro.md §4`).

## Pre-Commit Gate (automated via lefthook)

`lefthook.yml` runs on every `git commit` (no skip without explicit user request):

```yaml
pre-commit:
  commands:
    lint:
      run: bun run lint
      glob: "{src/**,astro.config.mjs}"
```

`bun run lint` = `bunx biome check src astro.config.mjs && bunx oxlint src --ignore-pattern 'src/layouts/*'`.

## Manual Gate Checklist (before staging)

Run **in order**. Failure of any step blocks commit — fix root cause, re-stage, restart:

1. **Format + Lint** — `bun run lint` → 0 errors (biome + oxlint composite).
2. **Type-check** — `bunx astro check` → 0 errors (validates `.astro` + `.ts` + `.tsx` + Content Collections schema in `src/content.config.ts`).
3. **Build** — `bun run build` → success (catches schema / hydration / asset issues).
4. **External URL check** — `bun run check:external-urls` → all redirect destinations reachable (cardinal #1 — verify before applying).
5. **Hardcoded hex scan** — staged UI files (`src/**/*.{astro,tsx,ts}` excluding `src/styles/global.css`) → `grep -nE '#[0-9a-fA-F]{3,8}' <files>` must be **0** (cardinal #7).
6. **WhatsApp inline scan** — `grep -rnE 'wa\.me/' src/ --include='*.astro' --include='*.tsx' --include='*.ts' --exclude='src/lib/whatsapp.ts'` must be **0** (cardinal #6).
7. **Content drift scan** — staged `.astro` / `.tsx` → no hardcoded product / FAQ / testimonial literals (cardinal #5 — must `getCollection()`).
8. **Production noise** — staged files → `grep -nE '\bconsole\.log\b|\bdebugger\b' <files>` must be **0**.

For UI / a11y / perf changes, also run:

9. **Lighthouse audit** — `bun run lighthouse:audit` → meets gates from `.claude/config.json::gates` (Lighthouse ≥ 95 across categories; LCP ≤ 2500ms; CLS = 0; INP ≤ 100ms; initial JS ≤ 50KB).
10. **Smoke test** — `bun run smoke-test`.

## Protected files (cardinal — confirm before touching)

Per `.claude/config.json::protectedFiles.exact`:
- `astro.config.mjs` (redirect tri-sync sources)
- `src/lib/whatsapp.ts` (WhatsApp SSOT)
- `src/content.config.ts` (Content Collections schema)
- `package.json`, `tsconfig.json`, `biome.json`, `lefthook.yml`

Edit only with explicit reason. Schema changes to `src/content.config.ts` trigger downstream content-shape audits.

## On gate failure

STOP. Report which gate + exact error. **Never `git commit --amend`** after hook failure — original commit did NOT happen; amending modifies PREVIOUS commit (data loss risk). Instead: fix → re-stage touched files → fresh `git commit -m "..."`.

**Never `--no-verify`** unless user explicitly requests.

## CRLF mass recovery

If CI surfaces hundreds of formatter errors at once, likely line-ending mismatch:

```bash
bunx biome check --write && git add --renormalize .
```

## Branch protection (HARD RULE — non-negotiable)

`main` is **read-only** mirror of approved + merged work. Workflow: `dev-test → PR → user approves + merges`.

- **Never** `git checkout main` or work on main.
- **Never** `git push origin main`.
- **Never** `gh pr merge --auto` on a PR you opened.
- **Never** force-push to shared branches.

Detail: `.claude/CLAUDE.md § Branch protection` (when present) + project routing.

## When to load more

| Need | Load |
|---|---|
| Universal stability + smoke template | `.claude/rules/stability.md` |
| MCP + terminal + debug discipline | `.claude/rules/mcp.md` |
| Commands inventory + skill phase ordering | `.claude/rules/commands.md` |
| Astro invariants (cardinals #4 #5 #6) | `.claude/rules/astro.md` |
| Cardinal rules + project routing | `.claude/CLAUDE.md` |
