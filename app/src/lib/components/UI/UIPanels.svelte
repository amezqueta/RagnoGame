<script lang="ts">
    import { writable, type Writable } from "svelte/store";
    import PlayerPanel from "./Panels/PlayerPanel.svelte";
    import SettingsPanel from "./Panels/SettingsPanel.svelte";
    export let panelOpen: Writable<number> = writable(0);

    interface Panel {
        title: string;
        panel: any;
    }
    const panels: Panel[] = [
        { title: "Player", panel: PlayerPanel },
        { title: "Server Settings", panel: SettingsPanel },
    ];
</script>

{#if $panelOpen}
    <div id="windowWrapper">
        <div class="bg" on:click={(_) => panelOpen.set(0)}></div>
        <div class="windowShell">
            <div class="taskBar">
                <h1>{panels[$panelOpen - 1].title}</h1>
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
            <hr />
            <svelte:component this={panels[$panelOpen - 1].panel} />
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
        color: var(--light);
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
        height: 100vh;
        max-height: 500px;
        background-color: var(--dark);
        display: flex;
        align-self: center;
        flex-grow: 1;
        flex-direction: column;
        padding: 15px;
        border-radius: 15px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: var(--light);
    }
    .taskBar {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .closeBtn {
        width: 40px;
        height: 40px;
        align-items: center;
        justify-content: center;
        border-radius: 100px;
        margin: 5px;
        background-color: rgba(255, 255, 255, 0.05);
    }
    .closeBtn:hover {
        background-color: rgba(255, 255, 255, 0.15);
    }
    .windowShell h1 {
        font-size: 1.5em;
    }
    :global(.windowShell h2) {
        font-size: 1.1em;
    }
</style>
