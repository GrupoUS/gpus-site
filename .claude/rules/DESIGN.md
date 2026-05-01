# DESIGN — Grupo US · Site Institucional (Tier 2 — project authority)

> Tokens canon: `src/styles/global.css` `@theme` block + `gpus-theme` skill (`references/css-variables.md`, `assets/theme-tokens.css`).
> Identidade visual: GPUS Theme — Navy/Gold em dark mode único (per `AGENTS.md`).

---

## 1. Theme & anti-traps

**North Star:** "Avant-garde institutional minimalism — Navy autoridade, Gold sinal, Playfair gravidade, Inter clareza, glassmorphism whisper, gold-glow accent." Sem sales-loud, sem stock-clinical, sem template-genérico.

**Marca anchors:**
- Navy `#1a1a2e` — page bg, autoridade
- Gold `#d4af37` — actions, headlines, KPI hero (signal-only)
- Playfair Display + Inter (single pair)
- Dark mode único (sem light variant)
- 8px grid
- WCAG AA mínimo
- Glass borders gold/20 @ 0.3

**Anti-traps:**

| Trap | Trigger | Fix |
|---|---|---|
| Sales-loud | "COMPRE AGORA!", reds piscando, CTAs múltiplos | Calm authority, single primary CTA + WhatsApp dedup |
| Stock-clinical | brancos genéricos + tech-stock photography | Navy/Gold + foto real Dra. Sacha |
| Token-drift | `bg-[#d4af37]` inline | `bg-gold` ou `bg-primary` |
| Icon-mix | Material Symbols / emoji / Font Awesome | Lucide React only |
| Mode-bleed | importar light variant do `theme-tokens.css` portátil | Dark único — não ativar light |
| Emoji-as-icon | decorative emoji no UI | Lucide React SVG (cardinal #3) |
| Layout-property animation | Framer `m.div` height/width tween | CSS grid `0fr/1fr` ou `transform`/`opacity` |
| Bento-marketing | grid genérico de 6 boxes | Narrativa editorial, asymmetry, glass cards com gold glow |

**Template test:**
- "Generic ed-tech template?" → **FAIL — restart**
- "Stripe minimalism + Playfair authority + glassmorphism gold whisper?" → **SUCCESS**
- "AI-generated slop?" → **FAIL — restart**

---

## 2. Color system (dark mode only)

> **Site é dark único.** `gpus-theme` skill expõe tokens light + dark portáteis para outros consumidores; aqui, apenas `.dark` está ativo. Não importar / ativar light theme.
> Tailwind v4 `@theme` em `src/styles/global.css` define todos os tokens diretamente como dark values.
> **Proibido:** `dark:bg-...` modifiers, `light:` variants, importar `theme-tokens.css` portátil sem ajustar.

### 2.1 Semantic tokens (HSL — espelham `gpus-theme` dark column)

| Token | HSL | Hex | Uso |
|---|---|---|---|
| `--background` | `211 49% 10%` | `#0d1b2a` | page bg |
| `--foreground` | `39 44% 65%` | `#c9a66b` | default text (gold-toned) |
| `--card` | `212 48% 13%` | ~`#112240` | card bg |
| `--card-foreground` | `39 44% 65%` | `#c9a66b` | card text |
| `--popover` | `211 49% 10%` | `#0d1b2a` | popover/dropdown bg |
| `--popover-foreground` | `39 44% 65%` | `#c9a66b` | popover text |
| `--primary` | `39 44% 65%` | `#c9a66b` | CTAs, gold accents |
| `--primary-foreground` | `48 10% 80%` | ~`#d1ccc0` | text on primary |
| `--secondary` | `211 49% 10%` | `#0d1b2a` | secondary surface |
| `--secondary-foreground` | `39 44% 65%` | `#c9a66b` | text on secondary |
| `--muted` | `39 29% 54%` | ~`#b09a6d` | muted bg |
| `--muted-foreground` | `48 10% 80%` | ~`#d1ccc0` | muted text |
| `--accent` | `26 5% 27%` | ~`#474340` | accent highlight |
| `--accent-foreground` | `39 44% 65%` | `#c9a66b` | text on accent |
| `--border` | `26 6% 21%` | ~`#383533` | borders |
| `--input` | `26 6% 21%` | ~`#383533` | input borders |
| `--ring` | `39 29% 54%` | ~`#b09a6d` | focus ring (semantic) |
| `--destructive` | `0 84% 60%` | ~`#ef4444` | error states |
| `--destructive-foreground` | `30 11% 11%` | ~`#1f1d1a` | text on destructive |
| `--radius` | — | `0.625rem` | base radius (10px) |

### 2.2 Extended brand tokens (Navy / Gold scale)

| Tailwind | Hex | Uso |
|---|---|---|
| `bg-navy` / `text-navy` | `#1a1a2e` | hero/landing bg accent |
| `bg-navy-light` | `#2a2a40` | glass card bg, alt section |
| `bg-navy-lighter` | `#3d3d5c` | hover state on glass card |
| `text-gold` / `bg-gold` | `#d4af37` | bright gold for CTAs, headlines |
| `text-gold-light` / `bg-gold-light` | `#e8c96a` | gold hover state |
| `text-gold-dark` / `bg-gold-dark` | `#b8960c` | gold active/pressed |
| `text-text-primary` | `#fafaf9` | main readable body text on navy |
| `text-text-muted` | `#94a3b8` | subtitles, metadata, captions |
| `bg-whatsapp` / `hover:bg-whatsapp-hover` | `#25d366` / `#20bd5a` | secondary WhatsApp CTA — never `bg-[#25D366]` solto |

### 2.3 Contrast validation

| Foreground | Background | Ratio | WCAG | Uso |
|---|---|---|---|---|
| `#fafaf9` text-primary | `#1a1a2e` navy | ~17:1 | AAA | body text on dark hero |
| `#fafaf9` text-primary | `#0d1b2a` background | ~17.5:1 | AAA | body on page bg |
| `#94a3b8` text-muted | `#1a1a2e` navy | ~6.5:1 | AA | subtitles, metadata |
| `#94a3b8` text-muted | `#0d1b2a` background | ~6.7:1 | AA | captions on page bg |
| `#d4af37` gold | `#1a1a2e` navy | ~6.8:1 | AA | headlines, links, KPI |
| `#d4af37` gold | `#0d1b2a` background | ~7:1 | AA | gold accents on page bg |
| `#c9a66b` foreground (semantic) | `#0d1b2a` background | ~5.5:1 | AA | default text token |
| `#1a1a2e` navy | `#d4af37` gold | ~6.8:1 | AA | text on gold CTA fill |
| `#fafaf9` | `#25d366` whatsapp | ~3.4:1 | AA-large | large/icon only — not body text |

Validate any new pair against WebAIM before commit.

### 2.4 Token usage rules

1. Body text minimum 4.5:1.
2. Large text (18pt+ / 14pt+ bold) minimum 3:1.
3. Non-text UI (icons, borders) minimum 3:1 quando informativo standalone.
4. **Sempre semantic tokens** (`bg-background`, `text-foreground`) ou named utilities (`bg-navy-light`, `text-gold`).
5. **Nunca hex inline** em componentes — apenas em `src/styles/global.css` `@theme`.
6. Nunca importar light tokens — site é dark único.
7. Color is never the sole status indicator (sempre color + icon + text).
8. Mockups podem usar hex — **nunca copiar hex literal para código**.

---

## 3. Typography

- **Headings:** Playfair Display (`font-serif`) — peso 700 default, 400/600 disponíveis.
- **Body / UI:** Inter (`font-sans`) — pesos 300/400/500/600/700.
- **Sentence case** em headlines pt-BR. UPPERCASE apenas em badges/status pills com `tracking-[0.04em]`.
- **`tabular-nums`** em currency, KPI counters, datas.

| Role | Family | Size | Weight | Line | Letter | Casing |
|---|---|---|---|---|---|---|
| Hero h1 | Playfair Display | clamp(48–72px) | 700 | 1.1 | -0.02em | Sentence |
| Section h2 | Playfair Display | clamp(32–48px) | 700 | 1.2 | -0.01em | Sentence |
| Card h3 | Playfair Display ou Inter | 24px | 600 | 1.3 | 0 | Sentence |
| Body Large | Inter | 18px | 400 | 1.6 | 0 | Sentence |
| Body Base | Inter | 16px | 400 | 1.6 | 0 | Sentence |
| Label | Inter | 14px | 500 | 1.2 | 0.02em | Sentence |
| Caption | Inter | 12px | 400 | 1.4 | 0 | Sentence |
| Badge | Inter | 11–12px | 500 | 1.2 | 0.04em | UPPERCASE |
| KPI | Playfair Display | 36–60px | 700 | 1 | -0.02em | — |

**Regras:**
- Font size < 12px proibido.
- Headline-to-body ratio ≥ 2x.
- Body text NEVER `#000` ou `#fff`. Use `text-text-primary` (`#fafaf9`).
- Single typographic exception: brand names (TRINTAE3, OTB, NEON Dash) podem aparecer UPPERCASE inline.

---

## 4. Components

### 4.1 Buttons

**Primary (gold)** — `bg-primary` (`#c9a66b`) ou `bg-gold` (`#d4af37`) brighter; text `text-primary-foreground` ou `text-navy`; hover `bg-primary/90` ou `bg-gold-light`; active `bg-gold-dark`; shadow `.gold-glow`; padding `px-6 py-3` (small) / `px-8 py-4` (CTA hero); `rounded-md`; Inter 14px 500.

**Secondary (outlined)** — `border-border` + `text-foreground`, transparent bg, `hover:bg-accent`.

**Ghost** — text `text-foreground`, transparent, `hover:bg-accent`.

**WhatsApp (green secondary)** — `bg-whatsapp hover:bg-whatsapp-hover text-white`. **De-duped** automaticamente quando `cta.url` já é WhatsApp via `isWhatsAppDestination()`.

**Icon Button** — 40×40 desktop / 44×44 mobile · `rounded-full` · `aria-label` mandatory.

### 4.2 Cards

**Standard** — `bg-card text-card-foreground border-border/30 rounded-lg` (or `rounded-xl` for landing) · `p-6` mobile / `p-8` desktop.

**Glass** — utility `.glass-card` = navy-light/80 + backdrop-blur-md + 1px gold/20 border. `.glass-card-bright` para CTA sections.

**Hover lift** — utility `.card-hover-lift` aplica `transform: translateY(-6px) scale(1.01)` em hover.

### 4.3 Inputs

`bg-input text-foreground border-border focus-visible:ring-2 ring-ring`. Padding `px-4 py-3` · `rounded-md` · placeholder `text-muted-foreground` @ 0.6 · disabled `opacity-50 cursor-not-allowed`.

### 4.4 Badges / pills

`rounded-full` · Inter 11–12px 500 · `tracking-[0.04em]` UPPERCASE · `px-3 py-1`.

| Variant | bg / text |
|---|---|
| Gold (premium) | `bg-gold/20 text-gold` |
| Success | `bg-emerald-500/20 text-emerald-400` |
| Urgent | `bg-destructive/20 text-destructive` |
| Neutral | `bg-accent text-accent-foreground` |

### 4.5 Navigation

**Header** — `bg-navy` (or transparent on hero) · 1px `border-border/30` bottom · wordmark Playfair 700 `text-gold` · inactive `text-text-muted` · active `text-foreground` + 2px gold underline · CTA "Conversar com a Laura" small primary button.

**Footer** — `bg-navy` darker · `text-text-muted` body · links `text-foreground` · social icons Lucide 20px.

### 4.6 FAQ accordion

Native `<details>` / `<summary>` OR CSS grid `grid-template-rows: 0fr ↔ 1fr` (chevron `rotate`). **Forbidden:** Framer `m.div` height tween. Summary: Inter 16px 500. Body: Inter 16px 400 `text-text-muted`.

### 4.7 Mobile CTA bar

`MobileCTABar.astro` sticky bottom em landing pages (≤ 768px). `bg-navy/95 backdrop-blur` border-top gold/20 · primary CTA full-width · WhatsApp secondary aside (de-duped).

---

## 5. Layout

- Container: `max-w-7xl mx-auto px-6 lg:px-8`.
- Spacing: Tailwind defaults (8px grid).
- Section vertical: `py-24` desktop / `py-16` mobile.
- Card padding: `p-6` mobile / `p-8` desktop.
- Asymmetry: prefer 7/5 ou 8/4 splits em hero; nunca 50/50.

| Pattern | Tailwind | Uso |
|---|---|---|
| Products grid (home) | `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8` | `ProductsGrid` |
| Stats KPI | `grid-cols-1 md:grid-cols-3 gap-6` | `StatsSection` |
| Pillars | `grid-cols-1 md:grid-cols-3 gap-6` | landing |
| Hero asymmetric | `grid-cols-1 lg:grid-cols-12` (texto `col-span-7`, media `col-span-5`) | landing hero |
| Team grid | `grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8` | `/sobre` |

---

## 6. Border radius

| Token | CSS | Uso |
|---|---|---|
| `rounded-sm` | 0.375rem | badges, micro-pills |
| `rounded-md` | 0.5rem | inputs, default buttons |
| `rounded-lg` | 0.625rem | cards (semantic default) |
| `rounded-xl` | 0.75rem | landing card hero |
| `rounded-2xl` | 1rem | modals, large containers |
| `rounded-full` | 9999px | pills, avatars, icon buttons |

---

## 7. Depth & elevation

Site é dark único — **glass + gold-glow + tonal layering** carregam profundidade; shadows sutis em modais/CTAs.

| Level | Surface | Effect |
|---|---|---|
| 0 — Base | `bg-background` (`#0d1b2a`) ou `bg-navy` (`#1a1a2e`) | none |
| 1 — Section alt | `bg-navy-light` ou `bg-card` | none (tonal) |
| 2 — Card | `bg-card` + `border-border/30` | optional `.gold-glow` em premium |
| 3 — Glass | `.glass-card` (navy-light/80 + blur + gold/20 border) | none |
| 4 — Hover lift | transform `translateY(-6px) scale(1.01)` | optional `0 20px 40px rgba(0,0,0,0.40)` |
| 5 — CTA halo | `.gold-glow` | `0 0 20px hsl(var(--primary) / 0.3)` |
| 6 — Modal | `bg-card` 2xl | `0 12px 24px rgba(0,0,0,0.5)` + overlay `bg-black/70` |

**Borders:** ghost `border-border/30` standard · `border-gold/20` em glass · focus ring `outline 2px solid #d4af37 + offset 2px`.

---

## 8. Iconography

- **Lucide React only.** Named imports: `import { ArrowRight, Heart, MessageCircle } from 'lucide-react'`.
- Sizes: `size-4` / `size-5` / `size-6` / `size-8` / `size-12`.
- Cor: hereda `currentColor` ou explicit `text-gold` / `text-text-muted`.
- `aria-label` em icon-only buttons; `aria-hidden="true"` em decorative.
- **Forbidden:** emoji as icons, Material Symbols font, Font Awesome, custom inline SVG (exceto logos).
- Tree-shake: nunca `import * as`.

---

## 9. Motion & interaction

- **`prefers-reduced-motion`** em TODA animação CSS (já em `global.css`).
- Allowed: `transform`, `opacity`.
- **Forbidden:** `width`, `height`, `top`, `left`, `padding`, `margin`. Sem `transition: all`.
- Accordion: CSS grid `grid-template-rows: 0fr ↔ 1fr` (não `height: auto`).
- Reveal: `[data-reveal]` IntersectionObserver → `opacity 0 → 1` + `translateY(8px → 0)`. `<noscript>` fallback força visível.
- Hover: `transform: scale(0.98)` em `:active`; `.card-hover-lift` em cards.
- Transitions: `150ms ease` standard; `300ms ease-out` reveals.
- Focus ring: `outline 2px solid #d4af37 + outline-offset 2px` (`:focus-visible`).

---

## 10. Imagery

- Hero / above-fold: Astro `<Image>` `loading="eager"` + `fetchpriority="high"`.
- Below-fold: `loading="lazy"` + `fetchpriority="low"`.
- Aspect: hero 16:9 ou 21:9 · landing card 4:3 · avatar / team 1:1 · `NeonStory` 4:5.
- Always explicit `width` + `height` (CLS = 0).
- Decorative: `alt=""` + `aria-hidden="true"`.
- Meaningful: descriptive `alt` em pt-BR.
- Tone: real Dra. Sacha + ecossistema — **never** stock-clinical.

---

## 11. Custom utilities (`src/styles/global.css`)

| Class | Effect |
|---|---|
| `.bg-mesh` | Radial gradient mesh (subtle gold/primary tint) |
| `.glass-card` | linear-gradient(navy-light/80, navy/60) + backdrop-blur-md + 1px gold/20 border |
| `.glass-card-bright` | brighter glass variant for CTA sections |
| `.gold-glow` | `box-shadow: 0 0 20px hsl(var(--primary) / 0.3)` — premium CTAs, KPI |
| `.skip-link` | first-focusable skip link, `transform: translateY(-200%)` hidden, `:focus-visible` reveals |
| `.landing-mesh-bg` | animated radial mesh for hero |
| `.text-shimmer` | animated gold gradient text (use sparingly) |
| `.text-gradient-gold` | static gold gradient text |
| `.card-hover-lift` | `transform: translateY(-6px) scale(1.01)` on hover |

Add new utilities **only** in `src/styles/global.css` after `@theme` block. Never inline custom CSS in components.

---

## 12. Do's and Don'ts

| Do | Don't |
|---|---|
| Semantic tokens + named utilities (`bg-navy`, `text-gold`) | Hardcoded hex outside `@theme` |
| Sentence case headlines pt-BR | UPPERCASE outside badges |
| `tabular-nums` em currency / KPI / counters | Pure black `#000` ou white `#fff` em body |
| Playfair headings + Inter body | Material Symbols / Font Awesome / emoji |
| `prefers-reduced-motion` guard sempre | `href="#"` (use `<button>` ou real `<a>`) |
| Lucide named imports | `import * as Icons from 'lucide-react'` |
| 8px grid / Tailwind spacing | Inline custom CSS |
| Soft shadows + `.gold-glow` + glass | Aggressive `box-shadow: 0 0 50px gold` glows |
| Validar contraste antes de commit | Cross-mode bleed (light tokens em dark site) |
| Test `prefers-reduced-motion` + JS-off | Animar `width`/`height`/`top`/`left`/`padding`/`margin` |
| `<button>` actions / `<a>` nav | `client:load` em pure-visual islands |
| Focus rings sempre visíveis | SPA / `ClientRouter` / `astro:after-swap` |
| Content Collections SSOT | Hardcoded landing copy |
| `src/lib/whatsapp.ts` SSOT | Inline `wa.me/...` URLs |

---

## 13. Responsive

| Breakpoint | Width | Tailwind | Comportamento |
|---|---|---|---|
| Mobile | < 640 | (default) | single column, hamburger nav, sticky `MobileCTABar` |
| Tablet | 640–1024 | `sm:` `md:` | 2-col grids, condensed nav |
| Desktop | ≥ 1024 | `lg:` `xl:` | full layout, 3-col products grid, asymmetric hero 7/5 |
| Wide | ≥ 1280 | `xl:` `2xl:` | edge-to-edge max-w-7xl, generous gutters |

Touch targets ≥ 44×44px mobile · button height 40px mobile / 36px desktop · card padding ≥ `p-6`. Hero typography `clamp(48–72px)`.

---

## 14. Accessibility (sumário)

Detalhe completo em `.claude/rules/frontend.md § Accessibility`. Quick:

- WCAG AA contrast em todo par.
- One `<h1>` per page · semantic `<section>/<article>/<nav>/<main id="conteudo-principal" tabindex="-1">`.
- Focus rings 2px gold + 2px offset em `:focus-visible`.
- Skip link `.skip-link` first focusable.
- All icon-only buttons: `aria-label` (WhatsApp inclui "Laura").
- FAQ: CSS grid `0fr/1fr` (never height tween).
- `<noscript>` força `[data-reveal]` visível.
- `prefers-reduced-motion` desliga reveal + island animations.
