const createShip = require('./createShip');
const {
  validateShipName,
  validateCoords,
  validateReceiveAttackCoords,
  validateMainAxis,
  validateShipDimensionsOnTheGameboard,
} = require('./validators.js');

function createGameboard() {
  const destroyer = createShip(2);
  const submarine = createShip(3);
  const cruiser = createShip(3);
  const battleship = createShip(4);
  const carrier = createShip(5);

  const gameboard = {
    destroyer: { ...destroyer, x: [], y: [], mainAxis: 'x' },
    submarine: { ...submarine, x: [], y: [], mainAxis: 'x' },
    cruiser: { ...cruiser, x: [], y: [], mainAxis: 'x' },
    battleship: { ...battleship, x: [], y: [], mainAxis: 'x' },
    carrier: { ...carrier, x: [], y: [], mainAxis: 'x' },
  };

  const placeShip = (shipName, x, y, mainAxis = 'x') => {
    validateShipName(shipName);
    validateCoords(x, y);
    validateMainAxis(mainAxis);
    validateShipDimensionsOnTheGameboard(gameboard, shipName, x, y, mainAxis);

    const checkOverlap = (gameboard, x, y) => {
      return Object.values(gameboard).some((ship) => {
        return (
          ship.x.some((coord) => x.includes(coord)) &&
          ship.y.some((coord) => y.includes(coord))
        );
      });
    };

    const gameboardWithoutCurrentShip = (({ [shipName]: _, ...rest }) => rest)(
      gameboard
    );
    const hasOverlap = checkOverlap(gameboardWithoutCurrentShip, x, y);
    if (hasOverlap) {
      return false;
    } else {
      const currentShip = gameboard[shipName];
      currentShip.x = x;
      currentShip.y = y;
      currentShip.mainAxis = mainAxis;
      return true;
    }
  };

  const receiveAttack = (x, y) => {
    validateReceiveAttackCoords(x, y);

    let hit = false;
    for (const shipKey in gameboard) {
      const ship = gameboard[shipKey];
      if (ship.x.includes(x) && ship.y.includes(y)) {
        ship.hit();
        hit = true;
      }
    }
    return { x, y, hit };
  };

  const allShipsAreSunk = () => {
    if (
      destroyer.isSunk() &&
      submarine.isSunk() &&
      cruiser.isSunk() &&
      battleship.isSunk() &&
      carrier.isSunk()
    ) {
      return true;
    } else return false;
  };

  return { gameboard, placeShip, receiveAttack, allShipsAreSunk };
}

module.exports = createGameboard;
