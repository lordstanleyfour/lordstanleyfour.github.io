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
var shuffledButtonArray = [];
var shuffledButtonArrayLength = null;
var shuffledOutlineArray = [];

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

//draw the masked image to canvas2 and get image data
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

//classes and class object declarations
class Outline {
    constructor(x, y, width, height, id, name){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.source = document.getElementById(id);
        this.name = name; //string to check answers in study mode, small case
    }
    draw(){
        ctx1.drawImage(this.source, this.x, this.y, this.width, this.height);
    }
}

//declare outline objects
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
    constructor(x, y, width, height, text, name) {
        this.x = x; //learning mode positions
        this.y = y;
        this.studyX = 70; //study mode positions
        this.studyY = 205;
        this.width = width;
        this.height = height;
        this.image = document.getElementById("buttonimage")
        this.text = text; //text drawn on the button
        this.name = name; //string that the checker function will use to evaluate correct answers
    }
    draw(context){
        //draw the buttons and their text in learning mode
        if (currentMode === 'LEARNING'){
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
            context.font = '15px Verdana';
            if (this.text === 'LEARNING MODE' || this.text === 'STUDY MODE') context.font = 'bold 14px Verdana';
            context.fillStyle = "black";
            context.textAlign = 'center';
            context.fillText(this.text, this.x + (this.width/2), this.y+(this.height/1.75));
        }
        //draw the buttons and their text in study mode, excluding the mode selectors and win button
        else if (currentMode === 'STUDY' && this.text != 'LEARNING MODE' && this.text != 'STUDY MODE' && this.text != 'WELL DONE!'){
            context.drawImage(this.image, this.studyX, this.studyY, this.width, this.height);
            context.font = '15px Verdana';
            context.fillStyle = "black";
            context.textAlign = 'center';
            context.fillText(this.text, this.studyX + (this.width/2), this.studyY+(this.height/1.75));
        }
        //draw the mode selectors in study mode
        else if (currentMode === 'STUDY' && (this.text === 'LEARNING MODE' || this.text === 'STUDY MODE')){
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
            context.font = 'bold 14px Verdana';
            context.fillStyle = "black";
            context.textAlign = 'center';
            context.fillText(this.text, this.x + (this.width/2), this.y+(this.height/1.75));
        }
        //draw the win button in study mode
        else if (currentMode === 'STUDY' && this.text === 'WELL DONE!'){
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
            context.font = 'bold 16px Verdana';
            context.fillStyle = "black";
            context.textAlign = 'center';
            context.fillText(this.text, this.x + (this.width/2), this.y+(this.height*0.33));
            if (this.text === 'WELL DONE!') {
                context.font = '12px Verdana';
                context.fillStyle = "black";
                context.textAlign = 'center';
                context.fillText('Click to restart', this.x + (this.width/2), this.y+(this.height/1.75) + 20);
            }
        }  
    }
}
//non removable buttons
const buttonArray = [];
const learningButton = new Button(0, 0, 150, 40, 'LEARNING MODE');
const studyButton = new Button(150, 0, 150, 40, 'STUDY MODE');
const winButton = new Button(70, 205, 150, 120, 'WELL DONE!');
//declare button objects and push to the main button array
const scaphoidButton = new Button(10, 105, 150, 40, 'SCAPHOID', 'Scaphoid');
const lunateButton = new Button(10, 155, 150, 40, 'LUNATE', 'Lunate');
const triquetrumButton = new Button(10, 205, 150, 40, 'TRIQUETRUM', 'Triquetrum');
const pisiformButton = new Button(10, 255, 150, 40, 'PISIFORM', 'Pisiform');
const hamateButton = new Button(10, 305, 150, 40, 'HAMATE', 'Hamate');
const capitateButton = new Button(10, 355, 150, 40, 'CAPITATE', 'Capitate');
const trapezoidButton = new Button(10, 405, 150, 40, 'TRAPEZOID', 'Trapezoid');
const trapeziumButton = new Button(10, 455, 150, 40, 'TRAPEZIUM', 'Trapezium');
const metacarpalsButton = new Button(10, 505, 150, 40, 'METACARPALS');
const sesamoidButton = new Button(10, 555, 150, 40, 'SESAMOID', 'Sesamoid');
//add seperate metacarpal buttons for study mode and push to array @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
buttonArray.push(scaphoidButton, lunateButton, triquetrumButton, pisiformButton, hamateButton, capitateButton, trapezoidButton, trapeziumButton, metacarpalsButton, sesamoidButton);
//initial shuffle for study mode
shuffleArrays();

