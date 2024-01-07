<script lang="ts">
    import { Canvas } from "@threlte/core";
    import PlayersWrapper from "./PlayersWrapper.svelte";
    import UI from "./UI.svelte";
    import io from "socket.io-client";
    import { onMount } from "svelte";
    import { World } from "@threlte/rapier";
    import { socketStore } from "./stores";
    import Scene from "./Scene.svelte";

    let socket: any = null;

    let playersWrapper: any;

    const waitForPlayersWrapper = () =>
        new Promise<void>((resolve) => {
            const checkPlayersWrapper = () => {
                if (playersWrapper) {
                    resolve();
                } else {
                    setTimeout(checkPlayersWrapper, 50);
                }
            };
            checkPlayersWrapper();
        });

    onMount(() => {
        socket = io("http://localhost:3000");

        socket.on("user-connected", (playerData: any) => {
            waitForPlayersWrapper().then(() => {
                playersWrapper.OnUserConnected(playerData);
            });
        });

        socket.on("user-disconnected", (userId: string) => {
            waitForPlayersWrapper().then(() => {
                playersWrapper.OnUserDisconnected(userId);
            });
        });

        socket.on("connected", (playerData: any, serverPlayers: any[]) => {
            waitForPlayersWrapper().then(() => {
                playersWrapper.OnConnected(playerData, serverPlayers);
            });
        });

        socket.on("players-list", (serverPlayers: any[]) => {
            waitForPlayersWrapper().then(() => {
                playersWrapper.UpdatePlayersList(serverPlayers);
            });
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
        <UI />
        <World>
            <PlayersWrapper bind:this={playersWrapper} {socket} />
            <Scene />
        </World>
    </Canvas>
</div>
