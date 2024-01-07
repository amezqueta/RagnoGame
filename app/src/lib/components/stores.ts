import type { type RigidBody as RRigidBody } from '@dimforge/rapier3d-compat'
import { writable } from 'svelte/store'
import { Vector3 } from 'three';
export const socketStore = writable(undefined)
export const cameraControls = writable(undefined)
export const playerRigidbodyStore = writable<RRigidBody>(undefined)
export const playerTranslationStore = writable(new Vector3())
export const playerColorStore = writable<string>(undefined)
export const playerDataStore = writable(undefined)

export const serverPlayersStore = writable<any[]>(undefined)