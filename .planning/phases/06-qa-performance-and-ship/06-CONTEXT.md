# Phase 6: QA, Performance & Ship - Context

**Gathered:** 2026-03-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Final QA pass across all 9 content pages: Lighthouse >= 95 in all 4 categories, accessibility audit, cross-browser code audit (with island hydration review), technical debt cleanup from CONCERNS.md, automated CI scripts for Lighthouse and smoke testing, and clean deploy to Railway via push to main.

Requirements: All v1 requirements verified (24/24 already complete). This phase validates the ship-readiness of everything built in Phases 1-5.

</domain>

<decisions>
## Implementation Decisions

### Lighthouse Audit Scope
- **D-01:** Audit ALL 9 content pages: home, sobre, curso-auriculo, mentoria-black-neon, comunidade-us, otb, neon-dash, contato, 404. Legal pages (termos, politica-de-privacidade) are text-only and expected to trivially pass.
- **D-02:** Target >= 95 in all 4 Lighthouse categories (Performance, Accessibility, Best Practices, SEO) on every page.
- **D-03:** If a page can't hit 95, aggressively optimize: downgrade `client:idle` to `client:visible`, defer non-critical JS, reduce bundle. Accept 90 only if no further optimization is possible — document reasoning per page.
- **D-04:** Lighthouse runs via CI script (Bun script using Lighthouse CLI) with threshold enforcement. Script must fail if any page/category drops below 95. Reusable for future deploys.

### Technical Debt Cleanup
- **D-05:** Fix `lamp.tsx` width animation — refactor from `width: "15rem" -> "30rem"` to `transform: scaleX()` or equivalent. Violates AGENTS.md rule against animating width/height/top/left.
- **D-06:** Remove unused dependencies: `framer-motion` from package.json (dead — `motion` pkg is used), `wavy-background.tsx` + `moving-border.tsx` (0 importers), `simplex-noise` (only imported by wavy-background).
- **D-07:** Fix 2 hardcoded hex values: `bg-[#fafaf9]` in NeonBio.astro (replace with Tailwind token), `fill="#d4af37"` in Hero.astro Spotlight (replace with CSS variable reference).
- **D-08:** Remove 6 `"use client"` directives from Aceternity UI files in `src/components/ui/` — these are Next.js no-ops in Astro.
- **D-09:** Update AGENTS.md stale info: team count 3->13, Framer Motion version 11.x->12.x, remove `contact/` directory "(if extracted)" note.
- **D-10:** Skip `.env.example` creation — contact form already has graceful fallback with clear instructions.

### Deploy & Smoke Test
- **D-11:** Full automated smoke test script (Bun): curl all 9 content routes (check 200), verify 4 redirects follow correctly (na-mesa-certa, comunidade-us, trintae3, neon-dash), check sitemap-index.xml and robots.txt accessible, verify OG images load.
- **D-12:** Pre-deploy gate chain: `bun run lint` + `bunx astro check` + `bun run build` + Lighthouse CI script. All must pass before pushing to main.
- **D-13:** Smoke test runs post-deploy against the Railway URL. Deploy is Railway auto-deploy triggered by push to main.

### Cross-Browser Verification
- **D-14:** Code audit approach only — no real browser testing or Playwright. SSG + standard CSS is inherently cross-browser safe. Audit identifies and fixes known issues.
- **D-15:** Fix `background-attachment: fixed` in aurora-background.tsx (disables GPU compositing on mobile Safari, causes repaint on every scroll tick).
- **D-16:** Verify `backdrop-filter` fallback for older browsers, `grid-template-rows: 0fr` accordion works in Safari.
- **D-17:** Audit ALL 14 React islands for hydration edge cases and Framer Motion browser compatibility. Covers: AuroraBackground, TextGenerateEffect, HeroEntrance, LandingHeroEntrance, AnimatedStats, MotionReveal, JourneyTimeline, TestimonialCarousel, WhatsAppFloatingButton, BackgroundBeams, LampBackdrop, Spotlight.

