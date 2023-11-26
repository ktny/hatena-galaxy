import type { IBookmark, Bookmark, BookmarksPageResponse, IBookmarker } from "./model";

const entriesEndpoint = `https://s.hatena.ne.jp/entries.json`;

export class BookmarkStarGatherer {
    username: string;
    currentPage: number = 1;
    progress: number = 0;

    bookmarkerData: IBookmarker = {
        username: "",
        bookmarks: [],
        totalBookmarks: 0,
        totalStars: 0
    };

    constructor(username: string) {
        this.username = username;
    }

    private buildURL(baseURL: string, uris: string[]) {
        const url = new URL(baseURL);
        const params = new URLSearchParams();
        for (const uri of uris) {
            params.append("uri", uri);
        }
        params.append("no_comments", "1");
        url.search = params.toString();
        return url.toString();
    }

    private async fetchTotalBookmarks(): Promise<number> {
        const url = `https://b.hatena.ne.jp/api/internal/cambridge/user/${this.username}`;
        const response = await fetch(url);
        const data = await response.json();
        return data.user.total_bookmarks;
    }

    private async gatherBookmarks(page: number = 1) {
        const url = `https://b.hatena.ne.jp/api/users/${this.username}/bookmarks?page=${page}`;
        const response = await fetch(url);
        const data: BookmarksPageResponse = await response.json();
        return data;
    }

    private async getStarCounts(bookmarks: Bookmark[]) {
        const uris = [];
        for (const bookmark of bookmarks) {
            const eid = bookmark.location_id;
            const originalDateString = bookmark.created;

            // 文字列をDateオブジェクトに変換
            const originalDate = new Date(originalDateString);

            // 年月日を取得
            const year = originalDate.getFullYear();
            const month = (originalDate.getMonth() + 1).toString().padStart(2, "0"); // 月は0から始まるため+1
            const day = originalDate.getDate().toString().padStart(2, "0");
            const date = `${year}${month}${day}`;
            const commentURL = `https://b.hatena.ne.jp/${this.username}/${date}#bookmark-${eid}`;
            uris.push(commentURL);
        }
        const entriesURL = this.buildURL(entriesEndpoint, uris);
        const entriesResponse = await fetch(entriesURL);
        const entriesData = await entriesResponse.json();

        return entriesData.entries;
    }

    getInProgressBookmarkerData() {
        return { bookmarkerData: this.bookmarkerData, progress: this.progress };
    }

    private calcProgress(): number {
        const currentBookmarks = this.currentPage * 20;
        const progress = currentBookmarks / this.bookmarkerData.totalBookmarks;
        console.log(`${this.currentPage} page ${progress} progress`);
        return progress > 1 ? 1 : progress;
    }

    private sortBookmarksByStarCount() {
        this.bookmarkerData.bookmarks.sort((a, b) => b.star - a.star);
    }

    async main() {
        console.log("start");
        let hasNextPage = true;

        // ブックマーカーの基礎情報を取得
        const totalBookmarks = await this.fetchTotalBookmarks();
        this.bookmarkerData = {
            username: this.username,
            bookmarks: [],
            totalBookmarks,
            totalStars: 0
        };

        while (hasNextPage) {
            const bookmarksPageResult = await this.gatherBookmarks(this.currentPage);
            const bookmarks = bookmarksPageResult.item.bookmarks;
            hasNextPage = !!bookmarksPageResult.pager.next;

            const bookmarkResults: { [eid: number]: IBookmark } = {};
            for (const bookmark of bookmarks) {
                bookmarkResults[bookmark.location_id] = {
                    title: bookmark.entry.title,
                    bookmarkCount: bookmark.entry.total_bookmarks,
                    category: bookmark.entry.category.path,
                    url: bookmark.url,
                    comment: bookmark.comment,
                    star: 0
                };
            }

            const starData = await this.getStarCounts(bookmarks);

            for (const entry of starData) {
                let starCount = 0;
                for (const star of entry.stars) {
                    if (typeof star === "number") {
                        starCount += star;
                    } else {
                        starCount++;
                    }
                }

                const eid = entry.uri.match(/\d+$/);
                bookmarkResults[eid] = { ...bookmarkResults[eid], star: starCount };
                this.bookmarkerData.totalStars += starCount;
            }

            Object.values(bookmarkResults).forEach((bookmarkResult) => {
                this.bookmarkerData.bookmarks.push(bookmarkResult);
            });

            if (!hasNextPage) {
                this.progress = 1;
                break;
            }

            // 20ページ(400ブクマごとにブックマークをソートする)
            if (this.currentPage % 20 === 0) {
                this.sortBookmarksByStarCount();
            }

            this.currentPage++;
            this.progress = this.calcProgress();
        }

        this.sortBookmarksByStarCount();
        return this.bookmarkerData;
    }
}
