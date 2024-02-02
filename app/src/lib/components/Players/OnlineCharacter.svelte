<script lang="ts">
    import {Group, Vector3, LoopOnce, AnimationAction} from "three";
    import { T, forwardEventHandlers, useTask } from "@threlte/core";
    import { useGltf, useGltfAnimations, useSuspense } from "@threlte/extras";
    import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";

    export let socket: any;

    export let userId: string;
    export let ref = new Group();
    let currentActionKey: ActionName = "Idle";

    const suspend = useSuspense();
    let action: ActionName = "Run";
    type ActionName = "Run" | "Idle" | "JumpStart" | "JumpLoop" | "JumpEnd" | "StrifeRight" | "StrifeLeft";
    const gltf = suspend(useGltf("/model/character/char.glb", { useDraco: "/" }));

    export const { actions, mixer } = useGltfAnimations<ActionName>(gltf, ref);
    const component = forwardEventHandlers();

    $: if ($gltf) {
        configureAnimationOnce($actions["JumpStart"]);
        configureAnimationOnce($actions["JumpEnd"]);
    }

    const configureAnimationOnce = (anim: AnimationAction | undefined) => {
        if(!anim) return;
        anim.clampWhenFinished = true;
        anim.setLoop(LoopOnce, 1);
    }

    let deltaTime: number = 0;
    useTask((delta) => {
        stopFadeOutAnimations();
        deltaTime = delta;
    });

    let savedFadeOutTime: number = 0;
    let savedDelay: number = 0;
    const playAnimation = (anim: ActionName, fadeInTime: number = 0.2, fadeOutTime: number = 0.2, _savedDelay: number = 0.0) => {
        console.log(anim);
        if(savedDelay>0){
            savedDelay-= deltaTime;
            return;
        }

        if(currentActionKey === anim)
            return;

        $actions[currentActionKey]?.fadeOut(savedFadeOutTime);
        $actions[anim]?.play();
        $actions[anim]?.fadeIn(fadeInTime);

        currentActionKey = anim;
        savedFadeOutTime = fadeOutTime;
        savedDelay = _savedDelay;
    };

    socket.on("playAnimation", (_userId: string, actionKey: string, fadeInTime: number, fadeOutTime: number, delay: number) => {
        console.log(userId);
        playAnimation($actions[actionKey], fadeInTime, fadeOutTime, delay);
    });

    const stopAnimation = (anim: ActionName, fadeOutTime: number = 0.2) => {
        $actions[anim]?.fadeOut(fadeOutTime);
    };

    const stopFadeOutAnimations = () => {
        (Object.keys($actions) as ActionName[]).forEach((anim) => {
            if ($actions[anim].getEffectiveWeight() <= 0) {
                $actions[anim]?.stop();
                $actions[anim]?.setEffectiveWeight(1);
            }
        });
    };
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
