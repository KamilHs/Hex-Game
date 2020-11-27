const express = require("express");
const path = require('path');
const socketIO = require("socket.io");

const config = require("./config");
const Board = require("./models/board");

const app = express();

let joinedSockets = [];
let board;

const server = app.listen(process.env.PORT || 3000);

const io = socketIO(server);

app.set('view engine', 'ejs');
app.set('views', 'public/views');

app.use(express.static(path.join(__dirname, 'public')));


app.get("/", (req, res, next) => {
    res.render("index");
})


io.on("connection", socket => {
    console.log(`${socket.id} connected`);
    if (joinedSockets.length == 2)
        return;
    if (joinedSockets.length == 0)
        board = new Board();
    joinedSockets.push(socket.id);

    socket.emit("GAME:CONFIG", { ...config, player: joinedSockets.indexOf(socket.id) });

    socket.on("GAME:MOVE", data => {
        if (joinedSockets.indexOf(socket.id) != board.getTurn() % 2)
            return;
        if (!board.isCellEmpty(data))
            return;
        board.makeTurn(data);

        io.emit("GAME:MOVE", board.getData());
    })

    socket.on("disconnecting", () => {
        joinedSockets.splice(joinedSockets.indexOf(socket.id), 1);
    })
})

