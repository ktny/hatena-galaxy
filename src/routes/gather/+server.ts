import { json, type RequestHandler } from "@sveltejs/kit";
import { BookmarkStarGatherer } from "../bookmarkStarGatherer";

export const GET: RequestHandler = async ({ url }) => {
    const username = url.searchParams.get("username") ?? "";
    const gatherer = new BookmarkStarGatherer(username);
    const bookmarks = await gatherer.main();
    return json({ bookmarks });
};

// import type { PageServerLoad } from "./$types";
// import { BookmarkStarGatherer } from "../bookmarkStarGatherer";
// import type { IBookmark } from "../bookmarkStarGatherer";

// let bookmarks: IBookmark[] = [];

// export const load = (async ({ params }) => {
//     const { username } = params;
//     // const gatherer = new BookmarkStarGatherer(username as string);
//     bookmarks = await gatherer.main();

//     return { bookmarks };
// }) satisfies PageServerLoad;
