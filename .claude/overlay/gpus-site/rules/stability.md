---
globs: src/**, astro.config.mjs, package.json, tsconfig.json
---

# Stability — Grupo US · Site Institucional (Tier 2 — overlay authority)

> Quality bar + smoke tests + anti-patterns + debug triage for a static Astro site. Single source of truth (absorbs former `anti-patterns.md`, `verify-supplements.md`, `debugger-domain-rules.md`).

## Purpose

Minimum always-useful stability checks for any change in this repo, plus pointers to deeper references when the issue is non-trivial.

---

## Core checklist (A–L)

- **A — Barrel exports.** When adding to a `src/lib/<domain>/index.ts`, confirm every new export is re-exported. Missing re-exports cause runtime failures inside dynamic imports.
- **B — No `!` assertions.** Never on optional `getEntry()` / `getCollection()` results, env vars, or query results. Use `??`, type guards, or early returns.
- **C — Array / result guards.** Always guard `getCollection('products')` against empty before mapping. Guard optional fields (`entry.data.faqs?`) before access.
- **D — Render mode.** Every page implicitly prerenders (Astro 6 default). **Never** add `export const prerender = false`. **Never** install an SSR adapter.
- **E — Error handlers.** Inline scripts in `Layout.astro` (IntersectionObserver, mobile toggle) wrap IO in try/catch + degrade silently.
- **F — Env config.** Build-time env vars in `.env.example`. Today: none required. Future keys must fail-fast on first read.
- **G — CORS.** N/A (no API routes). External links carry `rel="noopener noreferrer"` when `target="_blank"`.
- **H — No `console.log`** in shipped code. `console.warn` only inside no-op fallback branches.
- **I — No `as any`.** Use Zod schemas (`src/content.config.ts`) and let Astro generate types. Use `unknown` + type guards at boundaries.
- **J — Mutation errors.** Forms (`contato`) wrap submit in try/catch with user-facing fallback (toast, redirect to WhatsApp). Never silently swallow.
- **K — No dead anchors.** Never `href="#"`. `<button>` for actions, real `<a href="...">` for navigation.
- **L — Error boundaries.** `404.astro` shows generic copy + WhatsApp CTA. Static build exposes no stack traces.

---

## Static-site invariants

1. No SSR — no `output: 'server'|'hybrid'`, no SSR adapter, no `prerender = false`.
2. No SPA — no `<ClientRouter />`, no `astro:after-swap` listeners.
3. No DB / no API — no `src/pages/api/`, no cookies, no auth, no RLS.
4. Bun-only — `bun install`, `bun run`, `bunx`. No npm/yarn/pnpm.
5. MPA — `<a>` navigation triggers full reload.

---

## Performance gates

Read from `.claude/config.json::gates`:

| Layer | Threshold |
|---|---|
| Lighthouse Perf / A11y / BP / SEO | ≥ 95 on `/`, `/sobre`, `/curso-auriculo`, `/mentoria-black-neon`, `/contato` |
| LCP | < 2.5s |
| CLS | 0 |
| INP | < 100ms |
| Initial JS on prerendered pages | < 50KB |

Strategies: hero `<Image>` `loading="eager"` + `fetchpriority="high"`; below-fold `lazy` + `low`; hero islands `client:idle` (never `client:load`); preconnect Google Fonts; tree-shaken Lucide imports; no >50KB libs in main bundle.

---

## Smoke tests (`/verify` auto-loads)

### External redirect reachability

```bash
bun run check:external-urls
# expect: exit 0; every externalSiteUrl resolves with 2xx/3xx
```

Block merge on dead destination — coordinate with marketing or remove the redirect + `externalSiteUrl` together.

### No hardcoded hex outside `@theme`

```bash
grep -rn "bg-\[#" src/
grep -rn "text-\[#" src/
grep -rn "border-\[#" src/
# expect: empty
```

If hex appears in `.astro` / `.tsx` / `.css` outside `src/styles/global.css`, refactor to semantic tokens (`bg-background`, `text-foreground`, `bg-primary`) or named navy/gold utilities.

### Lucide-only icon enforcement

```bash
grep -rn "material-symbols\|<i class=\"fa\|font-awesome" src/ \
  --include="*.astro" --include="*.tsx" --include="*.ts"
# expect: empty

# Emojis as UI icons (review hits manually)
grep -rnP "(?:emoji|\xF0\x9F)" src/components src/pages \
  --include="*.astro" --include="*.tsx"
```

### Static-only render mode

```bash
grep -rn "prerender = false\|prerender: false" src/pages
grep -rn "ClientRouter\|astro:after-swap\|@astrojs/node\|output: 'server'\|output: 'hybrid'" src/ astro.config.mjs
bun run build && ls dist/index.html
# expect: empty greps; dist/index.html exists
```

### Hydration discipline

```bash
grep -rn "client:load" src/
# expect: exactly 1 hit (Layout.astro WhatsAppFloatingButton)

grep -rn "client:idle" src/components/landing src/components/home
# expect: hero islands only
```

### WhatsApp URL leak

```bash
grep -rn "wa\.me/\|api\.whatsapp\.com" src/components src/pages \
  --include="*.astro" --include="*.tsx"
# expect: empty (every WhatsApp URL must go through src/lib/whatsapp.ts)
```

### "Olá, Laura!" prefix on every product CTA message

```bash
grep -L "\"whatsappMessage\":\s*\"Olá, Laura" src/content/products/*.json
# expect: empty (every product file matches; exclude external-only products if no whatsappMessage field)
```

### Sitemap excludes redirect routes

```bash
bun run build
grep -E "<loc>https?://[^<]+(/comunidade-us|/neon-dash|/na-mesa-certa|/otb)" dist/sitemap-*.xml
# expect: empty (filter() excluded these)
```

### Initial JS budget

```bash
bun run build
ls -lh dist/_astro/*.js | awk '{print $5, $9}' | sort -rh | head -5
# expect: top initial-bundle files < 50KB on prerendered pages
```

### Lighthouse routes

Run against `/`, `/sobre`, `/curso-auriculo`, `/mentoria-black-neon`, `/contato`. Each ≥ 95 on Performance / Accessibility / Best Practices / SEO. LCP < 2.5s. CLS = 0. INP < 100ms.

### Accessibility manual smoke (browser)

- Tab from page top → first focus is gold "Pular para o conteúdo principal" skip link.
- Skip link Enter → focus jumps to `<main id="conteudo-principal">`.
- Focus rings visible (gold, 2px) on every interactive element.
- FAQ accordion expands/collapses with Enter/Space; keyboard navigates between questions.
- Mobile menu (hamburger) opens with Enter; close with Escape.
- Disable JS in DevTools → page still renders all `[data-reveal]` content.
- DevTools → Rendering → Emulate `prefers-reduced-motion: reduce` → all CSS reveal animations off.

---

## Anti-patterns by domain

### Render mode (cardinal rule #4)

- Never introduce SSR (`output: 'server'|'hybrid'`, any adapter `@astrojs/node`/`vercel`/`cloudflare`). Site deploys as static HTML to Railway.
- Never set `export const prerender = false` on any page.
- Never introduce SPA router (`<ClientRouter />`, `transition:name`, `astro:after-swap`).

### Hydration

- No `client:load` on pure-visual islands. Use `client:idle` for `AuroraBackground`, `TextGenerateEffect`, hero animations. Only justified `client:load` is `WhatsAppFloatingButton` in `Layout.astro`.
- No React when Astro suffices. FAQ, testimonials, mobile CTA bar, navigation — all `.astro`.
- No `client:only="react"` unless component literally uses `window`/`document` at module-top scope.

### Content drift (cardinal rule #5)

- No hardcoded landing copy. Always `getCollection()` / `getEntry()` from `src/content/`.
- No partial copy split (JSON + literal strings in component) — move literals into schema.
- External redirect drift: changing destination without syncing all three of (a) `externalSiteUrl`, (b) `astro.config.mjs::redirects`, (c) sitemap `filter()` produces broken links + duplicate indexing. Sync trio in one commit.

### WhatsApp / SDR Laura (cardinal rule #6)

- No inline `wa.me/...` URLs. Always `src/lib/whatsapp.ts` (`whatsappUrlWithText(message)`).
- No alternate WhatsApp number. `WHATSAPP_SDR_E164 = "556294705081"` is SSOT.
- Always prefix product CTA messages with `"Olá, Laura!"` in `cta.whatsappMessage`.
- Don't bypass dedup. `LandingHero` / `LandingCTA` auto-suppress secondary green button via `isWhatsAppDestination(url)` — don't add manual second button.

### Design (cardinal rule #7)

- No hardcoded hex outside `src/styles/global.css` `@theme`. Forbidden: `bg-[#1a1a2e]`, `text-[#d4af37]`, `style="color: #fafaf9"`, `bg-[#25D366]`. Use semantic tokens or named utilities.
- No mixing icon libraries. Lucide React only. Forbidden: Material Symbols, Font Awesome, Heroicons, emoji as icons.
- No layout-property animation. Forbidden in Framer Motion AND in CSS: `width`, `height`, `top`, `left`, `padding`, `margin`. Allowed: `transform`, `opacity`. FAQ uses CSS grid `grid-template-rows: 0fr ↔ 1fr`.
- No `transition: all` — name properties explicitly.
- CLS hazard: missing `width` / `height` on `<Image>` / `<img>`. Always set both.
- No pure black/white text on navy. Use `text-text-primary` (`#fafaf9`) / `text-text-muted` (`#94a3b8`).

### Accessibility

- Don't remove the skip link (`.skip-link` → `<main id="conteudo-principal" tabindex="-1">`).
- Don't drop `<noscript>` reveal fallback. JS-off users must see all `[data-reveal]` content.
- Don't animate FAQ panel height with Framer. Always CSS grid `0fr ↔ 1fr` (chevron may use `rotate`).
- Don't use `href="#"` for actions. `<button>` for actions; real `<a href="...">` for navigation.
- Don't ignore `prefers-reduced-motion`. All CSS reveal + island animations short-circuit when matched.
- Icon-only buttons require `aria-label`. WhatsApp buttons explicitly include `"Laura"`.

### Tooling

- Never use `npm` / `yarn` / `pnpm`. Bun only.
- Never wrap commands in `cmd /c` or `wsl -e bash -c`. POSIX shell, forward slashes.
- Never skip pre-commit hooks (`--no-verify`).

### Common bug sources (from AGENTS.md learnings log)

- `bg-[#25D366]` inline instead of `bg-whatsapp` (CTA secondary).
- FAQ Framer height regression after refactor — keep CSS grid pattern.
- `client:load` creep on new islands — audit and downgrade to `client:idle`/`client:visible`.
- Sitemap not excluding new redirect → duplicate indexing.
- `NeonStory` image priority drift — below-fold must stay `lazy`+`low`.
- `astro.config.mjs::site` mismatch between sitemap, `Organization` JSON-LD, canonical.
- Lucide icon name typo in product JSON `icon` field — verify against `lucide-react` exports.
- WhatsApp URL leaked into copy/testimonial text — should reference `whatsappMessage` field.
- `bun.lockb` accidental hand-edit or regen during feature branch.

---

## Debug triage

### Bug class: `[data-reveal]` IntersectionObserver

**Symptom:** Sections blank when JS off, or fade-in fires inconsistently on slow devices.
**Root cause:** `<noscript>` fallback removed from `Layout.astro`, OR observer init throws before adding `.revealed`.
**Fix:** Restore `<noscript>` block forcing `[data-reveal]` `opacity: 1` + `transform: none`. Wrap observer init in try/catch. Re-test JS-off.

### Bug class: FAQ height-vs-grid regression

**Symptom:** FAQ panel stutters on expand/collapse, page jump after refactor.
**Root cause:** Reverted to `m.div` Framer animating `height: 0/auto`, or inline JS animating `style.height`.
**Fix:** CSS grid pattern OR native `<details>`:

```astro
<!-- CSS grid -->
<div class="grid grid-rows-[0fr] data-[open=true]:grid-rows-[1fr] transition-[grid-template-rows] duration-300">
  <div class="overflow-hidden">{/* answer */}</div>
