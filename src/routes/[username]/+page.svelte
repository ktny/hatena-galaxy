<script>
    export let data;
</script>

<svelte:head>
    <title>Home</title>
    <meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
    <h1>{data.username}</h1>

    {#each data.bookmarks as bookmark, i}
        <div>{i}: {bookmark.star}: {bookmark.comment}</div>
    {/each}
</section>
