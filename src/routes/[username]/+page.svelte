<script>
    import { browser } from "$app/environment";
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import { bookmarkData } from "../stores";

    // export let data;

    const username = $page.params.username;
    let bookmarks = [];

    onMount(async () => {
        if (browser) {
            const storedData = localStorage.getItem(username) || "";
            console.log(storedData);
            const res = await fetch(`/gather?username=${username}`);
            // const bookmarks = await res.json();
            // console.log(bookmarks);
            $bookmarkData[username] = await res.json();
            bookmarks = $bookmarkData?.[username].bookmarks ?? [];
            bookmarkData.set($bookmarkData);

            // console.log($bookmarkData);
            // console.log($bookmarkData[username]);

            console.log(bookmarks);
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
