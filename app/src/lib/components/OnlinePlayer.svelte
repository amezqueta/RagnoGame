<script lang="ts">
    import { type RigidBody as RapierRigidBody } from '@dimforge/rapier3d-compat';
    import {afterUpdate, onMount, tick} from 'svelte';
    import {T, useTask} from '@threlte/core';
    import {BoxGeometry, Color, MeshStandardMaterial, Vector3} from 'three';
    import {onDestroy} from "svelte";
    import {Text} from "@threlte/extras";
    import { Collider } from '@threlte/rapier';

    const material = new MeshStandardMaterial();
    const geometry = new BoxGeometry(2, 2, 2);

    export let socket: any = null;
    export let userId: string = "";
    export let position = [0, 0, 0];
    let textPosition = [0, 2, 0];
    export let color: string = "#FF0000";

    export function SetPosition(newPos: any) {
        position = [newPos.x, newPos.y, newPos.z];
    }

    onMount(() => {
        console.log("Online Player mounted");
    })

    socket.on('user-color', (id: string, newColor: string) => {
        if (userId === id) {
            color = newColor;
        }
    })

    onDestroy(() => {
        console.log("Player destroyed (" + userId + ")");
    })

    $: textPosition = [
        position[0] + 0,
        position[1] + 3,
        position[2] + 0
    ];

    $: {
        material.color.set(color);
    }

</script>

<T.Mesh castShadow {geometry} {material} position={position}/>
<Text text={userId} position="{textPosition}" fontSize="1" outlineWidth={0.03} color={color} anchorX={"center"}  />