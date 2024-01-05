<script lang="ts">
    import {Canvas, T, currentWritable, type CurrentWritable} from '@threlte/core'
    import {
        Checkbox,
        Color,
        Folder,
        Pane, Textarea,
        Text, ThemeUtils
    } from 'svelte-tweakpane-ui'

    export let socket: any;

    let color = '#ff3653'
    let toneMapped = false
    let connectedUsers: string[] = [];

    socket.on('users-list', (userList: any[]) => {
        connectedUsers = userList.map(x => x.userId);
    })

    $: socket.emit('server-color', color);

</script>

<Pane
        theme={ThemeUtils.presets.light}
        position="fixed"
        title="Config"
>
    <Color
            bind:value={color}
            label="Color"
    />

    <Folder title="Players:">
        {#each connectedUsers as user}
            <Text bind:value={user}/>
        {/each}
    </Folder>

</Pane>