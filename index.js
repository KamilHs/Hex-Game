require('dotenv').config();
const express = require("express");
const socketIO = require("socket.io");
const path = require("path");

const config = require("./config");
const isHexColor = require("./helpers/isHexColor");
const idGenerator = require("./helpers/idGenerator");

const boards = { count: 0 };
const Board = require("./classes/board");
const app = express();

const server = app.listen(process.env.PORT || 3000);

const io = socketIO(server);

app.set('view engine', 'ejs');
app.set('views', 'public/views');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

io.on("connection", async socket => {
    console.log(`${socket.id} connected`);
    const roomId = socket.handshake.query.roomId;
    let connectedSockets = await io.in(roomId).allSockets();

    if (connectedSockets.size == 2) return;

    socket.join(roomId);
    connectedSockets = await io.in(roomId).allSockets();

    let board = boards[roomId];


    [...connectedSockets].forEach(id => {
        io.of("/").sockets.get(id).emit("GAME:CONFIG", getPlayerConfig(connectedSockets, id, board))
    })


    socket.on("GAME:MOVE", async data => {
        let connectedSockets = await io.in(roomId).allSockets();

        if (board.finished || connectedSockets.size != 2) return;
        if ([...connectedSockets].indexOf(socket.id) != board.getTurn() % 2)
            return;
        if (!board.isCellEmpty(data))
            return;
        board.makeTurn(data);
        if (board.checkWinner(data)) {
            io.to(roomId).emit("GAME:FINISHED", board.getCurrentPlayerColor())
        }
        [...connectedSockets].forEach(id => {
            io.of("/").sockets.get(id).emit("GAME:CONFIG", getPlayerConfig(connectedSockets, id, board))
        })
        io.to(roomId).emit("GAME:MOVE", board.getData());
    })

    socket.on("disconnecting", async () => {
        socket.leave(roomId);
        boards[roomId] = null;
    })
})


app.get("/create", (req, res, next) => {
    res.render("create", {
        config,
        errors: []
    });
})

app.get("/:id", (req, res, next) => {
    if (!boards[req.params.id]) return res.redirect("/create");
    res.render("index");
})

app.post("/create", (req, res, next) => {
    const errors = [];
    if (boards.count >= 25)
        errors.push("Maximum number of rooms reached. Try later");
    if (!req.body.boardSize)
        errors.push(`Board size is required`);
    else if (req.body.boardSize < config.minSize || req.body.boardSize > config.maxSize)
        errors.push(`Board size should be between ${config.minSize} and ${config.maxSize}`);

    if (!req.body.firstPlayerColor || !isHexColor(req.body.firstPlayerColor) ||
        !req.body.secondPlayerColor || !isHexColor(req.body.secondPlayerColor))
        errors.push("Players colors required");
    else if (req.body.firstPlayerColor == req.body.secondPlayerColor)
        errors.push("Players colors can't be the same");

    if (!req.body.emptyBackground || !isHexColor(req.body.emptyBackground))
        errors.push(`Background color is required`);
    else if (req.body.emptyBackground == req.body.firstPlayerColor ||
        req.body.emptyBackground == req.body.secondPlayerColor)
        errors.push("Background color can't be the player color");

    if (!req.body.borderColor || !isHexColor(req.body.borderColor))
        errors.push(`Border color is required`);
    else if (
        req.body.borderColor == req.body.firstPlayerColor ||
        req.body.borderColor == req.body.secondPlayerColor)
        errors.push("Border color can't be the player color");

    if (req.body.borderColor && req.body.borderColor == req.body.emptyBackground)
        errors.push("Border color can't be the background color");

    if (errors.length != 0) {
        return res.render("create", {
            config: {
                firstPlayerColor: req.body.firstPlayerColor || config.firstPlayerColor,
                secondPlayerColor: req.body.secondPlayerColor || config.secondPlayerColor,
                borderColor: req.body.borderColor || config.borderColor,
                emptyBackground: req.body.emptyBackground || config.emptyBackground,
                boardSize: req.body.boardSize || config.boardSize,
                minSize: config.minSize,
                maxSize: config.maxSize,
            },
            errors
        });
    }
    let id = idGenerator(24);
    boards[id] = new Board({
        firstPlayerColor: req.body.firstPlayerColor,
        secondPlayerColor: req.body.secondPlayerColor,
        borderColor: req.body.borderColor,
        emptyBackground: req.body.emptyBackground,
        boardSize: req.body.boardSize,
        verticalBorderColor: req.body.firstPlayerColor,
        horizontalBorderColor: req.body.secondPlayerColor
    });
    boards.count++;
    res.redirect(`/${id}`);
})


app.use((req, res, next) => res.redirect("/create"));

function getPlayerConfig(connectedSockets, id, board) {
    let message;
    let color;
    if (connectedSockets.size == 1) {
        message = "Waiting for someone to join...";
        color = "black";
    }
    else {
        if ([...connectedSockets].indexOf(id) == board.getTurn() % 2) {
            message = "Your Turn";
            color = board.getCurrentPlayerColor();
        }
        else {
            message = "Waiting for Opponent";
            color = board.getNotCurrentPlayerColor();
        }
    }
    return { ...board.getConfig(), message, color };
}