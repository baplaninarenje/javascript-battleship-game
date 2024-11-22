const dragImg = require('./../assets/images/drag.png');
const dragYImg = require('./../assets/images/dragY.png');

const { getShipCells } = require('./generateBoard.js');
const {
  getRandomNumber,
  generateConsecutiveNumbers,
  fillShipLengthArray,
} = require('./utils.js');

const BOARD_SIZE = 10;

const onPlayerBoardClick = (eventTarget, playerType) => {
  const x = parseInt(eventTarget.getAttribute('data-x'));
  const y = parseInt(eventTarget.getAttribute('data-y'));
  const receivedAttackResponse = playerType.gameboard.receiveAttack(x, y);
  if (eventTarget.classList.contains('board')) return;
  else if (receivedAttackResponse.hit) {
    eventTarget.classList.add('cell-hit');
    eventTarget.textContent = 'X';
  } else {
    eventTarget.classList.add('cell-miss');
    eventTarget.innerHTML = '&#9679;';
  }
  eventTarget.disabled = true;
};

const onStartButtonClick = (
  e,
  realPlayerTurn,
  realPlayerBoard,
  computerPlayerBoard
) => {
  e.target.classList.add('hidden');
  const controlsSection = document.querySelector('.controls');
  controlsSection.classList.add('hidden');
  const cells = realPlayerBoard.querySelectorAll('.cell');
  cells.forEach((cell) => {
    cell.removeAttribute('draggable');
    cell.classList.remove('cell-ship-hover');
  });
  togglePlayersTurns(realPlayerTurn, realPlayerBoard, computerPlayerBoard);
};

const togglePlayersTurns = (
  realPlayerTurn,
  realPlayerBoard,
  computerPlayerBoard
) => {
  const notificationMessagePara = document.querySelector(
    '.notification-message'
  );
  if (realPlayerTurn) {
    realPlayerBoard.classList.add('board-disabled');
    computerPlayerBoard.classList.remove('board-disabled');
    notificationMessagePara.textContent = 'Your turn.';
  } else {
    computerPlayerBoard.classList.add('board-disabled');
    notificationMessagePara.textContent = `Computer's turn. Please wait.`;
  }
};

const getRandomAvailableCell = (playerBoard) => {
  const availableCells = playerBoard.querySelectorAll('.cell:not([disabled])');
  const randomAvailableCell =
    availableCells[Math.floor(Math.random() * availableCells.length)];

  return randomAvailableCell;
};

function placeShipUntilSuccess(gameboard, ship, getCoords) {
  try {
    let placed = false;
    while (!placed) {
      placed = gameboard.placeShip(ship, ...getCoords());
    }
  } catch (error) {
    throw new Error(error);
  }
}

const randomiseShips = (realPlayerBoard, realPlayer) => {
  try {
    const gameboard = Object.values(realPlayer.gameboard.gameboard);
    gameboard.forEach((ship) => {
      ship.x = [];
      ship.y = [];
      ship.mainAxis = Math.random() < 0.5 ? 'x' : 'y';
    });

    Object.keys(realPlayer.gameboard.gameboard).forEach((ship) => {
      const currentShip = realPlayer.gameboard.gameboard[ship];
      const isXAxis = currentShip.mainAxis === 'x';
      placeShipUntilSuccess(realPlayer.gameboard, ship, () =>
        isXAxis
          ? [
              [
                ...generateConsecutiveNumbers(
                  currentShip.shipLength,
                  BOARD_SIZE
                ),
              ],
              [getRandomNumber(BOARD_SIZE)],
            ]
          : [
              [getRandomNumber(BOARD_SIZE)],
              [
                ...generateConsecutiveNumbers(
                  currentShip.shipLength,
                  BOARD_SIZE
                ),
              ],
              'y',
            ]
      );
    });
  } catch (error) {
    throw new Error(error);
  } finally {
    getShipCells(realPlayer, realPlayerBoard);
  }
};

const rotateShip = (e, realPlayerBoard, realPlayer) => {
  try {
    const { shipName } = e.target.dataset;
    const { mainAxis, x, y } = realPlayer.gameboard.gameboard[shipName];
    if (mainAxis === 'x') {
      const isShipPlaced = realPlayer.gameboard.placeShip(
        shipName,
        [x[0]],
        fillShipLengthArray(y[0], x.length),
        'y'
      );
      if (!isShipPlaced) {
        realPlayer.gameboard.placeShip(shipName, x, y, mainAxis);
      }
    } else {
      const isShipPlaced = realPlayer.gameboard.placeShip(
        shipName,
        fillShipLengthArray(x[0], y.length),
        [y[0]],
        'x'
      );
      if (!isShipPlaced) {
        realPlayer.gameboard.placeShip(shipName, x, y, mainAxis);
      }
    }
  } catch (error) {
    throw new Error(error);
  } finally {
    getShipCells(realPlayer, realPlayerBoard);
  }
};

const handleGameEndScenario = (player, dialog) => {
  if (player.gameboard.allShipsAreSunk()) {
    openModal(dialog);
    const gameOverMsgSpan = document.querySelector('[data-game-over-msg]');
    if (player.playerType === 'computer') {
      gameOverMsgSpan.textContent = 'Congratulations, you won!';
      dialog.classList.remove('modal-lose');
      dialog.classList.add('modal-win');
    } else {
      gameOverMsgSpan.textContent = 'You lose.';
      dialog.classList.add('modal-lose');
      dialog.classList.remove('modal-win');
    }
  }
};

const generateDragImage = (parent, shipName, mainAxis) => {
  const dragImage = document.createElement('img');
  const dragImageSrc = mainAxis === 'x' ? dragImg : dragYImg;
  dragImage.style.background = `url(${dragImageSrc})`;
  parent.appendChild(dragImage);
  dragImage.className = 'drag-image';
  let shipClassName;
  switch (shipName) {
    case 'destroyer':
      shipClassName = 'drag-image-destroyer';
      break;
    case 'submarine':
    case 'cruiser':
      shipClassName = 'drag-image-submarine-and-cruiser';
      break;
    case 'battleship':
      shipClassName = 'drag-image-battleship';
      break;
    case 'carrier':
      break;
  }
  dragImage.classList.add(shipClassName);
  if (mainAxis === 'y') {
    const dragImageStyle = window.getComputedStyle(dragImage);
    const dragImageHeight = dragImageStyle.height;
    dragImage.style.height = dragImageStyle.width;
    dragImage.style.width = dragImageHeight;
  }
  return dragImage;
};

function openModal(dialog) {
  dialog.showModal();
}

function closeModalAndPlayAgain(dialog) {
  dialog.close();
  location.reload();
}

module.exports = {
  onPlayerBoardClick,
  togglePlayersTurns,
  getRandomAvailableCell,
  randomiseShips,
  rotateShip,
  handleGameEndScenario,
  generateDragImage,
  closeModalAndPlayAgain,
  onStartButtonClick,
};
