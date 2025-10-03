// Loads the BMWalker motion capture data
// Renders it to an offscreen buffer using a GLSL shader
// Requires https://tetunori.github.io/BMWalker.js/dist/v0.6.1/bmwalker.js
// Click to see diagnostic view.
//
// R is based on the pixel's distance to BMWalker points;
// G is based on mouse and the pixel's y-coordinate;
// B is based on the BMWalker's loop progress value.

const bmw = new BMWalker();
const nFramesInLoop = 100;

const shaderW = 256;
const shaderH = 256;
let myShader;
let offscreenWebGLBuffer; 

//--------------------------------------------------------
function preload(){
	offscreenWebGLBuffer = createGraphics(shaderW, shaderH, WEBGL);
	myShader = new p5.Shader(offscreenWebGLBuffer.renderer,vert,frag);
}

function setup() {
	createCanvas(512, 512);
	initializeSettings();
	setWalkerParameters();
}

//--------------------------------------------------------
function draw() {
	background(0);
	noStroke();
	fill(50); 
	rect(0,0, width, height); 
	fill(255);
	
	const progress01 = (frameCount%nFramesInLoop)/nFramesInLoop;
	const bmWalkerTime = progress01*nFramesInLoop*1000.0/60.0;
	const markers = bmw.getMarkers(walkerSettings.walkerHeight, bmWalkerTime);
	
	// send BMWalker marker data to shader. 
	let xptsTmp = [];
	let yptsTmp = [];
	for (let i=0; i<15; i++){
		let m = markers[i]; 
		xptsTmp[i] = 0.5 + m.x / width;
		yptsTmp[i] = 0.5 - (m.y / height);
	}
	myShader.setUniform('u_xpts', xptsTmp); 
	myShader.setUniform('u_ypts', yptsTmp); 
	myShader.setUniform('u_time', millis()/1000.0);
	myShader.setUniform('u_progress', progress01);
  myShader.setUniform('u_mouse', [mouseX/width, 1.0 - mouseY/height]); 

	// We're just using the offscreenWebGLBuffer so that 
	// we can ALSO draw the diagnostic debug view overtop
  offscreenWebGLBuffer.shader(myShader);
  offscreenWebGLBuffer.rect(0, 0, shaderW, shaderH);
  image(offscreenWebGLBuffer, 0,0, width, height);

	// Show diagnostic debug view when mouseIsPressed
	if (mouseIsPressed){
		push();
		translate(width/2, height/2); // markers are zero-centered
		for (let i=0; i<markers.length; i++){
			let m = markers[i]; 
			circle(m.x, m.y, 6);
		}
		pop(); 
		text(progress01, 40,40); 
	}
}


//--------------------------------------------------------
const walkerSettings = new Object();
const cameraSettings = new Object();
const initializeSettings = () => {
	walkerSettings.walkerHeight = 420;
	walkerSettings.speed = 1.0;
	walkerSettings.bodyStructure = 0.0;
	walkerSettings.weight = 0.0;
	walkerSettings.nervousness = 0.0;
	walkerSettings.happiness = 0.0;
	cameraSettings.azimuth = -0.4;
	cameraSettings.angularVelocity = 0.0;
	cameraSettings.elevation = 0.0;
	cameraSettings.roll = 0.0;
};

function setWalkerParameters(){
	bmw.setSpeed(walkerSettings.speed);
	bmw.setWalkerParam(
		walkerSettings.bodyStructure,
		walkerSettings.weight,
		walkerSettings.nervousness,
		walkerSettings.happiness
	);
	bmw.setCameraParam(
		cameraSettings.azimuth,
		cameraSettings.angularVelocity,
		cameraSettings.elevation,
		cameraSettings.roll
	);
	bmw.setTranslationParam(false);
	
	let speed = ((bmw.getPeriod()/1000.0)/(1.0/60.0))/nFramesInLoop;
	bmw.setSpeed(speed); 
}