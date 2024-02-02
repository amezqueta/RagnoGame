<script lang="ts">
    import { T } from "@threlte/core";
    import { useControls } from "$lib/hooks/useControls";
    import { playerPositionStore } from "../stores";
    import { Vector3, Euler } from "three";
    const { controlActions } = useControls();
    let hover = false;

    export let position: number[] = [0, 0, 0];
    let v3 = new Vector3(position[0], position[1], position[2]);

    export let visible = true;
    export let rotation: number = 0;
    export let material: any;
    export let geometry: any;
    export let onClickMesh: (mainPlayerPosition: Vector3) => void;
    export let onMouseOver: (hover: boolean) => void;
    export let onMouseOut: () => void;
    export let distance: number = 5;
    material.emissive.set("white");

    const distanceIsEnough = (): boolean => {
        if (!mainPlayerPosition) return false;
        return filtersActive() && mainPlayerPosition.distanceTo(v3) < distance;
    };

    const filtersActive = (): boolean => {
        return !$controlActions.emotes;
    };

    let mainPlayerPosition: Vector3 = new Vector3();
    $: if (playerPositionStore) mainPlayerPosition = $playerPositionStore;

    $: {
        material.emissiveIntensity = hover && distanceIsEnough() ? 0.1 : 0;
    }

    $: if (position) {
        v3 = new Vector3(position[0], position[1], position[2]);
    }
</script>

<T.Mesh
    on:click={() => {
        if (distanceIsEnough()) onClickMesh(mainPlayerPosition);
    }}
    on:pointermove={(e) => {
        (hover = distanceIsEnough());
        onMouseOver(hover);
    }}
    on:pointerout={(e) =>{
        (hover = false)
        onMouseOut();
    }}
    {position}
    rotation.y={rotation}
    {geometry}
    {material}
    {visible}
/>
