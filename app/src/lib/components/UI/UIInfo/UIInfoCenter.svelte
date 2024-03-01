<script lang="ts">
    import { playerPowerupStore, socketStore } from "$lib/stores/stores";

    let time = 0;
    let timeText: string = "";

    function formatTime(time: number) {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    }

    $: timeText = formatTime(time);

    let socket: any;
    $: if ($socketStore) socket = $socketStore;

    $: if (socket) {
        socket.on("server-start", () => {
            time = 0;
        });
    }

    setInterval(() => time++, 1000);
</script>

<div id="top__wrapper">
    <div id="center__wrapper">
        <div class="flag-info">
            <div class="label align-self-end">Round: 0</div>
        </div>
        <div id="flag">
            {$playerPowerupStore}
        </div>
        <div class="flag-info">
            <div class="label">
                {timeText}
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 18">
                    <g fill="none">
                        <path
                            d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"
                        />
                        <path fill="currentColor" d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2m0 4a1 1 0 0 0-1 1v5a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V7a1 1 0 0 0-1-1" />
                    </g>
                </svg>
            </div>
        </div>
    </div>
</div>

<style>
    #top__wrapper {
        transition: all 0.5s ease;
        display: flex;
        max-height: 100px;
        pointer-events: all;
    }
    #center__wrapper {
        z-index: 100;
        display: flex;
        flex-grow: 1;
        max-width: 500px;
        margin: 0 auto;
        position: relative;
        align-items: center;
    }
    #flag {
        background-color: var(--light);
        width: 40px;
        height: 70px;
        clip-path: polygon(0% 0%, 100% 0%, 100% 75%, 50% 100%, 0% 75%);
        margin: 0 auto;
        align-items: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .flag-info {
        display: flex;
        max-height: 35px;
        flex-grow: 1;
        flex-direction: column;
    }
    .label {
        background-color: var(--dark);
        color: var(--light);
        width: 100px;
        height: 100%;
        margin: 5px;
        padding: 5px;
        display: flex;
        justify-content: center;
        gap: 6px;
    }
</style>
