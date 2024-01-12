<script lang="ts">
  import {
    type Collider as RCollider,
    type RigidBody as RRigidBody,
  } from "@dimforge/rapier3d-compat";
  import { onMount } from "svelte";
  import { T, useTask, useThrelte } from "@threlte/core";
  import { BoxGeometry, MeshStandardMaterial, Vector3 } from "three";
  import { onDestroy } from "svelte";
  import { RigidBody, Collider, useRapier } from "@threlte/rapier";
  import {
    cameraControlPressedStore,
    playerColorStore,
    playerRigidbodyStore,
    playerTranslationStore,
    privilegesStore,
  } from "../stores";
  import { clamp } from "svelte-tweakpane-ui/Utils.js";
  import TextBillboard from "../TextBillboard.svelte";
  import { useCursor } from "@threlte/extras";
  import { interactivity } from "@threlte/extras";
  import { lerpAngle } from "../Utilities/Utils";

  interactivity();

  let rigidBody: RRigidBody;
  let playerTranslation: Vector3 = $playerTranslationStore;
  const material = new MeshStandardMaterial();
  const geometry = new BoxGeometry(2, 2, 2);
  let meshRotation: number = 0;

  let playerCollider: RCollider;

  export let nick: string = "";
  export let socket: any = null;
  export let userId: string = "";
  export let color: string = "";
  let outlineColor: string = "#000000";

  let space = false;
  let forwardPressed: number = 0;
  let rightPressed: number = 0;

  const { camera } = useThrelte();
  const { world } = useRapier();
  let controller = world.createCharacterController(0.01);
  controller.setMaxSlopeClimbAngle((45 * Math.PI) / 180);
  controller.setMinSlopeSlideAngle((30 * Math.PI) / 180);
  controller.enableAutostep(0.5, 0.2, true);
  controller.enableSnapToGround(0.5);

  let collisionForce: Vector3 = new Vector3(0, 0, 0);
  let collisionMagnitude: number;

  let velocity = new Vector3();
  let jumpVelocity: number = 0;
  let position: Vector3 = new Vector3();
  let deltaPosition: Vector3 = new Vector3();
  let cameraControlPressed = false;

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

  function DirectionCamera(direction: Vector3): Vector3 {
    let forwardCamera: Vector3 = getForwardCamera();
    let up = new Vector3(0, 1, 0);
    let right = new Vector3();
    right.crossVectors(up, forwardCamera).normalize();

    let moveDirection = forwardCamera
      .multiplyScalar(-direction.z)
      .add(right.multiplyScalar(direction.x));
    return moveDirection;
  }

  function playerJump(deltaTime: number) {
    const playerIsgrounded = playerIsGrounded();
    if (playerIsgrounded) jumpVelocity = 0;
    else jumpVelocity -= 20 * deltaTime;
    if (space && playerIsgrounded) {
      jumpVelocity += 10;
    }
    jumpVelocity = clamp(jumpVelocity, -10, 10);
  }

  function playerMovement(deltaTime: number) {
    velocity.z *= deltaTime;
    velocity.x *= deltaTime;

    const speed = 10;
    if (forwardPressed != 0) velocity.z -= forwardPressed * speed;
    if (rightPressed != 0) velocity.x += rightPressed * speed;

    velocity = DirectionCamera(velocity);
  }

  function returnPlayerOnFall() {
    if (rigidBody.translation().y < -2) {
      rigidBody.setTranslation(new Vector3(0, 0, 0), true);
    }
  }

  const updateMeshRotation = (velocity: Vector3) => {
    if (velocity.lengthSq() < 1) return;
    if (cameraControlPressed) {
      let forwardCamera: Vector3 = getForwardCamera();
      meshRotation = lerpAngle(
        meshRotation,
        Math.atan2(forwardCamera.x, forwardCamera.z),
        0.5,
      );
    } else {
      meshRotation = lerpAngle(
        meshRotation,
        Math.atan2(velocity.x, velocity.z),
        0.2,
      );
    }
  };

  useTask((deltaTime) => {
    returnPlayerOnFall();
    playerMovement(deltaTime);
    playerJump(deltaTime);
    velocity.y = jumpVelocity;
    controller.computeColliderMovement(playerCollider, velocity);
    updateMeshRotation(velocity);
    rigidBody.setLinvel(velocity, true);
    deltaPosition = new Vector3(
      position.x - rigidBody.translation().x,
      position.y - rigidBody.translation().y,
      position.z - rigidBody.translation().z,
    );

    window.addCameraOffset(deltaPosition);

    //Checks that the player has moved enough
    if (deltaPosition.lengthSq() < deltaTime / 10) return;
    position = rigidBody.translation() as Vector3;

    if (!rigidBody.isSleeping())
      socket.emit(
        "move",
        new Vector3(
          rigidBody.translation().x,
          rigidBody.translation().y,
          rigidBody.translation().z,
        ),
      );
  });

  function playerIsGrounded(): boolean {
    return collisionForce.y > 1;
  }

  function onKeyDown(e: KeyboardEvent) {
    switch (e.key) {
      case "s":
        forwardPressed = -1;
        break;
      case "w":
        forwardPressed = 1;
        break;
      case "a":
        rightPressed = 1;
        break;
      case "d":
        rightPressed = -1;
        break;
      case " ":
        space = true;
        break;
      default:
        break;
    }
  }

  function onKeyUp(e: KeyboardEvent) {
    switch (e.key) {
      case "s":
        forwardPressed = 0;
        break;
      case "w":
        forwardPressed = 0;
        break;
      case "a":
        rightPressed = 0;
        break;
      case "d":
        rightPressed = 0;
        break;
      case " ":
        space = false;
        break;
      default:
        break;
    }
  }

  $: material.color.set(color);

  $: if (rigidBody) {
    playerRigidbodyStore.set(rigidBody);
  }

  $: if (playerTranslation) {
    playerTranslationStore.set(playerTranslation);
  }

  $: if (color) playerColorStore.set(color);
  $: if ($playerColorStore) {
    color = $playerColorStore;
    socket.emit("server-color", color);
  }

  $: if ($privilegesStore == 10) outlineColor = "#85641b";

  $: if (cameraControlPressedStore)
    cameraControlPressed = $cameraControlPressedStore;

  onMount(() => {
    console.log("Player mounted " + color);
  });
</script>

<svelte:window on:keydown={onKeyDown} on:keyup={onKeyUp} />

<RigidBody
  on:collisionexit={() => {
    collisionForce = new Vector3(0, 0, 0);
    collisionMagnitude = 0;
  }}
  on:contact={({ totalForce, maxForceMagnitude }) => {
    collisionForce = totalForce;
    collisionMagnitude = maxForceMagnitude;
  }}
  bind:rigidBody
  enabledRotations={[false, false, false]}
>
  <T.Mesh castShadow {geometry} {material} rotation.y={meshRotation} />
  <TextBillboard text={nick} position={[0, 3, 0]} {color} {outlineColor} />
  <Collider shape="capsule" args={[0.3, 1]} bind:collider={playerCollider} />
</RigidBody>
