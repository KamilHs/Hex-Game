let config;
let p;
let board;


function setup() {
    const canvasWidth = document.documentElement.clientWidth;
    const canvasHeight = document.documentElement.clientHeight;
    createCanvas(canvasWidth, canvasHeight);
}


function draw() {
    if (config)
        board.draw();
}


function preload() {
    socket.on("connect", () => {
        socket.on("GAME:CONFIG", data => {
            config = data;
            if (p) p.remove();
            p = createP(config.player ? "You are second" : "You are first");
            p.style('color', config.player ? config.secondPlayerColor : config.firstPlayerColor);
            p.addClass('absolute');

            board = new Board(config.boardSize);
        });
        socket.on("GAME:MOVE", data => {
            for (let i = 0; i < config.boardSize; i++) {
                for (let j = 0; j < config.boardSize; j++) {
                    board.setCellData(i, j, data[i][j]);
                }
            }
        })

        socket.on("GAME:MESSAGE", console.log);

        socket.on("GAME:FINISHED", renderWinnerMessage)
    });
}



function mousePressed(event) {
    handleClick(event.x, event.y)
}

function handleClick(x, y) {
    for (let i = 0; i < board.size; i++) {
        for (let j = 0; j < board.size; j++) {
            if (board.checkCellClick(i, j, x, y)) {
                socket.emit("GAME:MOVE", { row: i, col: j });
            }
        }
    }
}

function renderWinnerMessage(playerColor) {
    let message = createDiv(`<p>Winner is ${playerColor}</p>`);

    message.addClass("winner");
    message.style('color', playerColor);
}