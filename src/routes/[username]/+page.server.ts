import type { PageServerLoad } from "./$types";
import { BookmarkStarGatherer } from "../bookmarkStarGatherer";
import type { IBookmark } from "../bookmarkStarGatherer";

let bookmarks: IBookmark[] = [];

export const load = (async ({ params }) => {
    const { username } = params;
    console.log(username);
    const gatherer = new BookmarkStarGatherer(username as string);
    bookmarks = await gatherer.main();

    return {
        username,
        bookmarks
    };
}) satisfies PageServerLoad;
