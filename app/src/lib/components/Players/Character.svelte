<script lang="ts">
    import { Group, Vector3, LoopOnce, AnimationAction } from "three";
    import { T, useTask } from "@threlte/core";
    import { useGltf, useGltfAnimations, useSuspense } from "@threlte/extras";
    import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";
    import type { Writable } from "svelte/store";
    import { clamp } from "svelte-tweakpane-ui/Utils.js";
    import { playAnimationStore } from "../stores";
    import SpecialActionType from "./Player.svelte";

    export let socket: any;
    export let velocity: Vector3 = new Vector3(0, 0, 0);
    export let isGrounded: Writable<boolean>;
    export let jumpStarted = false;
    export let specialAction: Writable<SpecialActionType>;

    export let ref = new Group();

    const suspend = useSuspense();
    const gltf = suspend(useGltf("/model/character/character.glb", { useDraco: "/" }));
    export const { actions, mixer } = useGltfAnimations(gltf, ref);

    // let runAction: any;
    // let hitAction: any;
    // let idleAction: any;
    $: if (mixer) {
        //     mixer.timeScale = 0.5;
        //     console.log($gltf);
        //     configureAnimationOnce($actions["JumpStart"]);
        //     configureAnimationOnce($actions["JumpEnd"]);
        //     const runAnimation = $actions["Run"];
        //     if (runAnimation) {
        //         runAction = mixer.clipAction(runAnimation.getClip(), ref);
        //     }

        //     const baseballHitAnimation = $actions["Strike"];
        //     const idleAnimation = $actions["Idle"];
        //     if (baseballHitAnimation && idleAnimation) {
        //         idleAction = mixer.clipAction(idleAnimation.getClip(), ref);
        //         hitAction = mixer.clipAction(baseballHitAnimation.getClip(), ref);
        //         hitAction.setEffectiveWeight(0.9);
        //     }
        idleTask.start();
    }

    // $: {
    //     if (hitAction && idleAction) AnimationUtils.makeClipAdditive(hitAction.getClip(), 1);
    // }

    // $: if (hitAction) {
    //     hitAction?.play();
    // }

    // $: if (runAction) {
    //     runAction?.play();
    // }

    const configureAnimationOnce = (anim: AnimationAction | undefined) => {
        if (!anim) return;
        anim.clampWhenFinished = true;
        anim.setLoop(LoopOnce, 1);
    };

    let yVel: number = 0;
    let xVel: number = 0;
    let zVel: number = 0;
    let xzVel: number = 0;
    $: if (velocity) {
        xVel = velocity.x;
        yVel = velocity.y;
        zVel = velocity.z;
        xzVel = new Vector3(xVel, 0, zVel).length();
    }

    const runTriggerThreshold: number = 0.1;
    //IDLE
    const { task: idleTask } = useTask(
        () => {
            if (!$isGrounded) {
                idleTask.stop();
                jumpTask.start();
            }

            if (xzVel > runTriggerThreshold) {
                idleTask.stop();
                runTask.start();
            }

            playAnimation("Idle");
        },
        { autoStart: false },
    );

    //JUMP
    let jumpTaskTime: number = 0;
    const { task: jumpTask } = useTask(
        (deltaTime) => {
            if ($isGrounded) {
                jumpTask.stop();
                idleTask.start();
                jumpTaskTime = 0;
                playAnimation("JumpEnd", 0.0, 0.2, 0.1);
            }

            if (jumpStarted) {
                playAnimation("JumpStart", 0.2);
                return;
            }

            jumpTaskTime += deltaTime;
            if (jumpTaskTime > 0.4) {
                playAnimation("JumpLoop");
                let loopDuration = clamp(1 / jumpTaskTime, 0.5, 1);
                $actions["JumpLoop"]?.setDuration(loopDuration);
                return;
            }
        },
        { autoStart: false },
    );

    //RUN
    const { task: runTask } = useTask(
        () => {
            if (jumpStarted) {
                runTask.stop();
                jumpTask.start();
            }
            if (xzVel <= runTriggerThreshold) {
                runTask.stop();
                idleTask.start();
            }

            $actions["Run"]?.setEffectiveTimeScale(xzVel / 10);
            playAnimation("Run");
        },
        { autoStart: false },
    );

    let deltaTime: number = 0;
    useTask((delta) => {
        mixer.update(delta);
        stopFadeOutAnimations();
        deltaTime = delta;
    });

    let currentActionKey: string = "Idle";
    let savedFadeOutTime: number = 0;
    let waitEndDelay: number = 0;
    const playAnimation = (anim: string, fadeInTime: number = 0.2, fadeOutTime: number = 0.2, endDelay: number = 0.0) => {
        if (waitEndDelay > 0) {
            waitEndDelay -= deltaTime;
            return;
        }

        if (currentActionKey === anim) return;

        $actions[currentActionKey]?.fadeOut(savedFadeOutTime);
        $actions[anim]?.play();
        $actions[anim]?.fadeIn(fadeInTime);

        currentActionKey = anim;
        savedFadeOutTime = fadeOutTime;
        waitEndDelay = endDelay;

        socket?.emit("playAnimation", currentActionKey, fadeInTime, savedFadeOutTime, waitEndDelay);
    };

    $: if (socket && playAnimation && $actions) {
        playAnimationStore.set(playAnimation);
    }

    const stopFadeOutAnimations = () => {
        (Object.keys($actions) as string[]).forEach((anim) => {
            if ($actions[anim].getEffectiveWeight() <= 0) {
                $actions[anim]?.stop();
                $actions[anim]?.setEffectiveWeight(1);
            }
        });
    };

    $: if ($specialAction !== 0) playAnimation($specialAction, 0.1, 0.1, 0);
</script>

<T is={ref} dispose={false} {...$$restProps}>
    {#await gltf}
        <slot name="fallback" />
    {:then gltf}
        <T is={SkeletonUtils.clone(gltf.scene)} />
    {:catch error}
        <slot name="error" {error} />
    {/await}
    <slot {ref} />
</T>
