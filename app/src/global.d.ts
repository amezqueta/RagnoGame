declare global {
    interface Window {
        addCameraOffset?: any;
    }
    type CharacterSettings = {
        weaponId: number;
        headId: number;
    };
}

export {};
