/* description: 
Hitomezashi Sashiko stitch with 1/0 configuration determined by minute and second in binary
minutes across (labelling columns), seconds down (labelling rows)
*/

let DRAW_NUMBERS = false;
let DRAW_TIME = false;

let cellsAcross = 6;
let gridSpacing;
let cols = []; 
let rows = [];
let nextCols = [];
let nextRows = [];
let colLerp = [];
let rowLerp = [];

let backgroundColor, patternColor, textColor; 
let highPegColor, lowPegColor;
let shadowWidth = 15; 
let lineWidth = 10;

// millis rollover from Golan 
let prevSec; 
let millisRolloverTime;
let mils;
let animTime = 600; // in milliseconds 

function setup() {
  createCanvas(640, 640);	
  gridSpacing = width / (cellsAcross + 2);
  initColors();
  rectMode(CENTER);
	prevSec = second();
}

function draw() {
	updateConfiguration();
  push();
		translate(gridSpacing, gridSpacing);
		background(backgroundColor);
		drawLines();
		if (DRAW_NUMBERS) drawNumbers();
		if (DRAW_TIME) drawTime();
  pop();
}

function initColors() {
  backgroundColor = color('black');
  patternColor = color('white');
  textColor = color('white');
	highPegColor = color('white');
	lowPegColor = color(60,60,60);
}

function updateConfiguration() {
	cols = getBinary(minute()); 
  rows = getBinary(second()); 
  nextCols = getBinary(minute() == 59 ? 0 : minute() + 1);
  nextRows = getBinary(second() == 59 ? 0 : second() + 1);
	
	if (prevSec != second()) {
		millisRolloverTime = millis();
		prevSec = second();
	}
	mils = floor(millis() - millisRolloverTime); 
	
	// linear animation by sec/min progression 
	// let secLerp = map(mils % 1000, 0, 999, 0, 1);
  // let minLerp = map(second() * 1000 + mils, 0, 60000, 0, 1);	
	
	let secLerp = 0;
	if (mils % 1000 >= 1000 - animTime) {
		secLerp = map(mils % 1000, 1000 - animTime, 1000, 0, 1);
	}
	secLerp = easeInOut(secLerp);
	
	let minLerp = 0;
	if (second() == 59) {
		minLerp = secLerp;
	}
    
  for (let i = 0; i < cols.length; i++) {
		colLerp[i] = lerp(cols[i], nextCols[i], minLerp);
  }
  for (let i = 0; i < rows.length; i++) {
		rowLerp[i] = lerp(rows[i], nextRows[i], secLerp);
  }
}

function easeInOut(t) {
    if (t < 0.5) {
        return 16 * (pow(t, 5)); 
    } else {
        return 1 - pow(-2 * t + 2, 10) / 2; 
    }
}

function getBinary(value) {
  let bits = [];
  for (let i = 5; i >= 0; i--) {
    bits.push((value >> i) & 1); 
  }
  return bits;
}

function drawNumbers() {
  fill(textColor);
  noStroke();
  for (let i = 0; i < cols.length; i++) {
    text(cols[i], i * gridSpacing, -gridSpacing / 2);
  }
  for (let i = 0; i < rows.length; i++) {
    text(rows[i], -gridSpacing / 2, i * gridSpacing);
  }
}

function drawTime() {
  let H = hour();
  let M = minute();
  let S = second();
  let minuteBinary = formatBinary(M, 6);
  let secondBinary = formatBinary(S, 6);

  fill(255);
  noStroke();
  textSize(15); 
	
	let startX = width - 2*gridSpacing - 65; 
	let startY = height - gridSpacing - 30;
	let spacing = 15;

  let timeString = nf(H, 2) + ":" + nf(M, 2) + ":" + nf(S, 2); 
  text(timeString, startX, startY - 2*spacing); 

  text("Min: " + nf(M, 2) + " = " + minuteBinary, startX, startY - spacing); 
  text("Sec: " + nf(S, 2) + " = " + secondBinary, startX, startY); 
}

function formatBinary(value, digits) {
  let binaryString = ""; 
  for (let i = digits; i > 0; i--) {
    let bit = (value >> i) & 1; 
    binaryString += bit;
    if ((i-1) % 4 == 0) {
      binaryString += " ";
    }
  }
  return binaryString;
}


function drawLines() {
  strokeWeight(5);
  stroke(patternColor);
	fill(backgroundColor);
	
	// peg holes 
	for (let x = 0; x <= cols.length; x++) {
		for (let y = 0; y <= rows.length; y++) {
			let pt = {
				x: x * gridSpacing, 
				y: y * gridSpacing
			};
			outlinedCircle(pt, lowPegColor);
		}
	}
	
	// columns 
	for (let x = 0; x < cols.length; x++) {
		for (let y = 0; y <= (rows.length + 2) / 2; y+= 2) {
			let fixedPt = {
				x: x * gridSpacing,
				y: gridSpacing + (y * gridSpacing)
			}; 
			let rotatePt = {
				x: fixedPt.x + gridSpacing * cos(colLerp[x] * PI - HALF_PI), 
				y: fixedPt.y + gridSpacing * sin(colLerp[x] * PI - HALF_PI)
			};
			
			outlinedLine(fixedPt, rotatePt);
			outlinedCircle(fixedPt, highPegColor);
		}
	}
		
	// rows 
  for (let y = 0; y < rows.length; y++) {
		for (let x = 0; x <= (cols.length + 2) / 2; x+= 2) {
			let fixedPt = {
				x: gridSpacing + (x * gridSpacing),
				y: y * gridSpacing
			}; 
			let rotatePt = {
				x: fixedPt.x + gridSpacing * cos((1 - rowLerp[y]) * PI), 
				y: fixedPt.y + gridSpacing * sin((1 - rowLerp[y]) * PI)
			}; 
			
			outlinedCircle(fixedPt, highPegColor);
			outlinedLine(fixedPt, rotatePt);
		}
	}
}

function outlinedLine(fixedPt, rotatePt) {
	// thank u Golan for pretty lines 
	strokeWeight(shadowWidth);
	stroke(backgroundColor);
	line(fixedPt.x, fixedPt.y, rotatePt.x, rotatePt.y);
			
	strokeWeight(lineWidth);
  stroke(patternColor);
	line(fixedPt.x, fixedPt.y, rotatePt.x, rotatePt.y);
}

function outlinedCircle(pt, clr) {
	stroke(backgroundColor);
	strokeWeight(shadowWidth/2);
	ellipse(pt.x, pt.y, lineWidth*2.5 + lineWidth);
	
	strokeWeight(lineWidth);
	stroke(clr);
	ellipse(pt.x, pt.y, lineWidth*2.5);
}