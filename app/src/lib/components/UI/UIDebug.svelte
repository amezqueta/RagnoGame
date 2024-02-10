<script lang="ts">
    import { Color, Folder, FpsGraph, Monitor, Pane, Text, ThemeUtils } from "svelte-tweakpane-ui";
    import { playerColorStore, playerPositionStore, privilegesStore, serverDebugMsgAmountStore, serverPlayersStore, playerPowerupStore } from "../stores";
    import { onDestroy } from "svelte";
    document.addEventListener("pointerlockchange", onPointerlockchange);

    function onPointerlockchange(e: Event) {
        theme = document.pointerLockElement ? ThemeUtils.presets.translucent : ThemeUtils.presets.light;
    }
    let theme = ThemeUtils.presets.light;
    let serverDebugMsgAmount: number;

    let privileges: number = 0;

    let color = "#f33653";
    let serverPlayers: any[];

    $: if ($serverPlayersStore) serverPlayers = $serverPlayersStore;
    $: if (playerColorStore) color = $playerColorStore;
    $: if (color) playerColorStore.set(color);
    $: if (serverDebugMsgAmountStore) serverDebugMsgAmount = $serverDebugMsgAmountStore;
    $: if (privilegesStore) privileges = $privilegesStore;

    onDestroy(() => {
        document.removeEventListener("pointerlockchange", onPointerlockchange);
    });
</script>

{#if serverPlayers}
    <Pane {theme} position="fixed" title="Config">
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
        {#if privileges == 10}
            <Folder title="Server:">
                {#if serverDebugMsgAmount != undefined}
                    <Monitor value={$serverDebugMsgAmountStore} graph={true} interval={1000} max={500} bufferSize={40} />
                {/if}
            </Folder>
        {/if}

        <Folder title="Info:">
            {#if $playerPositionStore}
                <Text disabled bind:value={$playerPositionStore} label="Position" />
                <Text disabled bind:value={$playerPowerupStore} label="PowerUp" />
            {/if}
        </Folder>
    </Pane>
{/if}
