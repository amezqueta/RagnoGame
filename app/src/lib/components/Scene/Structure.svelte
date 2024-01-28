<script lang="ts">
    import { Group, RepeatWrapping, ShaderMaterial, NearestFilter } from "three";
    import { T, forwardEventHandlers } from "@threlte/core";
    import { useGltf, useTexture } from "@threlte/extras";
    import { Collider } from "@threlte/rapier";
    import { Vector3 } from "@dimforge/rapier3d-compat";

    export const ref = new Group();
    export let nodeName: string = "Structure";
    export let textureY: string = "brick_00";
    export let textureXZ: string = "brick_00";
    export let textureScale: number = 0.1;
    export let tone: number[] = [0.25, 0.25, 0.25];
    let url: string = `model/environment/structure/${nodeName}.glb`;

    const gltf = useGltf(url, { useDraco: true });

    const texY = useTexture(`tex/${textureY}.png`, {
        transform: (texture) => {
            texture.wrapS = RepeatWrapping;
            texture.wrapT = RepeatWrapping;
            texture.magFilter = NearestFilter;
            return texture;
        },
    });

    const texXZ = useTexture(`tex/${textureXZ}.png`, {
        transform: (texture2) => {
            texture2.wrapS = RepeatWrapping;
            texture2.wrapT = RepeatWrapping;
            texture2.magFilter = NearestFilter;
            return texture2;
        },
    });

    // Triplanar Shader
    const triplanarShaderMaterial = new ShaderMaterial({
        uniforms: {
            textureX: { value: null },
            textureY: { value: null },
            textureZ: { value: null },
            scaleFactor: { value: textureScale },
            lightDirection: { value: new Vector3(0.25, 0.5, -1) },
            lightColor: { value: new Vector3(tone[0], tone[1], tone[2]) },
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

                vec3 triplanarX = texture2D(textureX, vWorldPosition.zy * scaleFactor).xyz;
                vec3 triplanarY = texture2D(textureY, vWorldPosition.xz * scaleFactor).xyz;
                vec3 triplanarZ = texture2D(textureZ, vWorldPosition.xy * scaleFactor).xyz;

                vec3 color = triplanarX * abs(worldNormal.x) + triplanarY * abs(worldNormal.y) + triplanarZ * abs(worldNormal.z);

                float dot = dot(worldNormal, lightDirection);
                vec3 shadows = vec3(dot,dot,dot);
                vec3 negShadows = saturate(-shadows) * 0.1;
                shadows = saturate(shadows);
                shadows -= negShadows;
                shadows += lightColor;

                color *= shadows;
                color = saturate(color);

                gl_FragColor = vec4(color, 1);
            }
        `,
    });

    $: if ($texY && $texXZ) {
        triplanarShaderMaterial.uniforms.textureY.value = $texY;
        triplanarShaderMaterial.uniforms.textureX.value = $texXZ;
        triplanarShaderMaterial.uniforms.textureZ.value = $texXZ;
    }

    const component = forwardEventHandlers();
</script>

<T is={ref} dispose={false} {...$$restProps} bind:this={$component}>
    {#await gltf}
        <slot name="fallback" />
    {:then gltf}
        <T.Group position={[0, 0.5, 0]}>
            <Collider shape="cuboid" args={[0.5, 0.5, 0.5]} />
            <T.Mesh geometry={gltf.nodes[nodeName].geometry} material={triplanarShaderMaterial} receiveShadow />
        </T.Group>
    {:catch error}
        <slot name="error" {error} />
    {/await}

    <slot {ref} />
</T>
