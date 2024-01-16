<script lang="ts">
    import { type Collider as RCollider, type RigidBody as RRigidBody } from "@dimforge/rapier3d-compat";
    import { onMount } from "svelte";
    import { T } from "@threlte/core";
    import { BoxGeometry, Group, MeshStandardMaterial, Vector3 } from "three";
    import { onDestroy } from "svelte";
    import TextBillboard from "../TextBillboard.svelte";
    import { Collider, RigidBody } from "@threlte/rapier";
    import { cameraControlPressedStore, playerColorStore, playerRigidbodyStore, privilegesStore, playerPositionStore, playerVelocityStore, socketStore, mouseXStore, mouseYStore } from "../stores";
    import { interactivity } from "@threlte/extras";

    let mouseX: number = 0;
    let mouseY: number = 0;
    interactivity({
        filter: (hits, state) => {
            let x: number = (mouseX / window.innerWidth) * 2 - 1;
            let y = mouseY / window.innerHeight - 0.5;
            //state.pointer.current.x = x;
            //state.pointer.current.y = y;
            console.log(state.pointer.current.x + " " + x);
            return hits;
        },
    });

    const material = new MeshStandardMaterial();
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
    let collider: RCollider;
    let socket: any;
    let mainPlayerPosition: Vector3 = new Vector3();

    $: if (socketStore) socket = $socketStore;
    $: if (playerPositionStore) mainPlayerPosition = $playerPositionStore;
    $: if ($mouseXStore && $mouseYStore) {
        mouseX = $mouseXStore;
        mouseY = $mouseYStore;
    }

    const playerPushed = () => {
        console.log("pushed ");
        return;
        if (mainPlayerPosition.distanceTo(position) > 10) return;
        let direction = mainPlayerPosition.clone().sub(position);
        direction.negate();
        direction.y = 0;
        direction.normalize();
        direction.multiplyScalar(150);
        direction.y = 20;
        socket.emit("player-pushed", userId, direction);
    };
</script>

<T.Group {position}>
    <T.Mesh
        on:click={() => {
            playerPushed();
        }}
        castShadow
        {geometry}
        {material}
        rotation.y={meshRotation}
    />
    <TextBillboard text={nick} position={[0, 4, 0]} {color} />
    <Collider bind:collider shape="capsule" args={[0.3, 1]} />
</T.Group>