</div>
<ChevronDown class="transition-transform data-[open=true]:rotate-180" />
```

### Bug class: External redirect drift

**Symptom:** Bookmarked `/comunidade-us` 404s after URL change, OR Search Console flags duplicate index.
**Root cause:** Tri-sync broken between `externalSiteUrl` (JSON), `astro.config.mjs::redirects`, sitemap `filter()`.
**Fix:**
1. Update `src/content/products/<slug>.json::externalSiteUrl` AND `cta.url`.
2. Update `astro.config.mjs::redirects['<slug>']::destination`.
3. Confirm `sitemap.filter()` excludes `<slug>` (add if missing).
4. `bun run check:external-urls && bunx astro check && bun run build`.
5. `grep -E "/<slug>" dist/sitemap-*.xml` — must be empty.

### Bug class: WhatsApp URL drift

**Symptom:** Landing CTA opens WhatsApp with wrong number / wrong message.
**Root cause:** Inline `wa.me/<oldnumber>` bypassed `src/lib/whatsapp.ts`, OR `cta.whatsappMessage` doesn't start with `"Olá, Laura!"`.
**Fix:**
1. `grep -rn "wa\.me/\|api\.whatsapp\.com" src/components src/pages` — must be empty.
2. All WhatsApp URL building goes through `whatsappUrlWithText(message)`.
3. Every product `cta.whatsappMessage` starts with `"Olá, Laura"`.
4. Re-test failing CTA — clicked URL is `https://wa.me/556294705081?text=...`.

