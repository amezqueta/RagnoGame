<script lang="ts">
  import { type Collider as RCollider, type RigidBody as RRigidBody, Ray, RayColliderToi } from "@dimforge/rapier3d-compat";
  import { onMount } from "svelte";
  import { T, useTask, useThrelte } from "@threlte/core";
  import { BoxGeometry, MeshStandardMaterial, Vector3, ArrowHelper, VectorKeyframeTrack } from "three";
  import { onDestroy } from "svelte";
  import { RigidBody, Collider, useRapier, type ContactEvent } from "@threlte/rapier";
  import { cameraControlPressedStore, playerColorStore, playerRigidbodyStore, privilegesStore, playerPositionStore, playerVelocityStore, playerSpawnsStore } from "../stores";
  import { clamp } from "svelte-tweakpane-ui/Utils.js";
  import TextBillboard from "../TextBillboard.svelte";
  import { lerpAngle } from "../Utilities/Utils";
  import { useControls } from "../../hooks/useControls";
  import Emote from "../UI/Emote.svelte";
  import Character from "./Character.svelte";

  let rigidBody: RRigidBody;
  const material = new MeshStandardMaterial();
  const capsuleHeight = 0.8;
  const capsuleRadius = 0.2;
  const minGroundDistance = capsuleHeight - 0.4;
  const geometry = new BoxGeometry(2, capsuleHeight * 3, 2);
  const raycastFloorDirection = new Vector3(0, -2.9, 0);
  export let ref = 2;

  const { camera } = useThrelte();
  const { world } = useRapier();
  const { controlAxis, controlActions } = useControls();
  const jumpForce = 7;
  const speed = 5;

  let meshRotation: number = 0;

  let playerCollider: RCollider;

  export let nick: string = "";
  export let socket: any = null;
  export let userId: string = "";
  export let color: string = "";
  let outlineColor: string = "#000000";
  let playerPosition: Vector3 = new Vector3();

  let playerVelocity = new Vector3();
  let playerVerticalVelocity: number = 0;
  let surfaceVelocity: Vector3 | null;
  let pushVelocity: Vector3 = new Vector3(0, 0, 0);

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

  socket.on("player-pushed", (velocity: Vector3) => {
    const force = new Vector3(velocity.x, velocity.y, velocity.z);
    pushVelocity.add(force);
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

  let jumpStarted = (): boolean => {
    return $controlActions.jump && isGrounded;
  };

  const applyVerticalVelocity = (deltaTime: number) => {
    if (isGrounded) playerVerticalVelocity = 0;
    else playerVerticalVelocity -= 20 * deltaTime;
    if (jumpStarted()) {
      playerVerticalVelocity += jumpForce;
    }
    playerVerticalVelocity = clamp(playerVerticalVelocity, -jumpForce, jumpForce);
    playerVelocity.y = playerVerticalVelocity;
  };

  const playerMovement = (deltaTime: number) => {
    playerVelocity.z *= deltaTime;
    playerVelocity.x *= deltaTime;

    playerVelocity.x -= $controlAxis.x * speed;
    playerVelocity.z -= $controlAxis.y * speed;

    playerVelocity.clampLength(0, speed);
    playerVelocity = passDirectionCameraForward(playerVelocity);
  };

  function returnPlayerOnFall() {
    if (rigidBody.translation().y < -30) {
      spawnPlayer(rigidBody);
    }
  }

  let forwardCamera: Vector3 = new Vector3();
  const updateMeshRotation = () => {
    const playerVelocityXZ = new Vector3(playerVelocity.x, 0, playerVelocity.z);
    if (playerVelocityXZ.lengthSq() < 1) return;
    if (cameraControlPressed) {
      forwardCamera = getForwardCamera();
      meshRotation = lerpAngle(meshRotation, Math.atan2(forwardCamera.x, forwardCamera.z), 0.5);
    } else {
      meshRotation = lerpAngle(meshRotation, Math.atan2(playerVelocityXZ.x, playerVelocityXZ.z), 0.2);
    }
    socket.emit("player-rotate", meshRotation);
  };

  /* createCharacterController is not working properly
  let controller = world.createCharacterController(0.01);
  controller.setMaxSlopeClimbAngle((45 * Math.PI) / 180);
  controller.setMinSlopeSlideAngle((30 * Math.PI) / 180);
  controller.enableAutostep(0.5, 0.2, true);
  controller.enableSnapToGround(0.5);
  */
  const { stop, start } = useTask((deltaTime) => {
    returnPlayerOnFall();

    //Basic movements
    playerMovement(deltaTime);
    applyVerticalVelocity(deltaTime);

    //Raycast to the floor. @todo If the player is standing on an edge, isGrounded can be negative
    const ray: Ray = new Ray(rigidBody.translation(), raycastFloorDirection);
    const raycastResult = world.castRay(ray, 1, false);
    isGrounded = raycastResult ? raycastResult.toi < minGroundDistance : false;
    updateMeshRotation();

    checkSurfaceVelocity(raycastResult, deltaTime);
    checkPushVelocity(deltaTime);
    rigidBody.setLinvel(playerVelocity, true);

    deltaPosition = new Vector3(positionCheck.x - rigidBody.translation().x, positionCheck.y - rigidBody.translation().y, positionCheck.z - rigidBody.translation().z);
    playerPosition.set(rigidBody.translation().x, rigidBody.translation().y, rigidBody.translation().z);

    //Updates the store variables @todo update the store only if the variable changed enough respecting the one from the store
    playerPositionStore.set(playerPosition);
    playerVelocityStore.set(deltaPosition);

    //Checks that the player has moved enough
    //if (deltaPosition.lengthSq() < deltaTime / 10) return;
    positionCheck = playerPosition;

    if (!rigidBody.isSleeping()) socket.emit("player-move", new Vector3(rigidBody.translation().x, rigidBody.translation().y, rigidBody.translation().z));
  });
  stop();

  const checkPushVelocity = (deltaTime: number) => {
    pushVelocity.lerp(new Vector3(0, 0, 0), deltaTime * 7);
    playerVelocity.add(pushVelocity);
  };

  let surfaceRigidbodyInfo: any;
  let prevSurfacePosition: Vector3 | null;
  const checkSurfaceVelocity = (raycastResult: RayColliderToi | null, deltaTime: number) => {
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

    if (surfaceVelocity && deltaTime != 0) playerVelocity.add(surfaceVelocity.clone().multiplyScalar(-1 / deltaTime));
  };

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

  //Emotes
  let emoteRef: Emote;
  export const playEmote = (emoteId: number) => {
    emoteRef.playEmote(emoteId);
  };

  const spawnPlayer = () => {
    try {
      let r = Math.floor(Math.random() * $playerSpawnsStore.length);
      const randomVector = new Vector3(Math.random() * 2, 0, Math.random() * 2);
      const randomSpawn = new Vector3($playerSpawnsStore[r][0], $playerSpawnsStore[r][1], $playerSpawnsStore[r][2]).add(randomVector);

      rigidBody.setTranslation(randomSpawn, true);
      start();
    } catch (error) {
      console.error("The are any Spawns on the scene");
    }
  };
</script>

{#if playerSpawnsStore}
  <RigidBody
    bind:rigidBody
    enabledRotations={[false, false, false]}
    on:create={(ref) => {
      spawnPlayer();
    }}
  >
    <Character />
    <!-- <T.Mesh castShadow {geometry} {material} rotation.y={meshRotation} /> -->
    <TextBillboard text={nick} position={[0, 3, 0]} {color} {outlineColor} />
    <Collider shape="capsule" args={[capsuleHeight, capsuleRadius]} bind:collider={playerCollider} />
    <Emote bind:this={emoteRef} />
  </RigidBody>
{/if}
