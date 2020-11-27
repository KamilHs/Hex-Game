class Hexagon {
    constructor(x, y, a, row, col) {
        this.x = x;
        this.y = y;
        this.a = a;
        this.row = row;
        this.col = col;
        this.isEmpty = true;
        this.bgc = "white";
        this.initEdges();

    }
    initEdges() {
        // Top, right top, bottom right, bottom, left bottom, left top
        this.edges = [];
        let offset = -TWO_PI / 4;
        let angle = TWO_PI / 6;

        for (let i = 0; i < 6; i++) {
            this.edges[i] = {
                x: this.x + cos(offset + angle * i) * this.a,
                y: this.y + sin(offset + angle * i) * this.a,
            }
        }
    }

    draw(boardSize, verticalColor, horizontalColor) {
        fill(this.bgc);
        beginShape();
        this.edges.forEach(edge => vertex(edge.x, edge.y));
        endShape(CLOSE)


        strokeWeight(floor(this.a / 10) || 1)
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
            let x0 = this.edges[i].x;
            let y0 = this.edges[i].y;
            let x1 = this.edges[(i + 1) % 6].x;
            let y1 = this.edges[(i + 1) % 6].y;
            line(x0, y0, x1, y1);
        }
    }

    setColor(color) {
        this.bgc = color;
        this.isEmpty = false;
    }

    checkClick(x, y) {
        let m = this.a * Math.cos(Math.PI / 6);
        let d = Math.hypot(x - this.x, y - this.y);
        let a = Math.atan2(this.y - y, x - this.x);

        return (d <= (this.a + m) / 2 + Math.cos(a * 6) * (this.a - m) / 2) && this.isEmpty;
    }
}