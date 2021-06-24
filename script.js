`use strict`;

const c = document.getElementById('myCanvas');
const ctx = c.getContext('2d');
const CELLSIZE = c.clientHeight/8;

const WHITE = new Image();
WHITE.src='img/white.png';
let whitePos = [];

const BLACK = new Image();
BLACK.src='img/black.png';
let blackPos = [];

const POSSIBLEMOVE = new Image();
POSSIBLEMOVE.src = "img/possibleMove.png";

const ACTIVE = new Image();
ACTIVE.src = "img/active.png";

const status = document.getElementById('statusLine');


let allCheckers = [];
let queue = 'white';
let activeCh = null;


window.onload = function (){
    startNewGame();
}

function eventProcessor(e){
    let x = e.pageX - e.target.offsetLeft,
        y = e.pageY - e.target.offsetTop;

    activateCheck(allCheckers,x,y);
    movement(possibleMoves(activeCh),x,y);
}

function drawField(){ // draw field
    let size = c.clientHeight;
    for (let i = CELLSIZE; i < size; i += CELLSIZE) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, CELLSIZE*8);
        ctx.moveTo(0, i);
        ctx.lineTo(CELLSIZE*8, i);
    }
    ctx.stroke();
    ctx.stroke();
    ctx.stroke();
}

function initCheckers(type) {//init checkers
    let iMax = 0 ,iMin = 0;
    let pos;

    if(type === 'white'){
        iMax = 4;
        iMin = 7;
        pos = whitePos;
    } else if(type === 'black'){
        iMax = 3;
        iMin = 0;
        pos = blackPos;
    }

    for (let i = iMin; i > iMax && type === 'white' || i<iMax && type === 'black'; (type === 'black') ? i++ : i--) {
        for (let j = iMin; j > iMax && type === 'white' || j<iMax && type === 'black'; (type === 'black') ? j++ : j--) {
            let check = new Checker(type, i * CELLSIZE, j * CELLSIZE);
            allCheckers.push(check);
            pos.push({x:check.x,y:check.y});
        }
    }
}

function activateCheck(allCheckers,x,y) {
    for (let ch of allCheckers) {
        if (ch.type === queue) {
            if (x >= ch.x && x <= ch.x + CELLSIZE) {
                if (y >= ch.y && y <= ch.y + CELLSIZE) {
                        if (!ch.isActive) {
                            allCheckers.forEach((item)=>{
                                item.isActive = false;
                                if(item.type === 'black'){
                                    item.image = BLACK;
                                }
                                else{
                                    item.image = WHITE;
                                }
                            });
                            ch.isActive = true;
                            ch.image = ACTIVE;
                            activeCh = ch;
                        } else if(ch === activeCh){
                            ch.image = (ch.type === 'black') ? BLACK : WHITE;
                            ch.isActive = false;
                            activeCh = null;
                        }
                    }
                }
            }
        }
    refresh();
}

function refresh() {
    ctx.clearRect(0, 0, c.clientWidth, c.clientHeight);
    drawField();
    for (let check of allCheckers) {
        if (check.image.complete) {
            ctx.drawImage(check.image, check.x, check.y);
        } else {
            check.image.onload = function () {
                ctx.drawImage(check.image, check.x, check.y);
            }
        }
    }
    checkWinner();
    setQueue();
}

function possibleMoves(active) {
    const directions = {};
    let possibleCells = [];
    if (active) {
        directions.right = !allCheckers.some(checker => checker.x === active.x + CELLSIZE && checker.y === active.y);
        directions.left = !allCheckers.some(checker => checker.x === active.x - CELLSIZE && checker.y === active.y);
        directions.up = !allCheckers.some(checker => checker.y === active.y - CELLSIZE && checker.x === active.x);
        directions.down = !allCheckers.some(checker => checker.y === active.y + CELLSIZE && checker.x === active.x);

        if (directions.right) {
            ctx.drawImage(POSSIBLEMOVE, active.x + CELLSIZE, active.y, CELLSIZE, CELLSIZE);
            possibleCells.push({x: active.x + CELLSIZE, y: active.y});
        }

        if (directions.left) {
            ctx.drawImage(POSSIBLEMOVE, active.x - CELLSIZE, active.y, CELLSIZE, CELLSIZE);
            possibleCells.push({x: active.x - CELLSIZE, y: active.y});
        }

        if (directions.up) {
            ctx.drawImage(POSSIBLEMOVE, active.x, active.y - CELLSIZE, CELLSIZE, CELLSIZE);
            possibleCells.push({x: active.x, y: active.y - CELLSIZE});
        }

        if (directions.down) {
            ctx.drawImage(POSSIBLEMOVE, active.x, active.y + CELLSIZE, CELLSIZE, CELLSIZE);
            possibleCells.push({x: active.x, y: active.y + CELLSIZE});
        }
        return possibleCells;
    }
}

function movement(possibleCells,x,y){
    if(activeCh){
        for(let cell of possibleCells){
            if (x >= cell.x && x <= cell.x + CELLSIZE) {
                if (y >= cell.y && y <= cell.y + CELLSIZE) {
                    activeCh.move(cell.x,cell.y);
                    refresh();
                }
            }
        }
    }
}

function setQueue(){
    if (queue === 'white')
        status.innerText = 'White\`s move';
    else
        status.innerText = 'Black\`s move';
}

function checkWinner() {
    let whiteCounter = 0, blackCounter = 0;
    for (let checker of allCheckers) {
        if (checker.type === 'white') {
            for (let pos of blackPos) {
                if (checker.x === pos.x && checker.y === pos.y) {
                    whiteCounter++;
                }
            }
        } else if (checker.type === 'black') {
            for (let pos of whitePos) {
                if (checker.x === pos.x && checker.y === pos.y) {
                    blackCounter++;
                }
            }
        }
    }
    if (whiteCounter === 9 || blackCounter === 9) {
        ctx.clearRect(0,0,c.clientWidth, c.clientHeight);
        stop();
        let winnerImage = new Image();
        winnerImage.src = (whiteCounter === 9) ? 'img/whiteWin.png' : 'img/blackWin.png';
        if (winnerImage.complete)
            ctx.drawImage(winnerImage, 0, 0);
        else {
            winnerImage.onload = function () {
                ctx.drawImage(winnerImage, 0, 0);
            }
        }
    }
}
function startNewGame(){
    initCheckers('white');
    initCheckers('black');
    c.addEventListener('mouseup', eventProcessor);
    refresh();
}

function stop(){
    setTimeout(()=>startNewGame(),5000);
    allCheckers = [];
    queue = 'white';
    activeCh = null;
    whitePos = [];
    blackPos = [];
    c.removeEventListener('mouseup', eventProcessor);
}

