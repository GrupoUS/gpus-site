---
globs: src/pages/**, src/components/**, src/layouts/**, src/styles/**, src/content/**, src/content.config.ts, src/lib/whatsapp.ts, astro.config.mjs
---

# Frontend — Grupo US · Site Institucional (Tier 2 — project authority)

> Single source of truth for pages, components, hydration, content data, external surfaces (WhatsApp + redirects + fonts), accessibility, and performance.
> Visual canon: `.claude/rules/DESIGN.md` + `gpus-theme` skill.

---

## Render mode

| Path | Mode |
|---|---|
| `src/pages/index.astro` | static (implicit) |
| `src/pages/sobre.astro` | static |
| `src/pages/contato.astro` | static |
| `src/pages/curso-auriculo.astro` | static |
| `src/pages/mentoria-black-neon.astro` | static |
| `src/pages/otb.astro` | static (or replaced by redirect — verify against `astro.config.mjs`) |
| `src/pages/{termos,politica-de-privacidade,404}.astro` | static |
| Redirects (`/comunidade-us`, `/neon-dash`, `/na-mesa-certa`, `/trintae3`, `/otb` when external) | static HTML stub via `astro.config.mjs::redirects` |

Static is mandatory (cardinal #4). Never `export const prerender = false`. Never install SSR adapter. Never SPA.

---

## Component placement

- `src/components/layout/` — `Header.astro`, `Footer.astro`. Never product-specific.
- `src/components/home/` — home sections (`Hero`, `ProductsGrid`, `StatsSection`, `AboutPreview`, `CTASection`).
- `src/components/about/` — `Sobre` sections (`Mission`, `Values`, `TeamGrid`).
- `src/components/landing/` — reusable product landing sections (`LandingHero`, `PainPoints`, `Pillars`, `Benefits`, `Deliverables`, `Differentials`, `NeonStory`, `NeonBio`, `NeonBonus`, `FAQ`, `LandingCTA`, `MobileCTABar`).
- `src/components/shared/` — primitives (`SectionHeading`, `Card`, `Button`).
- `src/components/WhatsAppFloatingButton.tsx` — only React island using `client:load` (persistent floating UI).
- `src/layouts/Layout.astro` — base layout: SEO meta + JSON-LD + Google Fonts preconnect + skip link + `[data-reveal]` script + `<noscript>` fallback + `<main id="conteudo-principal" tabindex="-1">`.
- `src/pages/` — route pages only.

Default to `.astro`. Promote to `.tsx` (React 19 island) only when interactivity is genuinely required.

| Component type | File |
|---|---|
| Hydration-free static markup | `.astro` |
| FAQ accordion (CSS grid) | `.astro` |
| Mobile menu toggle | `.astro` + tiny inline `<script>` |
| Hero pure-visual animation | `.tsx` with `client:idle` |
| Floating persistent CTA | `.tsx` with `client:load` (only justified case) |

---

## Hydration directives

| Directive | When |
|---|---|
| `client:visible` | Default for islands below the fold |
| `client:idle` | Pure-visual hero animations (`AuroraBackground`, `TextGenerateEffect`) — text/layout already SSR'd |
| `client:load` | **Only `WhatsAppFloatingButton`** in `Layout.astro` — written justification required for any other use |
| `client:only="react"` | Forbidden — every island in this site can SSR |

Text-first hero (Mentoria Black NEON, Curso de Aurículo): visual island uses `client:idle` so SSR text paints first.

---

## Styling

- All tokens come from `src/styles/global.css` `@theme { ... }`. Use semantic Tailwind classes: `bg-background`, `text-foreground`, `bg-primary`, `text-primary-foreground`, `border-border`.
- Custom navy / gold utilities: `bg-navy`, `bg-navy-light`, `bg-navy-lighter`, `text-gold`, `text-gold-light`, `text-gold-dark`, `bg-gold`, `text-text-primary`, `text-text-muted`, `bg-whatsapp`, `hover:bg-whatsapp-hover`.
- **No hardcoded hex outside `@theme`** (cardinal #7). Forbidden: `bg-[#1a1a2e]`, `text-[#d4af37]`, `style="color: #fafaf9"`. Refactor to semantic tokens or named utilities.
- Custom utilities live after `@theme` in `global.css`: `.bg-mesh`, `.glass-card`, `.glass-card-bright`, `.gold-glow`, `.skip-link`, `.landing-mesh-bg`, `.text-shimmer`, `.text-gradient-gold`, `.card-hover-lift`.
- Spacing uses Tailwind defaults aligned to 8px grid (`p-4`, `gap-8`, `mb-16`, `py-24`).

---

## Icons

```astro
---
import { Heart, ArrowRight } from 'lucide-react';
---
<ArrowRight class="size-5 text-gold" aria-hidden="true" />
```

- **Lucide React only** (cardinal #3). No emoji. No Material Symbols. No Font Awesome.
- Sizes via Tailwind `size-N` (16/20/24 standard).
- Decorative icons inside labeled buttons: `aria-hidden="true"` + parent button `aria-label`.
- Icon-only buttons: `aria-label` mandatory.
- Tree-shake: import named exports only. **Never** `import * as Icons from 'lucide-react'`.
- Product `icon` field is a string referenced at runtime — typo → fallback. Validate against `lucide-react` exports when authoring product JSON.

---

## Content Collections

The product + team collections are SSOT for landing/team copy. Components consume via `getEntry('products', slug)` / `getCollection('products')` — they never hardcode copy.

### Layout

| Path | Files | Notes |
|---|---|---|
| `src/content/products/<slug>.json` | 7 today | One per Grupo US product. Slug = filename stem = URL slug. |
| `src/content/team/<slug>.json` | 13 today | One per team member. Renders in `/sobre` `TeamGrid`. |
| `src/content.config.ts` | 1 file | Zod schemas + glob loaders. |

When adding/renaming/deleting a JSON file, run `bunx astro check` — Astro re-validates the collection at type-check time.

### Product schema (Zod-enforced)

| Field | Type | Notes |
|---|---|---|
| `name` | string | Display name (e.g., "TRINTAE3"). |
| `slug` | string | Must match filename. URL path = `/<slug>`. |
| `tagline` | string | ≤ 90 chars. Shown in `LandingHero` subheading + grid card. |
| `description` | string | **≥ 120 chars** target. Feeds `<meta name="description">`. Critical for SEO + AI citation. |
| `type`, `audience`, `order` | string / enum / number | Persona alignment + grid order on home (lower = earlier). |
| `icon` | string (Lucide name) | Validated at runtime against Lucide React exports. |
| `image` | string (`/images/products/<file>`) | Used as `ogImage` for the landing. Must exist under `public/`. |
| `externalSiteUrl?` | string | When present, navigation goes external (target=_blank). Triggers redirect tri-sync. |
| `hero`, `painPoints`, `pillars`, `benefits`, `differentials`, `testimonials`, `faqs`, `cta` | structured | Drive landing sections in fixed order. |
| `cta.label`, `cta.url`, `cta.type` | required | `cta.url` is conversion destination (drasacha funnel, Kiwify, or `wa.me`). |
| `cta.whatsappMessage` | string | **Always prefixed `"Olá, Laura!"`** (per WhatsApp SSOT). |
| `cta.helperText?` | string | Optional micro-copy near CTA (e.g., "Inscrição via Kiwify · 12x sem juros"). |

Optional structured: `deliverables?`, `bonus?`, `story?`, `bio?`, `event?` — slot in landing when populated.

### Team schema

`name`, `role`, `bio`, `photo`, `order` required · `social.{instagram?, linkedin?, twitter?}` optional · `order` controls TeamGrid sequence · photos under `public/images/team/`.

### Conversion section order (fixed per AGENTS.md)

1. `LandingHero.astro` — Hero (capture + value prop)
2. `PainPoints.astro` — Pain / público
3. `Pillars.astro` — Solução
4. `Benefits.astro` — Transformação
5. `Differentials.astro` — Por que este produto
6. `Testimonials.astro` — Prova social (pure Astro)
7. `FAQ.astro` — Eliminar dúvidas (CSS grid `0fr/1fr`)
8. `LandingCTA.astro` — Conversão final
9. `MobileCTABar.astro` — Sticky mobile CTA

`NeonStory`, `NeonBio`, `NeonBonus`, `Deliverables` slot in when product JSON provides matching fields.

### Home journey order

Per `grupo-us` skill (`references/manual-resumo.md § Jornada do aluno`), recommended student journey:

1. **Curso de Aurículo** or **Comunidade US** (entry / ticket menor)
2. **TRINTAE3** (formação sólida)
3. **Na Mesa Certa** (networking)
4. **Mentoria Black NEON** (escala)
5. **OTB** (topo / MBA)

Reflect in `order` field of each product JSON. Out-of-band products (NEON Dash, external-only redirects) get higher `order` numbers — not part of five-step funnel. When marketing repositions, update JSON `order` only — never reorder via component logic.

### Conventions

- No literals in components — always `data.<field>`.
- No optional-field rendering hacks — let Astro skip the section when field is genuinely undefined.
- pt-BR everywhere (copy, alt, FAQ Q/A, testimonials). Single exception: brand names (TRINTAE3, OTB, NEON Dash).
- Brand voice per `grupo-us` skill: "Nós iluminamos", "Olhar de dono", "Clareza é a nova gentileza", "Excelência com entrega real". Avoid generic ed-tech tropes.
- Pricing & dates NEVER fabricated — confirm with marketing or use `cta.helperText` to defer to checkout.

### Quick edit paths

| Task | File |
|---|---|
| Change product CTA copy | `src/content/products/<slug>.json::cta.label` |
| Change WhatsApp message | `cta.whatsappMessage` (start with `"Olá, Laura!"`) |
| Reorder home grid | `cta.order` |
| Update FAQ | `faqs[]` |
| Update hero headline | `hero.headline` |
| Convert product to external | `externalSiteUrl` + redirect tri-sync (below) |
| Add team member | new `src/content/team/<slug>.json` + photo `public/images/team/<file>` |

---

## External surfaces

The static site touches zero server-side integrations. External points:

1. **WhatsApp SDR Laura** (single sales channel)
2. **External product sites** (`drasacha.com.br`, `namesacerta.com.br`, `ota-dubai.lovable.app`, `neondash.com.br`, `trintae3.drasacha.com.br`, Kiwify) — accessed via redirects, never embedded
3. **Google Fonts** (Playfair Display + Inter)
4. **Railway** (static deploy target)

### Universal rules

- No external API calls at runtime — every page is prerendered HTML.
- Every external destination is HTTPS. Mixed-content forbidden.
- Treat external URLs as untrusted UI text — author copy via JSON `cta.whatsappMessage` field, never raw URLs.
- Secrets via Railway dashboard env. No `.env` committed. Today: zero build-time secrets.
- No hardcoded provider versions / base URLs in components.

### WhatsApp SDR Laura (SSOT)

`src/lib/whatsapp.ts` is the **single source of truth**. All other files import from here.

| Export | Value | Purpose |
|---|---|---|
| `WHATSAPP_SDR_E164` | `"556294705081"` | Brazilian E.164 (no `+`), used by `wa.me/<E164>` |
| `WHATSAPP_DEFAULT_SITE_MESSAGE` | `"Olá, Laura! Gostaria de falar sobre os programas do Grupo US e qual faz sentido para o meu momento."` | Institutional default for floating button + generic CTAs |
| `whatsappUrlWithText(message)` | `(message: string) => string` | Builds `https://wa.me/556294705081?text=<encoded>` |
| `isWhatsAppDestination(url)` | `(url: string) => boolean` | Returns `true` for `wa.me/`, `api.whatsapp.com`, `wa.link/` — used to dedup CTAs |

Conventions:
- Every product `cta.whatsappMessage` must start with `"Olá, Laura!"` (per AGENTS.md learnings log).
- Generic CTAs use `WHATSAPP_DEFAULT_SITE_MESSAGE`.
- When `cta.url` is already WhatsApp, `LandingHero` / `LandingCTA` auto-suppress secondary green button via `isWhatsAppDestination(url)`. **Don't bypass this dedup** with manual second buttons.
- `aria-label` on every WhatsApp button explicitly names "Laura" (e.g., `"Falar com Laura no WhatsApp"`).
- The floating button (`WhatsAppFloatingButton.tsx`, `Layout.astro`) is the **only** `client:load` island — persistent across-route floating UI requires immediate hydration.

```astro
<!-- Forbidden: inline URL -->
<a href="https://wa.me/5511920474028">Falar conosco</a>

<!-- Required: import from SSOT -->
---
import { whatsappUrlWithText, WHATSAPP_DEFAULT_SITE_MESSAGE } from '@/lib/whatsapp';
const url = whatsappUrlWithText(WHATSAPP_DEFAULT_SITE_MESSAGE);
---
<a href={url} aria-label="Falar com Laura no WhatsApp">Conversar com a Laura</a>
```

### External redirect tri-sync

Three places must move together when an external destination changes (or when a product becomes external):

**1. Product JSON** (`src/content/products/<slug>.json`):

```json
{
  "slug": "comunidade-us",
  "externalSiteUrl": "https://drasacha.com.br/pagina-de-inscricao-comu-us/",
  "cta": {
    "url": "https://drasacha.com.br/pagina-de-inscricao-comu-us/",
    "label": "Quero entrar para a Comunidade US",
    "type": "primary"
  }
}
```

When `externalSiteUrl` is set, `ProductsGrid` and `Header` link externally with `target="_blank" rel="noopener noreferrer"` and `sr-only` "(abre em nova guia)" affordance.

**2. `astro.config.mjs::redirects`**:

```js
redirects: {
  '/comunidade-us': { status: 301, destination: 'https://drasacha.com.br/pagina-de-inscricao-comu-us/' },
}
```

Handles deep links (bookmarks, old marketing). Astro emits static HTML stub with `meta refresh` + `noindex` + `canonical` to destination.

**3. `astro.config.mjs::sitemap.filter`**:

```js
sitemap({
  filter: (page) => !['/comunidade-us', '/neon-dash', '/na-mesa-certa', '/otb', '/trintae3'].some((p) => page.endsWith(p)),
})
```

Excludes redirect-only paths from `dist/sitemap-*.xml`. Without this, search engines split-index `/<slug>` AND `<externalSiteUrl>`.

**Verification after sync**:

```bash
bun run check:external-urls   # destination reachable
bunx astro check              # types still valid
bun run build                 # static output regenerated
grep -E "/(comunidade-us|neon-dash|na-mesa-certa|otb|trintae3)" dist/sitemap-*.xml  # expect empty
```

External funnels (drasacha, Kiwify, lovable.app) are owned by other teams. If destination 404s in `bun run check:external-urls`, coordinate with marketing — don't silently change the URL.

### Google Fonts

`src/layouts/Layout.astro` includes:

```astro
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600;700&display=swap" />
```

- `display=swap` mandatory — prevents FOIT.
- Preconnect both `fonts.googleapis.com` AND `fonts.gstatic.com` (`.woff2` lives there).
- Adding a font weight: only after confirmed UI need — each weight inflates CSS payload.

### Railway deploy

- Trigger: git push to `main` → Railway auto-builds via GitHub.
- Build: `bun run build` (in `package.json`).
- Output: static `dist/`.
- No serverless functions. No `@astrojs/vercel`/`node`/`cloudflare`. No edge runtime.
- Env vars (Railway dashboard): none required at build today. Future build-time keys → document in `.env.example` and reference in `astro.config.mjs`.

---

## Forms

- Contact form (`src/pages/contato.astro`) does not post to an API — submit either degrades to WhatsApp CTA or posts to external endpoint.
- If a future endpoint is added, validate with Zod on the client; fall back to generic `.claude/rules/backend.md` for server contract.
- Every input has `<label for="...">` (or wraps the input). Required fields visually marked AND `aria-required="true"`.
- Error messages use color + icon + text (never color alone). Loading state via local `isPending` (or pure CSS).

---

## Performance

- Hoist static arrays, objects, regex, formatters (`Intl`, `Date.format`) to module scope.
- Don't create expensive objects in `.astro` frontmatter (re-runs per route).
- Memoize hot list items in islands (`React.memo`) only when rendering > 30 cards.
- `Set` / `Map` over repeated `.find()` / `.includes()` on hot paths.
- No heavy libs (>50KB) in main bundle. Per-island imports only.
- No nested scroll containers unless layout requires.

---

## Images

- Hero / above-fold: Astro `<Image>` (`astro:assets`) `loading="eager"` + `fetchpriority="high"`.
- Below-fold: `loading="lazy"` + `fetchpriority="low"`.
- Always explicit `width` + `height` (CLS = 0).
- Decorative: `alt=""` + `aria-hidden="true"`.
- Meaningful: descriptive `alt` in pt-BR (who + role + context).
- `NeonStory` image is below-fold on Mentoria Black NEON landing — keep `loading="lazy"` + `fetchpriority="low"` (per AGENTS.md learnings log [2026-03-26]).

---

## Accessibility

### Skip link

- Class `.skip-link` (defined in `src/styles/global.css`).
- Hidden by `transform: translateY(-200%)` until `:focus-visible`; slides in (transform-only, GPU-friendly).
- Target: `<main id="conteudo-principal" tabindex="-1">` (id is contractual — keep exact).
- Position: first focusable element on every page (rendered by `Layout.astro` ahead of `<Header />`).
- Copy: `"Pular para o conteúdo principal"` (pt-BR).

If you reorder elements in `Layout.astro`, skip link must remain first focusable.

### `prefers-reduced-motion`

- `@media (prefers-reduced-motion: reduce)` block in `src/styles/global.css` disables CSS reveal animations + `[data-reveal]` transitions.
- React/Framer islands wrap animations in `useReducedMotion()` (Framer hook). Don't bypass.
- Hero islands using `client:idle`: if they include CSS animation, wrap in same media query inside the island stylesheet.

### `[data-reveal]` IntersectionObserver

- Sections that fade-in on scroll set `data-reveal`; inline script in `Layout.astro` adds `.revealed` (CSS opacity 0→1 + translateY 8px→0).
- **`<noscript>` fallback in `Layout.astro` forces all `[data-reveal]` content visible** when JS off. Never drop without like-for-like replacement.
- Don't animate via height/width — uses `transform` + `opacity` only.

### FAQ accordion

- Native `<details>` / `<summary>` OR CSS grid `grid-template-rows: 0fr ↔ 1fr` (chevron uses `rotate`).
- **Forbidden:** Framer `m.div` height tween or any `height` animation.
- Keyboard: Enter / Space toggles. Tab navigates between questions. Focus visible.
- Screen reader: `<details>` announced as "expanded/collapsed disclosure".

### Focus ring

```css
*:focus-visible {
  outline: 2px solid #d4af37;  /* gold */
  outline-offset: 2px;
}
```

Always visible — never `outline: none` without replacement. 2px gold + 2px offset stays consistent across all interactive elements.

### Headings

- One `<h1>` per page (typically inside `LandingHero` or home `Hero`).
- `<h2>` for section titles. `<h3>` for items.
- No skipped levels.
- `home/StatsSection.astro` exposes screen-reader-only `<h2>` even when visually using KPI numbers — keep that pattern.

### ARIA labels on icon-only buttons

Required on:
- Hamburger menu toggle (`Header.astro`)
- Mobile CTA bar buttons (`MobileCTABar.astro`)
- Social media links (`Footer.astro`)
- Close buttons (FAQ chevron is decorative; explicit close icons need labels)
- WhatsApp floating button — explicitly include `"Laura"` in label

```astro
<button aria-label="Abrir menu de navegação"><Menu /></button>
<a href={whatsappUrl} aria-label="Falar com Laura no WhatsApp"><MessageCircle /></a>
```

### Color contrast

- WCAG AA minimum: ≥ 4.5:1 body, ≥ 3:1 large text.
- `text-text-primary` (`#fafaf9`) on navy → ~17:1 (AAA).
- `text-text-muted` (`#94a3b8`) on navy → ~6.5:1 (AA).
- `text-gold` (`#d4af37`) on `#1a1a2e` → ~6.8:1 (AA) — fine for headings/links.
- Validate any new pair against WebAIM before commit.

