# Phase 2: Content & Copy Overhaul - Research

**Researched:** 2026-03-26
**Domain:** Content authoring, SEO meta descriptions, Portuguese copywriting, Astro Content Collections
**Confidence:** HIGH — all files read directly from source; no external library research required for a pure content/copy phase

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Copy Approach — Product JSONs**
- D-01: Audit-first, then act. Agent reads each product JSON, assesses current quality, and only rewrites where needed. Products that already have strong copy (notably `curso-auriculo` after recent `/evolve` sessions) must be preserved — do not overwrite good content with generic rewrites.
- D-02: For products where copy is weak or placeholder-level, perform a full field-by-field rewrite covering: `name`, `tagline`, `description`, `hero.headline`, `hero.subheadline`, `painPoints[]`, `pillars[]`, `benefits[]`, `differentials[]`, `faqs[]`.
- D-03: For products with quality copy, only tighten/elevate specific weak fields identified in the audit — do not do a full rewrite pass.

**Copy Sources**
- D-04: Both `docs/plans/aprimoramento/gpus-company-info.md` and `.planning/research/drasacha-content.md` are reference sources with equal weight. Neither strictly overrides the other.
- D-05: Brand voice: professional, acolhedor, inspirador, firme. Fala como "Nós". Key phrases: "Nós iluminamos", "Clareza é a nova gentileza", "Olhar de dono", "Excelência com entrega real".

**Redirect-Only Products**
- D-06: Products with `externalSiteUrl` (comunidade-us, trintae3, neon-dash, na-mesa-certa, otb) — focus copy effort on card-visible fields: `name`, `tagline`, `description`, `icon`, `image`. Deep field rewrites are Claude's discretion only if sources have clear, high-quality content.

**Team Bios (COPY-04)**
- D-07: Scope is 3 named profiles only: Dra. Sacha Gualberto, Maurício Magalhães, Raquel. The other 10 team members are out of scope.
- D-08: Bio enrichment goal: expertise, credibility signals (certifications, years of experience), and role within the Grupo US ecosystem.

**Meta Descriptions (COPY-03)**
- D-09: All 8 content pages in `src/pages/` need unique meta descriptions. Minimum ≥120 chars, targeted keyword per page, brand suffix "| Grupo US" in title.
- D-10: `termos.astro` and `politica-de-privacidade.astro` must be upgraded from placeholder to ≥120 chars.
- D-11: Pages with existing quality meta (home, sobre, contato, 404) — agent audits and only improves if clearly suboptimal.

**Accents & Typography (COPY-01)**
- D-12: Systematic accent audit across all product + team JSONs AND hardcoded text in components/pages. Fix unaccented Portuguese.
- D-13: Typographic quotes are nice-to-have — fix only if clearly wrong. No forced transformation of all straight quotes to curly quotes site-wide.

### Claude's Discretion
- Whether to use a single plan or separate plans for 2.1 (accents), 2.2 (copy rewrite), and 2.3 (SEO meta) — planner decides based on parallelization opportunities.
- Depth of redirect product field rewrites beyond card-visible fields.
- Order in which products are rewritten within Plan 2.2.

### Deferred Ideas (OUT OF SCOPE)
- Bio enrichment for the 10 non-featured team members — outside Phase 2 scope.
- Deep copy rewrites for redirect product fields beyond card-visible (painPoints, pillars, faqs) — only if clear sources exist; otherwise defer to when those products get local pages.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| COPY-01 | Acentuação corrigida em todos os arquivos JSON de produtos (mínimo 7 arquivos) e nos componentes Astro com texto hardcoded | Audit findings below document accent issues per file |
| COPY-02 | Copy de todos os 7 produtos reescrita com headlines e frases de impacto baseados em drasacha.com.br e no Manual de Inteligência | Per-product quality assessment below guides what to preserve vs rewrite |
| COPY-03 | Meta descriptions únicas em todas as 8 páginas de conteúdo em `src/pages/` | Current meta inventory below shows which pages need upgrades |
| COPY-04 | Textos da equipe (Dra. Sacha, Maurício, Raquel) revisados e enriquecidos | Current bio inventory below shows gaps; source material from gpus-company-info.md and drasacha-content.md |
</phase_requirements>

