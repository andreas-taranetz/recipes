import type { APIContext, GetStaticPaths } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";

export const prerender = true;

export const getStaticPaths = (async () => {
	const recipes = await getCollection("recipes");

	return recipes.map((recipe) => ({
		params: { id: recipe.id },
		props: { recipe },
	}));
}) satisfies GetStaticPaths;

export function GET({ props }: APIContext & { props: { recipe: CollectionEntry<"recipes"> } }) {
	const { recipe } = props;

	const data = {
		id: recipe.id,
		title: recipe.data.title,
		ingredients: recipe.data.ingredients,
		steps: recipe.data.steps,
	};

	return new Response(JSON.stringify(data, null, "\t"), {
		headers: { "Content-Type": "application/json" },
	});
}
