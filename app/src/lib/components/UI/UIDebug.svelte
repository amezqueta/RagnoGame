<script lang="ts">
    import { Checkbox, Folder, FpsGraph, Monitor, Pane, Text, ThemeUtils } from "svelte-tweakpane-ui";
    import { playerPositionStore, privilegesStore, serverDebugMsgAmountStore, serverPlayersStore, playerPowerupStore, debugRapierStore } from "../../stores/stores";
    import { onDestroy } from "svelte";
    import { getPowerupData } from "$lib/components/Shared/powerupData";
    document.addEventListener("pointerlockchange", onPointerlockchange);

    function onPointerlockchange(e: Event) {
        theme = document.pointerLockElement ? ThemeUtils.presets.translucent : ThemeUtils.presets.light;
    }
    let theme = ThemeUtils.presets.light;
    let serverDebugMsgAmount: number;

    let privileges: number = 0;

    let serverPlayers: any[];

    $: if ($serverPlayersStore) serverPlayers = $serverPlayersStore;
    $: if (serverDebugMsgAmountStore) serverDebugMsgAmount = $serverDebugMsgAmountStore;
    $: if (privilegesStore) privileges = $privilegesStore;

    onDestroy(() => {
        document.removeEventListener("pointerlockchange", onPointerlockchange);
    });
    let powerUpName = "";
    $: if ($playerPowerupStore) {
        const id = $playerPowerupStore;
        powerUpName = `${getPowerupData(id).name} (${id})`;
    }
</script>

{#if serverPlayers}
    <Pane {theme} position="fixed" title="Config">
        <Folder title="Players:">
            {#each serverPlayers as user}
                <Text value="{user.nick} ({user.score})" />
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
                <Text disabled bind:value={powerUpName} label="PowerUp" />
            {/if}
        </Folder>
        <Checkbox bind:value={$debugRapierStore} label="Debug rapier" />
    </Pane>
{/if}
