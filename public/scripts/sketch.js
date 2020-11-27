let socket;
let canvasWidth = document.documentElement.clientWidth;
let canvasHeight = document.documentElement.clientHeight;
let boardSize = 10;
let verticalColor = "red";
let horizontalColor = "blue";


function setup() {
    createCanvas(canvasWidth, canvasHeight);
}


function draw() {
    renderTable(boardSize);
}


function preload() {
    socket = io();
}


function hexagon(x, y, radius, row, col) {
    let angle = TWO_PI / 6;
    let offset = -TWO_PI / 4;
    for (let i = 0; i < 6; i++) {
        if (
            (row == boardSize - 1 && (i == 2 || i == 3)) ||
            (row == 0 && (i == 0 || i == 5))) {
            stroke(verticalColor);
        }
        else if (
            (col == boardSize - 1 && (i == 0 || i == 1)) ||
            (col == 0 && (i == 3 || i == 4))) {
            stroke(horizontalColor);

        }
        else {
            stroke(0);
        }
        let x0 = x + cos(offset + angle * i) * radius;
        let y0 = y + sin(offset + angle * i) * radius;
        let x1 = x + cos(offset + angle * (i + 1)) * radius;
        let y1 = y + sin(offset + angle * (i + 1)) * radius;
        line(x0, y0, x1, y1);
    }
}

function renderTable(size) {
    let dx = (width > height ? height : width) / (size);
    let side = dx * sin(PI / 6) / sin(2 * PI / 3);
    let dy = side + ((dx / 2) * sin(PI / 6) / sin(PI / 3));

    let offsetX = ((width - (dx * size)) - (dx * (size - 1) / 2) + dx) / 2;
    let offsetY = (height - dy * (size - 1)) / 2;

    let curX = offsetX;
    let curY = offsetY;
    for (let i = 0; i < size; i++) {
        curX = offsetX + i * dx / 2;
        for (let j = 0; j < size; j++) {
            hexagon(curX, curY, side, i, j);
            curX += dx;
        }
        curY += dy;
    }
}