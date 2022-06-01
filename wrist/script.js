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
var studyModeWon = false;
const shuffledButtonArray = [];
const shuffledOutlineArray = [];

//the masked image
let maskData = [];
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

mask.addEventListener('load', function(){
    ctx2.drawImage(mask, controlBarSize, 0, mask.naturalWidth, mask.naturalHeight);
    maskData = ctx2.getImageData(controlBarSize, 0, 600, 600);
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
    });

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
var scaphoidOutline = new Outline(controlBarSize, 0, 600, 600, 'scaphoidoutline', 'scaphoid');
var lunateOutline = new Outline(controlBarSize, 0, 600, 600, 'lunateoutline', 'lunate');
var triquetrumOutline = new Outline(controlBarSize, 0, 600, 600, 'triquetrumoutline', 'triquetrum');
var pisiformOutline = new Outline(controlBarSize, 0, 600, 600, 'pisiformoutline', 'pisiform');
var hamateOutline = new Outline(controlBarSize, 0, 600, 600, 'hamateoutline', 'hamate');
var capitateOutline = new Outline(controlBarSize, 0, 600, 600, 'capitateoutline', 'capitate');
var trapezoidOutline = new Outline(controlBarSize, 0, 600, 600, 'trapezoidoutline', 'trapezoid');
var trapeziumOutline = new Outline(controlBarSize + 32, 0 + 5, 600, 600, 'trapeziumoutline', 'trapezium');
var radiusOutline = new Outline(controlBarSize, 0, 600, 600, 'radiusoutline', 'radius');
var ulnaOutline = new Outline(controlBarSize, 0, 600, 600, 'ulnaoutline', 'ulna');
var thumbMCOutline = new Outline(controlBarSize, 0, 600, 600, 'thumbmcoutline', 'thumb MC');
var indexMCOutline = new Outline(controlBarSize, 0, 600, 600, 'indexmcoutline', 'index MC');
var middleMCOutline = new Outline(controlBarSize, 0, 600, 600, 'middlemcoutline', 'middle MC');
var ringMCOutline = new Outline(controlBarSize, 0, 600, 600, 'ringmcoutline', 'ring MC');
var littleMCOutline = new Outline(controlBarSize, 0, 600, 600, 'littlemcoutline', 'little MC');
var thumbproxphalanxOutline = new Outline(controlBarSize, 0, 600, 600, 'thumbproximalphalanxoutline', 'thumb prox phalanx');
var sesamoidOutline = new Outline(controlBarSize, 0, 600, 600, 'sesamoidoutline', 'sesamoid');
outlineArray.push(scaphoidOutline, lunateOutline, triquetrumOutline, pisiformOutline, hamateOutline, capitateOutline, trapezoidOutline, trapeziumOutline, radiusOutline, ulnaOutline, thumbMCOutline, indexMCOutline, middleMCOutline, ringMCOutline, littleMCOutline, thumbproxphalanxOutline, sesamoidOutline);

class Button {
    constructor(x, y, width, height, text) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = document.getElementById("buttonimage")
        this.text = text;
    }
    draw(context){
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
        context.font = '15px Verdana';
        context.fillStyle = "black";
        context.textAlign = 'center';
        context.fillText(this.text, this.x + (this.width/2), this.y+(this.height/1.75));
    }
}
const buttonArray = [];
const learningButton = new Button(0, 0, 150, 40, 'LEARNING MODE');
const studyButton = new Button(150, 0, 150, 40, 'STUDY MODE');

const scaphoidButton = new Button(10, 105, 150, 40, 'SCAPHOID');
const lunateButton = new Button(10, 155, 150, 40, 'LUNATE');
const triquetrumButton = new Button(10, 205, 150, 40, 'TRIQUETRUM');
const pisiformButton = new Button(10, 255, 150, 40, 'PISIFORM');
const hamateButton = new Button(10, 305, 150, 40, 'HAMATE');
const capitateButton = new Button(10, 355, 150, 40, 'CAPITATE');
const trapezoidButton = new Button(10, 405, 150, 40, 'TRAPEZOID');
const trapeziumButton = new Button(10, 455, 150, 40, 'TRAPEZIUM');
const metacarpalsButton = new Button(10, 505, 150, 40, 'METACARPALS');
const sesamoidButton = new Button(10, 555, 150, 40, 'SESAMOID');
buttonArray.push(scaphoidButton, lunateButton, triquetrumButton, pisiformButton, hamateButton, capitateButton, trapezoidButton, trapeziumButton, metacarpalsButton, sesamoidButton);

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
    ctx1.textAlign = 'left';
    //ctx1.fillText(' baseIndex: ' + mouse1.position,50, 100);
    ctx1.fillText('Current mode: ' + currentMode, 20, 62);

    function checker(){        
        if (mouse1.positionX > 0) {
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
        } //tidy up these strings
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
    
    learningButton.draw(ctx1);
    studyButton.draw(ctx1);

    //insert UI element for when studyModeWone === true

}

