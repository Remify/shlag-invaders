
$(document).ready( function() {

    //SCORE
    var score = 0;
    setInterval(function () {
        $('#score').html('Score :' +' '+ score);
        score++;
    }, 100);

});