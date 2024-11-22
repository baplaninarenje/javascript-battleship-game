const generateBoardUI = (board) => {
  for (let i = 1; i < 101; i++) {
    const cell = document.createElement('button');
    cell.classList.add('cell');

    const row = Math.floor((i - 1) / 10) + 1;
    const col = ((i - 1) % 10) + 1;

    cell.dataset.x = col;
    cell.dataset.y = row;

    board.appendChild(cell);
  }
};

const addShipToCell = (shipCell, shipName) => {
  shipCell.classList.add('cell-ship');
  shipCell.classList.add('cell-ship-hover');
  shipCell.setAttribute('data-ship-name', shipName);
  shipCell.setAttribute('draggable', true);
};

const removeShipFromCell = (shipCell) => {
  shipCell.classList.remove('cell-ship');
  shipCell.classList.remove('cell-ship-hover');
  shipCell.removeAttribute('draggable');
  shipCell.removeAttribute('data-ship-name');
};

const getShipCells = (playerType, gameboardType) => {
  const shipCells = [];
  const cells = gameboardType.querySelectorAll('.cell');
  cells.forEach((cell) => removeShipFromCell(cell));
  Object.entries(playerType.gameboard.gameboard).forEach(
    ([shipName, shipObj]) => {
      if (shipObj.mainAxis === 'x') {
        shipObj.x.forEach((coord) => {
          const cellToPaint = gameboardType.querySelector(
            `[data-x="${coord}"][data-y="${shipObj.y[0]}"]`
          );
          addShipToCell(cellToPaint, shipName);
          shipCells.push(cellToPaint);
        });
      } else {
        shipObj.y.forEach((coord) => {
          const cellToPaint = gameboardType.querySelector(
            `[data-x="${shipObj.x[0]}"][data-y="${coord}"]`
          );
          addShipToCell(cellToPaint, shipName);
          shipCells.push(cellToPaint);
        });
      }
    }
  );
  return shipCells;
};

module.exports = { generateBoardUI, getShipCells };
