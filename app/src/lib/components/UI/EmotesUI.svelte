<script>
    import DomPortal from "../Utilities/DomPortal.svelte";
</script>

<DomPortal
    ><div id="emote-wrapper">
        <div id="emote-panel">
            <ul class="circle">
                <li>
                    <div class="text">1</div>
                </li>
                <li>
                    <div class="text">2</div>
                </li>
                <li>
                    <div class="text">3</div>
                </li>
            </ul>
        </div>
    </div></DomPortal
>

<style>
    #emote-wrapper {
        position: absolute;
        width: 100%;
        bottom: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        pointer-events: none;
    }

    #emote-panel {
        width: 400px;
        height: 400px;
        background-color: aquamarine;
        border-radius: 50%;
    }
    li {
        overflow: hidden;
        position: absolute;
        top: -20%;
        right: -20%;
        width: 70%;
        height: 70%;
        transform-origin: 0% 100%;
        pointer-events: all;
    }
    li:first-child {
        transform: rotate(0deg);
    }
    li:nth-child(2) {
        transform: rotate(120deg);
    }
    li:nth-child(3) {
        transform: rotate(240deg);
    }
    li:first-child .text {
        background: green;
    }
    li:nth-child(2) .text {
        background: tomato;
    }
    li:nth-child(3) .text {
        background: aqua;
    }
</style>
