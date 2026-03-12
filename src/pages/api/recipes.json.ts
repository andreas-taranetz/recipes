import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const prerender = true;

export const GET: APIRoute = async () => {
	const recipes = await getCollection("recipes");
	recipes.sort((a, b) => a.data.title.localeCompare(b.data.title, "de"));

	const data = recipes.map((recipe) => ({
		id: recipe.id,
		title: recipe.data.title,
		url: `/api/recipes/${recipe.id}.json`,
	}));

	return new Response(JSON.stringify(data, null, "\t"), {
		headers: { "Content-Type": "application/json" },
	});
};
