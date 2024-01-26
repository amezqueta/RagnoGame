<script lang="ts">
    import { GLTF, useTexture } from "@threlte/extras";
    import { MaskMaterial } from "postprocessing";
    import { MeshStandardMaterial, MeshToonMaterial } from "three";
    export let scale: number[] = [4, 4, 4];
    export let position: number[] = [0, 0, 0];
</script>

<GLTF url={"models/environment/Bush_00.glb"} {position} {scale} />
