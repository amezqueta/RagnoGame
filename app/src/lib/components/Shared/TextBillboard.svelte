<script lang="ts">
    import { useTask, useThrelte } from "@threlte/core";
    import { Text } from "@threlte/extras";

    export let text = "";
    export let position = [0, 0, 0];
    export let color = "#FFFFFF";
    export let outlineColor = "#000000";
    export let fontSize = 0.2;
    export let outlineWidth = 0.015;

    let textMesh: any;
    let rotation = [0, 0, 0];

    const { camera } = useThrelte();

    useTask(() => {
        if (textMesh == null) return;
        textMesh.lookAt(camera.current.position);
    });
</script>

<Text
    on:create={(ref) => {
        textMesh = ref.ref;
    }}
    {text}
    {position}
    {color}
    {fontSize}
    {outlineWidth}
    {outlineColor}
    {rotation}
    anchorX="center"
/>
