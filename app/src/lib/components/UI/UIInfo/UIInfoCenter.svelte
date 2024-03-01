<script>
    import { playerPowerupStore, serverTimestampStore } from "$lib/stores/stores";
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
            <div class="label">Time: {performance.now()}</div>
        </div>
    </div>
</div>

<style>
    #top__wrapper {
        transition: all 0.5s ease;
        display: flex;
        z-index: 99999;
        max-height: 100px;
        pointer-events: all;
    }
    #center__wrapper {
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
    }
</style>
