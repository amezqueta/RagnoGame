<script lang="ts">
    import { socketStore } from "$lib/components/stores";
    import { serverSettingsStore } from "$lib/stores/serverSettingsStore";

    const handleStart = () => {
        if (!$socketStore) return;
        $socketStore.emit("server-start");
    };

    const handleSettings = () => {
        if (!$socketStore) return;
        $socketStore.emit("server-settings", $serverSettingsStore);
    };
</script>

<div>
    <label>Player speed:</label>
    <input type="number" on:change={handleSettings} bind:value={$serverSettingsStore.playerSpeed} />
</div>
<div>
    <label>Jump height:</label>
    <input type="number" on:change={handleSettings} bind:value={$serverSettingsStore.jumpForce} />
</div>
<button on:click={handleStart}>Start</button>
