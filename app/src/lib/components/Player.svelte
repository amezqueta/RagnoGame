<script lang="ts">
    import { CharacterCollision, QueryFilterFlags, type Collider as RCollider, type RigidBody as RRigidBody } from '@dimforge/rapier3d-compat';
    import {afterUpdate, onMount, tick} from 'svelte';
    import {T, useTask, useThrelte} from '@threlte/core';
    import {BoxGeometry, Color, Group, MeshStandardMaterial, Vector3, type Vector} from 'three';
    import {onDestroy} from "svelte";
    import {Text} from "@threlte/extras";
    import { AutoColliders, BasicPlayerController, CollisionGroups, RigidBody, Collider, useRapier } from '@threlte/rapier'
    import { playerRigidbodyStore, playerTranslationStore } from './stores';
    import { clamp } from 'svelte-tweakpane-ui/Utils.js';

    let rigidBody: RRigidBody = $playerRigidbodyStore;
    let playerTranslation: Vector3 = $playerTranslationStore;
    const { camera } = useThrelte();
    const material = new MeshStandardMaterial();
    const geometry = new BoxGeometry(2, 2, 2);

    let playerCollider: RCollider;

    export let socket: any = null;
    export let userId: string = "";

    export let color: string = "#FF0000";

    let forward = false
    let backward = false
    let right = false
    let left = false
    let space = false;

    const { world } = useRapier();
    let controller = world.createCharacterController(0.01);
    controller.setMaxSlopeClimbAngle((45 * Math.PI) / 180);
    controller.setMinSlopeSlideAngle((30 * Math.PI) / 180);
    controller.enableAutostep(0.5, 0.2, true);
    controller.enableSnapToGround(0.5);

    let collisionForce: any;
    let collisionMagnitude: number;

    onMount(() => {
        console.log("Player mounted");
    })

    onDestroy(() => {
        console.log("Player destroyed (" + userId + ")");
    })
    
    socket.on('user-color', (id: string, newColor: string) => {
        if (userId === id) {
            color = newColor;
        }
    })
    
    let velocity = new Vector3();

    useTask((deltaTime) => {
      const playerIsgrounded = PlayerIsGrounded();

      if(playerIsgrounded)
        velocity.y = 0;
      else
        velocity.y -= deltaTime * 20;

      // Simulate movement damping
      velocity.z *= playerIsgrounded ? 0.5 : 0.1;
      velocity.x *= playerIsgrounded ? 0.5 : 0.1;

      const speed = playerIsgrounded ? 300 : 300;
      if (forward) velocity.z -= deltaTime * speed;
      if (backward) velocity.z += deltaTime * speed;
      if (left) velocity.x -= deltaTime * speed;
      if (right) velocity.x += deltaTime * speed;
      if(space && playerIsgrounded) velocity.y += 10;

      controller.computeColliderMovement(playerCollider, velocity);

      /*
      // (optional) Check collisions
      for (var i = 0; i < controller.numComputedCollisions(); i++) {
        let out;
        let collision = controller.computedCollision(i, out);
          console.log(controller.numComputedCollisions()+" "+collision?.collider);

        if(out){
        }
        if(collisionForce!=null && collision && collision.normal1.y > 0)
        {
          //console.log(controller.numComputedCollisions());
          velocity.y = 0;
        }
      }*/

      velocity.y = clamp(velocity.y, -10, 10);
      MoveToCamera(velocity, velocity.y, deltaTime);

      if(!rigidBody.isSleeping())
          socket.emit('move', userId, new Vector3(rigidBody.translation().x, rigidBody.translation().y, rigidBody.translation().z));

    });

    export function MoveToCamera(direction: Vector3, yVelocity: number, deltaTime: number) {
      if(!rigidBody)
      return;

      let forward = new Vector3();
      camera.current.getWorldDirection(forward);
      forward.y = 0;
      forward.normalize();

      let up = new Vector3(0,1,0);
      let right = new Vector3();
      right.crossVectors(up, forward).normalize();
      right.y = 0;
      right.normalize();

      let moveDirection = forward.multiplyScalar(-direction.z).add(right.multiplyScalar(direction.x));
      moveDirection.clampScalar(-7,7);
      moveDirection.multiplyScalar(deltaTime * 100);
      moveDirection.y = yVelocity;
      playerTranslation = moveDirection;
      rigidBody.setLinvel(moveDirection, true);
    }

  function PlayerIsGrounded(): boolean {
    return collisionForce!=null && collisionForce.y > 1;
  }

  function onKeyDown(e: KeyboardEvent) {
    switch (e.key) {
      case 's':
        backward = true
        break
      case 'w':
        forward = true
        break
      case 'a':
        right = true
        break
      case 'd':
        left = true
        break
        case ' ':
        space = true
        break
      default:
        break
    }
  }

  function onKeyUp(e: KeyboardEvent) {
    switch (e.key) {
      case 's':
        backward = false
        break
      case 'w':
        forward = false
        break
      case 'a':
        right = false
        break
      case 'd':
        left = false
        break
      case ' ':
        space = false
        break
      default:
        break
    }
  }

  $: material.color.set(color);

  $: if(rigidBody){
    playerRigidbodyStore.set(rigidBody);
  }

  $: if(playerTranslation){
    playerTranslationStore.set(playerTranslation);
  }

</script>

<svelte:window
  on:keydown|preventDefault={onKeyDown}
  on:keyup={onKeyUp}
/>

	<RigidBody 
    on:collisionexit={() => {
      collisionForce = null;
      collisionMagnitude = 0;
    }}
    on:contact={({ totalForce, maxForceMagnitude }) => {
      collisionForce = totalForce;
      collisionMagnitude = maxForceMagnitude;
    }}
  bind:rigidBody={rigidBody} enabledRotations={[false, false, false]} >
    <T.Mesh castShadow {geometry} {material}/>
    <Text text={userId} position="{[0, 3, 0]}" fontSize="1" outlineWidth={0.03} outlineColor={"#000000"} anchorX={"center"} />
		<Collider shape="capsule" args={[0.3, 0.2]} bind:collider={playerCollider} />
	</RigidBody>