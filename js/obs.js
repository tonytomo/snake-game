// Initial variables
const obs_col = "#ad2a2a";

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
    let flag = false;

    // Check if the game is not running
    if (gameplay === false) {
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);

        // Check if the obstacle is not on other obstacles
        for (let i = 0; i < obstacle.length; i++) {
            if (!obstacle[i].x === newX || !obstacle[i].y === newY) {
                obstacle.push({ x: newX, y: newY });
            }
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
}

/**
 * Draw one obstacle part
 * @param {object} obsPart
 */
function drawObsPart(obsPart) {
    ctx.fillStyle = obs_col;
    ctx.fillRect(obsPart.x, obsPart.y, gridSize, gridSize);
}
