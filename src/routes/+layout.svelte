<script>
    import Header from "./Header.svelte";
    import "../app.css";
    import { theme } from "$lib/stores";
</script>

<div class="app" data-theme={$theme}>
    <Header />

    <main>
        <slot />
    </main>

    <!-- <footer>
        <p>visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit</p>
    </footer> -->
</div>

<style lang="postcss">
    .app {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
    }

    main {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 1rem;
        width: 100%;
        max-width: 64rem;
        margin: 0 auto;
        box-sizing: border-box;
    }
</style>
