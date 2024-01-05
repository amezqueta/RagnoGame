<script lang="ts">
    import {T} from '@threlte/core'
    import {onDestroy, onMount} from 'svelte';
    import Player from '$lib/components/Player.svelte';
    import {ContactShadows, Grid, OrbitControls, Text} from "@threlte/extras";
    import {Vector3} from "three";

    let player: any = null;
    let currentUserId: any = null;
    let scenePlayers: any[] = [];

    export let socket: any;

    export function OnConnected(userId: string, serverPlayers: any[]) {
        console.log("New connection: (" + userId + ")");
        currentUserId = userId;
        //Updates the scenePlayers with the serverUsers
        serverPlayers.forEach(user => {
            if (user.userId != userId)
                scenePlayers = [...scenePlayers, {userId: user.userId, playerInstance: null}];
        });
    }

    export function OnDisconnected() {
        if (player) {
            player.$destroy();
            player = null;
        }
    }

    export function OnUserConnected(userId: string) {
        if (currentUserId == userId)//If is the current user, it ignores it
            return;

        console.log("New user connected: (" + userId + ")");

        //La creacion de new Player se tiene que hacer desde $:, desde aqui no tiene alcance ¯\_(ツ)_/¯
        scenePlayers = [...scenePlayers, {userId: userId, playerInstance: null}];
    }

    export function OnUserDisconnected(userId: string) {
        const userIndex = scenePlayers.findIndex(user => user.userId === userId);
        if (userIndex !== -1) {
            scenePlayers[userIndex].disconnected = true;
        }
    }

    $: if (currentUserId && !player) {
        player = new Player({
            target: canvas,
            props: {
                socket: socket,
                userId: currentUserId
            }
        });
    }

    $: {
        scenePlayers.forEach((user, index) => {
            //If it is marked for desconnection
            if (user.disconnected && user.playerInstance) {
                user.playerInstance.$destroy();
                user.playerInstance = null;
                scenePlayers.splice(index, 1);
            } else { //Creates the player
                user.playerInstance = new Player({
                    target: canvas,
                    props: {
                        userId: user.userId
                    }
                });
            }
        })
        console.log("Users changed:", scenePlayers);
    }

    let canvas: any = null;
    onMount(() => {
        canvas = document.querySelector('Canvas');
        window.addEventListener('keydown', handleKeyDown);

        socket.on('move', (userId: string, newPos: any) => {
            const userToUpdate = scenePlayers.find(user => user.userId === userId);
            if (userToUpdate) {
                userToUpdate.playerInstance?.SetPosition(newPos);
                console.log(userId + ": " + newPos);
            }
        })
    });

    function handleKeyDown(event: any) {
        switch (event.key) {
            case "w":
                player.Move(new Vector3(1, 0, 0));
                break;
            case "a":
                player.Move(new Vector3(0, 0, -1));
                break;
            case "s":
                player.Move(new Vector3(-1, 0, 0));
                break;
            case "d":
                player.Move(new Vector3(0, 0, 1));
                break;
        }
    }

</script>

<T.PerspectiveCamera
        makeDefault
        position={[-10, 10, 10]}
        fov={15}
>
    <OrbitControls
            enableZoom={true}
            enableDamping
            target.y={1.5}
    />
</T.PerspectiveCamera>

<T.DirectionalLight
        intensity={1}
        position.x={5}
        position.y={10}
/>
<T.AmbientLight intensity={0.5}/>

<Grid
        position.y={-0.001}
        cellColor="#ffffff"
        sectionColor="#ffffff"
        sectionThickness={0}
        fadeDistance={25}
        cellSize={2}
/>

<ContactShadows
        scale={10}
        blur={2}
        far={2.5}
        opacity={0.5}
/>
