# Phase 6: QA, Performance & Ship - Research

**Researched:** 2026-03-26
**Domain:** Lighthouse performance auditing, accessibility verification, cross-browser compatibility, CI automation, technical debt cleanup, and Railway deployment
**Confidence:** HIGH

## Summary

Phase 6 is the final quality assurance pass before shipping the Grupo US institutional site. All 24 v1 requirements are already marked complete across Phases 1-5. This phase validates ship-readiness through Lighthouse auditing (target >= 95 across all 4 categories on all 9 content pages), fixes known technical debt items from CONCERNS.md, builds reusable CI scripts for Lighthouse and smoke testing, audits all 14 React islands for cross-browser issues and hydration edge cases, and performs a clean deploy to Railway.

The codebase is an Astro 6 SSG site with 14 React islands (10 in `src/components/ui/`, 1 in `home/`, 1 in `landing/`, 1 in `shared/`, plus 1 `Spotlight` that has no "use client"). Key technical debt: `lamp.tsx` animates `width` (violates AGENTS.md), `aurora-background.tsx` uses `background-attachment: fixed` (breaks mobile Safari compositing), 2 hardcoded hex values, 10 files with unnecessary "use client" directives, unused `framer-motion` + `simplex-noise` + 2 dead component files, and stale AGENTS.md documentation.

**Primary recommendation:** Start with technical debt cleanup (fast, deterministic fixes), then run Lighthouse to measure the baseline after cleanup, optimize any remaining performance issues, build the CI scripts, and finish with deploy + smoke test.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Audit ALL 9 content pages: home, sobre, curso-auriculo, mentoria-black-neon, comunidade-us, otb, neon-dash, contato, 404. Legal pages (termos, politica-de-privacidade) are text-only and expected to trivially pass.
- **D-02:** Target >= 95 in all 4 Lighthouse categories (Performance, Accessibility, Best Practices, SEO) on every page.
- **D-03:** If a page can't hit 95, aggressively optimize: downgrade `client:idle` to `client:visible`, defer non-critical JS, reduce bundle. Accept 90 only if no further optimization is possible -- document reasoning per page.
- **D-04:** Lighthouse runs via CI script (Bun script using Lighthouse CLI) with threshold enforcement. Script must fail if any page/category drops below 95. Reusable for future deploys.
- **D-05:** Fix `lamp.tsx` width animation -- refactor from `width: "15rem" -> "30rem"` to `transform: scaleX()` or equivalent. Violates AGENTS.md rule against animating width/height/top/left.
- **D-06:** Remove unused dependencies: `framer-motion` from package.json (dead -- `motion` pkg is used), `wavy-background.tsx` + `moving-border.tsx` (0 importers), `simplex-noise` (only imported by wavy-background).
- **D-07:** Fix 2 hardcoded hex values: `bg-[#fafaf9]` in NeonBio.astro (replace with Tailwind token), `fill="#d4af37"` in Hero.astro Spotlight (replace with CSS variable reference).
- **D-08:** Remove 6 `"use client"` directives from Aceternity UI files in `src/components/ui/` -- these are Next.js no-ops in Astro.
- **D-09:** Update AGENTS.md stale info: team count 3->13, Framer Motion version 11.x->12.x, remove `contact/` directory "(if extracted)" note.
- **D-10:** Skip `.env.example` creation -- contact form already has graceful fallback with clear instructions.
- **D-11:** Full automated smoke test script (Bun): curl all 9 content routes (check 200), verify 4 redirects follow correctly (na-mesa-certa, comunidade-us, trintae3, neon-dash), check sitemap-index.xml and robots.txt accessible, verify OG images load.
- **D-12:** Pre-deploy gate chain: `bun run lint` + `bunx astro check` + `bun run build` + Lighthouse CI script. All must pass before pushing to main.
- **D-13:** Smoke test runs post-deploy against the Railway URL. Deploy is Railway auto-deploy triggered by push to main.
- **D-14:** Code audit approach only -- no real browser testing or Playwright. SSG + standard CSS is inherently cross-browser safe. Audit identifies and fixes known issues.
- **D-15:** Fix `background-attachment: fixed` in aurora-background.tsx (disables GPU compositing on mobile Safari, causes repaint on every scroll tick).
- **D-16:** Verify `backdrop-filter` fallback for older browsers, `grid-template-rows: 0fr` accordion works in Safari.
- **D-17:** Audit ALL 14 React islands for hydration edge cases and Framer Motion browser compatibility.

