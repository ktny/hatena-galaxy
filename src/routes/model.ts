export interface BookmarksPageResponse {
    item: { bookmarks: Bookmark[] };
    pager: any;
}

export interface Bookmark {
    created: string;
    user: any;
    entry: any;
    location_id: number;
    url: string;
    comment: string;
}

export interface IBookmark {
    title: string;
    bookmarkCount: number;
    category: string;
    url: string;
    comment: string;
    star: number;
}
