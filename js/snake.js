// Initial variable
const maxGrowingTime = 2;
const initialSpeed = 10;
const snake_col = "#00cc03";
const snakeStroke_col = "#000";

// Initialize variables
var speed = initialSpeed;
var changingDirectionFlag = false; // Flag to check if the snake is changing direction
var tempTurnDirection = ""; // Temporary direction to turn
var growingTime = 0; // Time to grow

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
    startPointX = Math.round((window.innerWidth * 0.2) / 10) * 20,
    startPointY = window.innerWidth < 600
        ? Math.round((window.innerHeight * 0.1) / 10) * 20
        : Math.round((window.innerHeight * 0.2) / 10) * 20,
    snakeLength = 5,
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
    reverseSnake.forEach(drawSnakePart);
}

/**
 * Draw one snake part
 *
 * @param {object} snakePart
 */
function drawSnakePart(snakePart) {
    ctx.fillStyle = snake_col;
    ctx.fillRect(snakePart.x, snakePart.y, gridSize, gridSize);
    ctx.strokeStyle = snakeStroke_col;
    ctx.strokeRect(snakePart.x, snakePart.y, gridSize, gridSize);
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
    const goUp = dy === -speed;
    const goDown = dy === speed;
    const goRight = dx === speed;
    const goLeft = dx === -speed;
    if (LEFT_KEY.includes(keyPressed) && !goRight) {
        tempTurnDirection = "left";
    }
    if (UP_KEY.includes(keyPressed) && !goDown) {
        tempTurnDirection = "up";
    }
    if (RIGHT_KEY.includes(keyPressed) && !goLeft) {
        tempTurnDirection = "right";
    }
    if (DOWN_KEY.includes(keyPressed) && !goUp) {
        tempTurnDirection = "down";
    }
}

/**
 * Change the snake's direction
 */
function changeDirection() {
    let inGrid = snake[0].x % gridSize === 0 && snake[0].y % gridSize === 0;

    if (inGrid) {
        if (tempTurnDirection === "left") {
            dx = -speed;
            dy = 0;
        }
        if (tempTurnDirection === "up") {
            dx = 0;
            dy = -speed;
        }
        if (tempTurnDirection === "right") {
            dx = speed;
            dy = 0;
        }
        if (tempTurnDirection === "down") {
            dx = 0;
            dy = speed;
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
        let scorePlus = Math.round(scoreAdder * scoreMultiplier);
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
