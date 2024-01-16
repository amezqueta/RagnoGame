<script lang="ts">
    import DomPortal from "./Utilities/DomPortal.svelte";
    import { useTask, useThrelte } from "@threlte/core";
    import { clamp } from "svelte-tweakpane-ui/Utils.js";
    import { onDestroy, onMount } from "svelte";
    import { cursorShowStore, mouseXStore, mouseYStore } from "./stores";

    let prev_hoverElementUI: Element | null;
    let hoverElementUI: Element | null;
    let pressedElementUI: Element | null;

    let mousex: number = 0;
    let mousey: number = 0;
    let show = true;
    let pointerLocked: boolean = false;

    const { renderer } = useThrelte();
    const domElement = renderer.domElement;
    addEventListener("pointerlockchange", onPointerlockChange);

    function onPointerlockChange() {
        pointerLocked = document.pointerLockElement != null;
        if (!pointerLocked) hoverElementUI = null;
    }

    function onMouseDown(e: MouseEvent) {
        let targetTag = e?.target as Element;
        if (targetTag == null) return;
        if (!pointerLocked && targetTag.classList.contains("svelte-o3oskp")) {
            domElement.requestPointerLock();
            mousex = e.clientX;
            mousey = e.clientY;
        } else if (isBeingShown()) {
            simulateClick(e, mousex, mousey);
        }
    }

    function simulateClick(e: MouseEvent, x: number, y: number) {
        var event = new MouseEvent("click", {
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
    }

    const isBeingShown = () => {
        return pointerLocked && show;
    };

    function onMouseMove(e: MouseEvent) {
        if (!isBeingShown()) return;
        const { movementX, movementY } = e;
        mousex += movementX;
        mousey += movementY;
        mousex = clamp(mousex, 0, window.innerWidth);
        mousey = clamp(mousey, 0, window.innerHeight);
        mouseXStore.set(mousex);
        mouseYStore.set(mousey);
        hoverElementUI = document.elementFromPoint(mousex, mousey);

        if (cursor) {
            cursor.style.left = `${mousex}px`;
            cursor.style.top = `${mousey}px`;
        }
    }

    function onMouseUp(e: MouseEvent) {
        pressedElementUI?.classList.remove("clicked");
        pressedElementUI = null;
    }

    let cursor = document.getElementById("fake-cursor");
    onMount(() => {
        cursor = document.getElementById("fake-cursor");
    });

    onDestroy(() => {
        removeEventListener("pointerlockchange", onPointerlockChange);
    });

    $: if (cursorShowStore) show = $cursorShowStore;

    $: if (cursor) cursor.style.display = pointerLocked && show ? "block" : "none";

    $: if (hoverElementUI != prev_hoverElementUI) {
        prev_hoverElementUI?.classList.remove("hovered");
        hoverElementUI?.classList.add("hovered");
        prev_hoverElementUI = hoverElementUI;
    }
</script>

<svelte:window on:mousedown={onMouseDown} on:mousemove={onMouseMove} on:mouseup={onMouseUp} />
<DomPortal>
    <div id="cursor-wrapper">
        <div id="fake-cursor"></div>
    </div>
</DomPortal>

<style>
    #cursor-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        pointer-events: none;
        z-index: 99;
    }
    #fake-cursor {
        width: 32px;
        height: 32px;
        position: absolute;
        background-image: url("/img/icon/cursor/cursor_open.gif");
        display: none;
    }
</style>
