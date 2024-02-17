<script lang="ts">
    import { T, useTask } from "@threlte/core";
    import CharacterBase from "./CharacterBase.svelte";

    export let animation: any;
    export let hoverCharacter = false;
    export let characterSettings: CharacterSettings;

    let currentActionKey: string = "Idle";
    let base: CharacterBase;

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

    $: if (base) {
        animations.push({ actionKey, fadeInTime, fadeOutTime, delay });
        playAnimation(actionKey, fadeInTime, fadeOutTime, delay);
    }

    const onLoaded = () => {
        animations.push({ actionKey: "Idle", fadeInTime: 0, fadeOutTime: 0, delay: 0 });
    };

    let animations: any[] = [];
    let savedFadeOutTime: number = 0;
    let waitDuration: number = 0;
    export const playAnimation = (anim: string, fadeInTime: number = 0.2, fadeOutTime: number = 0.2, duration: number = 0.0) => {
        if (waitDuration > 0) {
            waitDuration -= deltaTime;
            return;
        }

        base.getAction(currentActionKey)?.fadeOut(savedFadeOutTime);

        base.getAction(anim)?.play();
        base.getAction(anim)?.fadeIn(fadeInTime);

        currentActionKey = anim;
        savedFadeOutTime = fadeOutTime;
        waitDuration = duration - 0.05;

        animations.splice(0, 1);
    };

    const catchupAnimations = () => {
        if (animations.length <= 0) return;
        const a = animations[0];
        playAnimation(a.actionKey, a.fadeInTime, a.fadeOutTime, a.delay);
    };

    let deltaTime: number = 0;
    useTask((delta) => {
        catchupAnimations();
        deltaTime = delta;
    });
</script>

<T.Group position.y={-1}>
    <CharacterBase bind:this={base} {hoverCharacter} {onLoaded} {characterSettings} />
</T.Group>
