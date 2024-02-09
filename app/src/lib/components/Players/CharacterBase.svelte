<script lang="ts">
    import { T, useStage, useTask, useThrelte } from "@threlte/core";
    import { useGltf, useGltfAnimations, useSuspense, useTexture } from "@threlte/extras";
    import { AnimationAction, Color, Group, LoopOnce, MeshToonMaterial, NearestFilter } from "three";
    import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";

    export let hoverCharacter = false;

    export let ref = new Group();
    export let onLoaded: () => void;

    const { renderStage } = useThrelte();
    const afterRenderStage = useStage("after-render", {
        after: renderStage,
    });

    const suspend = useSuspense();
    const gltf = suspend(useGltf("/model/character/character.glb", { useDraco: "/" }));

    let instancedMesh: any;
    export const { actions, mixer } = useGltfAnimations(gltf, ref);
    $: if ($gltf && $actions && !instancedMesh) {
        configureAnimationOnce(getAction("JumpStart"));
        configureAnimationOnce(getAction("JumpEnd"));
        configureAnimationOnce(getAction("Strike"));
        instancedMesh = SkeletonUtils.clone($gltf.scene);
        onLoaded();
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
            if ($actions[anim].getEffectiveWeight() <= 0 && !$actions[anim]?.isRunning()) {
                $actions[anim]?.stop();
                $actions[anim]?.setEffectiveWeight(1);
            }
        });
    };

    useTask(
        () => {
            stopFadeOutAnimations();
        },
        { stage: afterRenderStage }
    );
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
