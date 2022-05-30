const canvas = document.getElementById('canvas1');
const canvas2 = document.getElementById('canvas2');
const ctx = canvas.getContext('2d');
const ctx2 = canvas2.getContext('2d');
canvas.width = 900;
canvas.height = 600;
canvas2.width = 900;
canvas2.height = 600;


//global variables
const cellSize = 25;
const controlBarSize = 300;
const gameGrid = [];
const outlineArray = [];
const controlsBar = {
    width: controlBarSize,
    height: canvas.height,
}
const mask = new Image();
mask.src = './PAwristmask.png';


mask.addEventListener('load', function(){
    ctx2.drawImage(mask, controlBarSize, 0, mask.naturalWidth, mask.naturalHeight);
    var maskData = ctx2.getImageData(controlBarSize, 0, 600, 600)
    console.log(maskData);
})

//mouse
const mouse = {
    x: undefined,
    y: undefined,
    width: 0.00001,
    height: 0.00001,
    positionX: undefined,
    positionY: undefined,
    position: undefined
}
let canvasPosition = canvas2.getBoundingClientRect();
canvas.addEventListener('mousemove', function(e){
    mouse.x = e.x - canvasPosition.left;
    mouse.y = e.y - canvasPosition.top;
    if (Math.floor(mouse.x - controlBarSize > 0)) mouse.positionX = mouse.x - controlBarSize;
    else mouse.positionX = 0;
    mouse.position = ((Math.floor(mouse.y) * 600) + mouse.positionX) * 4;
});
canvas.addEventListener('mouseleave', function(e){
    mouse.x = undefined;
    mouse.y = undefined;
});

//classes
class Outline {
    constructor(x, y, width, height, id, name){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.source = document.getElementById(id);
        this.name = name; //use this as a string for checking correcxt answers
    }
    draw(){
        ctx.drawImage(this.source, this.x, this.y, this.width, this.height);
    }
}

// game board
drawBackground = function(id){
    let backgroundImage = document.getElementById(id);
    ctx.drawImage(backgroundImage, controlBarSize, 0, canvas.width - controlBarSize, canvas.height);
    ctx.fillStyle = 'blue';
    ctx.fillRect(0, 0, controlsBar.width, controlsBar.height);   
}

//utilities

window.addEventListener('resize', function(){
    canvasPosition = canvas.getBoundingClientRect();
})

//animate loop
function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground('PAwrist');


    //TESTING
    //console.log('posX: ' + mouse.positionX);
    //console.log('posY: ' + mouse.y);
    console.log('position: ' + mouse.position);

    requestAnimationFrame(animate);
}
animate();

//not sure mouseposition is accurate, should be the index of the R value, need to check on mask image again

//TODO
//basic functions
////
//create mask image with different colours covering each of the bones of interest
//figure out how to use getImageData to trigger the highlight images
//try it without second canvas first, simply don't draw the mask image?
//otherwise draw the mask image on canvas 2 with css display:none
//iterate through the data array and use array index of specifically coloured pixels against the mouse.position value
//if there's a match then draw the required outline image

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

//colours used
////scaphoid 255, 0, 0
////lunate 125, 0, 0
////triquetrum 255, 0, 0
////pisiform 0, 125, 0
////hamate 255, 0, 0
////capitate 0, 0, 125
////trapezoid 0, 200, 0
////trapezium 0, 0, 200
