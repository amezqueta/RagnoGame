const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const readline = require('readline');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        credentials: true
    }
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (input) => {
    if (input.toLowerCase() === 'r') {
        console.log('Restarting server...');
        io.close(() => {
            process.exit(0);
        });
    } else if (input.toLowerCase() === 'a') {
        showAmountOfMsg = !showAmountOfMsg;
    } else {
        io.emit('msg', "SERVER: " + input + "");
    }
});

let serverPlayers = [];
let msgAmount = 0;
let showAmountOfMsg = false;

io.on('connection', (socket) => {

    socket.on("initiate-ping", () => {
        socket.emit("initiate-pong", performance.now());
    });

    socket.on('onboarding', (data) => {
        let nick = data.nick || socket.id;
        let privileges = nick.toLowerCase() === "amezcuetara" ? 10 : 0;
        const player = {
            userId: socket.id,
            position: [0, 50, 0],
            color: '#' + Math.floor(Math.random() * 16777215).toString(16),
            nick: nick,
            privileges: privileges
        };

        serverPlayers.push(player);

        const userAmount = serverPlayers.length;
        console.log('User (' + socket.id + ') connected to the server (' + userAmount + ')');
        io.emit('msg', "SERVER: User connected: (" + userAmount + ")");

        socket.emit('connected', player, serverPlayers);
        socket.broadcast.emit('players-list', serverPlayers);

        socket.on('msg', (msg) => {
            io.emit('msg', msg);
        });

        socket.on('player-move', (newPos) => {
            const player = getPlayer(socket.id);
            if (player) {
                player.position = newPos;
                socket.broadcast.emit('player-move', socket.id, newPos);
            }
            msgAmount++;
        });

        socket.on('player-rotate', (newRot) => {
            const player = getPlayer(socket.id);
            if (player) {
                player.rotation = newRot;
                io.emit('player-rotate', socket.id, newRot);
            }
            msgAmount++;
        });

        socket.on('player-pushed', (userId, direction) => {
            io.sockets.sockets.forEach((sock) => {
                if (sock.id == userId) {
                    sock.emit('player-pushed', direction);
                }
            });
        });

        socket.on('player-emote', (emoteId) => {
            io.emit('player-emote', socket.id, emoteId);
        });

        socket.on('server-color', (color) => {
            getPlayer(socket.id).color = color;
            socket.broadcast.emit('user-color', socket.id, color);
            msgAmount++;
        });

        socket.on('disconnect', (reason) => {
            const index = serverPlayers.findIndex(player => player.userId === socket.id);
            if (index !== -1) {
                serverPlayers.splice(index, 1);
            }
            const userAmount = serverPlayers.length;
            console.log('User (' + socket.id + ') disconnected from the server (' + userAmount + "): " + reason);
            io.emit('players-list', serverPlayers);
        });

        socket.on('ping', () => {
            socket.emit('pong');
        });
    });

});

const getPlayer = (socketId) => {
    return serverPlayers.find(x => x.userId === socketId);
};

const resetMessageCounter = () => {
    io.sockets.sockets.forEach(socket => {
        let player = getPlayer(socket.id);
        if (player == undefined)
            return;
        if (player.privileges == 10)
            socket.emit('server-debug-msgAmount', msgAmount);
    });
    if (showAmountOfMsg)
        console.log(`Amount of messages in the last second: ${msgAmount}`);
    msgAmount = 0;
};

server.listen(3000, () => {
    console.log('-----------RAGNO SERVER-----------');
    console.log('Server working on port 3000');
    console.log('Type r to restart the server');
    console.log('Type a to show messages/second');
    console.log('Type anything else to send a console log to the clients');
    console.log('----------------------------------');
    setInterval(resetMessageCounter, 1000);
});