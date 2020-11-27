class Hexagon {
    constructor(x, y, a, row, col) {
        this.x = x;
        this.y = y;
        this.a = a;
        this.row = row;
        this.col = col;
    }

    draw(boardSize, verticalColor, horizontalColor) {
        strokeWeight(floor(this.a / 10) || 1)
        let angle = TWO_PI / 6;
        let offset = -TWO_PI / 4;
        for (let i = 0; i < 6; i++) {
            //Coloring edge sides
            if (
                (this.row == boardSize - 1 && (i == 2 || i == 3)) ||
                (this.row == 0 && (i == 0 || i == 5))) {
                stroke(verticalColor);
            }
            else if (
                (this.col == boardSize - 1 && (i == 0 || i == 1)) ||
                (this.col == 0 && (i == 3 || i == 4))) {
                stroke(horizontalColor);
            }
            else {
                stroke(0);
            }
            let x0 = this.x + cos(offset + angle * i) * this.a;
            let y0 = this.y + sin(offset + angle * i) * this.a;
            let x1 = this.x + cos(offset + angle * (i + 1)) * this.a;
            let y1 = this.y + sin(offset + angle * (i + 1)) * this.a;
            line(x0, y0, x1, y1);
        }
    }
}