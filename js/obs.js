// Initial variables
const obs_col = "#ad2a2a";
const obs_col2 = "#4d3e15";
const obs_col3 = "#2f4d2f";

// Obstacle variables
var isDrawing = false; // Flag to check if the user is drawing
var x = 0;
var y = 0;

// Obstacle array
var obstacle = [];

/**
 * Clear the obstacle from the board
 */
function clearObstacle() {
    clearBoard();
    createNewSnake();
    obstacle = [];
    drawSnake();

    if (obstacle.length === 0) eraseButton.disabled = true;
}

/**
 * Create a new obstacle by drawing on the board
 */
board.addEventListener("mousedown", (e) => {
    x = e.offsetX;
    y = e.offsetY;
    isDrawing = true;
});
board.addEventListener("mousemove", (e) => {
    if (isDrawing === true) {
        drawLineObs(ctx, x, y, e.offsetX, e.offsetY);
        x = e.offsetX;
        y = e.offsetY;
    }
});
window.addEventListener("mouseup", (e) => {
    if (isDrawing === true) {
        drawLineObs(ctx, x, y, e.offsetX, e.offsetY);
        x = 0;
        y = 0;
        isDrawing = false;
    }
});

/**
 * Draw a line obstacle on the board
 *
 * @param {any} context
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 */
function drawLineObs(context, x1, y1, x2, y2) {
    // Get the new x and y coordinate
    const newX = x1 - (x1 % gridSize);
    const newY = y1 - (y1 % gridSize);

    // Check if the game is not running
    if (gameplay === false) {
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        let flag = false;

        // Check if the obstacle is not on other obstacles
        for (let i = 0; i < obstacle.length; i++) {
            if (obstacle[i].x === newX && obstacle[i].y === newY) {
                flag = true;
            }
        }
        if (flag === false) {
            obstacle.push({ x: newX, y: newY });
        }

        // Draw the obstacles
        drawObs();
    }
}

/**
 * Draw the obstacles on the board
 */
function drawObs() {
    obstacle.forEach(drawObsPart);

    if (obstacle.length > 0) eraseButton.disabled = false;
}

/**
 * Draw one obstacle part
 * @param {object} obsPart
 */
function drawObsPart(obsPart) {
    // Create a brick wall in one grid just using fillRect and 3 different colors
    // Make it 3 layers to make it look like a brick wall
    ctx.fillStyle = obs_col;
    ctx.fillRect(obsPart.x, obsPart.y, gridSize, gridSize / 3);
    ctx.fillStyle = obs_col2;
    ctx.fillRect(obsPart.x, obsPart.y + gridSize / 3, gridSize, gridSize / 3);
    ctx.fillStyle = obs_col3;
    ctx.fillRect(
        obsPart.x,
        obsPart.y + (gridSize * 2) / 3,
        gridSize,
        gridSize / 3
    );
}
