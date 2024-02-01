<script lang="ts">
    import { Group } from "three";
    import { T, forwardEventHandlers } from "@threlte/core";
    import { useGltf, useGltfAnimations, useSuspense } from "@threlte/extras";
    import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";

    export let ref = new Group();
    export let currentActionKey: ActionName = "Run";

    const suspend = useSuspense();
    let action: ActionName = "Run";
    type ActionName = "Run" | "Idle" | "Jump";
    const gltf = suspend(useGltf("/models/char.glb", { useDraco: "/" }));

    export const { actions, mixer } = useGltfAnimations<ActionName>(gltf, ref);
    const component = forwardEventHandlers();

    $: $actions[action]?.play();
    $: $actions[currentActionKey] && transitionTo(currentActionKey, 0.2);
    function transitionTo(nextActionKey: ActionName, duration = 1) {
        const currentAction = $actions[action];
        const nextAction = $actions[nextActionKey];
        if (!nextAction || currentAction === nextAction) return;
        nextAction.enabled = true;
        if (currentAction) {
            currentAction.crossFadeTo(nextAction, duration, true);
        }
        nextAction.play();
        action = nextActionKey;
    }
</script>

<T is={ref} dispose={false} {...$$restProps} bind:this={$component}>
    {#await gltf}
        <slot name="fallback" />
    {:then gltf}
        <T is={SkeletonUtils.clone(gltf.scene)} name="Scene" />
    {:catch error}
        <slot name="error" {error} />
    {/await}
    <slot {ref} />
</T>
