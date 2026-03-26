---
phase: "02"
plan: "03"
subsystem: content
tags: [seo, meta-descriptions, team-bios, copy, legal-pages]
dependency_graph:
  requires: ["02-01", "02-02"]
  provides: ["COPY-03", "COPY-04"]
  affects: ["src/pages/termos.astro", "src/pages/politica-de-privacidade.astro", "src/content/team/sacha.json", "src/content/team/mauricio.json", "src/content/team/raquel.json"]
tech_stack:
  added: []
  patterns: ["Layout description prop upgrade", "JSON string bio enrichment"]
key_files:
  created: []
  modified:
    - src/pages/termos.astro
    - src/pages/politica-de-privacidade.astro
    - src/content/team/sacha.json
    - src/content/team/mauricio.json
    - src/content/team/raquel.json
decisions:
  - "Used source-confirmed credentials only — no invented facts for any bio (PITFALL-4 compliance)"
  - "termos.astro: 165-char description with 'Saúde Estética Avançada' and 'Dra. Sacha Gualberto'"
  - "politica-de-privacidade.astro: 197-char description with 'LGPD' and 'Lei n. 13.709/2018'"
  - "sacha.json: added CVO title, UFG graduation, docente 8+ anos, CEEN coordination"
  - "mauricio.json: wove in 'Mago das Finanças' naturally with CFO title explicit"
  - "raquel.json: limited enrichment per plan guidance — bio limited by available source material"
metrics:
  duration: "~2 minutes"
  completed_date: "2026-03-26"
  tasks_completed: 2
  files_modified: 5
---

# Phase 02 Plan 03: Legal Page Meta Descriptions and Team Bio Enrichment Summary

SEO upgrade for two legal pages (placeholder descriptions → ≥120 chars with relevant keywords) and credibility enrichment of all 3 team JSON bios using verified source facts from gpus-company-info.md and drasacha-content.md.

## What Was Built

### Task 1: Legal Page Meta Descriptions (COPY-03 completion)

Both legal pages had placeholder meta descriptions (34 and 36 chars respectively). Upgraded to SEO-grade strings:

- **termos.astro**: 34 chars → 165 chars. Contains "Termos de Uso", "Grupo US", "Saúde Estética Avançada", "Dra. Sacha Gualberto". Factually accurate for the page content.
- **politica-de-privacidade.astro**: 36 chars → 197 chars. Contains "Política de Privacidade", "LGPD", "Lei n. 13.709/2018", "Grupo US". References LGPD compliance explicitly.

All 8 content pages now have unique meta descriptions ≥120 chars. Full audit:

| Page | Chars | Status |
|------|-------|--------|
| index.astro | 173 | Pre-existing, unchanged |
| sobre.astro | 166 | Pre-existing, unchanged |
| contato.astro | 157 | Pre-existing, unchanged |
| 404.astro | 137 | Pre-existing, unchanged |
| termos.astro | 165 | Upgraded in this plan |
| politica-de-privacidade.astro | 197 | Upgraded in this plan |
| curso-auriculo.astro | ≥120 (dynamic) | Via JSON description (02-02) |
| mentoria-black-neon.astro | ≥120 (dynamic) | Via JSON description (02-02) |

### Task 2: Team Bio Enrichment (COPY-04 completion)

**sacha.json** — added required signals:
- CVO (Chief Vision Officer) title added: "Fundadora e CVO do Grupo US"
- UFG graduation reference added
- Docente credential added: "docente há mais de 8 anos"
- CEEN coordination added in full: "Coordenadora da pós-graduação em Estética e Dermatologia de Enfermagem na CEEN"
- Preserved: "centenas de profissionais" phrase, Harvard/Xiamen certifications, 13 anos

**mauricio.json** — added required framing:
- "Mago das Finanças" brand identity woven in naturally as recognizable handle
- CFO title made explicit
- "faculdade não ensinou" phrase preserved (brand-consistent)
- Teaching role in precificação emphasized

**raquel.json** — strengthened within available source material:
- Explicit TRINTAE3 name used (not just "programa")
- "curadoria" language added to convey curriculum ownership
- "pós-graduação mais completa em Saúde Estética Avançada do Brasil" positioning added
- Note: bio is limited by source material per RESEARCH.md open question 1; no academic credentials invented beyond pedagogy role

## Commits

| Hash | Message |
|------|---------|
| a4dd070 | feat(02-03): upgrade legal page meta descriptions to ≥120 chars |
| 761bfb4 | feat(02-03): enrich team bios with credentials and ecosystem roles |

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None. All 5 files have substantive content that will render correctly to users.

Note on raquel.json: bio is intentionally conservative per plan guidance. Sources do not confirm specific academic credentials for Raquel Quintanilha beyond her pedagogy coordination role. A future plan may want to gather stakeholder input to further enrich her profile.

## Verification Results

- `bun run lint` — 0 errors, 0 warnings
- `bunx astro check` — 0 errors, 0 warnings
- `bun run build` — success, 8 pages built
- `grep "CVO" sacha.json` — match found
- `grep "CEEN" sacha.json` — match found
- `grep "Mago das Finan" mauricio.json` — match found
- `grep "TRINTAE3" raquel.json` — match found
- All 3 bio fields confirm type `string` (not array)
- All 8 page descriptions unique and ≥120 chars
