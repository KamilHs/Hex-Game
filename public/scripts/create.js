let board;
let config = null;

function setup() {
    const container = select('#canvas-container');
    const canvas = createCanvas(container.width, 400);
    canvas.parent(container);
    updateConfig();
}

function draw() {
    background(255);
    if (config) {
        board.draw();
    }
    updateConfig();
}


function updateConfig() {
    let temp = {}
    temp.firstPlayerColor = select("#first_player_color").elt.value;
    temp.secondPlayerColor = select("#second_player_color").elt.value;
    temp.borderColor = select("#border_color").elt.value;
    temp.emptyBackground = select("#bgc_color").elt.value;
    temp.boardSize = select("#board_size").elt.value;

    let hasChanged = false;
    for (const key in temp) {
        if (!config || temp[key] != config[key]) {
            hasChanged = true;
            break;
        }
    }
    if (hasChanged) {
        config = {
            ...temp,
            verticalBorderColor: temp.firstPlayerColor,
            horizontalBorderColor: temp.secondPlayerColor
        };
        board = new Board(config.boardSize);
        board.hexagons[0][0].bgc = config.firstPlayerColor;
        board.hexagons[config.boardSize - 1][config.boardSize - 1].bgc = config.secondPlayerColor;

    }
}
