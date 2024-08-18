// Auto create obstacles model
function obsmod(model) {
    clearObstacle();

    if (model === 1) {
        // Surrounded by obstacles
        for (let i = 0; i < board.width; i += gridSize) {
            obstacle.push({ x: i, y: 0 });
            obstacle.push({ x: i, y: board.height - gridSize });
        }
        for (let i = 0; i < board.height; i += gridSize) {
            obstacle.push({ x: 0, y: i });
            obstacle.push({ x: board.width - gridSize, y: i });
        }
    } else if (model === 2) {
        // For every 4 grids, create an vertical line of obstacle, but add three grid gap in the middle
        for (let i = 0; i < board.width; i += gridSize * 4) {
            for (let j = 0; j < board.height; j += gridSize) {
                if (j < board.height * 0.3 || j > board.height * 0.7) {
                    obstacle.push({ x: i + gridSize * 4, y: j });
                    obstacle.push({ x: i + gridSize * 8, y: j });
                }
            }
        }
    }
    drawObs();
}
