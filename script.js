const board = document.getElementById("board");
const info = document.getElementById("info");
const modeRadios = document.getElementsByName("mode");

let cells = [];
let currentPlayer = "X";
let gameOver = false;
let gameMode = "pvp";

function createBoard() {
  board.innerHTML = "";
  cells = [];

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", () => handleMove(i));
    board.appendChild(cell);
    cells.push(cell);
  }

  currentPlayer = "X";
  gameOver = false;
  updateInfo();
}

function updateInfo(message = "") {
  info.textContent = message || `Player ${currentPlayer}'s Turn`;
}

function checkWinner() {
  const combos = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6],
  ];
  return combos.find(([a,b,c]) => {
    return (
      cells[a].textContent &&
      cells[a].textContent === cells[b].textContent &&
      cells[a].textContent === cells[c].textContent
    );
  });
}

function handleMove(index) {
  if (cells[index].textContent || gameOver) return;

  cells[index].textContent = currentPlayer;

  const winnerCombo = checkWinner();
  if (winnerCombo) {
    gameOver = true;
    highlightWinner(winnerCombo);
    updateInfo(`Player ${currentPlayer} Wins!`);
    return;
  }

  if (cells.every(cell => cell.textContent)) {
    gameOver = true;
    updateInfo("It's a Draw!");
    return;
  }

  if (gameMode === "cpu" && currentPlayer === "X") {
    currentPlayer = "O";
    updateInfo("Computer's Turn");
    setTimeout(() => {
      const bestMove = getBestMove();
      handleMove(bestMove);
    }, 500);
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updateInfo();
  }
}

function highlightWinner(combo) {
  combo.forEach(i => {
    cells[i].style.backgroundColor = "#a0e3a0";
  });
}

function resetGame() {
  createBoard();
}

modeRadios.forEach(radio => {
  radio.addEventListener("change", e => {
    gameMode = e.target.value;
    resetGame();
  });
});

function getBestMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < 9; i++) {
    if (!cells[i].textContent) {
      cells[i].textContent = "O";
      let score = minimax(cells, 0, false);
      cells[i].textContent = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(boardState, depth, isMaximizing) {
  const winnerCombo = checkWinner();
  if (winnerCombo) {
    const winner = cells[winnerCombo[0]].textContent;
    if (winner === "O") return 10 - depth;
    if (winner === "X") return depth - 10;
  }

  if ([...cells].every(cell => cell.textContent)) {
    return 0;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!cells[i].textContent) {
        cells[i].textContent = "O";
        let score = minimax(boardState, depth + 1, false);
        cells[i].textContent = "";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!cells[i].textContent) {
        cells[i].textContent = "X";
        let score = minimax(boardState, depth + 1, true);
        cells[i].textContent = "";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

createBoard();