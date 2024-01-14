<script lang="ts">
  import { type Collider as RCollider, type RigidBody as RRigidBody, Ray, RayColliderToi } from "@dimforge/rapier3d-compat";
  import { onMount } from "svelte";
  import { T, useTask, useThrelte } from "@threlte/core";
  import { BoxGeometry, MeshStandardMaterial, Vector3, ArrowHelper } from "three";
  import { onDestroy } from "svelte";
  import { RigidBody, Collider, useRapier } from "@threlte/rapier";
  import { cameraControlPressedStore, playerColorStore, playerRigidbodyStore, privilegesStore, playerPositionStore, playerVelocityStore } from "../stores";
  import { clamp } from "svelte-tweakpane-ui/Utils.js";
  import TextBillboard from "../TextBillboard.svelte";
  import { lerpAngle } from "../Utilities/Utils";

  let rigidBody: RRigidBody;
  const material = new MeshStandardMaterial();
  const geometry = new BoxGeometry(2, 2, 2);
  let meshRotation: number = 0;

  let playerCollider: RCollider;

  export let nick: string = "";
  export let socket: any = null;
  export let userId: string = "";
  export let color: string = "";
  let outlineColor: string = "#000000";
  let playerPosition: Vector3 = new Vector3();

  let spacePressed = false;
  let WKeyPressed = false;
  let AKeyPressed = false;
  let SKeyPressed = false;
  let DKeyPressed = false;

  const { camera } = useThrelte();
  const { world } = useRapier();

  let playerVelocity = new Vector3();
  let playerVerticalVelocity: number = 0;
  let positionCheck: Vector3 = new Vector3();
  let deltaPosition: Vector3 = new Vector3();
  let cameraControlPressed = false;
  let isGrounded: boolean = false;

  onDestroy(() => {
    console.log("Player destroyed (" + userId + ")");
  });

  socket.on("user-color", (id: string, newColor: string) => {
    if (userId === id) {
      color = newColor;
    }
  });

  const getForwardCamera = (): Vector3 => {
    let forward = new Vector3();
    camera.current.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    return forward;
  };

  function passDirectionCameraForward(direction: Vector3): Vector3 {
    let forwardCamera: Vector3 = getForwardCamera();
    let up = new Vector3(0, 1, 0);
    let right = new Vector3();
    right.crossVectors(up, forwardCamera).normalize();

    let moveDirection = forwardCamera.multiplyScalar(-direction.z).add(right.multiplyScalar(direction.x));
    return moveDirection;
  }

  const jumpForce = 10;
  const applyVerticalVelocity = (deltaTime: number) => {
    if (isGrounded) playerVerticalVelocity = 0;
    else playerVerticalVelocity -= 20 * deltaTime;
    if (spacePressed && isGrounded) {
      playerVerticalVelocity += jumpForce;
    }
    playerVerticalVelocity = clamp(playerVerticalVelocity, -jumpForce, jumpForce);
    playerVelocity.y = playerVerticalVelocity;
  };

  const playerMovement = (deltaTime: number) => {
    playerVelocity.z *= deltaTime;
    playerVelocity.x *= deltaTime;

    const speed = 10;
    if (WKeyPressed) playerVelocity.z -= speed;
    if (AKeyPressed) playerVelocity.x += speed;
    if (SKeyPressed) playerVelocity.z += speed;
    if (DKeyPressed) playerVelocity.x -= speed;
    playerVelocity.clampLength(0, 10);
    playerVelocity = passDirectionCameraForward(playerVelocity);
  };

  function returnPlayerOnFall() {
    if (rigidBody.translation().y < -2) {
      rigidBody.setTranslation(new Vector3(0, 0, 0), true);
    }
  }

  const updateMeshRotation = () => {
    const playerVelocityXZ = new Vector3(playerVelocity.x, 0, playerVelocity.z);
    if (playerVelocityXZ.lengthSq() < 1) return;
    if (cameraControlPressed) {
      let forwardCamera: Vector3 = getForwardCamera();
      meshRotation = lerpAngle(meshRotation, Math.atan2(forwardCamera.x, forwardCamera.z), 0.5);
    } else {
      meshRotation = lerpAngle(meshRotation, Math.atan2(playerVelocityXZ.x, playerVelocityXZ.z), 0.2);
    }
    socket.emit("player-rotate", meshRotation);
  };

  const raycastDirection = new Vector3(0, -5, 0);
  const minGroundDistance = 0.3;
  /* createCharacterController is not working properly
  let controller = world.createCharacterController(0.01);
  controller.setMaxSlopeClimbAngle((45 * Math.PI) / 180);
  controller.setMinSlopeSlideAngle((30 * Math.PI) / 180);
  controller.enableAutostep(0.5, 0.2, true);
  controller.enableSnapToGround(0.5);
  */
  useTask((deltaTime) => {
    returnPlayerOnFall();

    //Basic movements
    playerMovement(deltaTime);
    applyVerticalVelocity(deltaTime);

    //Raycast to the floor. @todo If the player is standing on an edge, isGrounded can be negative
    const ray: Ray = new Ray(rigidBody.translation(), raycastDirection);
    const raycastResult = world.castRay(ray, 1, false);
    isGrounded = raycastResult ? raycastResult.toi < minGroundDistance : false;
    checkSurfaceVelocity(raycastResult);

    updateMeshRotation();

    debugArrowDirection = playerVelocity;
    if (surfaceVelocity) playerVelocity.add(surfaceVelocity.multiplyScalar(-1 / deltaTime));

    rigidBody.setLinvel(playerVelocity, true);

    deltaPosition = new Vector3(positionCheck.x - rigidBody.translation().x, positionCheck.y - rigidBody.translation().y, positionCheck.z - rigidBody.translation().z);
    playerPosition.set(rigidBody.translation().x, rigidBody.translation().y, rigidBody.translation().z);

    //Updates the store variables @todo update the store only if the variable changed enough respecting the one from the store
    playerPositionStore.set(playerPosition);
    playerVelocityStore.set(deltaPosition);

    //Checks that the player has moved enough
    if (deltaPosition.lengthSq() < deltaTime / 10) return;
    positionCheck = playerPosition;

    if (!rigidBody.isSleeping()) socket.emit("player-move", new Vector3(rigidBody.translation().x, rigidBody.translation().y, rigidBody.translation().z));
  });

  let surfaceRigidbodyInfo: any;
  let prevSurfacePosition: Vector3 | null;
  let surfaceVelocity: Vector3 | null;
  const checkSurfaceVelocity = (raycastResult: RayColliderToi | null) => {
    if (!isGrounded || raycastResult == null) {
      //No surface detected
      surfaceRigidbodyInfo = null;
      prevSurfacePosition = null;
      surfaceVelocity = null;
      return;
    }

    const currentColl = raycastResult.collider.parent();
    if (surfaceRigidbodyInfo != currentColl) {
      //A new surface is detected
      surfaceRigidbodyInfo = raycastResult.collider.parent();
      prevSurfacePosition = null;
      surfaceVelocity = null;
      return;
    }

    if (!surfaceRigidbodyInfo) {
      return;
    }

    const trans = surfaceRigidbodyInfo.nextTranslation();

    if (prevSurfacePosition) {
      surfaceVelocity = prevSurfacePosition.clone().sub(trans);
    }
    prevSurfacePosition = new Vector3(trans.x, trans.y, trans.z);
  };

  function onKeyDown(e: KeyboardEvent) {
    switch (e.key) {
      case "w":
        WKeyPressed = true;
        break;
      case "a":
        AKeyPressed = true;
        break;
      case "s":
        SKeyPressed = true;
        break;
      case "d":
        DKeyPressed = true;
        break;
      case " ":
        spacePressed = true;
        break;
      default:
        break;
    }
  }

  function onKeyUp(e: KeyboardEvent) {
    switch (e.key) {
      case "w":
        WKeyPressed = false;
        break;
      case "a":
        AKeyPressed = false;
        break;
      case "s":
        SKeyPressed = false;
        break;
      case "d":
        DKeyPressed = false;
        break;
      case " ":
        spacePressed = false;
        break;
      default:
        break;
    }
  }

  $: material.color.set(color);

  $: if (rigidBody) {
    playerRigidbodyStore.set(rigidBody);
  }

  $: if (color) playerColorStore.set(color);
  $: if ($playerColorStore) {
    color = $playerColorStore;
    socket.emit("server-color", color);
  }

  $: if ($privilegesStore == 10) outlineColor = "#85641b";

  $: if (cameraControlPressedStore) cameraControlPressed = $cameraControlPressedStore;

  onMount(() => {
    console.log("Player mounted " + color);
  });
  let debugArrowDirection: Vector3 = new Vector3();
</script>

<svelte:window on:keydown={onKeyDown} on:keyup={onKeyUp} />

<RigidBody bind:rigidBody enabledRotations={[false, false, false]}>
  <T.Mesh castShadow {geometry} {material} rotation.y={meshRotation} />
  <TextBillboard text={nick} position={[0, 3, 0]} {color} {outlineColor} />
  <Collider shape="capsule" args={[0.3, 1]} bind:collider={playerCollider} />
</RigidBody>
