---
phase: 01-technical-debt-and-foundation
plan: "1.2"
type: execute
wave: 1
depends_on: []
files_modified:
  - public/favicon.svg
autonomous: true
requirements:
  - TECH-02
  - TECH-04
  - TECH-05

must_haves:
  truths:
    - "Favicon uses the brand gold token #d4af37, not the lighter #C9A96E"
    - "No Google Fonts CDN link tag exists anywhere in the codebase"
    - "Fonts are self-hosted via Astro 6 Fonts API using fontProviders.google()"
    - "A 404 page exists with Navy/Gold branding and links to home"
    - "bun run lint, bunx astro check, and bun run build all pass"
  artifacts:
    - path: "public/favicon.svg"
      provides: "Brand favicon with correct gold color"
      contains: "#d4af37"
    - path: "astro.config.mjs"
      provides: "Fonts API config with fontProviders.google()"
      contains: "fontProviders.google()"
    - path: "src/layouts/Layout.astro"
      provides: "Layout head using Font component"
      contains: "<Font cssVariable="
    - path: "src/pages/404.astro"
      provides: "404 page with Navy/Gold branding"
      contains: "text-gold"
  key_links:
    - from: "astro.config.mjs fonts config"
      to: "Layout.astro <Font /> components"
      via: "cssVariable names --font-playfair and --font-inter"
      pattern: "grep 'font-playfair\\|font-inter' astro.config.mjs src/layouts/Layout.astro"
    - from: "public/favicon.svg"
      to: "browser tab icon"
      via: "<link rel='icon' href='/favicon.svg'> in Layout.astro"
      pattern: "grep '#d4af37' public/favicon.svg"
---

<objective>
Fix favicon color to use brand gold token, and verify the two pre-existing implementations (Fonts API and 404 page) are complete and correct.

Purpose: TECH-05 requires a one-line fix — the favicon SVG uses `#C9A96E` (light gold) instead of the brand token `#d4af37`. TECH-02 and TECH-04 were confirmed complete in the discuss-phase but need verification tasks so they appear in the plan's requirements coverage and are formally signed off.
Output: Favicon with correct brand color. Verified Fonts API (no CDN dependency). Verified 404 page (Navy/Gold branding). All build gates passing.
</objective>

<execution_context>
@/home/mauricio/gpus/.claude/get-shit-done/workflows/execute-plan.md
@/home/mauricio/gpus/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/01-technical-debt-and-foundation/01-CONTEXT.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Fix favicon color from #C9A96E to #d4af37 (per D-03)</name>
  <files>public/favicon.svg</files>
  <read_first>
    - public/favicon.svg — Read the full file first to confirm all occurrences of #C9A96E before replacing. The file is 30 lines. Current color #C9A96E appears in: stroke on the U path (line 7), fill on the right stem dot (line 10), fill on the U top left star (line 13), fill on the S start dot (line 17), stroke on the S body curve (line 24), fill on the S end star (line 28). Total: 6 occurrences.
  </read_first>
  <action>
    Replace ALL occurrences of `#C9A96E` with `#d4af37` in `public/favicon.svg`.

    There are exactly 6 occurrences on these lines:
    - Line 7: `stroke="#C9A96E"` on the U path
    - Line 10: `fill="#C9A96E"` on the right stem dot circle
    - Line 13: `fill="#C9A96E"` on the U top left star path
    - Line 17: `fill="#C9A96E"` on the S start dot circle
    - Line 24: `stroke="#C9A96E"` on the S body curve path
    - Line 28: `fill="#C9A96E"` on the S end star path

    Each occurrence: change `#C9A96E` to `#d4af37` (lowercase hex, 6 characters, no alpha).

    The SVG structure, dimensions (150x150 viewBox), and all path/circle/polygon data must remain exactly as-is. Only the color value strings change.

    After editing, the file should contain zero occurrences of `#C9A96E` and six occurrences of `#d4af37`.
  </action>
  <verify>
    <automated>grep "#d4af37" /home/mauricio/gpus/public/favicon.svg</automated>
  </verify>
  <acceptance_criteria>
    - `grep "#d4af37" public/favicon.svg` returns exactly 6 lines
    - `grep "#C9A96E" public/favicon.svg` returns no output (all occurrences replaced)
    - `grep -i "c9a96e" public/favicon.svg` returns no output (case-insensitive check)
    - File still contains `viewBox="0 0 150 150"` (dimensions unchanged)
    - File still contains the U path (`M25 20 L25 100`) and S path (`M85 70 C 95 110`) — structure unchanged
  </acceptance_criteria>
  <done>public/favicon.svg uses #d4af37 exclusively for all color attributes. No #C9A96E remains. TECH-05 requirement satisfied.</done>
