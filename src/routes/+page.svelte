<script>
    import Search from "./Search.svelte";
</script>

<svelte:head>
    <title>はてなギャラクシー</title>
    <meta name="description" content="はてなギャラクシー" />
</svelte:head>

<section>
    <Search />
</section>

<style lang="postcss">
    section {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex: 0.9;
    }
</style>
