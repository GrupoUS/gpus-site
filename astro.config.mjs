// @ts-check

import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	site: "https://grupous.com.br",
	// Manter destinos alinhados a `externalSiteUrl` em na-mesa-certa.json e otb.json
	redirects: {
		"/na-mesa-certa": "https://namesacerta.com.br/",
		"/otb": "https://ota-dubai.lovable.app/",
	},
	integrations: [
		react(),
		sitemap({
			filter: (page) => {
				try {
					const pathname = new URL(page).pathname.replace(/\/$/, "") || "/";
					if (pathname === "/na-mesa-certa" || pathname === "/otb") {
						return false;
					}
				} catch {
					/* keep page */
				}
				return true;
			},
		}),
	],
	vite: {
		plugins: [tailwindcss()],
	},
});
