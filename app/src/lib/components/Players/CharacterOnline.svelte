<script lang="ts">
    import { T, useTask } from "@threlte/core";
    import { useGltf, useGltfAnimations, useSuspense } from "@threlte/extras";
    import { AnimationAction, Group, LoopOnce } from "three";
    import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";

    export let animation: any;

    export let ref = new Group();
    let currentActionKey: string = "Idle";

    const suspend = useSuspense();
    const gltf = suspend(useGltf("/model/character/char.glb", { useDraco: "/" }));

    export const { actions, mixer } = useGltfAnimations(gltf, ref);

    $: if ($gltf) {
        configureAnimationOnce($actions["JumpStart"]);
        configureAnimationOnce($actions["JumpEnd"]);
    }

    const configureAnimationOnce = (anim: AnimationAction | undefined) => {
        if (!anim) return;
        anim.clampWhenFinished = true;
        anim.setLoop(LoopOnce, 1);
    };

    let deltaTime: number = 0;
    useTask((delta) => {
        stopFadeOutAnimations();
        deltaTime = delta;
    });

    let actionKey: string;
    let fadeInTime: number;
    let fadeOutTime: number;
    let delay: number;

    $: if (animation) {
        actionKey = animation.actionKey;
        fadeInTime = animation.fadeInTime;
        fadeOutTime = animation.fadeOutTime;
        delay = animation.delay;
    }

    let animations: any[] = [];

    $: {
        animations.push({ actionKey, fadeInTime, fadeOutTime, delay });
        playAnimation(actionKey, fadeInTime, fadeOutTime, delay);
    }

    let savedFadeOutTime: number = 0;
    let savedDelay: number = 0;
    const playAnimation = (anim: string, fadeInTime: number = 0.2, fadeOutTime: number = 0.2, _savedDelay: number = 0.0) => {
        if (savedDelay > 0) {
            savedDelay -= deltaTime;
            return;
        }

        $actions[currentActionKey]?.fadeOut(savedFadeOutTime);

        $actions[anim]?.play();
        $actions[anim]?.fadeIn(fadeInTime);

        currentActionKey = anim;
        savedFadeOutTime = fadeOutTime;
        savedDelay = _savedDelay;
        animations.splice(0, 1);
    };

    const stopFadeOutAnimations = () => {
        (Object.keys($actions) as string[]).forEach((anim) => {
            if ($actions[anim].getEffectiveWeight() <= 0) {
                $actions[anim]?.stop();
                $actions[anim]?.setEffectiveWeight(1);
            }
        });
    };

    const catchupAnimations = () => {
        if (animations.length <= 0) return;
        const a = animations[0];
        playAnimation(a.actionKey, a.fadeInTime, a.fadeOutTime, a.delay);
    };

    useTask(() => {
        stopFadeOutAnimations();
        catchupAnimations();
    });
</script>

<T is={ref} dispose={false} {...$$restProps}>
    {#await gltf}
        <slot name="fallback" />
    {:then gltf}
        <T is={SkeletonUtils.clone(gltf.scene)} name="Scene" />
    {:catch error}
        <slot name="error" {error} />
    {/await}
    <slot {ref} />
</T>
