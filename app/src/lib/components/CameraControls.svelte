<script context="module" lang="ts">
  let installed = false;
</script>

<script lang="ts">
  import { useTask, useParent, useThrelte } from "@threlte/core";
  import type { CameraControlsEvents, CameraControlsProps, CameraControlsSlots } from "./CameraControls.svelte";

  type $$Props = CameraControlsProps;
  type $$Events = CameraControlsEvents;
  type $$Slots = CameraControlsSlots;

  import CameraControls from "camera-controls";
  import { Box3, Matrix4, Quaternion, Raycaster, Sphere, Spherical, Vector2, Vector3, Vector4, type PerspectiveCamera } from "three";
  import { cameraControlPressedStore, cursorShowStore, playerPositionStore, playerVelocityStore } from "./stores";

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

  if (!$parent) {
    throw new Error("CameraControls must be a child of a ThreeJS camera");
  }

  const { renderer, invalidate } = useThrelte();

  export const ref = new CameraControls($parent as PerspectiveCamera, renderer?.domElement);

  const getControls = () => ref;
  getControls().mouseButtons.right = CameraControls.ACTION.ROTATE;
  getControls().mouseButtons.left = CameraControls.ACTION.NONE;
  getControls().mouseButtons.middle = CameraControls.ACTION.NONE;
  getControls().smoothTime = 0;
  getControls().draggingSmoothTime = 0;
  getControls().maxPolarAngle = 3;
  getControls().minPolarAngle = 0.05;
  getControls().minDistance = 50;
  getControls().maxDistance = 100;
  getControls().setFocalOffset(0, -1, 0, false);

  useTask((delta) => {
    const updated = getControls().update(delta);
    if (updated) invalidate();
  });

  $: if ($playerPositionStore) {
    let currentDistance = getControls().distance;
    updateCameraRotation($playerPositionStore);
    getControls().distance = currentDistance;
  }

  $: if ($playerVelocityStore) {
    updateCameraPosition($playerVelocityStore);
  }

  const updateCameraPosition = (playerVelocity: Vector3) => {
    let currentDistance = getControls().distance;
    let cameraForward = new Vector3();
    camera.current.getWorldDirection(cameraForward);

    playerVelocity.clone().addScaledVector(cameraForward, currentDistance);

    //Pass de camera direction
    let up = new Vector3(0, 1, 0);
    let right = new Vector3();
    right.crossVectors(up, cameraForward);
    let moveDirection = cameraForward.multiplyScalar(playerVelocity.z).add(right.multiplyScalar(-playerVelocity.x));

    getControls().truck(-moveDirection.x, 0, false);
  };

  const updateCameraRotation = (playerPosition: Vector3) => {
    getControls().setTarget(playerPosition.x, playerPosition.y, playerPosition.z, false);
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
</script>

<svelte:window on:mousedown={onMouseDown} on:mouseup={onMouseUp} />
