<script lang="ts">
    import { T, useThrelte } from "@threlte/core";
    import Scene from "./Scene.svelte";
    import PlayersWrapper from "./Players/PlayersWrapper.svelte";
    import { ContactShadows, Sky, interactivity } from "@threlte/extras";
    import { mouseXStore, mouseYStore } from "./stores";
    import SpawnPlayer from "./Scene/SpawnPlayer.svelte";

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
</script>

<Sky elevation={1} />
<T.AmbientLight intensity={0.5} />
<ContactShadows scale={10} blur={2} far={2.5} opacity={0.5} />
<Scene />
<SpawnPlayer position={[25, 1, 10]} />

{#if socket}
    <PlayersWrapper />
{/if}
