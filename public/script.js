const user = Telegram.WebApp.initDataUnsafe?.user || { id: 'guest' };
let balance = 0;
let board = [];
let mines = [];
let gameOver = false;

function renderBoard() {
  const boardDiv = document.getElementById('board');
  boardDiv.innerHTML = '';
  board.forEach((row, rIdx) => {
    row.forEach((cell, cIdx) => {
      const div = document.createElement('div');
      div.className = 'cell';
      div.addEventListener('click', () => reveal(rIdx, cIdx));
      boardDiv.appendChild(div);
    });
  });
}

function startGame() {
  const count = Number(document.getElementById('mine-count').value);
  board = Array.from({ length: 5 }, () => Array(5).fill(0));
  mines = [];
  gameOver = false;
  document.getElementById('board').classList.remove('disabled');
  while (mines.length < count) {
    const r = Math.floor(Math.random() * 5);
    const c = Math.floor(Math.random() * 5);
    const key = r + '-' + c;
    if (!mines.includes(key)) {
      mines.push(key);
      board[r][c] = 'M';
    }
  }
  renderBoard();
}

function reveal(r, c) {
  if (gameOver) return;
  const key = r + '-' + c;
  const cells = document.getElementsByClassName('cell');
  const index = r * 5 + c;
  const cellDiv = cells[index];
  if (mines.includes(key)) {
    cellDiv.classList.add('mine');
    gameOver = true;
    document.getElementById('board').classList.add('disabled');
  } else {
    cellDiv.classList.add('revealed');
  }
}

function updateBalance(val) {
  balance = val;
  document.getElementById('balance').textContent = balance;
}

async function deposit() {
  const amount = Number(document.getElementById('amount').value);
  const res = await fetch('/api/deposit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: user.id, amount })
  });
  const data = await res.json();
  updateBalance(data.balance);
}

async function withdraw() {
  const amount = Number(document.getElementById('amount').value);
  const res = await fetch('/api/withdraw', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: user.id, amount })
  });
  const data = await res.json();
  updateBalance(data.balance);
}

document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('deposit-btn').addEventListener('click', deposit);
document.getElementById('withdraw-btn').addEventListener('click', withdraw);

startGame();