//game board
drawBackground = function(id){
    //draw the game image
    let backgroundImage = document.getElementById(id);
    ctx1.drawImage(backgroundImage, controlBarSize, 0, canvas1.width - controlBarSize, canvas1.height);
    //draw the sidebar
    ctx1.fillStyle = 'blue';
    ctx1.fillRect(0, 0, controlsBar.width, controlsBar.height);   
}

//functions and utilities
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
    }    
}

function checker(){        
    //add a statement for each colour used and return a string to describe the landmark
    //string returned must match checker cases to draw the outlines; use .name property
    if (mouse1.positionX > 0) {
        /*ctx1.fillText('R: ' + maskData.data[mouse1.positionRed],50, 150);
        ctx1.fillText('G: ' + maskData.data[mouse1.positionGreen],50, 200);
        ctx1.fillText('B: ' + maskData.data[mouse1.positionBlue],50, 250); */
        if (maskData.data[mouse1.positionRed] === 255 && maskData.data[mouse1.positionGreen] === 0 && maskData.data[mouse1.positionBlue] === 0) return 'Scaphoid';
        else if (maskData.data[mouse1.positionRed] === 125 && maskData.data[mouse1.positionGreen] === 0 && maskData.data[mouse1.positionBlue] === 0) return 'Lunate';
        else if (maskData.data[mouse1.positionRed] === 0 && maskData.data[mouse1.positionGreen] === 255 && maskData.data[mouse1.positionBlue] === 0) return 'Triquetrum';
        else if (maskData.data[mouse1.positionRed] === 0 && maskData.data[mouse1.positionGreen] === 125 && maskData.data[mouse1.positionBlue] === 0) return 'Pisiform';
        else if (maskData.data[mouse1.positionRed] === 0 && maskData.data[mouse1.positionGreen] === 0 && maskData.data[mouse1.positionBlue] === 255) return 'Hamate';
        else if (maskData.data[mouse1.positionRed] === 0 && maskData.data[mouse1.positionGreen] === 0 && maskData.data[mouse1.positionBlue] === 125) return 'Capitate';
        else if (maskData.data[mouse1.positionRed] === 0 && maskData.data[mouse1.positionGreen] === 200 && maskData.data[mouse1.positionBlue] === 0) return 'Trapezoid';
        else if (maskData.data[mouse1.positionRed] === 0 && maskData.data[mouse1.positionGreen] === 0 && maskData.data[mouse1.positionBlue] === 200) return 'Trapezium';
        else if (maskData.data[mouse1.positionRed] === 200 && maskData.data[mouse1.positionGreen] === 0 && maskData.data[mouse1.positionBlue] === 0) return 'Radius';
        else if (maskData.data[mouse1.positionRed] === 200 && maskData.data[mouse1.positionGreen] === 200 && maskData.data[mouse1.positionBlue] === 0) return 'Ulna';
        else if (maskData.data[mouse1.positionRed] === 100 && maskData.data[mouse1.positionGreen] === 0 && maskData.data[mouse1.positionBlue] === 0) return 'Thumb Metacarpal';
        else if (maskData.data[mouse1.positionRed] === 0 && maskData.data[mouse1.positionGreen] === 100 && maskData.data[mouse1.positionBlue] === 0) return 'Index Metacarpal';
        else if (maskData.data[mouse1.positionRed] === 0 && maskData.data[mouse1.positionGreen] === 0 && maskData.data[mouse1.positionBlue] === 100) return 'Middle Metacarpal';
        else if (maskData.data[mouse1.positionRed] === 100 && maskData.data[mouse1.positionGreen] === 100 && maskData.data[mouse1.positionBlue] === 0) return 'Ring Metacarpal';
        else if (maskData.data[mouse1.positionRed] === 100 && maskData.data[mouse1.positionGreen] === 0 && maskData.data[mouse1.positionBlue] === 100) return 'Little Metacarpal';
        else if (maskData.data[mouse1.positionRed] === 0 && maskData.data[mouse1.positionGreen] === 100 && maskData.data[mouse1.positionBlue] === 100) return 'Thumb Proximal Phalanx';
        else if (maskData.data[mouse1.positionRed] === 200 && maskData.data[mouse1.positionGreen] === 100 && maskData.data[mouse1.positionBlue] === 0) return 'Sesamoid';
        else return 'Keep looking...';
    }
}

