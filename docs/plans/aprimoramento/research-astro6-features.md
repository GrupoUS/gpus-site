# Research: Astro 6 Features for GPUS Site Improvement

## Astro 6 Fonts API (Self-Hosting)
- Configure in `astro.config.mjs` via `fonts` option
- Import `fontProviders` from `astro/config`
- Use `fontProviders.google()` for Google Fonts (auto-downloads and self-hosts)
- Use `<Font cssVariable="--font-xxx" />` in Layout head
- Register in Tailwind via `@theme inline { --font-sans: var(--font-inter); }`
- Replaces Google Fonts CDN link (removes third-party dependency, improves privacy + performance)

### Example Config:
```js
import { defineConfig, fontProviders } from "astro/config";
export default defineConfig({
  fonts: [
    {
      name: "Playfair Display",
      cssVariable: "--font-playfair",
      provider: fontProviders.google(),
      weights: [400, 600, 700],
      styles: ["normal"],
    },
    {
      name: "Inter",
      cssVariable: "--font-inter",
      provider: fontProviders.google(),
      weights: [300, 400, 500, 600, 700],
      styles: ["normal"],
    },
  ],
});
```

## View Transitions (ClientRouter)
- Import `<ClientRouter />` from `astro:transitions`
- Add to Layout head for SPA-like page transitions
- Works with `transition:animate` directive on elements
- Built-in animations: fade, slide, morph
- Custom animations possible with CSS

## Framer Motion in Astro
- Use `client:visible` for scroll-triggered animations
- Works well for: carousels, counters, modals, tabs
- Reddit confirms: works but needs `client:` directive
- Alternative: tailwind-motion for simpler animations

## 2026 Web Design Trends (Figma, Adobe, Wix)
- 3D and immersive elements
- Glassmorphism/Liquid Glass effects
- Bold typography with exaggerated hierarchy
- Micro-interactions and tactile feedback
- Nature-inspired gradients
- Minimalist but with depth (shadows, layers)
