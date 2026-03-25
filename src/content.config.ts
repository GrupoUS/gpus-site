import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const products = defineCollection({
	loader: glob({ pattern: "**/*.json", base: "src/content/products" }),
	schema: z.object({
		name: z.string(),
		slug: z.string(),
		tagline: z.string(),
		description: z.string(),
		type: z.string(),
		audience: z.string(),
		icon: z.string(),
		image: z.string().optional(),
		/** When set, home grid and header/footer product links go here; /slug still 301-redirects via astro.config. */
		externalSiteUrl: z.string().url().optional(),
		order: z.number(),
		hero: z.object({
			headline: z.string(),
			subheadline: z.string(),
		}),
		painPoints: z
			.array(
				z.object({
					icon: z.string(),
					title: z.string(),
					description: z.string(),
				}),
			)
			.min(3),
		pillars: z
			.array(
				z.object({
					icon: z.string(),
					title: z.string(),
					description: z.string(),
				}),
			)
			.length(3),
		benefits: z.array(z.string()).min(4),
		differentials: z
			.array(
				z.object({
					title: z.string(),
					description: z.string(),
				}),
			)
			.min(2),
		faqs: z
			.array(
				z.object({
					question: z.string(),
					answer: z.string(),
				}),
			)
			.min(3),
		cta: z.object({
			label: z.string(),
			url: z.string().url(),
			whatsappMessage: z.string(),
			type: z.literal("primary"),
		}),
		testimonials: z
			.array(
				z.object({
					name: z.string(),
					role: z.string(),
					quote: z.string(),
				}),
			)
			.min(2),
	}),
});

const team = defineCollection({
	loader: glob({ pattern: "**/*.json", base: "src/content/team" }),
	schema: z.object({
		name: z.string(),
		role: z.string(),
		bio: z.string(),
		photo: z.string(),
		order: z.number(),
		social: z.object({
			instagram: z.string().url().optional(),
			linkedin: z.string().url().optional(),
			twitter: z.string().url().optional(),
		}),
	}),
});

export const collections = { products, team };
