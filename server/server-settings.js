
let gameStarted = false;

const serverSettingsOn = (socket, io) => {
    socket.on('server-settings', (serverSettings) => {
        console.log(serverSettings);
        socket.broadcast.emit('server-settings',serverSettings);
    });

    socket.on('server-start', () => {
        gameStarted = true;
        io.emit('server-start');
    });
}

module.exports = {
    serverSettingsOn,
    gameStarted
};