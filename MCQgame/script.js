const canvas1 = document.getElementById('canvas1');
const ctx = canvas1.getContext('2d');
canvas1.width = 900;
canvas1.height = 600;
const fps = 15;

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
var categoryPhase, questionPhase, lastChancePhase, endPhase, win, lose;
var score = 0;
var scoreTarget = 10; scoreBarIncrement = 475/scoreTarget;
var savedTime, deadline, timeRemaining; 

let defaultQuestions = [
    {
        questionLine1: "THIS IS QUESTION A",
	questionLine2: "AND YOUR MUM IS FAT",
        correctAnswer: "This is answer 1",
        altAnswer1: "This is answer 2",
        altAnswer2: "This is answer 3",
        altAnswer3: "This is answer 4"
    },
    {
        questionLine1: "THIS IS QUESTION B",
	questionLine2: "AND YOUR MUM IS FAT",
        correctAnswer: "This is answer 5",
        altAnswer1: "This is answer 6",
        altAnswer2: "This is answer 7",
        altAnswer3: "This is answer 8"
    }
];

let alternativeQuestions = [
    {
        questionLine1: "THIS IS QUESTION AA",
	questionLine2: "AND YOUR MUM IS FAT",
        correctAnswer: "This is answer 11",
        altAnswer1: "This is answer 22",
        altAnswer2: "This is answer 33",
        altAnswer3: "This is answer 44"
    },
    {
        questionLine1: "THIS IS QUESTION BB",
	questionLine2: "AND YOUR MUM IS FAT",
        correctAnswer: "This is answer 55",
        altAnswer1: "This is answer 66",
        altAnswer2: "This is answer 77",
        altAnswer3: "This is answer 88"
    }
];

let alternativeQuestions2 = [
    {
        questionLine1: "THIS IS QUESTION AAA",
	questionLine2: "AND YOUR MUM IS FAT",
        correctAnswer: "This is answer 111",
        altAnswer1: "This is answer 222",
        altAnswer2: "This is answer 333",
        altAnswer3: "This is answer 444"
    },
    {
        questionLine1: "THIS IS QUESTION BBB",
	questionLine2: "AND YOUR MUM IS FAT",
        correctAnswer: "This is answer 555",
        altAnswer1: "This is answer 666",
        altAnswer2: "This is answer 777",
        altAnswer3: "This is answer 888"
    }
];

let alternativeQuestions3 = [
    {
        questionLine1: "THIS IS QUESTION AAAA",
	questionLine2: "AND YOUR MUM IS FAT",
        correctAnswer: "This is answer 1111",
        altAnswer1: "This is answer 2222",
        altAnswer2: "This is answer 3333",
        altAnswer3: "This is answer 4444"
    },
    {
        questionLine1: "THIS IS QUESTION BBBB",
	questionLine2: "AND YOUR MUM IS FAT",
        correctAnswer: "This is answer 5555",
        altAnswer1: "This is answer 6666",
        altAnswer2: "This is answer 7777",
        altAnswer3: "This is answer 8888"
    }
];

let alternativeQuestions4 = [
    {
        questionLine1: "THIS IS QUESTION AAAAA",
	questionLine2: "AND YOUR MUM IS FAT",
        correctAnswer: "This is answer 11111",
        altAnswer1: "This is answer 22222",
        altAnswer2: "This is answer 33333",
        altAnswer3: "This is answer 44444"
    },
    {
        questionLine1: "THIS IS QUESTION BBBBB",
	questionLine2: "AND YOUR MUM IS FAT",
        correctAnswer: "This is answer 55555",
        altAnswer1: "This is answer 66666",
        altAnswer2: "This is answer 77777",
        altAnswer3: "This is answer 88888"
    }
];

let questionBoxPositionArray =[{x:550,y:400}, {x:650,y:400}, {x:550,y:500}, {x:650,y:500}];
let lastChanceImageArrayGood = ['good1', 'good2', 'good3'];
let lastChanceImageArrayBad = ['bad1', 'bad2', 'bad3'];
var goodImageRng = Math.floor(Math.random()*lastChanceImageArrayGood.length);
var badImageRng = Math.floor(Math.random()*lastChanceImageArrayBad.length);

