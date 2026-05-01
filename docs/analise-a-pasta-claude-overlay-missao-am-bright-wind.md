# Plan — Create `.claude/overlay/gpus-site/` overlay (mirror missao-amazonica shape, gpus-site content)

## Context

This repo (`D:\Coders\gpus-site`) is the **Grupo US institutional Astro 6 static site** — but `.claude/config.json` and `.claude/overlay/` are still pointing at **`missao-amazonica`** (a donation platform with Supabase + Pix + webhooks). The mismatch leaks irrelevant rules into every `/prime`, `/plan`, `/debug`, `/verify` invocation: agents load `database.md` rules about RLS and `confirm_donation()` plpgsql, `integrations.md` rules about Pix BR-Code idempotency, `seo-supplement.md` schema hints for Rio Negro NGO — none of which apply here.

**Goal:** Create a sibling overlay `.claude/overlay/gpus-site/` that replicates the Tier-1 + Tier-2 structure of `missao-amazonica` but encodes the **actual** gpus-site stack (static-only Astro + Tailwind v4 + React 19 islands, Bun, Railway deploy, Content Collections, GPUS Navy/Gold theme, Lucide icons, WhatsApp SDR Laura, MPA full-reload — no DB, no payments, no webhooks). Then flip `.claude/config.json` so the overlay loader picks up the new directory.

**Outcome:** every command/agent that resolves `${overlay}` will load gpus-specific cardinal rules, design tokens, anti-patterns, and verify smoke-tests. No code change needed in `.claude/commands/` or `.claude/agents/` — overlay discovery is config-driven (see `.claude/CLAUDE.md` line 5 + `_shared.md § 0`).

---

## Reference implementation (mirror this shape)