### Claude's Discretion
- Lighthouse CI script implementation details (which npm/bun Lighthouse wrapper, output format)
- Smoke test script implementation (curl vs fetch, output format, exit codes)
- Specific `transform` approach for lamp.tsx width refactor (scaleX vs translateX vs clip-path)
- Which Tailwind token to use for NeonBio `#fafaf9` replacement (if `text-primary` is the right match)
- How to replace Spotlight `fill="#d4af37"` with a CSS variable (prop vs CSS custom property)
- Order of operations across plans (cleanup first vs Lighthouse first)

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope.
</user_constraints>

## Project Constraints (from CLAUDE.md)

- **Package manager:** Bun only -- never npm/yarn/pnpm
- **Validation gates:** `bun run lint` + `bunx astro check` + `bun run build`
- **Animations:** NEVER animate width/height/top/left -- use transform/opacity only
- **Hex values:** NEVER hardcode hex -- always use Tailwind tokens
- **Islands:** NEVER add React Islands without justification -- Astro zero-JS default
- **Routing:** MPA only -- no SPA patterns, no ClientRouter
- **Icons:** Lucide React SVG only -- never emojis as UI icons
- **Deploy:** Railway via GitHub integration, `bun run build` -> `dist/`, Caddy serves
- **Pre-commit hook:** Lefthook runs `bun run lint`
- **Commit format:** Conventional Commits

## Standard Stack

### Core (Already Installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| astro | ^6.0.8 | Static site generator | Project framework |
| motion | ^12.38.0 | Animation library (Framer Motion) | All React island animations |
| react | ^19.2.4 | UI framework for islands | Island hydration |
| tailwindcss | ^4.2.2 | Utility CSS via Vite plugin | Design system |
| @biomejs/biome | ^2.4.9 | Lint + format | Code quality gate |
| oxlint | ^1.57.0 | JS/TS lint | Additional lint layer |

### New for This Phase (CI Scripts)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| lighthouse | 13.0.3 | Lighthouse CLI (already available via npx) | Programmatic performance auditing |
| chrome-launcher | latest | Launch headless Chrome from Node | Required by Lighthouse programmatic API |

### Dependencies to REMOVE
| Package | Reason |
|---------|--------|
| `framer-motion` (^12.38.0) | Dead weight -- all imports use `motion/react` from the `motion` package |
| `simplex-noise` (^4.0.3) | Only imported by `wavy-background.tsx` which is unused |

### Components to DELETE
| File | Reason |
|------|--------|
| `src/components/ui/wavy-background.tsx` | Zero importers in the codebase |
| `src/components/ui/moving-border.tsx` | Zero importers in the codebase |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Lighthouse CLI + chrome-launcher | @lhci/cli (Lighthouse CI) | @lhci/cli has richer assertion config but heavier setup; raw Lighthouse + custom script is simpler for this project's needs |
| curl-based smoke test | Playwright | Playwright is overkill for SSG route validation per D-14; curl is deterministic and fast |

## Architecture Patterns

### Recommended Script Structure
```
scripts/
├── check-external-urls.mjs     # Existing -- validates redirect alignment
├── lighthouse-audit.mjs         # NEW -- runs Lighthouse on all 9 pages, enforces thresholds
└── smoke-test.mjs               # NEW -- verifies routes, redirects, assets post-deploy
```

### Pattern 1: Lighthouse CI Script (Programmatic API)
**What:** Node.js script that launches headless Chrome, runs Lighthouse on each of the 9 content pages against a local preview server, validates all 4 category scores >= 95, outputs a summary table, and exits non-zero on failure.
**When to use:** Pre-deploy gate (D-04, D-12) and future regression checks.
**Example:**
```javascript
// scripts/lighthouse-audit.mjs
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

const PAGES = [
  '/', '/sobre', '/curso-auriculo', '/mentoria-black-neon',
  '/comunidade-us', '/otb', '/neon-dash', '/contato', '/404'
];
const THRESHOLD = 95;
const CATEGORIES = ['performance', 'accessibility', 'best-practices', 'seo'];

async function auditPage(chrome, url) {
  const result = await lighthouse(url, {
    port: chrome.port,
    output: 'json',
    onlyCategories: CATEGORIES,
  });
  const scores = {};
  for (const cat of CATEGORIES) {
    scores[cat] = Math.round(result.lhr.categories[cat].score * 100);
  }
  return scores;
}

// Launch Chrome, iterate pages, check thresholds, exit 1 on failure
```