### Claude's Discretion
- Lighthouse CI script implementation details (which npm/bun Lighthouse wrapper, output format)
- Smoke test script implementation (curl vs fetch, output format, exit codes)
- Specific `transform` approach for lamp.tsx width refactor (scaleX vs translateX vs clip-path)
- Which Tailwind token to use for NeonBio `#fafaf9` replacement (if `text-primary` is the right match)
- How to replace Spotlight `fill="#d4af37"` with a CSS variable (prop vs CSS custom property)
- Order of operations across plans (cleanup first vs Lighthouse first)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Rules
- `AGENTS.md` — Single source of truth for project rules (MPA, no ClientRouter, Bun only, no emoji icons, no hardcoded hex, transform/opacity only for animations)
- `.claude/CLAUDE.md` — Stack rules, negative constraints, component organization, deploy instructions
- `.claude/rules/frontend.md` — Motion rules (transform/opacity only), islands justification, Tailwind v4 tokens
- `.claude/rules/a11y.md` — Contrast >= 4.5:1, focus-visible, reduced-motion, skip-link, heading hierarchy, FAQ native

### Audit Source
- `.planning/codebase/CONCERNS.md` — Full technical debt audit with severity ratings. Phase 6 addresses HIGH and MEDIUM items.

### SEO Rules
- `.claude/rules/seo.md` — Per-page SEO requirements (title, description, canonical, OG, JSON-LD)

### Performance Context
- `src/styles/global.css` — Reduced-motion media queries (3 blocks), infinite animation mobile disable, design system utilities
- `src/components/ui/aurora-background.tsx` — `background-attachment: fixed` issue (D-15)
- `src/components/ui/lamp.tsx` — Width animation issue (D-05)

### Islands to Audit (D-17)
- `src/components/ui/aurora-background.tsx`
- `src/components/ui/text-generate-effect.tsx`
- `src/components/ui/background-beams.tsx`
- `src/components/ui/lamp.tsx`
- `src/components/ui/spotlight.tsx`
- `src/components/ui/HeroEntrance.tsx`
- `src/components/ui/LandingHeroEntrance.tsx`
- `src/components/ui/MotionReveal.tsx`
- `src/components/ui/AnimatedStats.tsx`
- `src/components/home/JourneyTimeline.tsx`
- `src/components/landing/TestimonialCarousel.tsx`
- `src/components/shared/WhatsAppFloatingButton.tsx`

### Deploy
- `astro.config.mjs` — Redirects config, sitemap config, Vite plugin config
- `package.json` — Scripts, dependencies (framer-motion to remove)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `bun run lint` + `bunx astro check` + `bun run build` — existing gate chain in package.json
- `scripts/check-external-urls.mjs` — existing URL validation script, pattern to follow for smoke test
- `useReducedMotion()` — already implemented in all 7 custom React islands (verified in scout)
- `data-reveal` CSS system — coexists with Framer Motion per Phase 3 hybrid decision (D-08/D-09)

### Established Patterns
- Lighthouse CLI available via `npx lighthouse` or bun equivalent
- Scripts live in `scripts/` directory (existing `check-external-urls.mjs` sets precedent)
- Gates run via `bun run <script>` in package.json
- Lefthook pre-commit already runs `bun run lint`

### Integration Points
- `package.json` — Add new scripts for lighthouse and smoke-test; remove `framer-motion` dep
- `astro.config.mjs` — No changes expected (redirects and sitemap already configured)
- `src/components/ui/lamp.tsx` — Width animation refactor to transform
- `src/components/ui/aurora-background.tsx` — Remove `background-attachment: fixed`
- `src/components/landing/NeonBio.astro` — Replace hardcoded hex
- `src/components/home/Hero.astro` — Replace Spotlight fill hex
- `AGENTS.md` — Update stale documentation

</code_context>

<specifics>
## Specific Ideas

- Lighthouse CI script should be reusable for future deploys — not a one-time pass.
- Smoke test script should be the definitive post-deploy verification, also reusable.
- Pre-deploy gate: lint + check + build + lighthouse must ALL pass before pushing to main.
- The lamp.tsx width fix should not change the visual effect — same appearance, different CSS property.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 06-qa-performance-and-ship*
*Context gathered: 2026-03-26*
