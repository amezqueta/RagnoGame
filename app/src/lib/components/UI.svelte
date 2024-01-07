<script lang="ts">
    import { Color, Folder, Pane, Text, ThemeUtils } from "svelte-tweakpane-ui";
    import { playerColorStore, serverPlayersStore } from "./stores";

    let socket: any;
    let color = "#f33653";
    let loadedColor = false;

    let serverPlayers: any[];

    $: if ($serverPlayersStore) serverPlayers = $serverPlayersStore;

    $: if (loadedColor && socket) socket.emit("server-color", color);
    $: if ($playerColorStore && !loadedColor) {
        color = $playerColorStore;
        loadedColor = true;
    }
</script>

{#if serverPlayers}
    <Pane theme={ThemeUtils.presets.light} position="fixed" title="Config">
        <Color bind:value={color} label="Color" />

        <Folder title="Players:">
            {#each serverPlayers as user}
                <Text value={user.nick == null ? user.userId : user.nick} />
            {/each}
        </Folder>
    </Pane>
{/if}
