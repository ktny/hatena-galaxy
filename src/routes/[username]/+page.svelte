<script>
    import { browser } from "$app/environment";
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import { bookmarkData } from "../stores";

    const username = $page.params.username;
    let bookmarks = [];

    onMount(async () => {
        if (browser) {
            const storedData = localStorage.getItem(username) || "";
            // console.log(storedData);

            // localstorageにデータがある場合、再取得ボタンをクリックしない限り再取得しない
            if (storedData) {
                bookmarks = JSON.parse(storedData);
            } else {
                const res = await fetch(`/gather?username=${username}`);
                $bookmarkData[username] = await res.json();
                bookmarks = $bookmarkData?.[username].bookmarks ?? [];
                bookmarkData.set($bookmarkData);
                localStorage.setItem(username, JSON.stringify(bookmarks));
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

    {#each bookmarks as bookmark, i}
        <div>{i}: {bookmark.star}: {bookmark.comment}</div>
    {/each}
</section>
