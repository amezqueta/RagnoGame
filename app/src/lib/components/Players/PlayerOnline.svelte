<script lang="ts">
    import { type Collider as RCollider } from "@dimforge/rapier3d-compat";
    import { onMount } from "svelte";
    import { T } from "@threlte/core";
    import { BoxGeometry, MeshStandardMaterial, Vector3 } from "three";
    import { onDestroy } from "svelte";
    import TextBillboard from "../TextBillboard.svelte";
    import { playAnimationStore, socketStore } from "../stores";
    import Emote from "../UI/Emote.svelte";
    import ClickableMesh from "../Shared/ClickableMesh.svelte";
    import CharacterOnline from "$lib/components/Players/CharacterOnline.svelte";
    import Character from "./Character.svelte";

    const material = new MeshStandardMaterial();
    material.emissive.set("white");
    const capsuleHeight = 1.6;
    const geometry = new BoxGeometry(2, capsuleHeight * 3, 2);

    export let userId: string = "";
    export let position: Vector3 = new Vector3();
    export let color: string = "#FF0000";
    export let nick: string = userId;
    export let rotation: number = 0;
    export let animation: any;

    $: {
        material.color.set(color);
    }

    export let playerEmote: number | null = -1;
    let emoteRef: Emote;
    $: if (emoteRef && playerEmote) {
        emoteRef.playEmote(playerEmote);
    }

    onMount(() => {
        console.log("Online Player mounted");
    });

    onDestroy(() => {
        console.log("Player destroyed (" + userId + ")");
    });

    let collider: RCollider;
    let socket: any;

    $: if (socketStore) socket = $socketStore;

    const onClickMesh = (mainPlayerPosition: Vector3) => {
        console.log("clickmesh");
        let direction = mainPlayerPosition.clone().sub(position);
        direction.negate();
        direction.y = 0;
        direction.normalize();
        direction.multiplyScalar(150);
        direction.y = 20;
        $playAnimationStore("Strike", 0.1, 0.2, 0);
        //socket.emit("player-pushed", userId, direction);
    };

    const onMouseOver = (hover: boolean) => {
        console.log(hover);
    };

    const onMouseOut = () => {
        console.log("mouseOut");
    };
</script>

<ClickableMesh position={[position.x, position.y, position.z]} {geometry} {material} {onClickMesh} {onMouseOver} {onMouseOut} {rotation} distance={8} visible={false} />
<T.Group position={[position.x, position.y, position.z]} rotation.y={rotation}>
    <CharacterOnline position={[0, -1, 0]} {animation} />
    <TextBillboard text={nick} position={[0, 4, 0]} {color} />
    <Emote bind:this={emoteRef} />
</T.Group>
