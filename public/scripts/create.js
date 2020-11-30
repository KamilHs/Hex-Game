let board;
let config = null;

function setup() {
    const container = select('#canvas-container');
    const canvas = createCanvas(container.width, 400);
    canvas.parent(container);
    updateConfig();
}

function draw() {
    if (config && shouldBeRendered) {
        background(255);
        board.draw();
        shouldBeRendered = false;
    }
    updateConfig();
}


function updateConfig() {
    let temp = {}
    temp.firstPlayerColor = select("#firstPlayerColor").elt.value;
    temp.secondPlayerColor = select("#secondPlayerColor").elt.value;
    temp.borderColor = select("#borderColor").elt.value;
    temp.emptyBackground = select("#emptyBackground").elt.value;
    temp.boardSize = select("#boardSize").elt.value;

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
        if (!board || board.size != config.boardSize)
            board = new Board(config.boardSize);

        board.hexagons[0][0].bgc = config.firstPlayerColor;
        board.hexagons[config.boardSize - 1][config.boardSize - 1].bgc = config.secondPlayerColor;

        shouldBeRendered = true;
    }
}
