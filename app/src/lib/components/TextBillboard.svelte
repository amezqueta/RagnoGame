<script lang="ts">
    import { useThrelte } from "@threlte/core";
    import { Text } from "@threlte/extras";

    export let text = "";
    export let position = [0, 0, 0];
    export let color = "#FFFFFF";

    let ref;

    let rotation = [0, 0, 0];

    const { camera } = useThrelte();
</script>

// TextBillboard.svelte
<Text
    bind:this={ref}
    {text}
    {position}
    {color}
    fontSize={1}
    outlineWidth={0.03}
    outlineColor="#000000"
    {rotation}
    anchorX="center"
/>
