import { json, type RequestHandler } from "@sveltejs/kit";
import { BookmarkStarGatherer } from "../bookmarkStarGatherer";

let gatherer: BookmarkStarGatherer;

export const GET: RequestHandler = async ({ url }) => {
    const username = url.searchParams.get("username") ?? "";
    gatherer = new BookmarkStarGatherer(username);
    const bookmarkerData = await gatherer.main();
    return json({ ...bookmarkerData });
};

export const OPTIONS: RequestHandler = () => {
    if (!gatherer) {
        return json({ progress: 1 });
    }
    const progress = gatherer.getProgress();
    console.log(progress);
    return json({ progress });
};
