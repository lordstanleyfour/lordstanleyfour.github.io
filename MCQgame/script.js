window.addEventListener('load', function () {
    const loading = document.getElementById('loading');
    loading.style.display = 'none';
//---------------------------------------------------------//
const canvas1 = document.getElementById('canvas1');
const ctx = canvas1.getContext('2d');
canvas1.width = 900;
canvas1.height = 600;
const fps = 30;

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
var initialShuffle = false;
var categoryPhase, questionPhase, lastChancePhase, endPhase, win, lose;
var categoryXAnchor = 300, categoryYAnchor = 15;
var questionXAnchor = 310, questionYAnchor = 225;
var mobileCatX; var mobileCatXLeft = false; var mobileCatXRight = false;
var hue = 150; var color = 'hsl(' + hue + ', 100%, 50%)';
var score = 0;
var scoreTarget = 10; scoreBarIncrement = 475/scoreTarget;
var savedTime, deadline, timeRemaining; 

let defaultQuestions = [
    {
        questionLine1: "What is the average airspeed",
	    questionLine2: "of an unladen swallow?",
        correctAnswerline1: "African or European",
        correctAnswerline2: "This is answer 1",
        altAnswer1line1: "This is answer 2",
        altAnswer1line2: "This is answer 2",
        altAnswer2line1: "This is answer 3",
        altAnswer2line2: "This is answer 3",
        altAnswer3line1: "This is answer 4",
        altAnswer3line2: "This is answer 4"
    },
    {
        questionLine1: "THIS IS QUESTION B",
	    questionLine2: "AND YOUR MUM IS FAT",
        correctAnswerline1: "This is answer 5",
        correctAnswerline2: "This is answer 5",
        altAnswer1line1: "This is answer 6",
        altAnswer1line2: "This is answer 6",
        altAnswer2line1: "This is answer 7",
        altAnswer2line2: "This is answer 7",
        altAnswer3line1: "This is answer 8",
        altAnswer3line2: "This is answer 8"
    }
];

let alternativeQuestions = [
    {
        questionLine1: "THIS IS QUESTION AA",
	    questionLine2: "AND YOUR MUM IS FAT",
        correctAnswerline1: "This is answer 11",
        correctAnswerline2: "This is answer 11",
        altAnswer1line1: "This is answer 22",
        altAnswer1line2: "This is answer 22",
        altAnswer2line1: "This is answer 33",
        altAnswer2line2: "This is answer 33",
        altAnswer3line1: "This is answer 44",
        altAnswer3line2: "This is answer 44"
    },
    {
        questionLine1: "THIS IS QUESTION BB",
	    questionLine2: "AND YOUR MUM IS FAT",
        correctAnswerline1: "This is answer 55",
        correctAnswerline2: "This is answer 55",
        altAnswer1line1: "This is answer 66",
        altAnswer1line2: "This is answer 66",
        altAnswer2line1: "This is answer 77",
        altAnswer2line2: "This is answer 77",
        altAnswer3line1: "This is answer 88",
        altAnswer3line2: "This is answer 88"
    }
];

let alternativeQuestions2 = [
    {
        questionLine1: "THIS IS QUESTION AAA",
	    questionLine2: "AND YOUR MUM IS FAT",
        correctAnswerline1: "This is answer 111",
        correctAnswerline2: "This is answer 111",
        altAnswer1line1: "This is answer 222",
        altAnswer1line2: "This is answer 222",
        altAnswer2line1: "This is answer 333",
        altAnswer2line2: "This is answer 333",
        altAnswer3line1: "This is answer 444",
        altAnswer3line2: "This is answer 444"
    },
    {
        questionLine1: "THIS IS QUESTION BBB",
	    questionLine2: "AND YOUR MUM IS FAT",
        correctAnswerline1: "This is answer 555",
        correctAnswerline2: "This is answer 555",
        altAnswer1line1: "This is answer 666",
        altAnswer1line2: "This is answer 666",
        altAnswer2line1: "This is answer 777",
        altAnswer2line2: "This is answer 777",
        altAnswer3line1: "This is answer 888",
        altAnswer3line2: "This is answer 888"
    }
];

let alternativeQuestions3 = [
    {
        questionLine1: "THIS IS QUESTION AAAA",
	    questionLine2: "AND YOUR MUM IS FAT",
        correctAnswerline1: "This is answer 1111",
        correctAnswerline2: "This is answer 1111",
        altAnswer1line1: "This is answer 2222",
        altAnswer1line2: "This is answer 2222",
        altAnswer2line1: "This is answer 3333",
        altAnswer2line2: "This is answer 3333",
        altAnswer3line1: "This is answer 4444",
        altAnswer3line2: "This is answer 4444"
    },
    {
        questionLine1: "THIS IS QUESTION BBBB",
	    questionLine2: "AND YOUR MUM IS FAT",
        correctAnswerline1: "This is answer 5555",
        correctAnswerline2: "This is answer 5555",
        altAnswer1line1: "This is answer 6666",
        altAnswer1line2: "This is answer 6666",
        altAnswer2line1: "This is answer 7777",
        altAnswer2line2: "This is answer 7777",
        altAnswer3line1: "This is answer 8888",
        altAnswer3line2: "This is answer 8888"
    }
];

let alternativeQuestions4 = [
    {
        questionLine1: "THIS IS QUESTION AAAAA",
	    questionLine2: "AND YOUR MUM IS FAT",
        correctAnswerline1: "This is answer 11111",
        correctAnswerline2: "This is answer 11111",
        altAnswer1line1: "This is answer 22222",
        altAnswer1line2: "This is answer 22222",
        altAnswer2line1: "This is answer 33333",
        altAnswer2line2: "This is answer 33333",
        altAnswer3line1: "This is answer 44444",
        altAnswer3line2: "This is answer 44444"
    },
    {
        questionLine1: "THIS IS QUESTION BBBBB",
	    questionLine2: "AND YOUR MUM IS FAT",
        correctAnswerline1: "This is answer 55555",
        correctAnswerline2: "This is answer 55555",
        altAnswer1line1: "This is answer 66666",
        altAnswer1line2: "This is answer 66666",
        altAnswer2line1: "This is answer 77777",
        altAnswer2line2: "This is answer 77777",
        altAnswer3line1: "This is answer 88888",
        altAnswer3line2: "This is answer 88888"
    }
];

let questionBoxPositionArray = [{x:questionXAnchor + 40,y:questionYAnchor + 40}, 
                                {x:questionXAnchor + 270,y:questionYAnchor + 40}, 
                                {x:questionXAnchor + 40,y:questionYAnchor + 185}, 
                                {x:questionXAnchor + 270,y:questionYAnchor + 185}];
let lastChanceImageArrayGood = ['good1', 'good2', 'good3', 'good4', 'good5','good6','good7','good8','good9','good10','good11','good12','good13','good14','good15','good16','good17','good18','good19','good20','good21','good22','good23','good24','good25','good26','good27','good28','good29','good30','good31','good32','good33','good34','good35','good36','good37','good38','good39','good40','good41','good42','good43'];
let lastChanceImageArrayBad = ['bad1', 'bad2', 'bad3', 'bad4', 'bad5','bad6','bad7','bad8','bad9','bad10','bad11','bad12','bad13','bad14','bad15','bad16','bad17','bad18','bad19','bad20','bad21','bad22','bad23','bad24','bad25','bad26','bad27','bad28','bad29','bad30','bad31','bad32','bad33','bad34','bad35'];
var goodImageRng = Math.floor(Math.random()*lastChanceImageArrayGood.length);
var badImageRng = Math.floor(Math.random()*lastChanceImageArrayBad.length);

class TargetBox {
    constructor(x, y, w, h, purposeSelect, category){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.text1 = undefined;
        this.text2 = undefined;
	    this.image = undefined;
        this.purposeSelect = purposeSelect;
        this.category = category;
        this.correct = undefined;
        this.position = undefined;
    }
    draw(){
	    //@@@@@ insert if statements to provide image or specific draw instructions based on purposeSelect
        ctx.fillStyle = 'green';
        ctx.strokeStyle = 'black';
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.textAlign = 'center';
        ctx.font = '12px Verdana';
        if (!this.text2) ctx.strokeText(this.text1, this.x + (this.w/2), this.y + (this.h/2));
        else {
            ctx.strokeText(this.text1, this.x + (this.w/2), this.y + (this.h/2) - 5);
            ctx.strokeText(this.text2, this.x + (this.w/2), this.y + (this.h/2) + 10);
        }

        //text for question boxes
        if (questionArraySelected){
            if (this.purposeSelect === 'correctAnswer') {
                this.text1 = questionArraySelected[0].correctAnswerline1;
                if (questionArraySelected[0].correctAnswerline2) this.text2 = questionArraySelected[0].correctAnswerline2;
                this.correct = true;
            } else if (this.purposeSelect === 'altAnswer1') {
                this.text1 = questionArraySelected[0].altAnswer1line1;
                if (questionArraySelected[0].altAnswer1line2) this.text2 = questionArraySelected[0].altAnswer1line2;
                this.correct = false;
            }
            else if (this.purposeSelect === 'altAnswer2') {
                this.text1 = questionArraySelected[0].altAnswer2line1;
                if (questionArraySelected[0].altAnswer2line2) this.text2 = questionArraySelected[0].altAnswer2line2;
                this.correct = false;
            }
            else if (this.purposeSelect === 'altAnswer3') {
                this.text1 = questionArraySelected[0].altAnswer3line1;
                if (questionArraySelected[0].altAnswer3line2) this.text2 = questionArraySelected[0].altAnswer3line2;
                this.correct = false;
            }
        }

        //text for category boxes
        if (this.purposeSelect === 'categorySelect'){
            if (!this.image){
                if (this.category === 'default') {
                    //this.text1 = "defaultQuestions";
                    this.image = document.getElementById('anatomy');
                    if (defaultQuestions.length < 1){
                        
                        //draw a semiopaque black rect over the provided image
                    }
                }
                else if (this.category === 'alternative') {
                    //this.text1 = "alternativeQuestions";
                    this.image = document.getElementById('physics');
                }
                else if (this.category === 'alternative2') {
                    //this.text1 = "alternativeQuestions2";
                    this.image = document.getElementById('pathology');
                }
                else if (this.category === 'alternative3') {
                    //this.text1 = "alternativeQuestions3";
                    this.image = document.getElementById('radspertise');
                }
                else if (this.category === 'alternative4') {
                    //this.text1 = "alternativeQuestions4";
                    this.image = document.getElementById('dailymail');
                }
            } else ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
        }

        //text for initBox
        if (this.purposeSelect === 'continuePrompt'){
            this.text1 = "CONTINUE";
        }

        //last chance boxes
        if (this.purposeSelect === 'lastChance'){
            if (this.category === 'correctImage') {
		    this.image = lastChanceImageArrayGood[goodImageRng];
		    ctx.drawImage(document.getElementById(this.image), this.x, this.y, this.w, this.h);
	    }
            if (this.category === 'incorrectImage') {
		    this.image = lastChanceImageArrayBad[badImageRng];
		    ctx.drawImage(document.getElementById(this.image), this.x, this.y, this.w, this.h);		    
	    }
        }

        //text for restart box
        if (this.purposeSelect === 'restartPrompt') this.text1 = 'Click to restart';
        

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
        } else if (collision(this) && this.correct === false && timeRemaining > 0){
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
            //the incorrect and correct are reversed here so that the player has to select the abnormal image to continue (factoring error)
            if (this.category === 'incorrectImage') {
                lastChancePhase = false;
                rng = Math.floor(Math.random()*3);
                goodImageRng = Math.floor(Math.random()*lastChanceImageArrayGood.length);
                badImageRng = Math.floor(Math.random()*lastChanceImageArrayBad.length);
                categoryPhase = true;
            } else if (this.category === 'correctImage') {
                lastChancePhase = false;
                endPhase = true; 
                lose = true;
            }            
        }

        //restart box select
        else if (collision(this) && this.purposeSelect === 'restartPrompt'){
            location.reload();
        }

        if (this.category === 'default' && defaultQuestions.length < 1) categoryBlackout(this.x, this.y, this.w, this.h);
        if (this.category === 'alternative' && alternativeQuestions.length < 1) categoryBlackout(this.x, this.y, this.w, this.h);
        if (this.category === 'alternative2' && alternativeQuestions2.length < 1) categoryBlackout(this.x, this.y, this.w, this.h);
        if (this.category === 'alternative3' && alternativeQuestions3.length < 1) categoryBlackout(this.x, this.y, this.w, this.h);
        if (this.category === 'alternative4' && alternativeQuestions4.length < 1) categoryBlackout(this.x, this.y, this.w, this.h);
    }
}

//create question boxes
var questionBox1 = new TargetBox(undefined, undefined, 200, 100, 'correctAnswer');
var questionBox2 = new TargetBox(undefined, undefined, 200, 100, 'altAnswer1');
var questionBox3 = new TargetBox(undefined, undefined, 200, 100, 'altAnswer2');
var questionBox4 = new TargetBox(undefined, undefined, 200, 100, 'altAnswer3');
let questionBoxArray = [questionBox1, questionBox2, questionBox3, questionBox4];
//create category boxes (300, 25)
var categoryBox1 = new TargetBox(categoryXAnchor + 15, categoryYAnchor + 45, 100, 140, 'categorySelect', 'default');
var categoryBox2 = new TargetBox(categoryXAnchor + 120, categoryYAnchor + 45, 100, 140, 'categorySelect', 'alternative');
var categoryBox3 = new TargetBox(categoryXAnchor + 225, categoryYAnchor + 45, 100, 140, 'categorySelect', 'alternative2');
var categoryBox4 = new TargetBox(categoryXAnchor + 330, categoryYAnchor + 45, 100, 140, 'categorySelect', 'alternative3');
var categoryBox5 = new TargetBox(categoryXAnchor + 435, categoryYAnchor + 45, 100, 140, 'categorySelect', 'alternative4');
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
    ctx.font = '12px Verdana';
    ctx.strokeStyle = 'black';
    ctx.textAlign = 'center';
    ctx.strokeText('This is where the instructions live', 450, 200);
    ctx.strokeText('Press button to continue', 450, 300);
    //draw and update a continue prompt box
    initBox1.draw();
    initBox1.update();

    //shuffle question arrays
        if (!initialShuffle) {
            //shuffle question array logic in category handler function
            for (let i = defaultQuestions.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = defaultQuestions[i];
                defaultQuestions[i] = defaultQuestions[j];
                defaultQuestions[j] = temp;
            }
            for (let i = alternativeQuestions.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = alternativeQuestions[i];
                alternativeQuestions[i] = alternativeQuestions[j];
                alternativeQuestions[j] = temp;
            }
            for (let i = alternativeQuestions2.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = alternativeQuestions2[i];
                alternativeQuestions2[i] = alternativeQuestions2[j];
                alternativeQuestions2[j] = temp;
            }
            for (let i = alternativeQuestions3.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = alternativeQuestions3[i];
                alternativeQuestions3[i] = alternativeQuestions3[j];
                alternativeQuestions3[j] = temp;
            }
            for (let i = alternativeQuestions4.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = alternativeQuestions4[i];
                alternativeQuestions4[i] = alternativeQuestions4[j];
                alternativeQuestions4[j] = temp;
            }
            initialShuffle = true;
        }
    }

}

