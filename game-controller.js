var running = 0;
var score = 0;
var level = 0;

//Lancer le jeu
function startGame(){
    score = 0;
    spaceship.setPosition(0,0);
    $('#GameOver').css('display','none');
    //On lance le jeu
    if(running != 1){
        if($('#SpaceShip').length == 0){
            $('.canvas').append('<canvas id="SpaceShip"></canvas>');
        }
        requestAnimFrame(tick);
        //SCORE
        running = 1;
        setInterval(function () {

            if(running == 1){
                $('#score').html('Score :' + score);
                score++;
            }
        }, 100);
        running = 1;
    }
    requestAnimFrame(tick);
    //SCORE
    running = 1;

    // Init level up
    levelUp();


    setInterval(function () {

        // Augmente le score en fonction du temps si le jeu est en route
        if(running == 1){
            $('#score').html('Score : ' + score);
            score++;

            calcLevel(score);
        }


    }, 100);
}

function stopGame(){
    //On interrompt le score
    running = 0;
}

function gameOver() {
    stopGame();
    $('#GameOver').css('display','inline');
    spaceship.setPosition(-10,-10);
}

function resetGame() {
    window.location.reload();

}

/**
 * Gère les évenements au changement de niveau
 */
function levelUp() {
    // Augment le niveau
    level++;

    // Augmentation de la vitesse de pop
    ratioPopEnemies = ratioPopEnemies + 0.0005;

    // Augmente la vitesse des ennemies
    ratioSpeedEnemies = ratioSpeedEnemies + 0.0015;

    $('#lvl').html('lvl : ' + level);
}

function calcLevel() {

    switch(score) {
        case 1000:
            levelUp();
            break;
        case 2000:
            levelUp();
            break;
        case 3500:
            levelUp();
            break;
        case 6000:
            levelUp();
            break;
        case 10000:
            levelUp();
            break;
        case 15500:
            levelUp();
            break;
        case 21000:
            levelUp();
            break;
        case 28000:
            levelUp();
            break;
        case 35000:
            levelUp();
            break;
        default:

    }

}

function moveLeft() {
    var pos = spaceship.getPosition();
    if (pos[0] > -0.9) {
        spaceship.setPosition((pos[0] - 0.02), pos[1]);
    }
}
function moveRight() {
    var pos = spaceship.getPosition();
    if (pos[0] < 0.9) {
        spaceship.setPosition((pos[0] + 0.02), pos[1]);
    }
}
function moveForward() {
    var pos = spaceship.getPosition();
    if (pos[1] < 0.9) {
        spaceship.setPosition(pos[0], (pos[1] + 0.02));
    }
}
function moveBackward() {
    var pos = spaceship.getPosition();
    if (pos[1] > -0.9) {
        spaceship.setPosition(pos[0], (pos[1] - 0.02));
    }
}