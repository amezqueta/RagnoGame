<script lang="ts">
    import { socketStore } from "$lib/stores/stores";
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
    <label
        >Player speed:
        <input type="number" on:change={handleSettings} bind:value={$serverSettingsStore.playerSpeed} /></label
    >
</div>
<div>
    <label
        >Jump height:
        <input type="number" on:change={handleSettings} bind:value={$serverSettingsStore.jumpForce} /></label
    >
</div>
<button on:click={handleStart}>Start</button>
