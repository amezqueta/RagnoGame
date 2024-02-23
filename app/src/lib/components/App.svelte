<script lang="ts">
    import { Canvas } from "@threlte/core";
    import io from "socket.io-client";
    import { onMount } from "svelte";
    import { World } from "@threlte/rapier";
    import { serverTimestampStore, playerDataStore, privilegesStore, serverDebugMsgAmountStore, serverPlayersStore, socketStore } from "../stores/stores";
    import { AudioListener } from "@threlte/extras";

    import Ui from "./UI/UI.svelte";
    import SceneWrapper from "./Scene/SceneWrapper.svelte";
    import FakeMouse from "./UI/FakeMouse.svelte";
    import toast, { Toaster } from "svelte-french-toast";
    import ThemeHandler from "./UI/ThemeHandler.svelte";
    import LoadingServer from "$lib/components/UI/Outside/LoadingServer.svelte";
    import Access from "./UI/Outside/Access.svelte";
    import { writable } from "svelte/store";

    let socket: any = null;
    let serverConnected = false;
    let serverError: string | undefined;

    let mounted = false;
    type BrowserData = {
        nick: string | null;
    };
    const browserData = writable<BrowserData>(undefined);

    const startConnection = () => {
        const origin = window.location.origin;
        const ip = "http:" + origin.split(":")[1] + ":3000";
        socket = io(ip);

        socket.on("connect_error", (err) => {
            console.log(err.message);
            console.log(err.description);
            console.log(err.context);
            serverError = err.message;
            return;
        });

        console.log("App mounted");

        socket.emit("initiate-ping");

        socket.on("initiate-pong", (serverTimestamp: number) => {
            serverTimestampStore.set(serverTimestamp - performance.now());

            socket.emit("onboarding", $browserData);
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
    };

    onMount(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.has("nick")) browserData.set({ nick: params.get("nick") });
        mounted = true;
    });

    $: if ($browserData && $browserData.nick) {
        startConnection();
    }

    let debugFakeMouse = true;
    const onKeyDown = (e: KeyboardEvent) => {
        if (e.ctrlKey && e.key === "1") {
            e.preventDefault();
            debugFakeMouse = !debugFakeMouse;
        }
    };

    export const handleDataUpdate = (data: CustomEvent<any>) => {
        browserData.update((currentData) => ({ ...currentData, nick: data.detail }));
        console.log(data);
    };
</script>

<svelte:window on:keydown={onKeyDown} />

<ThemeHandler />
{#if !$browserData && mounted}
    <Access on:updateData={handleDataUpdate} />
{:else if serverConnected}
    <Canvas
        ><!-- rendererParameters={{ antialias: false }} size={{ width: 960, height: 540 }}> -->
        <AudioListener id={"global"} />
        <Ui />
        <World>
            <SceneWrapper socket />
        </World>
        {#if debugFakeMouse}
            <FakeMouse />
        {/if}
    </Canvas>
{:else}
    <LoadingServer {serverError} />
{/if}

<style>
    :global(canvas) {
        width: 100% !important;
        height: 100vh !important;
    }
</style>
