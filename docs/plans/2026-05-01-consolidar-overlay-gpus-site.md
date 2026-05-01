# Plan: Consolidate `.claude/overlay/gpus-site/` — fewer, more defined files

**Complexity:** L5 — Medium · doc/config infra · 9 files dropped, 4 files merged-into, 0 `src/` code touched, semantic content preservation required.
**Layers:** Overlay infra layer (docs/config). No src/ layer touched. Verify via filesystem listing + agent rule resolution smoke.
**Assumptions:**
- [ASSUMED] Generic `.claude/rules/{frontend,DESIGN,stability,integrations,backend,database}.md` stay untouched as scaffolds — overlay-first resolution still works when overlay rules are merged.
- [ASSUMED] Skills (`gpus-theme`, `grupo-us`, `astro`, `planning`, `debugger`, `performance-optimization`) and commands (`/prime`, `/plan`, `/debug`, `/verify`, `/implement`) gracefully handle missing optional supplements (`anti-patterns.md`, `routing-supplements.md`, `verify-supplements.md`, `layer-map.md`, `project-snapshot.md`, `debugger-domain-rules.md`) per `_shared.md § 0` ("if exists, load") — degrade is acceptable.
- [ASSUMED] `.claude/skills/` is out of scope for consolidation. Each skill is independent capability; no merge candidates. User asked to *analyze* skills — analysis below confirms they don't overlap with overlay rules (skills are reference-knowledge / automation capability, overlay is project-specific constraint).
- [ASSUMED] `seo-supplement.md` keeps its filename so the `performance-optimization` skill auto-loads it. Renaming would silently break that hook.

---

## Context

After last turn, `.claude/overlay/gpus-site/` ships **16 files / 2156 lines** mirroring the donor `missao-amazonica/` shape. Inspecting the result: heavy duplication across files inflates context cost without payback for a static institutional site.

**Concrete duplication examples:**
- A11y patterns appear in 3 places: `rules/a11y.md` (145 lines) + `rules/frontend.md § Accessibility` (15 lines) + skip-link mention in `CLAUDE-overlay.md`. Same skip-link id, same `<noscript>` rule, same FAQ grid pattern.
- Anti-pattern catalog appears in 3 places: `anti-patterns.md` (64 lines) + `debugger-domain-rules.md` (182 lines, "Frontend anti-patterns to flag" section) + `rules/frontend.md § Negative Constraints` (15 lines).
- Smoke tests appear in 2 places: `verify-supplements.md` (134 lines) + `rules/stability.md § Verification After Changes` (15 lines).
- Routing matrix appears in 2 places: `CLAUDE-overlay.md § Routing matrix` + `routing-supplements.md` (38 lines).
- Architecture map appears in 2 places: `project-snapshot.md` (197 lines) + already in `AGENTS.md § Architecture Map` (full tree, learnings log, checklist).
- WhatsApp SSOT contract appears in 3 places: `rules/integrations.md § WhatsApp` (full) + `rules/frontend.md § WhatsApp` (summary) + `CLAUDE-overlay.md § Cardinal rules` (one-line).
- External redirect tri-sync appears in 3 places: `rules/content.md § External redirect contract` (full) + `rules/integrations.md § External product sites` (full) + `routing-supplements.md` (one row) + `anti-patterns.md` (one row).

Goal: **reduce to 7 well-defined files** (~900 lines, ~58% line reduction) where each file owns its domain cleanly with zero cross-file content overlap.

This is pure context-engineering: no behavior change in `src/`, no rule weakened — just sharper file boundaries that load less when the agent only needs one domain.

---

## Skills analysis (out of scope for merge)

User asked to analyze `.claude/skills/`. Verdict: **no skill should be merged or deleted.**

