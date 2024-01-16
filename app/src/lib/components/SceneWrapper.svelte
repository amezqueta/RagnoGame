<script lang="ts">
    import { T, useThrelte } from "@threlte/core";
    import CameraControlsComponent from "./CameraControls.svelte";
    import Scene from "./Scene.svelte";
    import PlayersWrapper from "./Players/PlayersWrapper.svelte";
    import { interactivity } from "@threlte/extras";
    import { mouseXStore, mouseYStore } from "./stores";

    export let socket: any = null;
    let mouseX: number = 0;
    let mouseY: number = 0;

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

<T.PerspectiveCamera makeDefault position={[-30, 30, 30]} fov={15}>
    <CameraControlsComponent />
</T.PerspectiveCamera>
<T.DirectionalLight intensity={1} position.x={5} position.y={10} />
<Scene />
{#if socket}
    <PlayersWrapper />
{/if}
