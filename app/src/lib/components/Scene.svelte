<script lang="ts">
    import { AutoColliders } from "@threlte/rapier";
    import { T } from "@threlte/core";
    import { onMount } from "svelte";
    import Player from "$lib/components/Player.svelte";
    import OnlinePlayer from "$lib/components/OnlinePlayer.svelte";
    import { ContactShadows, Grid, OrbitControls, Text } from "@threlte/extras";
    import { BoxGeometry, MeshStandardMaterial } from "three";
    import type CameraControls from "camera-controls";
    import CameraControlsComponent from "./CameraControls.svelte";
    import { serverPlayersStore } from "./stores";

    let player: any = null;
    let currentPlayerData: any = null;
    let scenePlayers: any[] = [];

    let camera: CameraControls;

    export let socket: any;

    export function UpdatePlayersList(serverPlayers: any[]) {
        serverPlayersStore.set(serverPlayers);
    }

    //On connecting to the client
    export function OnConnected(playerData: any, serverPlayers: any[]) {
        console.log("New connection: (" + playerData.userId + ")");
        currentPlayerData = playerData;

        //Updates the scenePlayers with the serverUsers
        serverPlayers.forEach((player) => {
            if (player.userId != playerData.userId)
                scenePlayers = [
                    ...scenePlayers,
                    {
                        userId: player.userId,
                        position: [
                            player.position.x,
                            player.position.y,
                            player.position.z,
                        ],
                        color: player.color,
                        nick: player.nick,
                        playerInstance: null,
                    },
                ];
        });
    }

    //On a new user is connected to the server
    export function OnUserConnected(playerData: any) {
        if (currentPlayerData.userId == playerData.userId)
            //If is the current user, it ignores it
            return;

        console.log("New user connected: (" + playerData.userId + ")");

        scenePlayers = [
            ...scenePlayers,
            {
                userId: playerData.userId,
                position: [
                    playerData.position.x,
                    playerData.position.y,
                    playerData.position.z,
                ],
                color: playerData.color,
                nick: playerData.nick,
                playerInstance: null,
            },
        ];
    }

    export function OnUserDisconnected(userId: string) {
        const userIndex = scenePlayers.findIndex(
            (user) => user.userId === userId,
        );
        if (userIndex !== -1) {
            scenePlayers[userIndex].disconnected = true;
        }
    }

    //Creates the player
    $: if (currentPlayerData && !player) {
        const params = new URLSearchParams(window.location.search);
        let nick = params.get("nick") || "";
        socket.emit("server-set-nick", nick);
        player = new Player({
            target: canvas,
            props: {
                socket: socket,
                userId: currentPlayerData.userId,
                color: currentPlayerData.color,
                nick: nick,
            },
        });
    }

    $: {
        scenePlayers.forEach((player, index) => {
            //If it is marked for desconnection
            if (player.disconnected && player.playerInstance) {
                player.playerInstance.$destroy();
                player.playerInstance = null;
                scenePlayers.splice(index, 1);
            } else {
                //Creates the online players
                if (player.playerInstance == null) {
                    let onlinePlayer = new OnlinePlayer({
                        target: canvas,
                        props: {
                            position: player.position,
                            color: player.color,
                            userId: player.userId,
                            nick: player.nick,
                        },
                    });
                    player.playerInstance = onlinePlayer;
                }
            }
        });
    }

    let canvas: any = null;
    onMount(() => {
        canvas = document.querySelector("Canvas");

        socket.on("move", (userId: string, newPos: any) => {
            const user = scenePlayers.find((user) => user.userId === userId);
            if (user) {
                user.playerInstance?.SetPosition(newPos);
            }
        });

        socket.on("user-color", (userId: string, newColor: string) => {
            const user = scenePlayers.find((user) => user.userId === userId);
            if (user) {
                user.playerInstance?.SetColor(newColor);
            }
        });

        socket.on("user-set-nick", (userId: string, newNick: string) => {
            const user = scenePlayers.find((user) => user.userId === userId);
            if (user) {
                user.playerInstance?.SetNick(newNick);
            }
        });
    });
</script>

<T.PerspectiveCamera makeDefault position={[-30, 30, 30]} fov={15}>
    <OrbitControls enableZoom={true} enableDamping target.y={1.5} />
    <CameraControlsComponent
        on:create={({ ref }) => {
            camera = ref;
        }}
    />
</T.PerspectiveCamera>

<T.DirectionalLight intensity={1} position.x={5} position.y={10} />
<T.AmbientLight intensity={0.5} />

<Grid
    position.y={-0.001}
    cellColor="#ffffff"
    sectionColor="#ffffff"
    sectionThickness={0}
    fadeDistance={250}
    cellSize={2}
/>

<ContactShadows scale={10} blur={2} far={2.5} opacity={0.5} />

<AutoColliders shape={"cuboid"}>
    <T.Mesh
        receiveShadow
        geometry={new BoxGeometry(30, 1, 30)}
        material={new MeshStandardMaterial()}
    />
</AutoColliders>

<AutoColliders shape={"cuboid"}>
    <T.Mesh
        receiveShadow
        castShadow
        position.x={5}
        position.y={1.275}
        geometry={new BoxGeometry(2, 50, 2)}
        material={new MeshStandardMaterial({
            transparent: true,
            opacity: 0.5,
            color: 0x333333,
        })}
    />
</AutoColliders>

<AutoColliders shape={"cuboid"}>
    <T.Mesh
        receiveShadow
        castShadow
        position.x={-4}
        position.y={1.275}
        rotation.x={90}
        geometry={new BoxGeometry(2, 50, 2)}
        material={new MeshStandardMaterial({
            transparent: true,
            opacity: 0.5,
            color: 0x333333,
        })}
    />
</AutoColliders>
