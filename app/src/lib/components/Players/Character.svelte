<script lang="ts">
    import { Vector3 } from "three";
    import { useTask } from "@threlte/core";
    import type { Writable } from "svelte/store";
    import { clamp } from "svelte-tweakpane-ui/Utils.js";
    import CharacterBase from "./CharacterBase.svelte";
    import { characterSettingsStore } from "$lib/stores/characterSettingsStore";
    import { playerDataStore } from "../stores";

    export let socket: any;
    export let velocity: Vector3 = new Vector3(0, 0, 0);
    export let isGrounded: Writable<boolean>;
    export let jumpStarted = false;
    export let cameraControlPressed = false;
    export let rightControl: number = 0;
    export let forwardControl: number = 0;

    let base: CharacterBase;

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

    const onLoaded = () => {};

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
        { autoStart: false }
    );

    //JUMP
    let jumpTaskTime: number = 0;
    const { task: jumpTask } = useTask(
        (deltaTime) => {
            if ($isGrounded) {
                jumpTask.stop();
                idleTask.start();
                jumpTaskTime = 0;
                playAnimation("JumpEnd", 0, 0.2, 0.4);
            }

            if (jumpStarted) {
                playAnimation("JumpStart", 0.05, 0.2);
                return;
            }

            jumpTaskTime += deltaTime;
            if (jumpTaskTime > 0.2) {
                playAnimation("JumpLoop", 0.2, 0.1);
                let loopDuration = clamp(1 / jumpTaskTime, 0.5, 1);
                base.getAction("JumpLoop")?.setDuration(loopDuration);
                return;
            }
        },
        { autoStart: true }
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

            if (cameraControlPressed && rightControl !== 0) {
                playAnimation(rightControl === 1 ? "RightStrafe" : "LeftStrafe");
            } else {
                base.getAction("Run")?.setEffectiveTimeScale(forwardControl === -1 && cameraControlPressed ? -1 : 1);
                playAnimation("Run");
            }
        },
        { autoStart: false }
    );

    let deltaTime: number = 0;
    useTask((delta) => {
        deltaTime = delta;
    });

    let currentActionKey: string = "";
    let savedFadeOutTime: number = 0;
    let waitDuration: number = 0;
    export const playAnimation = (anim: string, fadeInTime: number = 0.2, fadeOutTime: number = 0.2, duration: number = 0.0) => {
        if (waitDuration > 0) {
            waitDuration -= deltaTime;
            return;
        }

        if (currentActionKey === anim) return;

        base.getAction(currentActionKey)?.fadeOut(savedFadeOutTime);
        base.getAction(anim)?.fadeIn(fadeInTime).play();

        currentActionKey = anim;
        savedFadeOutTime = fadeOutTime;
        waitDuration = duration;

        socket?.emit("playAnimation", currentActionKey, fadeInTime, savedFadeOutTime, waitDuration);
    };

    //This action will have the duration of the animation, and optionally can stop the player from moving
    export const playSpecialAnimation = (anim: string, fadeInTime: number = 0.2, fadeOutTime: number = 0.2, haltMovement: ((time: number) => void) | null = null) => {
        const duration = base.getAction(anim)?.getClip()?.duration;
        if (!duration) return;
        playAnimation(anim, fadeInTime, fadeOutTime, duration);
        if (haltMovement) haltMovement(duration - fadeOutTime - 0.1);
    };

    //On loading the character, needs to know the weapon that is holding
    $: if (playerDataStore && $playerDataStore) {
        characterSettingsStore.set($playerDataStore.characterSettings);
    }
</script>

<CharacterBase bind:this={base} {onLoaded} characterSettings={$characterSettingsStore} addColliderToWeapon />
