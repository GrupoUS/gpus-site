import type { CollectionEntry } from "astro:content";

export type ProductNavLink = {
	label: string;
	href: string;
	/** Off-site product experience — open in new tab with noopener. */
	external?: boolean;
};

/** Short nav label: text before " — " if present, else full name. */
function navLabelFromName(name: string): string {
	const sep = " — ";
	const idx = name.indexOf(sep);
	return idx > 0 ? name.slice(0, idx) : name;
}

export function productNavLinksFromCollection(
	entries: CollectionEntry<"products">[],
): ProductNavLink[] {
	const links = [...entries]
		.sort((a, b) => a.data.order - b.data.order)
		.map((e) => {
			const external = Boolean(e.data.externalSiteUrl);
			return {
				label: navLabelFromName(e.data.name),
				href: e.data.externalSiteUrl ?? `/${e.data.slug}`,
				...(external ? { external: true as const } : {}),
			};
		});

	const trackedLinks = entries
		.filter((e) => e.data.slug === "na-mesa-certa" || e.data.slug === "otb")
		.map((e) => ({
			slug: e.data.slug,
			href: e.data.externalSiteUrl ?? `/${e.data.slug}`,
			external: Boolean(e.data.externalSiteUrl),
		}));

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
				hypothesisId: "H3",
				location: "src/lib/productsNav.ts:23",
				message: "Shared product nav links resolved",
				data: { links: trackedLinks },
				timestamp: Date.now(),
			}),
		},
	).catch(() => {});
	// #endregion

	return links;
}
