const createPlayer = require('./../src/modules/createPlayer.js');
const createGameboard = require('./../src/modules/createGameboard.js');

test('module exists', () => {
  expect(createPlayer).toBeDefined();
});

test('throw error if a player type is not a "real" or "computer" type', () => {
  const inputsTypeArray = ['unknown', '3', null, undefined, true, {}, []];
  inputsTypeArray.forEach((input) => {
    expect(() => createPlayer(input)).toThrow(/Invalid player type/);
  });
});

test('createPlayer returns gameboard and player type', () => {
  const gameboard = createGameboard();

  expect(JSON.stringify(createPlayer('real'))).toBe(
    JSON.stringify({
      playerType: 'real',
      gameboard,
    })
  );

  expect(JSON.stringify(createPlayer('computer'))).toBe(
    JSON.stringify({
      playerType: 'computer',
      gameboard,
    })
  );
});
