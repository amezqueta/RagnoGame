<script lang="ts">
    import {Canvas} from '@threlte/core'
    import Scene from './Scene.svelte'
    import io from 'socket.io-client'
    import {onMount} from 'svelte';

    let socket: any = null;


    let scene: any;

    onMount(() => {

        socket = io('http://localhost:3000'); // Conectar al servidor desde el cliente

        socket.on('user-connected', (userId: string) => {
            scene?.OnUserConnected(userId);
        });

        socket.on('user-disconnected', (userId: string) => {
            scene?.OnUserDisconnected(userId)
        })

        socket.on('connected', (userId: string, serverPlayers: any[]) => {
            console.log(serverPlayers);
            scene?.OnConnected(userId, serverPlayers);
        });

        socket.on('disconnect', () => {
            scene?.OnDisconnected();
        })

        socket.on('msg', (message: string) => {
            console.log(message);
        })
    });

</script>

<Canvas>
    <Scene bind:this={scene} socket={socket}/>
</Canvas>