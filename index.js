const express = require("express");
const socketIO = require("socket.io");

const app = express();

const server = app.listen(process.env.PORT || 3000);

const io = socketIO(server);

app.use(express.static("public"));


app.get("/", (req, res, next) => {
    res.render("index");
})


io.on("connection", socket => {
    console.log(socket);
})

