<script lang="ts">
    import type { Writable } from "svelte/store";
    export let panelOpen: Writable<number>;
</script>

{#if $panelOpen}
    <div id="windowWrapper">
        <div class="bg" on:click={(_) => panelOpen.set(0)}></div>
        <div class="windowShell">
            <div class="taskBar">
                <button on:click={(_) => panelOpen.set(0)} class="closeBtn">
                    <svg width="12" height="12" viewBox="0 0 12 12"
                        ><path
                            d="M1.146 1.146a.5.5 0 01.708 0h0L6.096 5.39l4.243-4.243a.5.5 0 01.707.708L6.803 6.096l4.243 4.243a.5.5 0 01.058.638l-.058.069a.5.5 0 01-.707 0h0L6.096 6.803l-4.242 4.243a.5.5 0 11-.708-.707L5.39 6.096 1.146 1.854a.5.5 0 01-.057-.638z"
                            fill="#FFF"
                            stroke="#FFF"
                            stroke-width="1"
                            fill-rule="evenodd"
                        ></path></svg
                    >
                </button>
            </div>
            {#if $panelOpen === 1}
                <div>holiii</div>
            {:else if $panelOpen === 2}
                <div>2222</div>
            {/if}
        </div>
    </div>
{/if}

<style>
    #windowWrapper {
        position: fixed;
        top: 0px;
        left: 0px;
        right: 0px;
        bottom: 0px;
        display: flex;
        justify-content: center;
        pointer-events: all;
    }
    .bg {
        background-color: rgba(0, 0, 0, 0.5);
        position: fixed;
        top: 0px;
        left: 0px;
        right: 0px;
        bottom: 0px;
    }
    .windowShell {
        z-index: 500;
        max-width: 500px;
        height: 500px;
        background-color: var(--dark);
        margin: 0 auto;
        display: flex;
        align-self: center;
        flex-grow: 1;
        flex-direction: column;
        padding: 15px;
        border-radius: 15px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: var(--light);
    }
    .taskBar {
        display: flex;
        flex-direction: row-reverse;
    }
    .closeBtn {
        width: 40px;
        height: 40px;
        align-items: center;
        justify-content: center;
        border-radius: 100px;
        margin: 5px;
        box-shadow: rgb(0, 0, 0) 0px 2px 8px;
        background-color: rgba(255, 255, 255, 0.05);
    }
</style>
