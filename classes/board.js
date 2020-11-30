const Hexagon = require("./hexagon");

class Board {
    constructor(config) {
        this.config = config;
        this.turn = 0;
        this.finished = false;
        this.initHexagons();
    }
    initHexagons() {
        this.hexagons = [];
        for (let i = 0; i < this.config.boardSize; i++) {
            this.hexagons[i] = [];
            for (let j = 0; j < this.config.boardSize; j++) {
                this.hexagons[i][j] = new Hexagon(i, j, this.config.emptyBackground)
            }
        }
    }

    getConfig() {
        return this.config;
    }

    getTurn() {
        return this.turn;
    }


    makeTurn({ row, col }) {
        this.hexagons[row][col].setColor(this.getCurrentPlayerColor());
    }

    getCurrentPlayerColor() {
        return this.turn % 2 ? this.config.secondPlayerColor : this.config.firstPlayerColor;
    }
    getNotCurrentPlayerColor() {
        return this.turn % 2 ? this.config.firstPlayerColor : this.config.secondPlayerColor;
    }

    isCellEmpty({ row, col }) {
        return this.hexagons[row][col].isEmpty();
    }

    getData() {
        const data = [];

        for (let i = 0; i < this.config.boardSize; i++) {
            data[i] = [];
            for (let j = 0; j < this.config.boardSize; j++) {
                data[i][j] = this.hexagons[i][j].getData();
            }
        }
        return data;
    }

    checkWinner({ row, col }) {
        let color = this.turn % 2 ? this.config.secondPlayerColor : this.config.firstPlayerColor;
        let isHorizontal = this.turn % 2;
        let stack = [{ row, col }];
        let visited = [];
        // Two elements for two parallel edges
        let edges = [false, false];

        while (stack.length != 0) {
            let current = stack.pop();
            if (visited[current.row * this.config.boardSize + current.col])
                continue;
            visited[current.row * this.config.boardSize + current.col] = true;

            if (isHorizontal) {
                if (current.col == 0 && !edges[0])
                    edges[0] = true;
                if (current.col == this.config.boardSize - 1 && !edges[1])
                    edges[1] = true;
            }
            else {
                if (current.row == 0 && !edges[0])
                    edges[0] = true;
                if (current.row == this.config.boardSize - 1 && !edges[1])
                    edges[1] = true;
            }

            if (edges.every(edge => edge)) {
                this.finished = true;
                return true;
            }
            this.getCellNeihbours(current.row, current.col, color).forEach(n => stack.push(n));
        }
        this.turn++;
        return false;
    }


    getCellNeihbours(row, col, color) {
        const neighbours = [];

        neighbours.push({ row: row - 1, col });
        neighbours.push({ row: row - 1, col: col + 1 });
        neighbours.push({ row: row, col: col - 1 });
        neighbours.push({ row: row, col: col + 1 });
        neighbours.push({ row: row + 1, col: col });
        neighbours.push({ row: row + 1, col: col - 1 });

        return neighbours.filter(n => (
            n.row >= 0 && n.row < this.config.boardSize &&
            n.col >= 0 && n.col < this.config.boardSize &&
            this.hexagons[n.row][n.col].getColor() == color
        ))
    }
}


module.exports = Board;