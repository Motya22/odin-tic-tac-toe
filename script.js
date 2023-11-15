// GAMEBOARD
const gameBoard = (function () {
  const ROWS = 3;
  const COLUMNS = 3;
  const board = [];
  // const board = [
  //   ['X', 'O', 'X'],
  //   ['O', 'O', 'X'],
  //   ['O', 'X', 'O'],
  // ];

  for (let i = 0; i < ROWS; i++) {
    board[i] = [];

    for (let j = 0; j < COLUMNS; j++) {
      board[i].push(createCell());
    }
  }

  const getBoard = () => board;

  const dropToken = (row, column, playerToken) => {
    const cell = board[row][column];

    if (cell.getValue() !== '') {
      return;
    } else {
      cell.addToken(playerToken);
    }
  };

  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    console.log(boardWithCellValues);
  };

  return { getBoard, dropToken, printBoard };
})();

// CELL
function createCell() {
  let value = '';

  const addToken = (playerToken) => {
    value = playerToken;
  };

  const getValue = () => value;

  return {
    addToken,
    getValue,
  };
}

// PLAYER
function createPlayer(name, token) {
  return { name, token };
}

// GAME CONTROLLER
const gameController = (function (
  playerOneName = 'Player One',
  playerTwoName = 'Player Two'
) {
  const players = [
    createPlayer(playerOneName, 'X'),
    createPlayer(playerTwoName, 'O'),
  ];
  let activePlayer = players[0];
  let isGameOver = false;

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;
  const getIsGameOver = () => isGameOver;

  const printNewRound = () => {
    gameBoard.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const printDraw = () => {
    gameBoard.printBoard();
    console.log("It's a draw!");
  };

  const printWinner = () => {
    gameBoard.printBoard();
    console.log(`${getActivePlayer().name} wins!`);
  };

  const isCurrentPlayerWin = () => {
    // horizontally
    const isHorizontallyFill = () =>
      gameBoard
        .getBoard()
        .some((row) =>
          row.every((cell) => cell.getValue() === activePlayer.token)
        );

    if (isHorizontallyFill()) return true;

    // vertically
    for (let column = 0; column < gameBoard.getBoard()[0].length; column++) {
      if (gameBoard.getBoard()[0][column].getValue() !== '') {
        if (
          gameBoard.getBoard()[0][column].getValue() ===
            gameBoard.getBoard()[1][column].getValue() &&
          gameBoard.getBoard()[1][column].getValue() ===
            gameBoard.getBoard()[2][column].getValue()
        ) {
          return true;
        }
      }
    }

    // diagonally
    if (gameBoard.getBoard()[0][0].getValue() !== '') {
      if (
        gameBoard.getBoard()[0][0].getValue() ===
          gameBoard.getBoard()[1][1].getValue() &&
        gameBoard.getBoard()[1][1].getValue() ===
          gameBoard.getBoard()[2][2].getValue()
      ) {
        return true;
      }
    }

    // anti-diagonally
    if (gameBoard.getBoard()[0][2].getValue() !== '') {
      if (
        gameBoard.getBoard()[0][2].getValue() ===
          gameBoard.getBoard()[1][1].getValue() &&
        gameBoard.getBoard()[1][1].getValue() ===
          gameBoard.getBoard()[2][0].getValue()
      ) {
        return true;
      }
    }

    return false;
  };

  const getIsCurrentPlayerWin = () => isCurrentPlayerWin;

  const isBoardCompletelyFilled = () =>
    gameBoard
      .getBoard()
      .every((row) => row.every((cell) => cell.getValue() !== ''));

  const getIsBoardCompletelyFilled = () => isBoardCompletelyFilled;

  const playRound = (row, column) => {
    if (isGameOver) return;

    console.log(
      `Dropping ${
        getActivePlayer().name
      }'s token into row ${row} column ${column}...`
    );
    gameBoard.dropToken(row, column, getActivePlayer().token);

    /*  This is where we would check for a winner and handle that logic,
        such as a win message. */
    if (isBoardCompletelyFilled() && !isCurrentPlayerWin()) {
      printDraw();
      isGameOver = true;
      return;
    } else if (isCurrentPlayerWin()) {
      printWinner();
      isGameOver = true;
      return;
    }

    switchPlayerTurn();
    printNewRound();
  };

  printNewRound();

  return {
    playRound,
    getActivePlayer,
    getBoard: gameBoard.getBoard,
    getIsBoardCompletelyFilled,
    getIsCurrentPlayerWin,
    getIsGameOver,
  };
})();

// DISPLAY CONTROLLER
const displayController = (function () {
  const boardEl = document.querySelector('.board');
  const resultEl = document.querySelector('.result');

  const updateDisplay = () => {
    boardEl.innerHTML = '';

    const board = gameController.getBoard();
    const activePlayer = gameController.getActivePlayer();
    const isBoardCompletelyFilled = gameController.getIsBoardCompletelyFilled();
    const isCurrentPlayerWin = gameController.getIsCurrentPlayerWin();
    const isGameOver = gameController.getIsGameOver();

    if (isBoardCompletelyFilled() && !isCurrentPlayerWin()) {
      resultEl.textContent = "It's a draw!";
    } else if (isCurrentPlayerWin()) {
      resultEl.textContent = `${activePlayer.name} wins!`;
    }

    // Render board
    board.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        const cellEl = document.createElement('button');
        cellEl.classList.add('cell');

        cellEl.dataset.coordinates = `${rowIndex}-${columnIndex}`;
        cellEl.textContent = cell.getValue();

        boardEl.appendChild(cellEl);
      });
    });
  };

  // Add event listener for the board
  function clickHandlerBoard(e) {
    const selectedCellCoordinates = e.target.dataset.coordinates;

    if (!selectedCellCoordinates) return;

    const board = gameController.getBoard();
    const [row, column] = selectedCellCoordinates.split('-');
    const selectedCell = board[row][column];

    if (selectedCell.getValue() !== '') return;

    gameController.playRound(row, column);
    updateDisplay();
  }
  boardEl.addEventListener('click', clickHandlerBoard);

  // Initial render
  updateDisplay();
})();
