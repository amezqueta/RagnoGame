<script lang="ts">
    import { Group, MeshStandardMaterial, RepeatWrapping, ShaderMaterial, TextureLoader, NearestFilter } from "three";
    import { T, forwardEventHandlers } from "@threlte/core";
    import { useGltf, useTexture } from "@threlte/extras";
    import { AutoColliders } from "@threlte/rapier";
    import { Vector3 } from "@dimforge/rapier3d-compat";

    export const ref = new Group();
    export let nodeName: any;
    export let tone: string = "";
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
            lightDirection: { value: new Vector3(0.25, 0.5, -1) },
            lightColor: { value: new Vector3(1, 1, 1) },
        },
        vertexShader: `
            varying vec3 vWorldPosition;
            void main() {
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
            uniform vec3 lightDirection;
            uniform vec3 lightColor;

            void main() {
                vec3 worldNormal = normalize(cross(dFdx(vWorldPosition), dFdy(vWorldPosition)));

                vec3 triplanarX = texture2D(textureX, vWorldPosition.yz * scaleFactor).xyz;
                vec3 triplanarY = texture2D(textureY, vWorldPosition.xz * scaleFactor).xyz;
                vec3 triplanarZ = texture2D(textureZ, vWorldPosition.xy * scaleFactor).xyz;

                vec3 color = triplanarX * abs(worldNormal.x) + triplanarY * abs(worldNormal.y) + triplanarZ * abs(worldNormal.z);

                float dot = dot(worldNormal, lightDirection);
                vec3 shadows = vec3(dot,dot,dot);
                vec3 negShadows = saturate(-shadows) * 0.1;
                shadows = saturate(shadows);
                shadows -= negShadows;
                shadows += lightColor * 0.25;

                color *= shadows;
                color = saturate(color);

                gl_FragColor = vec4(color, 1);
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
