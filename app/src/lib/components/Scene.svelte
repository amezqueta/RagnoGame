<script lang="ts">
    import { AutoColliders } from "@threlte/rapier";
    import { T } from "@threlte/core";
    import { ContactShadows, Grid, OrbitControls, useGltf, useTexture } from "@threlte/extras";
    import { BoxGeometry, Group, MeshBasicMaterial, MeshStandardMaterial, MeshToonMaterial, RepeatWrapping } from "three";
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

<Structure position={[0, 0, 0]} scale={[100, 1, 100]} />
<T.Group position={[20, 0, 50]}>
    <Structure position={[0, 0, 0]} scale={[49, 10, 9]} />
    <Structure textureY={"wood_00"} textureXZ={"wood_00"} tone={[0, 0, 0]} position={[0, 9.85, 0]} scale={[50, 5.1, 10]} />
</T.Group>
<AutoColliders shape={"cuboid"}>
    <T.Mesh
        receiveShadow
        castShadow
        position.x={5}
        position.y={1.275}
        geometry={new BoxGeometry(2, 50, 2)}
        material={new MeshStandardMaterial({
            transparent: true,
            opacity: 0.5,
            color: 0x333333,
        })}
    />
</AutoColliders>
<AutoColliders shape={"cuboid"}>
    <T.Mesh
        receiveShadow
        castShadow
        position.x={-4}
        position.y={1.275}
        rotation.x={90}
        geometry={new BoxGeometry(2, 50, 2)}
        material={new MeshStandardMaterial({
            transparent: true,
            opacity: 0.5,
            color: 0x333333,
        })}
    />
</AutoColliders>
<AutoColliders shape={"cuboid"}>
    <T.Mesh
        receiveShadow
        castShadow
        position.x={-6}
        position.y={1.275}
        rotation.x={Math.PI * 0.75}
        geometry={new BoxGeometry(2, 50, 2)}
        material={new MeshStandardMaterial({
            color: 0x333333,
        })}
    />
</AutoColliders>

<MovingPlatform position1={[11, 2, 42]} position2={[11, 15, 42]} />
<MovingPlatform position1={[6, 1, 3]} position2={[10, 1, 3]} />

<T.Group position={[20, 0, 42]}>
    <Prop nodeName={"Bush_00"} position={[0, 1, 0]} scale={4} />
    <Prop nodeName={"Bush_00"} position={[10, 1, 0]} scale={4} />
    <Prop nodeName={"Bush_00"} position={[20, 1, 0]} scale={4} />
</T.Group>
<Item position={[18, 1, 22]} />
