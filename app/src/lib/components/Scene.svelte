<script lang="ts">
    import { AutoColliders } from "@threlte/rapier";
    import { T } from "@threlte/core";
    import { ContactShadows, Grid, OrbitControls, useGltf, useTexture } from "@threlte/extras";
    import { BoxGeometry, DirectionalLight, Group, MeshBasicMaterial, MeshStandardMaterial, MeshToonMaterial, RepeatWrapping } from "three";
    import MovingPlatform from "./Scene/MovingPlatform.svelte";
    import Item from "./Scene/Item.svelte";
    import Prop from "./Scene/Prop.svelte";
    import Structure from "./Scene/Structure.svelte";
    import { playerPowerupStore } from "./stores";

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

    let mapVisible = false;

    $: if ($playerPowerupStore) {
        mapVisible = $playerPowerupStore === 3;
    }
</script>

<Structure position={[5, 3, 0]} scale={[1, 1, 1]} />

<Structure position={[20, -10, 0]} scale={[20, 10, 50]} />
<Structure position={[-20, -10, 0]} scale={[20, 10, 50]} />
<Structure position={[0, -10, 20]} scale={[20, 10, 50]} />

{#if mapVisible}
    <Structure textureY={"grass_00"} position={[0, -11, -15]} scale={[20, 10, 20]} />

    <T.Group position={[20, 0, 20]}>
        <Structure position={[0, 0, 0]} scale={[49, 10, 9]} />
        <Structure textureY={"wood_00"} textureXZ={"wood_00"} tone={[0, 0, 0]} position={[0, 9.85, 0]} scale={[50, 5.1, 10]} />
    </T.Group>

    <T.Group position={[20, 0, 14]}>
        <Prop nodeName={"Bush_00"} position={[0, 0.2, 0]} scale={1} />
        <Prop nodeName={"Bush_00"} position={[3, 0.2, 0]} scale={1} />
        <Prop nodeName={"Bush_00"} position={[6, 0.2, 0]} scale={1} />
    </T.Group>
    <Item position={[10, 1, 5]} />

    <Structure position={[9, 9, 14]} scale={[20, 1, 2]} rotation={[0, 0, 0.5]} />
    <Structure position={[-5, 0, 5]} scale={[2, 1, 2]} />
    <Structure position={[-5, 1, 8]} scale={[2, 1, 2]} />
    <Structure position={[-2, 2, 8]} scale={[2, 1, 2]} />
    <Structure position={[-1, 3, 11]} scale={[2, 1, 2]} />
{/if}
