# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Prerequisites

- Read root `AGENTS.md` before any action — it is the single source of truth for project rules, design system, and constraints.

## Commands

| Task             | Command            |
| ---------------- | ------------------ |
| Install          | `bun install`      |
| Dev server       | `bun run dev`      |
| Build            | `bun run build`    |
| Preview          | `bun run preview`  |
| Type check       | `bunx astro check` |
| Lint (no fix)    | `bun run lint`     |
| Lint + fix       | `bun run lint:fix` |

**Package manager: Bun only.** Never use npm/yarn/pnpm.

**Lint:** [Biome](https://biomejs.dev) covers `src/**` and `astro.config.mjs` (format + lint). [oxlint](https://oxc.rs/docs/guide/usage/linter.html) covers `src` JS/TS/JSX. There is no unit test runner. Validation gates: `bun run lint`, `bunx astro check` (types + Astro), and `bun run build` (full build). Git `pre-commit` runs `bun run lint` via [Lefthook](https://github.com/evilmartians/lefthook) after `bun install` (`prepare`).

## Architecture

**Stack:** Astro 6 + Tailwind CSS v4 + React 19 (Islands) + Framer Motion + Lucide React.

### Key architectural decisions

- **Tailwind v4 via Vite plugin** — configured in `astro.config.mjs` as `@tailwindcss/vite`. No `tailwind.config.js`. All custom tokens live in `src/styles/global.css` using `@theme {}` directive.
- **Content Collections without config.ts** — Astro 6 infers schemas from JSON files in `src/content/{speakers,faqs,testimonials}/`. No `src/content/config.ts` exists. Data is fetched via `getCollection()` in page frontmatter.
- **Islands architecture** — Only 3 React islands exist (hard gate):
  - `CountdownTimer.tsx` → `client:load` (in Hero)
  - `FAQAccordion.tsx` → `client:visible`
  - `Testimonials.tsx` → `client:visible`
  - All other components are `.astro` (zero JS). Do NOT add new React islands.
- **Single page app** — `src/pages/index.astro` is the only page. It imports all section components and passes collection data as props to React islands.
- **Layout** — `src/layouts/Layout.astro` provides `<head>`, Google Fonts (Playfair Display + Inter). Language is `pt-BR`. Multi-page links use full document navigation (no client-side router), per `AGENTS.md` anti-SPA rule.

### Data flow for React islands

```
index.astro frontmatter: getCollection('testimonials') → map to .data → pass as props
index.astro frontmatter: getCollection('faqs') → map to .data → pass as props
```

React islands receive plain data objects, not Astro collection entries.

### Styling

- `src/styles/global.css` defines color tokens (`--color-navy`, `--color-gold`, etc.), custom utilities (`gold-glow`, `glass-card`), and base styles.
- Components use Tailwind utility classes referencing these tokens: `bg-navy`, `text-gold`, `text-text-muted`, `text-text-primary`.
- Dark navy is the only theme — no light/dark toggle.

## Behavior

- Implement directly, don't just suggest.
- Environment: Linux (WSL Ubuntu).
- Prefer non-interactive, self-terminating commands.
- Always run commands with timeout to avoid stuck processes.
- Commit format: Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `chore:`).

## Deploy

Railway via GitHub integration. Build: `bun run build` → output: `dist/`.
