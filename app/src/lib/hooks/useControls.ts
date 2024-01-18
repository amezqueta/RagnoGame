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
    const controlAxis = derived(keys, (keys) => {
        return {
            x:
                0 +
                (keys.d || keys.ArrowRight ? 1 : 0) -
                (keys.a || keys.ArrowLeft ? 1 : 0),
            y:
                0 +
                (keys.w || keys.ArrowUp ? 1 : 0) -
                (keys.s || keys.ArrowDown ? 1 : 0),
        };
    });

    const controlActions = derived(keys, (keys) => {
        return {
            jump: !!keys[' '],
            emotes: !!keys['e'],
        };
    });

    window.addEventListener('keydown', onKeyDown, { passive: true });
    window.addEventListener('keyup', onKeyUp, { passive: true });
    onDestroy(() => {
        window.removeEventListener('keydown', onKeyDown);
        window.removeEventListener('keyup', onKeyUp);
    });

    return {
        controlAxis,
        controlActions,
    };
};