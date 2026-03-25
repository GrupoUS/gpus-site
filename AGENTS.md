# Na Mesa Certa — Agent Rules & Project Specification

> **Single source of truth for ALL AI agent behavior AND project-level technical context.**

---

## Cardinal Rules (Non-Negotiable)

> [!CAUTION]
> These rules apply to **every** interaction, regardless of domain or workflow.

1. **Never Assume Correctness.** Verify against official docs, API responses, or runtime tests **before** applying changes.
2. **Always Debug After Changes.** Every modification must be followed by a verification step. Never mark a task as done without evidence that it works.
3. **NEVER use emojis as UI icons.** Use Lucide React SVGs exclusively.
4. **NEVER use SPA approach.** This site MUST be statically generated via Astro.

## Behavior

- Implement directly, don't just suggest
- Follow project code conventions strictly
- Reference applied rules when relevant
- Environment: Windows with WSL Ubuntu.
- Always run terminal commands using: wsl -e bash -c "COMMAND"
- Never use cmd /c — this is a WSL environment.
- Prefer non-interactive, self-terminating commands.
- After any shell command, do not wait for further output.
- Always run commands with timeout to avoid stuck

# SYSTEM ROLE & BEHAVIORAL PROTOCOLS

**ROLE:** Senior Frontend Architect & Avant-Garde UI Designer.
**EXPERIENCE:** 15+ years. Master of visual hierarchy, whitespace, and UX engineering.

## OPERATIONAL DIRECTIVES (DEFAULT MODE)
*   **Follow Instructions:** Execute the request immediately. Do not deviate.
*   **Stay Focused:** Concise answers only. No wandering.
*   **Output First:** Prioritize code and visual solutions.
*   **Maximum Depth:** You must engage in exhaustive, deep-level reasoning.
*   **Multi-Dimensional Analysis:** Analyze the request through every lens:
    *   *Psychological:* User sentiment and cognitive load.
    *   *Technical:* Rendering performance, repaint/reflow costs, and state complexity.
    *   *Accessibility:* WCAG AAA strictness.
    *   *Scalability:* Long-term maintenance and modularity.
*   **Prohibition:** **NEVER** use surface-level logic. If the reasoning feels easy, dig deeper until the logic is irrefutable.

## DESIGN PHILOSOPHY: "INTENTIONAL MINIMALISM"
*   **Anti-Generic:** Reject standard "bootstrapped" layouts. If it looks like a template, it is wrong.
*   **Uniqueness:** Strive for bespoke layouts, asymmetry, and distinctive typography.
*   **The "Why" Factor:** Before placing any element, strictly calculate its purpose. If it has no purpose, delete it.
*   **Minimalism:** Reduction is the ultimate sophistication.

## Core Principles

```yaml
CORE_STANDARDS:
  mantra: "Think → Research → Plan → Decompose with atomic tasks → Implement → Validate"
  mission: "Research first, think systematically, implement flawlessly with cognitive intelligence"
  research_driven: "Multi-source validation for all complex implementations"
  vibecoder_integration: "Constitutional excellence with one-shot resolution philosophy"
  KISS_Principle: "Simple systems that work over complex systems that don't. Choose the simplest solution that meets requirements. Prioritize readable code over clever optimizations. Reduce cognitive load and avoid over-engineering"
  YAGNI_Principle: "Build only what requirements specify. Resist "just in case" features. Refactor when requirements emerge. Focus on current user stories and remove unused, redundant and dead code immediately"
  Chain_of_Thought: "Break problems into sequential steps and atomic subtasks. Verbalize reasoning process. Show intermediate decisions. Validate against requirements"
  preserve_context: "Maintain complete context across all agent and thinking transitions"
  incorporate_always: "Incorporate what we already have, avoid creating new files, enhance the existing structure"
  always_audit: "Never assume the error is fixed, always audit and validate"
  COGNITIVE_ARCHITECTURE:
  meta_cognition: "Think about the thinking process, identify biases, apply constitutional analysis"
  multi_perspective_analysis:
    - "user_perspective: Understanding user intent and constraints"
    - "developer_perspective: Technical implementation and architecture considerations"
    - "business_perspective: Cost, timeline, and stakeholder impact analysis"
    - "security_perspective: Risk assessment and compliance requirements"
    - "quality_perspective: Standards enforcement and continuous improvement"
```