### Pattern 2: Smoke Test Script (curl + fetch)
**What:** Script that curls all content routes (expect 200), follows redirects (expect final 200 at external URL), verifies sitemap-index.xml and robots.txt return correct content types, and checks OG images load.
**When to use:** Post-deploy verification (D-11, D-13).
**Example:**
```javascript
// scripts/smoke-test.mjs
const BASE = process.argv[2] || 'http://localhost:4321';

const CONTENT_ROUTES = [
  '/', '/sobre', '/curso-auriculo', '/mentoria-black-neon',
  '/otb', '/neon-dash', '/contato', '/termos',
  '/politica-de-privacidade', '/404'
];

const REDIRECTS = [
  { from: '/na-mesa-certa', expectedHost: 'namesa.gpus.com.br' },
  { from: '/trintae3', expectedHost: 'trintae3.drasacha.com.br' },
  { from: '/comunidade-us', expectedHost: 'drasacha.com.br' },
  { from: '/neon-dash', expectedHost: 'neondash.com.br' },
];

// Check status, verify redirects resolve, check sitemap + robots, verify OG images
```

### Pattern 3: lamp.tsx Width -> Transform Refactor
**What:** Replace `width: "15rem" -> "30rem"` animations with `scaleX` + fixed container. The conic gradient divs start at their final rendered width (`w-[30rem]`) but use `scaleX(0.5)` initially, animating to `scaleX(1)`.
**When to use:** D-05 fix.
**Why scaleX:** The lamp effect is a symmetrical gradient spread from center. scaleX achieves the same visual expand without triggering layout reflow. No child distortion concern because children are positioned absolutely with their own transforms.
**Example:**
```tsx
<motion.div
  initial={{ opacity: 0.5, scaleX: 0.5 }}
  whileInView={{ opacity: 1, scaleX: 1 }}
  transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
  className="absolute inset-auto right-1/2 h-56 w-[30rem] overflow-visible
    bg-gradient-conic from-gold via-transparent to-transparent
    text-white [--conic-position:from_70deg_at_center_top]"
  style={{
    backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
    transformOrigin: 'right center', // expand from center axis
  }}
>
```
**Note:** The smaller glow div (8rem -> 16rem) also needs the same treatment: `scaleX(0.5) -> scaleX(1)` with `w-64` (16rem) as the base width. The thin line (15rem -> 30rem) uses the same pattern.

### Pattern 4: aurora-background.tsx -- Remove background-attachment: fixed
**What:** Remove `[background-attachment:fixed]` from the after pseudo-element class. The aurora effect is a full-viewport hero section, so the fixed attachment adds no visual benefit (the element already covers the viewport) but breaks GPU compositing on mobile Safari.
**When to use:** D-15 fix.
**Replacement:** Simply remove `after:[background-attachment:fixed]` from the class string. The aurora animation uses `background-position` keyframes which work without fixed attachment.

### Pattern 5: Spotlight fill Hex -> CSS Variable
**What:** Replace `fill="#d4af37"` in Hero.astro with a CSS variable reference.
**When to use:** D-07 fix.
**Approach:** Pass `fill="var(--color-gold)"` as the prop value to Spotlight. SVG `fill` accepts CSS custom properties when the SVG is inline (which it is -- Spotlight renders an inline `<svg>`). Verified: the Spotlight component passes the `fill` prop directly to `<ellipse fill={fill}>`, which renders as an inline SVG attribute. CSS variables work in inline SVG attributes in all modern browsers.

### Pattern 6: NeonBio hex -> Tailwind Token
**What:** Replace `bg-[#fafaf9]` with `bg-text-primary` in NeonBio.astro.
**When to use:** D-07 fix.
**Verification:** `#fafaf9` exactly matches `--color-text-primary` in global.css. NeonStory.astro already uses `bg-text-primary` for the same purpose (was fixed in a prior phase). This is a light background section for the bio, and `text-primary` as a background color is correct -- it provides the light contrast needed for the dark navy text content within.