### Bug class: Hydration / island LCP regression

**Symptom:** Pure-visual island steals LCP from text-first hero.
**Root cause:** Island hydrates `client:load` instead of `client:idle`.
**Fix:**
1. Change directive to `client:idle`.
2. Confirm SSR renders text/layout fallback (parent provides skeleton if island returns nothing on SSR).
3. Re-run Lighthouse; LCP should improve.

### Quick triage matrix

| Symptom | First check |
|---|---|
| Section blank with JS off | `<noscript>` reveal fallback in `Layout.astro` |
| FAQ stutters on expand | CSS grid `0fr/1fr` (or native `<details>`) — not Framer height tween |
| LCP regression on landing | Hero `<Image>` priority + island hydration directive (`client:idle` not `client:load`) |
| CLS spike | Missing `width`/`height` on `<img>` / `<Image>` |
| 404 on bookmarked product link | `astro.config.mjs::redirects` entry missing |
| Duplicate Google index for product | Sitemap `filter()` missing the redirect path |
| WhatsApp opens wrong number | Inline `wa.me` URL bypassed `src/lib/whatsapp.ts` |
| Skip link not visible on Tab | `.skip-link` removed or `:focus-visible` broken |
| Build fails on content shape | Zod schema in `src/content.config.ts` mismatched a JSON file |
| Initial JS > 50KB | Heavy lib imported in main bundle (look for namespace imports) |
| `bun run check:external-urls` fails | Coordinate with marketing — destination dead or moved |

