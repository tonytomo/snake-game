// Colors
const board_bg = '#111';
const snake_col = '#00cc03';
const food_col = '#fff';
const obs_col = '#ad2a2a';

let snake = [
    { x: 600, y: 260 },
    { x: 620, y: 260 },
    { x: 640, y: 260 },
    { x: 660, y: 260 },
    { x: 680, y: 260 }
]

let obstacle = [];

let score = 0;          // Skor
let changing_direction = false;  // Flag arah (true jika berubah arah)
let gameplay = false;    // Flag jika game dimulai maka true

// Kecepatan x
let food_x;
let food_y;
let dx = -20;

// Kecepatan y
let dy = 0;

// Jika true, mulai menggambar
let isDrawing = false;
let x = 0;
let y = 0;

// Get canvas
const board = document.getElementById('board');
// Return 2d context
const ctx = board.getContext('2d');

document.addEventListener('keydown', change_direction);

// Restart function
function restart() {
    const restartbtn = document.getElementById('restartbtn');
    restartbtn.style.display = 'none';

    clear_board();

    snake = [
        { x: 600, y: 260 },
        { x: 620, y: 260 },
        { x: 640, y: 260 },
        { x: 660, y: 260 },
        { x: 680, y: 260 }
    ]

    score = 0;          // Skor
    changing_direction = false;  // Flag arah (true jika berubah arah)

    // Kecepatan x
    food_x;
    food_y;
    dx = -20;

    // Kecepatan y
    dy = 0;

    main();

    gen_food();
}

// Init function
function init() {
    const startbtn = document.getElementById('startbtn');
    startbtn.style.display = 'none';
    
    main();

    gen_food();
}

// Main function
function main() {
    const erasebtn = document.getElementById('erasebtn');
    gameplay = true;

    if (game_end()) {
        const restartbtn = document.getElementById('restartbtn');

        restartbtn.style.display = 'block';
        erasebtn.style.display = 'block';

        gameplay = false;

        return;
    }

    erasebtn.style.display = 'none';

    changing_direction = false;
    setTimeout(function onTick() {
        clear_board();
        drawFood();
        move();
        drawSnake();
        drawObs();
        console.log('Update board');

        // Ulang fungsi
        main();
    }, 75)
}

// Fungsi menghapus board
function clear_board() {
    ctx.clearRect(0, 0, board.width, board.height);
}

// Function clear obstacle
function clear_obstacle() {
    clear_board();
    snake = [
        { x: 600, y: 260 },
        { x: 620, y: 260 },
        { x: 640, y: 260 },
        { x: 660, y: 260 },
        { x: 680, y: 260 }
    ]
    obstacle = [];
    drawSnake();
}

// Event listener for draw obstacle
board.addEventListener('mousedown', e => {
    x = e.offsetX;
    y = e.offsetY;
    isDrawing = true;
});
board.addEventListener('mousemove', e => {
    if (isDrawing === true) {
        drawLineObs(ctx, x, y, e.offsetX, e.offsetY);
        x = e.offsetX;
        y = e.offsetY;
    }
});
window.addEventListener('mouseup', e => {
    if (isDrawing === true) {
        drawLineObs(ctx, x, y, e.offsetX, e.offsetY);
        x = 0;
        y = 0;
        isDrawing = false;
    }
});

// Menggambar obstacle
function drawLineObs(context, x1, y1, x2, y2) {
    // Mengubah x,y menjadi kelipatan 20
    const newX = x1 - (x1 % 20);
    const newY = y1 - (y1 % 20);
    let flag = false;

    // Jika tidak sedang main
    if (gameplay === false) {
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);

        // Mencegah obstacle berlipat di koordinat yang sama
        for (let i = 0; i < obstacle.length; i++) {
            if (obstacle[i].x === newX && obstacle[i].y === newY) {
                flag = true;
            }
        }
        if (flag === false) {
            obstacle.push({ x: newX, y: newY });
        }
        drawObs();
    }
}

