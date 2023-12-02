<script>
    import { page } from "$app/stores";
    import github from "$lib/images/github.svg";
    import Search from "./Search.svelte";
</script>

<header>
    <div class="navbar bg-base-100">
        <div class="flex-1">
            <a href="/" class="btn btn-ghost text-xl">はてなギャラクシー</a>

            {#if $page.url.pathname !== "/"}
                <Search />
            {/if}
        </div>
        <div class="flex-none gap-2">
            <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
                <div class="w-10 rounded-full">
                    <img src={github} alt="GitHub" />
                </div>
            </div>
        </div>
    </div>
</header>
