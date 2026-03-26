# Path rules: `astro.config.mjs`, `package.json`, `tsconfig.json`, `biome.json`

SSOT: `AGENTS.md` / `.claude/CLAUDE.md`.

- **Package manager:** Bun only — never npm/yarn/pnpm in scripts or docs.
- **Redirects:** Sync external URLs with `externalSiteUrl` and sitemap `filter()` — exclude redirect-only routes from indexing.
- **MPA:** No `ClientRouter` / SPA — full page reload via normal `<a>` navigation.
- **Validation:** `bunx astro check && bun run build && bun run lint` after meaningful config or dep changes.
- **Deploy:** Railway via GitHub; static output `dist/`.
- **Local overrides:** Use `.claude/settings.local.json` (gitignored) for machine-specific Claude settings — not committed policy.
