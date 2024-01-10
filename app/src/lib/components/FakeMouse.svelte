<script lang="ts">
    import { HTML } from "@threlte/extras";
    import DomPortal from "./Utilities/DomPortal.svelte";

    function fakeClick(x, y) {
        var event = new MouseEvent("click", {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: x,
            clientY: y,
        });

        var element = document.elementFromPoint(x, y);
        element?.dispatchEvent(event);
    }

    function onKeyDown(e: KeyboardEvent) {
        if (e.key == "f") {
            fakeClick(mousex, mousey);
        }
    }

    let mousex;
    let mousey;
    function onMouseMove(e: MouseEvent) {
        mousex = e.clientX;
        mousey = e.clientY;
    }
    let canvas;
</script>

<svelte:window on:keydown={onKeyDown} on:mousemove={onMouseMove} />
<DomPortal><div id="fake-cursor"></div></DomPortal>

<style>
    #fake-cursor {
        width: 20px;
        height: 20px;
        background-color: red;
        border-radius: 50%;
        position: absolute;
        top: 0;
        pointer-events: none; /* Evita que el div afecte la interacción del usuario */
    }
</style>
