<script lang="ts">
    import { GLTF, useGltfAnimations } from "@threlte/extras";
    import { useControls } from "../../hooks/useControls";
    import { VectorKeyframeTrack, Vector3 } from "three";

    export let rotation: number = 0;
    export let velocity: number = 0;
    export let sideWalk = false;
    export let rightControl: number = 0;

    const { gltf, actions } = useGltfAnimations();

    $: if ($gltf) {
        $actions["Idle"]?.play();
        $actions["Run"]?.play();
        $actions["Run"]?.setEffectiveWeight(0);
        $actions["StrifeRight"]?.play();
        $actions["StrifeRight"]?.setEffectiveWeight(0);
        $actions["StrifeLeft"]?.play();
        $actions["StrifeLeft"]?.setEffectiveWeight(0);
    }

    $: if (velocity) {
        if (!sideWalk) {
            $actions["Run"]?.setEffectiveWeight(velocity / 25);
            $actions["Idle"]?.setEffectiveWeight(0);
            $actions["StrifeRight"]?.setEffectiveWeight(0);
            $actions["StrifeLeft"]?.setEffectiveWeight(0);
        } else {
            $actions["Run"]?.setEffectiveWeight(0);
            $actions["Idle"]?.setEffectiveWeight(0);
            if (rightControl == 1) {
                $actions["StrifeRight"]?.setEffectiveWeight(velocity / 25);
                $actions["StrifeLeft"]?.setEffectiveWeight(0);
            } else if (rightControl == -1) {
                $actions["StrifeLeft"]?.setEffectiveWeight(velocity / 25);
                $actions["StrifeRight"]?.setEffectiveWeight(0);
            }
        }
    }
</script>

<GLTF castShadow position.y={-1} rotation.y={rotation} bind:gltf={$gltf} url="model/character/char.glb" />
