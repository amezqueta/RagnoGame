<script lang="ts">
    import { T } from "@threlte/core";
    import { onMount } from "svelte";
    import { BoxGeometry, MeshStandardMaterial } from "three";
    import { playerSpawnsStore } from "../stores";
    export let position: number[];

    onMount(() => {
        playerSpawnsStore.update((spawns) => [...spawns, position]);
    });
</script>

<T.Mesh
    receiveShadow
    castShadow
    {position}
    geometry={new BoxGeometry(1, 1, 1)}
    material={new MeshStandardMaterial({
        transparent: true,
        opacity: 0.9,
        color: "pink",
    })}
/>
