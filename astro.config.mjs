// @ts-check

import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";

const redirectTargets = {
	"/na-mesa-certa": "https://namesa.gpus.com.br/",
	"/otb": "https://otb.gpus.com.br/",
	"/trintae3": "https://trintae3.drasacha.com.br/",
	"/comunidade-us": "https://drasacha.com.br/pagina-de-inscricao-comu-us/",
	"/neon-dash": "https://neondash.com.br/",
};

// #region agent log
void fetch(
	"http://127.0.0.1:7777/ingest/0a9ce74c-a29a-4996-bf5d-a24a8b2822f7",
	{
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"X-Debug-Session-Id": "5db282",
		},
		body: JSON.stringify({
			sessionId: "5db282",
			runId: "initial",
			hypothesisId: "H1",
			location: "astro.config.mjs:9",
			message: "Astro redirect targets loaded",
			data: redirectTargets,
			timestamp: Date.now(),
		}),
	},
).catch(() => {});
// #endregion

// https://astro.build/config
export default defineConfig({
	site: "https://grupous.com.br",
	// Manter destinos alinhados a `externalSiteUrl` nos JSON dos produtos com funil externo
	redirects: redirectTargets,
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
	integrations: [
		react(),
		sitemap({
			filter: (page) => {
				try {
					const pathname = new URL(page).pathname.replace(/\/$/, "") || "/";
					if (
						pathname === "/na-mesa-certa" ||
						pathname === "/otb" ||
						pathname === "/trintae3" ||
						pathname === "/comunidade-us" ||
						pathname === "/neon-dash"
					) {
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