### Anti-Patterns to Avoid
- **Do not run Lighthouse against the production Railway URL during CI.** The network latency and CDN caching make scores unreliable and non-reproducible. Run against `bun run preview` (local static server) for consistent, actionable results.
- **Do not install Chrome globally on the CI/build machine.** Chrome should be launched via `chrome-launcher` or bundled in a container. For local dev, the existing Chrome in WSL is sufficient.
- **Do not add `useReducedMotion` to Aceternity UI files that are CSS-only.** aurora-background.tsx is CSS-animated (the `animate-aurora` keyframe). The global `prefers-reduced-motion` CSS media query in global.css already handles this. Only add `useReducedMotion` to components that use Framer Motion JS animations (lamp.tsx, text-generate-effect.tsx, background-beams.tsx).
- **Do not convert `client:idle` to `client:visible` on Hero islands (AuroraBackground, HeroEntrance, TextGenerateEffect).** These are above-the-fold, always visible immediately. `client:visible` would not help because they are in the viewport on load. `client:idle` is the correct choice for above-fold visual-only effects.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Lighthouse auditing | Custom performance measurement | `lighthouse` npm package (programmatic API) | Standardized scoring, category breakdown, audit details |
| Chrome headless launch | Manual process spawning | `chrome-launcher` npm package | Handles port finding, flags, cleanup |
| HTTP route checking | Raw TCP sockets | `fetch()` with redirect: 'manual' | Built into Node 22+, handles redirects properly |
| CSS variable fallbacks | Manual @supports blocks for backdrop-filter | Already sufficient support (96%+ global) | backdrop-filter is broadly supported in 2026; glass-card fallback is the solid background which already exists in the gradient stack |

**Key insight:** The Lighthouse programmatic API returns the exact same LHR (Lighthouse Result) object as the CLI, with `categories.performance.score` as a 0-1 float. Multiply by 100 for the familiar 0-100 scale. No wrapper library needed.

## Common Pitfalls

### Pitfall 1: Lighthouse Score Variance
**What goes wrong:** Lighthouse scores fluctuate between runs, especially Performance (5-10 point variance).
**Why it happens:** CPU throttling simulation, network conditions, and Chrome GC timing introduce non-determinism.
**How to avoid:** Run Lighthouse with `--preset=desktop` for less variance. Consider running 3 times and taking the median. Use the local preview server (not production) for reproducible results.
**Warning signs:** A page scores 97 one run, 89 the next. This is normal -- use median of multiple runs for threshold enforcement.

### Pitfall 2: Chrome Not Found in WSL
**What goes wrong:** Lighthouse fails with "Chrome not found" error.
**Why it happens:** WSL2 does not ship with Chrome. The `chrome-launcher` package looks for Chrome binaries in standard Linux paths.
**How to avoid:** Install Chrome in WSL: `wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && sudo apt -y install ./google-chrome-stable_current_amd64.deb`. Then set `CHROME_PATH=/usr/bin/google-chrome` before running the script.
**Warning signs:** `Error: No Chrome installations found` on script execution.

### Pitfall 3: scaleX Distorts Children
**What goes wrong:** When using `scaleX()` to replace width animation, child elements appear stretched.
**Why it happens:** CSS transforms on a parent affect the coordinate space of children.
**How to avoid:** In lamp.tsx specifically, the children are mask overlays positioned with absolute positioning and fixed pixel sizes. Since these children are rectangular overlays (navy-colored masks), a slight scale distortion is imperceptible. However, verify visually after the change. If distortion is visible, apply counter-scale to children or use `clip-path` as an alternative.
**Warning signs:** The gradient masks at the edges of the lamp look thinner or thicker than before.

### Pitfall 4: background-attachment:fixed Removal Changes Visual
**What goes wrong:** Removing `background-attachment: fixed` from the aurora pseudo-element might change the visual parallax effect.
**Why it happens:** `background-attachment: fixed` creates a subtle parallax where the background stays fixed while content scrolls.
**How to avoid:** The aurora section is a full-viewport hero. Users don't scroll "through" it -- they scroll past it. The fixed attachment adds no perceptible parallax because the section fills the viewport. Simply removing it preserves the visual. Test by comparing before/after screenshots of the hero.
**Warning signs:** None expected -- the hero is position:relative with overflow:hidden, so the background fills the container regardless.

