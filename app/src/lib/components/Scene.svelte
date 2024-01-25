<script lang="ts">
    import { AutoColliders } from "@threlte/rapier";
    import { T } from "@threlte/core";
    import { ContactShadows, Grid, OrbitControls, useTexture } from "@threlte/extras";
    import { BoxGeometry, MeshStandardMaterial, MeshToonMaterial, RepeatWrapping } from "three";
    import MovingPlatform from "./Scene/MovingPlatform.svelte";
    import SpawnPlayer from "./Scene/SpawnPlayer.svelte";
    import Item from "./Scene/Item.svelte";

    const map = useTexture("tex/brick_00.png", {
        transform: (texture) => {
            texture.wrapS = RepeatWrapping;
            texture.wrapT = RepeatWrapping;
            texture.repeat.set(4, 4);
            return texture;
        },
    });
    let material = new MeshStandardMaterial();

    $: if ($map) {
        material = new MeshStandardMaterial();
        material.map = $map;
    }
</script>

<T.AmbientLight intensity={0.5} />
<ContactShadows scale={10} blur={2} far={2.5} opacity={0.5} />
<AutoColliders shape={"cuboid"}>
    <T.Mesh receiveShadow geometry={new BoxGeometry(60, 1, 60)} {material} />
</AutoColliders>
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

<SpawnPlayer position={[25, 1, 10]} />

<Item position={[13, 1, 22]} />

<slot />