class TargetBox {
    constructor(x, y, w, h, purposeSelect, category){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.text = undefined;
	this.image = undefined;
        this.purposeSelect = purposeSelect;
        this.category = category;
        this.correct = undefined;
        this.position = undefined;
    }
    draw(){
	    //@@@@@ insert if statements to provide image or specific draw instructions based on purposeSelect
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
            else if (this.category === 'alternative2') this.text = "alternativeQuestions2";
            else if (this.category === 'alternative3') this.text = "alternativeQuestions3";
            else if (this.category === 'alternative4') this.text = "alternativeQuestions4";
        }

        //text for initBox
        if (this.purposeSelect === 'continuePrompt'){
            this.text = "CONTINUE";
        }

        //last chance boxes
        if (this.purposeSelect === 'lastChance'){
            if (this.category === 'correctImage') {
		    this.image = lastChanceImageArrayGood[goodImageRng];
		    ctx.drawImage(document.getElementById(this.image), this.x, this.y, this.w, this.h);
		    //this.text = 'correct image';
	    }
            if (this.category === 'incorrectImage') {
		    this.image = lastChanceImageArrayBad[badImageRng];
		    ctx.drawImage(document.getElementById(this.image), this.x, this.y, this.w, this.h);		    
		    //this.text = 'incorrect image';
	    }
        }

        //text for restart box
        if (this.purposeSelect === 'restartPrompt') this.text = 'Click to restart';
        

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
            correctAnswerSelected = true;
            rng = Math.floor(Math.random()*3);
        } else if (collision(this) && this.correct === false){
            //reset mouse so that it doesn't interfere with last chance
            if (mouse.lastClickX !== undefined){
                mouse.lastClickX = undefined;
                mouse.lastClickY = undefined;
            }
            rng = Math.floor(Math.random()*3);
            questionPhase = false;
            lastChancePhase = true;
            questionArraySelected = undefined;
            score--;
            savedTime = undefined;
        } 

        //init box select
        else if (collision (this) && this.purposeSelect === 'continuePrompt'){
            if (initPhase){
                rng = Math.floor(Math.random()*3);
                initPhase = false;
                categoryPhase = true;
            }
        } 

        //category box select
        else if (collision(this) && this.purposeSelect === 'categorySelect' && !questionArraySelected){
            if (this.category === 'default' && defaultQuestions.length > 0){
                rng = Math.floor(Math.random()*3);
                questionArraySelected = defaultQuestions;
            } else if (this.category === 'alternative' && alternativeQuestions.length > 0){
                rng = Math.floor(Math.random()*3);
                questionArraySelected = alternativeQuestions;
            } else if (this.category === 'alternative2' && alternativeQuestions2.length > 0){
                rng = Math.floor(Math.random()*3);
                questionArraySelected = alternativeQuestions2;
            } else if (this.category === 'alternative3' && alternativeQuestions3.length > 0){
                rng = Math.floor(Math.random()*3);
                questionArraySelected = alternativeQuestions3;
            } else if (this.category === 'alternative4' && alternativeQuestions4.length > 0){
                rng = Math.floor(Math.random()*3);
                questionArraySelected = alternativeQuestions4;
            }
            if (questionArraySelected){
                rng = Math.floor(Math.random()*3);
                categoryPhase = false;
                questionPhase = true;
                savedTime = undefined;
            }            
        }

        //last chance box select
        else if (collision(this) && this.purposeSelect === 'lastChance'){
            if (this.category === 'correctImage') {
                lastChancePhase = false;
                rng = Math.floor(Math.random()*3);
		goodImageRng = Math.floor(Math.random()*lastChanceImageArrayGood.length);
		badImageRng = Math.floor(Math.random()*lastChanceImageArrayBad.length);
                categoryPhase = true;
            } else if (this.category === 'incorrectImage') {
                lastChancePhase = false;
                endPhase = true; 
                lose = true;
            }            
        }

        //restart box select
        else if (collision(this) && this.purposeSelect === 'restartPrompt'){
            location.reload();
        }

        if (this.category === 'default' && defaultQuestions.length < 1) this.text = 'DONE';
        if (this.category === 'alternative' && alternativeQuestions.length < 1) this.text = 'DONE';
        if (this.category === 'alternative2' && alternativeQuestions2.length < 1) this.text = 'DONE';
        if (this.category === 'alternative3' && alternativeQuestions3.length < 1) this.text = 'DONE';
        if (this.category === 'alternative4' && alternativeQuestions4.length < 1) this.text = 'DONE';
    }
}

