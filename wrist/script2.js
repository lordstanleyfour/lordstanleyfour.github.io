const canvas1 = document.getElementById('canvas1');
const canvas2 = document.getElementById('canvas2');
const ctx1 = canvas1.getContext('2d');
const ctx2 = canvas2.getContext('2d');
var maskData;
canvas1.width = 900;
canvas1.height = 600;
canvas2.width = 900;
canvas2.height = 600;


//global variables
const cellSize = 25;
const controlBarSize = 300;
const gameGrid = [];
const outlineArray = [];
const controlsBar = {
    width: controlBarSize,
    height: canvas1.height,
}
const mask = new Image();
mask.src = './PAwristmask.png';


mask.addEventListener('load', function(){
    ctx2.drawImage(mask, controlBarSize, 0, mask.naturalWidth, mask.naturalHeight);
    maskData = ctx2.getImageData(controlBarSize, 0, 600, 600)
    //console.log(maskData);
})

//mouse
const mouse1 = {
    x: undefined,
    y: undefined,
    width: 0.00001,
    height: 0.00001,
    positionX: undefined,
    positionY: undefined,
    position: undefined,
    positionRed: undefined,
    positionGreen: undefined,
    positionBlue: undefined

}
const mouse2 = {
    x: undefined,
    y: undefined,
    width: 0.00001,
    height: 0.00001,
    positionX: undefined,
    positionY: undefined,
    position: undefined
}
let canvasPosition1 = canvas1.getBoundingClientRect();
canvas1.addEventListener('mousemove', function(e){
    mouse1.x = e.x - canvasPosition1.left;
    mouse1.y = e.y - canvasPosition1.top;
    //only calculate mouse X if positioned to right of control bar
    if (Math.floor(mouse1.x - controlBarSize > 0)) mouse1.positionX = Math.floor(mouse1.x - controlBarSize);
    else mouse1.positionX = 0;
    mouse1.positionY = Math.floor(mouse1.y);
    //calculate the base index of the maskData array mouse pointer hovering over (base number - doesn't take into account the 4 bits)
    mouse1.position = ((Math.floor(mouse1.positionY) * 600) + mouse1.positionX);
    mouse1.positionRed = mouse1.position * 4;
    mouse1.positionGreen = mouse1.position * 4 + 1;
    mouse1.positionBlue = mouse1.position * 4 + 2;
/*     mouse1.positionRed = ((Math.floor(mouse1.positionY) * 600) + mouse1.positionX) * 4;
    mouse1.positionGreen = (((Math.floor(mouse1.positionY) * 600) + mouse1.positionX) * 4)+1;
    mouse1.positionRed = (((Math.floor(mouse1.positionY) * 600) + mouse1.positionX) * 4)+2; */

});
canvas1.addEventListener('mouseleave', function(e){
    mouse1.x = undefined;
    mouse1.y = undefined;
});
let canvasPosition2 = canvas2.getBoundingClientRect();
canvas2.addEventListener('mousemove', function(e){
    mouse2.x = e.x - canvasPosition2.left;
    mouse2.y = e.y - canvasPosition2.top;
    if (Math.floor(mouse2.x - controlBarSize > 0)) mouse2.positionX = mouse2.x - controlBarSize;
    else mouse2.positionX = 0;
    mouse2.positionBlue = ((Math.floor(mouse2.y) * 600) + mouse2.positionX) * 4;
    mouse2.positionGreen = (((Math.floor(mouse2.y) * 600) + mouse2.positionX) * 4)-1;
    mouse2.positionRed = (((Math.floor(mouse2.y) * 600) + mouse2.positionX) * 4)-2;

});
canvas2.addEventListener('mouseleave', function(e){
    mouse2.x = undefined;
    mouse2.y = undefined;
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
        ctx1.drawImage(this.source, this.x, this.y, this.width, this.height);
    }
}

// game board
drawBackground = function(id){
    let backgroundImage = document.getElementById(id);
    ctx1.drawImage(backgroundImage, controlBarSize, 0, canvas1.width - controlBarSize, canvas1.height);
    ctx1.fillStyle = 'blue';
    ctx1.fillRect(0, 0, controlsBar.width, controlsBar.height);   
}

//utilities

window.addEventListener('resize', function(){
    canvasPosition1 = canvas1.getBoundingClientRect();
    canvasPosition2 = canvas2.getBoundingClientRect();
})

UI = function (mouse1){
    
    ctx1.fillStyle = 'white';
    ctx1.font = '20px Verdana'
    ctx1.fillText('X: ' + mouse1.positionX + ' Y: ' + mouse1.positionY + ' index: ' + mouse1.position,50, 50);
    //md = maskData.data[posRed]
    //needs this if statement as if it tries to read an index of "undefined" it will error
    if (mouse1.positionX > 0 ) {
        ctx1.fillText('R: ' + maskData.data[mouse1.positionRed],50, 100);
        ctx1.fillText('G: ' + maskData.data[mouse1.positionGreen],50, 150);
        ctx1.fillText('B: ' + maskData.data[mouse1.positionBlue],50, 200);
        if (maskData.data[mouse1.positionRed] === 255 && maskData.data[mouse1.positionGreen] === 0 && maskData.data[mouse1.positionBlue] === 0) ctx1.fillText('scaphoid',50, 250);
    }
}

//animate loop
function animate(){
    ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
    drawBackground('PAwrist');


    //TESTING
    var posBlue = mouse1.positionBlue;
    var posGreen = mouse1.positionGreen;
    var posRed = mouse1.positionRed;
    //console.log(maskData.data[1]);
    //if (posRed > 0) console.log('maskData RED: ' + maskData.data[posRed]);
    //if (posGreen > 0) console.log('maskData GREEN: ' + maskData.data[posGreen]);
    //if (posBlue > 0) console.log('maskData BLUE: ' + maskData.data[posBlue]);
   UI(mouse1, maskData);

    requestAnimationFrame(animate);
}
animate();

//not sure mouseposition is accurate, should be the index of the R value, need to check on mask image again

//TODO
//basic functions
////
//switch statement in UI to trigger events when hovering over bones (text for now)
//figure out how to trigger the highlight images

//colours used
////scaphoid 255, 0, 0
////lunate 125, 0, 0
////triquetrum 255, 0, 0
////pisiform 0, 125, 0
////hamate 255, 0, 0
////capitate 0, 0, 125
////trapezoid 0, 200, 0
////trapezium 0, 0, 200

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


