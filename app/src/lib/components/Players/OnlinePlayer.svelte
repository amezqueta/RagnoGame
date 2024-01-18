<script lang="ts">
    import { type Collider as RCollider, type RigidBody as RRigidBody } from "@dimforge/rapier3d-compat";
    import { onMount } from "svelte";
    import { T, useTask } from "@threlte/core";
    import { BoxGeometry, MeshStandardMaterial, Vector3 } from "three";
    import { onDestroy } from "svelte";
    import TextBillboard from "../TextBillboard.svelte";
    import { Collider } from "@threlte/rapier";
    import { playerPositionStore, socketStore } from "../stores";
    import Emote from "../UI/Emote.svelte";

    const material = new MeshStandardMaterial();
    material.emissive.set("white");
    let hover = false;
    const capsuleHeight = 1.6;
    const geometry = new BoxGeometry(2, capsuleHeight * 3, 2);
    let meshRotation: number = 0;

    export let userId: string = "";
    export let position: Vector3 = new Vector3();
    export let color: string = "#FF0000";
    export let nick: string = userId;

    export function SetPosition(newPos: any) {
        position = new Vector3(newPos.x, newPos.y, newPos.z);
        collider.setTranslation(newPos);
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

    export const playEmote = (emoteId: number) => {
        currentEmote = emoteId;
    };

    onMount(() => {
        console.log("Online Player mounted");
    });

    onDestroy(() => {
        console.log("Player destroyed (" + userId + ")");
    });

    $: {
        material.color.set(color);
    }

    $: {
        material.emissiveIntensity = hover ? 0.1 : 0;
    }

    let rigidBody: RRigidBody;
    let collider: RCollider;
    let socket: any;
    let mainPlayerPosition: Vector3 = new Vector3();
    let currentEmote: number | null;

    $: if (socketStore) socket = $socketStore;
    $: if (playerPositionStore) mainPlayerPosition = $playerPositionStore;

    const playerPushed = () => {
        if (!distanceIsEnough()) return;
        let direction = mainPlayerPosition.clone().sub(position);
        direction.negate();
        direction.y = 0;
        direction.normalize();
        direction.multiplyScalar(150);
        direction.y = 20;
        socket.emit("player-pushed", userId, direction);
    };

    const distanceIsEnough = (): boolean => {
        return mainPlayerPosition.distanceTo(position) < 10;
    };
</script>

<T.Group {position}>
    <T.Mesh
        on:click={() => {
            playerPushed();
        }}
        on:pointermove={(e) => (hover = distanceIsEnough())}
        on:pointerout={(e) => (hover = false)}
        castShadow
        {geometry}
        {material}
        rotation.y={meshRotation}
    />
    <TextBillboard text={nick} position={[0, 4, 0]} {color} />
    <Collider bind:collider shape="capsule" args={[0.3, 1]} />
    {#if currentEmote}
        <Emote emoteId={currentEmote} />
    {/if}
</T.Group>
