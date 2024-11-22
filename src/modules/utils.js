function fillShipLengthArray(start, shipLength) {
  const result = [];
  for (let i = 0; i < parseInt(shipLength); i++) {
    result.push(parseInt(start) + i);
  }
  return result;
}

const getRandomNumber = (BOARD_SIZE) =>
  Math.floor(Math.random() * BOARD_SIZE) + 1;

function generateConsecutiveNumbers(shipLength, BOARD_SIZE) {
  const start =
    Math.floor(Math.random() * (BOARD_SIZE - parseInt(shipLength) + 1)) + 1;
  return Array.from({ length: parseInt(shipLength) }, (_, i) => start + i);
}

module.exports = {
  fillShipLengthArray,
  getRandomNumber,
  generateConsecutiveNumbers,
};
