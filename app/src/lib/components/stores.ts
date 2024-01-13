import type { type RigidBody as RRigidBody } from '@dimforge/rapier3d-compat'
import { writable } from 'svelte/store'
import { Vector3 } from 'three';
export const socketStore = writable(undefined)
export const serverTimestampStore = writable<number>(undefined)

export const serverDebugMsgAmountStore = writable<number>(undefined)
export const serverPlayersStore = writable<any[]>(undefined)

export const cameraControls = writable(undefined)
export const cameraControlPressedStore = writable<boolean>(false)

export const playerRigidbodyStore = writable<RRigidBody>(undefined)
export const playerPositionStore = writable<Vector3>(undefined)
export const playerColorStore = writable<string>(undefined)
export const playerDataStore = writable(undefined)
export const privilegesStore = writable<number>(undefined)

export const cursorShowStore = writable<boolean>(true)