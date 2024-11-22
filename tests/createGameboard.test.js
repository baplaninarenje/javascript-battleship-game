const createGameboard = require('./../src/modules/createGameboard.js');

test('module exists', () => {
  expect(createGameboard).toBeDefined();
});

test('place ships exists', () => {
  const { placeShip } = createGameboard();
  expect(placeShip).toBeDefined();
});

test('throw error if ship name is out of range', () => {
  const { placeShip } = createGameboard();
  expect(() => placeShip('unknown')).toThrow(/Out of range: Ship name/);
});

test('throw error if x and y are out of range', () => {
  const { placeShip } = createGameboard();
  expect(() => placeShip('destroyer', [0, 1], [1])).toThrow(
    /Out of range: X and Y/
  );
  expect(() => placeShip('submarine', [8], [10, 11], 'y')).toThrow(
    /Out of range: X and Y/
  );
});

test('throw error if main axis is out of range', () => {
  const { placeShip } = createGameboard();
  expect(() => placeShip('destroyer', [1, 2], [1], 'z')).toThrow(
    /Out of range: Main axis/
  );
});

test('throw error if ship dimensions on the gameboard are not equal as its length', () => {
  const { placeShip } = createGameboard();
  expect(() => placeShip('destroyer', [5, 6, 7], [1])).toThrow(
    /Out of range: Ship dimensions on the gameboard/
  );
  expect(() => placeShip('destroyer', [1, 2], [1, 2])).toThrow(
    /Out of range: Ship dimensions on the gameboard/
  );
  expect(() => placeShip('destroyer', [1, 2], [1, 2], 'y')).toThrow(
    /Out of range: Ship dimensions on the gameboard/
  );
});

test('throw error if ship dimensions do not corespond to ship main axis', () => {
  const { gameboard, placeShip } = createGameboard();
  expect(() => placeShip('destroyer', [5], [1, 2])).toThrow(
    /Out of range: Ship dimensions do not corespond/
  );
  expect(() => placeShip('destroyer', [1, 2], [1], 'y')).toThrow(
    /Out of range: Ship dimensions do not corespond/
  );
});

test(
  'return false if placing a ship overlaps with other ship position or or ' +
    'crosses the boundaries of the gameboard grid',
  () => {
    const { gameboard, placeShip } = createGameboard();

    Object.values(gameboard).map((ship) => {
      ship.x = [];
      ship.y = [];
    });

    gameboard.submarine.x = [1, 2, 3];
    gameboard.submarine.y = [3];

    expect(
      placeShip('cruiser', gameboard.submarine.x, gameboard.submarine.y)
    ).toBe(false);
    expect(
      placeShip('cruiser', gameboard.submarine.y, gameboard.submarine.x, 'y')
    ).toBe(false);
  }
);

test('return true if placing a ship is successfully', () => {
  const { gameboard, placeShip } = createGameboard();

  Object.values(gameboard).map((ship) => {
    ship.x = [];
    ship.y = [];
  });

  expect(placeShip('cruiser', [1, 2, 3], [3])).toBe(true);
  expect(placeShip('destroyer', [1, 2], [1])).toBe(true);
  expect(placeShip('cruiser', [3], [1, 2, 3], 'y')).toBe(true);
});

test('ship coords changes successfully after placing the ship', () => {
  const { gameboard, placeShip } = createGameboard();

  Object.values(gameboard).map((ship) => {
    ship.x = [];
    ship.y = [];
  });

  placeShip('cruiser', [1, 2, 3], [3]);
  expect(gameboard.cruiser.x).toEqual([1, 2, 3]);
  expect(gameboard.cruiser.y).toEqual([3]);
  expect(gameboard.cruiser.mainAxis).toBe('x');

  placeShip('cruiser', [1], [1, 2, 3], 'y');
  expect(gameboard.cruiser.x).toEqual([1]);
  expect(gameboard.cruiser.mainAxis).toBe('y');
});

test('receiveAttack exists', () => {
  const { receiveAttack } = createGameboard();
  expect(receiveAttack).toBeDefined();
});

test('throw error if x or y are out of range', () => {
  const { receiveAttack } = createGameboard();
  expect(() => receiveAttack(0, 1)).toThrow(
    /Out of range: Receive attack X and Y/
  );
  expect(() => receiveAttack(8, 11)).toThrow(
    /Out of range: Receive attack X and Y/
  );
});

