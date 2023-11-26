<script lang="ts">
    import { browser } from "$app/environment";
    import { onMount, afterUpdate } from "svelte";
    import { page } from "$app/stores";
    import { bookmarkData } from "../stores";
    import type { IBookmarker } from "../model";

    const username = $page.params.username;
    const iconURL = `https://cdn.profile-image.st-hatena.com/users/${username}/profile.png`;
    const bookmarkListURL = `https://b.hatena.ne.jp/${username}/bookmark`;
    const initalBookmarkerData = { username, bookmarks: [], totalBookmarks: 0, totalStars: 0 };

    let bookmarker: IBookmarker = deepCopy(initalBookmarkerData);
    let displayBookmarksCount = 100;
    let progress = 0;
    let loading = false;
    let intervalId: NodeJS.Timeout;

    function deepCopy(data: any) {
        return JSON.parse(JSON.stringify(data));
    }

    async function fetchBookmarkerData() {
        loading = true;
        const res = await fetch(`/gather?username=${username}`);
        const bookmarkersData = await res.json();
        $bookmarkData[username] = bookmarkersData;
        bookmarker = bookmarkersData;
        bookmarkData.set($bookmarkData);
        localStorage.setItem(username, JSON.stringify(bookmarkersData));
        loading = false;
    }

    async function reloadBookmarkerPage() {
        bookmarker = deepCopy(initalBookmarkerData);
        intervalId = setInterval(getInProgressBookmarkerData, 1000);
        fetchBookmarkerData();
    }

    async function getInProgressBookmarkerData() {
        const res = await fetch(`/gather?username=${username}`, { method: "OPTIONS" });
        const data = await res.json();
        bookmarker = data.bookmarkerData;
        progress = data.progress;

        if (!loading || data.progress >= 1) {
            clearInterval(intervalId);
        }
    }

    onMount(async () => {
        if (browser) {
            const storedData = localStorage.getItem(username) || "";

            // localstorageにデータがある場合、再取得ボタンをクリックしない限り再取得しない
            if (storedData) {
                const bookmarkerData = JSON.parse(storedData);
                bookmarker = bookmarkerData;
                console.log(bookmarkerData);
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
    <title>Home</title>
    <meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
    <h1>{username}</h1>

    <h2>total ★: {bookmarker.totalStars}</h2>
    <h2>total B!: {bookmarker.totalBookmarks}</h2>

    <a href={bookmarkListURL} target="_blank" rel="noopener noreferrer">
        <img src={iconURL} alt={username} />
    </a>

    <button on:click={reloadBookmarkerPage}>再取得</button>

    {#if loading}
        <div>{progress} / 1</div>
    {/if}

    {#each bookmarker?.bookmarks as bookmark, i}
        {#if i < displayBookmarksCount}
            <div>
                <div>
                    <a href={bookmark.url} target="_blank" rel="noopener noreferrer">{bookmark.title}</a>
                    <a href={bookmark.url} target="_blank" rel="noopener noreferrer"><small>{bookmark.bookmarkCount} user</small></a>
                </div>
                <div>{bookmark.comment}</div>
                <div>🌟{bookmark.star}</div>
            </div>
        {/if}
    {/each}
</section>