</task>

<task type="auto">
  <name>Task 2: Verify TECH-02 — Fonts API is complete, no CDN dependency (per D-01)</name>
  <files></files>
  <read_first>
    - astro.config.mjs — Confirm `fontProviders.google()` and `cssVariable` entries for Playfair Display and Inter.
    - src/layouts/Layout.astro — Confirm `<Font cssVariable="--font-playfair" />` and `<Font cssVariable="--font-inter" />` exist in `<head>`, with no Google Fonts `<link>` tag.
  </read_first>
  <action>
    This is a verification-only task. Do NOT modify any files.

    Run these checks to confirm TECH-02 is complete:

    1. Confirm Fonts API config in astro.config.mjs:
       ```
       grep "fontProviders.google" astro.config.mjs
       grep "font-playfair" astro.config.mjs
       grep "font-inter" astro.config.mjs
       ```
       Expected: Each returns a match.

    2. Confirm Font components in Layout.astro head:
       ```
       grep 'Font cssVariable' src/layouts/Layout.astro
       ```
       Expected: Returns 2 matches (one for --font-playfair, one for --font-inter).

    3. Confirm no Google Fonts CDN link tag exists anywhere:
       ```
       grep -r "fonts.googleapis.com" src/ astro.config.mjs
       grep -r "fonts.gstatic.com" src/ astro.config.mjs
       ```
       Expected: Both return no output.

    4. Confirm Font is imported from astro:assets in Layout.astro:
       ```
       grep 'from "astro:assets"' src/layouts/Layout.astro
       ```
       Expected: Returns a match containing `Font`.

    If any check fails, fix the issue:
    - If `fontProviders.google()` is missing: add Fonts API config to `astro.config.mjs` per the pattern already confirmed in the discuss-phase (it already exists — this should not fail).
    - If Google CDN link exists: remove it and ensure Font components are present.
  </action>
  <verify>
    <automated>grep -r "fonts.googleapis.com" /home/mauricio/gpus/src/ /home/mauricio/gpus/astro.config.mjs; echo "CDN check exit: $?"</automated>
  </verify>
  <acceptance_criteria>
    - `grep "fontProviders.google" astro.config.mjs` returns at least 2 matches (one for each font)
    - `grep 'Font cssVariable' src/layouts/Layout.astro` returns exactly 2 matches
    - `grep -r "fonts.googleapis.com" src/ astro.config.mjs` returns no output
    - `grep -r "fonts.gstatic.com" src/ astro.config.mjs` returns no output
    - `grep 'from "astro:assets"' src/layouts/Layout.astro` returns a match
  </acceptance_criteria>
  <done>Fonts API confirmed complete. Playfair Display and Inter are self-hosted via fontProviders.google(). No Google CDN link exists. TECH-02 requirement verified.</done>
</task>

