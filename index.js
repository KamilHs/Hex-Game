const express = require("express");
const path = require('path');
const socketIO = require("socket.io");

const config = require("./config");
const isHexColor = require("./helpers/isHexColor");
const Board = require("./classes/board");
const sequelize = require("./db");

const app = express();

let joinedSockets = [];
let board;


const server = app.listen(process.env.PORT || 3000);

const io = socketIO(server);

app.set('view engine', 'ejs');
app.set('views', 'public/views');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

sequelize.sync().then(() => {
    io.on("connection", socket => {
        console.log(`${socket.id} connected`);
        if (joinedSockets.length == 2)
            return;
        if (joinedSockets.length == 0)
            board = new Board();
        joinedSockets.push(socket.id);

        socket.emit("GAME:CONFIG", { ...config, player: joinedSockets.indexOf(socket.id) });

        socket.on("GAME:MOVE", data => {
            if (board.finished) return;
            if (joinedSockets.indexOf(socket.id) != board.getTurn() % 2)
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
            joinedSockets.splice(joinedSockets.indexOf(socket.id), 1);
        })
    })
})


app.get("/", (req, res, next) => {
    res.render("index");
})

app.get("/create", (req, res, next) => {
    res.render("create", {
        config,
        errors: []
    });
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
        res.render("create", {
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
        })
    }
})
