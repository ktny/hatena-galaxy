import { json, type RequestHandler } from "@sveltejs/kit";

const fetchTotalBookmarks = async (username: string): Promise<number> => {
    const url = `https://b.hatena.ne.jp/api/internal/cambridge/user/${username}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.user.total_bookmarks;
};

export const GET: RequestHandler = async ({ url }) => {
    const username = url.searchParams.get("username") ?? "";
    const totalBookmarks = await fetchTotalBookmarks(username);
    return json({ totalBookmarks });
};
