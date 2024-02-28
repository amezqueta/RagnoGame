<style>
    :global(:root) {
        --dark: rgb(12, 10, 15);
        --light: rgb(239, 240, 223);
        --primary: rgb(201, 178, 52);
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
    :global(.windowShell) {
        z-index: 500;
        width: 100%;
        max-width: 500px;
        max-height: 500px;
        min-height: 500px;
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
    :global(.flex) {
        display: flex;
    }
    :global(.flexgrow) {
        flex-grow: 1;
    }
</style>
