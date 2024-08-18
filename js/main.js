// Initial variables
const board_bg = "#111111";
const gridSize = 30;
const fps = 60;
const initialScore = 0;

// Game variables
let score = initialScore;
let highScore = 0;
let gameplay = false; // Game is running or not

// Board variables
const board = document.getElementById("board");
const ctx = board.getContext("2d");

// Control Element
const topScoreBox = document.getElementById("topScore");
const scoreBox = document.getElementById("score");
const logBox = document.getElementById("log");
const arrowControl = document.querySelectorAll(".controlButton");
const playButton = document.getElementById("playButton");
const restartButton = document.getElementById("restartButton");
const eraseButton = document.getElementById("eraseButton");
const obsButton = document.querySelectorAll(".obsButton");

// Init function
function init() {
    setBoardSize();
    createNewSnake();
    clearBoard();
    drawSnake();
}

// On loop function
function onLoop() {
    clearBoard();
    decreaseMultiplier();
    changeDirection();
    drawFood();
    move();
    drawSnake();
    drawObs();
    main();
}

// Play function
function play() {
    gameplay = true;

    main();

    genFood();
}

// Main function
function main() {
    logBox.innerHTML = `<i class="gg-info"></i> Good Luck!`;
    playButton.disabled = true;
    restartButton.disabled = true;
    eraseButton.disabled = true;
    for (let i = 0; i < obsButton.length; i++) {
        obsButton[i].disabled = true;
    }
    for (let i = 0; i < arrowControl.length; i++) {
        arrowControl[i].disabled = false;
    }
    if (gameEnd()) {
        restartButton.disabled = false;
        for (let i = 0; i < arrowControl.length; i++) {
            arrowControl[i].disabled = true;
        }

        if (score > highScore) {
            highScore = score;
            topScoreBox.innerHTML = `<i class="gg-awards"></i> ${highScore}`;
        }

        return;
    }

    changingDirectionFlag = false;
    setTimeout(onLoop, 1000 / fps);
}

// Set board size based on window size
function setBoardSize() {
    if (window.innerWidth < 600) {
        board.width =
            Math.round((window.innerWidth * 0.4) / (gridSize / 2)) * gridSize;
        board.height =
            Math.round((window.innerHeight * 0.2) / (gridSize / 2)) * gridSize;
    } else {
        board.width = window.innerWidth * 0.6;
        board.height =
            Math.round((window.innerHeight * 0.4) / (gridSize / 2)) * gridSize;
    }
}

// Restart function
function restart() {
    logBox.innerHTML = `<i class="gg-info"></i> Try again!`;
    playButton.disabled = false;
    restartButton.disabled = true;
    for (let i = 0; i < obsButton.length; i++) {
        obsButton[i].disabled = false;
    }
    if (obstacle.length > 0) eraseButton.disabled = false;

    score = initialScore;
    scoreBox.textContent = score;

    changingDirectionFlag = false;
    speed = initialSpeed;
    growingTime = 0;
    scoreMultiplier = initialScoreMultiplier;
    tempTurnDirection = [];

    createNewSnake();
    clearBoard();
    drawSnake();
    drawObs();

    dx = -speed;
    dy = 0;

    gameplay = false;
}

// Fungsi menghapus board
function clearBoard() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.beginPath();
}

// Fungsi game end
function gameEnd() {
    // Cek jika nabrak ruas snake
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            logBox.innerHTML = `<i class="gg-info"></i> You hit yourself!`;
            return true;
        }
    }
    // Cek jika nabrak obstacle
    for (let i = 0; i < obstacle.length; i++) {
        if (
            obstacle[i].x < snake[0].x + gridSize &&
            obstacle[i].x + gridSize > snake[0].x &&
            obstacle[i].y < snake[0].y + gridSize &&
            obstacle[i].y + gridSize > snake[0].y
        ) {
            logBox.innerHTML = `<i class="gg-info"></i> You hit a wall!`;
            return true;
        }
    }

    return false;
}
