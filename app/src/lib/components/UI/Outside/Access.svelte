<script lang="ts">
    import UiWindowShell from "../comp/UIWindowShell.svelte";
    import { createEventDispatcher, onMount } from "svelte";
    const dispatch = createEventDispatcher();

    const randomNames = ["Mamamio", "Humongous", "Banana", "Pingo", "Yen", "Ocellotis", "Josemari", "Wobbletop", "Kazoo", "Malarkey", "Bumblebee", "Squeegee", "Whippersnap", "Otomotopia", "Juanjoya"];

    let nick = "";

    const handleSubmit = (e: Event) => {
        if (nick === "") {
            e.preventDefault();
            return;
        }
        dispatch("updateData", nick);
    };
    let error = false;

    const onBlur = (e: Event) => {
        error = nick === "";
    };

    onMount(() => {
        if (nick === "") {
            getRandomName();
        }
    });

    const getRandomName = () => {
        let randomNumber = Math.floor(Math.random() * randomNames.length);
        nick = randomNames[randomNumber];
    };
</script>

<div id="container">
    <img id="logo" src="img/logo.svg" alt="logo" />

    <form on:submit={handleSubmit}>
        <UiWindowShell>
            <span slot="title">Access</span>
            <span slot="content">
                <div class="form-content">
                    <label class="d-flex flex-column flex-grow-1" for="nickname"
                        >Nickname:
                        <input type="text" id="nick" name="nick" class="flex-grow-1" class:error on:blur={onBlur} bind:value={nick} /></label
                    >
                    <button type="button" on:click={getRandomName}>Random nickname</button>
                </div>
            </span>
            <span slot="bottom" class="d-flex justify-content-center">
                <button class="submit" type="submit"
                    ><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
                        <path fill="currentColor" d="m9.55 18l-5.7-5.7l1.425-1.425L9.55 15.15l9.175-9.175L20.15 7.4z" />
                    </svg></button
                >
            </span>
        </UiWindowShell>
    </form>
</div>

<style>
    #container {
        background: url("img/outside/login/bg.webp") no-repeat center top;
        background-size: cover;
        display: flex;
        flex-grow: 1;
        min-height: 100vh;
        flex-direction: column;
    }
    #logo {
        width: 300px;
        margin: 20px auto;
    }
    .error {
        border-color: red;
    }
    .form-content {
        display: flex;
        justify-content: space-between;
        margin: 10px;
        align-items: last baseline;
    }
</style>
