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
        mainPlayerRef.onClickCharacter(position, playerId);
    };

    const onMouseOver = (hover: boolean) => {
        hoverCharacter = true;
    };

    const onMouseOut = () => {
        hoverCharacter = false;
    };
</script>

<ClickableMesh position={[position.x, position.y, position.z]} {geometry} {material} {onClickMesh} {onMouseOver} {onMouseOut} {rotation} distance={8} visible={false} />
<T.Group position={[position.x, position.y, position.z]} rotation.y={rotation}>
    <CharacterOnline position={[0, -1, 0]} {animation} {hoverCharacter} />
    <TextBillboard text={nick} position={[0, 4, 0]} {color} />
    <Emote bind:this={emoteRef} />
</T.Group>
