<script lang="ts">
    import { useTask } from "@threlte/core";
    import { HTML } from "@threlte/extras";

    let emoteId: number = -1;
    let time = 0;

    const { stop, start } = useTask((deltatime) => {
        time -= deltatime;
        if (time < 0) {
            emoteId = -1;
            stop();
        }
    });
    stop();

    export const playEmote = (_emoteId: number) => {
        emoteId = _emoteId;
        time = 3;
        start();
    };
</script>

{#if emoteId != -1}
    <HTML position={[0, 1, 0]} sprite={true} occlude={true} distanceFactor={1}>
        <img src="/img/icon/emote/emote_{emoteId}.png" class="emote" alt="emote" class:fadeIn={time > 0.3 && time < 2.9} />
    </HTML>
{/if}

<style>
    .emote {
        transition: all 0.3s;
        opacity: 0;
        transform: scale(0);
    }
    .fadeIn {
        opacity: 1;
        transform: scale(1);
    }
</style>
