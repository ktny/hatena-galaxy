<script lang="ts">
    import { browser } from "$app/environment";
    import { onMount, afterUpdate } from "svelte";
    import type { IBookmarker } from "$lib/model";
    import type { PageServerData } from "./$types";
    import Bookmark from "./Bookmark.svelte";

    export let data: PageServerData;
    const username = data.name;

    const bookmarkListURL = `https://b.hatena.ne.jp/${username}/bookmark`;
    const initalBookmarkerData = { username, bookmarks: [], totalBookmarks: 0, totalStars: 0 };

    let bookmarker: IBookmarker = deepCopy(initalBookmarkerData);
    let displayBookmarksCount = 100;
    let progress = 0;
    let isLoading = false;
    let intervalId: NodeJS.Timeout;

    function deepCopy(data: any) {
        return JSON.parse(JSON.stringify(data));
    }

    async function fetchBookmarkerData() {
        isLoading = true;
        const res = await fetch(`/api/gather?username=${username}`);
        const bookmarkerData = await res.json();
        bookmarker = bookmarkerData;
        isLoading = false;
    }

    async function reloadBookmarkerPage() {
        console.log("reloadBookmarkerPage");
        pollingInporgressBookmarkerData();
        fetchBookmarkerData();
    }

    async function pollingInporgressBookmarkerData() {
        bookmarker = deepCopy(initalBookmarkerData);
        intervalId = setInterval(getInProgressBookmarkerData, 1000);
    }

    async function getInProgressBookmarkerData() {
        const res = await fetch(`/api/gather?username=${username}`, { method: "OPTIONS" });
        const data = await res.json();
        bookmarker = data.bookmarkerData;
        progress = data.progress;

        if (!isLoading || data.progress >= 1) {
            clearInterval(intervalId);
            isLoading = false;
        }
    }

    onMount(async () => {
        if (browser) {
            const res = await fetch(`/api/gatherer/loading?username=${username}`);
            isLoading = await res.json();

            // 取得中であれば再取得ボタンをクリックしたあとと同様の挙動にする
            if (isLoading) {
                pollingInporgressBookmarkerData();
            } else {
                fetchBookmarkerData();
                intervalId = setInterval(getInProgressBookmarkerData, 1000);
            }
        }
    });

    afterUpdate(() => {
        window.addEventListener("scroll", handleScroll);
    });

    function handleScroll() {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
            displayBookmarksCount += 100;
        }
    }
</script>

<svelte:head>
    <title>{username} - はてなギャラクシー</title>
    <meta name="description" content="{username}のはてなギャラクシーです" />
</svelte:head>

<section>
    <h1>{username}</h1>

    <h2>total ★: {bookmarker.totalStars}</h2>

    <a href={bookmarkListURL} target="_blank">
        <img src={data.profile_image_url} alt={username} />
    </a>

    <button class="btn btn-primary" on:click={reloadBookmarkerPage} disabled={isLoading}>再取得</button>

    {#if isLoading}
        <div>{progress} / 1</div>
    {/if}

    {#each bookmarker?.bookmarks as bookmark, i (bookmark.eid)}
        {#if i < displayBookmarksCount}
            <Bookmark {username} {bookmark} />
        {/if}
    {/each}
</section>
