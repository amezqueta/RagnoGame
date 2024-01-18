<script lang="ts">
    import { useTask } from "@threlte/core";
    import { HTML } from "@threlte/extras";

    export let emoteId: number;
</script>

<HTML position={[0, 7, 0]} sprite={true} occlude={true} distanceFactor={5}>
    <img src="/img/icon/emote/emote_{emoteId}.png" />
</HTML>
