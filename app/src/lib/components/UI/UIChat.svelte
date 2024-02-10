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

<input bind:value on:input={onTextInput} />
<button type="button" on:click={clickButton}>Send</button>
