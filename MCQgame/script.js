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

var rng = Math.floor(Math.random()*3);
var questionArraySelected = undefined;
var correctAnswerSelected = false;

let defaultQuestions = [
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

let alternativeQuestions = [
    {
        question: "AA",
        correctAnswer: "11",
        altAnswer1: "22",
        altAnswer2: "33",
        altAnswer3: "44"
    },
    {
        question: "BB",
        correctAnswer: "55",
        altAnswer1: "66",
        altAnswer2: "77",
        altAnswer3: "88"
    }
];

let questionBoxPositionArray =[{x:50,y:150}, {x:150,y:150}, {x:50,y:250}, {x:150,y:250}]; 

class TargetBox {
    constructor(x, y, purposeSelect, category){
        this.x = x;
        this.y = y;
        this.w = 50;
        this.h = 50;
        this.text = undefined;
        this.purposeSelect = purposeSelect;
        this.category = category;
        this.correct = undefined;
        this.position = undefined;
    }
    draw(){
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.textAlign = 'center';
        ctx.strokeText(this.text, this.x + (this.w/2), this.y + (this.h/2));
    }
    update(){
        //for question boxes
        if (this.position) {
            this.x = this.position.x;
            this.y = this.position.y
        }
        if (questionArraySelected){
            if (this.purposeSelect === 0) {
                this.text = questionArraySelected[0].correctAnswer;
                this.correct = true;
            } else if (this.purposeSelect === 1) {
                this.text = questionArraySelected[0].altAnswer1;
                this.correct = false;
            }
            else if (this.purposeSelect === 2) {
                this.text = questionArraySelected[0].altAnswer2;
                this.correct = false;
            }
            else if (this.purposeSelect === 3) {
                this.text = questionArraySelected[0].altAnswer3;
                this.correct = false;
            }
        }

        //for category boxes
        if (this.purposeSelect === 4){
            if (this.category === 0) this.text = "defaultQuestions";
            else if (this.category === 1) this.text = "alternativeQuestions";
        }
	
        if (collision(this) && this.correct) {
            console.log('correct');
            correctAnswerSelected = true;
        } else if (collision(this) && this.correct === false){
            console.log('false');
        } else if (collision(this) && this.correct === undefined){
            if (this.category === 0){
                questionArraySelected = defaultQuestions;
            } else if (this.category === 1){
                questionArraySelected = alternativeQuestions;
            }
        }
    }
}

var questionBox1 = new TargetBox(undefined, undefined, 0);
var questionBox2 = new TargetBox(undefined, undefined, 1);
var questionBox3 = new TargetBox(undefined, undefined, 2);
var questionBox4 = new TargetBox(undefined, undefined, 3);
let questionBoxArray = [questionBox1, questionBox2, questionBox3, questionBox4];

var categoryBox1 = new TargetBox(500, 150, 4, 0);
var categoryBox2 = new TargetBox(600, 150, 4, 1);
let categoryBoxArray = [categoryBox1, categoryBox2];



function categoryHandler(){
    //if no category selected then display text prompting a choice

}





function questionHandler(){

    if (questionArraySelected){
        ctx.strokeText("THIS IS WHERE THE QUESTIONS LIVE", 100, 50);
        ctx.strokeText(questionArraySelected[0].question, 50, 75);
    }


    if (correctAnswerSelected){
        questionArraySelected.splice(0, 1);
        correctAnswerSelected = false;
        if (questionArraySelected.length === 0){
            alert("Hooray.");
        }
    }
}

function boxHandler(){
    for (i = 0; i < questionBoxArray.length; i++){
	    if ((rng + i) <= 3){
        	questionBoxArray[i].position = questionBoxPositionArray[rng + i];
	    } else if ((rng + i) > 3) {
		questionBoxArray[i].position = questionBoxPositionArray[((rng+i)-4)];
    	    }        
    }
    questionBoxArray.forEach(element => {
        element.draw();
        element.update();    
    })
    categoryBoxArray.forEach(element => {
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

        //rng = Math.floor(Math.random()*3); Put this wherever the reset ends up


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

//move the category box logic into the category handler function and refactor instructions
//shuffle question array logic in category handler function
//make more category boxes (5 needed)
//for loop in box handler to place category boxes in position
//if question array empty then splice category box
//default (category not selected) behaviour for question box text

//flow -> select category prompt -> category selected -> question boxes displayed -> reselect category on correct
