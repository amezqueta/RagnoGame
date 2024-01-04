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

let users = {};

io.on('connection', (socket) => {
    users[socket.id] = true;
    const userAmount = Object.keys(users).length;

    console.log('User (' + socket.id + ') connected to the server (' + userAmount + ')');

    io.emit('mensaje', "User connected: (" + userAmount + ")");

    io.emit('user-connected', socket.id);
    socket.emit('connected', socket.id);

    socket.on('mensaje', (mensaje) => {
        io.emit('mensaje', mensaje); // Reenviar el mensaje a todos los clientes conectados
    });

    socket.on('disconnect', (reason) => {
        //io.disconnectSockets();
        delete users[socket.id];
        console.log('User (' + socket.id + ') disconnected from the server (' + userAmount + "): " + reason);
        io.emit('mensaje', "User disconnected: (" + userAmount + ")");
    });
});

server.listen(3000, () => {
    console.log('Server working on port 3000');
});
