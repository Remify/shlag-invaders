var running = 0;
var score = 0;
//Lancer le jeu
function startGame(){
    score = 0;
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
}

function stopGame(){
    //On interrompt le score
    running = 0;
}

function gameOver() {
    stopGame();
    $('#GameOver').css('display','inline');
    //alert("game over");
}

function resetGame() {
    window.location.reload();
}

