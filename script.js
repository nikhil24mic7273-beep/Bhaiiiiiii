const face = document.getElementById("face");
const game = document.getElementById("game");
const scoreDisplay = document.getElementById("score");
const startScreen = document.getElementById("start-screen");
const startButton = document.getElementById("start-button");

let faceY;
let velocity;

let gravity = 0.5;
let jump = -9;

let gameRunning = false;

let pipes = [];
let score = 0;

let pipeTimer;


// START GAME
function startGame() {

    gameRunning = true;

    score = 0;
    scoreDisplay.textContent = score;

    faceY = 300;
    velocity = 0;

    face.style.top = faceY + "px";

    // Remove old pipes
    document.querySelectorAll(".pipe").forEach(pipe => {
        pipe.remove();
    });

    pipes = [];

    startScreen.style.display = "none";

    clearInterval(pipeTimer);

    // Create pipes every 1.8 seconds
    pipeTimer = setInterval(createPipe, 1800);

    gameLoop();
}


// FLAP
function flap() {

    if (!gameRunning) return;

    velocity = jump;
}


// CREATE PIPE
function createPipe() {

    if (!gameRunning) return;

    const gap = 180;

    const minHeight = 80;
    const maxHeight = 400;

    const topHeight =
        Math.floor(
            Math.random() * (maxHeight - minHeight)
        ) + minHeight;

    const bottomHeight =
        700 - topHeight - gap;


    // TOP PIPE
    const topPipe = document.createElement("div");

    topPipe.classList.add("pipe", "top");

    topPipe.style.height = topHeight + "px";
    topPipe.style.left = "500px";


    // BOTTOM PIPE
    const bottomPipe = document.createElement("div");

    bottomPipe.classList.add("pipe", "bottom");

    bottomPipe.style.height = bottomHeight + "px";
    bottomPipe.style.left = "500px";


    game.appendChild(topPipe);
    game.appendChild(bottomPipe);


    pipes.push({
        top: topPipe,
        bottom: bottomPipe,

        x: 500,

        scored: false
    });
}


// GAME LOOP
function gameLoop() {

    if (!gameRunning) return;


    // Gravity
    velocity += gravity;

    faceY += velocity;

    face.style.top = faceY + "px";


    // Move pipes
    pipes.forEach(pipe => {

        pipe.x -= 3;

        pipe.top.style.left = pipe.x + "px";

        pipe.bottom.style.left = pipe.x + "px";


        // SCORE
        if (
            !pipe.scored &&
            pipe.x + 70 < 100
        ) {

            pipe.scored = true;

            score++;

            scoreDisplay.textContent = score;
        }


        // COLLISION
        if (checkCollision(pipe)) {

            gameOver();

        }

    });


    // Remove pipes that left screen
    pipes = pipes.filter(pipe => {

        if (pipe.x < -100) {

            pipe.top.remove();
            pipe.bottom.remove();

            return false;
        }

        return true;

    });


    // Hit ground
    if (faceY > 640) {

        gameOver();

    }


    // Hit ceiling
    if (faceY < 0) {

        gameOver();

    }


    requestAnimationFrame(gameLoop);
}


// COLLISION DETECTION
function checkCollision(pipe) {

    const faceLeft = 100;
    const faceRight = 155;

    const faceTop = faceY;
    const faceBottom = faceY + 55;


    const pipeLeft = pipe.x;
    const pipeRight = pipe.x + 70;


    // Horizontal collision
    if (
        faceRight > pipeLeft &&
        faceLeft < pipeRight
    ) {

        const topHeight =
            pipe.top.offsetHeight;

        const bottomTop =
            700 - pipe.bottom.offsetHeight;


        // Vertical collision
        if (
            faceTop < topHeight ||
            faceBottom > bottomTop
        ) {

            return true;
        }
    }

    return false;
}


// GAME OVER
function gameOver() {

    if (!gameRunning) return;

    gameRunning = false;

    clearInterval(pipeTimer);


    startScreen.style.display = "flex";

    startScreen.querySelector("h1").textContent =
        "GAME OVER";

    startScreen.querySelector("p").textContent =
        "Score: " + score;


    startButton.textContent =
        "PLAY AGAIN";
}


// START BUTTON
startButton.addEventListener(
    "click",
    startGame
);


// KEYBOARD
document.addEventListener(
    "keydown",
    function(event) {

        if (event.code === "Space") {

            event.preventDefault();

            if (!gameRunning) {

                startGame();

            } else {

                flap();

            }

        }

    }
);


// MOUSE / TOUCH
game.addEventListener(
    "click",
    function(event) {

        if (event.target === startButton) {
            return;
        }

        if (gameRunning) {

            flap();

        }

    }
);