---

## Summary

Phase 2 is a pure content/copy authoring phase — no new code, components, or infrastructure. All changes land in JSON files under `src/content/products/` and `src/content/team/`, plus direct edits to the `description` prop in six `.astro` page frontmatters. The validation gates are identical to any other phase: `bun run lint` + `bunx astro check` + `bun run build`. JSON validity is enforced by Zod schemas in `src/content.config.ts` at build time.

The most critical planning insight is the two-tier product classification: `curso-auriculo` and `mentoria-black-neon` have full local `.astro` pages and rich JSON copy that has been recently improved. The five redirect products (`trintae3`, `comunidade-us`, `otb`, `neon-dash`, `na-mesa-certa`) have no local landing pages — their JSON copy only renders in the ProductsGrid cards on the home page, so only `name`, `tagline`, `description`, `icon`, and `image` are visible to site visitors. The `description` field is particularly important: for `curso-auriculo` and `mentoria-black-neon`, the Astro page uses `{d.description}` as the meta description, so it must function as both a 1–2 sentence product summary and a ≥120-character SEO description simultaneously.

The source material is rich and available: `docs/plans/aprimoramento/gpus-company-info.md` (Manual de Inteligência) provides brand voice, product summaries, people-key profiles, and key phrases. `.planning/research/drasacha-content.md` provides marketing framing from the live funnel, with detailed OTB and TRINTAE3 copy fragments. A known source conflict exists around OTB's location (Manual says Boston/Harvard; drasacha-content.md and the JSON both say Dubai 2026 + AMWC) — the decision rule is to follow the JSON for the institutional site.

**Primary recommendation:** Plan three separate, parallelizable sub-plans (2.1 accents, 2.2 product copy, 2.3 SEO meta + team bios) since they operate on different files and have no inter-dependencies except that 2.2 changes to `description` fields automatically satisfy 2.3 for the two landing pages.

---

## Current Content Audit

### Product Copy Quality Assessment

This is the core input for Plan 2.2. Read each product JSON before writing — decisions D-01/D-02/D-03 require an audit-first approach.

| Product | Local Page? | Copy Quality | Action Required |
|---------|------------|--------------|-----------------|
| `curso-auriculo` | Yes (`/curso-auriculo`) | HIGH — recently /evolve'd with strong copy and brand voice throughout | D-03: audit only; tighten individual weak fields if any found |
| `mentoria-black-neon` | Yes (`/mentoria-black-neon`) | HIGH — full landing copy, story/bio/bonus sections, strong brand alignment | D-03: audit only; description field must be ≥120 chars (currently: 87 chars) |
| `trintae3` | No (redirect → trintae3.drasacha.com.br) | MEDIUM — card fields are clean; deep fields have some placeholder-level content ("Validado pela Dra. Sacha", "mais de 5.000 profissionais" are round numbers needing care) | D-06: card fields `tagline`/`description` are adequate; tagline is strong; description is usable; deep fields at Claude's discretion |
| `comunidade-us` | No (redirect → drasacha.com.br/pagina-de-inscricao-comu-us/) | MEDIUM — lema "Se sozinho você já brilha..." from manual is not in JSON yet; description is 98 chars (short) | D-06: card fields; incorporate manual lema if natural |
| `otb` | No (redirect → otb.gpus.com.br) | HIGH — very rich copy already; description is 154 chars (passes ≥120) | D-06: card fields only; description already strong; tagline is excellent |
| `neon-dash` | No (redirect → neondash.com.br) | MEDIUM — decent copy, description is 157 chars (passes ≥120), tagline functional but lacks brand key phrases | D-06: card fields; optional tighten on tagline |
| `na-mesa-certa` | No (redirect → namesa.gpus.com.br) | HIGH — very strong copy, dates/details accurate, description is 146 chars (passes ≥120) | D-06: card fields only; description and tagline are excellent |

