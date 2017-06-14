var EnemyShader;

function initEnemyShader() {
	EnemyShader = initShaders("enemy-vs","enemy-fs");
    
    // active ce shader
    gl.useProgram(EnemyShader);

    // recupere la localisation de l'attribut dans lequel on souhaite acceder aux positions
    EnemyShader.vertexPositionAttribute = gl.getAttribLocation(EnemyShader, "aVertexPosition");
    gl.enableVertexAttribArray(EnemyShader.vertexPositionAttribute); // active cet attribut 

    // pareil pour les coordonnees de texture 
    EnemyShader.vertexCoordAttribute = gl.getAttribLocation(EnemyShader, "aVertexCoord");
    gl.enableVertexAttribArray(EnemyShader.vertexCoordAttribute);

     // adresse de la variable uniforme uOffset dans le shader
    EnemyShader.positionUniform = gl.getUniformLocation(EnemyShader, "uPosition");
    EnemyShader.maTextureUniform = gl.getUniformLocation(EnemyShader, "uEnemyTexture");

    console.log("Enemy shader initialized");
}

function Enemy() {
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
    
    console.log("Enemy initialized");
}

Enemy.prototype.initParameters = function() {
	this.width = 0.2;
	this.height = 0.2;
	this.position = [Math.random() * (1.0 - (-1.0)) + -1.0,1.1];
}


Enemy.prototype.init = function(rockets){
	this.move();
	this.checkPosition(rockets);
    gl.activeTexture(gl.TEXTURE0); // on active l'unite de texture 0
    gl.bindTexture(gl.TEXTURE_2D, window['enemyTexture']); // on place maTexture dans l'unitÃ© active
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
Enemy.prototype.checkPosition = function (rockets) {



    var x = this.position[0];
    var y = this.position[1];
	var enemy = this;
    // Supprime l'enemy si en dehors du cadre
    if(y < -1 || x < -1 || x > 1 ) {
        this.delete();
	}

    var diff_Playyer_Enemy_x = Math.abs(x - spaceship.position[0]);
    var diff_Playyer_Enemy_y = Math.abs(y - spaceship.position[1]);

    if ((diff_Playyer_Enemy_x < 0.15 && diff_Playyer_Enemy_x > 0) && (diff_Playyer_Enemy_y < 0.15 && diff_Playyer_Enemy_y > 0)) {

    	gameOver();

    	spaceship.setPosition(-10,-10);

    }

	rockets.forEach(function (r) {

        var diff_x = Math.abs(x - r.position[0]);
        var diff_y = Math.abs(y - r.position[1]);
        // 0.1 = largeur du carré, a ajuster
        if ((diff_x < 0.1 && diff_x > 0) && (diff_y < 0.1 && diff_y > 0)) {
            delete enemies[enemies.indexOf(enemy)];
            delete rockets[rockets.indexOf(r)];
        }
	});

}

Enemy.prototype.delete = function () {
    delete enemies[enemies.indexOf(this)]; // Vérifier les perf sinon splice
}

Enemy.prototype.setParameters = function(elapsed) {
	// on pourrait animer des choses ici
}

Enemy.prototype.setPosition = function(x,y) {
	this.position = [x,y];
}

Enemy.prototype.shader = function() {
	return EnemyShader;
}

Enemy.prototype.move = function () {

	var x = this.position[0];
	var y = this.position[1];

	this.setPosition(x-Math.sin(y) * 0.0030,y - ratioSpeedEnemies);

}

Enemy.prototype.sendUniformVariables = function() { // Envoie les variables globales
	gl.uniform2fv(EnemyShader.positionUniform,this.position);
}

Enemy.prototype.draw = function() {

	gl.enable(gl.BLEND);
	// active le buffer de position et fait le lien avec l'attribut aVertexPosition dans le shader
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	gl.vertexAttribPointer(EnemyShader.vertexPositionAttribute, this.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

	// active le buffer de coords
	gl.bindBuffer(gl.ARRAY_BUFFER, this.coordBuffer);
	gl.vertexAttribPointer(EnemyShader.vertexCoordAttribute, this.coordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	// dessine les buffers actifs
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.triangles);
	gl.drawElements(gl.TRIANGLES, this.triangles.numItems, gl.UNSIGNED_SHORT, 0);
	gl.disable(gl.BLEND);
}


