<script lang="ts">
    import { onMount } from "svelte";
    import { T } from "@threlte/core";
    import { CapsuleGeometry, MeshStandardMaterial, Vector3 } from "three";
    import { onDestroy } from "svelte";
    import TextBillboard from "../TextBillboard.svelte";
    import Emote from "../UI/Emote.svelte";
    import ClickableMesh from "../Shared/ClickableMesh.svelte";
    import CharacterOnline from "$lib/components/Players/CharacterOnline.svelte";
    import Player from "./Player.svelte";
    import { Collider, RigidBody } from "@threlte/rapier";
    import { type RigidBody as RRigidBody } from "@dimforge/rapier3d-compat";

    const material = new MeshStandardMaterial();
    material.emissive.set("white");
    const geometry = new CapsuleGeometry(0.3, 2);

    export let playerId: string = "";
    export let position: Vector3 = new Vector3();
    export let color: string = "#FF0000";
    export let nick: string = playerId;
    export let rotation: number = 0;
    export let animation: any;
    export let mainPlayerRef: Player;
    export let characterSettings: CharacterSettings;

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
        console.log("Player destroyed (" + playerId + ")");
    });

    let hoverCharacter = false;
    const onClickMesh = (mainPlayerPosition: Vector3) => {
        mainPlayerRef.onClickOtherPlayer(position, playerId);
    };

    const onMouseOver = (hover: boolean) => {
        if (hover) hoverCharacter = true;
    };

    const onMouseOut = () => {
        hoverCharacter = false;
    };

    let rigidBody: RRigidBody;
    $: if (rigidBody) rigidBody.setTranslation(position, true);
</script>

<ClickableMesh position={[position.x, position.y, position.z]} {geometry} {material} {onClickMesh} {onMouseOver} {onMouseOut} {rotation} distance={1.5} visible={false} />
<RigidBody bind:rigidBody type="kinematicPosition" userData={{ playerId: playerId }}>
    <T.Group rotation.y={rotation}>
        <CharacterOnline position={[0, -1, 0]} {animation} {hoverCharacter} {characterSettings} />
        <TextBillboard text={nick} position={[0, 1.5, 0]} {color} />
        <Emote bind:this={emoteRef} />
        <Collider shape="capsule" args={[0.8, 0.4]} />
    </T.Group>
</RigidBody>