**Key finding:** Only `mentoria-black-neon` has a measurable gap — its `description` field (87 chars) falls below the ≥120 char requirement for `d.description`-powered meta descriptions. All other redirect-only products have description lengths that meet or exceed 120 chars. For `curso-auriculo`, the description is 207 chars — already good.

### Accent Audit Findings

After reading all 7 product JSONs and 3 in-scope team JSONs, the content is largely well-accented. Specific items to verify in Plan 2.1:

**Product JSONs — potential accent targets:**
- Search for "Saude" (→ "Saúde"), "Estetica" (→ "Estética"), "Avancada" (→ "Avançada"), "tecnica" (→ "técnica"), "pratica" (→ "prática"), "gestao" (→ "gestão"), "formacao" (→ "formação"), "educacao" (→ "educação") across all 7 files
- The current JSONs appear largely accented from visual inspection, but a systematic grep is required — a human read cannot guarantee completeness
- `comunidade-us.json` field `audience`: "Profissionais da estética" — lowercase 'e' in estética is fine; accent present
- No obvious missing accents found in the files read, but the audit pass (Plan 2.1) must confirm systematically

**Hardcoded page text — components to check:**
- `src/pages/termos.astro` — reads clean from inspection (no accent issues visible)
- `src/pages/politica-de-privacidade.astro` — reads clean
- `src/components/layout/Header.astro`, `Footer.astro` — must be checked
- `src/components/home/Hero.astro`, `StatsSection.astro`, `AboutPreview.astro`, `CTASection.astro` — must be checked
- `src/components/about/Mission.astro`, `Values.astro` — must be checked

**Team JSONs — in-scope (3 profiles):**
- `sacha.json` — reads clean
- `mauricio.json` — reads clean
- `raquel.json` — reads clean

### Meta Description Inventory

All 8 content pages in `src/pages/`:

| Page | File | Current description | Char count | Status |
|------|------|---------------------|-----------|--------|
| Home | `index.astro` | "Cursos, pós, mentoria e comunidade com a Dra. Sacha Gualberto: trilha da entrada à escala de negócio. Veja os programas do ecossistema e o próximo passo para a sua carreira." | 174 | GOOD — passes ≥120 |
| Sobre | `sobre.astro` | "História, missão e time do ecossistema de formação em saúde estética avançada e negócios: Dra. Sacha Gualberto, Prof. Maurício Magalhães e quem constrói os programas." | 169 | GOOD — passes ≥120 |
| Contato | `contato.astro` | "Fale com a Laura (SDR) no WhatsApp ou use e-mail e formulário. Indicação de programa (curso, pós, comunidade, mentoria) para profissionais de saúde estética." | 162 | GOOD — passes ≥120 |
| Curso Aurículo | `curso-auriculo.astro` | `{d.description}` from JSON = "Imersão presencial de 3 dias: Curso de Aurículo com Técnica de Perfuração Auricular para ampliar o portfólio com segurança na aplicação. Investimento, lote e parcelamento você confere no checkout (botão principal)." | 207 | GOOD — passes ≥120 |
| Mentoria Black NEON | `mentoria-black-neon.astro` | `{d.description}` from JSON = "Mentoria Black NEON (6 meses): gestão, vendas e posicionamento premium para clínicas de saúde estética. Menos dependência do fundador. Fale no WhatsApp sobre vagas e próximo ciclo." | 187 | GOOD — passes ≥120; but could be improved (mentions "Fale no WhatsApp" in SEO description) |
| Termos | `termos.astro` | "Termos de uso do site do Grupo US" | 34 | NEEDS UPGRADE (D-10) — hardcoded in `.astro` frontmatter |
| Privacidade | `politica-de-privacidade.astro` | "Política de privacidade do Grupo US" | 36 | NEEDS UPGRADE (D-10) — hardcoded in `.astro` frontmatter |
| 404 | `404.astro` | "Link incorreto ou página movida. Volte à home do Grupo US ou fale conosco para achar cursos, pós-graduação e mentorias em saúde estética." | 138 | GOOD — passes ≥120 |

