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
            for (let j = 0; j < this.size; j++) {
                this.hexagons[i][j] = new Hexagon(i, j, config.emptyBackground)
            }
        }
    }
}


module.exports = Board;