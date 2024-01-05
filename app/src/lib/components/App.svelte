<script lang="ts">
    import {Canvas, useTask} from '@threlte/core'
    import Scene from './Scene.svelte'
    import UI from './UI.svelte'
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

        socket.on('connected', (playerData: any, serverPlayers: any[]) => {
            scene?.OnConnected(playerData, serverPlayers);
        });

        socket.on('disconnect', () => {
            scene?.OnDisconnected();
        })

        socket.on('msg', (message: string) => {
            console.log(message);
        })
    });
</script>


<div style="position:relative; height:100%; width:100%; background-color: rgb(14,22,37)">
    <Canvas>
        <UI socket={socket}/>
        <Scene bind:this={scene} socket={socket}/>
    </Canvas>
</div>
    