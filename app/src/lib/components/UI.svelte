<script lang="ts">
    import {
        Color,
        Folder,
        FpsGraph,
        Pane,
        Text,
        ThemeUtils,
    } from "svelte-tweakpane-ui";
    import { playerColorStore, serverPlayersStore } from "./stores";
    import { onMount } from "svelte";
    import { useTask } from "@threlte/core";

    let color = "#f33653";

    let serverPlayers: any[];

    $: if ($serverPlayersStore) serverPlayers = $serverPlayersStore;
    $: if (playerColorStore) color = $playerColorStore;
    $: if (color) playerColorStore.set(color);
</script>

{#if serverPlayers}
    <Pane theme={ThemeUtils.presets.light} position="fixed" title="Config">
        {#if color}
            <Color bind:value={color} label="Color" />
        {/if}
        <Folder title="Players:">
            {#each serverPlayers as user}
                <Text value={user.nick == null ? user.userId : user.nick} />
            {/each}
        </Folder>
        <Folder expanded={false} title="FPS:">
            <FpsGraph interval={50} rows={5} />
        </Folder>
    </Pane>
{/if}
