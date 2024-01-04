<script lang="ts">
    import {Canvas} from '@threlte/core'
    import Scene from './Scene.svelte'
    import io from 'socket.io-client'
    import {onDestroy, onMount} from 'svelte';

    let socket: any = null;


    let scene: any;

    onMount(() => {

        socket = io('http://localhost:3000'); // Conectar al servidor desde el cliente

        socket.on('user-connected', (uuid: string) => {
            scene?.OnUserConnected(uuid);
        });

        socket.on('connected', (uuid: string) => {
            scene?.OnConnected(uuid);
        });

        socket.on('disconnect', () => {
            scene?.OnDisconnected();
        })

        socket.on('mensaje', (message: string) => {
            console.log(message);
        })
    });

</script>

<Canvas>
    <Scene bind:this={scene} socket={socket}/>
</Canvas>