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

   $("#startbutton").css("display", "none");
   $("#stopbutton").css("display", "inline");
   $("#resetbutton").css("display", "inline");
}

function stopGame(){
    //On remet tout à zéro
    running = 0;
    score = 0;
    level = 0;
    enemies = [];
    rockets = [];
    ratioPopEnemies = 0;
    ratioSpeedEnemies = 0;
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

    if(score > 1000 && level < 2) {
        levelUp();
        return null;
    }
    if(score > 2000 && level < 3) {
        levelUp();
        return null;
    }
    if(score > 3500 && level < 4) {
        levelUp();
        return null;
    }
    if(score > 6000 && level < 5) {
        levelUp();
        return null;
    }
    if(score > 10000 && level < 6) {
        levelUp();
        return null;
    }
    if(score > 15500 && level < 7) {
        levelUp();
        return null;
    }
    if(score > 21000 && level < 8) {
        levelUp();
        return null;
    }
    if(score > 28000 && level < 9) {
        levelUp();
        return null;
    }
    if(score > 35000 && level < 10) {
        levelUp();
        return null;
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