const config = require("../config");

class Hexagon {
    constructor(row, col, color) {
        this.row = row;
        this.col = col;
        this.color = color;
        this.empty = true;
    }

    setColor(color) {
        this.empty = false;
        this.color = color;
    }

    getColor() {
        return this.color;
    }

    isEmpty() {
        return this.empty;
    }

    getData() {
        return {
            empty: this.empty,
            color: this.color
        }
    }
}

module.exports = Hexagon;