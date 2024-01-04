const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
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

// Define la ruta para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'my-svelthree-app/public')));

// Ruta para servir el archivo HTML de la aplicación
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'my-svelthree-app/public/index.html'));
});

io.on('connection', (socket) => {
  console.log('Conectado al servidor');

  socket.on('mensaje', (mensaje) => {
    io.emit('mensaje', mensaje); // Reenviar el mensaje a todos los clientes conectados
  });
});

server.listen(3000, () => {
  console.log('Servidor en funcionamiento en el puerto 3000');
});