### Pitfall 5: SVG fill with CSS Variable
**What goes wrong:** `fill="var(--color-gold)"` might not resolve in some SVG contexts.
**Why it happens:** SVG attributes have different parsing rules than CSS properties. However, when an SVG is inline in HTML (not loaded via `<img>`), CSS custom properties work in `fill`, `stroke`, etc.
**How to avoid:** The Spotlight component renders an inline `<svg>` directly in React JSX. CSS variables in SVG attributes work in all modern browsers when the SVG is inline. Verified: this is the same pattern used by Lucide icons throughout the project.
**Warning signs:** The spotlight ellipse becomes invisible (white default fill). Easy to catch visually.

### Pitfall 6: "use client" Removal Breaks Astro
**What goes wrong:** Concern that removing "use client" might affect Astro's client directive handling.
**Why it happens:** Misunderstanding of what "use client" does. It is a React Server Components directive (Next.js/React 19 RSC). Astro does not use RSC -- it uses its own `client:*` directives for island hydration.
**How to avoid:** "use client" is a no-op string literal in Astro. Removing it from all 10 files is safe. Astro determines what to hydrate based on `client:load`, `client:idle`, `client:visible` directives in the `.astro` templates that render these components.
**Warning signs:** None -- removal is safe.

## Code Examples

### Verified: "use client" Files to Clean (D-08)

10 files have "use client" (confirmed by codebase grep):
1. `src/components/ui/aurora-background.tsx`
2. `src/components/ui/background-beams.tsx`
3. `src/components/ui/text-generate-effect.tsx`
4. `src/components/ui/lamp.tsx`
5. `src/components/ui/HeroEntrance.tsx`
6. `src/components/ui/LandingHeroEntrance.tsx`
7. `src/components/ui/MotionReveal.tsx`
8. `src/components/ui/AnimatedStats.tsx`
9. `src/components/ui/moving-border.tsx` (being deleted anyway)
10. `src/components/ui/wavy-background.tsx` (being deleted anyway)
11. `src/components/home/JourneyTimeline.tsx`
12. `src/components/landing/TestimonialCarousel.tsx`
13. `src/components/shared/WhatsAppFloatingButton.tsx`

Note: The CONTEXT.md says "6 Aceternity UI files" but the actual count is 10 active files (excluding the 2 being deleted) plus the Spotlight which does NOT have "use client". Remove from all active files.

### Verified: useReducedMotion Status Across Islands

| Island | Has useReducedMotion | Notes |
|--------|---------------------|-------|
| HeroEntrance.tsx | YES | Full fallback to static div |
| LandingHeroEntrance.tsx | YES | Full fallback to static div |
| MotionReveal.tsx | YES | Full fallback to static div |
| AnimatedStats.tsx | YES | Full fallback, count-up skips animation |
| JourneyTimeline.tsx | YES | Full fallback to StaticTimeline |
| TestimonialCarousel.tsx | YES | Full fallback to StaticTestimonials grid |
| WhatsAppFloatingButton.tsx | YES | Shows immediately, no animation |
| aurora-background.tsx | NO -- but CSS-only animation | Global `prefers-reduced-motion` CSS handles it |
| text-generate-effect.tsx | NO (uses Framer Motion JS) | Needs audit: `useAnimate`/`stagger` has no reduced-motion guard. However, the no-JS SSR fallback shows all words immediately. |
| background-beams.tsx | NO (uses Framer Motion JS) | Needs audit: continuous SVG path animation with no reduced-motion guard. Decorative-only (aria-hidden). |
| lamp.tsx | NO (uses Framer Motion JS) | Needs audit: `whileInView` width animation with no reduced-motion guard. |
| spotlight.tsx | N/A | Pure SVG, CSS-only animation via `animate-spotlight` class. No JS animation. |

**Action items for D-17 audit:**
- `lamp.tsx`: Add `useReducedMotion()` -- if reduced motion, render static at final state (full width, full opacity).
- `text-generate-effect.tsx`: Has SSR/no-JS fallback that shows words immediately. The `runMotion` state is `false` on first render, which shows the static fallback. On hydration, it becomes `true`. Adding `useReducedMotion` to skip the animation when preference is set would be ideal but the existing behavior (words flash in quickly) is acceptable. Flag for review.
- `background-beams.tsx`: Decorative SVG animation with `aria-hidden`. The global CSS `prefers-reduced-motion` reduces `animation-duration` to 0.01ms. However, the SVG gradient animation is done via Framer Motion `animate` (JS), not CSS. Should add `useReducedMotion` to skip the gradient sweep animation.

