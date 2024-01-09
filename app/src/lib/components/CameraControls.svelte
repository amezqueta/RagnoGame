<script context="module" lang="ts">
  let installed = false;
</script>

<script lang="ts">
  import {
    useTask,
    useParent,
    useThrelte,
  } from "@threlte/core";
  import type {
    CameraControlsEvents,
    CameraControlsProps,
    CameraControlsSlots,
  } from "./CameraControls.svelte";

  type $$Props = CameraControlsProps;
  type $$Events = CameraControlsEvents;
  type $$Slots = CameraControlsSlots;

  import CameraControls from "camera-controls";
  import {
    Box3,
    Matrix4,
    Quaternion,
    Raycaster,
    Sphere,
    Spherical,
    Vector2,
    Vector3,
    Vector4,
    type PerspectiveCamera,
  } from "three";
  import { playerRigidbodyStore } from "./stores";

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

  if (!$parent) {
    throw new Error("CameraControls must be a child of a ThreeJS camera");
  }

  const { renderer, invalidate } = useThrelte();

  export const ref = new CameraControls(
    $parent as PerspectiveCamera,
    renderer?.domElement,
  );

  const getControls = () => ref;
  getControls().mouseButtons.right = CameraControls.ACTION.ROTATE;
  getControls().mouseButtons.left = CameraControls.ACTION.NONE;
  getControls().mouseButtons.middle = CameraControls.ACTION.NONE;
  getControls().smoothTime = 0.01;

  useTask(
    (delta) => {
      FollowPlayer();
      const updated = getControls().update(delta);
      if (updated) invalidate();
    },
  );

  function FollowPlayer() {
    if (!$playerRigidbodyStore) return;

    let translation = $playerRigidbodyStore.translation();
    getControls().setTarget(translation.x, translation.y, translation.z, true);
  }
</script>
