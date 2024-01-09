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
    playerColorStore,
    playerRigidbodyStore,
    playerTranslationStore,
  } from "../stores";
  import { clamp } from "svelte-tweakpane-ui/Utils.js";
  import TextBillboard from "../TextBillboard.svelte";

  let rigidBody: RRigidBody;
  let playerTranslation: Vector3 = $playerTranslationStore;
  const material = new MeshStandardMaterial();
  const geometry = new BoxGeometry(2, 2, 2);

  let playerCollider: RCollider;

  export let nick: string = "";
  export let socket: any = null;
  export let userId: string = "";
  export let color: string = "";

  let forward = false;
  let backward = false;
  let right = false;
  let left = false;
  let space = false;

  const { camera } = useThrelte();
  const { world } = useRapier();
  let controller = world.createCharacterController(0.01);
  controller.setMaxSlopeClimbAngle((45 * Math.PI) / 180);
  controller.setMinSlopeSlideAngle((30 * Math.PI) / 180);
  controller.enableAutostep(0.5, 0.2, true);
  controller.enableSnapToGround(0.5);

  let collisionForce: any;
  let collisionMagnitude: number;

  onDestroy(() => {
    console.log("Player destroyed (" + userId + ")");
  });

  socket.on("user-color", (id: string, newColor: string) => {
    if (userId === id) {
      color = newColor;
    }
  });

  let velocity = new Vector3();
  let jumpVelocity: number = 0;

  function DirectionCamera(direction: Vector3): Vector3 {
    let forward = new Vector3();
    camera.current.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    let up = new Vector3(0, 1, 0);
    let right = new Vector3();
    right.crossVectors(up, forward).normalize();

    let moveDirection = forward
      .multiplyScalar(-direction.z)
      .add(right.multiplyScalar(direction.x));
    return moveDirection;
  }

  function PlayerJump(deltaTime: number) {
    const playerIsgrounded = playerIsGrounded();
    if (playerIsgrounded) jumpVelocity = 0;
    else jumpVelocity -= 20 * deltaTime;
    if (space && playerIsgrounded) {
      jumpVelocity += 10;
    }
    jumpVelocity = clamp(jumpVelocity, -10, 10);
  }

  function PlayerMovement(deltaTime: number) {
    velocity.z *= deltaTime;
    velocity.x *= deltaTime;

    const speed = 10;
    if (forward) velocity.z -= speed;
    if (backward) velocity.z += speed;
    if (left) velocity.x -= speed;
    if (right) velocity.x += speed;

    velocity = DirectionCamera(velocity);
    controller.computeColliderMovement(playerCollider, velocity);
  }

  function ReturnPlayerOnFall() {
    if (rigidBody.translation().y < -2) {
      rigidBody.setTranslation(new Vector3(0, 0, 0), true);
    }
  }

  useTask((deltaTime) => {
    PlayerMovement(deltaTime);
    PlayerJump(deltaTime);
    velocity.y = jumpVelocity;
    rigidBody.setLinvel(velocity, true);
    window.addCameraOffset(velocity);

    ReturnPlayerOnFall();

    if (!rigidBody.isSleeping())
      socket.emit(
        "move",
        userId,
        new Vector3(
          rigidBody.translation().x,
          rigidBody.translation().y,
          rigidBody.translation().z,
        ),
      );
  });

  function playerIsGrounded(): boolean {
    return collisionForce != null && collisionForce.y > 1;
  }

  function onKeyDown(e: KeyboardEvent) {
    switch (e.key) {
      case "s":
        backward = true;
        break;
      case "w":
        forward = true;
        break;
      case "a":
        right = true;
        break;
      case "d":
        left = true;
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
        backward = false;
        break;
      case "w":
        forward = false;
        break;
      case "a":
        right = false;
        break;
      case "d":
        left = false;
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

  onMount(() => {
    console.log("Player mounted " + color);
  });
</script>

<svelte:window on:keydown={onKeyDown} on:keyup={onKeyUp} />

<RigidBody
  on:collisionexit={() => {
    collisionForce = null;
    collisionMagnitude = 0;
  }}
  on:contact={({ totalForce, maxForceMagnitude }) => {
    collisionForce = totalForce;
    collisionMagnitude = maxForceMagnitude;
  }}
  bind:rigidBody
  enabledRotations={[false, false, false]}
>
  <T.Mesh castShadow {geometry} {material} />
  <TextBillboard text={nick} position={[0, 3, 0]} {color} />
  <Collider shape="capsule" args={[0.3, 1]} bind:collider={playerCollider} />
</RigidBody>
