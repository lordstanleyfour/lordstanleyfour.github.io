//engines
const canvas1 = document.getElementById('canvas1');
const canvas2 = document.getElementById('canvas2');
const ctx1 = canvas1.getContext('2d');
const ctx2 = canvas2.getContext('2d');
canvas1.width = 900;
canvas1.height = 600;
canvas2.width = 900;
canvas2.height = 600;

//global variables
const controlBarSize = 300;
const outlineArray = [];
const controlsBar = {
    width: controlBarSize,
    height: canvas1.height,
}
var currentMode = undefined;

//the masked image
var maskData;
const mask = new Image();
mask.src = './PAwristmask.png';

//mouse
const mouse1 = {
    x: undefined,
    y: undefined,
    width: 0.00001,
    height: 0.00001,
    click: false,
    positionX: undefined,
    positionY: undefined,
    position: undefined,
    positionRed: undefined,
    positionGreen: undefined,
    positionBlue: undefined

}
/* const mouse2 = {
    x: undefined,
    y: undefined,
    width: 0.00001,
    height: 0.00001,
    positionX: undefined,
    positionY: undefined,
    position: undefined
} */

mask.addEventListener('load', function(){
    ctx2.drawImage(mask, controlBarSize, 0, mask.naturalWidth, mask.naturalHeight);
    
    //var startTime = performance.now();
    maskData = ctx2.getImageData(controlBarSize, 0, 600, 600)
    //var endTime = performance.now();
    //var time = endTime - startTime;
    //console.log(time);
    //console.log(maskData);

});

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
});
canvas1.addEventListener('mouseleave', function(e){
    mouse1.x = undefined;
    mouse1.y = undefined;
});


canvas1.addEventListener('mousedown', function (event) {
    mouse1.click = true;
    mouse1.x = event.x - canvasPosition1.left;
    mouse1.y = event.y - canvasPosition1.top;
    });
    canvas1.addEventListener('mouseup', function (event) {
    mouse1.click = false;
    })

/* let canvasPosition2 = canvas2.getBoundingClientRect();
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
}); */

//classes
class Outline {
    constructor(x, y, width, height, id, name){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.source = document.getElementById(id);
        this.name = name; //use this as a string for checking correct answers later
    }
    draw(){
        ctx1.drawImage(this.source, this.x, this.y, this.width, this.height);
    }
}
const scaphoidOutline = new Outline(controlBarSize, 0, 600, 600, 'scaphoidoutline', 'scaphoid');
const lunateOutline = new Outline(controlBarSize, 0, 600, 600, 'lunateoutline', 'lunate');
const triquetrumOutline = new Outline(controlBarSize, 0, 600, 600, 'triquetrumoutline', 'triquetrum');
const pisiformOutline = new Outline(controlBarSize, 0, 600, 600, 'pisiformoutline', 'pisiform');
const hamateOutline = new Outline(controlBarSize, 0, 600, 600, 'hamateoutline', 'hamate');
const capitateOutline = new Outline(controlBarSize, 0, 600, 600, 'capitateoutline', 'capitate');
const trapezoidOutline = new Outline(controlBarSize, 0, 600, 600, 'trapezoidoutline', 'trapezoid');
const trapeziumOutline = new Outline(controlBarSize + 32, 0 + 5, 600, 600, 'trapeziumoutline', 'trapezium');
const radiusOutline = new Outline(controlBarSize, 0, 600, 600, 'radiusoutline', 'radius');
const ulnaOutline = new Outline(controlBarSize, 0, 600, 600, 'ulnaoutline', 'ulna');
const thumbMCOutline = new Outline(controlBarSize, 0, 600, 600, 'thumbmcoutline', 'thumb MC');
const indexMCOutline = new Outline(controlBarSize, 0, 600, 600, 'indexmcoutline', 'index MC');
const middleMCOutline = new Outline(controlBarSize, 0, 600, 600, 'middlemcoutline', 'middle MC');
const ringMCOutline = new Outline(controlBarSize, 0, 600, 600, 'ringmcoutline', 'ring MC');
const littleMCOutline = new Outline(controlBarSize, 0, 600, 600, 'littlemcoutline', 'little MC');
const thumbproxphalanxOutline = new Outline(controlBarSize, 0, 600, 600, 'thumbproximalphalanxoutline', 'thumb prox phalanx');
const sesamoidOutline = new Outline(controlBarSize, 0, 600, 600, 'sesamoidoutline', 'sesamoid');


