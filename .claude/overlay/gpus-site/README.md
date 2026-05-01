# Overlay — Grupo US · Site Institucional (gpus-site)

Project-specific supplements layered on top of generic `.claude/`. Discovered via `.claude/config.json::overlay`.

To use the framework in a different project: replace this directory with `.claude/overlay/<your-project>/` and update `.claude/config.json::overlay`. Or delete entirely — commands fall back to generic defaults.

## Files (consolidated — 7 total)

| File | Loaded by | Owns |
|---|---|---|
| `CLAUDE-overlay.md` | SessionStart hook (Tier 1, after generic CLAUDE.md) | Project identity, cardinal rules, routing matrix, layer chain, Tier-3 pointers |
| `rules/frontend.md` | overlay-first per `_shared.md § 0` (canonical name) | Render mode, components, hydration, Content Collections, WhatsApp SSOT, redirect tri-sync, Google Fonts, Railway, accessibility, performance |
| `rules/DESIGN.md` | overlay-first per `_shared.md § 0` (canonical name) | Navy/Gold tokens, typography, components spec, motion, custom utilities |
| `rules/stability.md` | overlay-first per `_shared.md § 0` (canonical name) | Universal A–L checklist, smoke tests (`/verify`), anti-patterns by domain (`/debug`), debug triage matrix, escalation triggers |
| `seo-supplement.md` | `performance-optimization` skill (auto-load) | pt-BR locale, route SEO requirements, sitemap filter, JSON-LD Organization + BreadcrumbList, CWV thresholds |
| `protected-files.json` | `protect-files.sh` hook | Protected paths (`astro.config.mjs`, `whatsapp.ts`, `content.config.ts`, lockfile, tooling configs) |
| `README.md` | this file | File index + load chain |

## Files NOT provided (vs generic)

- `rules/backend.md` — no API. Fallback to generic `.claude/rules/backend.md` if needed.
- `rules/database.md` — no DB. Fallback to generic `.claude/rules/database.md` if needed.
- `rules/integrations.md` — folded into `rules/frontend.md § External surfaces` (WhatsApp + redirects + fonts + Railway). Generic fallback exists if a routing matrix row points there.

## Auto-load chain

On SessionStart:
1. `.claude/CLAUDE.md` (generic Tier 1)
2. root `AGENTS.md` (generic + project learnings log)
3. `${overlay}/CLAUDE-overlay.md` (project Tier 1 — this overlay)

Other overlay files load on-demand when a command or skill explicitly references them via the routing matrix or `_shared.md § 0` resolution recipe.
