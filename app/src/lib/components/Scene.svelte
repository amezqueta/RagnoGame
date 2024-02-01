<script lang="ts">
    import { AutoColliders } from "@threlte/rapier";
    import { T } from "@threlte/core";
    import { ContactShadows, Grid, OrbitControls, useGltf, useTexture } from "@threlte/extras";
    import { BoxGeometry, DirectionalLight, Group, MeshBasicMaterial, MeshStandardMaterial, MeshToonMaterial, RepeatWrapping } from "three";
    import MovingPlatform from "./Scene/MovingPlatform.svelte";
    import Item from "./Scene/Item.svelte";
    import Prop from "./Scene/Prop.svelte";
    import Structure from "./Scene/Structure.svelte";

    // const map = useTexture("tex/brick_00.png", {
    //     transform: (texture) => {
    //         texture.wrapS = RepeatWrapping;
    //         texture.wrapT = RepeatWrapping;
    //         texture.repeat.set(4, 4);
    //         return texture;
    //     },
    // });
    // let material = new MeshStandardMaterial();

    // $: if ($map) {
    //     material = new MeshStandardMaterial();
    //     material.map = $map;
    // }
</script>

<Structure position={[5, 3, 0]} scale={[1, 1, 1]} />

<Structure position={[20, -10, 0]} scale={[20, 10, 50]} />
<Structure position={[-20, -10, 0]} scale={[20, 10, 50]} />
<Structure position={[0, -10, 20]} scale={[20, 10, 50]} />
{#if false}
    <Structure textureY={"grass_00"} position={[0, -11, -15]} scale={[20, 10, 20]} />

    <T.Group position={[20, 0, 20]}>
        <Structure position={[0, 0, 0]} scale={[49, 10, 9]} />
        <Structure textureY={"wood_00"} textureXZ={"wood_00"} tone={[0, 0, 0]} position={[0, 9.85, 0]} scale={[50, 5.1, 10]} />
    </T.Group>

    <MovingPlatform position1={[11, 2, 42]} position2={[11, 15, 42]} />

    <T.Group position={[20, 0, 14]}>
        <Prop nodeName={"Bush_00"} position={[0, 0.2, 0]} scale={1} />
        <Prop nodeName={"Bush_00"} position={[3, 0.2, 0]} scale={1} />
        <Prop nodeName={"Bush_00"} position={[6, 0.2, 0]} scale={1} />
    </T.Group>
    <Item position={[10, 1, 5]} />
{/if}
