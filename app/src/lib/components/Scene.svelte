<script lang="ts">
    import { AutoColliders } from "@threlte/rapier";
    import { T } from "@threlte/core";
    import { ContactShadows, Grid, OrbitControls, Text } from "@threlte/extras";
    import { BoxGeometry, Group, MeshStandardMaterial } from "three";
    import CameraControlsComponent from "./CameraControls.svelte";
</script>

<T.PerspectiveCamera makeDefault position={[-30, 30, 30]} fov={15}>
    <OrbitControls enableZoom={true} enableDamping target.y={1.5} />
    <CameraControlsComponent />
</T.PerspectiveCamera>
<T.DirectionalLight intensity={1} position.x={5} position.y={10} />
<T.AmbientLight intensity={0.5} />
<Grid
    position.y={-0.001}
    cellColor="#ffffff"
    sectionColor="#ffffff"
    sectionThickness={0}
    fadeDistance={250}
    cellSize={2}
/>
<ContactShadows scale={10} blur={2} far={2.5} opacity={0.5} />
<AutoColliders shape={"cuboid"}>
    <T.Mesh
        receiveShadow
        geometry={new BoxGeometry(30, 1, 30)}
        material={new MeshStandardMaterial()}
    />
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