function mobileCat(){
    if (categoryPhase){
        if (!mobileCatX) {
            mobileCatXLeft = false; mobileCatXRight = false;
            mobileCatX = 275;
            mobileCatXRight = true;
        }
        if (mobileCatXRight) mobileCatX++;
        if (mobileCatX > 300){
            mobileCatXRight = false;
            mobileCatXLeft = true;
        }
        if (mobileCatXLeft) mobileCatX--;
        if (mobileCatX < 250){
            mobileCatXLeft = false;
            mobileCatXRight = true;            
        }
    }
    if (questionPhase || lastChancePhase) mobileCatX = undefined;
}

function categoryHandler(){
    //if no category selected then display text prompting a choice
    //add function to send to calculate win/lose based on target score trigger endphase
    ////if the question arrays are empty
    if ((defaultQuestions.length + alternativeQuestions.length + alternativeQuestions2.length 
        + alternativeQuestions3.length + alternativeQuestions4.length) > 0 && categoryPhase){
        if (!questionArraySelected){
            //draw background
            ctx.drawImage(document.getElementById('categorybox'), categoryXAnchor, categoryYAnchor+5);
            ctx.drawImage(document.getElementById('panel'), questionXAnchor, questionYAnchor);
           /*  ctx.fillStyle = 'pink';
            ctx.fillRect(categoryXAnchor, categoryYAnchor, 550, 200);
            ctx.strokeStyle = 'black';
            ctx.beginPath();
            ctx.rect(categoryXAnchor, categoryYAnchor, 550, 200);
            ctx.stroke();
            ctx.closePath(); */
            ctx.strokeStyle = 'black';
            ctx.font = '12px Verdana';
            ctx.textAlign = 'center';
            ctx.strokeText('Choose a category', categoryXAnchor + mobileCatX, categoryYAnchor + 35);

            categoryBoxArray.forEach(element => {
                element.draw();
                element.update();  
            })
            drawTimer();
        } 
    } else if ((defaultQuestions.length + alternativeQuestions.length + alternativeQuestions2.length 
        + alternativeQuestions3.length + alternativeQuestions4.length) <= 0 && categoryPhase){
        categoryPhase = false;
        endPhase = true;
        if (score >= scoreTarget) win = true;
        else lose = true;
    }
}

