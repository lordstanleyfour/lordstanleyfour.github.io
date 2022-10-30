window.addEventListener('load', function () {
    const loading = document.getElementById('loading');
    loading.style.display = 'none';
//---------------------------------------------------------//
const canvas1 = document.getElementById('canvas1');
const ctx = canvas1.getContext('2d');
canvas1.style.display = 'initial'; //display canvas only when load complete
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
var categoryPhase, questionPhase, lastChancePhase, endPhase, win, lose, testMode;
var categoryXAnchor = 300, categoryYAnchor = 15;
var questionXAnchor = 310, questionYAnchor = 225;
var mobileCatX; var mobileCatXLeft = false; var mobileCatXRight = false;
var hue = 150; var color = 'hsl(' + hue + ', 100%, 50%)';
var frameX = 0;
var score = 0;
var scoreTarget = 100; scoreBarIncrement = 475/scoreTarget;
var savedTime, deadline, timeRemaining; 

//question template
/* {
    questionLine1: " ",
    questionLine2: " ",
    correctAnswerline1: " ",
    correctAnswerline2: " ",
    altAnswer1line1: " ",
    altAnswer1line2: " ",
    altAnswer2line1: " ",
    altAnswer2line2: " ",
    altAnswer3line1: " ",
    altAnswer3line2: " "
}, */
//ANATOMY & PHYSIOLOGY
let defaultQuestions = [
    {questionLine1: "Which palpable bony landmark is situated ", questionLine2: "on the anterosuperior aspect of the pelvis?", correctAnswerline1: "ASIS", correctAnswerline2: " ", altAnswer1line1: "PSIS", altAnswer1line2: " ", altAnswer2line1: "AIIS", altAnswer2line2: " ", altAnswer3line1: "GT",altAnswer3line2: " "},
    {questionLine1: " What is the palpable lump on the posterior ",questionLine2: "aspect of the occiput called?",correctAnswerline1: "External Occipital Protuberance",correctAnswerline2: " ",altAnswer1line1: "Zygoma",altAnswer1line2: " ",altAnswer2line1: "Naison",altAnswer2line2: " ",altAnswer3line1: "Philtrum",altAnswer3line2: " "},
    {questionLine1: "Which animal is associated with the appearance",questionLine2: " of the zygomata on the OM10 facial bones projection?",correctAnswerline1: "Dolan’s Elephants",correctAnswerline2: " ",altAnswer1line1: "Davidson’s Cats",altAnswer1line2: " ",altAnswer2line1: "McKay’s Pheasants",altAnswer2line2: " ",altAnswer3line1: "Shannon’s Chickens",altAnswer3line2: " "},
    {questionLine1: "On an oblique lumbar spine, which animal is associated ",questionLine2: "with the appearance of the posterior and lateral elements?",correctAnswerline1: "Scotty Dogs",correctAnswerline2: " ",altAnswer1line1: " Japanese Chins",altAnswer1line2: " ",altAnswer2line1: "French Poodles",altAnswer2line2: " ",altAnswer3line1: "German Shepherds",altAnswer3line2: " "}
];

//PHYSICS
let alternativeQuestions = [
    {questionLine1: "An incident electron is deflected around the target nucleus, ",questionLine2: "generating an X-ray photon. This is known as...",correctAnswerline1: "Brehmsstrahlung radiation",correctAnswerline2: " ",altAnswer1line1: "Characteristic radiation",altAnswer1line2: " ",altAnswer2line1: "Hawking radiation",altAnswer2line2: " ",altAnswer3line1: "Gamma radiation",altAnswer3line2: " "},
    {questionLine1: "A grid is used to...",questionLine2: " ",correctAnswerline1: "Reduce scattered radiation ",correctAnswerline2: "to improve image quality",altAnswer1line1: "Reduce the chances of ",altAnswer1line2: "motion artefact",altAnswer2line1: "Allow for a reduced SID",altAnswer2line2: " ",altAnswer3line1: "Determine the correct mAs ",altAnswer3line2: "required for an examination"},
    {questionLine1: "The acronym “DRL” refers to:",questionLine2: " ",correctAnswerline1: "Diagnostic Reference Level",correctAnswerline2: " ",altAnswer1line1: "Dose Reducting Layer",altAnswer1line2: " ",altAnswer2line1: "Diagnostic Reporting Load",altAnswer2line2: " ",altAnswer3line1: "Devious Rotating Lemur",altAnswer3line2: " "},
    {questionLine1: "What is the purpose of output testing?",questionLine2: " ",correctAnswerline1: " Ensure consistent X-ray delivery ",correctAnswerline2: "over multiple exposure settings",altAnswer1line1: "Ensure that the AECs ",altAnswer1line2: "are functioning correctly",altAnswer2line1: "Measure radiographer speed ",altAnswer2line2: "and accuracy",altAnswer3line1: "Ensure the DAP meter ",altAnswer3line2: "is functioning correctly"},
    {questionLine1: "You have doubled your SID; to maintain image density, ",questionLine2: "the mAs should be increased by a factor of:",correctAnswerline1: "4",correctAnswerline2: " ",altAnswer1line1: "2",altAnswer1line2: " ",altAnswer2line1: "8",altAnswer2line2: " ",altAnswer3line1: "No change",altAnswer3line2: " "}

];

//PATHOLOGY
let alternativeQuestions2 = [
    {questionLine1: "Which is a common radiographic feature ",questionLine2: "of Osteoarthritis?",correctAnswerline1: "Osteophytes",correctAnswerline2: " ",altAnswer1line1: "Poorly-defined lucent ",altAnswer1line2: "lesions",altAnswer2line1: "Disorganised trabeculae",altAnswer2line2: " ",altAnswer3line1: "Osteopenia",altAnswer3line2: " "},
    {questionLine1: "Which pathology refers to an infection ",questionLine2: "of bone/bone marrow?",correctAnswerline1: "Osteomyelitis",correctAnswerline2: " ",altAnswer1line1: "Osteoarthritis",altAnswer1line2: " ",altAnswer2line1: "Osteopenia",altAnswer2line2: " ",altAnswer3line1: "Osteochondroma",altAnswer3line2: " "},
    {questionLine1: "Which fluids constitute a liphaemarthrosis?",questionLine2: " ",correctAnswerline1: "Fat and blood",correctAnswerline2: " ",altAnswer1line1: "Fat and pus",altAnswer1line2: " ",altAnswer2line1: "Blood and mucus",altAnswer2line2: " ",altAnswer3line1: "Sweat and tears",altAnswer3line2: " "},
    {questionLine1: "Housemaids knee is the colloquial",questionLine2: " term for a: ",correctAnswerline1: "Joint effusion",correctAnswerline2: "",altAnswer1line1: "Osteoarthritis",altAnswer1line2: "",altAnswer2line1: "Rheumatoid arthritis",altAnswer2line2: "",altAnswer3line1: "Osteomalacia",altAnswer3line2: ""},
    {questionLine1: "A mallet deformity is most commonly the result ",questionLine2: "of which mechanism of injury?",correctAnswerline1: "Forced flexion",correctAnswerline2: " ",altAnswer1line1: "Forced extension",altAnswer1line2: " ",altAnswer2line1: "Forced rotation",altAnswer2line2: " ",altAnswer3line1: "Forced compression",altAnswer3line2: " "},
    {questionLine1: "A fracture not appreciable on imaging ",questionLine2: "is referred to as...",correctAnswerline1: "Occult",correctAnswerline2: " ",altAnswer1line1: "Cheeky",altAnswer1line2: "",altAnswer2line1: "Hidden",altAnswer2line2: " ",altAnswer3line1: "Secret",altAnswer3line2: " "}
    
];

//RADSPERTISE
let alternativeQuestions3 = [
    {questionLine1: "Under IR(ME)R, which duty holder is responsible for ",questionLine2: "providing adequate clinical information to justify a referral?",correctAnswerline1: "Referrer",correctAnswerline2: " ",altAnswer1line1: "Operator",altAnswer1line2: " ",altAnswer2line1: "Practitioner",altAnswer2line2: " ",altAnswer3line1: "Employer",altAnswer3line2: " "},
    {questionLine1: "Wilhelm Roentgen discovered X-rays in which year?",questionLine2: " ",correctAnswerline1: "1895",correctAnswerline2: " ",altAnswer1line1: "1985",altAnswer1line2: " ",altAnswer2line1: "1958",altAnswer2line2: " ",altAnswer3line1: "1858",altAnswer3line2: " "},
    {questionLine1: "When does an operating theatre ",questionLine2: "become a controlled area?",correctAnswerline1: "As soon as there is power ",correctAnswerline2: "to the imaging unit",altAnswer1line1: "As soon as the Radiographer",altAnswer1line2: "says that it is",altAnswer2line1: "As soon as the controlled ",altAnswer2line2: "area signs are displayed",altAnswer3line1: "As soon as the first ",altAnswer3line2: "image is taken"},
    {questionLine1: "You are about to doff your gloves, mask, ",questionLine2: "eye protection and apron; which comes off first? ",correctAnswerline1: "Gloves",correctAnswerline2: " ",altAnswer1line1: "Mask",altAnswer1line2: " ",altAnswer2line1: "Eye protection",altAnswer2line2: " ",altAnswer3line1: "Apron",altAnswer3line2: " "},
    {questionLine1: "A controlled area is defined by ",questionLine2: "which piece of legislation?",correctAnswerline1: "IRR",correctAnswerline2: " ",altAnswer1line1: "IR(ME)R",altAnswer1line2: " ",altAnswer2line1: "Health and Safety at Work Act",altAnswer2line2: " ",altAnswer3line1: "Article 52 of the Lisbon Treaty",altAnswer3line2: " "},
    {questionLine1: "Pregnancy status is usually checked for patients ",questionLine2: "between the age of:",correctAnswerline1: "12 - 55",correctAnswerline2: " ",altAnswer1line1: "16 - 45",altAnswer1line2: " ",altAnswer2line1: "14 - 60",altAnswer2line2: " ",altAnswer3line1: "21 - 50",altAnswer3line2: " "},
    {questionLine1: "Which of these is NOT an HCPC standard of proficiency ",questionLine2: "for Radiographers?",correctAnswerline1: "Maintain a clean police record",correctAnswerline2: " ",altAnswer1line1: "Be able to maintain fitness ",altAnswer1line2: "to practise",altAnswer2line1: "Be able to work appropriately ",altAnswer2line2: "with others",altAnswer3line1: "Be aware of the impact of culture",altAnswer3line2: "equality and diversity on practice"},
    {questionLine1: "Anode targets are often made from which material?",questionLine2: " ",correctAnswerline1: "Tungsten",correctAnswerline2: " ",altAnswer1line1: "Gold",altAnswer1line2: " ",altAnswer2line1: "Steel",altAnswer2line2: " ",altAnswer3line1: "Cheese ",altAnswer3line2: " "}

];

//DAILY MAIL
let alternativeQuestions4 = [
    {questionLine1: "Who did John Major allegedly have ",questionLine2: "an extramarital affair with?",correctAnswerline1: "Edwina Curry",correctAnswerline2: " ",altAnswer1line1: "Margaret Thatcher",altAnswer1line2: " ",altAnswer2line1: "Prince Andrew",altAnswer2line2: " ",altAnswer3line1: "Camilla Parker-Bowles",altAnswer3line2: " "},
    {questionLine1: "Scamorza is a type of: ",questionLine2: " ",correctAnswerline1: "Cheese",correctAnswerline2: " ",altAnswer1line1: "Immigrant",altAnswer1line2: " ",altAnswer2line1: "Meat",altAnswer2line2: " ",altAnswer3line1: "Vegetable",altAnswer3line2: " "},
    {questionLine1: "What was the first music video played on MTV?",questionLine2: " ",correctAnswerline1: "Video Killed the Radio Star",correctAnswerline2: " ",altAnswer1line1: "Bohemian Rhapsody",altAnswer1line2: " ",altAnswer2line1: "Thriller",altAnswer2line2: " ",altAnswer3line1: "Baby Shark",altAnswer3line2: " "}

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
            ctx.strokeText(this.text2, this.x + (this.w/2), this.y + (this.h/2) + 15);
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
        
        //text for debug box
        if (this.purposeSelect === 'test') this.text1 = 'debug';

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
            if (questionArraySelected && !testMode){
                rng = Math.floor(Math.random()*3);
                categoryPhase = false;
                questionPhase = true;
                savedTime = undefined;
            }
            else if (questionArraySelected && testMode){
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
                score -= (10-timeRemaining);
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

        //debug mode select
        if (collision(this) && this.purposeSelect === 'test'){
            initPhase = false; categoryPhase = false; questionPhase = false; lastChancePhase = false; endPhase = false; win = false; lose = false;
            testMode = true; categoryPhase = true;


        }
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
var initBox1 = new TargetBox(400, 460, 100, 50, 'continuePrompt');
//create last chance boxes
var lastBox1 = new TargetBox(undefined, undefined, 300, 500, 'lastChance', 'correctImage');
var lastBox2 = new TargetBox(undefined, undefined, 300, 500, 'lastChance', 'incorrectImage');
let lastChanceBoxArray = [];
//create restart button
var restartBox = new TargetBox(395, 400, 110, 50, 'restartPrompt');
//
var testModeBox = new TargetBox(0, 0, 50, 50, 'test');

function initHandler(){
    if (initPhase){
    //draw a background box
    ctx.fillStyle = 'pink';
    ctx.fillRect(50, 50, 800, 500);
    //text for instructions
    ctx.textAlign = 'center';    
    ctx.font = '50px Verdana'; ctx.strokeStyle = 'black'; ctx.fillStyle = 'red'
    ctx.fillText('ARE YOU READY TO QUIZ!!!!!', 450, 125); ctx.strokeText('ARE YOU READY TO QUIZ!!!!!', 450, 125);
    ctx.font = '25px Verdana'; ctx.fillStyle = 'black';
    ctx.fillText('I hope so, because that\'s what\'s about to happen to you.', 450, 165);
    ctx.font =  '16px Verdana';
    ctx.fillText('You will select questions to answer, within a time limit, from 5 categories.', 450, 230);
    ctx.fillText('If you mess up, you will be shown two X-ray images -', 450, 300);
    ctx.fillText('Choose the ABNORMAL image to save your arse and keep going.', 450, 320);
    ctx.fillText('The target score is ' + scoreTarget + '!  Don\'t let me down now.', 450, 390)
    ctx.fillStyle = 'red'; 
    ctx.fillText('Press button to continue', 450, 450);ctx.strokeText('Press button to continue', 450, 450);
    ctx.drawImage(document.getElementById('pointer'), 280, 470, 100, 100);

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
    //for moving select category text
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
            ctx.drawImage(document.getElementById('pointer'), 200, 100, 100, 100);
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
    if (questionPhase && questionArraySelected && questionArraySelected.length !== 0 && !testMode){
        //draw background
        ctx.drawImage(document.getElementById('panel'), questionXAnchor, questionYAnchor);
        ctx.drawImage(document.getElementById('categorybox'), categoryXAnchor, categoryYAnchor+5);

        //text
        ctx.font = '17px Verdana';
	    ctx.textAlign = 'center';
        ctx.strokeStyle = 'black';
        ctx.strokeText(questionArraySelected[0].questionLine1, questionXAnchor + 265, questionYAnchor -130);
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

        ctx.drawImage(document.getElementById('pointer'), 200, 350, 100, 100);
    }
    //debug mode
    else if (questionPhase && questionArraySelected && questionArraySelected.length !== 0 && testMode){
        //draw background
        ctx.drawImage(document.getElementById('panel'), questionXAnchor, questionYAnchor);
        ctx.drawImage(document.getElementById('categorybox'), categoryXAnchor, categoryYAnchor+5);

        //text
        ctx.font = '17px Verdana';
	    ctx.textAlign = 'center';
        ctx.strokeStyle = 'black';
        ctx.strokeText(questionArraySelected[0].questionLine1, questionXAnchor + 265, questionYAnchor -130);
        if (questionArraySelected[0].questionLine2) ctx.strokeText(questionArraySelected[0].questionLine2, questionXAnchor + 265, questionYAnchor -100);
        ctx.strokeText("-----------------------------------------------------------", questionXAnchor + 265, questionYAnchor -60);

        //arrange and draw question boxes
        for (i = 0; i < questionBoxArray.length; i++){
            questionBoxArray[i].position = questionBoxPositionArray[i];                 
        }

        questionBoxArray.forEach(element => {
            element.draw();
            element.update();
        })

    }

    if (questionPhase && questionArraySelected && questionArraySelected.length === 0){
        questionPhase = false;
        categoryPhase = true;
        //shouldn't be needed but leave in to prevent crash
    }

    if (correctAnswerSelected && !testMode){
        questionArraySelected.splice(0, 1);
        score += timeRemaining;
        rng = Math.floor(Math.random()*3);
        correctAnswerSelected = false;
        questionArraySelected = undefined;
        questionPhase = false;
        categoryPhase = true;
    }
    else if (correctAnswerSelected && testMode){
        questionArraySelected.splice(0, 1);
        correctAnswerSelected = false;
        questionArraySelected = undefined;
        questionPhase = false;
        categoryPhase = true;
        //do something for debugging here
    }
}

function lastChanceHandler(){
    if (lastChancePhase){
        //darken background
        ctx.fillStyle = 'rgb(0, 0, 0, 0.5';
        ctx.fillRect(0, 0, canvas1.width, canvas1.height);
        let anchorX = 100; let anchorY = 50;
        
        //temporary values and calls (w=300, h=500)

        //randomise lastBox positions
        if (rng % 2 == 0){
            lastBox1.x = anchorX; lastBox1.y = anchorY; lastBox2.x = anchorX + 400; lastBox2.y = anchorY;
        } else {
            lastBox2.x = anchorX; lastBox2.y = anchorY; lastBox1.x = anchorX + 400; lastBox1.y = anchorY;
        }

        lastBox1.draw(); lastBox1.update(); lastBox2.draw(); lastBox2.update();  
        timer(10);
        drawTimer();   

        ctx.font = '18px Verdana';
        ctx.strokeStyle = 'white';
        ctx.strokeText('LAST CHANCE! Pick the image with the abnormality...', canvas1.width/2, /* canvas1.height - */ 30);
        ctx.drawImage(document.getElementById("lastchancepointer"), 400, 100);
    }
}

function endPhaseHandler(){
    if (endPhase){
        if (win){
            //background
            ctx.fillStyle = 'orange';
            ctx.fillRect(50, 50, 800, 500);
            //text
            ctx.font = '100px Verdana'; ctx.strokeStyle = 'black'; ctx.fillStyle = 'red';
            ctx.textAlign = 'center';
            ctx.fillText('You won', 450, 200); ctx.strokeText('You won', 450, 200);

            //mosher
            console.log('bum');
            let sw = 200;
            ctx.drawImage(document.getElementById('mosher'), frameX*sw, 0, sw, 200, 100, 300, 200, 200);
            ctx.drawImage(document.getElementById('mosher'), frameX*sw, 0, sw, 200, 600, 300, 200, 200);
            frameX++;
            if (frameX > 4) frameX = 0;
            //winpointer
            ctx.drawImage(document.getElementById('winpointer'), 300, 230);            

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
        ctx.fillStyle = 'red';
        ctx.strokeStyle = 'black';
        ctx.font = '20px Verdana';
        ctx.strokeText('SCORE:  ' + score, 125, 70); ctx.fillText('SCORE:  ' + score, 125, 70);
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
    else ctx.drawImage(document.getElementById('watch'), 400, 0);
    
    let timerPieX, timerPieY;
    let correctedStartAngle = 270*Math.PI/180;
    let correctedEndAngle = ((timeRemaining * 36) - 90)*Math.PI/180;

    ctx.fillStyle = 'lightblue';
    ctx.strokeStyle = 'lightblue';

    //move watch to correct position
    if (!lastChancePhase) {
        timerPieX = 250; timerPieY = 60;
    }
    else {
        timerPieX = 450; timerPieY = 60;   
    }
    
    //draw the pie
    if (timeRemaining === 10){
        ctx.beginPath();
        ctx.arc(timerPieX, timerPieY, 30, 0, Math.PI*2);
        ctx.fill();
    } else {
        ctx.beginPath();        
        ctx.lineTo(timerPieX, timerPieY);
        ctx.arc(timerPieX, timerPieY, 30, correctedStartAngle, correctedEndAngle);
        ctx.lineTo(timerPieX, timerPieY);
        ctx.fill();
        ctx.closePath();    
    }
    
    //draw the number
    if (timeRemaining) {
        ctx.fillStyle = 'black';
        ctx.font = '25px Verdana';
        if (!lastChancePhase) ctx.fillText(timeRemaining, 250, 68);
        else ctx.fillText(timeRemaining, 450, 68);        
    }

}

function debug (){
    testModeBox.draw();
    testModeBox.update();
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

        debug();
	    
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

//make debug function to correctly answer question to skip through questions for testing

//make a background image (spritesheet?)

//factor number of questions asked into final score
//find images for lose screen and tart it up
//draw a line between the panel and the tank

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
