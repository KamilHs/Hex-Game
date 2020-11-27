let socket;
let canvasWidth = document.documentElement.clientWidth;
let canvasHeight = document.documentElement.clientHeight;
let boardSize = 9;
let verticalColor = "red";
let horizontalColor = "blue";


function setup() {
    createCanvas(canvasWidth, canvasHeight);
}


function draw() {
    // hexagon(canvasWidth / 2, canvasHeight / 2, 50, 0, boardSize);
}


function preload() {
    socket = io();
}
