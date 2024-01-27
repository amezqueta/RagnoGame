<script lang="ts">
    import { AutoColliders } from "@threlte/rapier";
    import { T } from "@threlte/core";
    import { ContactShadows, Grid, OrbitControls, useGltf, useTexture } from "@threlte/extras";
    import { BoxGeometry, MeshBasicMaterial, MeshStandardMaterial, MeshToonMaterial, RepeatWrapping } from "three";
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

<Structure nodeName={"Structure"} position={[0, 0, 0]} scale={[50, 1, 50]} />
<Structure nodeName={"Structure"} position={[0, 2, 0]} scale={[2, 1, 2]} />
<Structure nodeName={"Structure"} position={[12, 2, 0]} scale={[10, 1, 10]} />
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

<MovingPlatform position1={[10, 0, 10]} position2={[10, 25, 6]} />
<MovingPlatform position1={[6, 1, 3]} position2={[10, 1, 3]} />

<T.Group position={[22, 1, 40]}>
    <Prop nodeName={"Bush_00"} position={[0, 0, 0]} scale={4} />
    <Prop nodeName={"Bush_00"} position={[10, 0, 0]} scale={4} />
    <Prop nodeName={"Bush_00"} position={[20, 0, 0]} scale={4} />
</T.Group>
<Item position={[18, 1, 22]} />

<slot />
