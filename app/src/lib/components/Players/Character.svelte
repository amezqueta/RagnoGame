<script lang="ts">
    import { onDestroy } from "svelte";
    import { GLTF, useGltfAnimations } from "@threlte/extras";
    import { useControls } from "../../hooks/useControls";
    import { onMount } from "svelte";

    export let rotation: number = 0;

    const { controlAxis, controlActions } = useControls();
    const { gltf, actions } = useGltfAnimations();

    $: if ($gltf) {
        console.log($gltf);
        $actions["idle"]?.play();
    }
</script>

<GLTF position.y={-1} rotation.y={rotation} bind:gltf={$gltf} url="https://threejs.org/examples/models/gltf/Xbot.glb" />