**Key finding:** Only `termos.astro` and `politica-de-privacidade.astro` definitively need upgrades (D-10). Both are hardcoded directly in the `<Layout>` `description` prop — not from JSON. The `mentoria-black-neon` description passes length but the "Fale no WhatsApp" phrasing is suboptimal for SEO meta; this is a D-03 candidate.

**Integration note (CRITICAL):** `curso-auriculo.astro` and `mentoria-black-neon.astro` use `description={d.description}`. Changing the `description` field in those product JSONs automatically changes the page meta description. These are not separate changes.

### Team Bio Inventory (3 in-scope profiles)

| Person | Current bio length | Quality | Gaps |
|--------|-------------------|---------|------|
| Dra. Sacha Gualberto | 227 chars | MEDIUM — covers certifications and years; misses "Fundadora e CVO", "11+ anos empreendedora", "Coordenadora CEEN", "docente há mais de 8 anos" | Upgrade: add CVO title, 11 anos, CEEN coordination, founding story |
| Prof. Maurício Magalhães | 317 chars | MEDIUM-HIGH — covers CFO/CTO, financial strategy, infrastructure; misses "Mago das Finanças" framing and specific credentials | Upgrade: tighten; can incorporate "Mago das Finanças" if brand-aligned |
| Dra. Raquel Quintanilha | 289 chars | MEDIUM — covers pedagogical coordination; misses specific credentials, number of students/cohorts, scientific background | Upgrade: add specific credentials or recognition within TRINTAE3 program |

**Source material available:**
- `docs/plans/aprimoramento/gpus-company-info.md` § 5. Pessoas-Chave — brief profiles with key roles
- `.planning/research/drasacha-content.md` § 1. Dra. Sacha Gualberto — rich profile with specific facts: UFG graduate, Harvard/China, 11+ years, 57K+ Instagram, CEEN coordination, 8+ years teaching, co-founder Tudo Belo Estética, CVO title
- For Maurício: manual identifies him as "Mago das Finanças", CFO, teaches precificação/gestão financeira
- For Raquel: manual identifies her as Coordenação Pedagógica do TRINTAE3 — limited additional detail in sources

---

## Architecture Patterns

### How Content Changes Flow to Pages

Understanding this is critical for planning implementation tasks correctly:

```
Pattern A — JSON-powered meta (landing pages):
src/content/products/[slug].json .description
  → src/pages/[slug].astro: description={d.description}
  → Layout.astro <meta name="description">
  (one change in JSON updates both landing copy and SEO meta)

Pattern B — Hardcoded meta (static pages):
src/pages/termos.astro: description="..."  ← edit the .astro file directly
src/pages/politica-de-privacidade.astro: description="..."  ← edit the .astro file directly
src/pages/index.astro: description="..."  ← edit the .astro file directly
src/pages/sobre.astro: description="..."  ← edit the .astro file directly
src/pages/contato.astro: description="..."  ← edit the .astro file directly
src/pages/404.astro: description="..."  ← edit the .astro file directly
```

**Implication for planning:** Product copy rewrites in Plan 2.2 and SEO meta for `curso-auriculo` / `mentoria-black-neon` in Plan 2.3 are the SAME edit (the `description` field in the JSON). Planner must not create duplicate tasks for these.

### Zod Schema Constraints (content.config.ts)

The schema enforces these minimums — any JSON rewrite must comply:

| Field | Constraint |
|-------|-----------|
| `painPoints[]` | min 3 items, each must have `icon`, `title`, `description` |
| `pillars[]` | exactly 3 items |
| `benefits[]` | min 4 items (strings, not objects) |
| `differentials[]` | min 2 items |
| `faqs[]` | min 3 items |
| `testimonials[]` | min 2 items |
| `cta.type` | literal `"primary"` — do not change |
| `cta.url` | must be a valid URL — do not break CTA URLs |
| `externalSiteUrl` | optional URL — do not add or remove without intent |

Optional schema fields (safe to add if sources provide content): `deliverables[]`, `bonus[]`, `story{}`, `bio{}`.