//code for collision between mouse click and learning button to change currentmode
function modeSelect() {
    if (currentMode === undefined) currentMode = 'LEARNING';
    if (collision(mouse1, learningButton) && mouse1.click) {
        currentMode = 'LEARNING';
        document.getElementById('canvas1').style.borderColor = 'goldenrod';
    }
    if (collision(mouse1, studyButton) && mouse1.click) {
        currentMode = 'STUDY';
        document.getElementById('canvas1').style.borderColor = 'red';
    }
}

function buttonHandler(mouse1) {
    //insert function to shuffle arrays if shuffled array.length === 0

    //draw
    if (currentMode === 'LEARNING'){
        for (let i = 0; i < buttonArray.length; i++){
            buttonArray[i].draw(ctx1);
        }
    }
    //else insert code to draw only selected button

    //hover over buttons in learning mode to highlight bone
    if (mouse1.x && currentMode === 'LEARNING' && collision(scaphoidButton, mouse1)) scaphoidOutline.draw();
    else if (mouse1.x && currentMode === 'LEARNING' && collision(lunateButton, mouse1)) lunateOutline.draw();
    else if (mouse1.x && currentMode === 'LEARNING' && collision(triquetrumButton, mouse1)) triquetrumOutline.draw();
    else if (mouse1.x && currentMode === 'LEARNING' && collision(pisiformButton, mouse1)) pisiformOutline.draw();
    else if (mouse1.x && currentMode === 'LEARNING' && collision(hamateButton, mouse1)) hamateOutline.draw();
    else if (mouse1.x && currentMode === 'LEARNING' && collision(capitateButton, mouse1)) capitateOutline.draw();
    else if (mouse1.x && currentMode === 'LEARNING' && collision(trapezoidButton, mouse1)) trapezoidOutline.draw();
    else if (mouse1.x && currentMode === 'LEARNING' && collision(trapeziumButton, mouse1)) trapeziumOutline.draw();
    else if (mouse1.x && currentMode === 'LEARNING' && collision(metacarpalsButton, mouse1)) {
        thumbMCOutline.draw();
        indexMCOutline.draw();
        middleMCOutline.draw();
        ringMCOutline.draw();
        littleMCOutline.draw();
    }
    else if (mouse1.x && currentMode === 'LEARNING' && collision(sesamoidButton, mouse1)) sesamoidOutline.draw();

    //insert code to check if mouseclick on image matches button
    //if so then splice button from array and display the next one
    //until array length is 0 and studyModeWon gets true

    //insert code to check if mouseclick on button corresponds to outline
    //if so then splice outline from array and display the next one
    //until array length is 0 and studyModeWon gets true

}

//
////function to shuffle buttons to an array, select each element and judge whether the 
//correct bone has been clicked before scoring and progressing

//animate loop
let fps, fpsInterval, startTime, now, then, elapsed; //declare empty variables
function startAnimating(fps){ //function needed to kick off the animation by getting system time and tying fps to system time.
  fpsInterval = 1000/fps; //how much time passes before the next frame is served
  then = Date.now(); //Date.now is no. of ms elapsed since 1.1.1970
  startTime = then;
  animate();
}
function animate(){
    requestAnimationFrame(animate);
    now = Date.now();
    elapsed = now - then;
    if (elapsed > fpsInterval) { //check to see if it's time to draw the next frame
      then = now - (elapsed % fpsInterval);
    ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
    drawBackground('PAwrist');
    modeSelect();
    UI(mouse1, maskData)
    buttonHandler(mouse1);


    //TESTING


    }
}
startAnimating(30);

//TODO
//basic functions
////
//refactor code so it's more plug and play (bone names and RGB data in an object)

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
//LEARNING MODE
//--hover over the buttons to outline the bone. Hover over the bone to display the bone name
//--needs tidied up a little bit
////
//STUDY MODE
//mode1--randomly selected button flashes up, correct bone needs clicked on to pass.
//mode2--outline appears, correct button needs clicked to pass

