// import type { PageServerLoad } from "./$types";
// import { BookmarkStarGatherer } from "../bookmarkStarGatherer";
// import type { IBookmark } from "../bookmarkStarGatherer";

// let bookmarks: IBookmark[] = [];

// export const load = (async ({ params }) => {
//     const { username } = params;
//     const gatherer = new BookmarkStarGatherer(username as string);
//     bookmarks = await gatherer.main();

//     // console.log(page.subscribe((page) => console.log(page)));

//     return { bookmarks };
// }) satisfies PageServerLoad;
