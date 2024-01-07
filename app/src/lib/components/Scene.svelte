<script lang="ts">
    import { RigidBody, CollisionGroups, Collider, AutoColliders } from '@threlte/rapier'
    import {T, useTask, useThrelte} from '@threlte/core'
    import {onMount} from 'svelte';
    import Player from '$lib/components/Player.svelte';
    import OnlinePlayer from '$lib/components/OnlinePlayer.svelte';
    import {ContactShadows, Grid, OrbitControls, Text} from "@threlte/extras";
    import {BoxGeometry, Camera, MeshStandardMaterial, PerspectiveCamera, Vector3} from "three";
    import Ground from './Ground.svelte';
    import { cameraControls, playerRigidbodyStore } from './stores'
    import type CameraControls from 'camera-controls';
    import CameraControlsComponent from './CameraControls.svelte';

    let player: any = null;
    let currentPlayerData: any = null;
    let scenePlayers: any[] = [];

    let camera: CameraControls;

    export let socket: any;

    //On connecting to the client
    export function OnConnected(playerData: any, serverPlayers: any[]) {
        console.log("New connection: (" + playerData.userId + ")");
        currentPlayerData = playerData;

        //Updates the scenePlayers with the serverUsers
        serverPlayers.forEach(user => {
            if (user.userId != playerData.userId)
                scenePlayers = [...scenePlayers, {
                    userId: user.userId,
                    position: [user.position.x, user.position.y, user.position.z],
                    color: user.color,
                    playerInstance: null
                }];
        });
    }

    //On a new user is connected to the server
    export function OnUserConnected(userId: string) {
        if (currentPlayerData.userId == userId)//If is the current user, it ignores it
            return;

        console.log("New user connected: (" + userId + ")");

        //La creacion de new Player se tiene que hacer desde $:, desde aqui no tiene alcance ¯\_(ツ)_/¯
        scenePlayers = [...scenePlayers, {userId: userId, playerInstance: null}];
    }

    export function OnUserDisconnected(userId: string) {
        const userIndex = scenePlayers.findIndex(user => user.userId === userId);
        if (userIndex !== -1) {
            scenePlayers[userIndex].disconnected = true;
        }
    }

    //Creates the player
    $: if (currentPlayerData && !player) {
        player = new Player({
            target: canvas,
            props: {
                socket: socket,
                userId: currentPlayerData.userId,
                color: currentPlayerData.color
            }
        });
    }

    $: {
        scenePlayers.forEach((user, index) => {
            //If it is marked for desconnection
            if (user.disconnected && user.playerInstance) {
                user.playerInstance.$destroy();
                user.playerInstance = null;
                scenePlayers.splice(index, 1);
            } else { //Creates the online players
                if (user.playerInstance == null) {
                    user.playerInstance = new OnlinePlayer({
                        target: canvas,
                        props: {
                            position: user.position,
                            color: user.color,
                            userId: user.userId
                        }
                    });
                }
            }
        })
    }

    let canvas: any = null;
    onMount(() => {
        canvas = document.querySelector('Canvas');

        socket.on('move', (userId: string, newPos: any) => {
            const user = scenePlayers.find(user => user.userId === userId);
            if (user) {
                user.playerInstance?.SetPosition(newPos);
            }
        })
        
        socket.on('user-color', (userId: string, newColor: string) => {
            const user = scenePlayers.find(user => user.userId === userId);
            if (user) {
                user.playerInstance?.SetColor(newColor);
            }
        })

        socket.on('user-set-nick', (userId: string, newNick: string) => {
            const user = scenePlayers.find(user => user.userId === userId);
            if (user) {
                user.playerInstance?.SetNick(newNick);
            }
        })
        
    });
</script>

<T.PerspectiveCamera
    makeDefault
    position={[-30, 30, 30]}
    fov={15}
>
<OrbitControls
    enableZoom={true}
    enableDamping
    target.y={1.5}
/>
  <CameraControlsComponent
    on:create={({ ref }) => {
      camera = ref
    }}
  />
</T.PerspectiveCamera>

<T.DirectionalLight
    intensity={1}
    position.x={5}
    position.y={10}
/>
<T.AmbientLight intensity={0.5}/>

<Grid
    position.y={-0.001}
    cellColor="#ffffff"
    sectionColor="#ffffff"
    sectionThickness={0}
    fadeDistance={250}
    cellSize={2}
/>

<ContactShadows
    scale={10}
    blur={2}
    far={2.5}
    opacity={0.5}
/>

  <AutoColliders shape={'cuboid'}>
    <T.Mesh
      receiveShadow
      geometry={new BoxGeometry(30, 1, 30)}
      material={new MeshStandardMaterial()}
    />
  </AutoColliders>

  <AutoColliders shape={'cuboid'}>
    <T.Mesh
      receiveShadow
      castShadow
      position.x={5}
      position.y={1.275}
      geometry={new BoxGeometry(2, 50, 2)}
      material={new MeshStandardMaterial({
        transparent: true,
        opacity: 0.5,
        color: 0x333333
      })}
    />
  </AutoColliders>


    <AutoColliders shape={'cuboid'}>
    <T.Mesh
      receiveShadow
      castShadow
      position.x={-4}
      position.y={1.275}
      rotation.x={90}
      geometry={new BoxGeometry(2, 50, 2)}
      material={new MeshStandardMaterial({
        transparent: true,
        opacity: 0.5,
        color: 0x333333
      })}
    />
  </AutoColliders>