### WhatsApp Safety Rule

`cta.whatsappMessage` values must begin with "Olá, Laura!" — this is enforced by project convention (see AGENTS.md and `src/lib/whatsapp.ts`). When rewriting product JSONs, preserve the "Olá, Laura!" prefix in all `whatsappMessage` fields. Never inline `wa.me/55…` URLs in content fields.

### CTA URL Integrity Rule

Do NOT normalize or change `cta.url` values when doing copy rewrites. These URLs are conversion funnel links independently maintained. If `cta.url` already points to a WhatsApp link (e.g., `mentoria-black-neon`), the `isWhatsAppDestination` check in LandingHero/LandingCTA will suppress the redundant secondary WhatsApp button.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Character count for meta descriptions | Custom counter logic | Manual count or editor word count | This is a content authoring task; no code needed |
| Accent correction automation | Script to replace strings | Grep audit + manual fix per file | Volume is low (7+13 JSON files); script risk of false positives |
| JSON validation | Custom validator | `bunx astro check` + `bun run build` | Zod schema in content.config.ts validates at build time |
| Copy generation from scratch | Generic AI prompts | Source material from gpus-company-info.md + drasacha-content.md | Brand-specific copy must use documented voice and key phrases |

**Key insight:** This is a writing phase. The "infrastructure" is the Content Collections schema. All quality gates already exist via the standard build pipeline.

---

## Common Pitfalls

### Pitfall 1: Overwriting High-Quality Copy
**What goes wrong:** Agent performs a full rewrite of `curso-auriculo` or `mentoria-black-neon` copy, replacing carefully crafted funnel-specific language with generic rewrites.
**Why it happens:** Without reading the current JSON first, the agent defaults to generating fresh copy.
**How to avoid:** D-01 mandates audit-first. Read the entire JSON, assess field by field, and only write to weak fields.
**Warning signs:** If a plan task says "rewrite curso-auriculo.json" without first reading it, the plan is wrong.

### Pitfall 2: Breaking `description` Dual Role
**What goes wrong:** The `description` field for `curso-auriculo` or `mentoria-black-neon` is written as a conversational product summary but is too short (<120 chars) or contains language that reads poorly as an SEO meta tag.
**Why it happens:** The field serves two purposes — copy on the JSON object AND SEO meta via `{d.description}` in the page.
**How to avoid:** Write `description` to work as both: 1–2 impactful sentences, ≥120 chars, includes target keyword ("auriculoterapia", "mentoria de negócios saúde estética"), no call-to-action language that reads oddly as a search snippet.
**Warning signs:** Description contains "Fale no WhatsApp" or "botão principal" or is under 120 chars.

### Pitfall 3: Changing CTA URLs During Copy Rewrites
**What goes wrong:** Agent "cleans up" a WhatsApp URL in `cta.url` that contains a `?text=` parameter, or changes `https://pay.kiwify.com.br/kMXdriO` to something else.
**Why it happens:** The URL looks like content to be edited.
**How to avoid:** NEVER touch `cta.url` or `externalSiteUrl` during copy rewrites. These are conversion links, not copy. Only fields in the copy sections change.
**Warning signs:** A diff that modifies `cta.url` during a "copy rewrite" task.

### Pitfall 4: Inventing Facts in Bios or Product Copy
**What goes wrong:** Agent writes "Dra. Sacha has trained over 10,000 professionals" when sources say "hundreds" or "centenas".
**Why it happens:** Scaling up numbers to sound impressive.
**How to avoid:** Only use facts present in the source documents. If sources say "centenas", use "centenas" or a documented specific number. The conflicts file (`conflitos-fontes.md`) documents known discrepancies (OTB location, TRINTAE3 duration).
**Warning signs:** Specific numbers or dates not found in `gpus-company-info.md` or `drasacha-content.md`.

