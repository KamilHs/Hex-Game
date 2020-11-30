require('dotenv').config();
const express = require("express");
const socketIO = require("socket.io");
const path = require("path");

const config = require("./config");
const isHexColor = require("./helpers/isHexColor");
const idGenerator = require("./helpers/idGenerator");

const boards = {};
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

    socket.emit("GAME:CONFIG", { ...config, player: [...connectedSockets].indexOf(socket.id) });

    socket.on("GAME:MOVE", async data => {
        let connectedSockets = await io.in(roomId).allSockets();

        if (board.finished || connectedSockets.size != 2) return;
        if ([...connectedSockets].indexOf(socket.id) != board.getTurn() % 2)
            return;
        if (!board.isCellEmpty(data))
            return;
        board.makeTurn(data);
        if (board.checkWinner(data)) {
            io.emit("GAME:FINISHED", board.getCurrentPlayerColor())
        }
        io.emit("GAME:MOVE", board.getData());
    })

    socket.on("disconnecting", () => {
        socket.leave(roomId);
    })
})


app.get("/create", (req, res, next) => {
    res.render("create", {
        config,
        errors: []
    });
})

app.get("/:id", async (req, res, next) => {
    console.log(req.params.id);
    if (!boards[req.params.id]) return res.redirect("/create");
    res.render("index");
})

app.post("/create", (req, res, next) => {
    const errors = [];
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
    let id = idGenerator(24)
    boards[id] = new Board({
        firstPlayerColor: req.body.firstPlayerColor,
        secondPlayerColor: req.body.secondPlayerColor,
        borderColor: req.body.borderColor,
        emptyBackground: req.body.emptyBackground,
        boardSize: req.body.boardSize,
    })
    res.redirect(`/${id}`);
})