<task type="auto">
  <name>Task 3: Verify TECH-04 — 404 page exists with correct Navy/Gold branding (per D-02)</name>
  <files></files>
  <read_first>
    - src/pages/404.astro — Read the full file to confirm Navy/Gold branding (text-gold, font-serif, Layout usage) and links to home ("/") and /contato.
  </read_first>
  <action>
    This is a verification-only task. Do NOT modify any files.

    Run these checks to confirm TECH-04 is complete:

    1. Confirm the file exists:
       ```
       ls src/pages/404.astro
       ```
       Expected: File listed.

    2. Confirm Navy/Gold branding classes:
       ```
       grep "text-gold" src/pages/404.astro
       grep "font-serif" src/pages/404.astro
       ```
       Expected: Both return matches.

    3. Confirm it uses the Layout:
       ```
       grep 'Layout' src/pages/404.astro
       ```
       Expected: Returns a match for the import and usage.

    4. Confirm links to home and contact:
       ```
       grep 'href="/"' src/pages/404.astro
       grep 'href="/contato"' src/pages/404.astro
       ```
       Expected: Both return matches.

    5. Confirm the "404" text is present (not just a generic error page):
       ```
       grep '404' src/pages/404.astro
       ```
       Expected: Returns matches.

    If any check fails, fix the issue by updating src/pages/404.astro with the correct content.
  </action>
  <verify>
    <automated>ls /home/mauricio/gpus/src/pages/404.astro && grep "text-gold" /home/mauricio/gpus/src/pages/404.astro</automated>
  </verify>
  <acceptance_criteria>
    - `ls src/pages/404.astro` exits 0 (file exists)
    - `grep "text-gold" src/pages/404.astro` returns at least 1 match
    - `grep "font-serif" src/pages/404.astro` returns at least 1 match
    - `grep 'href="/"' src/pages/404.astro` returns a match (link to home)
    - `grep 'href="/contato"' src/pages/404.astro` returns a match (link to contact)
    - `grep "Layout" src/pages/404.astro` returns matches for both import and component usage
  </acceptance_criteria>
  <done>404 page confirmed complete. Uses Layout with Navy/Gold branding, displays "404" in gold Playfair Display, and provides links to home and /contato. TECH-04 requirement verified.</done>
</task>

<task type="auto">
  <name>Task 4: Run build gates</name>
  <files></files>
  <read_first>
    No files to read — this task runs build commands only.
  </read_first>
  <action>
    Run the following commands in order. Each must succeed (exit code 0) before proceeding to the next.

    1. `bun run lint` — Biome format + lint + oxlint. Must pass with 0 errors.
    2. `bunx astro check` — TypeScript type checking. Must pass with 0 errors.
    3. `bun run build` — Full static site build. Must produce `dist/` with 0 errors.

    If lint fails due to the favicon.svg change (SVG files are not linted by Biome/oxlint), ignore that warning — SVG is not in the lint scope (`src/**` only).

    If any build gate fails, investigate and fix before marking this task done.
  </action>
  <verify>
    <automated>cd /home/mauricio/gpus && bun run lint && bunx astro check && bun run build</automated>
  </verify>
  <acceptance_criteria>
    - `bun run lint` exits with code 0
    - `bunx astro check` exits with code 0
    - `bun run build` exits with code 0
    - `dist/` directory exists after build
  </acceptance_criteria>
  <done>All three build gates pass. TECH-02, TECH-04, TECH-05 requirements are all verified/satisfied.</done>
</task>

</tasks>

<verification>
Summary verification commands:

```bash
# Favicon fix
grep "#d4af37" public/favicon.svg   # must return 6 lines
grep "#C9A96E" public/favicon.svg   # must return nothing

# Fonts API (no CDN)
grep -r "fonts.googleapis.com" src/ astro.config.mjs   # must return nothing
grep "fontProviders.google" astro.config.mjs             # must return matches

# 404 page
ls src/pages/404.astro                  # must exist
grep "text-gold" src/pages/404.astro    # must have match

# Build gates
bun run lint
bunx astro check
bun run build
```
</verification>

<success_criteria>
- `public/favicon.svg` uses `#d4af37` for all 6 color attributes, zero `#C9A96E` remaining
- No Google Fonts CDN link exists anywhere in `src/` or `astro.config.mjs`
- `src/pages/404.astro` exists with Navy/Gold branding and links to home and /contato
- All three build gates pass with exit code 0
- TECH-02: verified complete
- TECH-04: verified complete
- TECH-05: fix applied and confirmed
</success_criteria>

<output>
After completion, create `.planning/phases/01-technical-debt-and-foundation/01-1.2-SUMMARY.md` with:
- Favicon fix confirmation (before/after color)
- TECH-02 verification result (grep outputs confirming no CDN)
- TECH-04 verification result (file exists, branding confirmed)
- Build gate results
</output>
