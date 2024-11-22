const createShip = require('./../src/modules/createShip');

test('module exists', () => {
  expect(createShip).toBeDefined();
});

test('ship length exists', () => {
  const { shipLength } = createShip(3);
  expect(shipLength).toBeDefined();
});

test('throw error if ship length is not a number', () => {
  const inputsTypeArray = ['3', null, undefined, true, {}, []];
  inputsTypeArray.forEach((input) => {
    expect(() => createShip(input)).toThrow(/Wrong type/);
  });
});

test('throw error if ship length is out of range', () => {
  const inputsOutOfRangeArray = [0, 6];
  inputsOutOfRangeArray.forEach((input) => {
    expect(() => createShip(input)).toThrow(/Out of range/);
  });
});

test('ship length is 3', () => {
  const { shipLength } = createShip(3);
  expect(shipLength).toBe(3);
});

test('hit count exists', () => {
  const { hitCount } = createShip(3);
  expect(hitCount).toBeDefined();
});

test('throw error if hit count is out of range', () => {
  const ship = createShip(2);
  ship.hit();
  ship.hit();
  expect(() => ship.hit()).toThrow(/Out of range/);
});

test('hit count is 0', () => {
  const ship = createShip(3);
  const { hitCount } = ship;
  expect(hitCount()).toBe(0);
});

test('hit count is 2', () => {
  const ship = createShip(3);
  ship.hit();
  ship.hit();
  const { hitCount } = ship;
  expect(hitCount()).toBe(2);
});

test('isSunk exists', () => {
  const { isSunk } = createShip(3);
  expect(isSunk).toBeDefined();
});

test('isSunk is false', () => {
  const { isSunk: isSunkA } = createShip(2);
  expect(isSunkA()).toBe(false);
  const shipB = createShip(2);
  shipB.hit();
  const { isSunk: isSunkB } = shipB;
  expect(isSunkB()).toBe(false);
});

test('isSunk is true', () => {
  const ship = createShip(2);
  ship.hit();
  ship.hit();
  expect(ship.isSunk()).toBe(true);
});
