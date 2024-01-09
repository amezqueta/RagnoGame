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
        origin: "http://26.132.182.96:5173",
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
    }else {
        io.emit('msg', "SERVER: " + input + "");
    }
});

const serverPlayers = [];

io.on('connection', (socket) => {

    const player = {
        userId: socket.id,
        position: [0, 50, 0],
        color: '#' + Math.floor(Math.random() * 16777215).toString(16)
    };

    serverPlayers.push(player);

    const userAmount = serverPlayers.length;
    console.log('User (' + socket.id + ') connected to the server (' + userAmount + ')');
    io.emit('msg', "SERVER: User connected: (" + userAmount + ")");

    socket.emit('connected', player, serverPlayers);
    io.sockets.sockets.forEach((sock) => {
        if (sock.id != socket.id) {
            sock.emit('players-list', serverPlayers);
        }
    });

    socket.on('msg', (msg) => {
        io.emit('msg', msg);
    });

    socket.on('move', (userId, newPos) => {
        const player = serverPlayers.find(player => player.userId === userId);
        if (player) {
            player.position = newPos;
            io.emit('move', userId, newPos);
        }
    })

    socket.on('server-color', (color) => {
        let player = serverPlayers.find(x => x.userId === socket.id);
        player.color = color;
        io.emit('user-color', socket.id, color);
    });

    socket.on('server-set-nick', (nick) => {
        let player = serverPlayers.find(x => x.userId === socket.id);
        player.nick = nick;
        io.emit('user-set-nick', socket.id, nick);
        io.emit('players-list', serverPlayers);
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
});

server.listen(3000, () => {
    console.log('-----------RAGNO SERVER-----------');
    console.log('Server working on port 3000');
    console.log('Type r to restart the server');
    console.log('----------------------------------');
});