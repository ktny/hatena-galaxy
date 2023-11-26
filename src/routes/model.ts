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

export interface IStarCount {
    yellow: number;
    green: number;
    red: number;
    blue: number;
    purple: number;
}

export const initalStarCount = { yellow: 0, green: 0, red: 0, blue: 0, purple: 0 };

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
    star: IStarCount;
}

export interface IBookmarker {
    username: string;
    bookmarks: IBookmark[];
    totalStars: number;
    totalBookmarks: number;
}
