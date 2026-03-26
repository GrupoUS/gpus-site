# Coding Conventions

**Analysis Date:** 2026-03-25 — **sync:** 2026-03-26

## Naming Patterns

**Files:**
- Astro components: PascalCase with `.astro` extension — `LandingHero.astro`, `SectionHeading.astro`, `MobileCTABar.astro`
- React Island components: PascalCase with `.tsx` extension — `aurora-background.tsx`, `spotlight.tsx` (kebab-case exceptions for Aceternity UI components in `src/components/ui/`)
- Pages: kebab-case with `.astro` extension — `curso-auriculo.astro`, `mentoria-black-neon.astro`
- Lib utilities: camelCase with `.ts` extension — `utils.ts`, `productsNav.ts`, `whatsapp.ts`
- Content collections config: `content.config.ts` (dot-separated, not camelCase)
- Style entry: `global.css`

**Components:**
- PascalCase names throughout — `LandingHero`, `PainPoints`, `SectionHeading`, `Button`
- Named exports for React TSX: `export const AuroraBackground = ...`
- No default exports in `.tsx` files — all React Islands use named exports

**Variables and Functions:**
- camelCase for variables and function names — `navLabelFromName`, `productNavLinksFromCollection`, `whatsappUrl`
- Short local aliases for collection data: `const d = product.data` (used in all landing pages)
- TypeScript `type` over `interface` for exported types (see `src/lib/productsNav.ts` — `export type ProductNavLink`)
- `interface Props` (not `type Props`) for Astro component prop declarations

**Types:**
- Astro component props declared with `interface Props` directly in the frontmatter fence
- Exported types use `export type` syntax
- Strict TypeScript — `unknown` over `any`, const assertions for immutable record objects

## Component Patterns

**Astro Component Structure:**
```astro
---
// 1. Imports
import { whatsappUrlWithText } from "../../lib/whatsapp";
import Button from "../shared/Button.astro";

// 2. Props interface
interface Props {
  name: string;
  tagline: string;
  hero: { headline: string; subheadline: string; };
  type: string;
  cta: { label: string; url: string; whatsappMessage: string; };
}

// 3. Destructure from Astro.props (with defaults where applicable)
const { name, hero, type, cta } = Astro.props;

// 4. Local computations
const whatsappUrl = whatsappUrlWithText(cta.whatsappMessage);
---

<!-- 5. Template -->
<section class="...">
  <slot />
</section>
```

**Astro Prop Defaults:**
- Provide defaults inline during destructuring: `const { variant = "primary", size = "md" } = Astro.props`
- Use `Record<string, string>` for variant/size lookup maps:
  ```ts
  const variantClasses: Record<string, string> = {
    primary: "bg-gold text-navy ...",
    whatsapp: "bg-whatsapp text-white ...",
  };
  ```

**Conditional Class Lists:**
- Use `class:list={[...]}` for conditional Astro classes:
  ```astro
  <h2 class:list={["font-serif text-3xl", titleColor]}>
  ```
- Use `cn()` from `src/lib/utils.ts` for conditional React classes:
  ```tsx
  className={cn("base-classes", conditionalClass && "extra-class")}
  ```
- Manual array join for computed class strings in Astro frontmatter:
  ```ts
  const classes = [baseClasses, sizeClasses[size], variantClasses[variant], className]
    .filter(Boolean)
    .join(" ");
  ```

**Dynamic Tags:**
- Use a `const Tag = href ? "a" : "button"` pattern when an element can be either anchor or button (`src/components/shared/Button.astro`)

**React Islands:**
- Located exclusively in `src/components/ui/`
- All are Aceternity UI visual effects — `AuroraBackground`, `Spotlight`, `BackgroundBeams`, `Lamp`, `TextGenerateEffect`, `MovingBorder`, `WavyBackground`
- Import `cn` from `@/lib/utils`
- Use `"use client"` directive at top of each `.tsx` file
- Always consume `useReducedMotion()` from Framer Motion to respect accessibility preference
- Used in pages with `client:load` (above fold) or `client:visible` (below fold)
- Do NOT add new React Islands without explicit justification

**Landing Page Pattern:**
```astro
---
const products = await getCollection("products");
const product = products.find((p) => p.data.slug === "product-slug");
if (!product) throw new Error("Product product-slug not found");
const d = product.data;
---
<Layout title={`${d.name} — Grupo US`} description={d.description} ...>
  <div class="pb-[calc(5rem+env(safe-area-inset-bottom,0px))] md:pb-0">
    <LandingHero name={d.name} tagline={d.tagline} hero={d.hero} type={d.type} cta={d.cta} />
    <PainPoints audience={d.audience} painPoints={d.painPoints} />
    <!-- ... rest of sections in canonical order -->
  </div>
  <MobileCTABar cta={d.cta} />
</Layout>
```
- Always use `if (!product) throw new Error(...)` guard after `find()`
- Always alias `product.data` as `d` for brevity
- Always wrap body content in `pb-[calc(5rem+env(safe-area-inset-bottom,0px))] md:pb-0` div to clear `MobileCTABar`
- Always place `<MobileCTABar>` as a sibling OUTSIDE the main content div (renders as fixed overlay)

