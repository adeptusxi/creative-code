let myShader;
let cam;
let prevMouseX = 0;
let prevMouseY = 0;
let totalMouseDisplace = 0;
let blurMask;
let rubRadius = 50;

function setup() {
	createCanvas(640, 480, WEBGL);
	myShader = new p5.Shader(this.renderer, vert, frag);
	prevMouseX = mouseX;
  prevMouseY = mouseY;
	
	blurMask = createGraphics(640, 480);
  blurMask.noStroke();
  blurMask.clear();

	cam = createCapture(VIDEO);
	cam.size(640, 480);
	cam.hide(); 
}

function draw() {
	background(0);
	noStroke();
	
  if (mouseX != prevMouseX || mouseY != prevMouseY) {
		let radius = rubRadius * 0.2*dist(mouseX, mouseY, prevMouseX, prevMouseY);
    blurMask.fill(255, 1); 
    blurMask.ellipse(mouseX, mouseY, radius, radius);
  }
	totalMouseDisplace += dist(mouseX, mouseY, prevMouseX, prevMouseY);
	
	myShader.setUniform('u_resolution', [width, height]);
	myShader.setUniform('u_time', millis() / 1000.0);
	myShader.setUniform('u_mouse', [mouseX / width, 1.0 - mouseY / height]);
	myShader.setUniform('u_tex0', cam); // Pass the camera feed as a texture
	myShader.setUniform('u_blurMask', blurMask);
	myShader.setUniform('u_mouse', [mouseX, mouseY]);
	myShader.setUniform('u_totalMouseDisplace', totalMouseDisplace); 

	shader(myShader);
	rect(0, 0, width, height);
	
	prevMouseX = mouseX;
  prevMouseY = mouseY;
}