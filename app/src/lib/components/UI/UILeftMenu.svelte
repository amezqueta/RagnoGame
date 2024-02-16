<script lang="ts">
    import { writable } from "svelte/store";
    import UiPanels from "./UIPanels.svelte";
    let panelOpen = writable(0);

    let handleClickButton = (index: number) => {
        panelOpen.set($panelOpen === index ? 0 : index);
    };

    let hovered = false;
    let clicked = false;
</script>

<div id="rightMenu__wrapper">
    <nav>
        <button class:current={$panelOpen === 1} on:click={(_) => handleClickButton(1)}
            ><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"
                ><path
                    fill="currentColor"
                    d="M12 4q-.825 0-1.412-.587T10 2q0-.825.588-1.412T12 0q.825 0 1.413.588T14 2q0 .825-.587 1.413T12 4M9 19V7q-1.5-.125-3.05-.375T3 6l.5-2q1.95.525 4.15.763T12 5q2.15 0 4.35-.238T20.5 4l.5 2q-1.4.375-2.95.625T15 7v12h-2v-6h-2v6zm-1 5q-.425 0-.712-.288T7 23q0-.425.288-.712T8 22q.425 0 .713.288T9 23q0 .425-.288.713T8 24m4 0q-.425 0-.712-.288T11 23q0-.425.288-.712T12 22q.425 0 .713.288T13 23q0 .425-.288.713T12 24m4 0q-.425 0-.712-.288T15 23q0-.425.288-.712T16 22q.425 0 .713.288T17 23q0 .425-.288.713T16 24"
                /></svg
            ></button
        >
        <button class:current={$panelOpen === 2} class:hovered class:clicked on:click={(_) => handleClickButton(2)}
            ><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512"
                ><path
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="32"
                    d="M262.29 192.31a64 64 0 1 0 57.4 57.4a64.13 64.13 0 0 0-57.4-57.4M416.39 256a154.34 154.34 0 0 1-1.53 20.79l45.21 35.46a10.81 10.81 0 0 1 2.45 13.75l-42.77 74a10.81 10.81 0 0 1-13.14 4.59l-44.9-18.08a16.11 16.11 0 0 0-15.17 1.75A164.48 164.48 0 0 1 325 400.8a15.94 15.94 0 0 0-8.82 12.14l-6.73 47.89a11.08 11.08 0 0 1-10.68 9.17h-85.54a11.11 11.11 0 0 1-10.69-8.87l-6.72-47.82a16.07 16.07 0 0 0-9-12.22a155.3 155.3 0 0 1-21.46-12.57a16 16 0 0 0-15.11-1.71l-44.89 18.07a10.81 10.81 0 0 1-13.14-4.58l-42.77-74a10.8 10.8 0 0 1 2.45-13.75l38.21-30a16.05 16.05 0 0 0 6-14.08c-.36-4.17-.58-8.33-.58-12.5s.21-8.27.58-12.35a16 16 0 0 0-6.07-13.94l-38.19-30A10.81 10.81 0 0 1 49.48 186l42.77-74a10.81 10.81 0 0 1 13.14-4.59l44.9 18.08a16.11 16.11 0 0 0 15.17-1.75A164.48 164.48 0 0 1 187 111.2a15.94 15.94 0 0 0 8.82-12.14l6.73-47.89A11.08 11.08 0 0 1 213.23 42h85.54a11.11 11.11 0 0 1 10.69 8.87l6.72 47.82a16.07 16.07 0 0 0 9 12.22a155.3 155.3 0 0 1 21.46 12.57a16 16 0 0 0 15.11 1.71l44.89-18.07a10.81 10.81 0 0 1 13.14 4.58l42.77 74a10.8 10.8 0 0 1-2.45 13.75l-38.21 30a16.05 16.05 0 0 0-6.05 14.08c.33 4.14.55 8.3.55 12.47"
                /></svg
            ></button
        >
    </nav>
</div>

<UiPanels {panelOpen} />

<style>
    #rightMenu__wrapper {
        left: 0;
        transition: all 1s ease;
        display: flex;
        z-index: 99999;
        pointer-events: all;
        height: 100%;
    }
    nav {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        border-right: 1px solid rgba(0, 0, 0, 0.5);
        flex: 1 1 33.33%;
        background-color: var(--dark);
    }
    button {
        display: flex;
        flex-grow: 1;
        max-height: 100px;
        justify-content: center;
        flex-direction: column;
        padding: 10px;
        background-color: rgba(255, 255, 255, 0.1);
        color: var(--light);
        border-left: 4px solid transparent;
    }
    button:hover,
    button.hovered {
        background-color: rgba(255, 255, 255, 0.2);
    }
    button:active,
    button.clicked {
        background-color: rgba(255, 255, 255, 0);
    }
    button.current {
        border-left: 4px solid var(--primary);
    }
    svg {
        width: 25px;
        height: 35px;
        margin: 15px;
    }
</style>
