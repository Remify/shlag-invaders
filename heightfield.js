var heightfieldShader;

function initHeightfieldShader() {
	heightfieldShader = initShaders("heightfield-vs","heightfield-fs");
    
    // active ce shader
    gl.useProgram(heightfieldShader);

    // recupere la localisation de l'attribut dans lequel on souhaite acceder aux positions
    heightfieldShader.vertexPositionAttribute = gl.getAttribLocation(heightfieldShader, "aVertexPosition");
    gl.enableVertexAttribArray(heightfieldShader.vertexPositionAttribute); // active cet attribut 

    // pareil pour les coordonnees de texture 
    heightfieldShader.vertexCoordAttribute = gl.getAttribLocation(heightfieldShader, "aVertexCoord");
    gl.enableVertexAttribArray(heightfieldShader.vertexCoordAttribute);

     // adresse de la variable uniforme uOffset dans le shader
    heightfieldShader.offsetUniform = gl.getUniformLocation(heightfieldShader, "uOffset");
    heightfieldShader.amplitudeUniform = gl.getUniformLocation(heightfieldShader, "uAmplitude");
    heightfieldShader.frequencyUniform = gl.getUniformLocation(heightfieldShader, "uFrequency");
    heightfieldShader.persistenceUniform = gl.getUniformLocation(heightfieldShader, "uPersistence");

    console.log("heightfield shader initialized");
}

function Heightfield() {
	this.initParameters();

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
    console.log("heightfield initialized");
}

Heightfield.prototype.initParameters = function() {
	this.timer = 0.0;
	this.offset = [0.0,0.0];
	this.amplitude = 2.0;
	this.frequency = 6.0;
	this.persistence = 0.5;
}

Heightfield.prototype.setParameters = function(elapsed) {
	// un exemple d'animation, a vous de changer ca en fonction 
	// de ce que vous souhaitez obtenir
	this.timer = this.timer+elapsed*0.0004;
	var speed = 2.0*(Math.sin(this.timer*0.1)*0.5+0.5);
	this.offset[1] = this.offset[1]+elapsed*0.0004*speed;
	this.amplitude = 0.2+3.0*(Math.sin(this.timer*0.1)*0.5+0.5);
	this.frequency = 5.0-speed;
}

Heightfield.prototype.shader = function() {
	return heightfieldShader;
}

Heightfield.prototype.sendUniformVariables = function() {
	gl.uniform2fv(heightfieldShader.offsetUniform,this.offset);
	gl.uniform1f(heightfieldShader.amplitudeUniform,this.amplitude);
	gl.uniform1f(heightfieldShader.frequencyUniform,this.frequency);
	gl.uniform1f(heightfieldShader.persistenceUniform,this.persistence);
}

Heightfield.prototype.draw = function() {
	// active le buffer de position et fait le lien avec l'attribut aVertexPosition dans le shader
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	gl.vertexAttribPointer(heightfieldShader.vertexPositionAttribute, this.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

	// active le buffer de coords
	gl.bindBuffer(gl.ARRAY_BUFFER, this.coordBuffer);
	gl.vertexAttribPointer(heightfieldShader.vertexCoordAttribute, this.coordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	// dessine les buffers actifs
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.triangles);
	gl.drawElements(gl.TRIANGLES, this.triangles.numItems, gl.UNSIGNED_SHORT, 0);
}


