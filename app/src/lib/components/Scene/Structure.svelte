<script lang="ts">
    import { Group, MeshStandardMaterial, RepeatWrapping, ShaderMaterial, TextureLoader, NearestFilter } from "three";
    import { T, forwardEventHandlers } from "@threlte/core";
    import { useGltf, useTexture } from "@threlte/extras";
    import { AutoColliders } from "@threlte/rapier";
    import { Vector3 } from "@dimforge/rapier3d-compat";

    export const ref = new Group();
    export let nodeName: any;
    let url: string = `model/environment/structure/${nodeName}.glb`;

    const gltf = useGltf(url, { useDraco: true });

    const texture = useTexture("tex/brick_00.png", {
        transform: (texture) => {
            texture.wrapS = RepeatWrapping;
            texture.wrapT = RepeatWrapping;
            texture.magFilter = NearestFilter;
            return texture;
        },
    });
    const scaleFactor = 0.1;

    // Triplanar Shader
    const triplanarShaderMaterial = new ShaderMaterial({
        uniforms: {
            textureX: { value: null },
            textureY: { value: null },
            textureZ: { value: null },
            scaleFactor: { value: scaleFactor },
            directionalLightDirection: { value: new Vector3(0, 1, 0) },
        },
        vertexShader: `
            varying vec3 vWorldPosition;
            varying vec2 vUv;

            void main() {
                vUv = uv;
                vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                vWorldPosition = worldPosition.xyz;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            varying vec3 vWorldPosition;
            varying vec2 vUv;

            uniform sampler2D textureX;
            uniform sampler2D textureY;
            uniform sampler2D textureZ;
            uniform float scaleFactor;
            uniform vec3 directionalLightDirection;

            void main() {
                vec3 worldNormal = abs(normalize(cross(dFdx(vWorldPosition), dFdy(vWorldPosition))));
                vec3 triplanarX = texture2D(textureX, vWorldPosition.yz * scaleFactor).xyz;
                vec3 triplanarY = texture2D(textureY, vWorldPosition.xz * scaleFactor).xyz;
                vec3 triplanarZ = texture2D(textureZ, vWorldPosition.xy * scaleFactor).xyz;

                float intensity = max(dot(worldNormal, directionalLightDirection), 0.0);
                vec3 color = triplanarX * worldNormal.x * 0.5 + triplanarY * worldNormal.y + triplanarZ * 2.0 * worldNormal.z;
                gl_FragColor = vec4(color, 1.0);
            }
        `,
    });

    $: if ($texture) {
        triplanarShaderMaterial.uniforms.textureX.value = $texture;
        triplanarShaderMaterial.uniforms.textureY.value = $texture;
        triplanarShaderMaterial.uniforms.textureZ.value = $texture;
    }

    const component = forwardEventHandlers();
</script>

<T is={ref} dispose={false} {...$$restProps} bind:this={$component}>
    {#await gltf}
        <slot name="fallback" />
    {:then gltf}
        <AutoColliders shape="cuboid">
            <T.Mesh geometry={gltf.nodes[nodeName].geometry} material={triplanarShaderMaterial} receiveShadow />
        </AutoColliders>
    {:catch error}
        <slot name="error" {error} />
    {/await}

    <slot {ref} />
</T>
