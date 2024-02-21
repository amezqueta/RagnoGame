<script lang="ts">
    import DomPortal from "../Utilities/DomPortal.svelte";
    import { useControls } from "../../hooks/useControls";
    import { pointerLockerStore, socketStore } from "../../stores/stores";
    const { controlActions } = useControls();

    const emotionsAmount = 14;

    let pointerX: number = 0;
    let pointerY: number = 0;

    let ePressedOnce = false;
    $: if ($controlActions.emotes || !$controlActions.emotes) {
        ePressedOnce = $controlActions.emotes;
    }

    $: if (ePressedOnce || !ePressedOnce) {
        handleSubscription();
    }

    const handleSubscription = () => {
        if (ePressedOnce) {
            addEventListener("click", onClick);
            addEventListener("mousemove", onMouseMove);
        } else {
            hoverElementUI = null;
            removeEventListener("click", onClick);
            removeEventListener("mousemove", onMouseMove);
        }
    };

    const onMouseMove = (e: MouseEvent) => {
        const screenCenterX = window.innerWidth / 2;
        const screenCenterY = window.innerHeight / 2;

        // Calculate mouse coordinates relative to the center of the screen
        let relativeX = pointerX + e.movementX * 2 - screenCenterX;
        let relativeY = pointerY + e.movementY * 2 - screenCenterY;

        // Calculate radial distance from the center
        const distanceFromCenter = Math.sqrt(relativeX ** 2 + relativeY ** 2);

        if (distanceFromCenter < 20) {
            const angle = Math.atan2(relativeY, relativeX);
            relativeX = Math.cos(angle) * 20;
            relativeY = Math.sin(angle) * 20;
        } else if (distanceFromCenter > 200) {
            const angle = Math.atan2(relativeY, relativeX);
            relativeX = Math.cos(angle) * 200;
            relativeY = Math.sin(angle) * 200;
        }

        // Update the pointer coordinates
        pointerX = screenCenterX + relativeX;
        pointerY = screenCenterY + relativeY;

        hoverElementUI = document.elementFromPoint(pointerX, pointerY);
    };

    const onClick = (e: MouseEvent) => {
        if (e.button !== 0) return;
        if (hoverElementUI == null) return;
        hoverElementUI.click();
    };

    const onClickEmote = (index: number) => {
        socket.emit("player-emote", index);
    };

    let hoverElementUI: any;
    let prev_hoverElementUI: any;

    $: if (hoverElementUI != prev_hoverElementUI) {
        prev_hoverElementUI?.classList.remove("hovered");
        hoverElementUI?.classList.add("hovered");
        prev_hoverElementUI = hoverElementUI;
    }

    let socket: any;
    $: if (socketStore) socket = $socketStore;
    //For hovered and clicked class
    let hovered = false;
    let clicked = false;
</script>

{#if $controlActions.emotes && $pointerLockerStore}
    <DomPortal
        ><div id="emote-wrapper">
            <div id="ring-panel">
                <ul>
                    {#each Array(emotionsAmount) as _, index (index)}
                        <li style="transform: rotate({(360 / emotionsAmount) * index}deg);">
                            <button
                                class:hovered
                                class:clicked
                                on:click={() => {
                                    onClickEmote(index);
                                }}
                                type="button"
                                ><div
                                    class="emote"
                                    style="background-image: url('/img/icon/emote/emote_{index}.png');
                                transform: rotate({(360 / -emotionsAmount) * index}deg);"
                                ></div></button
                            >
                        </li>
                    {/each}
                </ul>
            </div>
        </div>
        {#if $controlActions.emotes}
            <div id="pointer-wrapper">
                <div id="pointer" style="top: {pointerY - 8}px; left:{pointerX - 8}px;"></div>
            </div>
        {/if}
    </DomPortal>
{/if}

<style>
    #emote-wrapper {
        top: 0;
        position: absolute;
        width: 100%;
        height: 100%;
        pointer-events: none;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
    }

    #ring-panel {
        width: 500px;
        height: 500px;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        position: relative;
        display: flex;
        overflow: hidden;
    }

    ul {
        display: flex;
        align-items: center;
        width: 100%;
        margin: 0;
        padding: 0;
    }

    li {
        width: 100%;
        height: 210px;
        position: absolute;
        justify-content: right;
        list-style: none;
        clip-path: polygon(-8px 225px, 50% 50%, -42px 98px);
    }

    button {
        width: 248px;
        height: 261px;
        pointer-events: all;
        background-color: transparent;
    }
    button.hovered .emote {
        background-size: 100%;
    }

    button.clicked .emote {
        background-size: 60%;
    }
    .emote {
        width: 80px;
        height: 80px;
        background-size: 70%;
        background-repeat: no-repeat;
        background-position: center;
        transition: all 0.2s;
        pointer-events: none;
    }
    #pointer {
        width: 16px;
        height: 16px;
        position: absolute;
        background-image: url("/img/icon/cursor/cursor_pointer.png");
        opacity: 0.6;
    }

    #pointer-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        pointer-events: none;
        z-index: 99;
    }
</style>
