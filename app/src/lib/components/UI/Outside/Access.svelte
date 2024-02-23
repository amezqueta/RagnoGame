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
            let randomNumber = Math.floor(Math.random() * randomNames.length); // Obtenemos un índice aleatorio
            nick = randomNames[randomNumber];
        }
    });
</script>

<div id="container">
    <img id="logo" src="img/logo.svg" />

    <UiWindowShell>
        <span slot="title">Access</span>
        <span slot="content">
            <form on:submit={handleSubmit}>
                <label for="nickname">Nickname:</label>
                <div class="flex flexgrow">
                    <input type="text" id="nick" name="nick" class:error on:blur={onBlur} bind:value={nick} />
                    <button type="button">Random nickname</button>
                </div>
                <button type="submit">Submit</button>
            </form></span
        >
    </UiWindowShell>
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
    form {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
    }
</style>
