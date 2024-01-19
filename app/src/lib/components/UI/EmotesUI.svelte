<script lang="ts">
    import DomPortal from "../Utilities/DomPortal.svelte";
    import { useControls } from "../../hooks/useControls";
    import { pointerLockerStore, socketStore } from "../stores";
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

        // Clamp the coordinates to be within the ring (between 100 and 200)
        if (distanceFromCenter < 120) {
            const angle = Math.atan2(relativeY, relativeX);
            relativeX = Math.cos(angle) * 120;
            relativeY = Math.sin(angle) * 120;
        } else if (distanceFromCenter > 160) {
            const angle = Math.atan2(relativeY, relativeX);
            relativeX = Math.cos(angle) * 160;
            relativeY = Math.sin(angle) * 160;
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
</script>

{#if true}// $controlActions.emotes && $pointerLockerStore}
    <DomPortal
        ><div id="emote-wrapper">
            <div id="ring-panel">
                <ul>
                    {#each Array(emotionsAmount) as _, index (index)}
                        <li style="transform: rotate({(360 / emotionsAmount) * index}deg);">
                            <button
                                on:click={() => {
                                    onClickEmote(index);
                                }}
                                type="button"
                                style="
                                transform: rotate({(360 / -emotionsAmount) * index}deg);
                                background-image: url('/img/icon/emote/emote_{index}.png');
                                "
                            ></button>
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

    button {
        width: 300px;
        height: 300px;
        pointer-events: all;
        background-size: 20%;
        background-position: center;
        background-repeat: no-repeat;
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
        height: 100px;
        position: absolute;
        justify-content: right;
        list-style: none;
        clip-path: polygon(-37px 434px, 50% 50%, -108px 242px);
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

    #pointer {
        width: 16px;
        height: 16px;
        position: absolute;
        background-image: url("/img/icon/cursor/cursor_pointer.png");
        opacity: 0.6;
    }
</style>
