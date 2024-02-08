<script lang="ts">
    import { T, useTask } from "@threlte/core";
    import { useGltf, useGltfAnimations, useSuspense, useTexture } from "@threlte/extras";
    import { AnimationAction, Color, Group, LoopOnce, MeshToonMaterial, NearestFilter } from "three";
    import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";

    export let animation: any;
    export let hoverCharacter = false;

    export let ref = new Group();
    let currentActionKey: string = "Idle";

    const suspend = useSuspense();
    const gltf = suspend(useGltf("/model/character/character.glb", { useDraco: "/" }));

    let instancedMesh: any;
    export const { actions, mixer } = useGltfAnimations(gltf, ref);
    $: if ($gltf && $actions && !instancedMesh) {
        configureAnimationOnce(getAction("JumpStart"));
        configureAnimationOnce(getAction("JumpEnd"));
        instancedMesh = SkeletonUtils.clone($gltf.scene);
    }

    const getAction = (name: string): AnimationAction | undefined => {
        const anim = $actions[name];
        return anim;
    };

    const map = useTexture("tex/char/character.png", {
        transform: (texture) => {
            texture.magFilter = NearestFilter;
            return texture;
        },
    });
    let characterMaterial: MeshToonMaterial | null;
    $: if ($map) {
        characterMaterial = new MeshToonMaterial();
        characterMaterial.map = $map;
    }

    $: if (instancedMesh && characterMaterial) {
        instancedMesh.traverse((child: any) => {
            if (child.material) {
                child.material = characterMaterial;
                return;
            }
        });
    }

    $: if (characterMaterial && (hoverCharacter || !hoverCharacter)) {
        characterMaterial.emissive = hoverCharacter ? new Color(0.3, 0.3, 0.3) : new Color(0, 0, 0);
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

    $: {
        animations.push({ actionKey, fadeInTime, fadeOutTime, delay });
        playAnimation(actionKey, fadeInTime, fadeOutTime, delay);
    }

    let animations: any[] = [];

    let savedFadeOutTime: number = 0;
    let savedDelay: number = 0;
    const playAnimation = (anim: string, fadeInTime: number = 0.2, fadeOutTime: number = 0.2, _savedDelay: number = 0.0) => {
        if (savedDelay > 0) {
            savedDelay -= deltaTime;
            return;
        }

        getAction(currentActionKey)?.fadeOut(savedFadeOutTime);

        getAction(anim)?.play();
        getAction(anim)?.fadeIn(fadeInTime);

        currentActionKey = anim;
        savedFadeOutTime = fadeOutTime;
        savedDelay = _savedDelay;
        animations.splice(0, 1);
    };

    const stopFadeOutAnimations = () => {
        (Object.keys($actions) as string[]).forEach((anim) => {
            if (getAction(anim).getEffectiveWeight() <= 0) {
                getAction(anim)?.stop();
                getAction(anim)?.setEffectiveWeight(1);
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
        {#if instancedMesh}
            <T is={instancedMesh} name="Scene" />
        {/if}
    {:catch error}
        <slot name="error" {error} />
    {/await}
    <slot {ref} />
</T>
