# Rules — Tier 2 Guardrails (gpus-site)

> Tier-2 rules for **gpus-site** (Astro 6 + React 19 + Tailwind v4 + Bun + static-only MPA, deploy Railway).
> Universal substance survives portability; project-specific values resolve from `.claude/config.json` + `Skill('astro')` + `Skill('gpus-theme')` + `Skill('grupo-us')`.
> Loaded on demand by `/prime` per routing matrix in `.claude/CLAUDE.md`, plus auto-load by `globs:` frontmatter when matching files are read.

## Files

| File | Scope |
|---|---|
| `frontend.md` | Component placement, Astro `client:*` routing, Content Collections SSOT, forms, external surfaces, perf budget, a11y, redirect tri-sync |
| `DESIGN.md` | Color tokens, typography, components spec, layout, radius, iconography, motion, imagery, depth, focus |
| `stability.md` | A–L checklist, render-mode invariants, CWV gates, smoke template, anti-patterns, debug triage |
| `seo.md` | pt-BR locale, routes, `@astrojs/sitemap` config, robots, OG/Twitter, JSON-LD, CWV, AI citation (GEO) |
| `astro.md` | Astro static-only invariants, hydration directive table, Content Collections SSOT, redirect tri-sync, View Transitions opt-in, `client:only` ban, `Layout.astro` contracts |
| `commit.md` | Conventional Commits + scopes, lefthook pre-commit + manual gate checklist, protected files, branch protection |
| `mcp.md` | MCP server inventory, terminal discipline (POSIX + Bun-only), PAUSE-THINK-HYPOTHESIZE-EXECUTE debug loop |
| `commands.md` | 11 slash commands + invocation matrix, skill phase ordering, agent ↔ skill pairings |

## How rules load

1. `/prime [auto|frontend]` reads `.claude/CLAUDE.md § Routing matrix`.
2. Routing matrix maps task signal → rule file(s).
3. Rules with `globs:` / `paths:` frontmatter auto-load when Claude Code reads files matching the glob.
4. Stops at minimum-viable context.

## Stack signals (this project)

| Surface | Skill / Rule |
|---|---|
| `*.astro`, Content Collections, `client:*`, `astro.config.mjs`, View Transitions | `Skill('astro')` + `.claude/rules/astro.md` |
| React 19 islands (`*.tsx` inside `src/components`) | `Skill('astro')` (React-in-Astro section) |
| Tailwind v4 `@theme` in `src/styles/global.css` | `Skill('gpus-theme')` + `Skill('astro')` |

## Project signals (this project)

| Surface | Skill |
|---|---|
| Navy/Gold HSL token canon + semantic token map | `Skill('gpus-theme')` |
| Brand voice + product canon + sales journey + CTAs | `Skill('grupo-us')` |
| WhatsApp Laura SSOT (`WHATSAPP_SDR_E164`, "Olá, Laura!" prefix) | `Skill('grupo-us')` → `references/whatsapp-ssot.md` |

## Cardinal rules

Non-negotiable invariants (8 cardinals) live in **`.claude/CLAUDE.md § Cardinal rules`** (Bun-only, branch protection `dev-test → PR`, no SPA, no SSR override, content via `getCollection`, WhatsApp SSOT, no hardcoded hex outside `@theme`, no layout-property animation). Rules here support those cardinals — never override or duplicate.

## Cross-project portability

Universal substance (`frontend.md`, `DESIGN.md`, `stability.md`, `seo.md`) survives drop-in into another project — swap `gpus-theme` / `grupo-us` skill names + edit `.claude/config.json` (`project.*`, `paths.*`, `tooling.*`, `gates.*`). Project-specific rules (`astro.md`, `commit.md`, `mcp.md`, `commands.md`) reference gpus-site invariants and need adaptation per repo.