Source: `D:\Coders\gpus-site\.claude\overlay\missao-amazonica\` — read it as the canonical layout. Each new file under `gpus-site/` keeps the **same filename + section order**, only swaps content.

Source skills consumed by the new overlay:
- `D:\Coders\gpus-site\.claude\skills\gpus-theme\` — Navy/Gold tokens, Playfair + Inter typography, dark-mode-only contract. Cite from `references/css-variables.md` + `assets/theme-tokens.css`.
- `D:\Coders\gpus-site\.claude\skills\grupo-us\` — products (TRINTAE3, Mentoria Black NEON, Curso de Aurículo, Comunidade US, Na Mesa Certa, OTB, NEON Dash), student journey, A.C.T.I.V.A. tone, WhatsApp Laura SDR (+55 62 9470-5081). Cite from `references/manual-resumo.md` + `produtos-e-rotas.md`.

Source project facts already extracted (from `AGENTS.md`, `astro.config.mjs`, `src/lib/whatsapp.ts`, `src/styles/global.css`, `src/content.config.ts`):
- E.164 SDR number: `556294705081`; default message in `WHATSAPP_DEFAULT_SITE_MESSAGE`; helper `isWhatsAppDestination()` already de-duplicates green CTA.
- Redirects in `astro.config.mjs`: `/na-mesa-certa`, `/trintae3`, `/comunidade-us`, `/neon-dash` → external. Sitemap `filter()` excludes the same paths.
- `@theme` tokens defined: `--color-navy*`, `--color-gold*`, `--color-text-*`, `--color-whatsapp*`. Custom utilities: `.glass-card`, `.gold-glow`, `.skip-link`, `.bg-mesh`, `.text-shimmer`.
- A11y wired in `Layout.astro` + `global.css`: skip link, `<noscript>` reveal fallback, `prefers-reduced-motion`, IntersectionObserver `[data-reveal]`, `<main id="conteudo-principal" tabindex="-1">`.
- One justified `client:load` in `Layout.astro:156` (`WhatsAppFloatingButton`); zero `bg-[#` violations today — overlay should preserve that bar.

---

## Target directory layout

```text
.claude/overlay/gpus-site/
├── CLAUDE-overlay.md          # Tier-1 supplement (project identity, cardinal rules, routing matrix)
├── project-snapshot.md        # Architecture map, commands, content collections, design system, gates
├── layer-map.md               # Static-Astro dependency chain (Content Collections → Pages → Components)
├── routing-supplements.md     # Extra routing rows (product landings, externalSiteUrl flow, WhatsApp lib)
├── seo-supplement.md          # pt-BR locale, JSON-LD Organization (grupous.com.br), sitemap filter rule
├── verify-supplements.md      # Smoke tests: Lucide grep, no-hex grep, redirect check, Lighthouse routes, WhatsApp URL
├── anti-patterns.md           # Lucide-only, no SPA, no client:load, no hex, no FAQ height-tween, externalSiteUrl drift
├── debugger-domain-rules.md   # Pruned (drop tRPC/Drizzle/Neon/Stripe/Meta sections); keep Astro hydration + reveal + accordion patterns
├── protected-files.json       # Block edits to astro.config.mjs redirects block, lockfile, env
├── README.md                  # How to load, how to fall back, file index
└── rules/
    ├── DESIGN.md              # GPUS Navy/Gold tokens (replaces M3); typography Playfair+Inter; glassmorphism; gold glow
    ├── frontend.md            # Astro static-only, prerender=true everywhere, Content Collections mandatory, Lucide adapter, MPA full-reload
    ├── stability.md           # Universal A–L checklist + project gates (Lighthouse ≥95, LCP <2.5s, CLS=0, INP <100ms, JS <50KB)
    ├── integrations.md        # Minimal: WhatsApp lib (`src/lib/whatsapp.ts` SSOT) + Railway deploy + Google Fonts preconnect; NO Pix/Resend/Supabase
    ├── content.md             # New file (gpus-specific): Content Collections schema, externalSiteUrl ↔ redirects ↔ sitemap sync rule, home journey order
    └── a11y.md                # Skip link, noscript reveal, prefers-reduced-motion, FAQ grid 0fr/1fr, focus-visible gold ring
```

> **Files dropped vs missao-amazonica:** `rules/database.md` (no DB), `rules/backend.md` (no API routes — drop entirely; if a contact-form serverless endpoint ever appears, add it then). Keep generic `.claude/rules/backend.md` as fallback so commands don't crash when routing matrix points there.
>
> **Files added vs missao-amazonica:** `rules/content.md` (Content Collections + external redirect contract is gpus-unique enough to deserve its own file) and `rules/a11y.md` (already exists at `.claude/rules/a11y.md` — overlay version captures the project-specific patterns: skip-link target id, FAQ grid pattern, reveal noscript).

---

## File-by-file content outline

### `CLAUDE-overlay.md`
- **Project identity table:** type=Multi-product Institutional Static Site · stack=Astro 6 + Tailwind v4 + React 19 islands · runtime=Bun · deploy=Railway · locale=pt-BR · theme=GPUS Navy/Gold (dark only).
- **Behavior overrides (above generic `.claude/CLAUDE.md`):** Bun-only · MPA full-reload (no `ClientRouter`) · Lucide React SVG adapter only (no emoji, no Material Symbols) · all pages prerender (no SSR/no hybrid) · WhatsApp SDR Laura via `src/lib/whatsapp.ts` (single source of truth — never inline `wa.me` URLs).
- **Cardinal rules (project-specific, non-negotiable):**
  1. Static generation only — never introduce SSR adapter, never `prerender = false`.
  2. Content Collections are SSOT for products + team — never hardcode in `.astro` / `.tsx`.
  3. `externalSiteUrl` ↔ `astro.config.mjs::redirects` ↔ sitemap `filter` must change together. Run `bun run check:external-urls` after edits.
  4. WhatsApp destinations always built via `whatsappUrlWithText()` from `src/lib/whatsapp.ts`. CTA dedup uses `isWhatsAppDestination()`.
  5. No hardcoded hex outside `@theme` block in `src/styles/global.css`. Semantic tokens (`bg-background`, `text-foreground`, `bg-primary`, navy/gold utilities) only.
  6. Animations: `transform` + `opacity` only. FAQ panel uses CSS grid `0fr ↔ 1fr` (never Framer height tween).
- **Routing matrix overrides (project rows that override generic):**
  | Task touches | Load (overlay-first) | Implement in |
  |---|---|---|
  | Product landing / new page | `rules/frontend.md` + `rules/content.md` + `rules/DESIGN.md` | `src/pages/<slug>.astro` + `src/content/products/<slug>.json` |
  | New external product redirect | `rules/content.md` | `astro.config.mjs` (redirects + sitemap filter) + product JSON `externalSiteUrl` |
  | WhatsApp CTA copy | `rules/integrations.md` | `src/content/products/<slug>.json::cta.whatsappMessage` (always prefixed `Olá, Laura!`) |
  | Theme token / new utility | `rules/DESIGN.md` | `src/styles/global.css` `@theme` block only |
  | A11y patterns | `rules/a11y.md` | `src/layouts/Layout.astro` + `src/styles/global.css` |
- **Project guards (paste verbatim into the overlay):** "NEVER use SPA approach", "NEVER use emojis as UI icons", "Bun-only", "MPA full-reload", "Lucide React only".
- **Pointers** to `${overlay}/rules/`, `gpus-theme` skill, `grupo-us` skill, `AGENTS.md` learnings log.

### `project-snapshot.md`
- Identity table (mirror missao-amazonica `project-snapshot.md` headers).
- Architecture map → exact tree from `AGENTS.md § Architecture Map` (10 routes, 12 landing components, 5 home components, 7 product JSONs, 13 team JSONs).
- Commands table → from `AGENTS.md § Commands` (`bun install`, `bun run dev`, `bun run build`, `bun run preview`, `bunx astro check`, `bun run check:external-urls`).
- Content data model → list collection schemas (products, team) with key fields. NOT a relational DB — just static JSON.
- Design system summary → cite GPUS Navy/Gold palette + custom utilities; defer to `rules/DESIGN.md` for full token table.
- Performance gates → from `.claude/config.json::gates` (Lighthouse ≥95, LCP <2.5s, CLS=0, INP <100ms, initial JS <50KB).
- Pre-delivery checklist → copy from `AGENTS.md § Checklist Pre-Entrega` (12 items).

### `layer-map.md`
- Stack: Astro 6 · Bun · Tailwind v4 · React 19 (islands only) · Railway.
- Layer order: **Content Collections (`src/content/*.json`) → Schema (`src/content.config.ts`) → Page (`src/pages/*.astro`) → Layout (`src/layouts/Layout.astro`) → Section components (`src/components/landing/*.astro`, `src/components/home/*.astro`) → Styles (`src/styles/global.css` `@theme`) → Astro build → static `dist/`**.
- File-path scaffolding rows for each layer.
- Auth levels: **none** (public institutional site — explicitly call out so agents stop hallucinating RLS/auth checks).
- Verification commands per layer (`bunx astro check`, `bun run lint`, `bun run build`, `bun run check:external-urls`).
- Key invariants (10 rules): static only · Lucide only · MPA · grid-based accordion · `transform`/`opacity` animations · semantic tokens · Content Collections SSOT · `whatsapp.ts` SSOT · external redirect tri-sync · Bun-only.

### `routing-supplements.md`
Extra routing matrix rows tightening the generic table. Examples:
| Task | Load | Implement in |
|---|---|---|
| Add new product landing | `rules/frontend.md` + `rules/content.md` + `rules/DESIGN.md` | `src/pages/<slug>.astro` (mirror `mentoria-black-neon.astro`) + `src/content/products/<slug>.json` |
| Convert internal route to external | `rules/content.md` | `astro.config.mjs::redirects` + product JSON `externalSiteUrl` + sitemap `filter` (3-way sync) |
| Update WhatsApp message | `rules/integrations.md` | only product JSON `cta.whatsappMessage` (never inline) |
| Edit CTA copy | `rules/frontend.md` + `grupo-us` skill | product JSON only — never component file |

### `seo-supplement.md`
- Locale: pt-BR (`<html lang="pt-BR">`).
- Per-page SEO requirements (mirror `.claude/rules/seo.md`): unique `title`, `description` ≥120 chars, `ogImage` per page (default `/og-image.png`), JSON-LD Organization stays at `https://grupous.com.br`, BreadcrumbList for product landings + legal.
- Sitemap rule: redirect-only routes excluded via `filter()`. New external product → add to filter.
- robots.txt: allow all (institutional, no admin surfaces). Confirm during execution.
- AI citation guidance: ensure each landing has unique tagline + description for LLM SERP.

### `verify-supplements.md`
Smoke tests beyond generic `/verify`:
- `bun run check:external-urls` — exits 0 (redirects reachable).
- `grep -r "bg-\[#" src/` → empty.
- `grep -r "client:load" src/` → ≤ 1 hit (`Layout.astro` WhatsAppFloatingButton).
- `grep -rE "(material-symbols|font-awesome|emoji-icon)" src/` → empty.
- `grep -r "wa.me\|api.whatsapp.com" src/components src/pages` → empty (must go through `whatsapp.ts`).
- `bun run build && ls dist/sitemap-index.xml` exists.
- Lighthouse on `index`, `mentoria-black-neon`, `curso-auriculo`, `sobre` → all ≥ 95 across 4 axes.
- A11y manual: tab through header (mobile menu), FAQ accordion (Enter/Space), skip-link visible on first focus.

### `anti-patterns.md`
Bug catalog (loaded by `/debug` + `debugger` skill). Categorize:
- **Render mode:** introducing SSR adapter, `prerender = false`, `ClientRouter` (SPA) — all forbidden.
- **Hydration:** `client:load` on pure-visual islands (use `client:idle`), unjustified React for FAQ/accordion (use native `<details>` or CSS grid).
- **Content drift:** hardcoding product copy in `.astro`, forgetting tri-sync on external URL change, breaking `whatsappMessage` "Olá, Laura!" prefix.
- **Design:** `bg-[#hex]` inline, mixing Lucide + emoji, animating `width`/`height`/`top`/`left`, missing `width`/`height` on `<Image>` (CLS).
- **A11y:** removing `<noscript>` reveal fallback, dropping skip-link, animating FAQ panel height with Framer (must be CSS grid `0fr`/`1fr`).
- **Tooling:** `npm`/`yarn`/`pnpm` in scripts, `cmd /c` wrappers (use bash forward-slash POSIX).
- **Common bug sources** (5–7 entries based on `AGENTS.md § Learnings log`): NeonStory image priority drift, inline `bg-[#25D366]` instead of `--color-whatsapp`, FAQ Framer height regression, `client:load` creep, sitemap not excluding new redirect.

### `debugger-domain-rules.md`
Prune `missao-amazonica/debugger-domain-rules.md`:
- **Drop:** Backend procedure hierarchy (tRPC), RBAC contract, tenant isolation, Drizzle/Neon transaction patterns, Stripe webhook lifecycle, Meta OAuth `fallback_redirect_uri`, TanStack Query `useEffect` patterns. None apply to a static Astro site.
- **Keep + adapt:** Frontend performance (parallel async, lazy hydration boundaries), UI integrity (focus-visible, label/autocomplete, dead anchors, CLS image dimensions), design-system anti-patterns (semantic tokens, no `transition: all`, no hardcoded hex), high-signal checks (missing imports, hardcoded hex, dead links, `as any`, `console.log`).
- **Add (Astro-specific):** hydration mismatch in islands, View Transitions removed (no `astro:after-swap` listeners — MPA), reveal IntersectionObserver edge cases, FAQ accordion height-vs-grid bug class, redirect drift between `astro.config.mjs` and `externalSiteUrl`.
- **Final gates block:** `bunx astro check && bun run lint && bun run build && bun run check:external-urls`.

### `protected-files.json`
```json
{
  "$comment": "Project-specific protected files for gpus-site. Loaded by .claude/hooks/protect-files.sh.",
  "exact": [
    "astro.config.mjs",
    "package.json",
    "bun.lockb",
    "tsconfig.json",
    "biome.json",
    "lefthook.yml"
  ],
  "segments": [],
  "contains": [
    "src/lib/whatsapp.ts"
  ]
}
```
Rationale: `astro.config.mjs` redirects block + sitemap filter is a tri-sync hot zone; `whatsapp.ts` is SSR for SDR contact. Edits should pass through user confirmation. Lockfile + tsconfig + biome + lefthook are global tooling. Content collection JSONs stay editable (frequent copy work).

### `README.md`
- One-paragraph purpose (overlay for static institutional site).
- Files index table (mirror missao-amazonica).
- Source rules: overlay-first resolution per `.claude/CLAUDE.md` line 5 + `_shared.md § 0`.
- Auto-load chain: Tier-1 (`.claude/CLAUDE.md` + `AGENTS.md` + `${overlay}/CLAUDE-overlay.md`) → Tier-2 (`${overlay}/rules/*.md` overlay-first, fallback to `.claude/rules/*.md`) → Tier-3 (`docs/`, skill references).
- Fallback: set `.claude/config.json::overlay` to `null` or wrong path → commands run on generic defaults.

### `rules/DESIGN.md`
Authoritative design contract for the project. Override generic `.claude/rules/DESIGN.md`.
- North star: **"Avant-garde institutional minimalism — Navy/Gold, glassmorphism whispers, gold glow accents, Playfair authority"** (source: `AGENTS.md § DESIGN PHILOSOPHY` + `gpus-theme` skill).
- Brand anchors: primary gold `#d4af37` · navy `#1a1a2e` · single typography pair (Playfair + Inter) · 8px spacing grid · dark mode only · ghost/gold borders @ 20% opacity.
- Color system table: navy / gold / text-primary / text-muted / whatsapp / status — every cell with HSL + hex + Tailwind class + usage. Reference `gpus-theme/references/css-variables.md`.
- Anti-traps (reuse missao-amazonica's 5 + add gpus-specific): sales-loud · stock-clinical · token-drift · icon-mix · mode-bleed · **emoji-as-icon** (gpus-specific).
- Typography scale: Playfair Display 700 for hero (clamp 48–72px) · Inter 400 body 16/1.6 · tabular-nums for stats · UPPERCASE only in pills with `tracking: 0.04em`.
- Glassmorphism spec: `.glass-card` = `linear-gradient(navy-light/80, navy/60) + backdrop-blur-md + 1px gold/20 border`. Document the `.gold-glow` shadow recipe.
- Motion: `transform` + `opacity` only; FAQ via grid `0fr`/`1fr`; `prefers-reduced-motion` mandatory; transitions `150ms ease`; reveals `300ms ease-out`; focus ring `2px solid gold + 2px offset`.
- Imagery: hero with `loading="eager"` + `fetchpriority="high"` (Astro `<Image>`); below-fold `lazy` + `low`; explicit `width`/`height`; meaningful `alt` in pt-BR.
- Token usage rules: semantic tokens always; hex only inside `@theme` block in `global.css`; never copy hex from mockups to components.

### `rules/frontend.md`
- Render mode: **all routes prerender** (`export const prerender = true` is implicit Astro 6 default; never override). No SSR adapter. No `ClientRouter`.
- Component placement: `src/components/landing/` (product landing sections) · `src/components/home/` (home page sections) · `src/components/layout/` (Header/Footer) · `src/components/shared/` (Card, Button, SectionHeading) · `src/layouts/Layout.astro` (base SEO + fonts + skip-link + reveal).
- Hydration: `client:idle` for pure-visual hero islands (`AuroraBackground`, `TextGenerateEffect`); `client:visible` for below-fold; `client:load` only on persistent floating UI (`WhatsAppFloatingButton`); `client:only` forbidden.
- Styling: semantic tokens + custom navy/gold utilities. Tailwind v4 `@theme` directive in `global.css` is the only place hex literals live.
- Icons: Lucide React via `src/components/ui/Icon.astro` (or direct `lucide-react` import in `.tsx` islands). Forbid `material-symbols`, `font-awesome`, emoji.
- Forms: contact form posts to external (no API route in this project). If a future serverless contact endpoint appears, fall back to generic `.claude/rules/backend.md`.
- Performance: hoist statics, memoize hot lists (only if islands render >30 cards), explicit image dimensions, preconnect Google Fonts.
- Accessibility: one `<h1>` per page · skip-link first focusable · `<noscript>` reveal fallback · `<main id="conteudo-principal" tabindex="-1">` · ARIA on icon-only buttons · grid-based accordion · `prefers-reduced-motion` honored.
- Negative constraints (paste from `AGENTS.md § Negative Constraints`): no width/height/top/left animation · no emoji icons · no hardcoded speaker/FAQ data · no scroll-jacking · no anchor-without-cursor-pointer · no >50KB initial JS · no SPA · no `cmd /c` · no npm/yarn/pnpm.

### `rules/stability.md`
- Universal A–L checklist (mirror generic) restated for static Astro context: drop "render mode = SSR for API/admin" rows, add "static only" row.
- Performance gates table (read from `.claude/config.json::gates`): Lighthouse ≥95 (perf/a11y/bp/seo), LCP <2.5s, CLS=0, INP <100ms, initial JS <50KB.
- Verification per surface: Pages → `bunx astro check` + visual smoke + breakpoints (375/768/1024/1440); Components → type-check + visual + Lucide grep; Tokens → build + visual diff; External redirect → `bun run check:external-urls`; Content collection → schema validation via `bunx astro check`.
- Escalation triggers (when to invoke `evaluator` Mode 3 / `/debug recover`).

### `rules/integrations.md`
Lean version (no Pix, no Resend, no Sentry, no Supabase Realtime).
- WhatsApp: SSOT is `src/lib/whatsapp.ts`. `WHATSAPP_SDR_E164` = `556294705081`. Default message starts with `"Olá, Laura!"`. Always build URLs via `whatsappUrlWithText(message)`. Use `isWhatsAppDestination(url)` to dedup CTAs.
- External product sites (Na Mesa Certa, TRINTAE3, Comunidade US, NEON Dash, OTB, Mentoria checkout): respect 3-way sync (`externalSiteUrl` JSON ↔ `astro.config.mjs` redirects ↔ sitemap filter).
- Google Fonts: `<link rel="preconnect" href="https://fonts.googleapis.com">` + `https://fonts.gstatic.com` in `Layout.astro`. `display=swap`.
- Railway deploy: env management via Railway dashboard. Static output `dist/`. No serverless functions.
- Lucide React: tree-shaken via named imports — never `import * as Icons from 'lucide-react'`.

### `rules/content.md` (new file — gpus-specific)
- Content Collections layout: `src/content/products/*.json` (7 files) + `src/content/team/*.json` (13 files).
- Zod schemas live in `src/content.config.ts` — extend with caution; every new field needs corresponding optional handling in landing components.
- Product JSON authority: name, slug, tagline, description (≥120 chars for SEO), type, audience, icon (Lucide name string), image (`/images/products/...`), `externalSiteUrl?`, order, hero, painPoints, pillars, benefits, deliverables, bonus, story, bio, differentials, faqs, cta, testimonials, event.
- Home journey order (from `grupo-us` skill): Curso de Aurículo / Comunidade US → TRINTAE3 → Na Mesa Certa → Mentoria Black NEON → OTB. Out of band: NEON Dash + product redirects.
- External redirect contract — **THE THREE-WAY SYNC**:
  1. Product JSON: set `externalSiteUrl` field.
  2. `astro.config.mjs`: add `redirects: { "/<slug>": { status: 301, destination: "<externalSiteUrl>" } }`.
  3. `astro.config.mjs::sitemap.filter`: add `pathname !== "/<slug>"`.
  After any change run `bun run check:external-urls && bunx astro check && bun run build`.
- WhatsApp message convention: every product `cta.whatsappMessage` starts with `"Olá, Laura! "` per `AGENTS.md § Learnings log [2026-03-25] WhatsApp institucional`.

### `rules/a11y.md`
Mirror `.claude/rules/a11y.md` with project specifics:
- Skip link target `<main id="conteudo-principal" tabindex="-1">` — keep id stable.
- `[data-reveal]` IntersectionObserver pattern + `<noscript>` fallback in `Layout.astro`.
- FAQ accordion: native `<details>` OR CSS `grid-template-rows: 0fr ↔ 1fr`. Never Framer height tween.
- Focus ring: `:focus-visible` with `outline: 2px solid #d4af37` + `outline-offset: 2px` defined in `global.css`.
- Smoke test list before merge.

---

## Critical files to modify (post-overlay-creation)

`.claude/config.json` (lines 4–28) — **flip these in the same task**:

| Field | Current value (wrong) | New value |
|---|---|---|
| `project.name` | `"missao-amazonica"` | `"gpus-site"` |
| `project.displayName` | `"Missão Amazônica — Sal da Terra"` | `"Grupo US — Site Institucional"` |
| `project.stack` | `"astro-hybrid-supabase"` | `"astro-static-tailwindv4"` |
| `project.productionUrl` | `""` | `"https://grupous.com.br"` |
| `paths.schemaRoot` | `"supabase/migrations"` | `""` (no DB) — or remove key |
| `tooling.deployer` | `"vercel"` | `"railway"` |
| `tooling.database` | `"postgres"` | `""` |
| `tooling.orm` | `"supabase-js"` | `""` |
| `overlay` | `".claude/overlay/missao-amazonica"` | `".claude/overlay/gpus-site"` |

Keep `tooling.packageManager: "bun"`, gates block, `rulesDir`, `templatesDir`, `agentsFile`, `claudeMdFile` unchanged — they already match.

> **Do not delete `.claude/overlay/missao-amazonica/`** — preserve it as reference. It's already gitignored from the active load path once `overlay` flips.

---

## Verification

After writing all overlay files + flipping config:

1. **Schema sanity:** `cat .claude/config.json | python -m json.tool` (or `bunx --bun jq . .claude/config.json`) — must parse.
2. **Overlay discoverable:**
   - `ls .claude/overlay/gpus-site/` — lists all 11 files + `rules/` subdir.
   - `ls .claude/overlay/gpus-site/rules/` — lists 6 rule files.
3. **Loader smoke (manual):** invoke `/prime frontend` in a new session; the response should cite `${overlay}/rules/frontend.md` (gpus-site version), not the missao-amazonica DB rules.
4. **Build still green:** `bun run lint && bunx astro check && bun run build && bun run check:external-urls`.
5. **Hook smoke:** edit a non-protected file (e.g., touch a comment in `src/pages/index.astro`) — passes. Try editing `astro.config.mjs` — `protect-files.sh` blocks (exit 2) per new `protected-files.json`.
6. **Anti-pattern grep validates verify-supplements.md:**
   - `grep -rn "bg-\[#" src/` → empty.
   - `grep -rn "client:load" src/` → ≤ 1 hit.
   - `grep -rn "wa\.me\|api\.whatsapp\.com" src/components src/pages` → empty.
7. **Skill cross-load check:** `/design` invocation references `gpus-theme` + `grupo-us` skills (already auto-loaded by SKILL system) and the new `${overlay}/rules/DESIGN.md` Navy/Gold tokens.

---

## Out of scope (do NOT do in this task)

- Deleting `.claude/overlay/missao-amazonica/` — keep as donor reference.
- Editing any file under `src/`, `public/`, `astro.config.mjs`, `package.json` — overlay creation is config + `.claude/` only.
- Editing `.claude/commands/`, `.claude/agents/`, or `.claude/skills/` — overlay loading is automatic; no command code changes needed.
- Refactoring `src/lib/whatsapp.ts` or content collection JSONs — overlay documents the contract; doesn't change implementation.
- Adding new skills — `gpus-theme` and `grupo-us` already exist and are referenced.

---

## Critical files to read during execution

- `D:\Coders\gpus-site\.claude\overlay\missao-amazonica\CLAUDE-overlay.md` — full template for shape of new overlay's `CLAUDE-overlay.md`.
- `D:\Coders\gpus-site\.claude\overlay\missao-amazonica\rules\DESIGN.md` — section ordering reference (replace M3 token tables with GPUS Navy/Gold).
- `D:\Coders\gpus-site\.claude\overlay\missao-amazonica\rules\frontend.md` — section ordering reference (drop SSR/admin rules, keep static-page patterns).
- `D:\Coders\gpus-site\.claude\skills\gpus-theme\references\css-variables.md` + `assets\theme-tokens.css` — copy color values and HSL rationale into `rules/DESIGN.md`.
- `D:\Coders\gpus-site\.claude\skills\grupo-us\references\manual-resumo.md` + `produtos-e-rotas.md` — copy products list, journey order, WhatsApp Laura SDR rule into `rules/content.md` + `rules/integrations.md`.
- `D:\Coders\gpus-site\AGENTS.md` (already loaded) — extract cardinal rules, learnings log entries, checklist.
- `D:\Coders\gpus-site\.claude\rules\a11y.md`, `seo.md`, `config.md`, `content.md`, `hooks.md` (already exist as path-rule stubs) — overlay versions must align with these.
- `D:\Coders\gpus-site\.claude\commands\_shared.md § 0` — verify the overlay-first resolution recipe is honored by every section.

