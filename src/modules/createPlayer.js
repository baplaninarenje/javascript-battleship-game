const { validatePlayerType } = require('./validators');
const createGameboard = require('./createGameboard.js');

const createPlayer = (playerType) => {
  validatePlayerType(playerType);
  const gameboard = createGameboard();
  return { playerType, gameboard };
};

module.exports = createPlayer;