### Pitfall 5: OTB Location Conflict
**What goes wrong:** Copy for OTB mentions "Harvard / Boston" but the current JSON and drasacha-content.md confirm the active turma is Dubai 2026 (AMWC, Taj Hotel).
**Why it happens:** The Manual Google Doc mentions Boston (historic turmas 1 and 2); current turma is Dubai.
**How to avoid:** For the institutional repo, follow the JSON (`otb.json` has Dubai details). Do not introduce "Harvard/Boston" framing unless explicitly instructed.
**Warning signs:** Copy mentioning "Boston" or "Harvard" in the OTB context.

### Pitfall 6: TRINTAE3 Duration Conflict
**What goes wrong:** Copy says "se torne especialista em 6 meses" but the JSON FAQ says duração is 18 meses.
**Why it happens:** Manual uses "6 meses" as a commercial promise; program is 18 months in practice.
**How to avoid:** For the institutional repo, align with what the JSON FAQ states (18 meses). Do not use "6 meses" as program duration in the institutional copy.
**Warning signs:** Copy saying "formação em 6 meses" for TRINTAE3.

### Pitfall 7: Adding Emojis to JSON Content
**What goes wrong:** JSON content fields get emojis added as part of "impactful" copy.
**Why it happens:** Emojis feel like emphasis/energy in marketing copy.
**How to avoid:** AGENTS.md negative constraint — never use emojis as icons. No emojis anywhere in content (JSON or .astro files).
**Warning signs:** Any emoji character in a modified JSON file.

### Pitfall 8: Build Failure from Zod Schema Violation
**What goes wrong:** A product JSON rewrite reduces `benefits[]` from 5 items to 3, or `faqs[]` from 7 to 2.
**Why it happens:** Concise rewrites can strip items below schema minimums.
**How to avoid:** Check schema constraints before finalizing any rewrite. The schema requires `benefits.min(4)`, `faqs.min(3)`, `painPoints.min(3)`, `pillars.length(3)`, `testimonials.min(2)`, `differentials.min(2)`.
**Warning signs:** `bunx astro check` or `bun run build` fails with Zod validation error.

---

## Code Examples

### How Landing Pages Consume Product JSON (Pattern A)

```astro
// src/pages/curso-auriculo.astro (verified from file)
const products = await getCollection("products");
const product = products.find((p) => p.data.slug === "curso-auriculo");
const d = product.data;
// ...
<Layout
  title="Curso de Aurículo presencial: inscrição, auriculoterapia e perfuração | Grupo US"
  description={d.description}  // ← description field from JSON is the SEO meta
>
```

This means: editing `src/content/products/curso-auriculo.json` `.description` is the ONLY change needed for the SEO meta of that landing page.

### Correct Pattern for termos/privacidade Meta Upgrade (Pattern B)

```astro
// src/pages/termos.astro — BEFORE
<Layout
  title="Termos de Uso — Grupo US"
  description="Termos de uso do site do Grupo US"
>

// AFTER (example meeting D-10):
<Layout
  title="Termos de Uso — Grupo US"
  description="Termos de Uso do ecossistema Grupo US — confira as condições de uso dos programas de formação em Saúde Estética Avançada com a Dra. Sacha Gualberto. Atualizado 2026."
>
```

### WhatsApp Message Format Rule

```json
// Correct — always "Olá, Laura!" prefix (verified from mentoria-black-neon.json)
"whatsappMessage": "Olá, Laura! Sou dono(a) de clínica em saúde estética e quero saber sobre a Mentoria Black NEON — vagas, investimento e próximo ciclo."

// Wrong — never inline wa.me URLs in content fields
"whatsappMessage": "https://wa.me/556294705081?text=..."
```

### Zod Schema Minimums to Verify After Any JSON Rewrite

```typescript
// From src/content.config.ts (verified)
painPoints: z.array(...).min(3),
pillars:    z.array(...).length(3),   // exactly 3, not min/max
benefits:   z.array(z.string()).min(4),
differentials: z.array(...).min(2),
faqs:       z.array(...).min(3),
testimonials:  z.array(...).min(2),
```

---

## Source Material Reference

### Brand Voice Key Phrases (from gpus-company-info.md — HIGH confidence)

