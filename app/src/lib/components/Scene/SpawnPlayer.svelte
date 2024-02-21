<script lang="ts">
    import { onMount } from "svelte";
    import { playerSpawnsStore } from "../../stores/stores";
    import DebugObject from "../Scene/DebugObject.svelte";
    export let position: number[];

    onMount(() => {
        playerSpawnsStore.update((spawns) => [...spawns, position]);
    });
</script>

<DebugObject {position} text={"spawn"} />
