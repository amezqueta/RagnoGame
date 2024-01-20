<script lang="ts">
    import { BoxGeometry, MeshStandardMaterial, Vector3 } from "three";
    import ClickableMesh from "../Shared/ClickableMesh.svelte";
    import DebugObject from "./DebugObject.svelte";

    export let position: number[];
    const material = new MeshStandardMaterial();
    material.emissive.set("white");
    const distance = 4;

    const geometry = new BoxGeometry(2, 2, 2);

    const onClickMesh = () => {
        console.log("Mesh clicked!");
    };
</script>

<ClickableMesh {distance} {position} {geometry} {material} {onClickMesh} />
<DebugObject {position} text={"obj"} color={"#00FF00"} />