For weaving into rewrites where natural:
- "Nós iluminamos"
- "Clareza é a nova gentileza"
- "Olhar de dono"
- "Excelência com entrega real"
- Brand tone: "Profissional, acolhedor, inspirador e firme. Fala como 'Nós'."
- Propósito: "Transformar profissionais da saúde em referências, unindo técnica, gestão e comunidade. O Grupo US entrega o COMO."

### Product-Specific Copy Fragments Available

| Product | Source | Usable fragment |
|---------|--------|----------------|
| TRINTAE3 | drasacha-content.md | "A única pós-graduação em Saúde Estética Avançada que também é Mentoria" — headline used directly in hero |
| TRINTAE3 | drasacha-content.md | "Torna você um Especialista de Sucesso em 6 meses" — commercial promise (use with caution re: 18-month duration conflict) |
| OTB | drasacha-content.md | "O primeiro MBA do mundo exclusivo em Liderança, Business e Estética" |
| OTB | drasacha-content.md | "3 dias de imersão" Dubai + AMWC details (18–20 Oct 2026) |
| Comunidade US | gpus-company-info.md | "Se sozinho você já brilha, juntos iluminamos" — official lema not yet in JSON |
| Sacha bio | drasacha-content.md | UFG grad, Harvard + Xiamen, 11+ years, 57K+ IG, CEEN Coordinator, 8+ years teaching, CVO title |
| Maurício bio | gpus-company-info.md | "Mago das Finanças", CFO, precificação e gestão financeira |

### Known Source Conflicts (from conflitos-fontes.md — HIGH confidence)

| Topic | Manual says | JSON/drasacha-content says | Decision for repo |
|-------|-------------|---------------------------|-------------------|
| OTB location | Boston / Harvard | Dubai 2026, AMWC | Follow JSON (Dubai) |
| TRINTAE3 duration | "6 meses" commercial promise | 18 months in FAQ | Follow JSON (18 months) |
| TRINTAE3 investment | ~R$ 16.000 / 18x ~R$ 951 | Not stated in JSON | Never publish prices; direct to WhatsApp/checkout |
| Neon Dash product ID | Not in Manual product list | Exists in JSON and routes | Treat as official; no `produto_*` ID |

---

## Environment Availability

Step 2.6: SKIPPED — Phase 2 is a pure content/copy authoring phase. All changes are JSON file edits and .astro frontmatter edits. No external tools, services, databases, runtimes, or CLI utilities beyond the existing project build pipeline are required.

The existing pipeline is available and verified by Phase 1 completion:
- `bun run lint` — Biome + oxlint
- `bunx astro check` — TypeScript + Zod schema validation
- `bun run build` — static build gate

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Astro build + Biome + oxlint (no unit test runner) |
| Config file | `biome.json`, `astro.config.mjs` |
| Quick run command | `bunx astro check` |
| Full suite command | `bun run lint && bunx astro check && bun run build` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | Notes |
|--------|----------|-----------|-------------------|-------|
| COPY-01 | All JSON files pass accent audit; no unaccented words | Manual audit + build | `bun run build` (Zod validates structure, not text content) | Accent correctness is human-verified; build validates JSON structure |
| COPY-02 | Product copy updated; schema constraints met | Build gate | `bunx astro check && bun run build` | Zod schema enforces min counts for all arrays |
| COPY-03 | 8 pages have unique meta descriptions ≥120 chars | Manual audit | `bunx astro check` | Description length is not machine-validated; human spot-check in browser dev tools |
| COPY-04 | 3 team bios enriched with credibility signals | Manual audit | `bunx astro check` | Bio content not schema-constrained beyond `z.string()` |

### Sampling Rate
- **Per task commit:** `bunx astro check` (fast, catches Zod violations)
- **Per wave merge:** `bun run lint && bunx astro check && bun run build`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
None — existing test infrastructure covers all phase requirements. No new test files needed. This phase only creates content changes validated at build time.

---

## Standard Stack

This phase requires no new dependencies. The entire phase executes within the existing project setup.

