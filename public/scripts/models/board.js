class Board {
    constructor(size) {
        this.size = size;
        this.initHexagons();
    }

    initHexagons() {
        this.hexagons = [];
        for (let i = 0; i < this.size; i++) {
            let dx = (width > height ? height : width) * 0.65 / (this.size);
            let side = dx * sin(PI / 6) / sin(2 * PI / 3);
            let dy = side + ((dx / 2) * sin(PI / 6) / sin(PI / 3));

            let offsetX = ((width - (dx * this.size)) - (dx * (this.size - 1) / 2) + dx) / 2;
            let offsetY = (height - dy * (this.size - 1)) / 2;

            let curX = offsetX;
            let curY = offsetY;
            for (let i = 0; i < this.size; i++) {
                this.hexagons[i] = [];
                curX = offsetX + i * dx / 2;
                for (let j = 0; j < this.size; j++) {
                    this.hexagons[i][j] = new Hexagon(curX, curY, side, i, j);
                    curX += dx;
                }
                curY += dy;
            }
        }
    }

    draw() {
        this.hexagons.forEach(row => row.forEach(hex => hex.draw()));
    }

    setCellData(row, col, data) {
        this.hexagons[row][col].setData(data);
    }

    checkCellClick(row, col, x, y) {
        return this.hexagons[row][col].checkClick(x, y)
    }
}