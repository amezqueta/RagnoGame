<script lang="ts">
    import { AutoColliders } from "@threlte/rapier";
    import { T } from "@threlte/core";
    import { ContactShadows, Grid, OrbitControls } from "@threlte/extras";
    import { BoxGeometry, MeshStandardMaterial } from "three";
    import MovingPlatform from "./Scene/MovingPlatform.svelte";
</script>

<T.AmbientLight intensity={0.5} />
<ContactShadows scale={10} blur={2} far={2.5} opacity={0.5} />
<AutoColliders shape={"cuboid"}>
    <T.Mesh receiveShadow geometry={new BoxGeometry(30, 1, 30)} material={new MeshStandardMaterial()} />
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
<MovingPlatform position1={[0, 0, 5]} position2={[0, 5, 6]} />
<MovingPlatform position1={[6, 1, 3]} position2={[10, 1, 3]} />
<MovingPlatform position1={[2, 3, -5]} position2={[2, 3, -5]} underPlatformClimb={true} />
<MovingPlatform position1={[2, 6, -5]} position2={[2, 6, -5]} underPlatformClimb={true} />
