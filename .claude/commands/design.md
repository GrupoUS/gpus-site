---
description: Canonical design workflow. Phase 0 (design system + Stitch prototype) → Phase 1 (convert to Astro) → Phase 2 (validate). Uses ui-ux-pro-max CLI for spec generation and Stitch MCP for visual prototyping.
---

# /design — Design Workflow

**ARGUMENTS**: $ARGUMENTS

> Orchestration-only. Design intelligence from `ui-ux-pro-max` skill. Theme tokens from `gpus-theme` skill. Visual prototypes from Stitch MCP.

---

## 0. ASSESS COMPLEXITY

| Complexity | Pattern            | When                         |
| ---------- | ------------------ | ---------------------------- |
| **L1-L2**  | Direct code        | Bug fix, simple tweak        |
| **L3**     | Single agent (bg)  | Component, known pattern     |
| **L4-L5**  | Multiple subagents | New feature, multi-component |
| **L6+**    | Agent Team         | Full page, complex UX        |

---

## Design Tool Chain

```
Phase 0A: ui-ux-pro-max CLI (--design-system)
            → Style, palette, fonts, layout spec with reasoning rules
              ↓
Phase 0B: Stitch MCP (generate_screen_from_text)
            → Visual HTML prototype (desktop + mobile)
            → generate_variants for alternative layouts
              ↓
Phase 1:  frontend-specialist + Skill("astro") + Skill("gpus-theme")
            → Deep Design Thinking + Design Commitment block
            → Convert Stitch prototype to Astro components + React Islands
            → Use `astro` skill references for correct patterns
              ↓
Phase 2:  frontend-specialist (continues)
            → UX Quality + Visual Quality + Code Quality validation
            → bunx astro check && bun run build
```

**Key rules:**
- `ui-ux-pro-max` generates the *design system spec* (Phase 0A)
- Stitch MCP generates *visual prototypes* (Phase 0B)
- `gpus-theme` drives the *implementation tokens* (Phase 1)
- They never swap phases

---

## PHASE 0A: Design System Generation (MANDATORY — L3+)

**Before ANY implementation**, generate a design system using the `ui-ux-pro-max` CLI.

> **Skip only for:** Bug fixes (L1-L2) or trivial CSS tweaks.

### Step 1: Generate Design System

```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "premium institutional landing page aesthetic medicine luxury" --design-system -p "Grupo US"
```

This returns: style recommendation, color palette, typography pairing, layout pattern, effects, and anti-patterns — all with reasoning from the `ui-reasoning.csv` database.

### Step 2: Supplement with Domain Searches (as needed)

```bash
# Style deep-dive
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "luxury premium dark" --domain style

# Landing page structure
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "hero social-proof cta urgency" --domain landing

# Color palette options
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "luxury premium gold dark" --domain color

# Typography pairings
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "elegant serif luxury" --domain typography

# UX guidelines for animations
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "animation accessibility reduced-motion" --domain ux

# Astro stack best practices
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "astro islands performance" --stack astro
```

### Step 3: Override with GPUS Tokens

The design system output suggests palettes — but GPUS tokens are **immutable and always override**:

