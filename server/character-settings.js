const getPlayer = require('./serverUtils');

const characterSettingsOn = (socket, io) => {
    socket.on('character-settings', (characterSettings) => {
        console.log(characterSettings);
        socket.broadcast.emit('player-character-settings', socket.id, characterSettings);
    });
}

module.exports = characterSettingsOn;