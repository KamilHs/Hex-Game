let socket;
const canvasWidth = document.documentElement.clientWidth;
const canvasHeight = document.documentElement.clientHeight;
let config;
let p;
let turn = 0;
const board = [];


function setup() {
    createCanvas(canvasWidth, canvasHeight);
}


function draw() {
    if (config)
        renderBoard(config.boardSize, config.verticalBorderColor, config.horizontalBorderColor);
}


function preload() {
    socket = io();

    socket.on("connect", () => {
        socket.on("GAME:CONFIG", data => {
            config = data;
            if (!p) {
                p = createP(config.player ? "You are second" : "You are first");
                p.style('color', config.player ? config.secondPlayerColor : config.firstPlayerColor);
                p.addClass('absolute');
            }

            initBoard(config.boardSize);
        });
        socket.on("GAME:MOVE", data => {
            for (let i = 0; i < config.boardSize; i++) {
                for (let j = 0; j < config.boardSize; j++) {
                    board[i][j].setData(data[i][j]);
                }
            }
        })
    });
}



function renderBoard() {
    board.forEach(row => row.forEach(hexagon => hexagon.draw()));
}


function mousePressed(event) {
    handleClick(event.x, event.y)
}


function handleClick(x, y) {
    for (let i = 0; i < board.length; i++) {
        const row = board[i];
        for (let j = 0; j < row.length; j++) {
            const hexagon = row[j];
            if (hexagon.checkClick(x, y)) {
                socket.emit("GAME:MOVE", { row: i, col: j });
            }
        }
    }
}

function initBoard(size) {
    let dx = (width > height ? height : width) * 0.65 / (size);
    let side = dx * sin(PI / 6) / sin(2 * PI / 3);
    let dy = side + ((dx / 2) * sin(PI / 6) / sin(PI / 3));

    let offsetX = ((width - (dx * size)) - (dx * (size - 1) / 2) + dx) / 2;
    let offsetY = (height - dy * (size - 1)) / 2;

    let curX = offsetX;
    let curY = offsetY;
    for (let i = 0; i < size; i++) {
        board[i] = [];
        curX = offsetX + i * dx / 2;
        for (let j = 0; j < size; j++) {
            board[i][j] = new Hexagon(curX, curY, side, i, j);
            curX += dx;
        }
        curY += dy;
    }
}