//create question boxes
var questionBox1 = new TargetBox(undefined, undefined, 50, 50, 'correctAnswer');
var questionBox2 = new TargetBox(undefined, undefined, 50, 50, 'altAnswer1');
var questionBox3 = new TargetBox(undefined, undefined, 50, 50, 'altAnswer2');
var questionBox4 = new TargetBox(undefined, undefined, 50, 50, 'altAnswer3');
let questionBoxArray = [questionBox1, questionBox2, questionBox3, questionBox4];
//create category boxes
var categoryBox1 = new TargetBox(350, 100, 75, 100, 'categorySelect', 'default');
var categoryBox2 = new TargetBox(450, 100, 75, 100, 'categorySelect', 'alternative');
var categoryBox3 = new TargetBox(550, 100, 75, 100, 'categorySelect', 'alternative2');
var categoryBox4 = new TargetBox(650, 100, 75, 100, 'categorySelect', 'alternative3');
var categoryBox5 = new TargetBox(750, 100, 75, 100, 'categorySelect', 'alternative4');
let categoryBoxArray = [categoryBox1, categoryBox2, categoryBox3, categoryBox4, categoryBox5];
//create init boxes
var initBox1 = new TargetBox(400, 400, 100, 50, 'continuePrompt');
//create last chance boxes
var lastBox1 = new TargetBox(undefined, undefined, 300, 500, 'lastChance', 'correctImage');
var lastBox2 = new TargetBox(undefined, undefined, 300, 500, 'lastChance', 'incorrectImage');
let lastChanceBoxArray = [];
//create restart button
var restartBox = new TargetBox(395, 400, 110, 50, 'restartPrompt');

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
            //draw background
            ctx.fillStyle = 'pink';
            ctx.fillRect(300, 25, 550, 200);
            ctx.strokeStyle = 'black';
            ctx.beginPath();
            ctx.rect(300, 25, 550, 200);
            ctx.stroke();
            ctx.closePath();
            ctx.strokeStyle = 'black';
            ctx.textAlign = 'center';
            ctx.strokeText('Choose a category', 600, 50);

            categoryBoxArray.forEach(element => {
                element.draw();
                element.update();  
            })
            drawTimer();
        }
    }

}

function questionHandler(){

    if (questionPhase && questionArraySelected && questionArraySelected.length !== 0){
        //draw background
        ctx.fillStyle = 'pink';
        ctx.fillRect(500, 250, 350, 325);
        ctx.strokeStyle = 'black';
        ctx.beginPath();
        ctx.rect(500, 250, 350, 325);
        ctx.stroke();
        ctx.closePath();
	ctx.textAlign = 'center';
        ctx.strokeText("-----------------------------------------------------------", 650, 350);
        ctx.strokeText('QUESTION: ' + questionArraySelected[0].questionLine1, 650, 300);
        if (questionArraySelected[0].questionLine2) ctx.strokeText(questionArraySelected[0].questionLine2, 650, 325);

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
        timer(11);
        drawTimer();
    }

    if (questionPhase && questionArraySelected && questionArraySelected.length === 0){
        questionPhase = false;
        categoryPhase = true;
        //shouldn't be needed but leave in to prevent crash
    }

    if (correctAnswerSelected){
        questionArraySelected.splice(0, 1);
        score++;
        rng = Math.floor(Math.random()*3);
        correctAnswerSelected = false;
        questionArraySelected = undefined;
        questionPhase = false;
        categoryPhase = true;
    }
}

