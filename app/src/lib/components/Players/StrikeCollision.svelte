<script lang="ts">
    import { type Collider as RCollider, type RigidBody as RRigidBody, Ray, RayColliderToi, QueryFilterFlags } from "@dimforge/rapier3d-compat";
    import { T, useTask } from "@threlte/core";
    import { RigidBody, Collider } from "@threlte/rapier";
    import { Vector3, Quaternion, Object3D } from "three";
    import Character from "./Character.svelte";

    export let forwardCamera: Vector3 = new Vector3(0, 0, 0);
    let rigidbodyStrike: RRigidBody;
    let strikeGroup: Object3D;
    let strikeRigidbodyPosition: Vector3 = new Vector3(0, 1000, 0);
    let playerIdToStrike: string[] = [];
    export let character: Character;
    export let socket: any;

    export const updateStrikeRigidbodyPositionAndExecute = (playerRotation: number) => {
        strikeGroup.getWorldPosition(strikeRigidbodyPosition);
        rigidbodyStrike.setTranslation(strikeRigidbodyPosition, true);
        const up = new Vector3(0, 1, 0);
        const quat = new Quaternion().setFromAxisAngle(up, playerRotation + 45);
        rigidbodyStrike.setRotation(quat, true);
        strikeSensorTask.start();
    };

    const onSensorEnter = (target: any) => {
        if (!target.targetRigidBody) return;
        if (!target.targetRigidBody.userData.playerId) return;
        playerIdToStrike.push(target.targetRigidBody.userData.playerId);
    };

    const { task: strikeSensorTask } = useTask(
        () => {
            if (character.strikeAnimationTime() < 0.01) return;

            let direction = forwardCamera.clone();
            direction.multiplyScalar(100);
            direction.y += 10;

            playerIdToStrike.forEach((player) => {
                socket.emit("player-pushed", player, direction);
            });
            playerIdToStrike = [];

            if (character.strikeAnimationTime() < 1) return;
            unreachRigidbodyStrike();
            strikeSensorTask.stop();
        },
        { autoStart: false }
    );

    const unreachRigidbodyStrike = () => {
        rigidbodyStrike.setTranslation(new Vector3(0, 1000, 0), true);
    };
</script>

<T.Group position.z={1} position.y={1} bind:ref={strikeGroup}>
    <RigidBody
        bind:rigidBody={rigidbodyStrike}
        type={"kinematicPosition"}
        on:create={() => {
            unreachRigidbodyStrike();
        }}
    >
        <Collider shape="cuboid" args={[0.75, 1, 0.75]} sensor on:sensorenter={onSensorEnter}></Collider>
    </RigidBody>
</T.Group>
