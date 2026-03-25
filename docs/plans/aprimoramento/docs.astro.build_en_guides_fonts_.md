# Using custom fonts | Docs

**URL:** https://docs.astro.build/en/guides/fonts/

---

Skip to content
Search
GitHub
Discord
Select theme
Dark
Light
Auto
Select language
English
Deutsch
Português do Brasil
Español
简体中文
正體中文
Français
हिन्दी
العربية
日本語
한국어
Polski
Русский
Italiano
Start
Guides and recipes
Reference
Integrations
Third-party services
Routing and navigation
Pages
Routing
Endpoints
Middleware
Internationalization (i18n)
Prefetch
View transitions
Build your UI
Components
Layouts
Styles and CSS
Fonts
Syntax Highlighting
Scripts and event handling
Front-end frameworks
Add content to your site
Markdown
Content collections
Images
Data fetching
Astro DB
Server rendering
On-demand rendering
Server islands
Actions
Sessions
Upgrade
Upgrade Astro
Major upgrade guides
Troubleshooting
How-to recipes
Contribute to Astro
Sponsored by
On this page
Overview
Configuring custom fonts
Using a local font file
Using Fontsource
Applying custom fonts
Register fonts in Tailwind
Accessing font data programmatically
Granular font configuration
Caching
Examples
Learn Astro with James Q Quick

Build your first site with 35 interactive Scrimba lessons

Get 20% off
Using custom fonts

This guide will show you how to add web fonts to your project and use them in your components.

Astro provides a way to use fonts from your filesystem and various font providers (e.g. Fontsource, Google) through a unified, fully customizable, and type-safe API.

Web fonts can impact page performance at both load time and rendering time. This API helps you keep your site performant with automatic web font optimizations including preload links, optimized fallbacks, and opinionated defaults. See common usage examples.

The Fonts API focuses on performance and privacy by downloading and caching fonts so they’re served from your site. This can avoid sending user data to third-party sites, and also ensures that a consistent set of fonts is available to all your visitors.

Configuring custom fonts
Section titled “Configuring custom fonts”

Registering custom fonts for your Astro project is done through the fonts option in your Astro config.

For each font you want to use, you must specify its name, a CSS variable, and an Astro font provider.

Astro provides built-in support for the most popular font providers: Adobe, Bunny, Fontshare, Fontsource, Google, Google Icons and NPM, as well as for using your own local font files. Additionally, you can further customize your font configuration to optimize performance and visitor experience.

Using a local font file
Section titled “Using a local font file”

This example will demonstrate adding a custom font using the font file DistantGalaxy.woff2.

Add your font file inside the src/ directory, for example src/assets/fonts/.

Create a new font family in your Astro config file using the local font provider and specify the variants to be included:

astro.config.mjs
import { defineConfig, fontProviders } from "astro/config";


export default defineConfig({
  fonts: [{
    provider: fontProviders.local(),
    name: "DistantGalaxy",
    cssVariable: "--font-distant-galaxy",
    options: {
      variants: [{
        src: ['./src/assets/fonts/DistantGalaxy.woff2'],
        weight: 'normal',
        style: 'normal'
      }]
    }
  }]
});

Your font is now configured and ready to be added to your page head so that it can be used in your project.

Using Fontsource
Section titled “Using Fontsource”

Astro supports several font providers out of the box, including support for Fontsource that simplifies using Google Fonts and other open-source fonts.

The following example will use Fontsource to add custom font support, but the process is similar for any of Astro’s built-in font providers (e.g. Adobe, Bunny).

Find the font you want to use in Fontsource’s catalog. This example will use Roboto.

Create a new font family in your Astro config file using the Fontsource provider:

astro.config.mjs
import { defineConfig, fontProviders } from "astro/config";


export default defineConfig({
  fonts: [{
    provider: fontProviders.fontsource(),
    name: "Roboto",
    cssVariable: "--font-roboto",
  }]
});

Your font is now configured and ready to be added to your page head so that it can be used in your project.

Applying custom fonts
Section titled “Applying custom fonts”

After a font is configured, it must be added to your page head with an identifying CSS variable. Then, you can use this variable when defining your page styles.

Import and include the <Font /> component with the required cssVariable property in the head of your page, usually in a dedicated Head.astro component or in a layout component directly:

src/layouts/Layout.astro
---
import { Font } from "astro:assets";
---


<html>
  <head>
    <Font cssVariable="--font-distant-galaxy" />
  </head>
  <body>
    <slot />
  </body>
</html>

In any page rendered with that layout, including the layout component itself, you can now define styles with your font’s cssVariable to apply your custom font.

In the following example, the <h1> heading will have the custom font applied, while the paragraph <p> will not.

