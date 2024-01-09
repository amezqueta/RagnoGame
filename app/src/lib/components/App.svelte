<script lang="ts">
    import { Canvas } from "@threlte/core";
    import PlayersWrapper from "./Players/PlayersWrapper.svelte";
    import UI from "./UI.svelte";
    import io from "socket.io-client";
    import { onMount } from "svelte";
    import { World } from "@threlte/rapier";
    import { playerDataStore, serverPlayersStore, socketStore } from "./stores";
    import Scene from "./Scene.svelte";
    import { Audio, AudioListener } from "@threlte/extras";

    let socket: any = null;

    onMount(() => {
        socket = io("http://localhost:3000");

        socket.on("connected", (playerData: any, serverPlayers: any[]) => {
            console.log("New connection: (" + playerData.userId + ")");
            playerDataStore.set(playerData);
            serverPlayersStore.set(serverPlayers);
        });

        socket.on("players-list", (serverPlayers: any[]) => {
            serverPlayersStore.set(serverPlayers);
        });

        socket.on("disconnect", () => {
            window.location.reload();
        });

        socket.on("msg", (message: string) => {
            console.log(message);
        });
    });

    $: if (socket) {
        socketStore.set(socket);
    }
</script>

<div
    style="position:relative; height:100%; width:100%; background-color: rgb(14,22,37)"
>
    <Canvas>
        <AudioListener />
        <UI />
        <World>
            <PlayersWrapper />
            <Scene />
        </World>
    </Canvas>
</div>
