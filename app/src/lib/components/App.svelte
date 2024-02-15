<script lang="ts">
    import { Canvas } from "@threlte/core";
    import io from "socket.io-client";
    import { onMount } from "svelte";
    import { World } from "@threlte/rapier";
    import { serverTimestampStore, playerDataStore, privilegesStore, serverDebugMsgAmountStore, serverPlayersStore, socketStore } from "./stores";
    import { AudioListener } from "@threlte/extras";

    import Ui from "./UI/UI.svelte";
    import SceneWrapper from "./SceneWrapper.svelte";
    import FakeMouse from "./FakeMouse.svelte";
    import toast, { Toaster } from "svelte-french-toast";

    let socket: any = null;
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
                spectator: params.get("spectator") || null,
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
        socket.on("msg", (message: string, fromServer: boolean) => {
            if (fromServer) {
                toast(message, {
                    position: "bottom-right",
                });
            } else {
                toast(message, {
                    position: "bottom-left",
                    style: "border-radius: 20px;",
                });
            }
        });

        socket.on("server-debug-msgAmount", (serverDebugMsgAmount: number) => {
            serverDebugMsgAmountStore.set(serverDebugMsgAmount);
        });
        socketStore.set(socket);
    });

    let debugFakeMouse = true;
    const onKeyDown = (e: KeyboardEvent) => {
        if (e.ctrlKey && e.key === "1") {
            e.preventDefault();
            debugFakeMouse = !debugFakeMouse;
        }
    };
</script>

<svelte:window on:keydown={onKeyDown} />
{#if serverConnected}
    <Canvas
        ><!-- rendererParameters={{ antialias: false }} size={{ width: 960, height: 540 }}> -->

        <AudioListener />
        <Ui />
        <World>
            <SceneWrapper socket />
        </World>
        {#if debugFakeMouse}
            <FakeMouse />
        {/if}
    </Canvas>
{:else}
    <div id="loading-wrapper">LOADING SERVER...</div>
{/if}

<style>
    :global(:root) {
        --dark: #19191d;
    }

    #loading-wrapper {
        color: white;
        text-align: center;
    }

    :global(canvas) {
        width: 100% !important;
        height: 100vh !important;
    }
</style>
