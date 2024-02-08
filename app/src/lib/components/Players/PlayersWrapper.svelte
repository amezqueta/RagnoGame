<script lang="ts">
    import { T } from "@threlte/core";
    import Player from "$lib/components/Players/Player.svelte";
    import PlayerOnline from "$lib/components/Players/PlayerOnline.svelte";
    import { isSpectatorStore, playAnimationStore, playerDataStore, playerPositionStore, serverPlayersStore, socketStore } from "../stores";
    import CameraControlsComponent from "../CameraControls.svelte";
    import { Vector3 } from "three";

    let socket: any;

    let playerRef: any;
    let currentPlayerData: any = null;

    type ScenePlayer = {
        userId: string;
        position: Vector3;
        rotation: number;
        color: string;
        nick: string;
        spectator: boolean;
        playerEmote: number;
        playAnimation: any;
    };

    let scenePlayers: ScenePlayer[] = [];

    let viewingPlayerIndex: number = 0;

    $: if (playerDataStore && $playerDataStore) {
        currentPlayerData = $playerDataStore;
        isSpectatorStore.set($playerDataStore.spectator);
    }

    $: if ($serverPlayersStore && currentPlayerData?.userId) {
        updatePlayersList($serverPlayersStore);
    }

    const updatePlayersList = (serverPlayers: any[]) => {
        scenePlayers = serverPlayers;
    };

    $: if (socketStore) {
        socket = $socketStore;
    }

    const findPlayerById = (userId: string): any => {
        return scenePlayers.find((user) => user.userId === userId);
    };

    const findIndexPlayerById = (userId: string): any => {
        return scenePlayers.findIndex((user) => user.userId === userId);
    };

    $: if (socket) {
        socket.on("player-move", (userId: string, newPos: any) => {
            const index = findIndexPlayerById(userId);
            if (index != -1) {
                scenePlayers[index].position = newPos;
            }
        });

        socket.on("player-rotate", (userId: string, newRot: number) => {
            const user = findPlayerById(userId);
            if (user) user.rotation = newRot;
        });

        socket.on("user-color", (userId: string, newColor: string) => {
            const user = findPlayerById(userId);
            if (user) user.color = newColor;
        });

        socket.on("user-set-nick", (userId: string, newNick: string) => {
            const user = findPlayerById(userId);
            if (user) user.nick = newNick;
        });

        socket.on("player-emote", (userId: string, emoteId: number) => {
            if (userId === currentPlayerData.userId) playerRef?.playEmote(emoteId);
            else {
                const user = findPlayerById(userId);
                if (user) user.playerEmote = emoteId;
            }
        });

        socket.on("playAnimation", (userId: string, actionKey: string, fadeInTime: number, fadeOutTime: number, delay: number) => {
            const user = findPlayerById(userId);
            if (user) {
                user.playAnimation = { actionKey: actionKey, fadeInTime: fadeInTime, fadeOutTime: fadeOutTime, delay: delay };
            }
        });
    }

    const onMouseDown = (e: MouseEvent) => {
        if (!currentPlayerData.spectator) return;
        if (e.button === 0) {
            viewingPlayerIndexChange();
        }
    };

    const viewingPlayerIndexChange = () => {
        if (viewingPlayerIndex >= scenePlayers.length - 1) viewingPlayerIndex = 0;
        else viewingPlayerIndex++;
    };
</script>

<svelte:window on:mousedown={onMouseDown} />

{#if currentPlayerData}
    {#if playerPositionStore && !currentPlayerData.spectator}
        <T.PerspectiveCamera makeDefault fov={15}>
            <CameraControlsComponent position={$playerPositionStore} />
        </T.PerspectiveCamera>
        <Player bind:this={playerRef} {socket} userId={currentPlayerData.userId} color={currentPlayerData.color} nick={currentPlayerData.nick} />
    {:else if scenePlayers.length > viewingPlayerIndex}
        <T.PerspectiveCamera makeDefault fov={15}>
            <CameraControlsComponent position={new Vector3(scenePlayers[viewingPlayerIndex].position.x, scenePlayers[viewingPlayerIndex].position.y, scenePlayers[viewingPlayerIndex].position.z)} />
        </T.PerspectiveCamera>
    {/if}
{/if}

{#if scenePlayers}
    {#each scenePlayers as p}
        {#if p.userId !== currentPlayerData.userId && p.spectator === false}
            <PlayerOnline mainPlayerRef={playerRef} position={p.position} rotation={p.rotation} playerId={p.userId} color={p.color} nick={p.nick} playerEmote={p.playerEmote} animation={p.playAnimation} />
        {/if}
    {/each}
{/if}
