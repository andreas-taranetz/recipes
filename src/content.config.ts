import { glob } from "astro/loaders";
import { defineCollection, getEntry, z } from "astro:content";
import { literal } from "astro:schema";

const recipes = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/recipes" }),
	schema: ({ image }) =>
		z
			.object({
				title: z.string().nonempty().trim(),
				image: image().optional(),
				imageAlt: z.string().trim().optional(),
				ingredients: z.array(z.string().nonempty().trim()).nonempty(),
				steps: z.array(z.string().nonempty().trim()),
			})
			.refine(
				(data) => {
					// imageAlt is required only when an image is provided
					return data.image ? !!data.imageAlt : true;
				},
				{
					message: "imageAlt is required when image is provided",
					path: ["imageAlt"],
				},
			),
});

export const collections = {
	recipes,
};
