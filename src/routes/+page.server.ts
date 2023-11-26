import type { PageServerLoad, Actions } from "./$types";
// import { BookmarkStarGatherer } from "./bookmarkStarGatherer";
// import type { IBookmark } from "./bookmarkStarGatherer";
import { goto } from "$app/navigation";
// import { username } from "./stores";

// let bookmarks: IBookmark[] = [];

export const load = (() => {
    return {
        // username: ""
        // bookmarks
    };
}) satisfies PageServerLoad;

export const actions = {
    // gatherBookmarks: async ({ request }) => {
    //     const data = await request.formData();
    //     const username = data.get("username");
    //     goto(`/${username}/`);
    // }
    // gatherBookmarks: async ({ request }) => {
    //     const data = await request.formData();
    //     const username = data.get("username");
    //     console.log(username);
    //     const gatherer = new BookmarkStarGatherer(username as string);
    //     bookmarks = await gatherer.main();
    // }
} satisfies Actions;
