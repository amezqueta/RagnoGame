<script lang="ts">
    import DomPortal from "./Utilities/DomPortal.svelte";
    import { useTask, useThrelte } from "@threlte/core";
    import { clamp } from "svelte-tweakpane-ui/Utils.js";
    import { onDestroy, onMount } from "svelte";
    import { cursorShowStore, mouseXStore, mouseYStore, pointerLockerStore } from "./stores";
    import { useControls } from "../hooks/useControls";
    const { controlActions } = useControls();

    let prev_hoverElementUI: Element | null;
    let hoverElementUI: Element | null;
    let pressedElementUI: Element | null;

    let mousex: number = 0;
    let mousey: number = 0;
    let isCursorShown = false;
    $: isCursorShown = $cursorShowStore && $pointerLockerStore && !$controlActions.emotes;

    const { renderer } = useThrelte();
    const domElement = renderer.domElement;
    document.addEventListener("pointerlockchange", onPointerlockChange);

    function onPointerlockChange() {
        pointerLockerStore.set(document.pointerLockElement != null);
        if (!$pointerLockerStore) hoverElementUI = null;
    }

    function onMouseDown(e: MouseEvent) {
        let targetTag = e?.target as Element;
        if (targetTag == null) return;
        if (!$pointerLockerStore && targetTag.tagName == "CANVAS") {
            domElement.requestPointerLock();
            mousex = e.clientX;
            mousey = e.clientY;
        } else if (isCursorShown) {
            simulateClick(e, mousex, mousey);
        }
    }

    const simulateClick = (e: MouseEvent, x: number, y: number) => {
        if (hoverElementUI == null) return;

        let tagName = hoverElementUI.tagName;
        if (tagName === "CANVAS") return;

        let event = new MouseEvent("click", {
            view: e.view,
            bubbles: true,
            cancelable: true,
            clientX: x,
            clientY: y,
            button: 0,
            buttons: 1,
            ctrlKey: e.ctrlKey,
        });
        hoverElementUI?.dispatchEvent(event);
        hoverElementUI?.classList.add("clicked");
        pressedElementUI = hoverElementUI;
    };

    function onMouseMove(e: MouseEvent) {
        if (!isCursorShown) return;
        const { movementX, movementY } = e;
        mousex += movementX;
        mousey += movementY;
        mousex = clamp(mousex, 0, window.innerWidth);
        mousey = clamp(mousey, 0, window.innerHeight);
        mouseXStore.set(mousex);
        mouseYStore.set(mousey);
        hoverElementUI = document.elementFromPoint(mousex, mousey);
    }

    function onMouseUp(e: MouseEvent) {
        pressedElementUI?.classList.remove("clicked");
        pressedElementUI = null;
    }

    onDestroy(() => {
        document.removeEventListener("pointerlockchange", onPointerlockChange);
    });

    $: if (hoverElementUI != prev_hoverElementUI) {
        prev_hoverElementUI?.classList.remove("hovered");
        hoverElementUI?.classList.add("hovered");
        prev_hoverElementUI = hoverElementUI;
    }
</script>

<svelte:window on:mousedown={onMouseDown} on:mousemove={onMouseMove} on:mouseup={onMouseUp} />
{#if isCursorShown}
    <DomPortal>
        <div id="cursor-wrapper">
            <div id="fake-cursor" style="top:{mousey}px; left: {mousex}px;"></div>
        </div>
    </DomPortal>
{/if}

<style>
    #cursor-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        pointer-events: none;
        z-index: 999;
    }
    #fake-cursor {
        width: 32px;
        height: 32px;
        position: absolute;
        background-image: url("/img/icon/cursor/cursor_open.gif");
    }
</style>