---

## Project Snapshot

| Field        | Value                                                              |
| ------------ | ------------------------------------------------------------------ |
| **Type**     | Premium Event Landing Page (Static Site)                           |
| **Stack**    | Astro 6 + Tailwind CSS v4 + React 19 (Islands) + Framer Motion      |
| **Runtime**  | **Bun** (package manager + runtime)                                |
| **Language** | TypeScript (strict mode)                                           |
| **Deploy**   | **Railway** (static site via GitHub integration)                   |
| **Theme**    | GPUS Theme (Navy/Gold) adapted — `gpus-theme` skill                |
| **Fonts**    | Playfair Display (headings) + Inter (body) via Google Fonts        |
| **Icons**    | Lucide React (SVG only — no emojis)                                |
| **Purpose**  | High-conversion landing page for "Na Mesa Certa" aesthetic event   |

---

## Architecture Map

```text
namesa/
├── src/
│   ├── components/         # UI components (Astro + React Islands)
│   │   ├── Hero.astro
│   │   ├── CountdownTimer.tsx    # React Island (client:load)
│   │   ├── PainPoints.astro
│   │   ├── Methodology.astro
│   │   ├── Benefits.astro
│   │   ├── ScheduleSection.astro
│   │   ├── PricingSection.astro
│   │   ├── SpeakersGrid.astro
│   │   ├── HostessSection.astro
│   │   ├── Testimonials.tsx      # React Island (client:visible)
│   │   ├── FAQAccordion.tsx      # React Island (client:visible)
│   │   ├── CTASection.astro
│   │   └── MobileCTABar.astro
│   ├── content/            # Content Collections (JSON data)
│   │   ├── speakers/       # Speaker JSON files
│   │   ├── faqs/           # FAQ JSON files
│   │   └── testimonials/   # Testimonial JSON files
│   ├── content.config.ts   # Zod schemas + glob loaders
│   ├── layouts/
│   │   └── Layout.astro    # Base layout (meta, fonts, skip link; MPA full reloads)
│   ├── pages/
│   │   ├── index.astro     # Landing principal
│   │   ├── termos.astro
│   │   └── politica-de-privacidade.astro
│   └── styles/
│       └── global.css      # Tailwind v4 @theme + custom utilities
├── public/                 # Static assets (images, favicon)
├── docs/inicial/           # Original planning documents
├── astro.config.mjs
├── tsconfig.json
└── package.json
```

---

## Tech Stack Quick Reference

| Layer          | Technology                | Version |
| -------------- | ------------------------- | ------- |
| Framework      | Astro                     | 6.x     |
| Styling        | Tailwind CSS              | v4.x    |
| Interactivity  | React (Islands only)      | 19.x    |
| Animations     | Framer Motion             | 11.x    |
| Icons          | Lucide React              | latest  |
| Build Tool     | Vite (integrated in Astro)| 6.x     |
| Deploy         | Railway                   | —       |
| Theme System   | GPUS Theme (adapted)      | —       |

---

## Commands

| Task                 | Command              |
| -------------------- | -------------------- |
| Install dependencies | `bun install`        |
| Start development    | `bun run dev`        |
| Build                | `bun run build`      |
| Preview build        | `bun run preview`    |
| Check types          | `bunx astro check`   |

---

## Package Manager (Bun-only)

> [!CAUTION]
> This project uses **`bun`** as package manager and runtime.
> ✅ `bun install`, `bun run`, `bunx`
> ❌ Do NOT use `npm`, `yarn`, or `pnpm`

---

## Design System (GPUS Theme + Liquid Glass Premium)

> **Source:** GPUS Theme (`gpus-theme` skill) adapted for Na Mesa Certa.
> Uses CSS custom properties with HSL values. Dark mode is the **default and only** mode.
> Semantic tokens via `--primary`, `--background`, `--foreground`, etc.

