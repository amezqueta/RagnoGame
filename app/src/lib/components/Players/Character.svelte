<script lang="ts">
    import { Group, Vector3, LoopOnce } from "three";
    import { T, forwardEventHandlers, useTask } from "@threlte/core";
    import { useGltf, useGltfAnimations, useSuspense } from "@threlte/extras";
    import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";
    import type { Writable } from "svelte/store";
    import type { Action } from "svelte/action";

    export let velocity: Vector3 = new Vector3(0, 0, 0);
    export let isGrounded: Writable<boolean>;
    export let jumpStarted = false;

    export let ref = new Group();
    let currentActionKey: ActionName = "Idle";

    const suspend = useSuspense();
    let action: ActionName = "Run";
    type ActionName = "Run" | "Idle" | "JumpStart" | "JumpLoop" | "JumpEnd";
    const gltf = suspend(useGltf("/model/character/char.glb", { useDraco: "/" }));

    export const { actions, mixer } = useGltfAnimations<ActionName>(gltf, ref);
    const component = forwardEventHandlers();

    // $: $actions[action]?.play();
    // $: $actions[currentActionKey] && transitionTo(currentActionKey, 0.2);
    // function transitionTo(nextActionKey: ActionName, duration = 0.2) {
    //     const currentAction = $actions[action];
    //     const nextAction = $actions[nextActionKey];
    //     if (!nextAction || currentAction === nextAction) return;
    //     nextAction.enabled = true;
    //     if (currentAction) {
    //         currentAction.crossFadeTo(nextAction, duration, true);
    //     }
    //     nextAction.play();
    //     action = nextActionKey;
    // }

    $: if ($gltf) {
        const ac = $actions["JumpStart"]
        if (ac) {
            ac.setLoop(LoopOnce, 1);
            ac.clampWhenFinished = true;
        }
    }

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

    //IDLE
    const { task: idleTask } = useTask(
        () => {
            if (!$isGrounded) {
                idleTask.stop();
                jumpTask.start();
            }
            playAnimation("Idle");
        },
        { autoStart: false },
    );

    //JUMP
    let jumpTaskTime: number = 0;
    const { task: jumpTask } = useTask((deltaTime) => {
        if ($isGrounded) {
            jumpTask.stop();
            idleTask.start();
            jumpTaskTime = 0;
        }

        jumpTaskTime += deltaTime;

        if (jumpStarted) {
            playAnimation("JumpStart", 0.0);
        }
    });

    //RUN
    const { task: runTask } = useTask(() => {}, { autoStart: false });

    useTask(() => {
        stopFadeOutAnimations();
    });

    const playAnimation = (anim: ActionName, fadeInTime: number = 0.2) => {
        $actions[currentActionKey]?.fadeOut(0.2);
        currentActionKey = anim;
        $actions[anim]?.play();
        $actions[anim]?.fadeIn(0.2);
    };

    const stopAnimation = (anim: ActionName, fadeOutTime: number = 0.2) => {
        $actions[anim]?.fadeOut(fadeOutTime);
    };

    const stopFadeOutAnimations = () => {
        (Object.keys($actions) as ActionName[]).forEach((anim) => {
            if ($actions[anim].getEffectiveWeight() <= 0 || !$actions[anim]?.isRunning()) {
                $actions[anim]?.stop();
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
