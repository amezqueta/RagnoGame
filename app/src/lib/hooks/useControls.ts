import { onDestroy } from 'svelte';
import { derived, get, writable } from 'svelte/store';

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
        ' ': false,
        e: false,
        k: false,
        Enter: false,
        Escape: false,
    });

    let wheel = writable(0);

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

    const controlAxis = derived(keys, (keys) => {        
        if(isInputFocused()){
            return {x:0, y:0};
        }
        return {
            x:
                (keys.d || keys.ArrowRight ? 1 : 0) -
                (keys.a || keys.ArrowLeft ? 1 : 0),
            y:
                (keys.w || keys.ArrowUp ? 1 : 0) -
                (keys.s || keys.ArrowDown ? 1 : 0),
        };
    });

    const controlActions = derived(keys, (keys) => {
        return {
            jump: isInputFocused() ? false : !!keys[' '] ,
            emotes: !!keys['e'],
            map: !!keys['k'],
            chat: !!keys['Enter'],
            escChat: !!keys['Escape'],
        };
    });

    const isInputFocused = ():boolean => {
        return document.activeElement !== document.body;
    }

    const controlWheel = derived(wheel, (wheel) => {
        return {
            delta: wheel,
        };
    });

    window.addEventListener('keydown', onKeyDown, { passive: true });
    window.addEventListener('keyup', onKeyUp, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: true });
    onDestroy(() => {
        window.removeEventListener('keydown', onKeyDown);
        window.removeEventListener('keyup', onKeyUp);
        window.removeEventListener("wheel", onWheel);

    });

    return {
        controlAxis,
        controlActions,
        controlWheel,
        isInputFocused
    };
};