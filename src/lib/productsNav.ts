import type { CollectionEntry } from "astro:content";

/** Short nav label: text before " — " if present, else full name. */
function navLabelFromName(name: string): string {
	const sep = " — ";
	const idx = name.indexOf(sep);
	return idx > 0 ? name.slice(0, idx) : name;
}

export function productNavLinksFromCollection(
	entries: CollectionEntry<"products">[],
): { label: string; href: string }[] {
	return [...entries]
		.sort((a, b) => a.data.order - b.data.order)
		.map((e) => ({
			label: navLabelFromName(e.data.name),
			href: `/${e.data.slug}`,
		}));
}
