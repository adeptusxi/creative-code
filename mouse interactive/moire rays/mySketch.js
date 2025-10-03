let offset;
let rotationFrames = 24000;
let numRays = 360; // number of rays (degrees of rotation)

let raySet1Alpha = 255;
let raySet2Alpha = 255;
let raySet3Alpha = 255;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  noFill();
  strokeWeight(1);
}

function draw() {
	offset = map(mouseX, 0, width, -10, 10);
	
  background(255);
  translate(width / 2, height / 2);

  stroke(255, 135, 195, raySet1Alpha);
  for (let i = 0; i < numRays; i++) {
    let angle = map(i, 0, numRays, 0, TWO_PI);
    let x = cos(angle) * (2 * max(width, height));
    let y = sin(angle) * (2 * max(width, height));
    line(0, 0, x, y);
  }

  push();
  stroke(138, 183, 255, raySet2Alpha);
	translate(offset, 0);
  rotate(map(frameCount % rotationFrames, 0, rotationFrames, 0, TWO_PI));
  for (let i = 0; i < numRays; i++) {
    let angle = map(i, 0, numRays, 0, TWO_PI);
    let x = cos(angle) * (2 * max(width, height));
    let y = sin(angle) * (2 * max(width, height));
    line(0, 0, x, y);
  }
  pop();
	
	push();
  stroke(255, 236, 161, raySet3Alpha);
	translate(0, offset);
  rotate(map(frameCount % rotationFrames, 0, rotationFrames, 0, TWO_PI));
  for (let i = 0; i < numRays; i++) {
    let angle = map(i, 0, numRays, 0, TWO_PI);
    let x = cos(angle) * (2 * max(width, height));
    let y = sin(angle) * (2 * max(width, height));
    line(0, 0, x, y);
  }
  pop();
}
