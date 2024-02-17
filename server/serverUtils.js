const serverPlayers = require('./serverPersistence');

const getPlayer = (socketId) => {
    return serverPlayers.find(x => x.userId === socketId);
};

module.exports = getPlayer;