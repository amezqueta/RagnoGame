<style>
    :global(:root) {
        --dark: rgb(12, 10, 15);
        --light: rgb(239, 240, 223);
        --primary: rgb(90, 80, 21);
        --primaryl: rgb(124, 112, 40);
    }
    :global(body) {
        margin: 0;
        background: rgb(13, 19, 32);
    }
    :global(hr) {
        border: 0;
        border-bottom: 2px solid var(--primary);
        width: 100%;
    }
    :global(button) {
        transition-duration: 0.2s;
        transition-property: all;
        cursor: pointer;
        height: 30px;
        padding-left: 10px;
        padding-right: 10px;
        background-color: white;
        border-radius: 100px;
        cursor: pointer;
        box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 8px;
        border: 0;
    }
    :global(input) {
        padding: 10px 5px;
        margin: 5px;
        border-radius: 5px;
        background-color: rgba(255, 255, 255, 0.02);
        border: 2px solid rgba(255, 255, 255, 0.1);
        color: var(--light);
    }
    :global(input:focus) {
        border: 2px solid rgba(255, 255, 255, 0.2);
        background-color: rgba(255, 255, 255, 0.05);
        outline: none;
    }

    :global(.windowShell) {
        z-index: 500;
        width: 100%;
        max-width: 500px;
        max-height: 500px;
        min-height: calc(100vh / 2);
        background-color: var(--dark);
        display: flex;
        align-self: center;
        flex-grow: 1;
        flex-direction: column;
        padding: 15px;
        border-radius: 15px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: var(--light);
        margin: 20px auto;
        position: relative;
    }

    :global(.taskBar) {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    :global(.closeBtn) {
        width: 40px;
        height: 40px;
        align-items: center;
        justify-content: center;
        border-radius: 100px;
        margin: 5px;
        background-color: rgba(255, 255, 255, 0.05);
    }
    :global(.closeBtn:hover) {
        background-color: rgba(255, 255, 255, 0.15);
    }
    :global(.windowShell h1) {
        font-size: 1.5em;
    }
    :global(.windowShell h2) {
        font-size: 1.1em;
    }
    :global(.submit) {
        position: absolute;
        bottom: -80px;
        border-radius: 50%;
        height: 70px;
        width: 70px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border: 2px solid var(--primary);
        align-self: center;
        color: var(--primary);
    }
    :global(.submit:hover) {
        border: 2px solid var(--primary);
        box-shadow: 0px 0px 5px rgba(255, 255, 255, 0.5);
        color: var(--primaryl);
    }

    :global(.d-flex) {
        display: flex;
    }
    :global(.flex-grow-1) {
        flex-grow: 1;
    }
    :global(.justify-content-center) {
        justify-content: center;
    }
    :global(.flex-column) {
        flex-direction: column;
    }
    :global(.align-self-end) {
        align-self: flex-end;
    }
</style>