## Import Conventions

**Path Alias:**
- `@/*` maps to `src/*` — defined in `tsconfig.json`
- React Islands use `@/lib/utils` for the `cn` helper
- Astro components use relative imports (`../shared/Button.astro`, `../../layouts/Layout.astro`)
- No barrel `index.ts` files — import directly from the component file

**Import Order (enforced by Biome `organizeImports`):**
1. External packages (`astro:content`, `framer-motion`, `lucide-react`)
2. Internal path-alias imports (`@/lib/utils`)
3. Relative imports (component files, layout)

**Astro Content Imports:**
```ts
import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";
```

## Styling Conventions

**Token-Only Rule:**
- NEVER hardcode hex values in component class attributes
- Always use Tailwind design tokens: `bg-gold`, `text-navy`, `bg-navy-light`, `text-text-muted`, `bg-whatsapp`
- Color tokens defined in `src/styles/global.css` under `@theme {}` directive
- Exception: Aceternity UI components in `src/components/ui/` may use inline CSS variables via `style={}` for animation internals

**Available Color Tokens:**
- Navy: `navy`, `navy-light`, `navy-lighter`
- Gold: `gold`, `gold-light`, `gold-dark`
- Text: `text-primary`, `text-muted`
- Brand: `whatsapp`, `whatsapp-hover`

**Custom Utility Classes (from `src/styles/global.css`):**
- `glass-card` — glassmorphism card style (gradient + blur + border)
- `gold-glow` — gold box-shadow glow effect
- `card-hover-lift` — hover translateY lift
- `gold-pulse-glow` — animated pulsing gold glow

**Typography:**
- Headings: `font-serif` (Playfair Display) — always for `h1`, `h2`; typically `h3` for card titles
- Body: `font-sans` (Inter) — default, no class needed in most cases
- `h1` in Hero section only; `h2` for section headings; `h3` for item headings

**Scroll-Triggered Animations:**
- Use `data-reveal="up|left|right|scale"` on elements to trigger CSS entry animations
- Optional `data-reveal-delay="N"` for staggered delays
- Applied via IntersectionObserver in `src/layouts/Layout.astro`
- Do NOT animate `width`, `height`, `top`, or `left` — use `transform`/`opacity` only

**Responsive Pattern:**
- Mobile-first with `sm:`, `md:`, `lg:` breakpoints
- Layout containers: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Section content caps: `max-w-4xl mx-auto` or `max-w-2xl mx-auto`

**Accessibility in Styles:**
- All interactive elements must have `cursor-pointer` and visible hover states
- Focus states: visible gold outline (`outline: 2px solid gold`) — managed by `global.css`
- Never leave `href="#"` for navigation — use real routes or valid URLs

## TypeScript Usage

**Strict Mode:** Enabled via `astro/tsconfigs/strict` in `tsconfig.json`

**Patterns:**
- Props interfaces in Astro files use `interface Props` (not exported)
- Exported data shapes use `export type`
- Const assertions for immutable lookup maps: `Record<string, string>` typed objects
- `unknown` instead of `any`
- Zod schemas in `src/content.config.ts` enforce content shape at build time — all content arrays have minimum length constraints enforced by `.min(N)` and `.length(N)` validators

**Path Alias:**
```json
"paths": { "@/*": ["src/*"] }
```

## Git and Commit Conventions

**Format:** Conventional Commits

**Types:**
- `feat:` — New feature or page
- `fix:` — Bug fix
- `docs:` — Documentation changes
- `refactor:` — Code restructuring without behavior change
- `chore:` — Config, deps, tooling changes

**Examples:**
```
feat: add neon-dash landing page
fix: correct WhatsApp CTA URL for curso-auriculo
refactor: extract ProductsGrid to shared component
chore: update biome to 2.4.9
```

## Anti-Patterns (Prohibited)

These constraints are non-negotiable and enforced via code review and AGENTS.md:

| Anti-Pattern | Correct Approach |
|---|---|
| Emojis as icons | Lucide React SVG components only |
| Hardcoded hex in class attributes | Tailwind color tokens (`bg-gold`, `text-navy`) |
| Content data in component files | `getCollection()` from `src/content/` |
| React Islands for static content | Pure `.astro` components (zero JS) |
| SPA routing / `<ViewTransitions>` | Standard `<a>` tags — full page reload MPA |
| Animating `width`/`height`/`top`/`left` | `transform` and `opacity` only |
| `npm`, `yarn`, or `pnpm` commands | `bun install`, `bun run`, `bunx` only |
| Generic box shadows | Colored glow utilities (`gold-glow`, `glass-card`) |
| `href="#"` for legal links | Real routes `/termos`, `/politica-de-privacidade` |
| Scroll-jacking | No forced scroll effects |
| Missing hover states on clickable elements | Always add `cursor-pointer` + hover classes |
| Normalizing CTA domains blindly | Validate conversion funnel before changing URLs |
| Adding React Islands without justification | FAQ = `<details>`/`<summary>`; mobile nav = inline `<script>` |

---

*Convention analysis: 2026-03-25; synced 2026-03-26*
