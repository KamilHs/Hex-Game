const Hexagon = require("./hexagon");
const config = require("../config");

class Board {
    constructor() {
        this.size = config.boardSize;
        this.turn = 0;
        this.initHexagons();
    }
    initHexagons() {
        this.hexagons = [];

        for (let i = 0; i < this.size; i++) {
            this.hexagons[i] = [];
            for (let j = 0; j < this.size; j++) {
                this.hexagons[i][j] = new Hexagon(i, j, config.emptyBackground)
            }
        }
    }

    getTurn() {
        return this.turn;
    }

    makeTurn({ row, col }) {
        this.hexagons[row][col].setColor(this.turn++ % 2);
    }

    isCellEmpty({ row, col }) {
        return this.hexagons[row][col].isEmpty();
    }

    getData() {
        const data = [];

        for (let i = 0; i < this.size; i++) {
            data[i] = [];
            for (let j = 0; j < this.size; j++) {
                data[i][j] = this.hexagons[i][j].getData();
            }
        }
        return data;
    }
}


module.exports = Board;