class Button {
    constructor(x, y, width, height, text) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.text = text;
    }
    draw(){
        //placeholder: replace with an image
        ctx1.save();
        ctx1.fillStyle = 'beige';
        ctx1.fillRect(this.x, this.y, this.width, this.height);
        ctx1.strokeStyle = 'green';
        ctx1.lineWidth = 5;
        ctx1.rect(this.x, this.y, this.width, this.height);
        ctx1.stroke();
        ctx1.fillStyle = 'black';
        ctx1.textAlign = 'center';
        ctx1.font = '15px Verdana';
        ctx1.fillText(this.text, this.x + (this.width/2), this.y+(this.height/1.75));
        ctx1.restore();

    }
}
learningButton = new Button(0, 0, 150, 40, 'LEARNING MODE');
studyButton = new Button(150, 0, 150, 40, 'STUDY MODE');
scaphoidButton = new Button(10, 110, 150, 40, 'SCAPHOID');
lunateButton = new Button(10, 160, 150, 40, 'LUNATE');
triquetrumButton = new Button(10, 210, 150, 40, 'TRIQUETRUM');
pisiformButton = new Button(10, 260, 150, 40, 'PISIFORM');
hamateButton = new Button(10, 310, 150, 40, 'HAMATE');
capitateButton = new Button(10, 360, 150, 40, 'CAPITATE');
trapezoidButton = new Button(10, 410, 150, 40, 'TRAPEZOID');
trapeziumButton = new Button(10, 460, 150, 40, 'TRAPEZIUM');
metacarpalsButton = new Button(10, 510, 150, 40, 'METACARPALS');
sesamoidButton = new Button(10, 560, 150, 40, 'SESAMOID');

// game board
drawBackground = function(id){
    //draw the game image
    let backgroundImage = document.getElementById(id);
    ctx1.drawImage(backgroundImage, controlBarSize, 0, canvas1.width - controlBarSize, canvas1.height);
    //draw the sidebar
    ctx1.fillStyle = 'blue';
    ctx1.fillRect(0, 0, controlsBar.width, controlsBar.height);   
}

//utilities
window.addEventListener('resize', function(){
    canvasPosition1 = canvas1.getBoundingClientRect();
    //canvasPosition2 = canvas2.getBoundingClientRect();
})

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

UI = function (mouse1){
    //UI generated text styling    
    ctx1.fillStyle = 'white';
    ctx1.font = '20px Verdana';
    //ctx1.fillText(' baseIndex: ' + mouse1.position,50, 100);
    ctx1.fillText('Current mode: ' + currentMode, 20, 62);

    function checker(){        
        if (mouse1.positionX > 0 ) {
            //needs this if statement as if it tries to read an index of "undefined" it will error
/*             ctx1.fillText('R: ' + maskData.data[mouse1.positionRed],50, 150);
            ctx1.fillText('G: ' + maskData.data[mouse1.positionGreen],50, 200);
            ctx1.fillText('B: ' + maskData.data[mouse1.positionBlue],50, 250); */
            if (maskData.data[mouse1.positionRed] === 255 && maskData.data[mouse1.positionGreen] === 0 && maskData.data[mouse1.positionBlue] === 0) return 'scaphoid';
            else if (maskData.data[mouse1.positionRed] === 125 && maskData.data[mouse1.positionGreen] === 0 && maskData.data[mouse1.positionBlue] === 0) return 'lunate';
            else if (maskData.data[mouse1.positionRed] === 0 && maskData.data[mouse1.positionGreen] === 255 && maskData.data[mouse1.positionBlue] === 0) return 'triquetrum';
            else if (maskData.data[mouse1.positionRed] === 0 && maskData.data[mouse1.positionGreen] === 125 && maskData.data[mouse1.positionBlue] === 0) return 'pisiform';
            else if (maskData.data[mouse1.positionRed] === 0 && maskData.data[mouse1.positionGreen] === 0 && maskData.data[mouse1.positionBlue] === 255) return 'hamate';
            else if (maskData.data[mouse1.positionRed] === 0 && maskData.data[mouse1.positionGreen] === 0 && maskData.data[mouse1.positionBlue] === 125) return 'capitate';
            else if (maskData.data[mouse1.positionRed] === 0 && maskData.data[mouse1.positionGreen] === 200 && maskData.data[mouse1.positionBlue] === 0) return 'trapezoid';
            else if (maskData.data[mouse1.positionRed] === 0 && maskData.data[mouse1.positionGreen] === 0 && maskData.data[mouse1.positionBlue] === 200) return 'trapezium';
            else if (maskData.data[mouse1.positionRed] === 200 && maskData.data[mouse1.positionGreen] === 0 && maskData.data[mouse1.positionBlue] === 0) return 'radius';
            else if (maskData.data[mouse1.positionRed] === 200 && maskData.data[mouse1.positionGreen] === 200 && maskData.data[mouse1.positionBlue] === 0) return 'ulna';
            else if (maskData.data[mouse1.positionRed] === 100 && maskData.data[mouse1.positionGreen] === 0 && maskData.data[mouse1.positionBlue] === 0) return 'thumb MC';
            else if (maskData.data[mouse1.positionRed] === 0 && maskData.data[mouse1.positionGreen] === 100 && maskData.data[mouse1.positionBlue] === 0) return 'index MC';
            else if (maskData.data[mouse1.positionRed] === 0 && maskData.data[mouse1.positionGreen] === 0 && maskData.data[mouse1.positionBlue] === 100) return 'middle MC';
            else if (maskData.data[mouse1.positionRed] === 100 && maskData.data[mouse1.positionGreen] === 100 && maskData.data[mouse1.positionBlue] === 0) return 'ring MC';
            else if (maskData.data[mouse1.positionRed] === 100 && maskData.data[mouse1.positionGreen] === 0 && maskData.data[mouse1.positionBlue] === 100) return 'little MC';
            else if (maskData.data[mouse1.positionRed] === 0 && maskData.data[mouse1.positionGreen] === 100 && maskData.data[mouse1.positionBlue] === 100) return 'thumb prox phalanx';
            else if (maskData.data[mouse1.positionRed] === 200 && maskData.data[mouse1.positionGreen] === 100 && maskData.data[mouse1.positionBlue] === 0) return 'sesamoid';
            else return 'Keep looking...';
        }
    }
    //instert code to display highlight images here
    switch(checker()){
        case 'scaphoid':
            scaphoidOutline.draw();
            break;
        case 'lunate':
            lunateOutline.draw();
            break;
        case 'triquetrum':
            triquetrumOutline.draw();
            break;
        case 'pisiform':
            pisiformOutline.draw();
            break;
        case 'hamate':
            hamateOutline.draw();
            break;
        case 'capitate':
            capitateOutline.draw();
            break;
        case 'trapezoid':
            trapezoidOutline.draw();
            break;
        case 'trapezium':
            trapeziumOutline.draw();
            break;
        case 'radius':
            radiusOutline.draw();
            break;
        case 'ulna':
            ulnaOutline.draw();
            break;
        case 'thumb MC':
            thumbMCOutline.draw();
            break;        
        case 'index MC':
            indexMCOutline.draw();
            break;
        case 'middle MC':
            middleMCOutline.draw();
            break;
        case 'ring MC':
            ringMCOutline.draw();
            break;
        case 'little MC':
            littleMCOutline.draw();
            break;
        case 'thumb prox phalanx':
            thumbproxphalanxOutline.draw();
            break;
        case 'sesamoid':
            sesamoidOutline.draw();
            break;
}
    //display bone name on sidebar when in learning mode
    if (currentMode === 'LEARNING'){
        if (checker()) ctx1.fillText(checker(),50, 90);
    }    
    
    learningButton.draw();
    studyButton.draw();
    scaphoidButton.draw();
    lunateButton.draw();
    triquetrumButton.draw();
    pisiformButton.draw();
    hamateButton.draw();
    capitateButton.draw();
    trapezoidButton.draw();
    trapeziumButton.draw();
    metacarpalsButton.draw();
    sesamoidButton.draw();

    //hover over buttons in learning mode to highlight bone
    if (mouse1.x && collision(scaphoidButton, mouse1)) scaphoidOutline.draw();
    else if (mouse1.x && collision(lunateButton, mouse1)) lunateOutline.draw();
    else if (mouse1.x && collision(triquetrumButton, mouse1)) triquetrumOutline.draw();
    else if (mouse1.x && collision(pisiformButton, mouse1)) pisiformOutline.draw();
    else if (mouse1.x && collision(hamateButton, mouse1)) hamateOutline.draw();
    else if (mouse1.x && collision(capitateButton, mouse1)) capitateOutline.draw();
    else if (mouse1.x && collision(trapezoidButton, mouse1)) trapezoidOutline.draw();
    else if (mouse1.x && collision(trapeziumButton, mouse1)) trapeziumOutline.draw();
    else if (mouse1.x && collision(metacarpalsButton, mouse1)) {
        thumbMCOutline.draw();
        indexMCOutline.draw();
        middleMCOutline.draw();
        ringMCOutline.draw();
        littleMCOutline.draw();
    }
    else if (mouse1.x && collision(sesamoidButton, mouse1)) sesamoidOutline.draw();


}