function categoryBlackout(x, y, w, h){
    ctx.fillStyle = 'rgb(0, 0, 0, 0.9)';
    ctx.fillRect(x, y, w, h);
}

function questionHandler(){
    if (questionPhase && questionArraySelected && questionArraySelected.length !== 0){
        //draw background
        ctx.drawImage(document.getElementById('panel'), questionXAnchor, questionYAnchor);
        ctx.drawImage(document.getElementById('categorybox'), categoryXAnchor, categoryYAnchor+5);
        /* ctx.fillStyle = 'pink';
        ctx.fillRect(questionXAnchor, questionYAnchor, 525, 325);
        ctx.strokeStyle = 'black';
        ctx.beginPath();
        ctx.rect(questionXAnchor, questionYAnchor, 525, 325);
        ctx.stroke();
        ctx.closePath();
        ctx.fillStyle = 'rgb(220, 220, 220, 0.8)';
        ctx.strokeSyle = 'black';        
        ctx.fillRect(questionXAnchor + 65, questionYAnchor + 30, 400, 75);
        ctx.rect(questionXAnchor + 65, questionYAnchor + 30, 400, 75);
        ctx.stroke(); */

        //text
        ctx.font = '17px Verdana';
	    ctx.textAlign = 'center';
        ctx.strokeStyle = 'black';
        ctx.strokeText('QUESTION: ' + questionArraySelected[0].questionLine1, questionXAnchor + 265, questionYAnchor -130);
        if (questionArraySelected[0].questionLine2) ctx.strokeText(questionArraySelected[0].questionLine2, questionXAnchor + 265, questionYAnchor -100);
        ctx.strokeText("-----------------------------------------------------------", questionXAnchor + 265, questionYAnchor -60);

        //arrange and draw question boxes
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

        timer(10);
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
        ctx.font = '12px Verdana';
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
        timer(10);
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
            ctx.font = '12px Verdana';
            ctx.strokeStyle = 'black';
            ctx.textAlign = 'center';
            ctx.strokeText('You won', 450, 200);
        } else if (lose) {
            ctx.fillStyle = 'orange';
            ctx.fillRect(50, 50, 800, 500);
            //text
            ctx.font = '12px Verdana';
            ctx.strokeStyle = 'black';
            ctx.textAlign = 'center';
            ctx.strokeText('You failed to win', 450, 200);
            ctx.strokeText('SCORE: ' + score + ' / ' + scoreTarget, 450, 250);
        }
        restartBox.draw(); restartBox.update();
    }
}

