<script lang="ts">
    import { onMount } from "svelte";
    import { T } from "@threlte/core";
    import { BoxGeometry, Group, MeshStandardMaterial } from "three";
    import { onDestroy } from "svelte";
    import TextBillboard from "../TextBillboard.svelte";
    import { Collider } from "@threlte/rapier";

    const material = new MeshStandardMaterial();
    const geometry = new BoxGeometry(2, 2, 2);

    export let userId: string = "";
    export let position = [0, 0, 0];
    export let color: string = "#FF0000";
    export let nick: string = userId;

    export function SetPosition(newPos: any) {
        position = [newPos.x, newPos.y, newPos.z];
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
</script>

<T.Group {position}>
    <T.Mesh castShadow {geometry} {material} />
    <TextBillboard text={nick} position={[0, 3, 0]} {color} />
</T.Group>
