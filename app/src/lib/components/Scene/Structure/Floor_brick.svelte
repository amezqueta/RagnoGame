<script lang="ts">
    import { T } from "@threlte/core";
    import { GLTF } from "@threlte/extras";
    import { Collider } from "@threlte/rapier";
    export let scale: number[] = [1, 1, 1];
    export let position: number[] = [0, 0, 0];
</script>

<T.Group {position}>
    <Collider shape={"cuboid"} args={scale} />
    <GLTF castShadow receiveShadow url={"models/environment/Floor_brick.glb"} {scale} />
</T.Group>
