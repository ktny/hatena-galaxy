import { json, type RequestHandler } from "@sveltejs/kit";
import { BookmarkStarGatherer } from "$lib/server/bookmarkStarGatherer";
import { loadingGatheres } from "$lib/server/gathers";

// TODO: usernameごとにしないといけない
let gatherer: BookmarkStarGatherer;

export const GET: RequestHandler = async ({ url }) => {
    const username = url.searchParams.get("username") ?? "";
    gatherer = new BookmarkStarGatherer(username);
    loadingGatheres.add(username);

    const bookmarkerData = await gatherer.main();

    loadingGatheres.delete(username);

    return json({ ...bookmarkerData });
};

export const OPTIONS: RequestHandler = () => {
    if (!gatherer) {
        return json({ progress: 1 });
    }
    const data = gatherer.getInProgressBookmarkerData();
    return json({ ...data });
};
