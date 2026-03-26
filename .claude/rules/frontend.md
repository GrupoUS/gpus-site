# Path rules: `src/components/`, `src/pages/`, `src/styles/`

SSOT: root `AGENTS.md`, `.claude/CLAUDE.md`. **Actionable gates only** — see also `.claude/rules/a11y.md` for a11y detail.

- **Icons:** Lucide React SVG only — never emojis as UI icons.
- **Motion:** Use `transform` / `opacity` only for layout-affecting cases — not `width`/`height`/`top`/`left` tweens.
- **FAQ accordion:** CSS grid `grid-template-rows: 0fr` → `1fr` — not Framer Motion height tween.
- **Islands:** Any new `client:*` needs explicit justification; prefer `client:visible` below the fold.
- **Tailwind v4:** `@theme` tokens (`navy`, `gold`, `text-primary`, semantic `bg-background`, etc.) — no arbitrary hex (`bg-[#...]`) unless documented exception.
- **Images:** Astro `<Image />` with explicit `width`/`height`; LCP hero: `loading="eager"` + `fetchpriority="high"`.
- **Infinite motion on mobile:** `global.css` disables infinite keyframes for `.gold-pulse-glow` / `.float-gentle` at `max-width: 768px` — keep new infinite loops consistent or gated the same way.
- **Approved utilities:** `glass-card`, `gold-glow`, `card-hover-lift`, `gold-pulse-glow`, `float-gentle` — extend the design system via `@theme` / `@utility`, not one-off hex.
