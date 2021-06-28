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
    const restartbtn = document.getElementById('restartbtn');
    const obsmodbtn = document.querySelectorAll('#obsbtn');
    gameplay = true;

    if (game_end()) {
        restartbtn.style.display = 'block';
        erasebtn.style.display = 'block';
        for (let i = 0; i < obsmodbtn.length; i++) {
            obsmodbtn[i].style.display = 'block';
        }

        gameplay = false;

        return;
    }

    erasebtn.style.display = 'none';
    for (let i = 0; i < obsmodbtn.length; i++) {
        obsmodbtn[i].style.display = 'none';
    }

    changing_direction = false;
    setTimeout(function onTick() {
        clear_board();
        drawFood();
        move();
        drawSnake();
        drawObs();

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
            console.log('{ x: ' + newX + ', y: ' + newY + ' },');
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

// Auto create obstacles model
function obsmod(model) {
    clear_obstacle();

    if (model === 1) {
        // Model 1
        // // Left
        // for (let i = 0; i < board.height - 20; i+=20) {
        //     obstacle.push({ x: 0, y: i });
        // }
        // // Right
        // for (let i = 0; i < board.height - 20; i+=20) {
        //     obstacle.push({ x: board.width - 20, y: i });
        // }
        // // Top
        // for (let i = 20; i < board.height - 40; i+=20) {
        //     obstacle.push({ x: i, y: 0 });
        // }
        // // Bottom
        // for (let i = 20; i < board.height - 40; i+=20) {
        //     obstacle.push({ x: i, y: board.height - 20 });
        // }
        obstacle = [
            { x: 0, y: 0 },
            { x: 0, y: 20 },
            { x: 0, y: 40 },
            { x: 0, y: 60 },
            { x: 0, y: 80 },
            { x: 0, y: 100 },
            { x: 0, y: 120 },
            { x: 0, y: 140 },
            { x: 0, y: 160 },
            { x: 0, y: 180 },
            { x: 0, y: 200 },
            { x: 0, y: 220 },
            { x: 0, y: 240 },
            { x: 0, y: 260 },
            { x: 0, y: 280 },
            { x: 0, y: 300 },
            { x: 0, y: 320 },
            { x: 0, y: 340 },
            { x: 0, y: 360 },
            { x: 0, y: 380 },
            { x: 0, y: 400 },
            { x: 0, y: 420 },
            { x: 0, y: 440 },
            { x: 0, y: 460 },
            { x: 0, y: 480 },
            { x: 0, y: 500 },
            { x: 20, y: 500 },
            { x: 40, y: 500 },
            { x: 60, y: 500 },
            { x: 80, y: 500 },
            { x: 100, y: 500 },
            { x: 120, y: 500 },
            { x: 140, y: 500 },
            { x: 160, y: 500 },
            { x: 180, y: 500 },
            { x: 200, y: 500 },
            { x: 220, y: 500 },
            { x: 240, y: 500 },
            { x: 260, y: 500 },
            { x: 280, y: 500 },
            { x: 300, y: 500 },
            { x: 320, y: 500 },
            { x: 340, y: 500 },
            { x: 360, y: 500 },
            { x: 380, y: 500 },
            { x: 400, y: 500 },
            { x: 420, y: 500 },
            { x: 440, y: 500 },
            { x: 460, y: 500 },
            { x: 480, y: 500 },
            { x: 500, y: 500 },
            { x: 520, y: 500 },
            { x: 540, y: 500 },
            { x: 560, y: 500 },
            { x: 580, y: 500 },
            { x: 600, y: 500 },
            { x: 620, y: 500 },
            { x: 640, y: 500 },
            { x: 660, y: 500 },
            { x: 680, y: 500 },
            { x: 700, y: 500 },
            { x: 720, y: 500 },
            { x: 740, y: 500 },
            { x: 760, y: 500 },
            { x: 780, y: 500 },
            { x: 800, y: 500 },
            { x: 820, y: 500 },
            { x: 840, y: 500 },
            { x: 860, y: 500 },
            { x: 880, y: 500 },
            { x: 900, y: 500 },
            { x: 920, y: 500 },
            { x: 940, y: 500 },
            { x: 960, y: 500 },
            { x: 980, y: 500 },
            { x: 1000, y: 500 },
            { x: 1020, y: 500 },
            { x: 1040, y: 500 },
            { x: 1060, y: 500 },
            { x: 1080, y: 500 },
            { x: 1100, y: 500 },
            { x: 1120, y: 500 },
            { x: 1140, y: 500 },
            { x: 1160, y: 500 },
            { x: 1180, y: 500 },
            { x: 1180, y: 480 },
            { x: 1180, y: 460 },
            { x: 1180, y: 440 },
            { x: 1180, y: 420 },
            { x: 1180, y: 400 },
            { x: 1180, y: 380 },
            { x: 1180, y: 360 },
            { x: 1180, y: 340 },
            { x: 1180, y: 320 },
            { x: 1180, y: 300 },
            { x: 1180, y: 280 },
            { x: 1180, y: 260 },
            { x: 1180, y: 240 },
            { x: 1180, y: 220 },
            { x: 1180, y: 200 },
            { x: 1180, y: 180 },
            { x: 1180, y: 160 },
            { x: 1180, y: 140 },
            { x: 1180, y: 120 },
            { x: 1180, y: 100 },
            { x: 1180, y: 80 },
            { x: 1180, y: 60 },
            { x: 1180, y: 20 },
            { x: 1180, y: 0 },
            { x: 1180, y: 40 },
            { x: 1160, y: 0 },
            { x: 1140, y: 0 },
            { x: 1120, y: 0 },
            { x: 1100, y: 0 },
            { x: 1080, y: 0 },
            { x: 1060, y: 0 },
            { x: 1040, y: 0 },
            { x: 1020, y: 0 },
            { x: 1000, y: 0 },
            { x: 980, y: 0 },
            { x: 960, y: 0 },
            { x: 940, y: 0 },
            { x: 920, y: 0 },
            { x: 900, y: 0 },
            { x: 880, y: 0 },
            { x: 860, y: 0 },
            { x: 840, y: 0 },
            { x: 820, y: 0 },
            { x: 800, y: 0 },
            { x: 780, y: 0 },
            { x: 760, y: 0 },
            { x: 740, y: 0 },
            { x: 720, y: 0 },
            { x: 700, y: 0 },
            { x: 680, y: 0 },
            { x: 660, y: 0 },
            { x: 640, y: 0 },
            { x: 620, y: 0 },
            { x: 600, y: 0 },
            { x: 580, y: 0 },
            { x: 560, y: 0 },
            { x: 540, y: 0 },
            { x: 520, y: 0 },
            { x: 500, y: 0 },
            { x: 480, y: 0 },
            { x: 460, y: 0 },
            { x: 440, y: 0 },
            { x: 420, y: 0 },
            { x: 400, y: 0 },
            { x: 380, y: 0 },
            { x: 360, y: 0 },
            { x: 340, y: 0 },
            { x: 320, y: 0 },
            { x: 300, y: 0 },
            { x: 280, y: 0 },
            { x: 260, y: 0 },
            { x: 240, y: 0 },
            { x: 220, y: 0 },
            { x: 200, y: 0 },
            { x: 180, y: 0 },
            { x: 160, y: 0 },
            { x: 140, y: 0 },
            { x: 120, y: 0 },
            { x: 100, y: 0 },
            { x: 80, y: 0 },
            { x: 60, y: 0 },
            { x: 40, y: 0 },
            { x: 20, y: 0 }
        ];

    } else if (model === 2) {
        // Model 2
        obstacle = [
            { x: 0, y: 200 },
            { x: 20, y: 200 },
            { x: 40, y: 200 },
            { x: 60, y: 200 },
            { x: 80, y: 200 },
            { x: 100, y: 200 },
            { x: 120, y: 200 },
            { x: 140, y: 200 },
            { x: 160, y: 200 },
            { x: 180, y: 200 },
            { x: 200, y: 200 },
            { x: 220, y: 200 },
            { x: 240, y: 200 },
            { x: 260, y: 200 },
            { x: 280, y: 200 },
            { x: 300, y: 200 },
            { x: 320, y: 200 },
            { x: 340, y: 200 },
            { x: 360, y: 200 },
            { x: 520, y: 0 },
            { x: 520, y: 20 },
            { x: 520, y: 40 },
            { x: 520, y: 60 },
            { x: 520, y: 80 },
            { x: 520, y: 100 },
            { x: 520, y: 120 },
            { x: 520, y: 140 },
            { x: 520, y: 160 },
            { x: 520, y: 180 },
            { x: 520, y: 200 },
            { x: 660, y: 200 },
            { x: 660, y: 180 },
            { x: 660, y: 160 },
            { x: 660, y: 140 },
            { x: 660, y: 120 },
            { x: 660, y: 100 },
            { x: 660, y: 80 },
            { x: 660, y: 60 },
            { x: 660, y: 40 },
            { x: 660, y: 20 },
            { x: 660, y: 0 },
            { x: 760, y: 200 },
            { x: 780, y: 200 },
            { x: 800, y: 200 },
            { x: 820, y: 200 },
            { x: 840, y: 200 },
            { x: 860, y: 200 },
            { x: 880, y: 200 },
            { x: 900, y: 200 },
            { x: 920, y: 200 },
            { x: 940, y: 200 },
            { x: 960, y: 200 },
            { x: 980, y: 200 },
            { x: 1000, y: 200 },
            { x: 1020, y: 200 },
            { x: 1040, y: 200 },
            { x: 1060, y: 200 },
            { x: 1080, y: 200 },
            { x: 1100, y: 200 },
            { x: 1120, y: 200 },
            { x: 1140, y: 200 },
            { x: 1160, y: 200 },
            { x: 1180, y: 200 },
            { x: 660, y: 300 },
            { x: 660, y: 320 },
            { x: 660, y: 340 },
            { x: 660, y: 360 },
            { x: 660, y: 380 },
            { x: 660, y: 400 },
            { x: 660, y: 420 },
            { x: 660, y: 440 },
            { x: 660, y: 460 },
            { x: 660, y: 480 },
            { x: 660, y: 500 },
            { x: 760, y: 300 },
            { x: 780, y: 300 },
            { x: 800, y: 300 },
            { x: 820, y: 300 },
            { x: 840, y: 300 },
            { x: 860, y: 300 },
            { x: 880, y: 300 },
            { x: 900, y: 300 },
            { x: 920, y: 300 },
            { x: 940, y: 300 },
            { x: 960, y: 300 },
            { x: 980, y: 300 },
            { x: 1000, y: 300 },
            { x: 1020, y: 300 },
            { x: 1040, y: 300 },
            { x: 1060, y: 300 },
            { x: 1080, y: 300 },
            { x: 1100, y: 300 },
            { x: 1120, y: 300 },
            { x: 1140, y: 300 },
            { x: 1160, y: 300 },
            { x: 1180, y: 300 },
            { x: 520, y: 300 },
            { x: 520, y: 320 },
            { x: 520, y: 340 },
            { x: 520, y: 360 },
            { x: 520, y: 380 },
            { x: 520, y: 400 },
            { x: 520, y: 420 },
            { x: 520, y: 440 },
            { x: 520, y: 460 },
            { x: 520, y: 480 },
            { x: 520, y: 500 },
            { x: 380, y: 200 },
            { x: 400, y: 200 },
            { x: 400, y: 300 },
            { x: 380, y: 300 },
            { x: 360, y: 300 },
            { x: 340, y: 300 },
            { x: 320, y: 300 },
            { x: 300, y: 300 },
            { x: 280, y: 300 },
            { x: 260, y: 300 },
            { x: 240, y: 300 },
            { x: 220, y: 300 },
            { x: 200, y: 300 },
            { x: 180, y: 300 },
            { x: 160, y: 300 },
            { x: 140, y: 300 },
            { x: 120, y: 300 },
            { x: 100, y: 300 },
            { x: 80, y: 300 },
            { x: 60, y: 300 },
            { x: 40, y: 300 },
            { x: 20, y: 300 },
            { x: 0, y: 300 }
        ]
    } else if (model === 3) {
        // Model 3
        obstacle = [
            { x: 80, y: 200 },
            { x: 80, y: 180 },
            { x: 80, y: 160 },
            { x: 80, y: 140 },
            { x: 80, y: 120 },
            { x: 80, y: 100 },
            { x: 80, y: 80 },
            { x: 80, y: 60 },
            { x: 100, y: 60 },
            { x: 120, y: 60 },
            { x: 140, y: 60 },
            { x: 160, y: 60 },
            { x: 180, y: 60 },
            { x: 200, y: 60 },
            { x: 220, y: 60 },
            { x: 80, y: 320 },
            { x: 80, y: 340 },
            { x: 80, y: 360 },
            { x: 80, y: 380 },
            { x: 80, y: 400 },
            { x: 80, y: 420 },
            { x: 80, y: 440 },
            { x: 100, y: 440 },
            { x: 120, y: 440 },
            { x: 140, y: 440 },
            { x: 160, y: 440 },
            { x: 180, y: 440 },
            { x: 200, y: 440 },
            { x: 220, y: 440 },
            { x: 240, y: 440 },
            { x: 240, y: 60 },
            { x: 940, y: 60 },
            { x: 960, y: 60 },
            { x: 980, y: 60 },
            { x: 1000, y: 60 },
            { x: 1020, y: 60 },
            { x: 1040, y: 60 },
            { x: 1060, y: 60 },
            { x: 1080, y: 60 },
            { x: 1100, y: 60 },
            { x: 1100, y: 80 },
            { x: 1100, y: 100 },
            { x: 1100, y: 120 },
            { x: 1100, y: 140 },
            { x: 1100, y: 160 },
            { x: 1100, y: 180 },
            { x: 1100, y: 200 },
            { x: 1100, y: 300 },
            { x: 1100, y: 320 },
            { x: 1100, y: 340 },
            { x: 1100, y: 360 },
            { x: 1100, y: 380 },
            { x: 1100, y: 400 },
            { x: 1100, y: 420 },
            { x: 1100, y: 440 },
            { x: 1080, y: 440 },
            { x: 1060, y: 440 },
            { x: 1040, y: 440 },
            { x: 1020, y: 440 },
            { x: 1000, y: 440 },
            { x: 980, y: 440 },
            { x: 960, y: 440 },
            { x: 940, y: 440 },
            { x: 920, y: 440 },
            { x: 900, y: 440 },
            { x: 920, y: 60 },
            { x: 900, y: 60 },
            { x: 360, y: 220 },
            { x: 360, y: 200 },
            { x: 360, y: 180 },
            { x: 360, y: 160 },
            { x: 380, y: 160 },
            { x: 400, y: 160 },
            { x: 420, y: 160 },
            { x: 440, y: 160 },
            { x: 460, y: 160 },
            { x: 480, y: 160 },
            { x: 500, y: 160 },
            { x: 520, y: 160 },
            { x: 540, y: 160 },
            { x: 560, y: 160 },
            { x: 580, y: 160 },
            { x: 600, y: 160 },
            { x: 620, y: 160 },
            { x: 640, y: 160 },
            { x: 660, y: 160 },
            { x: 680, y: 160 },
            { x: 700, y: 160 },
            { x: 720, y: 160 },
            { x: 740, y: 160 },
            { x: 760, y: 160 },
            { x: 780, y: 160 },
            { x: 780, y: 180 },
            { x: 780, y: 200 },
            { x: 360, y: 300 },
            { x: 360, y: 320 },
            { x: 360, y: 340 },
            { x: 360, y: 360 },
            { x: 380, y: 360 },
            { x: 400, y: 360 },
            { x: 420, y: 360 },
            { x: 440, y: 360 },
            { x: 460, y: 360 },
            { x: 480, y: 360 },
            { x: 500, y: 360 },
            { x: 520, y: 360 },
            { x: 540, y: 360 },
            { x: 560, y: 360 },
            { x: 580, y: 360 },
            { x: 600, y: 360 },
            { x: 620, y: 360 },
            { x: 640, y: 360 },
            { x: 660, y: 360 },
            { x: 680, y: 360 },
            { x: 700, y: 360 },
            { x: 720, y: 360 },
            { x: 740, y: 360 },
            { x: 760, y: 360 },
            { x: 780, y: 360 },
            { x: 780, y: 340 },
            { x: 780, y: 320 },
            { x: 780, y: 300 },
            { x: 780, y: 220 }
        ]
    }
    drawObs();
}