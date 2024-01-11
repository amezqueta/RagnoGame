<script>
    import DomPortal from "../Utilities/DomPortal.svelte";
    import UiDebug from "./UIDebug.svelte";

    function clickButton() {}
</script>

<UiDebug />
<DomPortal
    ><div id="UI-wrapper">
        <button type="button" on:click={clickButton}>Click Me!</button>
    </div></DomPortal
>

<style>
    #UI-wrapper {
        position: absolute;
        width: 100%;
        top: 0;
    }
</style>
