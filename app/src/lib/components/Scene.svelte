<script lang="ts">
    import {T} from '@threlte/core'
    import {onMount} from 'svelte';
    import Player from '$lib/components/Player.svelte';
    import {ContactShadows, Grid, OrbitControls} from "@threlte/extras";
    import {Vector3} from "three";

    export let socket: any;
    let player: any = null;
    let socketConnected = false;

    onMount(() => {
        window.addEventListener('keydown', handleKeyDown);

        socket.on('connect', () => {
            socketConnected = true;
        });

        socket.on('disconnect', () => {
            socketConnected = false;
            if (player) {
                player.$destroy();
                player = null;
            }
        })

    });

    $: console.log("Socket connected: " + socketConnected);

    $: if (socketConnected && !player) {
        player = new Player({
            target: document.body
        });
    }

    function handleKeyDown(event: any) {
        console.log(event.key);

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
        if (socketConnected) {
            socket.emit('mensaje', event.key);
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
