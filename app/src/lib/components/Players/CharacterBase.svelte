<script lang="ts">
    import { T, useTask } from "@threlte/core";
    import { useGltf, useGltfAnimations, useSuspense, useTexture } from "@threlte/extras";
    import { AnimationAction, Color, Group, LoopOnce, MeshToonMaterial, NearestFilter } from "three";
    import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";

    export let hoverCharacter = false;

    export let ref = new Group();

    const suspend = useSuspense();
    const gltf = suspend(useGltf("/model/character/character.glb", { useDraco: "/" }));

    let instancedMesh: any;
    export const { actions, mixer } = useGltfAnimations(gltf, ref);
    $: if ($gltf && $actions && !instancedMesh) {
        configureAnimationOnce(getAction("JumpStart"));
        configureAnimationOnce(getAction("JumpEnd"));
        getAction("Idle")?.play();
        getAction("Idle")?.setEffectiveWeight(1);
        instancedMesh = SkeletonUtils.clone($gltf.scene);
    }

    export const getAction = (name: string): AnimationAction | undefined => {
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

    const stopFadeOutAnimations = () => {
        (Object.keys($actions) as string[]).forEach((anim) => {
            if (getAction(anim).getEffectiveWeight() <= 0) {
                getAction(anim)?.stop();
                getAction(anim)?.setEffectiveWeight(1);
            }
        });
    };

    useTask(() => {
        stopFadeOutAnimations();
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