### Verified: Client Directive Audit

| Component | Current Directive | Location | Recommendation |
|-----------|------------------|----------|----------------|
| AuroraBackground | client:idle | Hero.astro | Keep -- above-fold visual effect |
| HeroEntrance | client:idle | Hero.astro | Keep -- above-fold entrance animation |
| TextGenerateEffect | client:idle | Hero.astro | Keep -- above-fold headline animation |
| Spotlight | (none -- rendered inside AuroraBackground island) | Hero.astro | N/A -- hydrated as child of AuroraBackground |
| LampBackdrop | client:visible | CTASection.astro | Correct -- below-fold |
| MotionReveal | client:visible | CTASection.astro | Correct -- below-fold |
| AnimatedStats | client:visible | StatsSection.astro | Correct -- below-fold |
| BackgroundBeams | (rendered inside LandingCTA section) | Various landing pages | Verify directive in parent |
| JourneyTimeline | client:visible | index.astro | Correct -- below-fold |
| TestimonialCarousel | client:visible | Various pages | Correct -- below-fold |
| WhatsAppFloatingButton | client:load | Layout.astro (via page prop) | Keep as client:load -- fixed-position, needs scroll listener immediately |

### AGENTS.md Updates (D-09)

Three stale items verified:
1. Line 117: `team/ -- 3 team member JSON files` -> Actual: **13 team member JSON files** (verified: `ls src/content/team/*.json | wc -l` returns 13)
2. Line 152: `Framer Motion | 11.x` -> Actual: **12.x** (`"motion": "^12.38.0"` in package.json)
3. Line 114: `contact/ # ContactForm (if extracted)` -> Directory does not exist, remove note

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `background-attachment: fixed` for parallax | Remove entirely or use `position: fixed` wrapper | Always broken on mobile Safari | Removing fixes mobile compositing |
| `"framer-motion"` package | `"motion"` package (same team, modern API) | motion 12.x | All imports already use `motion/react`; `framer-motion` dep is dead |
| Lighthouse 10-11 | Lighthouse 13.0.3 | 2024-2025 | Current version, available via npx |
| `"use client"` on all React files | Not needed in Astro | N/A for Astro | Astro uses `client:*` directives, not RSC boundaries |

**Deprecated/outdated:**
- `framer-motion` npm package: renamed to `motion` for v12+. The `framer-motion` entry is a compatibility shim that re-exports from `motion`. Safe to remove.
- `simplex-noise`: Only consumer (`wavy-background.tsx`) is unused. Remove together.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Bun | All scripts, build | YES | 1.3.11 | -- |
| Node.js | Lighthouse script | YES | 22.22.0 | -- |
| npx | Lighthouse CLI | YES | 10.9.4 | -- |
| Lighthouse | Performance auditing | YES (via npx) | 13.0.3 | -- |
| Google Chrome | Lighthouse headless runner | **NO** | -- | **Must install in WSL** |
| curl | Smoke test script | YES | 8.11.1 | fetch() in Node 22 |

**Missing dependencies with no fallback:**
- **Google Chrome headless** -- REQUIRED for Lighthouse. Must be installed in WSL before the Lighthouse CI script can run. Install command: `wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && sudo apt -y install ./google-chrome-stable_current_amd64.deb`

**Missing dependencies with fallback:**
- None -- all other tools are available.

**Note:** The Lighthouse CI script should document the Chrome installation prerequisite clearly. The `CHROME_PATH=/usr/bin/google-chrome` environment variable should be set in the script or documented for the user.

## Cross-Browser Audit Findings (D-14, D-15, D-16)

### backdrop-filter Support
- **Global support:** ~96%+ (caniuse.com, as of 2025-2026)
- **Safari:** Requires `-webkit-backdrop-filter` prefix. Important: CSS variables inside `backdrop-filter` values do NOT work in Safari -- but the project uses literal values (`blur(18px)`, `blur(24px)`) not variables, so this is not an issue.
- **Fallback:** The glass-card utility already has a solid gradient background in the `background` property. If backdrop-filter is unsupported, the card is still visible with a solid navy-gold gradient -- just without the blur effect. This is acceptable graceful degradation.
- **Verdict:** No action needed. The current implementation is safe.