### Color Palette (Dark Mode — Always Active)

| CSS Variable         | HSL Value         | Hex Equivalent | Usage                |
| -------------------- | ----------------- | -------------- | -------------------- |
| `--background`       | `211 49% 10%`    | `#0d1b2a`     | Page background      |
| `--foreground`       | `39 44% 65%`     | `#c9a66b`     | Default text (gold)  |
| `--card`             | `212 48% 13%`    | ~`#112240`     | Card backgrounds     |
| `--card-foreground`  | `39 44% 65%`     | `#c9a66b`     | Card text            |
| `--primary`          | `39 44% 65%`     | `#c9a66b`     | CTAs, gold accents   |
| `--primary-foreground`| `48 10% 80%`    | ~`#d1ccc0`    | Text on primary      |
| `--muted`            | `39 29% 54%`     | ~`#b09a6d`    | Muted elements       |
| `--muted-foreground` | `48 10% 80%`     | ~`#d1ccc0`    | Muted text           |
| `--accent`           | `26 5% 27%`      | ~`#474340`    | Accent highlights    |
| `--border`           | `26 6% 21%`      | ~`#383533`    | Borders              |
| `--ring`             | `39 29% 54%`     | ~`#b09a6d`    | Focus rings          |
| `--destructive`      | `0 84% 60%`      | ~`#ef4444`    | Error states         |

#### Extended Na Mesa Certa Tokens

| Tailwind Class       | Hex       | Usage                         |
| -------------------- | --------- | ----------------------------- |
| `navy` / `navy-DEFAULT` | `#1a1a2e` | Legacy navy background     |
| `navy-light`         | `#2A2A40` | Glass card backgrounds        |
| `navy-lighter`       | `#3D3D5C` | Hover states                  |
| `gold` / `gold-DEFAULT` | `#D4AF37` | Bright gold CTAs, headlines |
| `gold-light`         | `#E8C96A` | Gold hover states             |
| `gold-dark`          | `#B8960C` | Gold active/pressed states    |
| Text primary         | `#FAFAF9` | Main readable text            |
| Text muted           | `#94A3B8` | Subtitles, metadata           |
| WhatsApp (CTA)     | via `--color-whatsapp` / `--color-whatsapp-hover` in `@theme` | Botão secundário estilo WhatsApp (`bg-whatsapp`, `hover:bg-whatsapp-hover`) — **não** usar `bg-[#25D366]` solto |

### Tipografia

| Usage        | Font             | Weights         | Tailwind Class |
| ------------ | ---------------- | --------------- | -------------- |
| Headings     | Playfair Display | 400, 600, 700   | `font-serif`   |
| Body, UI     | Inter            | 300, 400, 500, 600, 700 | `font-sans` |

### Custom Utilities (from GPUS Theme)

| Class             | Effect                                |
| ----------------- | ------------------------------------- |
| `.bg-mesh`        | Radial gradient mesh background       |
| `.glass-card`     | Glassmorphism (blur + semi-transparent) |
| `.bg-noise`       | Subtle noise texture overlay          |

### Visual Effects

- **Gold glow CTAs:** `box-shadow: 0 0 20px hsl(var(--primary) / 0.3)`
- **Glassmorphism cards:** `glass-card` utility OR `bg-navy-light/80 backdrop-blur-md border border-gold/20`
- **Animations:** `transform` and `opacity` only (never `width`, `height`, `top`, `left`)
- **`prefers-reduced-motion`:** disable all Framer Motion animations via `useReducedMotion()`

### Styling Rules

- **ALWAYS** use semantic tokens (`bg-background`, `text-foreground`, `bg-primary`) or custom navy/gold utilities
- **NEVER** hardcode hex values (no `bg-[#0f4c75]`)
- **ALWAYS** use Tailwind CSS v4 `@theme` directive for custom tokens
- GPUS theme tokens are imported via `theme-tokens.css` adapted for this project

---

## Islands Architecture (Hard Gate)

