<script lang="ts">
    import {onMount, tick} from 'svelte';
    import {T} from '@threlte/core';
    import {BoxGeometry, Color, MeshStandardMaterial, Vector3} from 'three';
    import {onDestroy} from "svelte";
    import {Text} from "@threlte/extras";

    const material = new MeshStandardMaterial({color: new Color(0xff3f00)});
    const geometry = new BoxGeometry(2, 2, 2);

    export let socket: any;
    export let userId: string = "";
    export let position = [0, 0, 0];
    let textPosition = [0, 2, 0];

    export function Move(vector: Vector3) {
        position[0] += vector.x;
        position[1] += vector.y;
        position[2] += vector.z;
        socket.emit('move', userId, position);
    }

    export function SetPosition(newPos: any) {
        position = newPos;
    }


    onMount(() => {
        console.log("Player mounted");
    })

    onDestroy(() => {
        console.log("Player destroyed (" + userId + ")");
    })

    $: textPosition = [
        position[0] + 0,
        position[1] + 2,
        position[2] + 0
    ];

</script>

<T.Mesh castShadow {geometry} {material} position={position}/>
<Text text={userId} position="{textPosition}" fontSize="1"/>