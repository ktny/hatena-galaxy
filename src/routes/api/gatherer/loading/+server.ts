import { json, type RequestHandler } from "@sveltejs/kit";
import { loadingGatheres } from "$lib/server/gathers";

export const GET: RequestHandler = async ({ url }) => {
    const username = url.searchParams.get("username") ?? "";
    const isLoading = loadingGatheres.has(username);

    return json(isLoading);
};
