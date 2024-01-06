<script lang="ts">
    import { type RigidBody as RapierRigidBody } from '@dimforge/rapier3d-compat';
    import {afterUpdate, onMount, tick} from 'svelte';
    import {T, useTask, useThrelte} from '@threlte/core';
    import {BoxGeometry, Color, MeshStandardMaterial, Vector3} from 'three';
    import {onDestroy} from "svelte";
    import {Text} from "@threlte/extras";
    import { AutoColliders, BasicPlayerController, CollisionGroups, RigidBody, Collider } from '@threlte/rapier'
    import { playerRigidbodyStore } from './stores';

    let rigidBody: RapierRigidBody = $playerRigidbodyStore;
    const { camera } = useThrelte();
    const material = new MeshStandardMaterial();
    const geometry = new BoxGeometry(2, 2, 2);

    export let socket: any = null;
    export let userId: string = "";

    export let color: string = "#FF0000";

    export let radius = 0.3
    export let height = 1

    export function Move(direction: Vector3) {
        if(!rigidBody)
        return;

        let forward = new Vector3();
        camera.current.getWorldDirection(forward);
        forward.y = 0;
        forward.normalize();

        let up = new Vector3(0,1,0);

        let right = new Vector3();
        right.crossVectors(up, forward).normalize();
        right.negate();

        let moveDirection = forward.multiplyScalar(direction.z).add(right.multiplyScalar(direction.x));
        rigidBody.applyImpulse(moveDirection, true);
    }

    onMount(() => {
        console.log("Player mounted");
    })

    socket.on('user-color', (id: string, newColor: string) => {
        if (userId === id) {
            color = newColor;
        }
    })

    onDestroy(() => {
        console.log("Player destroyed (" + userId + ")");
    })

    $: material.color.set(color);
    
    useTask(() => {
        if (!rigidBody) return
        
        if(!rigidBody.isSleeping())
            socket.emit('move', userId, new Vector3(rigidBody.translation().x, rigidBody.translation().y, rigidBody.translation().z));
  })

  $: if(rigidBody){
    playerRigidbodyStore.set(rigidBody);
  }

</script>

    <RigidBody linearDamping={25} bind:rigidBody enabledRotations={[false, false, false]}>
        <CollisionGroups memberships={[2]} filter={[1]}>
        <Collider
        shape={'capsule'}
        args={[height / 2 - radius, radius]}
        />
        <T.Mesh castShadow {geometry} {material}/>
        <Text text={userId} position="{[0, 2, 0]}" fontSize="1"/>
        </CollisionGroups>
    </RigidBody>