src/pages/example.astro
---
import Layout from "../layouts/Layout.astro";
---
<Layout>
  <h1>In a galaxy far, far away...</h1>


  <p>Custom fonts make my headings much cooler!</p>


  <style>
  h1 {
    font-family: var(--font-distant-galaxy);
  }
  </style>
</Layout>
Register fonts in Tailwind
Section titled “Register fonts in Tailwind”

If you are using Tailwind for styling, you will not apply your styles with the font-face CSS property.

Instead, after configuring your custom font and adding it to your page head, you will need to update your Tailwind configuration to register your font:

Tailwind CSS 4.0
Tailwind CSS 3.0
src/styles/global.css
@import "tailwindcss";


@theme inline {
  --font-sans: var(--font-roboto);
}

See Tailwind’s docs on adding custom font families for more information.

Accessing font data programmatically
Section titled “Accessing font data programmatically”

The fontData object allows you to retrieve lower-level font family data programmatically. For example, you can use it in an API Route to generate OpenGraph images using satori, combined with proper formats configuration:

src/pages/og.png.ts
import type{ APIRoute } from "astro";
import { fontData } from "astro:assets";
import satori from "satori";
import { html } from "satori-html";


export const GET: APIRoute = async (context) => {
  const data = fontData["--font-roboto"];


  const svg = await satori(
    html`<div style="color: black;">hello, world</div>`,
    {
      width: 600,
      height: 400,
      fonts: [
        {
          name: "Roboto",
          data: await fetch(
            new URL(data[0].src[0].url, context.url.origin),
          ).then((res) => res.arrayBuffer()),
          weight: 400,
          style: "normal",
        },
      ],
    },
  );


  // ...
}
Granular font configuration
Section titled “Granular font configuration”

A font family is defined by a combination of properties such as weights and styles (e.g. weights: [500, 600] and styles: ["normal", "bold"]), but you may want to download only certain combinations of these.

For greater control over which font files are downloaded, you can specify the same font (ie. with the same cssVariable, name, and provider properties) multiple times with different combinations. Astro will merge the results and download only the required files. For example, it is possible to download normal 500 and 600 while downloading only italic 500:

astro.config.mjs
import { defineConfig, fontProviders } from "astro/config";


export default defineConfig({
  fonts: [
    {
      name: "Roboto",
      cssVariable: "--roboto",
      provider: fontProviders.google(),
      weights: [500, 600],
      styles: ["normal"]
    },
    {
      name: "Roboto",
      cssVariable: "--roboto",
      provider: fontProviders.google(),
      weights: [500],
      styles: ["italic"]
    }
  ]
});
Caching
Section titled “Caching”

The Fonts API caching implementation was designed to be practical in development and efficient in production. During builds, font files are copied to the _astro/fonts output directory, so they can benefit from HTTP caching of static assets (usually a year).

To clear the cache in development, remove the .astro/fonts directory. To clear the build cache, remove the node_modules/.astro/fonts directory.

Examples
Section titled “Examples”

Astro’s font feature is based on flexible configuration options. Your own project’s font configuration may look different from simplified examples, so the following are provided to show what various font configurations might look like when used in production.

astro.config.mjs
import { defineConfig, fontProviders } from "astro/config";


export default defineConfig({
  fonts: [
    {
      name: "Roboto",
      cssVariable: "--font-roboto",
      provider: fontProviders.google(),
      // Default included:
      // weights: [400] ,
      // styles: ["normal", "italic"],
      // subsets: ["latin"],
      // fallbacks: ["sans-serif"],
      // formats: ["woff2"],
    },
    {
      name: "Inter",
      cssVariable: "--font-inter",
      provider: fontProviders.fontsource(),
      // Specify weights that are actually used
      weights: [400, 500, 600, 700],
      // Specify styles that are actually used
      styles: ["normal"],
      // Download only font files for characters used on the page
      subsets: ["latin", "cyrillic"],
      // Download more font formats
      formats: ["woff2", "woff"],
    },
    {
      name: "JetBrains Mono",
      cssVariable: "--font-jetbrains-mono",
      provider: fontProviders.fontsource(),
      // Download only font files for characters used on the page
      subsets: ["latin", "latin-ext"],
      // Use a fallback font family matching the intended appearance
      fallbacks: ["monospace"],
    },
    {
      name: "Poppins",
      cssVariable: "--font-poppins",
      provider: fontProviders.local(),
      options: {
        // Weight and style are not specified so Astro
        // will try to infer them for each variant
        variants: [
          {
            src: [
              "./src/assets/fonts/Poppins-regular.woff2",
              "./src/assets/fonts/Poppins-regular.woff",
            ]
          },
          {
            src: [
              "./src/assets/fonts/Poppins-bold.woff2",
              "./src/assets/fonts/Poppins-bold.woff",
            ]
          },
        ]
      }
    }
  ],
});
Edit page
Translate this page
Previous
Styles and CSS
Next
Syntax Highlighting
Contribute
Community
Sponsor