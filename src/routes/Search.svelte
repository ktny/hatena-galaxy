<script>
    import { goto } from "$app/navigation";

    let username = "";
</script>

<form on:submit|preventDefault={() => goto(`/user/${username}`)} class="flex">
    <input placeholder="username" class="input input-bordered input-primary max-w-xs mr-2" bind:value={username} />
    <button class="btn btn-primary">Go</button>
</form>
