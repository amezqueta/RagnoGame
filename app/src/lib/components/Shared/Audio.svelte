<script lang="ts">
    import { PositionalAudio } from "@threlte/extras";
    let audio: PositionalAudio;
    let src: string;
    export const play = (_src: string) => {
        src = _src;
        audio.play();
    };
    $: console.log(src);
</script>

<PositionalAudio bind:this={audio} id={"global"} refDistance={10} volume={1} {src} />