UI = function (){
    //UI generated text styling
    ctx1.fillStyle = 'white';
    ctx1.font = '20px Verdana';
    ctx1.textAlign = 'center';
    //ctx1.fillText(' baseIndex: ' + mouse1.position,50, 100);
    ctx1.fillText('Current mode: ' + currentMode, 150, 62);
    
    learningButton.draw(ctx1);
    studyButton.draw(ctx1);

    //display highlight images
    switch(checker()){
        case 'Scaphoid':
            scaphoidOutline.draw();
            break;
        case 'Lunate':
            lunateOutline.draw();
            break;
        case 'Triquetrum':
            triquetrumOutline.draw();
            break;
        case 'Pisiform':
            pisiformOutline.draw();
            break;
        case 'Hamate':
            hamateOutline.draw();
            break;
        case 'Capitate':
            capitateOutline.draw();
            break;
        case 'Trapezoid':
            trapezoidOutline.draw();
            break;
        case 'Trapezium':
            trapeziumOutline.draw();
            break;
        case 'Radius':
            radiusOutline.draw();
            break;
        case 'Ulna':
            ulnaOutline.draw();
            break;
        case 'Thumb Metacarpal':
            thumbMCOutline.draw();
            break;        
        case 'Index Metacarpal':
            indexMCOutline.draw();
            break;
        case 'Middle Metacarpal':
            middleMCOutline.draw();
            break;
        case 'Ring Metacarpal':
            ringMCOutline.draw();
            break;
        case 'Little Metacarpal':
            littleMCOutline.draw();
            break;
        case 'Thumb Proximal Phalanx':
            thumbproxphalanxOutline.draw();
            break;
        case 'Sesamoid':
            sesamoidOutline.draw();
            break;
    }

    //display bone name on sidebar when in learning mode
    if (currentMode === 'LEARNING'){
        ctx1.fillStyle = 'white';
        ctx1.font = '20px Verdana';
        ctx1.textAlign = 'center';
        if (checker()) ctx1.fillText(checker(),150, 90);
    }
    //display score in study mode
    if (currentMode === 'STUDY'){
        ctx1.fillStyle = 'white';
        ctx1.font = '20px Verdana';
        ctx1.textAlign = 'center';
        ctx1.fillText('Progress:  ' + (shuffledButtonArrayLength - shuffledButtonArray.length) + '/' + shuffledButtonArrayLength, 150, 100);
    }
}

//mode selector button logic and initialisation of study mode
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
    if (currentMode === 'STUDY') studyMode();
}

//debug (press delete to pass study mode question)
document.addEventListener('keyup', e => {
    if (e.keyCode === 46) shuffledButtonArray.splice(0, 1);
});

function studyMode() {
    //mode1 (button prompt)

    //main logic
    if (shuffledButtonArray.length > 0) {
        shuffledButtonArray[0].draw(ctx1);
        if (checker() === shuffledButtonArray[0].name && mouse1.click) {
            shuffledButtonArray.splice(0, 1);        
        }
    }
    //set win state
    if (shuffledButtonArray.length === 0 && !studyModeWon) {
        studyModeWon = true;
    }
    //restart button
    if (studyModeWon){
        winButton.draw(ctx1);
        if (collision(winButton, mouse1) && mouse1.click){
            studyModeWon = false;
            shuffleArrays();
        }
    }
    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    //insert code to check if mouseclick on button corresponds to outline
    //if so then splice outline from array and display the next one
    //until array length is 0 and studyModeWon gets true
}

function shuffleArrays(){
    if (shuffledButtonArray.length === 0) {
        //ducplicate the button array
        shuffledButtonArray = [...buttonArray];
        //remove unusable learning mode specific buttons
        let index = shuffledButtonArray.indexOf(metacarpalsButton);
        shuffledButtonArray.splice(index, 1);
        //for the scoring UI element
        shuffledButtonArrayLength = shuffledButtonArray.length;
        //shuffle the array
        for (let i = shuffledButtonArray.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = shuffledButtonArray[i];
            shuffledButtonArray[i] = shuffledButtonArray[j];
            shuffledButtonArray[j] = temp;
        }
    }

    if (shuffledOutlineArray.length === 0 && !studyModeWon) {
        shuffledOutlineArray = outlineArray;
        for (let i = shuffledOutlineArray.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = shuffledOutlineArray[i];
            shuffledOutlineArray[i] = shuffledOutlineArray[j];
            shuffledOutlineArray[j] = temp;
        }
    }
}

function buttonHandler(mouse1) {
    //draw buttons in learning mode
    if (currentMode === 'LEARNING'){
        for (let i = 0; i < buttonArray.length; i++){
            buttonArray[i].draw(ctx1);
        }
    }

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
}

//animation loop
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
        UI();
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

