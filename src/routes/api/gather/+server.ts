import { json, type RequestHandler } from "@sveltejs/kit";
import { BookmarkStarGatherer } from "$lib/server/bookmarkStarGatherer";
import { loadingGatheres } from "$lib/server/gathers";
import * as fs from "fs";

// TODO: usernameごとにしないといけない
let gatherer: BookmarkStarGatherer;

export const GET: RequestHandler = async ({ url }) => {
    const username = url.searchParams.get("username") ?? "";
    const filepath = `/tmp/${username}.json`;

    try {
        const jsonString = fs.readFileSync(filepath, "utf-8");
        const jsonData = JSON.parse(jsonString);
        return json({ ...jsonData });
    } catch (error) {
        console.error("ファイルの読み込みエラー:", error);
    }

    gatherer = new BookmarkStarGatherer(username);

    try {
        // 取得中はローディングをtrueにする
        loadingGatheres.add(username);
        const bookmarkerData = await gatherer.main();

        // 取得したデータはファイルに保存してキャッシュする
        const jsonString = JSON.stringify(bookmarkerData, null, 2);
        fs.writeFileSync(filepath, jsonString, "utf-8");

        return json({ ...bookmarkerData });
    } finally {
        loadingGatheres.delete(username);
    }
};

export const OPTIONS: RequestHandler = () => {
    if (!gatherer) {
        return json({ progress: 1 });
    }
    const data = gatherer.getInProgressBookmarkerData();
    return json({ ...data });
};