| Skill | Type | Overlap with overlay? |
|---|---|---|
| `gpus-theme` | reference (Navy/Gold tokens) | overlay `rules/DESIGN.md` *cites* this skill (Tier-3 pointer); does not duplicate. **Keep.** |
| `grupo-us` | reference (brand voice, product IDs, journey) | overlay `rules/content.md` *cites* this skill; does not duplicate. **Keep.** |
| `astro` | reference (framework knowledge) | generic — used for any Astro task. **Keep.** |
| `auto-research-gpus` | automation | unique. **Keep.** |
| `debugger` | command | references overlay `anti-patterns.md` + `debugger-domain-rules.md` (we'll re-point at `rules/stability.md` after merge). **Keep.** |
| `evolution-core`, `evolve-autoresearch` | meta-automation | unique. **Keep.** |
| `performance-optimization` | command | references overlay `seo-supplement.md` (preserved). **Keep.** |
| `planning` | command | reads overlay `layer-map.md` (we'll fold into `CLAUDE-overlay.md`; planning skill falls back to generic layer template). **Keep.** |
| `senior-prompt-engineer`, `skill-creator`, `xlsx`, `ui-ux-pro-max` | unique capabilities | **Keep.** |

Action on skills: **none.** Only the overlay structure consolidates.

---

## Generic `.claude/rules/` analysis (out of scope for change)

User asked to analyze `.claude/rules/`. Verdict: **no generic file should change.**

Generic rules act as scaffolds — overlay-first resolution per `_shared.md § 0` means the overlay version overrides the generic one for canonical names (`backend`, `database`, `frontend`, `integrations`, `stability`, `DESIGN`). Path-rule stubs (`a11y`, `config`, `content`, `hooks`, `seo`) are project-agnostic checklists kept for any project that adopts this `.claude/` directory.

The duplication problem is **inside the overlay**, not between overlay and generic. Generic stays exactly as-is.

Action on generic: **none.**

---

## Current state → Target state

### Drop (9 files, ~1090 lines deleted; semantic content merged into 4 keep files)

| Current file | Lines | Content destination |
|---|---|---|
| `routing-supplements.md` | 38 | Merge rows into `CLAUDE-overlay.md § Routing matrix` (already partial there) |
| `project-snapshot.md` | 197 | Drop. `AGENTS.md` already covers architecture map / commands / gates / checklist. Add 1 paragraph "see AGENTS.md" pointer in `CLAUDE-overlay.md`. |
| `layer-map.md` | 81 | Compress to ~15-line block in `CLAUDE-overlay.md § Layer chain`. `planning` skill falls back to generic layer template (acceptable — static site has trivial layer chain). |
| `anti-patterns.md` | 64 | Merge into `rules/stability.md § Anti-patterns` (single section). |
| `debugger-domain-rules.md` | 182 | Merge `Quick Triage Matrix` + bug classes (reveal / FAQ grid / redirect drift / WhatsApp drift / hydration) into `rules/stability.md § Debug triage`. Drop tRPC/Drizzle/Neon/Stripe sections (already pruned, but still present). |
| `verify-supplements.md` | 134 | Merge smoke-test commands into `rules/stability.md § Smoke tests`. |
| `rules/integrations.md` | 148 | Merge WhatsApp SSOT + redirect tri-sync + Google Fonts + Railway + Lucide tree-shake into `rules/frontend.md § External surfaces`. |
| `rules/content.md` | 196 | Merge Content Collections schema + journey order + redirect tri-sync into `rules/frontend.md § Content Collections`. |
| `rules/a11y.md` | 145 | Merge skip link + reveal fallback + FAQ grid + focus ring + smoke test into `rules/frontend.md § Accessibility` (expand from current 15 lines to ~50). |

### Keep + slim (7 files; final ~900 lines)

| File | Current | Target | What lives here |
|---|---|---|---|
| `CLAUDE-overlay.md` | 93 | ~140 | Tier 1 — identity, cardinal rules (8 numbered), routing matrix (full from old routing-supplements.md), layer chain compressed, Tier-3 pointers (skills + AGENTS.md). |
| `seo-supplement.md` | 112 | ~80 | Slim — drop redundant explanations, keep route table + JSON-LD blocks + sitemap rule + CWV thresholds. **Keep filename** (auto-loaded by `performance-optimization` skill). |
| `protected-files.json` | 11 | 11 | No change — mechanical (hook input). |
| `README.md` | 45 | ~35 | Slim file index reflecting new shape; load chain unchanged. |
| `rules/DESIGN.md` | 430 | ~250 | Slim: drop §15-§16 implementation pointers (already in `gpus-theme` skill), drop §14 Agent Quick Reference duplicate token table (single token table only), drop redundant contrast rationale. Keep: north star, anti-traps, full token table (one), typography, components spec, motion, custom utilities, Do/Don't. |
| `rules/frontend.md` | 184 | ~330 | **Absorb a11y + content + integrations.** Sections: Render mode · Component placement · Hydration · Styling · Icons · Content Collections (NEW from `content.md`) · External surfaces — WhatsApp SSOT + redirect tri-sync + Fonts + Railway (NEW from `integrations.md`) · Performance · Images · Accessibility (EXPANDED from `a11y.md`) · Negative constraints · When to load more. |
| `rules/stability.md` | 107 | ~250 | **Absorb verify + anti-patterns + debugger triage.** Sections: Core checklist A–L · Static-site invariants · Performance gates · Smoke tests (FROM `verify-supplements.md`) · Anti-patterns by domain (FROM `anti-patterns.md`) · Debug triage — bug classes + quick triage matrix (FROM `debugger-domain-rules.md`) · Verification after changes · Escalation triggers. |

**Final tree:**
```
.claude/overlay/gpus-site/
├── CLAUDE-overlay.md              # Tier 1 (140 lines)
├── seo-supplement.md              # auto-loaded by performance-optimization skill (80 lines)
├── protected-files.json           # mechanical (11 lines)
├── README.md                      # file index + load chain (35 lines)
└── rules/
    ├── DESIGN.md                  # tokens + typography + components + motion (250 lines)
    ├── frontend.md                # render + components + hydration + content + WhatsApp + redirects + a11y + perf (330 lines)
    └── stability.md               # checklist + smoke tests + anti-patterns + debug triage (250 lines)
```

7 files / ~1100 lines (lines slightly higher than rough estimate because I'm preserving substance, just removing duplication). Net: **9 files dropped (56% file count reduction); ~1050 lines net reduction (~49%).**

---

## Phase 1: Plan content moves (no writes yet) [SEQUENTIAL]

Before any write, lay out the merge map per file so the consolidation is mechanical and reviewable.

- [ ] Map `anti-patterns.md` (10 sections × 64 lines) → `rules/stability.md § Anti-patterns by domain`. Group: Render mode · Hydration · Content drift · WhatsApp · Design · A11y · Tooling · Common bug sources.
- [ ] Map `debugger-domain-rules.md § Frontend Debug Rules + Quick Triage Matrix` (~80 lines after pruning N/A backend/auth/audit blocks) → `rules/stability.md § Debug triage`.
- [ ] Map `verify-supplements.md` smoke commands (~70 lines after slim) → `rules/stability.md § Smoke tests` (keep one block per check; drop checklist appendix already covered by `AGENTS.md § Checklist Pre-Entrega`).
- [ ] Map `rules/integrations.md § WhatsApp + External + Fonts + Railway + Lucide` (~120 lines after slim) → `rules/frontend.md § External surfaces`.
- [ ] Map `rules/content.md § Layout + Schema + Journey + External redirect contract + Conventions + Quick paths` (~150 lines after slim) → `rules/frontend.md § Content Collections`.
- [ ] Map `rules/a11y.md` (skip link + reveal + FAQ grid + focus ring + smoke + headings + ARIA + contrast + forms + anchors + images) → `rules/frontend.md § Accessibility` (expanded).
- [ ] Map `routing-supplements.md` rows → `CLAUDE-overlay.md § Routing matrix` (replace existing 8-row table with 12-row consolidated table).
- [ ] Map `layer-map.md § Stack + Layer order + Auth: none + Verification commands + Key invariants` → `CLAUDE-overlay.md § Layer chain` (compressed: code block of layer order + 4-row file-path table for top paths + 11 numbered invariants).
- [ ] Map `project-snapshot.md` → drop entirely; add single line in `CLAUDE-overlay.md § Pointers`: "Architecture map / commands table / pre-delivery checklist live in root `AGENTS.md`."

**Verify:** mentally walk each section — every distinct piece of content has exactly one destination, with no orphans.

## Phase 2: Slim & rewrite kept files [SEQUENTIAL — content moves dictate write order]

Order matters: stability and frontend grow first (absorb dropped content), THEN drop redundant files, THEN slim DESIGN/seo/CLAUDE-overlay/README.

- [ ] **Rewrite** `D:\Coders\gpus-site\.claude\overlay\gpus-site\rules\stability.md` — final ~250 lines per Phase 1 mapping. Sections in order: Purpose · Core checklist A–L (compact) · Static-site invariants · Performance gates · Smoke tests · Anti-patterns by domain · Debug triage (bug classes + quick triage table) · Verification after changes · Escalation triggers · When to load more.
- [ ] **Rewrite** `D:\Coders\gpus-site\.claude\overlay\gpus-site\rules\frontend.md` — final ~330 lines per Phase 1 mapping. Sections in order: Purpose · Render mode · Component placement · Hydration directives · Styling · Icons · Content Collections (Layout + Schema + Journey + Tri-sync + Conventions) · External surfaces (WhatsApp SSOT + Redirect tri-sync sync + Google Fonts + Railway + Lucide tree-shake) · Forms · Performance · Images · Accessibility (skip link + reveal + FAQ grid + focus ring + headings + ARIA + contrast + smoke) · Negative constraints · When to load more.
- [ ] **Rewrite** `D:\Coders\gpus-site\.claude\overlay\gpus-site\CLAUDE-overlay.md` — final ~140 lines. Sections: Project identity · Behavior overrides · Routing matrix (12 rows from old `routing-supplements.md` merged) · Cardinal rules (8 numbered) · Project-specific guards · Layer chain (compressed code block + key paths + 11 invariants) · Pointers (skills + AGENTS.md + 7-file overlay manifest) · Removing or replacing.
- [ ] **Slim** `D:\Coders\gpus-site\.claude\overlay\gpus-site\rules\DESIGN.md` — drop §14 Agent Quick Reference (token table duplicates §2.3), drop §15 Implementation Pointers (already in `gpus-theme` skill), drop §16 Future Activation. Compress §11 Custom Utilities (link to `src/styles/global.css`). Target ~250 lines.
- [ ] **Slim** `D:\Coders\gpus-site\.claude\overlay\gpus-site\seo-supplement.md` — drop verbose explanations on routes / OG / robots; keep table + JSON-LD blocks + sitemap filter rule. Target ~80 lines.
- [ ] **Slim** `D:\Coders\gpus-site\.claude\overlay\gpus-site\README.md` — update file index for new 7-file shape; drop "Files NOT provided" + "Files added" sections (no longer relevant after consolidation). Target ~35 lines.

**Verify after each rewrite:** open the file in editor, confirm section count + estimated line count match target. Confirm no leftover references to dropped files.

## Phase 3: Drop merged files [PARALLEL — independent deletes]

Delete only after Phase 2 confirms content fully captured in keep files.

- [ ] `D:\Coders\gpus-site\.claude\overlay\gpus-site\routing-supplements.md`
- [ ] `D:\Coders\gpus-site\.claude\overlay\gpus-site\project-snapshot.md`
- [ ] `D:\Coders\gpus-site\.claude\overlay\gpus-site\layer-map.md`
- [ ] `D:\Coders\gpus-site\.claude\overlay\gpus-site\anti-patterns.md`
- [ ] `D:\Coders\gpus-site\.claude\overlay\gpus-site\debugger-domain-rules.md`
- [ ] `D:\Coders\gpus-site\.claude\overlay\gpus-site\verify-supplements.md`
- [ ] `D:\Coders\gpus-site\.claude\overlay\gpus-site\rules\integrations.md`
- [ ] `D:\Coders\gpus-site\.claude\overlay\gpus-site\rules\content.md`
- [ ] `D:\Coders\gpus-site\.claude\overlay\gpus-site\rules\a11y.md`

**Verify:** `ls .claude/overlay/gpus-site/` shows 4 entries (`CLAUDE-overlay.md`, `seo-supplement.md`, `protected-files.json`, `README.md`, `rules/`). `ls .claude/overlay/gpus-site/rules/` shows 3 entries (`DESIGN.md`, `frontend.md`, `stability.md`).

## Phase 4: Update orphan references [SEQUENTIAL]

After deletes, scan for stale pointers in remaining files.

- [ ] `grep -rn "routing-supplements\|project-snapshot\|layer-map\|anti-patterns\|debugger-domain-rules\|verify-supplements\|rules/integrations\|rules/content\|rules/a11y" .claude/overlay/gpus-site/` — must be empty (or only inside README.md change-log section if added).
- [ ] Same grep across `.claude/commands/` and `.claude/agents/` — should already return zero project-specific hits (these reference generic `.claude/rules/` names per `_shared.md § 0`). Verify no breakage.
- [ ] Search root `AGENTS.md` for `${overlay}/` references — confirm any that pointed at dropped files now point at consolidated targets (most likely no AGENTS.md change needed).

**Verify:** all greps clean.

## Phase 5: Final verification [SEQUENTIAL]

- [ ] `node -e "JSON.parse(require('fs').readFileSync('.claude/overlay/gpus-site/protected-files.json','utf8')); console.log('OK')"` — JSON still parses.
- [ ] `wc -l .claude/overlay/gpus-site/*.md .claude/overlay/gpus-site/rules/*.md` — total ≤ 1200 lines (target ~1100).
- [ ] `bun run lint && bunx astro check && bun run build` — `src/` unaffected; build still green.
- [ ] **Loader smoke (manual)** — in next session, run `/prime frontend` and confirm response cites `${overlay}/rules/frontend.md` (now the larger consolidated version) and does not error on missing `routing-supplements.md` / `anti-patterns.md`.
- [ ] **Routing smoke** — confirm `${overlay}/CLAUDE-overlay.md § Routing matrix` includes every row that lived in `routing-supplements.md` (12 rows total).

---

## Risks

| Risk | Mitigation |
|---|---|
| Skill auto-load breaks (e.g., `performance-optimization` looking for `seo-supplement.md`) | Preserve `seo-supplement.md` filename verbatim. |
| `/debug` skill loses anti-patterns context when it auto-looks for `anti-patterns.md` / `debugger-domain-rules.md` | `_shared.md § 0` lists these as **optional**; skill degrades gracefully. Content lives in `rules/stability.md` which `/debug` reads anyway via the routing matrix. |
| `planning` skill loses `layer-map.md` | Skill falls back to generic layer template. Static-site layer chain is trivial (Content → Page → Layout → Section → Style); fallback acceptable. The compressed version in `CLAUDE-overlay.md` covers any agent that reads Tier-1. |
| Content loss during merge | Phase 1 maps every section to a destination before any write; Phase 4 grep confirms no orphan references; reading the rewritten files end-to-end before deletion catches drift. |
| `frontend.md` becomes too large to load efficiently (defeats consolidation purpose) | 330 lines is still under typical context budget for one rule file. Comparison: `missao-amazonica/rules/frontend.md` is 151 lines but `missao-amazonica/rules/DESIGN.md` is much larger — agent already loads larger files. The token cost saved by NOT loading 3 files (frontend + integrations + content) is greater than the cost of one 330-line file. |
| Cardinal-rule weakening through compression | Rewrite each kept file from scratch using existing content as input — preserve every numbered cardinal rule, every "NEVER" / "always" verbatim. Self-audit: count numbered rules before and after; must match. |

---

## Out of scope (do NOT change)

- `src/` — no code changes. Overlay consolidation is documentation/config only.
- `astro.config.mjs`, `package.json`, `tsconfig.json`, `biome.json`, `lefthook.yml` — protected.
- `.claude/skills/` — analyzed; no merges.
- `.claude/rules/` (generic) — analyzed; no changes (acts as fallback scaffold).
- `.claude/commands/`, `.claude/agents/` — automatic discovery via `_shared.md § 0`; no edits needed.
- `AGENTS.md` — already covers architecture, commands, gates, learnings log; consolidation references it instead of duplicating.
- `.claude/config.json` — already updated last turn (`overlay: ".claude/overlay/gpus-site"`); no further edits.
- `.claude/overlay/missao-amazonica/` — preserved as donor reference; ignored once `overlay` config flipped.

---

## Critical files to read during execution

- `D:\Coders\gpus-site\.claude\overlay\gpus-site\rules\frontend.md` — current 184 lines
- `D:\Coders\gpus-site\.claude\overlay\gpus-site\rules\stability.md` — current 107 lines
- `D:\Coders\gpus-site\.claude\overlay\gpus-site\rules\integrations.md` — source for merge into frontend.md (148 lines)
- `D:\Coders\gpus-site\.claude\overlay\gpus-site\rules\content.md` — source for merge into frontend.md (196 lines)
- `D:\Coders\gpus-site\.claude\overlay\gpus-site\rules\a11y.md` — source for merge into frontend.md § Accessibility (145 lines)
- `D:\Coders\gpus-site\.claude\overlay\gpus-site\anti-patterns.md` — source for merge into stability.md (64 lines)
- `D:\Coders\gpus-site\.claude\overlay\gpus-site\debugger-domain-rules.md` — source for merge into stability.md (182 lines)
- `D:\Coders\gpus-site\.claude\overlay\gpus-site\verify-supplements.md` — source for merge into stability.md (134 lines)
- `D:\Coders\gpus-site\.claude\overlay\gpus-site\routing-supplements.md` — source for merge into CLAUDE-overlay.md (38 lines)
- `D:\Coders\gpus-site\.claude\overlay\gpus-site\layer-map.md` — source for compress into CLAUDE-overlay.md (81 lines)
- `D:\Coders\gpus-site\.claude\overlay\gpus-site\rules\DESIGN.md` — current 430 lines (slim only, no source merges)
- `D:\Coders\gpus-site\.claude\overlay\gpus-site\seo-supplement.md` — current 112 lines (slim only)
- `D:\Coders\gpus-site\.claude\overlay\gpus-site\README.md` — current 45 lines (slim only)
- `D:\Coders\gpus-site\.claude\overlay\gpus-site\CLAUDE-overlay.md` — current 93 lines (rewrite — absorb routing + layer)
- `D:\Coders\gpus-site\.claude\commands\_shared.md` — confirm Section 0 overlay-resolution recipe + optional supplements list
- `D:\Coders\gpus-site\AGENTS.md` — confirm architecture map / commands / checklist still authoritative (so dropping `project-snapshot.md` is safe)

---

## Verify

```bash
# 1. Filesystem shape matches target
ls .claude/overlay/gpus-site/         # expect: 4 files + rules/ dir
ls .claude/overlay/gpus-site/rules/   # expect: 3 files

# 2. Total line count under target
wc -l .claude/overlay/gpus-site/*.md .claude/overlay/gpus-site/rules/*.md
# expect: total ≤ 1200 lines (current 2156 → target ~1100)

# 3. JSON still parses
node -e "JSON.parse(require('fs').readFileSync('.claude/overlay/gpus-site/protected-files.json','utf8')); console.log('OK')"

# 4. No orphan references to dropped files
grep -rn "routing-supplements\|project-snapshot\|layer-map\|anti-patterns\|debugger-domain-rules\|verify-supplements\|rules/integrations\|rules/content\|rules/a11y" .claude/overlay/gpus-site/
# expect: empty (or only README.md change-log line)

# 5. Site build unaffected
bun run lint && bunx astro check && bun run build
# expect: green

# 6. Cardinal-rule preservation (manual self-audit)
grep -cE "^[0-9]+\." .claude/overlay/gpus-site/CLAUDE-overlay.md
# expect: 8 numbered cardinal rules preserved
```

---

## Self-Review Checklist

- [x] Affected layers identified — overlay infra (docs/config); no `src/` layer touched
- [x] Verify command specified per phase — filesystem ls + grep + build
- [x] No hardcoded hex in plan tasks — N/A (pure docs consolidation)
- [x] All assumptions labeled `[ASSUMED]`
- [x] Layer order respected — content moves before deletes before slim before final verification
- [x] No "TBD" — every file has a defined destination
- [x] Confidence ≥ 4 — full overlay/skills/rules content already explored in current session

---

Next: run `/implement` to execute (or `/plan --build` to spawn implementation automatically), or ask to adjust any phase above.
