<script lang="ts">
    import { T } from "@threlte/core";
    import Player from "$lib/components/Players/Player.svelte";
    import OnlinePlayer from "$lib/components/Players/OnlinePlayer.svelte";
    import { isSpectatorStore, playerDataStore, playerPositionStore, serverPlayersStore, socketStore } from "../stores";
    import CameraControlsComponent from "../CameraControls.svelte";
    import { Vector3 } from "three";

    let playerRef: any;
    let currentPlayerData: any = null;
    let scenePlayers: any[] = [];
    let viewingPlayerIndex: number = 0;

    let socket: any;

    $: if (playerDataStore && $playerDataStore) {
        currentPlayerData = $playerDataStore;
        isSpectatorStore.set($playerDataStore.spectator);
    }

    $: if ($serverPlayersStore && currentPlayerData?.userId) {
        UpdatePlayers($serverPlayersStore);
        CreateFirstPlayers($serverPlayersStore);
    }

    function UpdatePlayers(serverPlayers: any[]) {
        //If the serverplayers and sceneplayers are the same it doesn't do anything
        if (serverPlayers.length == scenePlayers.length + 1) return;
        if (scenePlayers.length == 0) return;

        if (serverPlayers.length == scenePlayers.length) viewingPlayerIndexChange();

        //Add new Player
        serverPlayers
            .filter((x) => x.userId !== currentPlayerData.userId)
            .forEach((playerData) => {
                const foundPlayer = scenePlayers.find((p) => p.userId === playerData.userId);
                if (!foundPlayer) {
                    let playerInstance = new OnlinePlayer({
                        target: document.body,
                        props: {
                            position: playerData.position,
                            color: playerData.color,
                            userId: playerData.userId,
                            nick: playerData.nick,
                        },
                    });
                    scenePlayers = [
                        ...scenePlayers,
                        {
                            userId: playerData.userId,
                            position: [playerData.position.x, playerData.position.y, playerData.position.z],
                            color: playerData.color,
                            nick: playerData.nick,
                            playerInstance: playerInstance,
                        },
                    ];
                    return;
                }
            });

        //Remove Player
        scenePlayers.forEach((playerData, index) => {
            const foundPlayer = serverPlayers.find((p) => p.userId === playerData.userId);
            if (!foundPlayer) {
                playerData.playerInstance.$destroy();
                scenePlayers.splice(index, 1);
            }
        });
    }

    function CreateFirstPlayers(serverPlayers: any[]) {
        if (scenePlayers.length != 0) return;
        //Creates an array to save the instances and its data
        serverPlayers.forEach((player) => {
            if (player.userId != currentPlayerData.userId) {
                scenePlayers = [
                    ...scenePlayers,
                    {
                        userId: player.userId,
                        position: [player.position.x, player.position.y, player.position.z],
                        color: player.color,
                        nick: player.nick,
                        playerInstance: null,
                    },
                ];
            }
        });

        //Creates an instance of each player
        scenePlayers.forEach((player, index) => {
            let onlinePlayer = new OnlinePlayer({
                target: document.body,
                props: {
                    position: player.position,
                    color: player.color,
                    userId: player.userId,
                    nick: player.nick,
                },
            });
            player.playerInstance = onlinePlayer;
        });
    }

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
                scenePlayers[index]?.playerInstance?.SetPosition(newPos);
                scenePlayers[index].position = newPos;
            }
        });

        socket.on("player-rotate", (userId: string, newRot: number) => {
            const user = findPlayerById(userId);
            user?.playerInstance?.SetRotation(newRot);
        });

        socket.on("user-color", (userId: string, newColor: string) => {
            const user = findPlayerById(userId);
            user?.playerInstance?.SetColor(newColor);
        });

        socket.on("user-set-nick", (userId: string, newNick: string) => {
            const user = findPlayerById(userId);
            user?.playerInstance?.SetNick(newNick);
        });

        socket.on("player-emote", (userId: string, emoteId: number) => {
            if (userId === currentPlayerData.userId) playerRef?.playEmote(emoteId);
            else {
                const user = findPlayerById(userId);
                user?.playerInstance?.playEmote(emoteId);
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
    //@todo handle the created players with svelte/threlte philosophy
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