### details/summary FAQ Accordion
- **Browser support:** Universal. Native HTML5 elements supported in all modern browsers including Safari 6+.
- **No grid-template-rows usage:** The FAQ component uses `<details>/<summary>`, not CSS grid accordion. D-16 concern about `grid-template-rows: 0fr` is moot -- the project does not use this pattern.
- **Verdict:** No action needed.

### background-attachment: fixed (D-15)
- **Issue:** `aurora-background.tsx` line 39 uses `after:[background-attachment:fixed]` via Tailwind class.
- **Impact:** Disables GPU compositing layer for the aurora pseudo-element on mobile Safari, causing full-page repaint on every scroll tick.
- **Fix:** Remove `after:[background-attachment:fixed]` from the class string. The aurora is a viewport-filling hero -- fixed attachment provides zero visual benefit.
- **Confidence:** HIGH -- well-documented Safari limitation.

### Framer Motion Cross-Browser
- **LazyMotion + m pattern:** Used correctly in 7/14 islands. This reduces bundle from ~34KB to ~4.6KB.
- **motion import pattern:** Used in lamp.tsx, background-beams.tsx, text-generate-effect.tsx (full `motion` import, not `m`).
- **Browser compatibility:** Framer Motion/motion 12.x supports Chrome 64+, Firefox 78+, Safari 13.1+, Edge 79+. No known cross-browser issues.
- **Verdict:** No cross-browser action needed for Framer Motion itself. The LazyMotion optimization opportunity in the 3 Aceternity files is a performance consideration, not a compatibility issue -- and changing the import pattern in those files is out of scope for this phase (they work fine as-is).

## React Islands Audit Summary (D-17)

### 14 Islands Classified

**Category A -- Well-structured (LazyMotion + useReducedMotion):**
1. HeroEntrance.tsx
2. LandingHeroEntrance.tsx
3. MotionReveal.tsx
4. AnimatedStats.tsx
5. JourneyTimeline.tsx
6. TestimonialCarousel.tsx
7. WhatsAppFloatingButton.tsx

**Category B -- CSS-only animation (no Framer Motion JS):**
8. aurora-background.tsx -- CSS `animate-aurora` keyframe, handled by global reduced-motion CSS
9. spotlight.tsx -- CSS `animate-spotlight` keyframe, handled by global reduced-motion CSS

**Category C -- Framer Motion JS without useReducedMotion (needs fix):**
10. lamp.tsx -- `whileInView` width animation (also needs width->scaleX fix per D-05)
11. text-generate-effect.tsx -- `useAnimate` + `stagger` for word fade-in
12. background-beams.tsx -- continuous `animate` on SVG gradient linearGradient positions

**Category D -- Being deleted:**
13. wavy-background.tsx -- unused, delete
14. moving-border.tsx -- unused, delete

**Hydration edge cases:**
- All islands use `client:idle` or `client:visible` appropriately (see Client Directive Audit above).
- No `client:only` usage -- all islands SSR correctly.
- WhatsAppFloatingButton correctly uses `client:load` because fixed-position elements never enter the viewport via IntersectionObserver.
- Background-beams uses `React.memo` -- correct for preventing unnecessary re-renders of the heavy SVG path list.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | No unit test runner (per CLAUDE.md) |
| Config file | N/A |
| Quick run command | `bun run lint && bunx astro check` |
| Full suite command | `bun run lint && bunx astro check && bun run build` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| D-04 | Lighthouse >= 95 all categories, all 9 pages | CI script | `node scripts/lighthouse-audit.mjs` | Wave 0 |
| D-05 | lamp.tsx no width animation | lint (manual verify) | `bun run build` (no CLS regression) | N/A |
| D-06 | Unused deps removed | build | `bun run build` passes without framer-motion/simplex-noise | N/A |
| D-07 | No hardcoded hex | grep check | `grep -rn 'bg-\[#' src/components/ \|\| echo OK` | N/A |
| D-08 | No "use client" | grep check | `grep -rn '"use client"' src/components/ \|\| echo OK` | N/A |
| D-11 | Smoke test passes | CI script | `node scripts/smoke-test.mjs http://localhost:4321` | Wave 0 |
| D-12 | Pre-deploy gate chain | script | `bun run lint && bunx astro check && bun run build` | Exists |
| D-15 | No background-attachment:fixed | grep check | `grep -rn 'background-attachment' src/ \|\| echo OK` | N/A |

