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
    canonical_url: string;
    comment: string;
}

export interface IBookmark {
    eid: number;
    title: string;
    bookmarkCount: number;
    category: string;
    entryURL: string;
    bookmarksURL: string;
    commentURL: string;
    bookmarkDate: string;
    comment: string;
    star: number;
}

export interface IBookmarker {
    username: string;
    bookmarks: IBookmark[];
    totalStars: number;
    totalBookmarks: number;
}
