<script lang="ts">
    import { socketStore } from "$lib/stores/stores";
    import { playerColorStore, playerDataStore } from "$lib/stores/stores";
    import ColorPicker, { ChromeVariant } from "svelte-awesome-color-picker";
    import { characterSettingsStore } from "$lib/stores/characterSettingsStore";

    let color = "#f33653";
    $: if (playerColorStore) color = $playerColorStore;
    $: playerColorStore.set(color);

    const handlePlayerChange = (e) => {
        if (!$socketStore) return;
        $socketStore.emit("character-settings", $characterSettingsStore);
    };
</script>

<h2>{$playerDataStore.nick}</h2>
<ColorPicker label="Color" --cp-border-color="var(--light)" bind:hex={color} components={ChromeVariant} sliderDirection="horizontal" />
<div>
    <label
        >Weapon:
        <input type="number" on:change={handlePlayerChange} bind:value={$characterSettingsStore.weaponId} max="2" min="0" /></label
    >
    <label
        >Head:
        <input type="number" on:change={handlePlayerChange} bind:value={$characterSettingsStore.headId} max="1" min="0" /></label
    >
</div>