| Tool | Purpose | Version |
|------|---------|---------|
| Bun | Package manager and script runner | Existing (project-locked) |
| Biome | Linting/formatting (covers `src/**`) | Existing |
| Astro build | Schema validation via Zod + TypeScript check | Existing |
| `src/content.config.ts` | Zod schema — defines valid product/team JSON structure | Existing |

**Installation:** None required.

---

## Project Constraints (from CLAUDE.md)

All directives that apply to this phase:

1. **Package manager: Bun only.** Never use npm/yarn/pnpm. (Applies to any install commands in Wave 0, though none are expected.)
2. **NEVER hardcode content in components** — use Content Collections. All copy changes must go to JSON files, not components.
3. **NEVER use emojis as icons** — no emojis in any JSON content fields.
4. **Commit format: Conventional Commits** — `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`.
5. **Validation gates:** `bun run lint`, `bunx astro check`, `bun run build` — must pass after each plan.
6. **WhatsApp number:** `+55 62 9470-5081` — SDR Laura. Source: `src/lib/whatsapp.ts`. `whatsappMessage` fields must use "Olá, Laura!" prefix.
7. **Read AGENTS.md first** — downstream agents executing Plan tasks must read `AGENTS.md` before any action.
8. **CTA URLs are conversion links** — do not normalize or change `cta.url` or `externalSiteUrl` during copy rewrites.

---

## Open Questions

1. **Dra. Raquel bio depth**
   - What we know: Manual identifies her as Coordenação Pedagógica do TRINTAE3; drasacha-content.md has no additional detail.
   - What's unclear: Specific credentials (specializations, academic background, years in aesthetics education).
   - Recommendation: Use what sources provide. Write a bio that emphasizes her role as the rigor/practice bridge in TRINTAE3 without inventing credentials. Flag for stakeholder enrichment if deeper bio is desired.

2. **`mentoria-black-neon` description SEO optimization**
   - What we know: Current description (187 chars) contains "Fale no WhatsApp sobre vagas" — functional but CTA language in SEO meta is suboptimal.
   - What's unclear: Whether the owner wants a clean SEO description or prefers the current direct style.
   - Recommendation: D-03 applies — this is a quality improvement. Rewrite `description` to be a clean product summary without CTA language; move the urgency framing to other fields.

3. **Comunidade US `externalSiteUrl` alignment with lema**
   - What we know: The manual lema "Se sozinho você já brilha, juntos iluminamos" is not in the current JSON tagline or description.
   - What's unclear: Whether this lema should be the `tagline` (replacing the current one) or added to `hero.subheadline`.
   - Recommendation: For card-visible fields, the `tagline` is most impactful. Current tagline is functional. If sources support, elevate the lema as the new tagline.

---

## Sources

### Primary (HIGH confidence)
- `src/content/products/*.json` — all 7 product files read directly
- `src/content/team/sacha.json`, `mauricio.json`, `raquel.json` — all 3 in-scope team files read
- `src/pages/*.astro` — all 8 content pages read for meta description inventory
- `src/content.config.ts` — Zod schema constraints verified
- `docs/plans/aprimoramento/gpus-company-info.md` — Manual de Inteligência Grupo US
- `.planning/research/drasacha-content.md` — drasacha.com.br research
- `.claude/skills/grupo-us/references/conflitos-fontes.md` — source conflict decisions

### Secondary (MEDIUM confidence)
- `.planning/phases/02-content-and-copy-overhaul/02-CONTEXT.md` — user decisions
- `.planning/REQUIREMENTS.md` — COPY-01 through COPY-04 acceptance criteria
- `AGENTS.md` (via CLAUDE.md summary) — project rules

### Tertiary (LOW confidence)
None — all research was done from first-party project files.

---

## Metadata

**Confidence breakdown:**
- Content audit (product/team quality): HIGH — read every file directly
- Architecture patterns: HIGH — read source code directly
- Common pitfalls: HIGH — derived from code structure, schema, and conflict documentation
- Source material availability: HIGH — both primary sources exist and were read

**Research date:** 2026-03-26
**Valid until:** 2026-06-26 (content is stable; only invalidated by new `/evolve` sessions that update product JSONs)
