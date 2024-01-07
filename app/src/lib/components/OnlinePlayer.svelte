<script lang="ts">
    import { onMount } from "svelte";
    import { T } from "@threlte/core";
    import { BoxGeometry, MeshStandardMaterial } from "three";
    import { onDestroy } from "svelte";
    import TextBillboard from "./TextBillboard.svelte";

    const material = new MeshStandardMaterial();
    const geometry = new BoxGeometry(2, 2, 2);

    export let userId: string = "";
    export let position = [0, 0, 0];
    let textPosition = [0, 2, 0];
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

    $: textPosition = [position[0] + 0, position[1] + 3, position[2] + 0];

    $: {
        material.color.set(color);
    }
</script>

<T.Mesh castShadow {geometry} {material} {position} />
<TextBillboard text={nick} position={textPosition} {color} />
