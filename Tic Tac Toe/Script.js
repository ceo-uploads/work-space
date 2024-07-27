const cells = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const restartButton = document.getElementById('restartButton');
const player1WinsElement = document.getElementById('player1-wins');
const player2WinsElement = document.getElementById('player2-wins');
const drawsElement = document.getElementById('draws');
const turnMessage = document.getElementById('turnMessage');
const winMessage = document.getElementById('winMessage');
const editPlayer1 = document.getElementById('edit-player1');
const editPlayer2 = document.getElementById('edit-player2');
const player1NameElement = document.getElementById('player1-name');
const player2NameElement = document.getElementById('player2-name');
const nameInputContainer = document.getElementById('nameInputContainer');
const nameInput = document.getElementById('nameInput');
const saveNameButton = document.getElementById('saveNameButton');
const cancelNameButton = document.getElementById('cancelNameButton');

let player1Wins = 0;
let player2Wins = 0;
let draws = 0;
let isPlayer1Turn = true;
let gameActive = true;
let editingPlayer = null;

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellClick(event) {
    const cell = event.target;
    if (!gameActive || cell.textContent !== '') return;

    cell.textContent = isPlayer1Turn ? 'X' : 'O';
    if (checkWin()) {
        gameActive = false;
        updateScore(isPlayer1Turn ? 'Player 1' : 'Player 2');
    } else if (isDraw()) {
        gameActive = false;
        updateScore('Draw');
    } else {
        isPlayer1Turn = !isPlayer1Turn;
        setTurnMessage();
    }
}

function checkWin() {
    return winningCombinations.some(combination => {
        return combination.every(index => {
            return cells[index].textContent === (isPlayer1Turn ? 'X' : 'O');
        });
    });
}

function isDraw() {
    return [...cells].every(cell => {
        return cell.textContent === 'X' || cell.textContent === 'O';
    });
}

function updateScore(winner) {
    if (winner === 'Player 1') {
        player1Wins++;
        player1WinsElement.textContent = player1Wins;
        winMessage.textContent = `Congratulations ${player1NameElement.textContent}! You win!`;
    } else if (winner === 'Player 2') {
        player2Wins++;
        player2WinsElement.textContent = player2Wins;
        winMessage.textContent = `Congratulations ${player2NameElement.textContent}! You win!`;
    } else if (winner === 'Draw') {
        draws++;
        drawsElement.textContent = draws;
        winMessage.textContent = 'It\'s a draw!';
    }
}

function restartGame() {
    isPlayer1Turn = true;
    gameActive = true;
    cells.forEach(cell => cell.textContent = '');
    setTurnMessage();
    winMessage.textContent = '';
}

function setTurnMessage() {
    turnMessage.textContent = isPlayer1Turn ? `${player1NameElement.textContent}'s turn` : `${player2NameElement.textContent}'s turn`;
}

function editName(player) {
    nameInputContainer.style.display = 'block';
    nameInput.value = '';
    nameInput.focus();
    editingPlayer = player;
}

function saveName() {
    const playerName = nameInput.value.trim();
    if (playerName) {
        if (editingPlayer === 'player1') {
            player1NameElement.textContent = playerName;
        } else {
            player2NameElement.textContent = playerName;
        }
        setTurnMessage();
    }
    nameInputContainer.style.display = 'none';
    editingPlayer = null;
}

function cancelEdit() {
    nameInputContainer.style.display = 'none';
    editingPlayer = null;
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', restartGame);
editPlayer1.addEventListener('click', () => editName('player1'));
editPlayer2.addEventListener('click', () => editName('player2'));
saveNameButton.addEventListener('click', saveName);
cancelNameButton.addEventListener('click', cancelEdit);

setTurnMessage();
