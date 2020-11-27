let socket;
let canvasWidth = document.documentElement.clientWidth;
let canvasHeight = document.documentElement.clientHeight;
let boardSize = 10;
let verticalColor = "red";
let horizontalColor = "blue";
const board = [];


function setup() {
    createCanvas(canvasWidth, canvasHeight);
    initBoard(boardSize);
}


function draw() {
    renderBoard(boardSize, verticalColor, horizontalColor);
}


function preload() {
    socket = io();
}



function renderBoard(size, vertColor, horColor) {
    board.forEach(row => row.forEach(hexagon => hexagon.draw(size, vertColor, horColor)));
}


function mousePressed(event) {
    handleClick(event.x, event.y)
}


function handleClick(x, y) {

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