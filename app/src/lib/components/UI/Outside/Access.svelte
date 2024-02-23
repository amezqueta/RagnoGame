<script lang="ts">
    import UiWindowShell from "../comp/UIWindowShell.svelte";
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

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
</script>

<div id="container">
    <img id="logo" src="img/logo.svg" />

    <UiWindowShell>
        <span slot="title">Access</span>
        <span slot="content">
            <form on:submit={handleSubmit}>
                <label for="nickname">Nickname:</label>
                <input type="text" id="nick" name="nick" class:error on:blur={onBlur} bind:value={nick} />

                <button type="submit">Submit</button>
            </form>
        </span>
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
</style>
