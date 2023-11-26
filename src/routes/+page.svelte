<script>
    import { username } from "./stores";
    import { enhance } from "$app/forms";

    export let data;
</script>

<svelte:head>
    <title>Home</title>
    <meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
    <h1>Hatena Galaxy</h1>

    <form method="POST" action="?/gatherBookmarks" use:enhance>
        <label
            >username:
            <input name="username" autocomplete="off" />
        </label>
    </form>

    {#each data.bookmarks as bookmark, i}
        <div>{i}: {bookmark?.star}: {bookmark?.comment}</div>
    {/each}
</section>

<style>
    section {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex: 0.6;
    }

    h1 {
        width: 100%;
    }
</style>
