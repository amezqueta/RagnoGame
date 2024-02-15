<script lang="ts">
    import DomPortal from "../Utilities/DomPortal.svelte";
    import { socketStore } from "../stores";
    import UiDebug from "./UIDebug.svelte";
    import EmotesUI from "./EmotesUI.svelte";
    import UIPowerup from "./UIPowerup.svelte";
    import UIChat from "./UIChat.svelte";
    import SocialMedia from "./SocialMedia.svelte";
    import { Toaster } from "svelte-french-toast";
    import UILeftMenu from "./UILeftMenu.svelte";
    import { pointerLockerStore } from "../stores";

    let socket: any;

    $: if (socketStore) socket = $socketStore;
    let hidePanels = false;
    $: hidePanels = $pointerLockerStore;
</script>

<UiDebug />
{#if socket}
    <DomPortal
        ><div id="UI__wrapper">
            <UIPowerup {socket} />
            <SocialMedia />
            <div class="toggleLeftMenu" class:hidePanels>
                <UILeftMenu />
                <UIChat {socket} />
            </div>
        </div>
        <Toaster containerStyle={"margin: 10px 10px 40px 80px"} toastOptions={{ style: "background: #333; color: #fff; border-radius: 0;", duration: 5000 }} />
    </DomPortal>
{/if}

<EmotesUI />

<style>
    #UI__wrapper {
        pointer-events: none;
        position: fixed;
        width: 100%;
        bottom: 0;
        top: 0;
    }
    .toggleLeftMenu {
        transition: all 0.5s;
        position: absolute;
        left: 0px;
        opacity: 1;
        display: flex;
        flex-direction: row;
        height: 100%;
    }
    .hidePanels {
        left: -80px;
        opacity: 0;
    }
</style>
