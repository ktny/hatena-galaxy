interface BookmarksPageResponse {
    item: { bookmarks: Bookmark[] };
    pager: any;
}

interface Bookmark {
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

// const sleep = (ms: number) => {
//     return new Promise((resolve) => setTimeout(resolve, ms));
// };

const entriesEndpoint = `https://s.hatena.ne.jp/entries.json`;

export class BookmarkStarGatherer {
    username: string;

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

    private async gatherBookmarks(page: number = 1) {
        const getBookmarksEndpoint = `https://b.hatena.ne.jp/api/users/${this.username}/bookmarks?page=${page}`;
        const response = await fetch(getBookmarksEndpoint);
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

    async main() {
        const result: IBookmark[] = [];
        let page = 1;
        let totalStars = 0;
        let hasNextPage = true;

        while (hasNextPage) {
            const bookmarksPageResult = await this.gatherBookmarks(page);
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
                totalStars += starCount;
            }

            Object.values(bookmarkResults).forEach((bookmarkResult) => {
                result.push(bookmarkResult);
            });

            console.log(page);
            // await sleep(200);
            if (!hasNextPage) {
                break;
            }

            if (page > 1) {
                break;
            }
            page++;
        }

        result.sort((a, b) => b.star - a.star);
        console.table(result.slice(0, 100));
        // console.log(result);
        console.log(result.length);
        console.log(totalStars);

        return result;
    }
}
