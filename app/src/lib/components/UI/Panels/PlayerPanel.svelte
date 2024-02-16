<script lang="ts">
    import { playerColorStore, playerDataStore } from "$lib/components/stores";
    import ColorPicker, { ChromeVariant } from "svelte-awesome-color-picker";

    let color = "#f33653";
    $: if (playerColorStore) color = $playerColorStore;
    $: playerColorStore.set(color);
</script>

<h2>{$playerDataStore.nick}</h2>
<ColorPicker label="Color" --cp-border-color="var(--light)" bind:hex={color} components={ChromeVariant} sliderDirection="horizontal" />
