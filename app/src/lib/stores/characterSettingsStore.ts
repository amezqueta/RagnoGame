import { writable } from "svelte/store";

export const characterSettingsStore = writable<CharacterSettings>({
    weaponId: 0,
});
