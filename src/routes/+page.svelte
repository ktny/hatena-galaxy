<script>
    import { goto } from "$app/navigation";
    let username = "";
</script>

<svelte:head>
    <title>Home</title>
    <meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
    <h1>Hatena Galaxy</h1>

    <h2>このユーザーのブックマークスターを見る</h2>
    <input bind:value={username} />
    <button on:click={() => goto(`/${username}/`)}>Click</button>
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
