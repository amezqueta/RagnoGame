<script lang="ts">
    import DomPortal from "../Utilities/DomPortal.svelte";
    import { playerDataStore, socketStore } from "../stores";
    import UiDebug from "./UIDebug.svelte";
    import EmotesUI from "./EmotesUI.svelte";
    import { useControls } from "../../hooks/useControls";

    const { controlActions } = useControls();
    let value = "";
    let socket: any;
    let playerData: any;

    function clickButton() {
        if (value == "") return;
        socket?.emit("msg", playerData.nick + ": " + value);
        value = "";
    }

    function onTextInput() {}

    $: if (socketStore) socket = $socketStore;
    $: if (playerDataStore) playerData = $playerDataStore;
</script>

<UiDebug />
{#if socket && playerData}
    <DomPortal
        ><div id="UI-wrapper">
            <input bind:value on:input={onTextInput} />
            <button type="button" on:click={clickButton}>Send</button>
        </div></DomPortal
    >
{/if}

<EmotesUI />

<style>
    #UI-wrapper {
        position: absolute;
        width: 100%;
        bottom: 0;
    }
</style>
