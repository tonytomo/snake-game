// Colors
const board_bg = "#111111";

// Canvas
const gridSize = 20;

// Game Fps
const fps = 30;

const initialScore = 0; // Skor awal

let score = initialScore; // Skor
let highScore = 0; // Skor tertinggi
let gameplay = false; // Flag jika game dimulai maka true

// Get canvas
const board = document.getElementById("board");
// Return 2d context
const ctx = board.getContext("2d");

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

    // Ulang fungsi
    main();
}

// Set board size based on window size
function setBoardSize() {
    board.width = Math.round((window.innerWidth * 0.4) / 10) * 20;
    if (window.innerWidth < 600) {
        board.height = Math.round((window.innerHeight * 0.2) / 10) * 20;
    } else {
        board.height = Math.round((window.innerHeight * 0.4) / 10) * 20;
    }
}

// Main function
function main() {
    const erasebtn = document.getElementById("erasebtn");
    const restartbtn = document.getElementById("restartbtn");
    const obsmodbtn = document.querySelectorAll("#obsbtn");
    const highScoreText = document.getElementById("highscore");
    gameplay = true;

    if (game_end()) {
        if (score > highScore) {
            highScore = score;
            highScoreText.innerHTML = `Highscore: ${highScore}`;
        }
        restartbtn.style.display = "block";
        erasebtn.style.display = "block";
        for (let i = 0; i < obsmodbtn.length; i++) {
            obsmodbtn[i].style.display = "block";
        }

        gameplay = false;

        return;
    }

    erasebtn.style.display = "none";
    for (let i = 0; i < obsmodbtn.length; i++) {
        obsmodbtn[i].style.display = "none";
    }

    changingDirectionFlag = false;
    setTimeout(onLoop, 1000 / fps);
}

// Play function
function play() {
    const startbtn = document.getElementById("startbtn");
    startbtn.style.display = "none";

    main();

    genFood();
}

// Restart function
function restart() {
    const restartbtn = document.getElementById("restartbtn");
    const startbtn = document.getElementById("startbtn");
    restartbtn.style.display = "none";
    startbtn.style.display = "block";

    score = initialScore;
    document.getElementById("score").innerHTML = score;

    changingDirectionFlag = false;
    speed = initialSpeed;
    growingTime = 0;
    scoreMultiplier = initialScoreMultiplier;
    tempTurnDirection = "";

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
    ctx.clearRect(0, 0, board.width, board.height);
}

// Fungsi game end
function game_end() {
    // Cek jika nabrak ruas snake
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    // Cek jika nabrak obstacle
    for (let i = 0; i < obstacle.length; i++) {
        if (obstacle[i].x === snake[0].x && obstacle[i].y === snake[0].y)
            return true;
    }

    return false;
}
