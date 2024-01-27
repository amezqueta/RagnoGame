<script lang="ts">
  import { Group } from "three";
  import { T, forwardEventHandlers } from "@threlte/core";
  import { useGltf } from "@threlte/extras";

  export const ref = new Group();
  export let nodeName: any;
  let url: string = `model/environment/prop/${nodeName}.glb`;

  const gltf = useGltf(url, { useDraco: true });

  const component = forwardEventHandlers();
</script>

<T is={ref} dispose={false} {...$$restProps} bind:this={$component}>
  {#await gltf}
    <slot name="fallback" />
  {:then gltf}
    <T.Mesh geometry={gltf.nodes[nodeName].geometry} material={gltf.materials.Material} />
  {:catch error}
    <slot name="error" {error} />
  {/await}

  <slot {ref} />
</T>
