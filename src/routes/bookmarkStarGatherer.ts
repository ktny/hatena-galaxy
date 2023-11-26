import type { IBookmark, Bookmark, BookmarksPageResponse, IBookmarker } from "./model";

const entriesEndpoint = `https://s.hatena.ne.jp/entry.json`;

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

    /**
     * YYYY-MM-DD形式に変換する
     * @param dateString
     * @returns
     */
    private formatDateString(dateString: string): string {
        // 文字列をDateオブジェクトに変換
        const originalDate = new Date(dateString);

        // 年月日を取得
        const year = originalDate.getFullYear();
        const month = (originalDate.getMonth() + 1).toString().padStart(2, "0"); // 月は0から始まるため+1
        const day = originalDate.getDate().toString().padStart(2, "0");
        const date = `${year}-${month}-${day}`;
        return date;
    }

    private buildCommentURL(bookmark: Bookmark, date: string) {
        return `https://b.hatena.ne.jp/${this.username}/${date}#bookmark-${bookmark.location_id}`;
    }

    private async getStarCounts(bookmarkResults: { [eid: number]: IBookmark }) {
        const uris = Object.values(bookmarkResults).map((bookmark) => bookmark.commentURL);
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

    private excludeProtocolFromURL(url: string) {
        return url.replace("http://", "").replace("https://", "");
    }

    private buildBookmarksURL(bookmark: Bookmark) {
        const urlWithoutHTTP = this.excludeProtocolFromURL(bookmark.url);
        return `https://b.hatena.ne.jp/entry/s/${urlWithoutHTTP}`;
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
                const dateString = this.formatDateString(bookmark.created);
                const commentURL = this.buildCommentURL(bookmark, dateString.replaceAll("-", ""));
                const bookmarksURL = this.buildBookmarksURL(bookmark);

                bookmarkResults[bookmark.location_id] = {
                    eid: bookmark.location_id,
                    title: bookmark.entry.title,
                    bookmarkCount: bookmark.entry.total_bookmarks,
                    category: bookmark.entry.category.path,
                    entryURL: bookmark.url,
                    bookmarksURL,
                    commentURL,
                    bookmarkDate: dateString,
                    comment: bookmark.comment,
                    star: 0
                };
            }

            const starData = await this.getStarCounts(bookmarkResults);

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
