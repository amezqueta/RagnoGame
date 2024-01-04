<script lang="ts">
    import {T} from '@threlte/core';
    import {BoxGeometry, Color, MeshStandardMaterial, Vector3} from 'three';
    import {onDestroy} from "svelte";

    const material = new MeshStandardMaterial({color: new Color(0xff3f00)});
    const geometry = new BoxGeometry(2, 2, 2);

    export let position = [0, 0, 0];

    export function Move(vector: Vector3) {
        position[0] += vector.x;
        position[1] += vector.y;
        position[2] += vector.z;
    }

    onDestroy(() => {
        console.log("Player destroyed");
    })

</script>

<T.Mesh castShadow {geometry} {material} position={position}/>
