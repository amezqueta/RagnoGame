<script lang="ts">
    import { T } from "@threlte/core";
    import { Vector3 } from "three";
    import { playerDataStore } from "../stores";
    import TextBillboard from "../TextBillboard.svelte";
    export let position: number[];
    export let text: string;
    export let color: string = "#FF00FF";
    let active: boolean;

    $: if (playerDataStore) {
        active = $playerDataStore.privileges > 5;
    }
</script>

{#if active}
    <TextBillboard {text} {position} {color} fontSize={0.5} outlineWidth={0} />
    <T.ArrowHelper args={[new Vector3(0, -1, 0), new Vector3(position[0], position[1] + 1, position[2]), 1, color, 0.2, 0.2]} />
{/if}
