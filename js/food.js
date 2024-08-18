// Initial variables
const food_col = "#b3bb40";
const foodStroke_col = "#bb8a40";
const scoreAdder = 500; // Score adder, the bigger the score adder, the bigger the score
const initialScoreMultiplier = 30; // Score multiplier, the faster get the food, the bigger

// Food variables
var scoreMultiplier = initialScoreMultiplier;
var food = { x: 0, y: 0 };

/**
 * Draw food on the board
 */
function drawFood() {
    ctx.fillStyle = foodStroke_col;
    ctx.fillRect(
        food.x + gridSize / 5,
        food.y + gridSize / 5,
        gridSize * 0.5,
        gridSize * 0.5
    );
    ctx.fillStyle = food_col;
    ctx.fillRect(
        food.x + gridSize / 3,
        food.y + gridSize / 3,
        gridSize * 0.25,
        gridSize * 0.25
    );
}

/**
 * Randomize the food location
 */
function randomFood(min, max) {
    return (
        Math.round((Math.random() * (max - min) + min) / gridSize) * gridSize
    );
}

/**
 * Generate food on the board
 */
function genFood() {
    // Generate random x food
    food.x = randomFood(0, board.width - gridSize);

    // Generate random y food
    food.y = randomFood(0, board.height - gridSize);

    // Jika letak food == snake, maka akan mengacak lagi
    snake.forEach(function has_snake_eaten_food(part) {
        const has_eaten = part.x == food.x && part.y == food.y;
        if (has_eaten) genFood();
    });

    // Jika letak food == obstacle, maka akan mengacak lagi
    obstacle.forEach(function is_this_obstacle(part) {
        const its_obstacle = part.x == food.x && part.y == food.y;
        if (its_obstacle) genFood();
    });
}

/**
 * Decrease the score multiplier
 */
function decreaseMultiplier() {
    if (scoreMultiplier > 1) {
        scoreMultiplier -= 0.2;
    }
}
