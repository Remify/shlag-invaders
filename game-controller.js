var running = 0;
//Lancer le jeu
function startGame(){
    //On lance le jeu
    if($('#SpaceShip').length == 0){
        $('.canvas').append('<canvas id="SpaceShip"></canvas>');
    }
    requestAnimFrame(tick);
    //SCORE
    running = 1;
    var score = 0;
    setInterval(function () {
        if(running == 1){
            $('#score').html('Score :' + score);
            score++;
        }
    }, 100);
}

function stopGame(){

    //TODO: ajouter div par dessus canvas

    //On interrompt le score
    running = 0;
}

function resetGame() {

}

$(document).ready( function() {





});



