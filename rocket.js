var RocketShader;

function initRocketShader() {
    RocketShader = initShaders("rocket-vs","rocket-fs");

    // active ce shader
    gl.useProgram(RocketShader);

    // recupere la localisation de l'attribut dans lequel on souhaite acceder aux positions
    RocketShader.vertexPositionAttribute = gl.getAttribLocation(RocketShader, "aVertexPosition");
    gl.enableVertexAttribArray(RocketShader.vertexPositionAttribute); // active cet attribut 

    // pareil pour les coordonnees de texture 
    RocketShader.vertexCoordAttribute = gl.getAttribLocation(RocketShader, "aVertexCoord");
    gl.enableVertexAttribArray(RocketShader.vertexCoordAttribute);

    // adresse de la variable uniforme uOffset dans le shader
    RocketShader.positionUniform = gl.getUniformLocation(RocketShader, "uPosition");
    RocketShader.maTextureUniform = gl.getUniformLocation(RocketShader, "uRocketTexture");

    console.log("Rocket shader initialized");
}

function Rocket() {
    this.initParameters();

    // cree un nouveau buffer sur le GPU et l'active
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

    // un tableau contenant les positions des sommets (sur CPU donc)
    var wo2 = 0.5*this.width;
    var ho2 = 0.5*this.height;

    var vertices = [
        -wo2,-ho2, -0.5,
        wo2,-ho2, -0.5,
        wo2, ho2, -0.5,
        -wo2, ho2, -0.5
    ];

    // on envoie ces positions au GPU ici (et on se rappelle de leur nombre/taille)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    this.vertexBuffer.itemSize = 3;
    this.vertexBuffer.numItems = 4;

    // meme principe pour les couleurs
    this.coordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.coordBuffer);
    var coords = [
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coords), gl.STATIC_DRAW);
    this.coordBuffer.itemSize = 2;
    this.coordBuffer.numItems = 4;

    // creation des faces du cube (les triangles) avec les indices vers les sommets
    this.triangles = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.triangles);
    var tri = [0,1,2,0,2,3];
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(tri), gl.STATIC_DRAW);
    this.triangles.numItems = 6;

    console.log("Rocket initialized");
}

Rocket.prototype.initParameters = function() {
    this.width = 0.05;
    this.height = 0.05;
    this.position = spaceship.position;
}


Rocket.prototype.init = function(){
    this.move();
    this.checkPosition();
    gl.activeTexture(gl.TEXTURE0); // on active l'unite de texture 0
    gl.bindTexture(gl.TEXTURE_2D, window['rocketTexture']); // on place maTexture dans l'unitÃ© active
    gl.enable(gl.BLEND);
    gl.depthMask(false);
    gl.blendEquation(gl.FUNC_ADD);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.uniform1i(this.maTextureUniform, 0); // on dit au shader que maTextureUniform se trouve sur l'unite de texture 0
    this.draw();
    gl.depthMask(true);
    gl.disable(gl.BLEND);
}

/**
 * Effectue des actions selon la position
 */
Rocket.prototype.checkPosition = function () {

    var x = this.position[0];
    var y = this.position[1];

    // Supprime l'rocket si en dehors du cadre
    if(y < -1 || y > 1 || x < -1 || x > 1 ) {
        delete rockets[rockets.indexOf(this)]; // Vérifier les perf sinon splice
    }
}

Rocket.prototype.setParameters = function(elapsed) {
    // on pourrait animer des choses ici
}

Rocket.prototype.setPosition = function(x,y) {
    this.position = [x,y];
}

Rocket.prototype.shader = function() {
    return RocketShader;
}

Rocket.prototype.move = function () {

    var x = this.position[0];
    var y = this.position[1];

    this.setPosition(x,y + 0.1);

}

Rocket.prototype.sendUniformVariables = function() { // Envoie les variables globales
    gl.uniform2fv(RocketShader.positionUniform,this.position);
}

Rocket.prototype.draw = function() {

    gl.enable(gl.BLEND);
    // active le buffer de position et fait le lien avec l'attribut aVertexPosition dans le shader
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.vertexAttribPointer(RocketShader.vertexPositionAttribute, this.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // active le buffer de coords
    gl.bindBuffer(gl.ARRAY_BUFFER, this.coordBuffer);
    gl.vertexAttribPointer(RocketShader.vertexCoordAttribute, this.coordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // dessine les buffers actifs
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.triangles);
    gl.drawElements(gl.TRIANGLES, this.triangles.numItems, gl.UNSIGNED_SHORT, 0);
    gl.disable(gl.BLEND);
}


