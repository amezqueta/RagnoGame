<script lang="ts">
    import { type Collider as RCollider, type RigidBody as RRigidBody } from "@dimforge/rapier3d-compat";
    import { T, useTask } from "@threlte/core";
    import { Collider, RigidBody } from "@threlte/rapier";
    import { BoxGeometry, MeshStandardMaterial, Vector3, type Vector, MathUtils } from "three";
    import { isSpectatorStore, serverTimestampStore } from "../stores";

    let serverTimestamp: number;
    export let position1: number[];
    let p1: Vector3 = new Vector3(position1[0], position1[1], position1[2]);
    export let position2: number[];
    let p2: Vector3 = new Vector3(position2[0], position2[1], position2[2]);
    let position: Vector3 = new Vector3(0, 0, 0);

    useTask(() => {
        if (!serverTimestamp) return;
        let time = serverTimestamp + performance.now();

        let sine = normalizedSin(time / 1000);

        let v = p1.clone().lerp(p2, sine);
        position = v;
        rigidBody?.setNextKinematicTranslation(v);
    });

    $: if (serverTimestampStore) serverTimestamp = $serverTimestampStore;

    export function normalizedSin(angle: number): number {
        const sinValue: number = Math.sin(angle);
        const normalizedSin: number = (sinValue + 1) / 2;
        return normalizedSin;
    }

    //@TODO Si das a control, se baja de la plataforma
    let rigidBody: RRigidBody;
</script>

{#if position && isSpectatorStore}
    <RigidBody type="kinematicPosition" bind:rigidBody>
        <Collider shape={"cuboid"} args={[3, 0.2, 3]} />

        <T.Mesh
            receiveShadow
            geometry={new BoxGeometry(6, 1, 6)}
            material={new MeshStandardMaterial({
                color: "#00ff00",
            })}
        />
        <slot />
    </RigidBody>
{/if}
