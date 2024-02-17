import { onDestroy } from "svelte";
import { derived, get, writable } from "svelte/store";

export const useControls = () => {
    const keys = writable({
        w: false,
        ArrowUp: false,
        a: false,
        ArrowDown: false,
        s: false,
        ArrowLeft: false,
        d: false,
        ArrowRight: false,
        " ": false,
        e: false,
        k: false,
        Enter: false,
        Escape: false,
    });

    let wheel = writable(0);

    const mouseButtons = writable({
        mouse0: false,
        mouse2: false,
    });

    const onKeyDown = (e) => {
        if (!Object.keys(get(keys)).includes(e.key)) return;
        keys.update((keys) => {
            keys[e.key] = true;
            return keys;
        });
    };
    const onKeyUp = (e) => {
        if (!Object.keys(get(keys)).includes(e.key)) return;
        keys.update((keys) => {
            keys[e.key] = false;
            return keys;
        });
    };
    let wheelTimeout: any;
    const onWheel = (e) => {
        wheel.update(() => e.wheelDelta);
        clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => {
            wheel.set(0);
        }, 100);
    };

    const onMouseDown = (e) => {
        mouseButtons.update((mouseButtons) => {
            if (e.button === 0) mouseButtons.mouse0 = true;
            if (e.button === 2) mouseButtons.mouse2 = true;
            return mouseButtons;
        });
    };

    const onMouseUp = (e) => {
        mouseButtons.update((mouseButtons) => {
            if (e.button === 0) mouseButtons.mouse0 = false;
            if (e.button === 2) mouseButtons.mouse2 = false;
            return mouseButtons;
        });
    };

    const controlAxis = derived(keys, (keys) => {
        if (isInputFocused()) {
            return { x: 0, y: 0 };
        }
        return {
            x: (keys.d || keys.ArrowRight ? 1 : 0) - (keys.a || keys.ArrowLeft ? 1 : 0),
            y: (keys.w || keys.ArrowUp ? 1 : 0) - (keys.s || keys.ArrowDown ? 1 : 0),
        };
    });

    const controlActions = derived(keys, (keys) => {
        return {
            jump: isInputFocused() ? false : !!keys[" "],
            emotes: !!keys["e"],
            map: !!keys["k"],
            chat: !!keys["Enter"],
            escChat: !!keys["Escape"],
        };
    });

    const isInputFocused = (): boolean => {
        return document.activeElement !== document.body;
    };

    const controlWheel = derived(wheel, (wheel) => {
        return {
            delta: wheel,
        };
    });

    const controlMouse = derived(mouseButtons, (mouseKeys) => {
        return {
            mouse0: mouseKeys.mouse0,
            mouse2: mouseKeys.mouse2,
            doubleMouse: mouseKeys.doubleMouse,
        };
    });

    window.addEventListener("keydown", onKeyDown, { passive: true });
    window.addEventListener("keyup", onKeyUp, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("mousedown", onMouseDown, { passive: true });
    window.addEventListener("mouseup", onMouseUp, { passive: true });
    onDestroy(() => {
        window.removeEventListener("keydown", onKeyDown);
        window.removeEventListener("keyup", onKeyUp);
        window.removeEventListener("wheel", onWheel);
        window.removeEventListener("mousedown", onMouseDown);
        window.removeEventListener("mouseup", onMouseUp);
    });

    return {
        controlAxis,
        controlActions,
        controlWheel,
        controlMouse,
        isInputFocused,
    };
};
