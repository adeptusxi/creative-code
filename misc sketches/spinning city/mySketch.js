let FS = 200; // face size 
let halfFS = FS/2;
let rotSpeed = 1; 
let skyR = 240;
let skyG = 248;
let skyB = 255;
let bgR = 255;
let bgG = 248;
let bgB = 231;
let sceneColor = 100;
let dotCounter = 0;
let lightIntensity = 50;
// rotSpeed = 0; // for drawing 

function setup() {
	createCanvas(600, 600, WEBGL);
  lights(); 
	angleMode(DEGREES);
}

function dotDotDot() {
	push();
	rotateY(- frameCount * rotSpeed);
	stroke(sceneColor);
	strokeWeight(20);
	if (dotCounter >= 40) point(-30,200);
	if (dotCounter >= 65) point(0,200);
	if (dotCounter >= 90) point(30,200);
	noStroke();
	dotCounter++;
	if (dotCounter >= 115) dotCounter = 0;
	pop();
}

function makeFace() {
	rect(0, 0, FS, FS);
}

function drawScene(posOffset) {
	if (posOffset) {
		translate(0,0,0.1)
	} else {
		translate(0,0,-0.1);
	}
	rectMode(CORNERS);
	
	// clouds 
	push();
	ambientMaterial(255);
	bezier(-80, -40, -60, -80, 0, -80, 30, -40);
	bezier(-40, -40, -20, -80, 40, -120, 30, -40);
	bezier(20, -30, 30, -70, 60, -70, 80, -30);
	pop();
	
	// horizon line 
	ambientMaterial(sceneColor);
	stroke(sceneColor);
	strokeWeight(2);
	line(halfFS,FS/3,-halfFS,FS/3); 
	
	// buildings 
	noStroke();
	ambientMaterial(sceneColor);
	rect(-halfFS, halfFS, -60, 0, 2, 2); 
	rect(10, halfFS, -30, 15, 2, 2);
	rect(50, halfFS, 0, -10, 2, 2);
	rect(100, halfFS, 60, 30, 2, 2);
	// roof 
	beginShape();
	vertex(-30, 15);
	vertex(-20, 0);
	vertex(-10, 0);
	vertex(0, 15);
	endShape(CLOSE);
	// needle 
	stroke(sceneColor);
	beginShape();
	noFill();
	vertex(-20,5);
	vertex(-15, -30);
	vertex(-10, 5);
	endShape();
	noStroke();
	ambientMaterial(bgR,bgG,bgB); 
	
	// designs on buildings 
	if (posOffset) {
		translate(0,0,0.2)
	} else {
		translate(0,0,-0.2);
	}
	arc(25, 20, 35, 35, -45, 180 + 90, PIE); // pizza
	ellipse(-80,30,30,25); // apple 
	stroke(bgR, bgG, bgB);
	line(-82,20,-82,10);
	noStroke();
	triangle(68,60,80,40,92,60); // triangle 
	ambientMaterial(sceneColor);
	
	if (posOffset) {
		translate(0,0,0.3)
	} else {
		translate(0,0,-0.3);
	}
	ellipse(-70,30,15); // apple bite 
	
	ambientMaterial(skyR,skyG,skyB);
	noStroke();
	rectMode(CENTER);
}

function draw() {
	background(bgR, bgG, bgB);
	noStroke();
	rectMode(CENTER);
	strokeCap(SQUARE);
	
	directionalLight(lightIntensity,lightIntensity,lightIntensity, -1, 1, 1); 
	ambientLight(230,230,230);
	ambientMaterial(skyR,skyG,skyB);
	
	rotateY(frameCount * rotSpeed);
	
	dotDotDot();
	
  // front
	beginShape();
  translate(0, 0, FS);
  makeFace();
	drawScene(true);
	endShape(CLOSE);

  // back
	beginShape();
  translate(0, 0, -FS);
  makeFace()
	drawScene(false);
  endShape(CLOSE);

	// bottom
	beginShape();
  translate(0, halfFS, halfFS);
  rotateX(90);
  makeFace()
  endShape(CLOSE);
	
	// top
	beginShape();
  translate(0, 0, FS);
  makeFace()
  endShape(CLOSE);

  // right
	beginShape();
  translate(halfFS, 0, -halfFS);
	rotateX(90);
	rotateY(90);
	rotateZ(180);
  makeFace()
	drawScene(true);
  endShape(CLOSE);

  // left
	beginShape();
  translate(0, 0, -FS);
  makeFace()
	drawScene(false);
  endShape(CLOSE);
}