<script lang="ts">
    import { Canvas, T } from "@threlte/core";
    import PlayersWrapper from "./Players/PlayersWrapper.svelte";
    import UI from "./UI.svelte";
    import io from "socket.io-client";
    import { onMount } from "svelte";
    import { World } from "@threlte/rapier";
    import { playerDataStore, serverPlayersStore, socketStore } from "./stores";
    import Scene from "./Scene.svelte";
    import { Audio, AudioListener } from "@threlte/extras";
    import CameraControlsComponent from "./CameraControls.svelte";

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
            <T.PerspectiveCamera makeDefault position={[-30, 30, 30]} fov={15}>
                <CameraControlsComponent />
            </T.PerspectiveCamera>
            <T.DirectionalLight intensity={1} position.x={5} position.y={10} />
            <Scene />
        </World>
    </Canvas>
</div>