function scoreHandler(){
    if (!initPhase && !lastChancePhase && !endPhase){

        //dynamic bar
        if (score > 0 ){
            let barY = 550 - scoreBarIncrement*score;
            let barH = scoreBarIncrement*score;
            ctx.fillStyle = 'purple';
            ctx.fillRect(50, barY, 150, barH);
        }
        //tank image
        ctx.drawImage(document.getElementById('tank'), 50, 75);
        //text
        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'black';
        ctx.font = '12px Verdana';
        ctx.strokeText('SCORE:  ' + score, 100, 100);
    }
    if (score >= scoreTarget){
        questionPhase = false; categoryPhase = false; win = true; endPhase = true;
    }
}

function timer(seconds){    
    if (savedTime === undefined) savedTime = Date.now();
    deadline = savedTime + (seconds*1000);
    timeRemaining = Math.ceil((deadline - Date.now())/1000);
    if (timeRemaining <= 0){
        timeRemaining = 0;
        lose = true; endPhase = true; lastChancePhase = false;
    }
}

function drawBackground(){  
    if (categoryPhase || win) {
        color = 'hsl(' + hue + ', 100%, 50%)';  
        ctx.fillStyle = color;
    } else if (lose) ctx.fillStyle = 'red';
    else if (questionPhase) ctx.fillStyle = 'blue';
    else if (lastChancePhase) ctx.fillStyle = 'black';
    else if (initPhase) ctx.fillStyle = 'pink';
    ctx.fillRect(0, 0, canvas1.width, canvas1.height);
    ctx.drawImage(document.getElementById("backdrop"), 0, 0);
    
}

