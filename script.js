const emojis = [
    "🍎","🍌","🍇","🍉",
    "🍓","🍒","🥝","🍍",
    "🥑","🥥","🍋","🍑"
];

let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;

let moves = 0;
let matches = 0;



const board = document.getElementById("gameBoard");
const timerText = document.getElementById("timer");
const movesText = document.getElementById("moves");
const restartBtn = document.getElementById("restart");
const winMessage = document.getElementById("winMessage");
const loseMessage = document.getElementById("loseMessage");

// -------------------------
// Shuffle (Fisher-Yates)
// -------------------------
function shuffle(array){
    for(let i = array.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// -------------------------
// Create Game Board
// -------------------------
function createBoard(){

    board.innerHTML = "";

    cards = [...emojis, ...emojis];
    shuffle(cards);

    cards.forEach(emoji =>{

        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <div class="front">${emoji}</div>
            <div class="back">?</div>
        `;

        card.dataset.emoji = emoji;

        card.addEventListener("click", flipCard);

        board.appendChild(card);

    });

}

// -------------------------
// Countdown Timer (2 Minutes)
// -------------------------

let timer = null;
let totalTime = 120; // 2 minutes = 120 seconds
let started = false;

function updateTimer() {
    let minutes = Math.floor(totalTime / 60);
    let seconds = totalTime % 60;

    timerText.textContent =
        `Time: ${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function startTimer() {

    updateTimer();

    timer = setInterval(() => {

        totalTime--;

        updateTimer();

        if (totalTime <= 0) {

            clearInterval(timer);
             

            setTimeout(()=>{

                loseMessage.classList.remove("hidden");

            },500);

            // Disable all cards
            lockBoard = true;

            

        }

    }, 1000);

}

// -------------------------
// Flip Card
// -------------------------
function flipCard(){

    if(lockBoard) return;

    if(this === firstCard) return;

    if(this.classList.contains("matched")) return;

    if(!started){
        started = true;
        startTimer();
    }

    this.classList.add("flip");

    if(!firstCard){

        firstCard = this;
        return;

    }

    secondCard = this;

    lockBoard = true;

    moves++;
    movesText.textContent = "Moves: " + moves;

    checkMatch();

}

// -------------------------
// Check Match
// -------------------------
function checkMatch(){

    if(firstCard.dataset.emoji === secondCard.dataset.emoji){

        firstCard.classList.add("matched");
        secondCard.classList.add("matched");

        matches++;

        resetTurn();

        if(matches === 12){

            clearInterval(timer);

           

            setTimeout(()=>{

                winMessage.classList.remove("hidden");

            },500);

            

        }

    }
    else{

        setTimeout(()=>{

            firstCard.classList.remove("flip");
            secondCard.classList.remove("flip");

            resetTurn();

        },800);

    }

}

// -------------------------
// Reset Turn
// -------------------------
function resetTurn(){

    firstCard = null;
    secondCard = null;
    lockBoard = false;

}

// -------------------------
// Restart
// -------------------------
function restartGame(){

    clearInterval(timer);

    timer = null;
    totalTime = 120;
    started = false;

    moves = 0;
    matches = 0;

    timerText.textContent = "Time: 00:00";
    movesText.textContent = "Moves: 0";

    winMessage.classList.add("hidden");
    loseMessage.classList.add("hidden");

    firstCard = null;
    secondCard = null;
    lockBoard = false;

    updateTimer();
    createBoard();

}

restartBtn.addEventListener("click", restartGame);

createBoard();