// Menggambar snake ke board
function drawSnake() {
    // Menggambar setiap ruas
    snake.forEach(drawSnakePart)
}

// Menggambar setiap ruas
function drawSnakePart(snakePart) {
    // Mewarnai ruas
    ctx.fillStyle = snake_col;

    // Menggambar ruas
    ctx.fillRect(snakePart.x, snakePart.y, 20, 20);
}

// Menggambar snake ke board
function drawObs() {
    // Menggambar setiap ruas
    obstacle.forEach(drawObsPart)
}

// Menggambar setiap ruas
function drawObsPart(obsPart) {
    // Mewarnai ruas
    ctx.fillStyle = obs_col;

    // Menggambar ruas
    ctx.fillRect(obsPart.x, obsPart.y, 20, 20);
}


// Menggambar food
function drawFood() {
    ctx.fillStyle = food_col;
    ctx.fillRect(food_x, food_y, 20, 20);
}

// Fungsi game end
function game_end() {
    // Cek jika nabrak ruas snake
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    // Cek jika nabrak obstacle
    for (let i = 0; i < obstacle.length; i++) {
        if (obstacle[i].x === snake[0].x && obstacle[i].y === snake[0].y) return true;
    }

    return false;
}

// Fungsi lokasi acak food
function random_food(min, max) {
    return Math.round((Math.random() * (max - min) + min) / 20) * 20;
}

// Fungsi peletakan food
function gen_food() {
    // Generate random x food
    food_x = random_food(0, board.width - 20);

    // Generate random y food
    food_y = random_food(0, board.height - 20);

    // Jika letak food == snake, maka akan mengacak lagi
    snake.forEach(function has_snake_eaten_food(part) {
        const has_eaten = part.x == food_x && part.y == food_y;
        if (has_eaten) gen_food();
    });

    // Jika letak food == obstacle, maka akan mengacak lagi
    obstacle.forEach(function is_this_obstacle(part) {
        const its_obstacle = part.x == food_x && part.y == food_y;
        if (its_obstacle) gen_food();
    });
}

// Fungsi ganti arah
function change_direction(event) {
    const UP_KEY = 87;
    const DOWN_KEY = 83;
    const RIGHT_KEY = 68;
    const LEFT_KEY = 65;

    // Mencegah snake melawan arah
    if (changing_direction) return;
    changing_direction = true;
    const keyPressed = event.keyCode;
    const goUp = dy === -20;
    const goDown = dy === 20;
    const goRight = dx === 20;
    const goLeft = dx === -20;
    if (keyPressed === LEFT_KEY && !goRight) {
        dx = -20;
        dy = 0;
    }
    if (keyPressed === UP_KEY && !goDown) {
        dx = 0;
        dy = -20;
    }
    if (keyPressed === RIGHT_KEY && !goLeft) {
        dx = 20;
        dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goUp) {
        dx = 0;
        dy = 20;
    }
}

// Fungsi menjalankan snake
function move() {
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > board.width - 20;
    const hitTopWall = snake[0].y < 0;
    const hitBotWall = snake[0].y > board.height - 20;

    // Membuat head baru
    let head = { x: snake[0].x + dx, y: snake[0].y + dy };
    if (hitLeftWall) {
        head = { x: board.width - 20, y: snake[0].y + dy };
    }
    if (hitRightWall) {
        head = { x: 0, y: snake[0].y + dy };
    }
    if (hitTopWall) {
        head = { x: snake[0].x + dx, y: board.height - 20 };
    }
    if (hitBotWall) {
        head = { x: snake[0].x + dx, y: 0 };
    }
    

    // Menambah head ke depan (awal array)
    snake.unshift(head);

    const has_eaten_food = snake[0].x === food_x && snake[0].y === food_y;

    // Jika snake sudah makan
    if (has_eaten_food) {
        // Tambah skor
        score += 20;

        // Menampilkan skor ke html
        document.getElementById('score').innerHTML = score;

        // Mengenerate lokasi food baru
        gen_food();
    } else {
        // Menghapus ruas terakhir snake
        snake.pop();

    }
}