---

## Verification after changes

| Surface changed | Verification |
|---|---|
| `src/pages/**.astro` | `bunx astro check`; visual smoke; mobile breakpoints (375/768/1024/1440) |
| `src/components/**.astro` | `bunx astro check`; visual smoke; Lucide grep |
| `src/components/**.tsx` (island) | `bunx astro check`; check hydration directive (`client:idle`/`client:visible`); bundle audit |
| `src/content/**/*.json` | `bunx astro check` (Zod re-validates); visual smoke on affected landing |
| `src/content.config.ts` | `bunx astro check`; verify all existing JSON files satisfy new shape |
| `src/styles/global.css` | `bun run build`; visual diff vs prior; no hex outside `@theme` |
| `src/layouts/Layout.astro` | `bunx astro check`; full site visual smoke; skip link + reveal smoke |
| `src/lib/whatsapp.ts` | `bunx astro check`; grep `wa.me\|api.whatsapp.com` in components — must be empty |
| `astro.config.mjs` (redirects + sitemap) | `bun run build && bun run check:external-urls`; grep redirect paths in `dist/sitemap-*.xml` (must be empty) |
| `package.json` (deps) | `bun install`; `bun run build`; verify `bun.lockb` updated |

---

## Final gates

```bash
bun run lint
bunx astro check
bun run build
bun run check:external-urls
```

---

## Escalation triggers

Load deeper context **before** changing code when:

- Root cause unclear after initial inspection.
- Bug spans multiple layers (page + section + Content Collection schema + redirect).
- Change affects external redirect tri-sync.
- Change affects WhatsApp SSOT (`src/lib/whatsapp.ts`).
- Change affects design tokens (`src/styles/global.css` `@theme`) — visual regression risk.
- Change affects `Layout.astro` (touches every page).
- Two consecutive fix attempts on the same hypothesis failed → invoke `evaluator` Mode 3 / `/debug recover`.

---

## When to load more

| Need | Load |
|---|---|
| Page / component patterns / Content Collections / WhatsApp SSOT / a11y | `${overlay}/rules/frontend.md` |
| Tokens, typography, glass, gold glow, motion | `${overlay}/rules/DESIGN.md` |
| Brand voice / product IDs / journey | `grupo-us` skill |
| Theme tokens canon (HSL) | `gpus-theme` skill |
| SEO + JSON-LD + sitemap | `${overlay}/seo-supplement.md` |
| Cardinal rules + routing matrix + layer chain | `${overlay}/CLAUDE-overlay.md` |
| Chronological project decisions | root `AGENTS.md § Learnings log` |
