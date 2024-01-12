<script lang="ts">
    import { T, useTask } from "@threlte/core";
    import { AutoColliders } from "@threlte/rapier";
    import {
        BoxGeometry,
        MeshStandardMaterial,
        Vector3,
        type Vector,
        MathUtils,
    } from "three";
    import { lerp } from "three/src/math/MathUtils.js";
    import { serverTimestampStore } from "../stores";

    let serverTimestamp: number;
    let serverLatency: number;
    export let position1: number[];
    let p1: Vector3 = new Vector3(position1[0], position1[1], position1[2]);
    export let position2: number[];
    let p2: Vector3 = new Vector3(position2[0], position2[1], position2[2]);
    let position: Vector3 = new Vector3(0, 3, 5);

    useTask(() => {
        if (!serverTimestamp) return;
        let time = serverTimestamp + performance.now();
        console.log(serverLatency);

        let sine = normalizedSin(time / 1000);

        let v = p1.clone().lerp(p2, sine);
        position = v;
    });

    $: if (serverTimestampStore) serverTimestamp = $serverTimestampStore;

    export function normalizedSin(angle: number): number {
        const sinValue: number = Math.sin(angle);
        const normalizedSin: number = (sinValue + 1) / 2;
        return normalizedSin;
    }
</script>

{#if position}
    <T.Group position={position.toArray()}>
        <AutoColliders shape={"cuboid"}>
            <T.Mesh
                receiveShadow
                castShadow
                geometry={new BoxGeometry(2, 2, 2)}
                material={new MeshStandardMaterial({
                    color: "#00ff00",
                })}
            />
        </AutoColliders>
    </T.Group>
{/if}
