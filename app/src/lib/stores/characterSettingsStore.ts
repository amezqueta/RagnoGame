import { writable } from "svelte/store";

export const weaponsList = ["bat", "bat2", "bat3"];
export const headList = ["empty", "bat"];

export const characterSettingsStore = writable<CharacterSettings>({
    weaponId: 0,
    headId: 0,
});
