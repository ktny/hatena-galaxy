<script lang="ts">
    import { ColorTypes } from "$lib/model";
    import type { IBookmark } from "$lib/model";

    export let username = "";
    export let bookmark: IBookmark | undefined = undefined;
</script>

<div class="card w-full bg-neutral shadow-xl mb-8">
    <figure><img src={bookmark?.image} alt={bookmark?.title} /></figure>
    <div class="card-body">
        <h2 class="card-title">
            <a href={bookmark?.entryURL} target="_blank">{bookmark?.title}</a>
            <a href={bookmark?.bookmarksURL} target="_blank" class="badge badge-accent">{bookmark?.bookmarkCount} user</a>
        </h2>
        <p><a href="https://b.hatena.ne.jp/entry/{bookmark?.eid}/comment/{username}" target="_blank">{bookmark?.comment}</a></p>
        <div class="flex">
            {#each ColorTypes as colorType (colorType)}
                {@const starCount = bookmark?.star[colorType]}
                {#if starCount !== undefined && starCount > 5}
                    <span
                        class="i-solar-star-bold w-6 h-6"
                        class:bg-purple-500={colorType === "purple"}
                        class:bg-blue-500={colorType === "blue"}
                        class:bg-red-500={colorType === "red"}
                        class:bg-green-500={colorType === "green"}
                        class:bg-yellow-500={colorType === "yellow"}
                    ></span>
                    <span>{starCount}</span>
                {:else}
                    {#each Array(starCount) as _}
                        <span
                            class="i-solar-star-bold w-6 h-6"
                            class:bg-purple-500={colorType === "purple"}
                            class:bg-blue-500={colorType === "blue"}
                            class:bg-red-500={colorType === "red"}
                            class:bg-green-500={colorType === "green"}
                            class:bg-yellow-500={colorType === "yellow"}
                        ></span>
                    {/each}
                {/if}
            {/each}
        </div>
    </div>
</div>
