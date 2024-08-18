// Initial variable
const maxGrowingTime = 10;
const initialSpeed = 3;
const initialSnakeLength = 20;
const snake_col = "#00cc03";
const snakeBody_col = "#096e0a";
const snakeEye_col = "#fff";

// Initialize variables
var speed = initialSpeed;
var changingDirectionFlag = false; // Flag to check if the snake is changing direction
var tempTurnDirection = []; // Temporary direction to turn
var growingTime = 0; // Time to grow
var scorePlus = 0; // Score plus

// Snake variables
var snake = [];
var dx = -speed;
var dy = 0;

// Listen to keydown event
document.addEventListener("keydown", changeDirectionInput);

/**
 * Create a new snake
 *
 * @param {number} startPointX
 * @param {number} startPointY
 * @param {number} snakeLength
 * @param {number} snakeSpeed
 */
function createNewSnake(
    startPointX = Math.round((window.innerWidth * 0.2) / (gridSize / 2)) *
        gridSize,
    startPointY = window.innerWidth < 600
        ? Math.round((window.innerHeight * 0.1) / (gridSize / 2)) * gridSize
        : Math.round((window.innerHeight * 0.2) / (gridSize / 2)) * gridSize,
    snakeLength = initialSnakeLength,
    snakeSpeed = initialSpeed
) {
    snake = [];
    for (let i = 0; i < snakeLength; i++) {
        snake.push({
            x: startPointX + i * snakeSpeed,
            y: startPointY,
        });
    }
}

/**
 * Draw the snake on the canvas
 */
function drawSnake() {
    let reverseSnake = snake.slice().reverse();

    for (let i = 1; i < reverseSnake.length; i++) {
        drawSnakePart(reverseSnake[i]);
    }

    // Make the head bigger
    ctx.fillStyle = snake_col;
    ctx.fillRect(
        snake[0].x + gridSize / 15,
        snake[0].y + gridSize / 15,
        gridSize * 0.9,
        gridSize * 0.9
    );

    const goUp = dy === -speed;
    const goDown = dy === speed;
    const goRight = dx === speed;
    const goLeft = dx === -speed;

    // Draw the snake's face
    ctx.fillStyle = snakeEye_col;
    ctx.fillRect(
        snake[0].x + gridSize / 2 - gridSize / 20,
        snake[0].y + gridSize / 2,
        gridSize / 8,
        gridSize / 8
    );
    ctx.fillRect(
        snake[0].x + gridSize / 2 - gridSize / 20,
        snake[0].y + gridSize / 4,
        gridSize / 8,
        gridSize / 8
    );
}

/**
 * Draw one snake part
 *
 * @param {object} snakePart
 */
function drawSnakePart(snakePart) {
    ctx.fillStyle = snakeBody_col;
    ctx.fillRect(
        snakePart.x + gridSize / 10,
        snakePart.y + gridSize / 10,
        gridSize * 0.8,
        gridSize * 0.8
    );
}

/**
 * Change the snake's direction
 */
function changeDirectionInput(event) {
    const UP_KEY = [87, 38]; // W or Up arrow
    const DOWN_KEY = [83, 40]; // S or Down arrow
    const RIGHT_KEY = [68, 39]; // D or Right arrow
    const LEFT_KEY = [65, 37]; // A or Left arrow

    /**
     * Prevent the snake from reversing
     */
    if (changingDirectionFlag) return;

    changingDirectionFlag = true;
    const keyPressed = event.keyCode;

    if (LEFT_KEY.includes(keyPressed)) {
        tempTurnDirection.push("left");
    }
    if (UP_KEY.includes(keyPressed)) {
        tempTurnDirection.push("up");
    }
    if (RIGHT_KEY.includes(keyPressed)) {
        tempTurnDirection.push("right");
    }
    if (DOWN_KEY.includes(keyPressed)) {
        tempTurnDirection.push("down");
    }

    // Remove the first element if it's more than 2
    if (tempTurnDirection.length > 2) {
        tempTurnDirection.shift();
    }
}

/**
 * Change the snake's direction
 */
function changeDirection() {
    let inGrid = snake[0].x % gridSize === 0 && snake[0].y % gridSize === 0;

    const goUp = dy === -speed;
    const goDown = dy === speed;
    const goRight = dx === speed;
    const goLeft = dx === -speed;

    if (inGrid) {
        if (tempTurnDirection[0] === "left" && !goRight) {
            dx = -speed;
            dy = 0;
            tempTurnDirection.shift();
        }
        if (tempTurnDirection[0] === "up" && !goDown) {
            dx = 0;
            dy = -speed;
            tempTurnDirection.shift();
        }
        if (tempTurnDirection[0] === "right" && !goLeft) {
            dx = speed;
            dy = 0;
            tempTurnDirection.shift();
        }
        if (tempTurnDirection[0] === "down" && !goUp) {
            dx = 0;
            dy = speed;
            tempTurnDirection.shift();
        }
    }
}

/**
 * Move the snake
 */
function move() {
    // Create the new Snake's head in the direction of movement
    let head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Check if the snake hits the wall
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > board.width - gridSize;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > board.height - gridSize;

    if (hitLeftWall) {
        head = { x: board.width - gridSize, y: snake[0].y + dy };
    }
    if (hitRightWall) {
        head = { x: 0, y: snake[0].y + dy };
    }
    if (hitTopWall) {
        head = { x: snake[0].x + dx, y: board.height - gridSize };
    }
    if (hitBottomWall) {
        head = { x: snake[0].x + dx, y: 0 };
    }

    // Add the new head to the beginning of snake body
    snake.unshift(head);

    // Check if the snake eats the food
    const has_eaten_food =
        snake[0].x > food.x - gridSize &&
        snake[0].x < food.x + gridSize &&
        snake[0].y > food.y - gridSize &&
        snake[0].y < food.y + gridSize;

    // If the snake eats the food
    if (has_eaten_food) {
        // Start growing the snake
        growingTime = maxGrowingTime;

        // Increase the score
        scorePlus = Math.round(scoreAdder * scoreMultiplier);
        logBox.innerHTML = `<i class="gg-info"></i> Score +${scorePlus}`;
        score += scorePlus;
        scoreMultiplier = initialScoreMultiplier;

        // Display the score
        document.getElementById("score").innerHTML = score;

        // Generate new food
        genFood();
    } else {
        // Remove the last part of the snake body if it doesn't eat the food and not growing
        if (growingTime === 0) {
            snake.pop();
        } else {
            growingTime--;
        }
    }
}

/**
 * Control the snake via touch
 */
function goUp() {
    if (dy === speed) return;
    dx = 0;
    dy = -speed;
}

function goDown() {
    if (dy === -speed) return;
    dx = 0;
    dy = speed;
}

function goRight() {
    if (dx === -speed) return;
    dx = speed;
    dy = 0;
}

function goLeft() {
    if (dx === speed) return;
    dx = -speed;
    dy = 0;
}