```
Static HTML (90%): Hero, PainPoints, Methodology, Benefits, Schedule, Pricing, Speakers, Hostess, CTA, footer, legal pages
React Islands (10% — ONLY these three):
  CountdownTimer.tsx  → client:load    (urgency in Hero)
  FAQAccordion.tsx    → client:visible (below fold)
  Testimonials.tsx    → client:visible (below fold)
```

> [!CAUTION]
> Do NOT add more React Islands without explicit justification. Astro's zero-JS default is the performance advantage.

---

## Content Collections

All dynamic content MUST use Astro Content Collections (`src/content/`):
- **speakers/** — JSON files with name, title, photo, specialty, bio, learn_text
- **faqs/** — JSON files with question and answer
- **testimonials/** — JSON files with name, role, quote, photo

> [!CAUTION]
> **NEVER** hardcode content data inside `.astro` or `.tsx` components. Always use `getCollection()`.

---

## Section Order (Conversion Architecture)

| # | Section           | Component               | Purpose                     |
|---|-------------------|-------------------------|-----------------------------|
| 1 | Hero              | `Hero.astro`            | Capture attention + urgency |
| 2 | Pain / público    | `PainPoints.astro`      | Create empathy + fit        |
| 3 | Methodology       | `Methodology.astro`     | Present the solution        |
| 4 | Transformation    | `Benefits.astro`        | Show expected results       |
| 5 | Cronograma        | `ScheduleSection.astro` | Agenda do evento            |
| 6 | Ingressos         | `PricingSection.astro`  | Conversão por preço       |
| 7 | Speakers          | `SpeakersGrid.astro`    | Build authority             |
| 8 | Hostess           | `HostessSection.astro`    | Anfitriã / confiança        |
| 9 | Social Proof      | `Testimonials.tsx`      | Reduce objections           |
| 10 | FAQ              | `FAQAccordion.tsx`      | Eliminate final doubts      |
| 11 | CTA Final        | `CTASection.astro`      | Convert the visitor         |
| — | Mobile sticky    | `MobileCTABar.astro`    | CTA persistente (mobile)    |

---

## Performance Requirements (Hard Gates)

- **Lighthouse:** ≥ 95 on Performance, Accessibility, Best Practices, SEO
- **LCP < 2.5s:** Preload hero image, use Astro `<Image />` with `loading="eager"` + `fetchpriority="high"`
- **CLS = 0:** ALL images must have explicit `width` and `height` via Astro Image
- **INP < 100ms:** Defer non-critical JS with `client:visible`
- **Initial JS bundle:** < 50KB (Astro zero-JS default for static sections)
- **Font loading:** `display=swap` to prevent FOIT

---

## Accessibility Requirements

- Contrast ratio: minimum **4.5:1** for all text on navy background
- `prefers-reduced-motion`: wrap ALL Framer Motion animations in `useReducedMotion()`
- Focus states: visible gold outline (`outline: 2px solid #D4AF37`) on all interactive elements
- Images: meaningful `alt` text describing the speaker and their role
- Semantic HTML: `h1` in Hero, `h2` for sections, `h3` for items
- Keyboard navigation: fully functional for FAQ and testimonial carousel
- `aria-label` on all buttons without descriptive text
- **Skip link:** classe `.skip-link` em `global.css` (só `transform`); link “Pular para o conteúdo” aponta para `main#conteudo-principal` (`tabindex="-1"`).
- **Rodapé jurídico:** usar rotas reais (`/termos`, `/politica-de-privacidade`), nunca `href="#"` para Termos/Privacidade.
- **JS desligado:** `<noscript>` força `[data-reveal]` visível para não esconder conteúdo estático.
- **FAQ acordeão:** não animar altura do painel com Framer (`height: 0/auto`); preferir **CSS grid** `grid-template-rows: 0fr` ↔ `1fr` com transição em `grid-template-rows` (chevron pode usar só `rotate`).

---

## Code Quality Standards

### TypeScript
- Strict mode enabled
- `unknown` over `any`
- Const assertions for immutable values

### Component Placement
- `components/` — All presentation components
- `content/` — Data only (JSON Content Collections)
- `layouts/` — Base layout wrapper
- `pages/` — Route pages only

### Negative Constraints
- **NEVER** animate `width`, `height`, `top`, `left` in Framer Motion or layout-breaking ways — use `transform`/`opacity` for Motion; for expand/collapse panels, **CSS grid `0fr`/`1fr`** is the approved pattern (not `m.div` height tweens).
- **NEVER** use emojis as icons — Lucide React SVG only
- **NEVER** hardcode speaker/FAQ/testimonial data in components
- **NEVER** use scroll-jacking or forced scroll effects
- **NEVER** leave clickable elements without `cursor-pointer` and hover states
- **NEVER** use generic box shadows — use subtle colored glows
- **NEVER** import heavy libraries in the main bundle (> 50KB initial JS)

---

## Learnings log (evolve)

### [2026-03-25] Sincronizar roteiro de vendas e persona com o código

> Após alinhar a landing ao copy oficial e à persona (Google Docs).

**Contexto:** O roteiro prescreve blocos (hero, dor, pilares, vídeo, benefícios, palestrantes, cronograma, ingressos, hostess, FAQ, CTA). A persona reforça tom (mesa certa, luz/brilho, “você”, frases de impacto) e uso de emoji **no social** — não na UI do site.

**Padrões:**

- **Palestrante em destaque:** `src/content/speakers/sacha.json` (`bio`, `title`, `learn_text`) alimenta `SpeakersGrid` e o JSON-LD de `index.astro` para performers revelados. Manter nome de produtos consistente (ex.: **Mentoria BLACK NEON**, não só “NEON”).
- **Preços (evento BR):** Exibir **parcela 12x em destaque** e valor à vista como linha secundária, quando o material de vendas assim definir.
- **Countdown / checklist:** Data do evento no Hero, `CountdownTimer` e checklist deste arquivo devem coincidir (atual: **18–19/09/2026**).
- **Pesquisa de copy em Docs:** Preferir export em texto (`/document/d/…/export?format=txt`) para comparar com o repo sem copiar manualmente parágrafo a parágrafo.

**Validação após mudanças de copy:** `bunx astro check && bun run build`.

### [2026-03-25] Pós-auditoria: FAQ, a11y, jurídico, Lucide, rotas

> Após rodada `/debug` e correções P1–P3.

**Problema:** Acordeão com Framer animando altura do painel; placeholders `#` em links legais; ícone Lucide deprecado; CTA WhatsApp com hex solto; conteúdo `[data-reveal]` invisível sem JS.

**Solução:** Painel FAQ com **CSS grid** `0fr`/`1fr`; rotas `/termos` e `/politica-de-privacidade`; `AtSign` no carrossel de depoimentos; tokens `--color-whatsapp*` no `@theme`; skip link + `noscript` para reveal; navegação entre páginas por **full reload** (sem `ClientRouter`, alinhado à regra anti-SPA).

**Validação:** `bunx astro check && bun run build`.

---

## Commit Format

Use Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`.

---

## Debugging Protocol

**When an error occurs:**

1. **PAUSE** — Don't immediately retry
2. **THINK** — Root Cause Analysis:
   - What exactly happened?
   - Why? (5 Whys)
   - What are 3 possible fixes?
3. **HYPOTHESIZE** — Formulate hypothesis + validation plan
4. **EXECUTE** — Apply fix after understanding cause
5. **VERIFY** — Confirm fix works, no regressions

---

## Checklist Pré-Entrega

- [ ] Lighthouse Performance ≥ 95
- [ ] Lighthouse Accessibility ≥ 95
- [ ] Lighthouse SEO ≥ 95
- [ ] CLS = 0 (sem layout shift)
- [ ] LCP < 2.5s
- [ ] Responsivo em 375px, 768px, 1024px, 1440px
- [ ] Sem emojis como ícones (apenas Lucide SVG)
- [ ] `useReducedMotion()` em todos os componentes animados
- [ ] Countdown com data correta (18–19/09/2026)
- [ ] Links de CTA funcionais (WhatsApp, ingresso)
- [ ] Dados de palestrantes/FAQ/depoimentos em Content Collections
- [ ] Sticky mobile CTA bar implementada e oculta no desktop
