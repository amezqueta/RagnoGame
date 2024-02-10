<script lang="ts">
    import { useControls } from "$lib/hooks/useControls";
    export let socket: any;
    const { controlActions } = useControls();
    let visible = true;

    $: if ($controlActions.map) {
        visible = !visible;
    }

    const clickCard = (i: number) => {
        if (visible) {
            socket.emit("powerup", i);
            visible = false;
        }
    };
</script>

<div id="cinemaStripes__wrapper">
    <div id="cinemaBG" class:visible></div>
    <div id="cards__wrapped" class:visible>
        <button on:click={(x) => clickCard(1)} class="card" />
        <button on:click={(x) => clickCard(2)} class="card" />
        <button on:click={(x) => clickCard(3)} class="card" />
    </div>
    <div id="cinemaStripe" class:visible></div>
    <div id="cinemaStripe" class="bottom" class:visible></div>
</div>

<style>
    #cards__wrapped {
        position: absolute;
        margin: 0 auto;
        left: 0;
        right: 0;
        width: 50%;
        opacity: 0;
        transition: all 1s ease;
        display: flex;
        gap: 25px;
        justify-content: space-around;
        align-self: center;
    }
    #cards__wrapped.visible {
        opacity: 1;
    }
    .card {
        pointer-events: all;
        min-width: 250px;
        width: 250px;
        height: 400px;
        background-color: aliceblue;
        border: 5px solid #000;
        border-radius: 15px;
        display: flex;
        transition: transform 0.1s ease;
        transform: scale(1, 1);
    }
    .card:hover {
        border: 5px solid #2b2b2b;
        transform: scale(1.1, 1.1);
    }
    #cinemaStripes__wrapper {
        pointer-events: none;
        position: absolute;
        width: 100%;
        top: 0;
        bottom: 0;
        z-index: 100;
        display: flex;
    }
    #cinemaStripe {
        animation: all 1s;
        position: absolute;
        height: 0px;
        width: 100%;
        background-color: rgb(143, 119, 155);
        transition: height 1s ease;
    }

    #cinemaBG {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
        background: rgb(214, 191, 219);
        background-image: radial-gradient(rgb(237, 227, 240) 6px, transparent 0);
        background-size: 40px 40px;
        background-position: -19px -19px;
        transition: opacity 1s ease;
        opacity: 0;
        animation: bgAnimation 1s linear infinite; /* Animación en loop */
    }
    @keyframes bgAnimation {
        0% {
            background-position: -19px -19px;
        }
        100% {
            background-position: 21px 21px; /* Desplazamiento diagonal */
        }
    }
    .bottom {
        bottom: 0;
    }
    #cinemaBG.visible {
        opacity: 1 !important;
    }
    #cinemaStripe.visible {
        height: 10%;
    }
</style>
