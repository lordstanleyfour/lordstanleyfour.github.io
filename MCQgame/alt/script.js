const canvas1 = document.getElementById('canvas1');
const ctx = canvas1.getContext('2d');
canvas1.width = 900;
canvas1.height = 600;

const mouse = {
    lastClickX: undefined,
    lastClickY: undefined
}

canvas1.addEventListener('click', (e) => {
    mouse.lastClickX = e.offsetX;
    mouse.lastClickY = e.offsetY;
});

function collision (object){
    if (    !(  mouse.lastClickX > object.x + object.w ||
                mouse.lastClickX < object.x ||
                mouse.lastClickY > object.y + object.h ||
                mouse.lastClickY < object.y) &&
                mouse.lastClickX !== undefined
                //if any of these statements is true there can't be a collision
    ) {
        return true;
    }    
}

var rng = 1; /*Math.floor(Math.random()*3);*/
var correctAnswerSelected = false;

let questions = [
    {
        question: "A",
        correctAnswer: "1",
        altAnswer1: "2",
        altAnswer2: "3",
        altAnswer3: "4"
    },
    {
        question: "B",
        correctAnswer: "5",
        altAnswer1: "6",
        altAnswer2: "7",
        altAnswer3: "8"
    }
];

let positionArray =[{x:50,y:150}, {x:150,y:150}, {x:50,y:250}, {x:150,y:250}]; 

class TargetBox {
    constructor(x, y, w, h, text, correct){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.text = text;
        this.correct = correct;
        this.position = undefined;
    }
    draw(){
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.strokeText(this.text, this.x + (this.w/2), this.y + (this.h/2));
    }
    update(){
        if (this.position) {
            this.x = this.position.x;
            this.y = this.position.y
        }
	
        if (collision(this) && this.correct) console.log('clicked');       
    }
}

var boxA = new TargetBox(undefined, undefined, 50, 50, questions[0].correctAnswer, true);
var boxB = new TargetBox(undefined, undefined, 50, 50, questions[0].altAnswer1, false);
var boxC = new TargetBox(undefined, undefined, 50, 50, questions[0].altAnswer2, false);
var boxD = new TargetBox(undefined, undefined, 50, 50, questions[0].altAnswer3, false);

let boxArray = [boxA, boxB, boxC, boxD];

function questionHandler(){
    ctx.strokeText("THIS IS WHERE THE QUESTIONS LIVE", 50, 50);
    ctx.strokeText(questions[0].question, 50, 75);

    if (correctAnswerSelected){
	boxArray.forEach(element => {
            //select next question
    
        })
    }
}

function boxHandler(){
    for (i = 0; i < boxArray.length; i++){
	    if ((rng + i) <= 3){
        	boxArray[i].position = positionArray[rng + i];
	    } else if ((rng + i) > 3) {
		boxArray[i].position = positionArray[((rng+i)-4)];
    	    }        
    }
    boxArray.forEach(element => {
        element.draw();
        element.update();
    
    })
}

	

/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////animation loop/////////////////////////////////////
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
        ctx.clearRect(0, 0, canvas1.width, canvas1.height);

        //rng = Math.floor(Math.random()*(4-1+1)+1); Put this wherever the reset ends up


        questionHandler();
	boxHandler();




        //reset mouse
        if (mouse.lastClickX !== undefined){
            mouse.lastClickX = undefined;
            mouse.lastClickY = undefined;
        }
    }
}
startAnimating(15);



////declare fixed positions 1-4 for the boxes
////box A with the correct answer gets positionRNG
////boxes B-D get assigned progressive positions from positionRNG
////"IF rng >=4 then box goes to position (rng+1)-3"
