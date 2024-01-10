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
        origin: "http://localhost:5173",
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
let amountOfMsg = 0;
let showAmountOfMsg = false;

io.on('connection', (socket) => {

    socket.emit('get-browser');
    socket.on('browser-data', (data) => {
        console.log(data.nick);

        const player = {
            userId: socket.id,
            position: [0, 50, 0],
            color: '#' + Math.floor(Math.random() * 16777215).toString(16),
            nick: data.nick || socket.id
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

        socket.on('move', (userId, newPos) => {
            const player = serverPlayers.find(player => player.userId === userId);
            if (player) {
                player.position = newPos;
                io.emit('move', userId, newPos);
            }
            amountOfMsg++;
        })

        socket.on('server-color', (color) => {
            let player = serverPlayers.find(x => x.userId === socket.id);
            player.color = color;
            io.emit('user-color', socket.id, color);
            amountOfMsg++;
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
    })

});

function resetMessageCounter() {
    if (!showAmountOfMsg)
        return;
    console.log(`Amount of messages in the last second: ${amountOfMsg}`);
    amountOfMsg = 0;
}

server.listen(3000, () => {
    console.log('-----------RAGNO SERVER-----------');
    console.log('Server working on port 3000');
    console.log('Type r to restart the server');
    console.log('----------------------------------');
    setInterval(resetMessageCounter, 1000);
});