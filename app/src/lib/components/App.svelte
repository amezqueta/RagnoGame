<script lang="ts">
    import { Canvas } from "@threlte/core";
    import Scene from "./Scene.svelte";
    import UI from "./UI.svelte";
    import io from "socket.io-client";
    import { onMount } from "svelte";
    import { World } from "@threlte/rapier";
    import { socketStore } from "./stores";

    let socket: any = null;

    let scene: any;

    const waitForScene = () =>
        new Promise<void>((resolve) => {
            const checkScene = () => {
                if (scene) {
                    resolve();
                } else {
                    setTimeout(checkScene, 50);
                }
            };
            checkScene();
        });

    onMount(() => {
        socket = io("http://localhost:3000");

        socket.on("user-connected", (playerData: any) => {
            waitForScene().then(() => {
                scene.OnUserConnected(playerData);
            });
        });

        socket.on("user-disconnected", (userId: string) => {
            waitForScene().then(() => {
                scene.OnUserDisconnected(userId);
            });
        });

        socket.on("connected", (playerData: any, serverPlayers: any[]) => {
            waitForScene().then(() => {
                scene.OnConnected(playerData, serverPlayers);
            });
        });

        socket.on("players-list", (serverPlayers: any[]) => {
            waitForScene().then(() => {
                scene.UpdatePlayersList(serverPlayers);
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
            <Scene bind:this={scene} {socket} />
        </World>
    </Canvas>
</div>
