---
phase: 2
slug: content-and-copy-overhaul
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-26
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Astro build + Biome + oxlint (no unit test runner) |
| **Config file** | `biome.json`, `astro.config.mjs` |
| **Quick run command** | `bunx astro check` |
| **Full suite command** | `bun run lint && bunx astro check && bun run build` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `bunx astro check`
- **After every plan wave:** Run `bun run lint && bunx astro check && bun run build`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | Status |
|---------|------|------|-------------|-----------|-------------------|--------|
| 2-01-01 | 2.1 | 1 | COPY-01 | build gate | `bun run build` (Zod validates JSON structure) | ⬜ pending |
| 2-02-01 | 2.2 | 1 | COPY-02 | build gate | `bunx astro check && bun run build` | ⬜ pending |
| 2-03-01 | 2.3 | 1 | COPY-03 | manual + build | `bunx astro check` + manual length check | ⬜ pending |
| 2-03-02 | 2.3 | 1 | COPY-04 | manual + build | `bunx astro check` | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

None — existing infrastructure covers all phase requirements. No new test files needed. This phase creates content-only changes validated at build time by the Zod schema in `src/content.config.ts`.

*Existing infrastructure covers all phase requirements.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Accent correctness in JSON files | COPY-01 | Zod validates structure, not text content — no automated accent checker | Read each modified JSON, verify Portuguese words like "Saúde", "Estética", "Avançada" are correctly accented |
| Meta description length ≥120 chars | COPY-03 | Build doesn't validate description length | Open browser DevTools on each page, inspect `<meta name="description">`, confirm `content.length >= 120` |
| Meta descriptions are unique per page | COPY-03 | No duplicate-detection gate in build | Manually compare all 8 meta description strings — no two should be identical |
| Team bio credibility signals | COPY-04 | Bio content is `z.string()` — not schema-constrained | Review each of the 3 bios: Sacha, Maurício, Raquel — verify credentials, years of experience, and ecosystem role are present |
| Brand voice consistency | COPY-02 | Subjective quality gate | Read product copy aloud; confirm tone is professional, acolhedor, inspirador, firme; check for key phrases: "Nós iluminamos", "Clareza é a nova gentileza", "Olhar de dono", "Excelência com entrega real" |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
