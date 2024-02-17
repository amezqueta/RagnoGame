import { writable } from "svelte/store";

export interface ServerSettings {
    playerSpeed: number;
    jumpForce: number;
}

export const serverSettingsStore = writable<ServerSettings>({
    playerSpeed: 5,
    jumpForce: 10,
});
