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

    export const { actions, mixer } = useGltfAnimations(gltf, ref);
    let instancedMesh: any;
    $: if ($gltf) {
        configureAnimationOnce($actions["JumpStart"]);
        configureAnimationOnce($actions["JumpEnd"]);
        instancedMesh = SkeletonUtils.clone($gltf.scene);
    }

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

    $: if (animation) {
        let actionKey = animation.actionKey;
        let fadeInTime = animation.fadeInTime;
        let fadeOutTime = animation.fadeOutTime;
        let delay = animation.delay;
        animations.push({ actionKey, fadeInTime, fadeOutTime, delay });
        playAnimation(actionKey, fadeInTime, fadeOutTime, delay);
    }

    let animations: any[] = [];

    let savedFadeOutTime: number = 0;
    let savedDelay: number = 0;
    const playAnimation = (anim: string, fadeInTime: number = 0.2, fadeOutTime: number = 0.2, _savedDelay: number = 0.0) => {
        console.log(animations);
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
        {#if instancedMesh}
            <T is={instancedMesh} name="Scene" />
        {/if}
    {:catch error}
        <slot name="error" {error} />
    {/await}
    <slot {ref} />
</T>
