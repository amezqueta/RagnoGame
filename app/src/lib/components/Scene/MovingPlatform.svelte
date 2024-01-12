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
    import { SCDiffTimeStore } from "../stores";
    import { lerp } from "three/src/math/MathUtils.js";

    let SCDiffTime: number;
    let time: number;
    export let position1: number[];
    let p1: Vector3 = new Vector3(position1[0], position1[1], position1[2]);
    export let position2: number[];
    let p2: Vector3 = new Vector3(position2[0], position2[1], position2[2]);
    let position: Vector3 = new Vector3(0, 3, 5);

    useTask((delta) => {
        if (!SCDiffTime) return;
        if (time == null) {
            time = SCDiffTime / 1000;
        }
        time += delta;
        console.log(time);

        let v = p1.clone().lerp(p2, time);
        position = v;
    });

    $: if (SCDiffTimeStore) SCDiffTime = $SCDiffTimeStore;
</script>

{#if position}
    <AutoColliders shape={"cuboid"}>
        <T.Mesh
            receiveShadow
            castShadow
            position={position.toArray()}
            geometry={new BoxGeometry(2, 2, 2)}
            material={new MeshStandardMaterial({
                color: "#00ff00",
            })}
        />
    </AutoColliders>
{/if}
