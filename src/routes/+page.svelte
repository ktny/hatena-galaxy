<script>
    import { username } from "./stores";
    import { goto } from "$app/navigation";

    async function handleSubmit() {
        goto(`/${$username}/`);
    }
</script>

<svelte:head>
    <title>Home</title>
    <meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
    <h1>Hatena Galaxy</h1>

    <form on:submit|preventDefault={handleSubmit}>
        <label
            >username:
            <input bind:value={$username} />
        </label>

        <button type="submit">Submit</button>
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
