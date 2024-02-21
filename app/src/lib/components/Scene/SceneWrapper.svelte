<script lang="ts">
    import { T, useThrelte } from "@threlte/core";
    import Scene from "./Scene.svelte";
    import PlayersWrapper from "../Players/PlayersWrapper.svelte";
    import { ContactShadows, Sky, interactivity } from "@threlte/extras";
    import { debugRapierStore, mouseXStore, mouseYStore, playerPositionStore } from "../../stores/stores";
    import SpawnPlayer from "./SpawnPlayer.svelte";
    import { DirectionalLight, Vector3 } from "three";
    import { Debug } from "@threlte/rapier";

    export let socket: any = null;
    let mouseX: number = 0;
    let mouseY: number = 0;

    //The mouseX and mouseY values are passed to the interactivity
    const { camera } = useThrelte();
    interactivity({
        compute: (event, state) => {
            state.pointer.update((updater) => {
                let x: number = (mouseX / window.innerWidth) * 2 - 1;
                let y: number = -(mouseY / window.innerHeight) * 2 + 1;
                updater.x = x;
                updater.y = y;
                return updater;
            });
            state.raycaster.setFromCamera(state.pointer.current, camera.current);
        },
    });

    $: if ($mouseXStore && $mouseYStore) {
        mouseX = $mouseXStore;
        mouseY = $mouseYStore;
    }

    let playerPosition: Vector3;
    $: if ($playerPositionStore) {
        playerPosition = $playerPositionStore;
    }
</script>

{#if $debugRapierStore}
    <Debug />
{/if}

<Sky elevation={1} />
<T.AmbientLight intensity={0.5} />
{#if playerPosition}
    <T.DirectionalLight
        castShadow
        position={[0, 100, 0]}
        shadow.camera.left={playerPosition.x + 10}
        shadow.camera.right={playerPosition.x - 10}
        shadow.camera.top={-playerPosition.z - 10}
        shadow.camera.bottom={-playerPosition.z + 10}
    />
{/if}
<Scene />
<SpawnPlayer position={[0, 1, 0]} />

{#if socket}
    <PlayersWrapper />
{/if}
