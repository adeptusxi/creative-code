/* description: 
time in binary 
hour, minute, second from top to bottom 
*/

let DEBUG = false;

let numBits = 6; // number of digits 
let radius = 50;
let curveIntensity = 0.09;
let centerX;
let centerY;
let bitSpacing = 60; 
let rowSpacing = 60;
let zeroColor; 
let oneColor;
let bgColor;

let prevHr = -1;
let prevMin = -1;
let prevSec = -1;

let bitColors;  // current colors 
let targetColors;  // target colors 
let transitionSpeed = 0.06; // for color change 

function setup() {
  createCanvas(640, 640);
  noStroke();
  bgColor = color(1, 6, 15);
  zeroColor = color(21, 28, 38);
  oneColor = color(225, 238, 250);
	background(bgColor);

  bitColors = Array(numBits * 3).fill(zeroColor); 
  targetColors = Array(numBits * 3).fill(zeroColor);
}

function draw() {
  background(bgColor);
  centerX = width/2;
  centerY = height/2;

  let H = hour();
  let M = minute();
  let S = second();
  
  updateTargetColors(H, M, S);
  updateBitColors();

  drawRow(H, centerX, centerY-rowSpacing, 0);
  drawRow(M, centerX, centerY, numBits);
  drawRow(S, centerX, centerY+rowSpacing, 2 * numBits);
	
	if (DEBUG) {
    displayTime(H, M, S);
  }
}

// function mousePressed() {
// 	DEBUG = !DEBUG;
// }

function displayTime(hr, min, sec) {
  fill(oneColor); 
  textSize(16);
  textAlign(LEFT, TOP);

  let labels = ['Hour', 'Min', 'Sec'];
  let values = [hr, min, sec];

  for (let i = 0; i < 3; i++) {
    let label = labels[i];
    let value = values[i];
    let binaryString = '0b ';

    for (let bit = numBits - 1; bit >= 0; bit--) {
      binaryString += ((value >> bit) & 1).toString();
      if (bit % 4 == 0 && bit != numBits - 1) {
        binaryString += " ";
      }
    }
    
    let decimalValue = value;
    text(`${label}: ${decimalValue} = ${binaryString}`, 20, 20 + i * 30);
  }
}


function updateTargetColors(hr, min, sec) {
  updateRowTargetColors(hr, prevHr, 0);
  updateRowTargetColors(min, prevMin, numBits);
  updateRowTargetColors(sec, prevSec, 2 * numBits);
  
  prevHr = hr;
  prevMin = min;
  prevSec = sec;
}

function updateRowTargetColors(value, prevVal, startIndex) {
  for (let i = 0; i < numBits; i++) {
    let bit = (value >> (numBits - 1 - i)) & 1;
    let prevBit = (prevVal >> (numBits - 1 - i)) & 1;
    targetColors[startIndex + i] = (bit == 1) ? oneColor : zeroColor;
    if (bit != prevBit) {
      bitColors[startIndex + i] = (bit == 1) ? zeroColor : oneColor;
    }
  }
}

function updateBitColors() {
  for (let i = 0; i < bitColors.length; i++) {
    bitColors[i] = lerpColor(bitColors[i], targetColors[i], transitionSpeed);
  }
}

function drawRow(value, x, y, startIndex) {
  for (let i = 0; i < numBits; i++) {
    let bit = (value >> (numBits - 1 - i)) & 1;
    fill(bitColors[startIndex + i]);
    drawBit(x + i * bitSpacing - (bitSpacing * (numBits - 1) / 2), y);
  }
}

function drawBit(x, y) {
  drawCrossedStar(x, y, radius); 
}


function drawCrossedStar(x, y) {
  let p1 = createVector(x, y - radius); // top
  let p2 = createVector(x - radius, y); // left
  let p3 = createVector(x, y + radius); // bottom
  let p4 = createVector(x + radius, y); // right

  let controlPointDistance = radius * curveIntensity;

  beginShape();
  
	// right 
  vertex(p4.x, p4.y);
  bezierVertex(
    x + (p4.x - x) * controlPointDistance / dist(p4.x, p4.y, x, y), 
    y + (p4.y - y) * controlPointDistance / dist(p4.x, p4.y, x, y),
    x + (p1.x - x) * controlPointDistance / dist(p1.x, p1.y, x, y), 
    y + (p1.y - y) * controlPointDistance / dist(p1.x, p1.y, x, y),
    p1.x, p1.y
  );
  
	// top 
  vertex(p1.x, p1.y);
  bezierVertex(
    x + (p1.x - x) * controlPointDistance / dist(p1.x, p1.y, x, y),
    y + (p1.y - y) * controlPointDistance / dist(p1.x, p1.y, x, y),
    x + (p3.x - x) * controlPointDistance / dist(p3.x, p3.y, x, y),
    y + (p3.y - y) * controlPointDistance / dist(p3.x, p3.y, x, y),
    p3.x, p3.y
  );
  
	// bottom 
  vertex(p3.x, p3.y);
  bezierVertex(
    x + (p3.x - x) * controlPointDistance / dist(p3.x, p3.y, x, y),
    y + (p3.y - y) * controlPointDistance / dist(p3.x, p3.y, x, y),
    x + (p2.x - x) * controlPointDistance / dist(p2.x, p2.y, x, y),
    y + (p2.y - y) * controlPointDistance / dist(p2.x, p2.y, x, y),
    p2.x, p2.y
  );
  
	// left 
  vertex(p2.x, p2.y);
  bezierVertex(
    x + (p2.x - x) * controlPointDistance / dist(p2.x, p2.y, x, y),
    y + (p2.y - y) * controlPointDistance / dist(p2.x, p2.y, x, y),
    x + (p4.x - x) * controlPointDistance / dist(p4.x, p4.y, x, y),
    y + (p4.y - y) * controlPointDistance / dist(p4.x, p4.y, x, y),
    p4.x, p4.y
  );
  
  endShape(CLOSE);
}
