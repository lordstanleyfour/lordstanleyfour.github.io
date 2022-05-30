const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 900;
canvas.height = 600;

//global variables
const cellSize = 25;
const controlBarSize = 300;
const gameGrid = [];
const outlineArray = [];
const controlsBar = {
    width: controlBarSize,
    height: canvas.height,
}

//mouse
const mouse = {
    x: undefined,
    y: undefined,
    width: 0.00001,
    height: 0.00001,
    cellNumX: undefined,
    cellNumY: undefined,
    cellNum: undefined
}
let canvasPosition = canvas.getBoundingClientRect();
canvas.addEventListener('mousemove', function(e){
    mouse.x = e.x - canvasPosition.left;
    mouse.y = e.y - canvasPosition.top;
    if (Math.floor((mouse.x - controlBarSize)/cellSize) >= 0) mouse.cellNumX = Math.floor((mouse.x - controlBarSize)/cellSize);
    else mouse.cellNumX = 0;
    mouse.cellNumY = Math.floor(mouse.y/cellSize);
    mouse.cellNum = mouse.cellNumX + ((canvas.width - controlBarSize)/cellSize) * mouse.cellNumY;
});
canvas.addEventListener('mouseleave', function(e){
    mouse.x = undefined;
    mouse.y = undefined;
});

//classes
class Cell {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.width = cellSize;
        this.height = cellSize;
        this.number = ((this.x - controlBarSize)/cellSize) + ((this.y/cellSize) * ((canvas.width - controlBarSize)/cellSize));

    }
    draw(){
        /* if (mouse.x && mouse.y && collision(this, mouse)){
            ctx.strokeStyle = 'black';
            ctx.strokeRect(this.x, this.y, this.width, this.height); 
            ctx.font = '10px Arial';
            ctx.strokeText(this.number, this.x + this.width/2, this.y + this.height/2);
        } */
        ctx.strokeStyle = 'black';
        ctx.strokeRect(this.x, this.y, this.width, this.height); 
        ctx.font = '10px Arial';
        ctx.strokeText(this.number, this.x + 5, this.y + 10);
    }
}

class Outline {
    constructor(x, y, width, height, id, name, cellA, cellB, cellC, cellD, cellE, cellF, cellG, cellH, cellI, cellJ, cellK, cellL, cellM, cellN, cellO){
        // hardcoded values for test object only ( up to 15 allowed)
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.source = document.getElementById(id);
        this.name = name; //use this as a string for checking correcxt answers
        this.highlightCells = {
            a: cellA,
            b: cellB,
            c: cellC,
            d: cellD,
            e: cellE,
            f: cellF,
            g: cellG,
            h: cellH,
            i: cellI,
            j: cellJ,
            k: cellJ,
            l: cellJ,
            m: cellJ,
            n: cellJ,
            o: cellJ
        };
    }
    draw(){
        ctx.drawImage(this.source, this.x, this.y, this.width, this.height);
    }
}
const scaphoid = new Outline(300, 0, 600, 600, "scaphoidoutline", "scaphoid", 322, 323, 346, 347, 378, 348);
const lunate = new Outline(300, 0, 600, 600, "lunateoutline", "lunate", 325, 349, 350);
const triquetrum = new Outline(300, 0, 600, 600, "triquetrumoutline", "triquetrum", 303, 326, 327);
const pisiform = new Outline(300, 0, 600, 600, "pisiformoutline", "pisiform", 327);
const hamate = new Outline(300, 0, 600, 600, "hamateoutline", "hamate", 277, 278, 279, 301, 302);
const capitate = new Outline(300, 0, 600, 600, "capitateoutline", "capitate", 276, 277, 299, 300, 301, 324);
const trapezoid = new Outline(300, 0, 600, 600, "trapezoidoutline", "trapezoid", 274, 275, 298, 299);
const trapezium = new Outline(333, 10, 600, 600, "trapeziumoutline", "trapezium", 273, 274, 297, 298);
outlineArray.push(scaphoid, lunate, triquetrum, pisiform, hamate, capitate, trapezium, trapezoid);



// game board
drawBackground = function(id){
    let backgroundImage = document.getElementById(id);
    ctx.drawImage(backgroundImage, controlBarSize, 0, canvas.width - controlBarSize, canvas.height);
    ctx.fillStyle = 'blue';
    ctx.fillRect(0, 0, controlsBar.width, controlsBar.height);   
}

function createGrid(){
    for (let y = 0; y < canvas.height; y += cellSize){
        for (let x = controlBarSize; x < canvas.width; x += cellSize){
            gameGrid.push(new Cell(x, y));
        }
    }
}
createGrid();

//utilities
function drawGameGrid(){
    for (let i = 0; i < gameGrid.length; i++){
        gameGrid[i].draw();
    }
}

function highlightHandler (){
    outlineArray.forEach(outline => {
        //get highlight cell numbers and give them a local variable
        let a = outline.highlightCells.a;
        let b = outline.highlightCells.b;
        let c = outline.highlightCells.c;
        let d = outline.highlightCells.d;
        let e = outline.highlightCells.e;
        let f = outline.highlightCells.f;
        let g = outline.highlightCells.g;
        let h = outline.highlightCells.h;
        let i = outline.highlightCells.i;
        let j = outline.highlightCells.j;
        let k = outline.highlightCells.k;
        let l = outline.highlightCells.l;
        let m = outline.highlightCells.m;
        let n = outline.highlightCells.n;
        let o = outline.highlightCells.o;
        if (mouse.cellNum === a || mouse.cellNum === b || mouse.cellNum === c || mouse.cellNum === d || mouse.cellNum === e || mouse.cellNum === f || mouse.cellNum === g || mouse.cellNum === h || mouse.cellNum === i || mouse.cellNum === j || mouse.cellNum === k || mouse.cellNum === l || mouse.cellNum === m || mouse.cellNum === n || mouse.cellNum === o) outline.draw();
    })
}

function collision (first, second){
    if (    !(  first.x > second.x + second.width ||
                first.x + first.width < second.x ||
                first.y > second.y + second.height ||
                first.y + first.height < second.y)
                //if any of these statements is true there can't be a collision
    ) {
        return true;
    };    
};
window.addEventListener('resize', function(){
    canvasPosition = canvas.getBoundingClientRect();
})

//animate loop
function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground('PAwrist');
    highlightHandler();

    //TESTING
    //
    drawGameGrid(); //draw all cells
    //trapezium.draw();

    requestAnimationFrame(animate);
}
animate();

//TODO
//basic functions
////
//reduce grid resolution
//sort out their highlight boxes

//gamify
////
//able to select either teaching bar or training bar
//make controlbar handler function to display and contain functions of whichever chosen
//training bar
//click the cards to highlight the bone
//teaching bar
//cards down the side of the game bar
//select a card then click the corresponding bone
//true or false result given


