<script lang="ts">
    import { Color, Folder, Pane, Text, ThemeUtils } from "svelte-tweakpane-ui";
    import { playerColorStore, socketStore } from "./stores";

    let socket: any;
    let color = "#f33653";
    let loadedColor = false;

    let connectedUsers: any[] = [];

    $: if (socketStore) socket = $socketStore;
    $: if (socket) {
        socket.on("users-list", (userList: any[]) => {
            connectedUsers = userList;
        });
    }

    $: if (loadedColor && socket) socket.emit("server-color", color);
    $: if ($playerColorStore && !loadedColor) {
        color = $playerColorStore;
        loadedColor = true;
    }
</script>

<Pane theme={ThemeUtils.presets.light} position="fixed" title="Config">
    <Color bind:value={color} label="Color" />

    <Folder title="Players:">
        {#each connectedUsers as user}
            <Text value={user.nick == null ? user.userId : user.nick} />
        {/each}
    </Folder>
</Pane>