### Sampling Rate
- **Per task commit:** `bun run lint && bunx astro check && bun run build`
- **Per wave merge:** Full suite + visual spot check
- **Phase gate:** Full suite green + Lighthouse script green + smoke test green

### Wave 0 Gaps
- [ ] `scripts/lighthouse-audit.mjs` -- Lighthouse CI script (D-04)
- [ ] `scripts/smoke-test.mjs` -- Smoke test script (D-11)
- [ ] Google Chrome installation in WSL -- prerequisite for Lighthouse

## Open Questions

1. **Chrome Installation in WSL**
   - What we know: Chrome is not currently installed in WSL. Lighthouse requires Chrome headless.
   - What's unclear: Whether the user has permissions or preference for installing Chrome in WSL.
   - Recommendation: The plan should include Chrome installation as a prerequisite step in the Lighthouse plan. If Chrome cannot be installed, the fallback is to run Lighthouse via the PageSpeed Insights API (web-based, no local Chrome needed) but scores may vary from local runs.

2. **Lighthouse Score Variance**
   - What we know: Performance scores can vary 5-10 points between runs.
   - What's unclear: Whether a single run or median-of-3 is expected.
   - Recommendation: Default to single run with `--preset=desktop` for less variance. If any page fails, re-run 3 times and use median. Document this in the script.

3. **AnimatedStats textShadow inline style**
   - What we know: `AnimatedStats.tsx` line 122 uses `style={{ textShadow: "0 0 30px rgba(212,175,55,0.3)" }}` which hardcodes an rgba value.
   - What's unclear: Whether this counts as "hardcoded hex" per D-07 (it's rgba, not hex, and it's in a React component, not Tailwind).
   - Recommendation: LOW priority -- not a Tailwind class, so the "never hardcode hex" rule is about Tailwind utilities specifically. The rgba value uses the gold color (212,175,55 = #d4af37). Could use `color-mix` in a CSS utility instead, but this is cosmetic and not in the D-07 scope. Flag for future cleanup.

## Sources

### Primary (HIGH confidence)
- **Codebase audit:** Direct inspection of all 14 React island files, global.css, astro.config.mjs, package.json, AGENTS.md
- **CONCERNS.md:** `.planning/codebase/CONCERNS.md` -- technical debt audit with severity ratings
- **CONTEXT.md:** `.planning/phases/06-qa-performance-and-ship/06-CONTEXT.md` -- user decisions D-01 through D-17

### Secondary (MEDIUM confidence)
- [Lighthouse programmatic docs](https://github.com/GoogleChrome/lighthouse/blob/main/docs/readme.md) -- understanding-results.md for LHR structure
- [Lighthouse headless Chrome docs](https://github.com/GoogleChrome/lighthouse/blob/main/docs/headless-chrome.md) -- WSL setup guidance
- [Can I Use: backdrop-filter](https://caniuse.com/css-backdrop-filter) -- 96%+ global support confirmed
- [Can I Use: background-attachment](https://caniuse.com/background-attachment) -- mobile Safari limitation documented
- [CSS-Tricks: Fixed Background Attachment Hack](https://css-tricks.com/the-fixed-background-attachment-hack/) -- alternative approaches
- [motion.dev animation docs](https://motion.dev/docs/react-animation) -- scaleX animation pattern
- [PQINA: Animating Width Without Squish](https://pqina.nl/blog/animating-width-and-height-without-the-squish-effect/) -- scaleX child distortion considerations

### Tertiary (LOW confidence)
- [WSL Chrome installation guide](https://github.com/GoogleChrome/lighthouse/discussions/12752) -- community guidance, may vary by WSL distro

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all tools already installed or well-documented
- Architecture: HIGH -- patterns derived from existing codebase conventions (scripts/, package.json scripts)
- Pitfalls: HIGH -- based on direct codebase inspection and verified browser compatibility data
- Islands audit: HIGH -- every island file read and classified
- Lighthouse setup: MEDIUM -- Chrome availability in WSL is the uncertainty

**Research date:** 2026-03-26
**Valid until:** 2026-04-26 (stable domain -- Lighthouse CLI, CSS compatibility, and Astro patterns are mature)
