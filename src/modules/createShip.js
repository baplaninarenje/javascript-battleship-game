const { validateShipLength, validateHitCount } = require('./validators.js');

function createShip(shipLength) {
  validateShipLength(shipLength);
  let hits = 0;
  const hitCount = () => hits;
  const hit = () => {
    hits = hits + 1;
    return validateHitCount(hits, shipLength);
  };
  const isSunk = () => (hits === shipLength ? true : false);
  return { shipLength, hitCount, hit, isSunk };
}

module.exports = createShip;
