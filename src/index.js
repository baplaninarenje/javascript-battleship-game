require('./styles/reset.css');
require('./styles/style.css');

const { generateBoardUI, getShipCells } = require('./modules/generateBoard.js');
const createPlayer = require('./modules/createPlayer.js');
const {
  onPlayerBoardClick,
  togglePlayersTurns,
  getRandomAvailableCell,
  handleGameEndScenario,
  randomiseShips,
  onStartButtonClick,
  rotateShip,
  generateDragImage,
  closeModalAndPlayAgain,
} = require('./modules/manageDomActions.js');
const { fillShipLengthArray } = require('./modules/utils.js');

// querySelectors
const realPlayerBoard = document.querySelector('#real-player-board');
const computerPlayerBoard = document.querySelector('#computer-player-board');
const dialog = document.querySelector('#modalOverlay');
const dialogPlayAgainBtn = document.querySelector('#modalOverlay button');
const startButton = document.querySelector('#battlefield-start-button');
const randomiseButton = document.querySelector('#randomise');

generateBoardUI(realPlayerBoard);
generateBoardUI(computerPlayerBoard);

const realPlayer = createPlayer('real');
const computerPlayer = createPlayer('computer');
let realPlayerTurn = true;

window.onload = () => {
  try {
    randomiseShips(realPlayerBoard, realPlayer);
    randomiseShips(computerPlayerBoard, computerPlayer);
  } catch (error) {
    console.error(error);
  }
};

realPlayerBoard.onclick = (e) => {
  if (!e.target.classList.contains('cell-ship')) return;
  try {
    rotateShip(e, realPlayerBoard, realPlayer);
  } catch (error) {
    console.warn(error);
  } finally {
    getShipCells(realPlayer, realPlayerBoard);
  }
};

computerPlayerBoard.onclick = ({ target }) => {
  onPlayerBoardClick(target, computerPlayer);
  handleGameEndScenario(computerPlayer, dialog);
  if (dialog.open) return;
  realPlayerTurn = !realPlayerTurn;
  togglePlayersTurns(realPlayerTurn, realPlayerBoard, computerPlayerBoard);

  setTimeout(() => {
    const randomAvailableCell = getRandomAvailableCell(realPlayerBoard);
    onPlayerBoardClick(randomAvailableCell, realPlayer);
    setTimeout(() => {
      handleGameEndScenario(realPlayer, dialog);
    }, 0);
    realPlayerTurn = !realPlayerTurn;
    togglePlayersTurns(realPlayerTurn, realPlayerBoard, computerPlayerBoard);
  }, 2000);
};

dialogPlayAgainBtn.onclick = () => closeModalAndPlayAgain(dialog);

startButton.onclick = (e) => {
  onStartButtonClick(e, realPlayerTurn, realPlayerBoard, computerPlayerBoard);
};

realPlayerBoard.ondragstart = (e) => {
  if (!e.target.classList.contains('cell-ship')) return;
  else {
    try {
      e.dataTransfer.clearData();
      const shipName = e.target.dataset.shipName;
      e.dataTransfer.setData('text/plain', shipName);

      const { mainAxis } = realPlayer.gameboard.gameboard[shipName];

      const dragImage = generateDragImage(document.body, shipName, mainAxis);

      e.dataTransfer.setDragImage(dragImage, 0, 0);
    } catch (error) {
      console.warn(error);
    }
  }
};

realPlayerBoard.ondragover = (e) => {
  e.preventDefault();
  if (!realPlayerBoard.contains(e.target)) return;
  if (e.target.id === 'real-player-board') return;
};

realPlayerBoard.ondrop = (e) => {
  e.preventDefault();
  const shipName = e.dataTransfer.getData('text/plain');
  const ship = realPlayer.gameboard.gameboard[shipName];

  try {
    if (!realPlayerBoard.contains(e.target)) {
      console.warn('Dropping outside of the valid drop zone is not allowed.');
      realPlayer.gameboard.placeShip(shipName, ship.x, ship.y, ship.mainAxis);
    } else if (e.target.id === 'real-player-board') {
      console.warn('Dropping outside of the valid drop zone is not allowed.');
      realPlayer.gameboard.placeShip(shipName, ship.x, ship.y, ship.mainAxis);
    } else if (
      e.target.dataset.shipName &&
      e.target.dataset.shipName !== shipName
    ) {
      realPlayer.gameboard.placeShip(shipName, ship.x, ship.y, ship.mainAxis);
    } else {
      if (ship.mainAxis === 'x') {
        const isShipPlaced = realPlayer.gameboard.placeShip(
          shipName,
          fillShipLengthArray(e.target.dataset.x, ship.shipLength),
          [parseInt(e.target.dataset.y)],
          'x'
        );
        if (!isShipPlaced)
          realPlayer.gameboard.placeShip(
            shipName,
            ship.x,
            ship.y,
            ship.mainAxis
          );
      } else if (ship.mainAxis === 'y') {
        const isShipPlaced = realPlayer.gameboard.placeShip(
          shipName,
          [parseInt(e.target.dataset.x)],
          fillShipLengthArray(e.target.dataset.y, ship.shipLength),
          'y'
        );

        if (!isShipPlaced)
          realPlayer.gameboard.placeShip(
            shipName,
            ship.x,
            ship.y,
            ship.mainAxis
          );
      } else {
        console.error(
          'Unknown error: An error occurred while droping the ship.'
        );
      }
    }
  } catch (error) {
    console.warn(error);
  } finally {
    const dragImage = document.querySelector('.drag-image');
    document.body.removeChild(dragImage);
    getShipCells(realPlayer, realPlayerBoard);
  }
};

randomiseButton.onclick = () => {
  try {
    randomiseShips(realPlayerBoard, realPlayer);
  } catch (error) {
    console.error(error);
  }
};
