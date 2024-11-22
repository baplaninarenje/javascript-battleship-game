function validateShipName(shipName) {
  if (
    ['destroyer', 'submarine', 'cruiser', 'battleship', 'carrier'].includes(
      shipName
    )
  )
    return true;
  else throw new Error('Out of range: Ship name is not valid.');
}

function validateCoords(x, y) {
  if (x.some((el) => el < 1 || el > 10) || y.some((el) => el < 1 || el > 10))
    throw new Error('Out of range: X and Y must be between 1 and 10.');
  else return true;
}

function validateReceiveAttackCoords(x, y) {
  if (typeof x !== 'number' || typeof y !== 'number') {
    throw new Error(
      'Wrong type: Input must be of type number but provided' +
        ` input was of type [${typeof x}] and [${typeof y}].`
    );
  } else if (x < 1 || x > 10 || y < 1 || y > 10)
    throw new Error(
      'Out of range: Receive attack X and Y must be between 1 and 10.'
    );
  else return true;
}

function validateMainAxis(mainAxis) {
  if (mainAxis !== 'x' && mainAxis !== 'y')
    throw new Error('Out of range: Main axis must be of value x or y.');
  else return true;
}

function validateShipDimensionsOnTheGameboard(
  gameboard,
  shipName,
  x,
  y,
  mainAxis
) {
  const { shipLength } = gameboard[shipName];
  if (shipLength !== x.length && shipLength !== y.length)
    throw new Error(
      'Out of range: Ship dimensions on the gameboard are not equal as its' +
        ' length.'
    );
  else if (x.length > 1 && y.length > 1)
    throw new Error(
      'Out of range: Ship dimensions on the gameboard are not equal as its' +
        ' length.'
    );
  else if (mainAxis === 'x' && x.length < 2)
    throw new Error(
      `Out of range: Ship dimensions do not corespond to ship` +
        ` main axis [${mainAxis}] orientation`
    );
  else if (mainAxis === 'y' && y.length < 2)
    throw new Error(
      `Out of range: Ship dimensions do not corespond to ship` +
        ` main axis [${mainAxis}] orientation`
    );
  else return true;
}

function validateShipLength(shipLength) {
  if (typeof shipLength !== 'number') {
    throw new Error(
      'Wrong type: Input must be of type number but provided' +
        `input was of type [${typeof param}].`
    );
  } else if (shipLength < 2 || shipLength > 5) {
    throw new Error(
      'Out of range: Ship length can not be less then 1 or greater than 5.'
    );
  }
}

function validateHitCount(hits, shipLength) {
  if (hits > shipLength) {
    throw new Error(
      'Out of range: Hits count can not be greater than ship length.'
    );
  } else return hits;
}

function validatePlayerType(playerType) {
  if (playerType !== 'real' && playerType !== 'computer')
    throw new Error(
      'Invalid player type: Player type must be of the value "real" or "computer".'
    );
  else return true;
}

module.exports = {
  validateShipName,
  validateCoords,
  validateReceiveAttackCoords,
  validateMainAxis,
  validateShipDimensionsOnTheGameboard,
  validateShipLength,
  validateHitCount,
  validatePlayerType,
};
