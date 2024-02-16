<script lang="ts">
    import { useControls } from "$lib/hooks/useControls";
    import { playerDataStore } from "../stores";
    const { controlActions, isInputFocused } = useControls();

    let inputElement: HTMLInputElement;
    let value = "";
    export let socket: any;

    function clickButton() {
        inputElement.blur();
        if (value == "") return;
        if (!$playerDataStore) return;
        socket?.emit("msg", $playerDataStore.nick + ": " + value);
        value = "";
    }
    let inputChat = false;

    $: inputChat = $controlActions.chat;
    $: if (inputChat) isInputFocused() ? clickButton() : inputElement.focus();
</script>

<div id="chat__wrapper">
    <div id="chat__container">
        <input bind:value bind:this={inputElement} />
        <button type="button" on:click={clickButton}
            ><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path fill="currentColor" d="M3 20v-6l8-2l-8-2V4l19 8z" /></svg></button
        >
    </div>
</div>

<style>
    #chat__wrapper {
        width: 100%;
        top: 0;
        bottom: 0;
        display: flex;
        flex-direction: column-reverse;
    }
    #chat__container {
        pointer-events: all;
        padding: 5px 10px;
        display: flex;
    }
    button {
        background-color: transparent;
        color: var(--light);
        margin: 0px;
        padding: 0px;
    }
    input {
        min-width: 300px;
    }
</style>
