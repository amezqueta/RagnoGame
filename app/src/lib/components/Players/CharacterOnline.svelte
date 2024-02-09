<script lang="ts">
    import { useTask } from "@threlte/core";
    import { Group } from "three";
    import CharacterBase from "./CharacterBase.svelte";

    export let animation: any;
    export let hoverCharacter = false;

    export let ref = new Group();
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

    let animations: any[] = [];

    let savedFadeOutTime: number = 0;
    let savedDelay: number = 0;
    export const playAnimation = (anim: string, fadeInTime: number = 0.2, fadeOutTime: number = 0.2, _savedDelay: number = 0.0) => {
        if (savedDelay > 0) {
            savedDelay -= deltaTime;
            return;
        }

        base.getAction(currentActionKey)?.fadeOut(savedFadeOutTime);

        base.getAction(anim)?.play();
        base.getAction(anim)?.fadeIn(fadeInTime);

        currentActionKey = anim;
        savedFadeOutTime = fadeOutTime;
        savedDelay = _savedDelay;
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

<CharacterBase bind:this={base} {hoverCharacter} {ref} />
