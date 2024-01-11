<script lang="ts">
    import DomPortal from "./Utilities/DomPortal.svelte";
    import { useThrelte } from "@threlte/core";
    import { clamp } from "svelte-tweakpane-ui/Utils.js";
    import { onDestroy, onMount } from "svelte";

    let mousex = 0;
    let mousey = 0;

    const { renderer } = useThrelte();
    const domElement = renderer.domElement;
    addEventListener("mousemove", onMouseMove);
    addEventListener("mouseenter", onMouseEnter);
    addEventListener("pointerlockchange", onPointerlockchange);

    function onMouseEnter(e: MouseEvent) {}
    function onPointerlockchange(e: Event) {
        if (cursor)
            cursor.style.display = document.pointerLockElement
                ? "block"
                : "none";
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
        var element = document.elementFromPoint(x, y);
        element?.dispatchEvent(event);
    }

    function onMouseDown(e: MouseEvent) {
        let targetTag = e?.target as Element;
        if (targetTag == null) return;
        if (
            !document.pointerLockElement &&
            targetTag.tagName.toLowerCase() === "canvas"
        ) {
            domElement.requestPointerLock();
            mousex = e.clientX;
            mousey = e.clientY;
        } else {
            //simulateClick(e, mousex, mousey);
        }
    }

    function onMouseMove(e: MouseEvent) {
        const { movementX, movementY } = e;
        mousex += movementX;
        mousey += movementY;
        mousex = clamp(mousex, 0, window.innerWidth);
        mousey = clamp(mousey, 0, window.innerHeight);

        if (cursor) {
            cursor.style.left = `${mousex}px`;
            cursor.style.top = `${mousey}px`;
        }
    }

    let cursor = document.getElementById("fake-cursor");
    onMount(() => {
        cursor = document.getElementById("fake-cursor");
    });

    onDestroy(() => {
        removeEventListener("mousemove", onMouseMove);
        removeEventListener("mouseenter", onMouseEnter);
        removeEventListener("pointerlockchange", onPointerlockchange);
    });
</script>

<svelte:window on:mousedown={onMouseDown} />
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
