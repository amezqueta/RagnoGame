<script context="module" lang="ts">
    let installed = false;
</script>

<script lang="ts">
    import { useTask, useParent, useThrelte } from "@threlte/core";
    import type { CameraControlsEvents, CameraControlsProps, CameraControlsSlots } from "./CameraControls.svelte";
    import { Ray } from "@dimforge/rapier3d-compat";

    type $$Props = CameraControlsProps;
    type $$Events = CameraControlsEvents;
    type $$Slots = CameraControlsSlots;

    import CameraControls from "camera-controls";
    import { Box3, Matrix4, Quaternion, Raycaster, Sphere, Spherical, Vector2, Vector3, Vector4, type PerspectiveCamera } from "three";
    import { cameraControlPressedStore, cursorShowStore, playerVelocityStore } from "./stores";
    import { useRapier } from "@threlte/rapier";
    import { useControls } from "$lib/hooks/useControls";
    import { clamp, lerp } from "three/src/math/MathUtils.js";
    import { onMount } from "svelte";

    const subsetOfTHREE = {
        Vector2,
        Vector3,
        Vector4,
        Quaternion,
        Matrix4,
        Spherical,
        Box3,
        Sphere,
        Raycaster,
    };

    if (!installed) {
        CameraControls.install({ THREE: subsetOfTHREE });
        installed = true;
    }

    const parent = useParent();
    const { camera } = useThrelte();
    const { world } = useRapier();
    const { controlWheel } = useControls();
    let cameraForward = new Vector3(0, 0, 0);
    export let position: Vector3 = new Vector3(0, 0, 0);

    if (!$parent) {
        throw new Error("CameraControls must be a child of a ThreeJS camera");
    }

    const { renderer, invalidate } = useThrelte();
    let playerPosition: Vector3 = new Vector3(0, 0, 0);

    export const ref = new CameraControls($parent as PerspectiveCamera, renderer?.domElement);

    const getControls = () => ref;
    getControls().mouseButtons.right = CameraControls.ACTION.ROTATE;
    getControls().mouseButtons.left = CameraControls.ACTION.NONE;
    getControls().mouseButtons.middle = CameraControls.ACTION.NONE;
    getControls().mouseButtons.wheel = CameraControls.ACTION.NONE;
    getControls().smoothTime = 0;
    getControls().draggingSmoothTime = 0;
    getControls().maxPolarAngle = 3;
    getControls().minPolarAngle = 0.05;
    getControls().minDistance = 10;
    getControls().maxDistance = 30;
    getControls().setFocalOffset(0, -1, 0, false);

    useTask((delta) => {
        zoomControl(delta);
        cameraCollisionCalculate(delta);
        const updated = getControls().update(delta);
        if (updated) invalidate();
    });

    let distance = 25;
    let collidedDistance = distance;
    const zoomControl = (delta: number) => {
        if (!controlWheel) return;
        if ($controlWheel.delta == 0) return;

        distance -= $controlWheel.delta * delta * 0.5;
        distance = clamp(distance, getControls().minDistance, getControls().maxDistance);
    };

    const cameraCollisionCalculate = (delta: number) => {
        camera.current.getWorldDirection(cameraForward);
        let dir = cameraForward.clone().multiplyScalar(-getControls().maxDistance);
        const ray: Ray = new Ray(playerPosition, dir);
        const raycastResult = world.castRay(ray, 1, false);
        if (raycastResult && !raycastResult.collider.parent() && raycastResult.collider.shape.type != 2) {
            //rigidbodies and capsules are excluded
            collidedDistance = getControls().maxDistance * raycastResult.toi;
            getControls().distance = collidedDistance;
        } else {
            collidedDistance = lerp(collidedDistance, distance, delta * 10);
            getControls().distance = collidedDistance;
        }
    };

    $: if (position) {
        playerPosition = position;
        updateCameraRotation(playerPosition);
    }

    $: if ($playerVelocityStore) {
        updateCameraPosition($playerVelocityStore);
    }

    const updateCameraPosition = (playerVelocity: Vector3) => {
        camera.current.getWorldDirection(cameraForward);
        playerVelocity.clone().addScaledVector(cameraForward, getControls().distance);

        //Pass de camera direction
        let up = new Vector3(0, 1, 0);
        let right = new Vector3();
        right.crossVectors(up, cameraForward);
        let moveDirection = cameraForward.multiplyScalar(playerVelocity.z).add(right.multiplyScalar(-playerVelocity.x));

        getControls().truck(-moveDirection.x, 0, false);
    };

    const updateCameraRotation = (playerPosition: Vector3) => {
        let currentDistance = getControls().distance;
        getControls().setTarget(playerPosition.x, playerPosition.y, playerPosition.z, false);
        getControls().distance = currentDistance;
    };

    const onMouseDown = (key: MouseEvent) => {
        if (key.button == 2) {
            cameraControlPressedStore.set(true);
            cursorShowStore.set(false);
        }
    };
    const onMouseUp = (key: MouseEvent) => {
        if (key.button == 2) {
            cameraControlPressedStore.set(false);
            cursorShowStore.set(true);
        }
    };

    onMount(() => {
        position = new Vector3(20, 20, 20);
        distance = 25;
    });
</script>

<svelte:window on:mousedown={onMouseDown} on:mouseup={onMouseUp} />
