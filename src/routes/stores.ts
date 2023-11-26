import { writable, type Writable } from "svelte/store";
import type { IBookmark } from "./model";

interface BookmarkData {
    [key: string]: {
        bookmarks: IBookmark[];
    };
}

export const bookmarkData: Writable<BookmarkData> = writable({});
