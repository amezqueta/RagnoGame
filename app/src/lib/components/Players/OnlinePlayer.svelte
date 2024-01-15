<script lang="ts">
    import { type Collider as RCollider, type RigidBody as RRigidBody } from "@dimforge/rapier3d-compat";
    import { onMount } from "svelte";
    import { T } from "@threlte/core";
    import { BoxGeometry, Group, MeshStandardMaterial } from "three";
    import { onDestroy } from "svelte";
    import TextBillboard from "../TextBillboard.svelte";
    import { Collider, RigidBody } from "@threlte/rapier";

    const material = new MeshStandardMaterial();
    const geometry = new BoxGeometry(2, 2, 2);
    let meshRotation: number = 0;

    export let userId: string = "";
    export let position = [0, 0, 0];
    export let color: string = "#FF0000";
    export let nick: string = userId;

    export function SetPosition(newPos: any) {
        position = [newPos.x, newPos.y, newPos.z];
        rigidBody.setTranslation(newPos, true);
    }

    export function SetRotation(newRot: number) {
        meshRotation = newRot;
    }

    export function SetColor(newColor: string) {
        color = newColor;
    }

    export function SetNick(newNick: string) {
        nick = newNick;
    }

    onMount(() => {
        console.log("Online Player mounted");
    });

    onDestroy(() => {
        console.log("Player destroyed (" + userId + ")");
    });

    $: {
        material.color.set(color);
    }
    let rigidBody: RRigidBody;
</script>

<RigidBody bind:rigidBody type="kinematicPosition" enabledRotations={[false, false, false]}>
    <T.Mesh castShadow {geometry} {material} rotation.y={meshRotation} />
    <TextBillboard text={nick} position={[0, 3, 0]} {color} />
    <Collider shape="capsule" args={[0.3, 1]} />
</RigidBody>
