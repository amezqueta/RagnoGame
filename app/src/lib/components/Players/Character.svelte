<script lang="ts">
    import { GLTF, useGltfAnimations } from "@threlte/extras";
    import { useControls } from "../../hooks/useControls";

    export let rotation: number = 0;
    export let velocity: number = 0;

    const { gltf, actions } = useGltfAnimations();

    $: if ($gltf) {
        console.log($gltf);
        $actions["idle"]?.play();
        $actions["run"]?.play();
        $actions["run"]?.setEffectiveWeight(0);
    }

    $: if (velocity) {
        $actions["run"]?.setEffectiveWeight(velocity / 25);
    }
</script>

<GLTF castShadow position.y={-1} rotation.y={rotation} bind:gltf={$gltf} url="https://threejs.org/examples/models/gltf/Xbot.glb" />
