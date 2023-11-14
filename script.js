const gameBoard = (function () {
  const ROWS = 3;
  const COLUMNS = 3;
  const board = [];

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

function createPlayer(name, token) {
  return { name, token };
}

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

  const isBoardCompletelyFilled = () =>
    gameBoard
      .getBoard()
      .every((row) => row.every((cell) => cell.getValue() !== ''));

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
  };
})();
