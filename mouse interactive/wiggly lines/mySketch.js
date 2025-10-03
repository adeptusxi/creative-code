let mousePositions = []; 
let maxPositionsStored = 100; 
let randomizeRate = 0.1; 
let randomizeScale = 3; 
let lastMousePos; // for tracking mouse speed 
let maxSpeed = 20; // estimated mouse speed upper limit 
let fastColor; // line color when mouse fast  
let slowColor; // line color when mouse slow

function setup() {
  createCanvas(windowWidth, windowHeight);
  noFill();
  strokeWeight(1);
  background(230, 219, 213);
	blendMode(MULTIPLY);
  lastMousePos = createVector(mouseX, mouseY);
	
	fastColor = color(82, 38, 9);
	slowColor = color(242, 217, 201);
}

function draw() {
	blendMode(REMOVE);
  background(230, 219, 213, 15);
	blendMode(MULTIPLY);

  let currentMousePos = createVector(mouseX, mouseY);
  let mouseSpeed = p5.Vector.dist(lastMousePos, currentMousePos);

  let speedRatio = map(mouseSpeed, 0, maxSpeed, 0, 1);
  speedRatio = constrain(speedRatio, 0, 1);
  
  let lineColor = lerpColor(slowColor, fastColor, speedRatio);
  
  for (let i = 0; i < mousePositions.length; i++) {
    let pos = mousePositions[i];
    let age = ((mousePositions.length - i) / mousePositions.length) * randomizeScale;
    let timeContribution = i * deltaTime / 1000;
    
    pos.x += random(-age - timeContribution, age + timeContribution);
    pos.y += random(-age - timeContribution, age + timeContribution);
  }
  
  stroke(lineColor);
  beginShape();
  for (let i = 0; i < mousePositions.length; i++) {
    let pos = mousePositions[i];
    curveVertex(pos.x, pos.y);
  }
  endShape();
  
  lastMousePos = currentMousePos;
}

function mouseMoved() {
  let pos = createVector(mouseX, mouseY);
  mousePositions.push(pos);

  if (mousePositions.length > maxPositionsStored) {
    mousePositions.shift();
  }
}
