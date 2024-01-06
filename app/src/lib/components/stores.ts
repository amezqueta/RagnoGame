import { writable } from 'svelte/store'
export const cameraControls = writable(undefined)
export const playerRigidbodyStore = writable<RapierRigidbody>(undefined)