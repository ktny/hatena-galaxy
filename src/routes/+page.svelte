<script>
    import { goto } from "$app/navigation";

    let username = "";
</script>

<svelte:head>
    <title>Home</title>
    <meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
    <h2>このユーザーのブックマークスターを見る</h2>
    <form on:submit|preventDefault={() => goto(`/${username}`)}>
        <input bind:value={username} />
        <button>Click</button>
    </form>
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