test('throw error if x or y are not a numbers', () => {
  const { receiveAttack } = createGameboard();
  const inputsTypeArray = [[3], '3', null, undefined, true, {}, []];
  inputsTypeArray.forEach((input) => {
    expect(() => receiveAttack(input, input)).toThrow(/Wrong type/);
  });
});

test('the attack hit a ship and incremented the hitCount of the correct ship', () => {
  const { gameboard, placeShip, receiveAttack } = createGameboard();

  placeShip('destroyer', [1, 2], [1]);
  receiveAttack(1, 1);
  expect(gameboard.destroyer.hitCount()).toBe(1);

  placeShip('cruiser', [1], [8, 9, 10], 'y');
  receiveAttack(1, 9);
  receiveAttack(1, 8);
  receiveAttack(1, 10);
  expect(gameboard.cruiser.hitCount()).toBe(3);
});

test('the attack hit a ship and returned coords of the hit shot', () => {
  const { placeShip, receiveAttack } = createGameboard();

  placeShip('destroyer', [1, 2], [1]);
  expect(receiveAttack(2, 1)).toEqual({ hit: true, x: 2, y: 1 });

  placeShip('cruiser', [1], [8, 9, 10], 'y');
  expect(receiveAttack(1, 9)).toEqual({ hit: true, x: 1, y: 9 });
  expect(receiveAttack(1, 8)).toEqual({ hit: true, x: 1, y: 8 });
  expect(receiveAttack(1, 10)).toEqual({ hit: true, x: 1, y: 10 });
});

test('the attack missed a ship and returned coords of the missed shot', () => {
  const { placeShip, receiveAttack } = createGameboard();

  placeShip('destroyer', [1, 2], [1]);
  expect(receiveAttack(3, 1)).toEqual({ hit: false, x: 3, y: 1 });

  placeShip('cruiser', [1], [8, 9, 10], 'y');
  expect(receiveAttack(1, 7)).toEqual({ hit: false, x: 1, y: 7 });
  expect(receiveAttack(1, 6)).toEqual({ hit: false, x: 1, y: 6 });
  expect(receiveAttack(1, 5)).toEqual({ hit: false, x: 1, y: 5 });
});

test('allShipsAreSunk exists', () => {
  const { allShipsAreSunk } = createGameboard();
  expect(allShipsAreSunk).toBeDefined();
});

test('all ships are not sunk', () => {
  const { allShipsAreSunk: allShipsAreSunkA } = createGameboard();
  expect(allShipsAreSunkA()).toBe(false);

  const {
    allShipsAreSunk: allShipsAreSunkB,
    placeShip: placeShipB,
    receiveAttack: receiveAttackB,
  } = createGameboard();
  placeShipB('destroyer', [1, 2], [1]);
  receiveAttackB(1, 1);
  receiveAttackB(2, 1);
  expect(allShipsAreSunkB()).toBe(false);

  const {
    allShipsAreSunk: allShipsAreSunkC,
    placeShip: placeShipC,
    receiveAttack: receiveAttackC,
  } = createGameboard();
  placeShipC('destroyer', [1, 2], [1]);
  receiveAttackC(1, 1);
  receiveAttackC(2, 1);
  placeShipC('cruiser', [1], [8, 9, 10], 'y');
  receiveAttackC(1, 9);
  receiveAttackC(1, 8);
  receiveAttackC(1, 10);
  expect(allShipsAreSunkC()).toBe(false);
});

test('all ships are sunk', () => {
  const { allShipsAreSunk, placeShip, receiveAttack } = createGameboard();

  placeShip('destroyer', [1, 2], [1]);
  receiveAttack(1, 1);
  receiveAttack(2, 1);
  placeShip('submarine', [1, 2, 3], [3]);
  receiveAttack(1, 3);
  receiveAttack(2, 3);
  receiveAttack(3, 3);
  placeShip('cruiser', [1, 2, 3], [5]);
  receiveAttack(1, 5);
  receiveAttack(2, 5);
  receiveAttack(3, 5);
  placeShip('battleship', [1, 2, 3, 4], [7]);
  receiveAttack(1, 7);
  receiveAttack(2, 7);
  receiveAttack(3, 7);
  receiveAttack(4, 7);
  placeShip('carrier', [1, 2, 3, 4, 5], [9]);
  receiveAttack(1, 9);
  receiveAttack(2, 9);
  receiveAttack(3, 9);
  receiveAttack(4, 9);
  receiveAttack(5, 9);

  expect(allShipsAreSunk()).toBe(true);
});