//code for collision between mouse click and learning button to change currentmode
function modeSelect() {
    if (currentMode === undefined) currentMode = 'LEARNING';
    if (collision(mouse1, learningButton) && mouse1.click) {
        currentMode = 'LEARNING';
    }
    if (collision(mouse1, studyButton) && mouse1.click) {
        currentMode = 'STUDY';
    }
}

//
////function to shuffle buttons to an array, select each element and judge whether the 
//correct bone has been clicked before scoring and progressing

//animate loop
function animate(){
    ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
    drawBackground('PAwrist');
    modeSelect();
    UI(mouse1, maskData)


    //TESTING

    requestAnimationFrame(animate);
}
//time delay before first frame to ensure maskdata loaded otherwise occasional error thrown when array not ready
//array takes up to 33ms on my PC, liekyl slower on others
setTimeout(animate, 100);

//TODO
//basic functions
////
//refactor code so it's more plug and play (bone names and RGB data in an object)
//hover buttons on left which trigger the outlines for the relevant bone (learning mode)

//colours used
////scaphoid 255, 0, 0
////lunate 125, 0, 0
////triquetrum 0, 255, 0
////pisiform 0, 125, 0
////hamate 0, 0, 255
////capitate 0, 0, 125
////trapezoid 0, 200, 0
////trapezium 0, 0, 200
////radius 200, 0, 0
////ulna 200, 200, 0

////thumb MC 100, 0, 0
////index MC 0, 100, 0
////middle MC 0, 0, 100
////ring MC 100, 100, 0
////little MC 100, 0, 100
////thumb prox phalanx 0, 100, 100
////sesamoid 200, 100, 0

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


