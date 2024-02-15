<script lang="ts">
    import DomPortal from "../Utilities/DomPortal.svelte";
    import { socketStore } from "../stores";
    import UiDebug from "./UIDebug.svelte";
    import EmotesUI from "./EmotesUI.svelte";
    import UIPowerup from "./UIPowerup.svelte";
    import UIChat from "./UIChat.svelte";
    import SocialMedia from "./SocialMedia.svelte";
    import toast, { Toaster } from "svelte-french-toast";
    import { onMount } from "svelte";

    let socket: any;

    $: if (socketStore) socket = $socketStore;
</script>

<UiDebug />
{#if socket}
    <DomPortal
        ><div id="UI__wrapper">
            <UIPowerup {socket} />
            <UIChat {socket} />
            <SocialMedia />
        </div>
        <Toaster toastOptions={{ style: "background: #333; color: #fff; border-radius: 0;", duration: 5000 }} />
    </DomPortal>
{/if}

<EmotesUI />

<style>
    #UI__wrapper {
        pointer-events: none;
        position: absolute;
        width: 100%;
        bottom: 0;
        top: 0;
    }
</style>
