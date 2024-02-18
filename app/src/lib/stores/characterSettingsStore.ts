import { writable } from "svelte/store";

export const weaponsList = ["bat", "bat2", "bat3"];

export const characterSettingsStore = writable<CharacterSettings>({
    weaponId: 0,
});
