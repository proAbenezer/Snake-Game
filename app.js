const gameBoard = document.getElementById("gameBoard");
const scoreBoard = document.getElementById("score-span");
const highScoreBoard = document.getElementById("high-score-span");
const restartBtn = document.getElementById("restartBtn");
const startBtn = document.getElementById("startBtn");
const gameMessage = document.getElementById("game-message");
const messages = [
  "Nice Job",
  "Almost There",
  "Not Bad",
  "You Can Do This",
  "Keep It Up",
  "Maybe Next",
];
const gridSize = 21;
let score = 0;
let highScore = 0;
let direction = "right";
let snake = [{ x: 11, y: 11 }];
let food = getRandomGridPosition();
let gameInterval;
let gameSpeed = 500;
let isGameRunning = false;

window.addEventListener("keydown", handleKeyDown);
function startGame() {
  gameSpeed = 200;
  isGameRunning = true;
  gameInterval = setInterval(() => {
    moveSnake();
    draw();
    checkCollision();
  }, gameSpeed);
}
restartBtn.addEventListener("click", () => restartGame());
startBtn.addEventListener("click", () => startGame());
function handleKeyDown(event) {
  if (
    (!isGameRunning && event.code === "Enter") ||
    event.code === "Space" ||
    (isGameRunning && event.key === "Enter")
  ) {
    startGame();
  } else {
    switch (event.key) {
      case "ArrowUp":
        direction = "up";
        break;
      case "ArrowDown":
        direction = "down";
        break;
      case "ArrowLeft":
        direction = "left";
        break;
      case "ArrowRight":
        direction = "right";
        break;
    }
  }
}
function draw() {
  gameBoard.innerHTML = "";
  drawSnake();
  drawFood();
  scoreBoard.innerHTML = score;
}
function drawSnake() {
  snake.forEach((segement) => {
    const snakeElement = createGameElement("div", "snake");
    assignPosition(snakeElement, segement);
    gameBoard.appendChild(snakeElement);
  });
}

function createGameElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

function assignPosition(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}
function drawFood() {
  const foodElement = createGameElement("div", "food");
  assignPosition(foodElement, food);
  gameBoard.appendChild(foodElement);
}

function getRandomGridPosition() {
  return {
    x: Math.floor(Math.random() * gridSize) + 1,
    y: Math.floor(Math.random() * gridSize) + 1,
  };
}

function moveSnake() {
  let head = { ...snake[0] };
  switch (direction) {
    case "up":
      head.y--;
      break;
    case "down":
      head.y++;
      break;
    case "left":
      head.x--;
      break;
    case "right":
      head.x++;
      break;
    default:
      break;
  }
  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    score++;
    food = getRandomGridPosition();
    clearInterval(gameInterval);
    increaseGameSpeed();
    gameInterval = setInterval(() => {
      moveSnake();
      draw();
      checkCollision();
    }, gameSpeed);
  } else {
    snake.pop();
  }
}
function increaseGameSpeed() {
  if (gameSpeed > 350) {
    gameSpeed -= 10;
  } else if (gameSpeed > 250) {
    gameSpeed -= 5;
  } else if (gameSpeed > 150) {
    gameSpeed += 3;
  } else if (gameSpeed > 100) {
    gameSpeed += 2;
  }
}
function checkCollision() {
  if (
    snake[0].x < 1 ||
    snake[0].x > gridSize ||
    snake[0].y < 1 ||
    snake[0].y > gridSize
  ) {
    clearInterval(gameInterval);
    isGameRunning = false;
    snake = [{ x: 11, y: 11 }];
    food = getRandomGridPosition();
    scoreBoard.innerText = score;
    highScore = getHightScore(score, highScore);
    highScoreBoard.innerText = highScore;
    gameSpeed = 500;
    if (!isGameRunning) {
      restartBtn.style.display = "block";
      startBtn.style.display = "none";
      gameMessage.style.display = "block";
      const messageForGameOver = messages[Math.floor(Math.random() * 6)];
      gameMessage.innerHTML = `${messageForGameOver}  Score: ${score}  Height Score: ${highScore}`;
    }
  }
  for (let i = 1; i < snake.length; i++) {
    if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
      restartGame();
    }
  }
}

function restartGame() {
  clearInterval(gameInterval);
  startGame();
  gameMessage.style.display = "none";
  restartBtn.style.display = "none";
  startBtn.style.display = "block";
}

function getHightScore(score, highScore) {
  if (score > highScore) {
    highScore = score;
  }

  return highScore;
}
