import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type { BookmarkerInfoResponse } from "$lib/model";

const fetchBookmarkerInfo = async (username: string): Promise<BookmarkerInfoResponse> => {
    const url = `https://b.hatena.ne.jp/api/internal/cambridge/user/${username}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.user;
};

export const load: PageServerLoad = async ({ params }) => {
    try {
        const bookmakerInfo = await fetchBookmarkerInfo(params.username);
        return bookmakerInfo;
    } catch {
        throw error(404, "Not found");
    }
};
