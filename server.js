const express = require('express');
const http = require('http');
const {Server} = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }
});

const serverPlayers = [];

io.on('connection', (socket) => {

    const player = {
        userId: socket.id,
        position: [0, 0, 0],
        color: '#' + Math.floor(Math.random() * 16777215).toString(16)
    };

    serverPlayers.push(player);

    const userAmount = serverPlayers.length;
    console.log('User (' + socket.id + ') connected to the server (' + userAmount + ')');
    io.emit('msg', "User connected: (" + userAmount + ")");

    socket.emit('connected', player, serverPlayers);
    io.emit('user-connected', socket.id);
    io.emit('users-list', serverPlayers);

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

    socket.on('disconnect', (reason) => {
        const index = serverPlayers.findIndex(player => player.userId === socket.id);
        if (index !== -1) {
            serverPlayers.splice(index, 1);
        }
        const userAmount = serverPlayers.length;
        console.log('User (' + socket.id + ') disconnected from the server (' + userAmount + "): " + reason);
        io.emit('msg', "User disconnected: (" + userAmount + ")");
        io.emit('user-disconnected', socket.id);
        io.emit('users-list', serverPlayers);
    });
});

server.listen(3000, () => {
    console.log('Server working on port 3000');
});