function drawTimer(){
    if (!lastChancePhase) ctx.drawImage(document.getElementById('watch'), 200, 0);
    else ctx.drawImage(document.getElementById('watch'), 350, 0);
    
    let timerPieX, timerPieY;

    ctx.fillStyle = 'lightblue';
    ctx.strokeStyle = 'lightblue';
    if (!lastChancePhase) {
        timerPieX = 250; timerPieY = 60;
    }
    else {
        timerPieX = 400; timerPieY = 60;   
    }    

    if (timeRemaining === 10){
        ctx.beginPath();
        ctx.arc(timerPieX, timerPieY, 30, 0, 2 * Math.PI);
        ctx.fill();
    }
    else if (timeRemaining === 9){
        ctx.beginPath();        
        ctx.lineTo(timerPieX, timerPieY);
        ctx.arc(timerPieX, timerPieY, 30, 0, 1.8 * Math.PI);
        ctx.lineTo(timerPieX, timerPieY);
        ctx.fill();
        ctx.closePath();
    }   
    else if (timeRemaining === 8){
        ctx.beginPath();        
        ctx.lineTo(timerPieX, timerPieY);
        ctx.arc(timerPieX, timerPieY, 30, 0, 1.6 * Math.PI);
        ctx.lineTo(timerPieX, timerPieY);
        ctx.fill();
        ctx.closePath();
        
    }
    else if (timeRemaining === 7){
        ctx.beginPath();        
        ctx.lineTo(timerPieX, timerPieY);
        ctx.arc(timerPieX, timerPieY, 30, 0, 1.4 * Math.PI);
        ctx.lineTo(timerPieX, timerPieY);
        ctx.fill();
        ctx.closePath();
    }
    else if (timeRemaining === 6){
        ctx.beginPath();        
        ctx.lineTo(timerPieX, timerPieY);
        ctx.arc(timerPieX, timerPieY, 30, 0, 1.2 * Math.PI);
        ctx.lineTo(timerPieX, timerPieY);
        ctx.fill();
        ctx.closePath();
        }
    else if (timeRemaining === 5){
        ctx.beginPath();        
        ctx.lineTo(timerPieX, timerPieY);
        ctx.arc(timerPieX, timerPieY, 30, 0, 1.0 * Math.PI);
        ctx.lineTo(timerPieX, timerPieY);
        ctx.fill();
        ctx.closePath();
    }
    else if (timeRemaining === 4){
        ctx.beginPath();        
        ctx.lineTo(timerPieX, timerPieY);
        ctx.arc(timerPieX, timerPieY, 30, 0, 0.8 * Math.PI);
        ctx.lineTo(timerPieX, timerPieY);
        ctx.fill();
        ctx.closePath();  
    }
    else if (timeRemaining === 3){
        ctx.beginPath();        
        ctx.lineTo(timerPieX, timerPieY);
        ctx.arc(timerPieX, timerPieY, 30, 0, 0.6 * Math.PI);
        ctx.lineTo(timerPieX, timerPieY);
        ctx.fill();
        ctx.closePath();  
    }
    else if (timeRemaining === 2){
        ctx.beginPath();        
        ctx.lineTo(timerPieX, timerPieY);
        ctx.arc(timerPieX, timerPieY, 30, 0, 0.4 * Math.PI);
        ctx.lineTo(timerPieX, timerPieY);
        ctx.fill();
        ctx.closePath();  
    }
    else if (timeRemaining === 1){
        ctx.beginPath();        
        ctx.lineTo(timerPieX, timerPieY);
        ctx.arc(timerPieX, timerPieY, 30, 0, 0.2 * Math.PI);
        ctx.lineTo(timerPieX, timerPieY);
        ctx.fill();
        ctx.closePath();  
    }
    
    if (timeRemaining) {
        ctx.fillStyle = 'black';
        ctx.font = '25px Verdana';
        if (!lastChancePhase) ctx.fillText(timeRemaining, 250, 68);
        else ctx.fillText(timeRemaining, 400, 68);        
    }

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
        drawBackground();
        initHandler();
        categoryHandler();
        mobileCat();
        questionHandler();
        lastChanceHandler();
        endPhaseHandler();
        scoreHandler();
	    
        //drawTimer();
        if (!win) hue += 2;
        else hue += 15;
        if (hue > 360) hue = 0;

        //reset mouse, must be at the end
        if (mouse.lastClickX !== undefined){
            mouse.lastClickX = undefined;
            mouse.lastClickY = undefined;
        }
    }
}
startAnimating(fps);
});

//make a background image (spritesheet?)
////animated bar style rundown timer, themed
//tie time remaining into scoring
//figure out role of scoring;

//refactor the timer pie numbers so that it starts from the 12 o'clock position

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
