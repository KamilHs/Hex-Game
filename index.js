const express = require("express");
const path = require('path');
const socketIO = require("socket.io");

const config = require("./config");
const Board = require("./models/board");

const app = express();

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

    socket.emit("GAME:CONFIG", config);
})

