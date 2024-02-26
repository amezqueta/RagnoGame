import type { type RigidBody as RRigidBody } from "@dimforge/rapier3d-compat";
import { writable } from "svelte/store";
import { Vector3 } from "three";

export type PlayAnimationFunction = (anim: string, fadeInTime?: number, fadeOutTime?: number, endDelay?: number) => void;

export const socketStore = writable(undefined);
export const serverTimestampStore = writable<number>(undefined);

export const serverDebugMsgAmountStore = writable<number>(undefined);
export const serverPlayersStore = writable<any[]>(undefined);

export const isSpectatorStore = writable<boolean>(true);
export const cameraControls = writable(undefined);
export const cameraControlPressedStore = writable<boolean>(false);

export const playerRigidbodyStore = writable<RRigidBody>(undefined);
export const playerPositionStore = writable<Vector3>(undefined);
export const playerVelocityStore = writable<Vector3>(undefined);
export const playerColorStore = writable<string>(undefined);
export const playerDataStore = writable(undefined);
export const privilegesStore = writable<number>(undefined);
export const playerPowerupStore = writable<number>(0);

export const cursorShowStore = writable<boolean>(true);

export const mouseXStore = writable<number>(undefined);
export const mouseYStore = writable<number>(undefined);
export const pointerLockerStore = writable<boolean>(undefined);

export const playerSpawnsStore = writable<position[]>([]);

export const debugRapierStore = writable(false);
