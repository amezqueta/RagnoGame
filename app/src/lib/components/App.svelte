<script lang="ts">
    import { Canvas, T, useTask } from "@threlte/core";
    import PlayersWrapper from "./Players/PlayersWrapper.svelte";
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
    import DomPortal from "./Utilities/DomPortal.svelte";
    import Ui from "./UI/UI.svelte";
    import { LatheGeometry } from "three";

    let socket: any = null;
    let serverLatency: number;

    onMount(() => {
        let serverToClientTimeDiff: number;
        let pingSentTimestamp: number;

        const direction = window.location.origin;
        const ip = "http:" + direction.split(":")[1] + ":3000";
        console.log(ip);
        socket = io(ip);

        socket.on("check-timestampDiff", (serverTimestamp: number) => {
            pingSentTimestamp = Date.now();
            serverToClientTimeDiff = pingSentTimestamp - serverTimestamp;
            socket.emit("initial-ping");
        });

        socket.on("initial-pong", () => {
            serverLatency = Date.now() - pingSentTimestamp;
            let realServerClientDiffTime =
                serverToClientTimeDiff - serverLatency;

            const params = new URLSearchParams(window.location.search);
            let browserData = {
                nick: params.get("nick") || null,
                latency: serverLatency,
                playerDiffTime: realServerClientDiffTime,
            };

            socket.emit("onboarding", browserData);
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

{#if serverLatency}
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