| Design System Suggests | GPUS Override |
|----------------------|---------------|
| Any background color | `--color-navy` (#1a1a2e) |
| Any primary/CTA color | `--color-gold` (#D4AF37) |
| Any text color | `--color-text-primary` (#FAFAF9) |
| Any muted text | `--color-text-muted` (#94A3B8) |
| Any font pairing | Playfair Display (headings) + Inter (body) |

### Output: Design Spec Document

Structure the spec for handoff to frontend-specialist:

```markdown
## Design Spec: [Component/Section Name]

### Style: [from --design-system output]
### Palette: GPUS Navy + Gold (overrides --design-system palette)
### Typography: Playfair Display + Inter (overrides --design-system fonts)
### Layout: [from --design-system + --domain landing]
### Animation: [from --domain ux] — Framer Motion, prefers-reduced-motion mandatory
### Anti-Patterns: [from --design-system reasoning rules]
### UX Checklist: [Priority 1-3 from SKILL.md Quick Reference]
```

---

## PHASE 0B: Stitch Visual Prototype (L4+ / New Pages)

**When:** New pages, full section redesigns, complex layouts.
**Skip:** Simple components, bug fixes, incremental changes.

### Step 1: Create or Use Stitch Project

```typescript
// Create project (first time only)
mcp__stitch__create_project({ title: "Na Mesa Certa" });
// → Returns project ID for all subsequent calls

// Or list existing projects
mcp__stitch__list_projects({});
```

### Step 2: Generate Screen from Design Spec

Write a detailed prompt incorporating the design spec from Phase 0A:

```typescript
mcp__stitch__generate_screen_from_text({
  projectId: "<project-id>",
  deviceType: "DESKTOP",
  modelId: "GEMINI_3_PRO",
  prompt: `Premium event landing page section: [SECTION NAME]

Design System:
- Style: [from Phase 0A]
- Dark navy background (#1a1a2e), gold accents (#D4AF37)
- Playfair Display for headings, Inter for body text
- White text (#FAFAF9) for readability, muted (#94A3B8) for secondary

Content:
- [Exact content for this section — headlines, descriptions, CTAs]
- [Data structure: speakers, testimonials, FAQs]

Layout Requirements:
- [Specific layout from design spec — e.g., asymmetric grid, overlapping elements]
- Mobile-first responsive
- Scroll-triggered stagger animations (indicate with visual cues)

UX Requirements:
- Touch targets >= 44px
- Clear visual hierarchy
- Gold glow CTAs with hover states
- Glassmorphism cards with navy-light background`
});
```

> **IMPORTANT:** Stitch generation takes a few minutes. Do NOT retry if it seems slow.

### Step 3: Generate Mobile Variant

```typescript
mcp__stitch__generate_screen_from_text({
  projectId: "<project-id>",
  deviceType: "MOBILE",
  modelId: "GEMINI_3_PRO",
  prompt: `Mobile version of [SECTION NAME] — same design system, adapted for 375px width.
  Stack navigation, larger touch targets, simplified layout.`
});
```

### Step 4: Generate Design Variants (Optional — L5+)

When exploring alternative layouts:

```typescript
mcp__stitch__generate_variants({
  projectId: "<project-id>",
  selectedScreenIds: ["<screen-id>"],
  prompt: "Alternative layout for this section with more asymmetry and bolder typography",
  variantOptions: {
    variantCount: 3,
    creativeRange: "EXPLORE",  // REFINE | EXPLORE | REIMAGINE
    aspects: ["LAYOUT", "COLOR_SCHEME"]
  }
});
```

| Creative Range | When to Use |
|---------------|-------------|
| `REFINE` | Polish existing — subtle spacing/color tweaks |
| `EXPLORE` | Default — balanced alternatives |
| `REIMAGINE` | Radical rethink — break assumptions |

### Step 5: Retrieve and Review

```typescript
// List all screens in project
mcp__stitch__list_screens({ projectId: "<project-id>" });

// Get specific screen HTML
mcp__stitch__get_screen({
  name: "projects/<project-id>/screens/<screen-id>",
  projectId: "<project-id>",
  screenId: "<screen-id>"
});
```

### Step 6: Iterate with Edits

```typescript
mcp__stitch__edit_screens({
  projectId: "<project-id>",
  selectedScreenIds: ["<screen-id>"],
  prompt: "Make the hero headline larger and more asymmetric. Add gold gradient to CTA buttons."
});
```

---

## 1. Agent Selection

| Task Type              | Agent                 | Background?   |
| ---------------------- | --------------------- | ------------- |
| Component              | frontend-specialist   | **YES**       |
| New page               | frontend-specialist   | **YES**       |
| Accessibility test     | debugger              | Yes           |
| Performance review     | performance-optimizer | Yes           |
| SEO meta               | performance-optimizer | Yes           |
| **Multi-review (L5+)** | Multiple agents       | **YES**       |

> **Rule:** `frontend-specialist` ALWAYS runs as `run_in_background: true` to preserve orchestrator memory.

---

## 2. Execution Patterns

### Pattern 1: L1-L2 — Direct (Bug Fix / Tweak)

```
Simple tweak → Fix directly (skip Phase 0, no background agent)
```

### Pattern 2: L3 — Design System + Single Agent (Background)

```typescript
// Phase 0A: Design system (run in main agent — fast CLI call)
Bash("python3 .claude/skills/ui-ux-pro-max/scripts/search.py 'premium institutional luxury' --design-system -p 'Grupo US'");

// Phase 1: Implement (background)
Task({
  subagent_type: "frontend-specialist",
  prompt: `Implement [task].

## Design System (from ui-ux-pro-max)
[paste --design-system output]

## Instructions
1. Invoke Skill("gpus-theme") — FIRST action before any code
2. GPUS tokens override any palette from design system
3. Use Astro components for static, React Islands only for interactivity
4. Content Collections (getCollection) for data — never hardcode
5. Framer Motion animations with prefers-reduced-motion support
6. Run: bunx astro check && bun run build before marking complete`,
  run_in_background: true,
});
```

### Pattern 3: L4-L5 — Design System + Stitch Prototype + Multiple Agents

```typescript
// Phase 0A: Design system (foreground — fast)
Bash("python3 .claude/skills/ui-ux-pro-max/scripts/search.py '[keywords]' --design-system -p 'Grupo US'");

// Phase 0B: Stitch prototype (foreground — wait for result)
mcp__stitch__generate_screen_from_text({
  projectId: "<id>",
  deviceType: "DESKTOP",
  modelId: "GEMINI_3_PRO",
  prompt: "[detailed prompt from design spec]"
});

// Phase 1: Implementation + Reviews in PARALLEL (all background)
Task({
  subagent_type: "frontend-specialist",
  name: "design-main",
  prompt: `Convert Stitch prototype to Astro + React Islands.

## Design System
[paste --design-system output]

## Stitch Prototype Reference
[paste screen HTML or describe the layout]

## Instructions
1. Invoke Skill("gpus-theme") FIRST
2. Convert HTML structure to Astro components
3. Replace inline styles with Tailwind utilities + GPUS tokens
4. Add Framer Motion animations (scroll-triggered stagger + spring)
5. Content Collections for all data
6. Only 3 React Islands: CountdownTimer, FAQAccordion, Testimonials`,
  run_in_background: true,
});

Task({
  subagent_type: "debugger",
  name: "a11y-review",
  prompt: "Review [feature] for accessibility: WCAG AA, contrast 4.5:1, keyboard nav, prefers-reduced-motion",
  run_in_background: true,
});

Task({
  subagent_type: "performance-optimizer",
  name: "perf-review",
  prompt: "Review [feature] for performance: Lighthouse 95+, LCP < 2.5s, CLS = 0, bundle size",
  run_in_background: true,
});
```

### Pattern 4: L6+ — Agent Team

```typescript
// Phase 0A + 0B in foreground (design system + Stitch)
// Then create team for complex coordination

TeamCreate({ team_name: "design-{slug}" });

TaskCreate({ subject: "Convert Stitch to Astro components", owner: "frontend-specialist" });
TaskCreate({ subject: "Accessibility audit (WCAG AA)", owner: "debugger" });
TaskCreate({ subject: "Performance audit (Lighthouse 95+)", owner: "performance-optimizer" });

// Assign and enter delegate mode (Shift+Tab)
```

---

## 3. Skills & Tools

```yaml
Phase 0A (Design System):
  - ui-ux-pro-max     # CLI: --design-system, --domain, --stack
    # 50+ styles, 161 palettes, 57 font pairings, 161 products, 99 UX rules
    # Domains: product, style, color, typography, landing, chart, ux, google-fonts, web, react, prompt
    # Stacks: astro, react, html-tailwind, and 10 more

Phase 0B (Visual Prototype):
  - Stitch MCP         # generate_screen_from_text, generate_variants, edit_screens, get_screen
    # Use for: new pages, section layouts, mobile variants, design exploration

Phase 1 (Implementation):
  - astro              # Astro 6 patterns: components, islands, Content Collections, styling
  - gpus-theme         # GPUS Navy+Gold tokens, .glass-card, .bg-mesh, .bg-noise
  - debugger           # Frontend debug pack + diagnostic gates

Phase 2 (Validation):
  - performance-optimization  # Core Web Vitals + Lighthouse 95+
```

---

## 4. Phase 1 — Convert to Astro + React Islands

**frontend-specialist must invoke `Skill("astro")` + `Skill("gpus-theme")` BEFORE writing any code.**

### Step 1: Load Skills

```
Skill("astro")       # Astro 6 patterns — components, islands, Content Collections, styling, config
Skill("gpus-theme")  # GPUS Navy+Gold tokens
```

### Step 2: Implement (following `astro` skill patterns)

**Astro Component Architecture:**
1. Break into `.astro` components (max ~150 lines) — zero JS by default
2. Use Astro frontmatter (`---`) for server-side data fetching and logic
3. Content Collections via `getCollection()` — map to `.data` for React island props
4. `<slot />` for component composition, named slots for multi-region layouts
5. `class:list` for conditional styling, `define:vars` for server→CSS bridge

**React Islands (strict rules from `astro` skill → islands-architecture.md):**
6. React Islands only for Aceternity UI visual effects (`src/components/ui/*.tsx`) — AuroraBackground, Spotlight, BackgroundBeams, TextGenerateEffect, LampBackdrop. Use `client:load` for hero effects, `client:visible` for below-fold effects.
7. `client:*` directives ONLY on `.tsx` components — NEVER on `.astro`
8. Props must be serializable plain objects (no functions, Dates, class instances)

**Styling (from `astro` skill → styling-tailwind.md):**
9. Tailwind v4 `@theme` tokens — never hardcode hex values
10. Map ALL colors to GPUS tokens (bg-navy, text-gold, text-text-primary, text-text-muted)
11. Use `@utility` for custom utilities (glass-card, gold-glow, bg-mesh)

**Animations & UX:**
12. Framer Motion: only `transform`/`opacity` animations (never width/height/top/left)
13. Scroll-triggered entrance animations (staggered 30-50ms per item, spring physics)
14. `prefers-reduced-motion` mandatory — `useReducedMotion()` hook
15. Lucide React for all icons — never use emojis as UI icons
16. TypeScript interfaces for all props

If a Stitch prototype exists, use it as the **structural reference**:
- Extract layout topology (grid structure, alignment, spacing)
- Replace inline styles with Tailwind utilities
- Replace placeholder images with Astro `<Image />` components
- Replace any scripts with Astro Islands or pure CSS

---

## 5. Phase 2 — Validate

### UX Quality (from ui-ux-pro-max Priority 1-3)

- [ ] Color contrast >= 4.5:1 (Priority 1: Accessibility)
- [ ] Touch targets >= 44px, 8px+ spacing (Priority 2: Touch)
- [ ] Images: WebP/AVIF, explicit width/height, lazy load below fold (Priority 3: Performance)
- [ ] Loading states for React Islands
- [ ] Keyboard navigation functional
- [ ] Focus visible with gold outline
- [ ] `prefers-reduced-motion` disables all animations

### Visual Quality

- [ ] GPUS tokens only (no hardcoded hex)
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] Playfair Display + Inter font pairing consistent
- [ ] Animations use only `transform` and `opacity` (never width/height/top/left)

### Code Quality

- [ ] Astro components for static, React Islands for interactive only
- [ ] Content Collections for all data
- [ ] `bunx astro check` passes
- [ ] `bun run build` succeeds

---

## 6. Decision Tree

```
START: /design [task]

├── Is it a BUG FIX or trivial tweak?
│     └── YES → Direct fix (skip Phase 0)
│
├── Phase 0A: ALWAYS (L3+)
│     └── python3 ui-ux-pro-max --design-system → spec
│
├── Phase 0B: NEW PAGE or SECTION? (L4+)
│     ├── YES → Stitch MCP → generate_screen_from_text (desktop + mobile)
│     │         → generate_variants if exploring layouts
│     └── NO  → Skip Stitch, go to Phase 1
│
├── Phase 1: frontend-specialist (run_in_background: true)
│     → Invoke gpus-theme FIRST
│     → Convert Stitch prototype (if exists) or implement from spec
│
├── Need MULTIPLE REVIEWS?
│     ├── YES → Parallel: frontend-specialist + debugger + performance-optimizer
│     └── NO  → Single frontend-specialist
│
└── Is it L6+ (complex)?
      └── YES → Agent Team (after Phase 0A + 0B)
```

---

## Anti-Patterns

| Don't                                             | Do                                                            |
| ------------------------------------------------- | ------------------------------------------------------------- |
| Skip Phase 0A for L3+ tasks                       | Always run `--design-system` first                            |
| Use ui-ux-pro-max inside frontend-specialist       | ui-ux-pro-max is Phase 0A only (explorer or main agent)       |
| Use gpus-theme in Phase 0                          | gpus-theme is Phase 1 only (frontend-specialist)              |
| Skip Stitch for new pages                          | Always prototype new pages via Stitch MCP                     |
| Retry Stitch if slow                               | Wait — generation takes minutes. Use get_screen later         |
| Hardcode colors                                    | Use GPUS tokens                                               |
| Hardcode content in components                     | Use Content Collections (getCollection)                       |
| Add interactive React Islands                       | Only Aceternity UI visual effects in src/components/ui/       |
| Use emojis as UI icons                             | Lucide React SVG icons only                                   |
| Animate width/height/top/left                      | transform + opacity only                                      |
| Skip a11y validation                               | Run ui-ux-pro-max Priority 1-3 checks                        |
| Run frontend-specialist in foreground              | Always use run_in_background: true                            |

---

## ui-ux-pro-max Quick Reference

### Available Domains

| Domain | Use For | Example Keywords |
|--------|---------|------------------|
| `product` | Product type recommendations | event, service, beauty, healthcare, luxury |
| `style` | UI styles, visual effects | luxury, dark mode, minimalism, premium |
| `color` | Color palettes by type | luxury, gold, dark, premium, beauty |
| `typography` | Font pairings | elegant, serif, luxury, professional |
| `landing` | Page structure, CTA strategies | hero, social-proof, urgency, testimonial |
| `ux` | Best practices, anti-patterns | animation, accessibility, reduced-motion |
| `google-fonts` | Individual fonts lookup | serif, display, elegant, variable |
| `web` | App interface guidelines | touch targets, safe areas, accessibility |
| `prompt` | AI prompts, CSS keywords | (style name) |

### Available Stacks

| Stack | Focus |
|-------|-------|
| `astro` | Islands, Content Collections, SSG, Image |
| `react` | Hooks, memo, performance, state |
| `html-tailwind` | Utility-first, custom config, responsive |

---

## Stitch MCP Quick Reference

| Tool | When | Key Params |
|------|------|------------|
| `create_project` | First time setup | `title` |
| `generate_screen_from_text` | New page/section prototype | `projectId`, `prompt`, `deviceType`, `modelId` |
| `generate_variants` | Explore alternative layouts | `selectedScreenIds`, `variantOptions` (count, creativeRange, aspects) |
| `edit_screens` | Refine existing prototype | `selectedScreenIds`, `prompt` |
| `get_screen` | Download HTML for conversion | `name`, `projectId`, `screenId` |
| `list_screens` | Review all prototypes | `projectId` |

**Device types:** `DESKTOP`, `MOBILE`, `TABLET`
**Models:** `GEMINI_3_PRO` (higher quality), `GEMINI_3_FLASH` (faster)
**Creative ranges:** `REFINE` (subtle), `EXPLORE` (balanced), `REIMAGINE` (radical)

---

## References

- `.claude/skills/astro/SKILL.md` — **Astro 6 reference**: components, Content Collections, islands, styling, config, performance, troubleshooting
  - `references/core-concepts.md` — Components, props, slots, pages, layouts, scripts
  - `references/content-collections.md` — getCollection, getEntry, data flow to React islands
  - `references/islands-architecture.md` — Client directives, hydration, server islands
  - `references/styling-tailwind.md` — Tailwind v4, @theme, class:list, scoped CSS
  - `references/performance.md` — Images, fonts, JS budget, Core Web Vitals
  - `references/view-transitions.md` — ClientRouter, transition directives
- `.claude/skills/ui-ux-pro-max/SKILL.md` — 50+ styles, 161 palettes, 57 font pairings, 99 UX rules (Phase 0A)
- `.claude/skills/gpus-theme/` — GPUS Navy+Gold tokens, custom utilities (Phase 1)
- `.claude/skills/debugger/SKILL.md` — Frontend debug pack + diagnostic gates
- `.claude/skills/performance-optimization/SKILL.md` — Core Web Vitals, Lighthouse
- Stitch MCP — Visual prototyping via `mcp__stitch__*` tools (Phase 0B)
