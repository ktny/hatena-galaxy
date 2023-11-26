<script lang="ts">
    import { browser } from "$app/environment";
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import { bookmarkData } from "../stores";
    import type { IBookmark } from "../model";

    const username = $page.params.username;
    const iconURL = `https://cdn.profile-image.st-hatena.com/users/${username}/profile.png`;
    const bookmarkListURL = `https://b.hatena.ne.jp/${username}/bookmark`;

    let bookmarks: IBookmark[] = [];

    async function fetchBookmarkerData() {
        const res = await fetch(`/gather?username=${username}`);
        $bookmarkData[username] = await res.json();
        bookmarks = $bookmarkData?.[username].bookmarks ?? [];
        bookmarkData.set($bookmarkData);
        localStorage.setItem(username, JSON.stringify(bookmarks));
    }

    async function reloadBookmarkerPage() {
        bookmarks = [];
        fetchBookmarkerData();
    }

    onMount(async () => {
        if (browser) {
            const storedData = localStorage.getItem(username) || "";
            // console.log(storedData);

            // localstorageにデータがある場合、再取得ボタンをクリックしない限り再取得しない
            if (storedData) {
                bookmarks = JSON.parse(storedData);
            } else {
                fetchBookmarkerData();
            }
        }
    });
</script>

<svelte:head>
    <title>Home</title>
    <meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
    <h1>{username}</h1>

    <a href={bookmarkListURL} target="_blank" rel="noopener noreferrer">
        <img src={iconURL} alt={username} />
    </a>

    <button on:click={reloadBookmarkerPage}>再取得</button>

    {#each bookmarks as bookmark, i}
        <div>{i + 1}: {bookmark.star}: {bookmark.comment}</div>
    {/each}
</section>
