var backgroundShader;

function initBackgroundShader() {
	backgroundShader = initShaders("background-vs","background-fs");
    
    // active ce shader
    gl.useProgram(backgroundShader);

    // recupere la localisation de l'attribut dans lequel on souhaite acceder aux positions
    backgroundShader.vertexPositionAttribute = gl.getAttribLocation(backgroundShader, "aVertexPosition");
    gl.enableVertexAttribArray(backgroundShader.vertexPositionAttribute); // active cet attribut 

    // pareil pour les coordonnees de texture 
    backgroundShader.vertexCoordAttribute = gl.getAttribLocation(backgroundShader, "aVertexCoord");
    gl.enableVertexAttribArray(backgroundShader.vertexCoordAttribute);

     // adresse de la texture uHeightfield dans le shader
    backgroundShader.heightfieldUniform = gl.getUniformLocation(backgroundShader, "uHeightfield");
    backgroundShader.textureSizeUniform = gl.getUniformLocation(backgroundShader, "uTextureSize");

    console.log("background shader initialized");
}

function Background(heightfieldTexture) {
	this.heightfieldTexture = heightfieldTexture;

	// cree un nouveau buffer sur le GPU et l'active
	this.vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

	// un tableau contenant les positions des sommets (sur CPU donc)
	var vertices = [
		-1.0,-1.0, 0.0,
		 1.0,-1.0, 0.0,
		 1.0, 1.0, 0.0,
		-1.0, 1.0, 0.0
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

    console.log("background initialized");
}

Background.prototype.shader = function() {
	return backgroundShader;
}

Background.prototype.setParameters = function(elapsed) {
	// we could animate something here
}

Background.prototype.sendUniformVariables = function() {
	s = [this.heightfieldTexture.width,this.heightfieldTexture.height];
    gl.uniform2fv(backgroundShader.textureSizeUniform,s);

	gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D,this.heightfieldTexture);
    gl.uniform1i(backgroundShader.heightfieldUniform, 0);
}

Background.prototype.draw = function() {
	// active le buffer de position et fait le lien avec l'attribut aVertexPosition dans le shader
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	gl.vertexAttribPointer(backgroundShader.vertexPositionAttribute, this.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

	// active le buffer de coords
	gl.bindBuffer(gl.ARRAY_BUFFER, this.coordBuffer);
	gl.vertexAttribPointer(backgroundShader.vertexCoordAttribute, this.coordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	// dessine les buffers actifs
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.triangles);
	gl.drawElements(gl.TRIANGLES, this.triangles.numItems, gl.UNSIGNED_SHORT, 0);
}


