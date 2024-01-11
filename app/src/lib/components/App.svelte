<script lang="ts">
    import { Canvas, T } from "@threlte/core";
    import PlayersWrapper from "./Players/PlayersWrapper.svelte";
    import UI from "./UI.svelte";
    import io from "socket.io-client";
    import { onMount } from "svelte";
    import { World } from "@threlte/rapier";
    import {
        playerDataStore,
        privilegesStore,
        serverDebugMsgAmountStore,
        serverPlayersStore,
        socketStore,
    } from "./stores";
    import Scene from "./Scene.svelte";
    import { Audio, AudioListener } from "@threlte/extras";
    import CameraControlsComponent from "./CameraControls.svelte";
    import FakeMouse from "./FakeMouse.svelte";

    let socket: any = null;

    onMount(() => {
        socket = io("http://localhost:3000");

        socket.on("get-browser", () => {
            const params = new URLSearchParams(window.location.search);
            let browserData = {
                nick: params.get("nick") || null,
            };
            socket.emit("browser-data", browserData);
        });

        socket.on("connected", (playerData: any, serverPlayers: any[]) => {
            console.log("New connection: (" + playerData.userId + ")");
            playerDataStore.set(playerData);
            privilegesStore.set(playerData.privileges);
            serverPlayersStore.set(serverPlayers);
        });

        socket.on("players-list", (serverPlayers: any[]) => {
            serverPlayersStore.set(serverPlayers);
        });

        socket.on("disconnect", () => {
            window.location.reload();
        });

        //Debugging messages
        socket.on("msg", (message: string) => {
            console.log(message);
        });

        socket.on("server-debug-msgAmount", (serverDebugMsgAmount: number) => {
            serverDebugMsgAmountStore.set(serverDebugMsgAmount);
        });
    });

    $: if (socket) {
        socketStore.set(socket);
    }

    let debugFakeMouse = true;
    const onKeyDown = (e: KeyboardEvent) => {
        if (e.ctrlKey && e.key === "1") {
            e.preventDefault();
            debugFakeMouse = !debugFakeMouse;
        }
    };
</script>

<svelte:window on:keydown={onKeyDown} />

<Canvas>
    <AudioListener />
    <UI />
    <World>
        <PlayersWrapper />
        <T.PerspectiveCamera makeDefault position={[-30, 30, 30]} fov={15}>
            <CameraControlsComponent />
        </T.PerspectiveCamera>
        <T.DirectionalLight intensity={1} position.x={5} position.y={10} />
        <Scene />
        {#if debugFakeMouse}
            <FakeMouse />
        {/if}
    </World>
</Canvas>