function lastChanceHandler(){
    if (lastChancePhase){
        //darken background
        ctx.fillStyle = 'rgb(0, 0, 0, 0.5';
        ctx.fillRect(0, 0, canvas1.width, canvas1.height);
        ctx.strokeStyle = 'black';
        ctx.strokeText('LAST CHANCE! Pick the image with the abnormality...', canvas1.width/2, 25);

        //temporary values and calls (w=300, h=500)
        //randomise lastBox positions
        if (rng % 2 == 0){
            lastBox1.x = 50; lastBox1.y = 50; lastBox2.x = 450; lastBox2.y = 50;
        } else {
            lastBox2.x = 50; lastBox2.y = 50; lastBox1.x = 450; lastBox1.y = 50;
        }

        lastBox1.draw(); lastBox1.update(); lastBox2.draw(); lastBox2.update();  
        timer(11);
        drawTimer();      
    }
}

function endPhaseHandler(){
    if (endPhase){
        if (win){
            //background
            ctx.fillStyle = 'orange';
            ctx.fillRect(50, 50, 800, 500);
            //text
            ctx.strokeStyle = 'black';
            ctx.textAlign = 'center';
            ctx.strokeText('You won', 450, 200);
        } else if (lose) {
            ctx.fillStyle = 'orange';
            ctx.fillRect(50, 50, 800, 500);
            //text
            ctx.strokeStyle = 'black';
            ctx.textAlign = 'center';
            ctx.strokeText('You failed to win', 450, 200);
        }
        restartBox.draw(); restartBox.update();
    }
}

function scoreHandler(){
    if (!initPhase && !lastChancePhase && !endPhase){
        ctx.fillStyle = 'pink';
        ctx.fillRect(50, 75, 150, 475);

        let barY = 550 - scoreBarIncrement*score;
        let barH = scoreBarIncrement*score;
        ctx.fillStyle = 'lightblue';
        ctx.fillRect(50, barY, 150, barH);

        ctx.strokeStyle = 'black';
        ctx.beginPath();
        ctx.rect(50, 75, 150, 475);
        ctx.stroke();
        ctx.closePath();

        ctx.fillStyle = 'black';
        ctx.strokeText('SCORE:  ' + score, 100, 100);
    }
    if (score >= scoreTarget){
        questionPhase = false; categoryPhase = false; win = true; endPhase = true;
    }
}

function timer(seconds){    
    if (savedTime === undefined) savedTime = Date.now();
    deadline = savedTime + (seconds*1000);
    timeRemaining = Math.floor((deadline - Date.now())/1000);
    if (timeRemaining <= 0){
        timeRemaining = 0;
        lose = true; endPhase = true;
    }
}
function drawTimer(){
    ctx.fillStyle = 'lightblue';
    ctx.fillRect(0, 0, 50, 50);
    ctx.strokeStyle = 'black'
    ctx.strokeText(timeRemaining, 25, 25);
}
	

/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////animation loop/////////////////////////////////////
let fpsInterval, startTime, now, then, elapsed; //declare empty variables
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
        
        initHandler();
        categoryHandler();
        questionHandler();
        lastChanceHandler();
        endPhaseHandler();
        scoreHandler();
	    
        //drawTimer();
        //reset mouse, must be at the end
        if (mouse.lastClickX !== undefined){
            mouse.lastClickX = undefined;
            mouse.lastClickY = undefined;
        }
    }
}
startAnimating(fps);

//shuffle question array logic in category handler function
        /*for (let i = defaultQuestions.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = defaultQuestions[i];
            defaultQuestions[i] = defaultQuestions[j];
            defaultQuestions[j] = temp;
        }
    }*/

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
