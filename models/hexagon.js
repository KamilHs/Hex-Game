class Hexagon {
    constructor(row, col, color) {
        this.row = row;
        this.col = col;
        this.color = color;
    }

    setColor(color) {
        this.color = color;
    }

    getColor() {
        return this.color;
    }
}

module.exports = Hexagon;