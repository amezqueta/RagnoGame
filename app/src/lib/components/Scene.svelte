<script lang="ts">
    import {T} from '@threlte/core'
    import {onDestroy, onMount} from 'svelte';
    import Player from '$lib/components/Player.svelte';
    import {ContactShadows, Grid, OrbitControls, Text} from "@threlte/extras";
    import {Vector3} from "three";

    let player: any = null;
    let currentUserId: any = null;
    let users: any[] = [];

    export let socket: any;


    export function OnUserConnected(uuid: string) {
        if (currentUserId == uuid)
            return;

        console.log("New user connected: (" + uuid + ")");

        //La creacion de new Player se tiene que hacer desde $:, desde aqui no tiene alcance ¯\_(ツ)_/¯
        console.log("push");
        users = [...users, {userId: uuid, playerInstance: null}];
    }

    export function OnConnected(uuid: string) {
        console.log("New connection: (" + uuid + ")");
        currentUserId = uuid;
    }

    export function OnDisconnected() {
        if (player) {
            player.$destroy();
            player = null;
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
        //console.log("Users changed:", users);
        users.forEach(user => {
            user.playerInstance = new Player({
                target: canvas,
                props: {
                    userId: user.userId
                }
            });
        })
    }


    let canvas: any = null;
    onMount(() => {
        canvas = document.querySelector('Canvas');
        window.addEventListener('keydown', handleKeyDown);

        socket.on('move', (userId: string, newPos: any) => {
            const userToUpdate = users.find(user => user.userId === userId);
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
