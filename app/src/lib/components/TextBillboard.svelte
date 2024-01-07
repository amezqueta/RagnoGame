<script lang="ts">
    import { useTask, useThrelte } from "@threlte/core";
    import { Text } from "@threlte/extras";

    export let text = "";
    export let position = [0, 0, 0];
    export let color = "#FFFFFF";

    let textMesh: any;
    let rotation = [0, 0, 0];

    const { camera } = useThrelte();

    useTask(() => {
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
    fontSize={1}
    outlineWidth={0.03}
    outlineColor="#000000"
    {rotation}
    anchorX="center"
/>
