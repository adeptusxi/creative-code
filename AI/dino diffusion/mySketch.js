// TLDR: 
// To RUN the program: Press the Play button at the top of the screen.
// Press RETURN to start or re-start the AI process.
// Press SPACE to clear the canvas and start over.
// Press a key (and then RETURN) to see a letter. 
// Draw on the canvas with the mouse to provide input to the AI.
//
// Dino Diffusion: Bare-bones Diffusion in p5.js
// This project is heavily based on "Dino Diffusion: Bare-bones Diffusion Models"
// by Ollin Boer Bohan: https://madebyoll.in/posts/dino_diffusion/
// Uses p5.js v.1.10.0 and ONNX Runtime Web v1.18.0: https://onnxruntime.ai/
//
// Uses graphics drawn into a 64x64 input image (in generateInputImage())
// to guide a real-time, progressively refined stable diffusion process.
// The program loads an 8MB model trained on historic drawings of plants. 

const modelFileName = "network.onnx"; 
const nSteps = 20; // How many steps to take in the diffusion process
let inputGraphics; // This 64x64-px offscreen buffer contains the user's "guiding" image.
let outputGraphics; // This 512x512px offscreen buffer contains the AI diffusion output.

//----------------------------------------------------
function setup() {
  createCanvas(1024, 512);
  noSmooth();

  // The AI ingests the pixel data from inputGraphics, a 64x64 buffer.
  inputGraphics = createGraphics(64,64); 
  inputGraphics.pixelDensity(1);

	// The AI synthesizes an image in outputGraphics (512x512).
  outputGraphics = createGraphics(512,512);
  outputGraphics.pixelDensity(1);
  outputGraphics.background(255);

  initAI(); 
  generateInputImage("A"); 
}

//----------------------------------------------------
function generateInputImage(ch){
	inputGraphics.background(255);
	inputGraphics.fill(0); 
	inputGraphics.stroke(0); 

	// forehead 
	let foreheadWidth = random(23, 29);
  inputGraphics.beginShape();
  inputGraphics.vertex(50, 5); 
  inputGraphics.bezierVertex(50-foreheadWidth+foreheadWidth/5, 5, foreheadWidth-2, 12, foreheadWidth-4, 22); 
	inputGraphics.vertex(50-foreheadWidth-foreheadWidth/13, 22);
	inputGraphics.vertex(50-foreheadWidth, 24);
  inputGraphics.endShape();

	// nose 
	let noseLength = random(10,20);
	let noseWidth = random(8, 12);
  inputGraphics.beginShape();
  inputGraphics.vertex(50-foreheadWidth, 24); 
	inputGraphics.vertex(50-foreheadWidth-3, 26); 
	inputGraphics.vertex(50-foreheadWidth-noseWidth, 24+noseLength-noseLength/3); 
	inputGraphics.vertex(50-foreheadWidth-3, 24+noseLength); 
  inputGraphics.endShape();

	// mouth and chin 
  inputGraphics.beginShape();
  inputGraphics.vertex(21, 38); 
	inputGraphics.vertex(50-foreheadWidth-3, 24+noseLength); 
  inputGraphics.vertex(50-foreheadWidth-4, 27+noseLength);
	inputGraphics.vertex(50-foreheadWidth-1, 29+noseLength);
  inputGraphics.vertex(50-foreheadWidth-3, 31+noseLength);
	inputGraphics.vertex(50-foreheadWidth+1, 33+noseLength);
	inputGraphics.vertex(50-foreheadWidth-3, 33+noseLength);
  inputGraphics.vertex(50-foreheadWidth-3, 36+noseLength); 
	inputGraphics.vertex(50-foreheadWidth+1, 39+noseLength);
	inputGraphics.bezierVertex(35, 52, 40, 50, 44, 47); 
  inputGraphics.endShape();
	
	// neck 
	inputGraphics.beginShape();
	inputGraphics.vertex(32,48); 
	inputGraphics.bezierVertex(40, 48, 40, 48, 47, 64); 
	inputGraphics.vertex(55,64); 
	inputGraphics.endShape(CLOSE);
	
	// ear and shadow 
	inputGraphics.beginShape(); 
	inputGraphics.vertex(49,28); 
	bezierVertex(52, 27, 54, 33, 47, 28+noseLength/1.5);
	inputGraphics.vertex(64,28+noseLength*1.5); 
	inputGraphics.vertex(64, 28-noseLength/2);
	inputGraphics.endShape(CLOSE); 
	
	inputGraphics.noFill();
	
	// eye 
	inputGraphics.beginShape();
	inputGraphics.vertex(31,28); 
	inputGraphics.vertex(36,26); 
	inputGraphics.vertex(29,24); 
	inputGraphics.endShape(CLOSE);
}

//----------------------------------------------------
function draw() {
  background(200);

	// Display the inputGraphics on the main canvas, magnified.
	image(inputGraphics,0,0,512,512);
	
	// If the mouse is pressed, draw the user's scribble in inputGraphics
  if (mouseIsPressed) {
		inputGraphics.stroke(0); 
		let x0 = mouseX/ratio; // scale down the mouse coordinates
		let y0 = mouseY/ratio; // from a 512x512 image to 64x64.
		let x1 = pmouseX/ratio;
		let y1 = pmouseY/ratio;
    inputGraphics.line(x0,y0, x1,y1);
	} 
	if (mouseIsPressed || keyIsPressed){ // show a message
		text("Press RETURN to send new image to AI", 20,30);
  }

	// Draw the AI-synthesized on the right half of the canvas.
	displayOutputGraphics(512,0,512,512); 
}

//----------------------------------------------------
function keyPressed() {
	if (keyCode == RETURN) {
		// Transmit the inputGraphics buffer to the AI!
    sendImageData();
  } else {
    background(255);
		generateInputImage(key); 
  } 
}