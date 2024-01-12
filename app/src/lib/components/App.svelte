<script lang="ts">
    import { Canvas, T, useTask } from "@threlte/core";
    import PlayersWrapper from "./Players/PlayersWrapper.svelte";
    import io from "socket.io-client";
    import { onMount } from "svelte";
    import { World } from "@threlte/rapier";
    import {
        serverTimestampStore,
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
    import Ui from "./UI/UI.svelte";

    let socket: any = null;
    let serverLatency: number;
    let serverConnected = false;

    onMount(() => {
        const origin = window.location.origin;
        const ip = "http:" + origin.split(":")[1] + ":3000";
        socket = io(ip);
        console.log("App mounted");

        socket.emit("initiate-ping");

        socket.on("initiate-pong", (serverTimestamp: number) => {
            serverTimestampStore.set(serverTimestamp - performance.now());

            const params = new URLSearchParams(window.location.search);
            let browserData = {
                nick: params.get("nick") || null,
                latency: serverLatency,
            };

            socket.emit("onboarding", browserData);
        });

        socket.on("connected", (playerData: any, serverPlayers: any[]) => {
            console.log("New connection: (" + playerData.userId + ")");
            playerDataStore.set(playerData);
            privilegesStore.set(playerData.privileges);
            serverPlayersStore.set(serverPlayers);
            serverConnected = true;
        });

        socket.on("players-list", (serverPlayers: any[]) => {
            serverPlayersStore.set(serverPlayers);
        });

        socket.on("disconnect", () => {
            window.location.reload();
        });

        //Chat messages
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

    let debugFakeMouse = false;
    const onKeyDown = (e: KeyboardEvent) => {
        if (e.ctrlKey && e.key === "1") {
            e.preventDefault();
            debugFakeMouse = !debugFakeMouse;
        }
    };
</script>

<svelte:window on:keydown={onKeyDown} />

{#if serverConnected}
    <Canvas>
        <AudioListener />
        <Ui />
        <World>
            <T.PerspectiveCamera makeDefault position={[-30, 30, 30]} fov={15}>
                <CameraControlsComponent />
            </T.PerspectiveCamera>
            <T.DirectionalLight intensity={1} position.x={5} position.y={10} />
            <Scene />
            {#if debugFakeMouse}
                <FakeMouse />
            {/if}
            {#if socket}
                <PlayersWrapper />
            {/if}
        </World>
    </Canvas>
{:else}
    <div id="loading-wrapper">LOADING SERVER...</div>
{/if}

<style>
    #loading-wrapper {
        color: white;
        text-align: center;
    }
</style>
