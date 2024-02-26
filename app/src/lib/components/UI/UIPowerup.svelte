<script lang="ts">
    import { useControls } from "$lib/hooks/useControls";
    import { getPowerup } from "$lib/components/Shared/powerupData";
    export let socket: any;
    const { controlActions } = useControls();

    const generateUniqueRandomNumbers = (max: number, count: number): number[] => {
        if (max < count) {
            throw new Error("The maximum range must be greater than or equal to the number of elements to generate.");
        }

        const numbers: number[] = [];
        while (numbers.length < count) {
            const randomNumber = Math.floor(Math.random() * max) + 1;
            if (!numbers.includes(randomNumber)) {
                numbers.push(randomNumber);
            }
        }

        return numbers;
    };
    let randomCards: number[] = generateUniqueRandomNumbers(10, 3);

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

    $: if (visible) {
        randomCards = generateUniqueRandomNumbers(10, 3);
    }
    let hovered = false;
    let clicked = false;
</script>

<div id="cinemaStripes__wrapper">
    <div id="cinemaBG" class:visible></div>
    <div id="cards__wrapped" class:visible>
        {#each randomCards as cardId}
            <div role="dialog" class:hovered class:clicked style="background-image: url('img/card/{cardId}.png');" on:click={(x) => clickCard(cardId)} class="card pointer">
                {getPowerup(cardId).name}
            </div>
        {/each}
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
        border: 5px solid #000;
        background-color: #000;
        border-radius: 15px;
        display: flex;
        transition: all 0.1s ease;
        transform: scale(1, 1);
        color: white;
        font-weight: bold;
        -webkit-text-stroke: 5px #020003;
        paint-order: stroke fill;
        background-repeat: no-repeat;
        background-size: cover;
        padding: 5px;
        pointer-events: none;
    }
    .visible .card {
        pointer-events: all;
    }
    .card:hover,
    .card.hovered {
        border: 5px solid #2b2b2b;
        transform: scale(1.1, 1.1);
    }
    .card.clicked {
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
        animation: bgAnimation 1s linear infinite;
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
