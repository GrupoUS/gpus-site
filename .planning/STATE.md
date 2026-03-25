# Project State

**Project:** Portal Grupo US — Enhancement Milestone v2
**Initialized:** 2026-03-25
**Status:** Ready for Phase 1

## Project Reference

See: `.planning/PROJECT.md` (updated 2026-03-25)

**Core value:** Cada visitante sente o nível de excelência do Grupo US em 3 segundos — design imersivo, copy de impacto, jornada clara.
**Current focus:** Phase 1 — Technical Debt & Foundation

## Active Milestone

**v2 Enhancement — Visual Premium + SEO + React Islands**

6 phases, 24 v1 requirements.

## Phase Progress

| Phase | Name | Status |
|-------|------|--------|
| 1 | Technical Debt & Foundation | Not Started |
| 2 | Content & Copy Overhaul | Not Started |
| 3 | Visual Uplift & Animations | Not Started |
| 4 | React Islands | Not Started |
| 5 | SEO Technical Layer | Not Started |
| 6 | QA & Ship | Not Started |

## Key Context for Future Sessions

- **CRITICAL:** Remove debug instrumentation first (5 files with `#region agent log` → `127.0.0.1:7777`) before any other work
- **Codebase map:** `.planning/codebase/` (7 docs, 1383 lines) — always reference before planning
- **Design tokens:** Navy `#1a1a2e`, Gold `#d4af37`, fonts Playfair Display + Inter
- **Content source:** `docs/plans/aprimoramento/gpus-company-info.md` + `.planning/research/drasacha-content.md`
- **Journey order:** curso-auriculo → comunidade-us → trintae3 → mentoria-black-neon → otb
- **Build gates:** `bun run lint` + `bunx astro check` + `bun run build` (must pass after each phase)
- **Package manager:** Bun only. Never npm/yarn/pnpm.
- **Deploy:** Railway via git push main

## Artifacts

- `.planning/PROJECT.md` — Project context, requirements, constraints
- `.planning/REQUIREMENTS.md` — 24 v1 requirements with IDs and traceability
- `.planning/ROADMAP.md` — 6 phases with plans and acceptance criteria
- `.planning/codebase/` — Codebase map (STACK, ARCH, STRUCTURE, CONVENTIONS, TESTING, INTEGRATIONS, CONCERNS)
- `.planning/config.json` — GSD workflow config (balanced profile, all agents on)
- `.planning/research/drasacha-content.md` — drasacha.com.br content research (in progress)
