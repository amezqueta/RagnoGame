<script lang="ts">
    import DomPortal from "../Utilities/DomPortal.svelte";
    import { socketStore } from "../stores";
    import UiDebug from "./UIDebug.svelte";
    import EmotesUI from "./EmotesUI.svelte";
    import UICardDeal from "./UICardDeal.svelte";
    import UIChat from "./UIChat.svelte";

    let socket: any;

    $: if (socketStore) socket = $socketStore;
</script>

<UiDebug />
{#if socket}
    <DomPortal
        ><div id="UI-wrapper">
            <UICardDeal />
            <UIChat {socket} />
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
