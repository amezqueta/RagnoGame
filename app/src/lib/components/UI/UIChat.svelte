<script lang="ts">
    let value = "";
    export let socket: any;
    let playerData: any;

    function clickButton() {
        if (value == "") return;
        socket?.emit("msg", playerData.nick + ": " + value);
        value = "";
    }

    function onTextInput() {}
</script>

<div id="chat__wrapper">
    <div id="chat__container">
        <input bind:value on:input={onTextInput} />
        <button type="button" on:click={clickButton}>Send</button>
    </div>
</div>

<style>
    #chat__wrapper {
        position: absolute;
        width: 100%;
        top: 0;
        bottom: 0;
        display: flex;
        flex-direction: column-reverse;
    }
    #chat__container {
        pointer-events: all;
    }
</style>
