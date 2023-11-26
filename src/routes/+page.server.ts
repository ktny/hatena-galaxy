import type { PageServerLoad, Actions } from "./$types";
// import { username } from "./stores";
import { BookmarkStarGatherer } from "./bookmarkStarGatherer";
import type { IBookmark } from "./bookmarkStarGatherer";

let bookmarks: IBookmark[] = [];

export const load = (() => {
    return {
        // username: ""
        bookmarks
    };
}) satisfies PageServerLoad;

export const actions = {
    gatherBookmarks: async ({ request }) => {
        const data = await request.formData();
        const username = data.get("username");

        console.log(username);

        const gatherer = new BookmarkStarGatherer(username as string);
        bookmarks = await gatherer.main();
    }
} satisfies Actions;
