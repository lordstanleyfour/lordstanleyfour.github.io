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
var initPhase = true;
var categoryPhase, questionPhase, lastChancePhase, endPhase; //switch variables

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
    constructor(x, y, w, h, purposeSelect, category){
        this.x = x;
        this.y = y;
        this.w = w; //add these back in as arguments so this can be used for all boxes
        this.h = h;
        this.text = undefined;
        this.purposeSelect = purposeSelect; //refactor these to strings for readability
        this.category = category;
        this.correct = undefined;
        this.position = undefined;
    }
    draw(){
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.textAlign = 'center';
        ctx.strokeText(this.text, this.x + (this.w/2), this.y + (this.h/2));

        //text for question boxes
        if (questionArraySelected){
            if (this.purposeSelect === 'correctAnswer') {
                this.text = questionArraySelected[0].correctAnswer;
                this.correct = true;
            } else if (this.purposeSelect === 'altAnswer1') {
                this.text = questionArraySelected[0].altAnswer1;
                this.correct = false;
            }
            else if (this.purposeSelect === 'altAnswer2') {
                this.text = questionArraySelected[0].altAnswer2;
                this.correct = false;
            }
            else if (this.purposeSelect === 'altAnswer3') {
                this.text = questionArraySelected[0].altAnswer3;
                this.correct = false;
            }
        }

        //text for category boxes
        if (this.purposeSelect === 'categorySelect'){
            if (this.category === 'default') this.text = "defaultQuestions";
            else if (this.category === 'alternative') this.text = "alternativeQuestions";
        }

        //text for initBox
        if (this.purposeSelect === 'continuePrompt'){
            this.text = "CONTINUE";
        }
    }
    update(){
        //positioning for question boxes
        if (this.position) {
            this.x = this.position.x;
            this.y = this.position.y
            //needed as Qboxes shuffle around
        }
	
        //question box select
        if (collision(this) && this.correct) {
            console.log('correct');
            correctAnswerSelected = true;
        } else if (collision(this) && this.correct === false){
            alert('false');
            //insert trigger for last chance phase
        } 

        //init box select
        else if (collision (this) && this.purposeSelect === 'continuePrompt'){
            if (initPhase){
                initPhase = false;
                categoryPhase = true;
            }
        } 

        //category box select
        else if (collision(this) && this.purposeSelect === 'categorySelect' && !questionArraySelected){
            if (this.category === 'default'){
                questionArraySelected = defaultQuestions;
            } else if (this.category === 'alternative'){
                questionArraySelected = alternativeQuestions;
            }
            if (questionArraySelected){
                categoryPhase = false;
                questionPhase = true;
            }
        }


    }
}

//create question boxes
var questionBox1 = new TargetBox(undefined, undefined, 50, 50, 'correctAnswer');
var questionBox2 = new TargetBox(undefined, undefined, 50, 50, 'altAnswer1');
var questionBox3 = new TargetBox(undefined, undefined, 50, 50, 'altAnswer2');
var questionBox4 = new TargetBox(undefined, undefined, 50, 50, 'altAnswer3');
let questionBoxArray = [questionBox1, questionBox2, questionBox3, questionBox4];
//create category boxes
var categoryBox1 = new TargetBox(500, 150, 75, 100, 'categorySelect', 'default');
var categoryBox2 = new TargetBox(600, 150, 75, 100, 'categorySelect', 'alternative');
let categoryBoxArray = [categoryBox1, categoryBox2];
//create init boxes
var initBox1 = new TargetBox(400, 400, 100, 50, 'continuePrompt');

function initHandler(){
    if (initPhase){
    //draw a background box
    ctx.fillStyle = 'pink';
    ctx.fillRect(50, 50, 800, 500);
    //text for instructions
    ctx.strokeStyle = 'black';
    ctx.textAlign = 'center';
    ctx.strokeText('This is where the instructions live', 450, 200);
    ctx.strokeText('Press button to continue', 450, 300);
    //draw and update a continue prompt box
    initBox1.draw();
    initBox1.update();
    }

}

function categoryHandler(){
    //if no category selected then display text prompting a choice
    if (categoryPhase){
        if (!questionArraySelected){
            ctx.strokeStyle = 'black';
            ctx.textAlign = 'center';
            ctx.strokeText('Choose a category', 600, 100);
            categoryBoxArray.forEach(element => {
                element.draw();
                element.update();  
            })
        }
    }

}





function questionHandler(){

    if (questionPhase && questionArraySelected){
        ctx.strokeText("THIS IS WHERE THE QUESTIONS LIVE", 100, 50);
        ctx.strokeText(questionArraySelected[0].question, 50, 75);
        questionBoxArray.forEach(element => {
            element.draw();
            element.update();
        })
    }

    if (correctAnswerSelected){
        questionArraySelected.splice(0, 1);
        correctAnswerSelected = false;
        
        if (questionArraySelected.length === 0){
            alert("Hooray.");
        }
        questionArraySelected = undefined;
    }
}

function boxHandler(){
    //if question phase active
    for (i = 0; i < questionBoxArray.length; i++){
	    if ((rng + i) <= 3){
        	questionBoxArray[i].position = questionBoxPositionArray[rng + i];
	    } else if ((rng + i) > 3) {
		questionBoxArray[i].position = questionBoxPositionArray[((rng+i)-4)];
    	    }        
    }

    //always active or phase dependant?
/*     questionBoxArray.forEach(element => {
        element.draw();
        element.update();    
    })
    categoryBoxArray.forEach(element => {
        element.draw();
        element.update();  
    }) */
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

        //if statements to determine which main handlers running

        
        initHandler();
        categoryHandler();
        questionHandler();
	    boxHandler(); //always active



        //reset mouse, must be at the end
        if (mouse.lastClickX !== undefined){
            mouse.lastClickX = undefined;
            mouse.lastClickY = undefined;
        }
    }
}
startAnimating(15);

//move the category/question box logic into the category/question handler function and refactor instructions
//move Qbox order shuffle for loop from boxhandler to questionhandler
//shuffle question array logic in category handler function
//make more category boxes (5 needed)
//for loop in box handler to place category boxes in position
//if question array empty then splice category box
//default (category not selected) behaviour for question box text

//mess around with switch variables (categoryPhase = true/false etc.) to control game flow
//make init screen with prompt to continue
//start box

//flow -> select category prompt -> category selected -> question boxes displayed -> reselect category on correct

//INITIALISATION PHASE
////Opening screen introducing the game, instructions, interact to continue
////Behind the scenes the rng runs for the first time
//switch variable
//CATEGORY PHASE
////Select category function runs
////UI element changes to draw attention to the category area
////on selection of the chosen category box the question bank is randomised and the first in the array is passed to a variable as an object then spliced (will splicing also delete the variable data? Test)
//QUESTION PHASE
////the question boxes are populated and drawn
////on selection of correct answer, adjust score, display UI treat then return to category phase
////on selection of incorrect answer go to last chance phase
//LAST CHANCE PHASE
////draw 2 images with collision; select image marked as abnormal
////images chosen from random indices of 2 arrays
////rng odd/even test; if odd then wrong on left, if even then correct on left
////if correct then UI treat then back to category phase
////if wrong then go to game over phase
//GAME OVER PHASE
////game over screen with restart option and score displayed