### Anchors and buttons

- `<a href="real-url">` for navigation.
- `<button type="button">` for actions (toggles, modals).
- **`href="#"` is forbidden** — even for placeholders.

### Smoke test before merge

- Tab from page top → first focus is gold skip link.
- Activate skip link → focus jumps to `<main id="conteudo-principal">`.
- Tab through header — focus rings visible.
- FAQ: Enter expands; Tab between questions.
- Mobile menu (≤ 768px): hamburger Enter opens; Escape closes.
- Disable JS → page renders all `[data-reveal]` content.
- DevTools `prefers-reduced-motion: reduce` → all reveal animations off.
- Lighthouse Accessibility ≥ 95.
- No `href="#"` in shipped HTML.

---

## Negative constraints

- No `npm`/`yarn`/`pnpm`. Bun only.
- No `cmd /c` / `wsl -e bash -c` wrappers in shipped scripts.
- No `href="#"`.
- No emoji as UI icons. No Material Symbols. Lucide React only.
- No hardcoded hex outside `src/styles/global.css` `@theme`.
- No `client:load` outside `WhatsAppFloatingButton`.
- No animation of layout properties (`width`, `height`, `top`, `left`, `padding`, `margin`).
- No `transition: all`.
- No SPA. No `ClientRouter`. No `astro:after-swap` listeners.
- No SSR adapter. No `output: 'server'|'hybrid'`. No `prerender = false`.
- No global CSS overrides bypassing tokens.
- No hardcoded landing copy in components.
- No inline `wa.me/...` URLs.
- No initial JS bundle > 50KB on prerendered pages.

---

## When to load more

| Need | Load |
|---|---|
| Universal stability checklist + smoke tests + anti-patterns + debug triage | `.claude/rules/stability.md` |
| Tokens, typography, glass, gold glow, motion | `.claude/rules/DESIGN.md` |
| SEO + JSON-LD + sitemap | `.claude/rules/seo.md` |
| Cardinal rules + routing matrix + layer chain | `.claude/CLAUDE.md` + root `AGENTS.md` |
| Brand voice / product IDs / journey | `grupo-us` skill |
| Theme tokens canon (HSL) | `gpus-theme` skill |
