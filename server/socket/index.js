const registerBattleSocket = require("./battle.socket");

function registerSockets(io) {
  registerBattleSocket(io);
}

module.exports = registerSockets;
