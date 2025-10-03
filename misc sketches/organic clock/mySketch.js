/* description: 
thin line with a soft beat for each second 
the (minute)th line is medium with a louder beat 
the (hour)th line is thick with a louder beat
*/

let DEBUG = false;
let colorMode = false; // differentiate min/hr by color 
let weightMode = true; // differentiate min/hr by lineweight 

let vertices = [];
let targetVertices = [];
let numShapes = 60; 
let numVertices = 15; 
let baseRadius = 30; 
let xMultiplier = 50; // sin/cos multiplier for width 
let yMultiplier = 50; // sin/cos multiplier for height 
let distOffset = 2; // between shapes 
let varLevel = 0.2; // multiplier of shape size for vertex in/out 
let curveTightness = 0.3;

let t = 0; // for animation  
let animSpeed = 0.005; 
let rotationSpeed = 0.005;
let alphaLerpSpeed = 0.075;
let prevSec;

let expandProgress = []; // store growth 
let expandSpeed = 0.03; // newest line growth from prev to own position  
let shrinkSpeed = 0.075; // at minute rollover 

let bgColor, secColor, minColor, hrColor;
let minWeight = 2;
let hrWeight = 4; 
let weightModeAlpha = 100; // alpha of min/hr lines in weightmode 

// beat sound from 
// https://pixabay.com/sound-effects/heartbeat-sound-effects-for-you-122458/
let beat; 
let secVolume = 0.1; 
let minVolume = 0.3; 
let hrVolume = 0.6;

function setup() {
  createCanvas(640, 640);
	beat = loadSound("beat.mp3");
	beat.setVolume(secVolume);
  initVertices();
	noFill();
	textSize(15);
	prevSec = second();
	
	bgColor = color(0, 0, 0);
	secColor = color(255, 255, 255); 
	minColor = color(212, 237, 255); 
	hrColor = color(212, 237, 255); 
}

function draw() {
  t += animSpeed; 
  let currSec = second();
	
	background(adjustAlpha(bgColor, 15));
	
	if (prevSec != currSec) {
		prevSec = currSec;
		if (currSec == minute()) {
			beat.setVolume(minVolume);
		} else if (currSec == hour()) {
			beat.setVolume(hrVolume);
		} else {
			beat.setVolume(secVolume);
		}
		if (currSec > 1) beat.play();
	}

  // minute rollover, shrink to center 
  if (currSec == 59) {
    for (let i = 0; i < numShapes; i++) {
      shrinkToCenter(i);
      strokeWeight(1);
      drawVerticesBezier(vertices[i], curveTightness);
    }
  } else {
		for (let i = 0; i < constrain(currSec, 0, numShapes); i++) {
      updateVertices(i); 
      strokeWeight(1);
			let a = lerp(0, 255, alphaLerpSpeed);
			if (i == minute() - 1) {
				let c = colorMode ? minColor : secColor;
				if (weightMode) {
					a = weightModeAlpha;
					strokeWeight(minWeight);
				}
				stroke(adjustAlpha(c, a));
			} else if (i == hour() - 1) {
				let c = colorMode ? hrColor : secColor;
				if (weightMode) {
					a = weightModeAlpha;
					strokeWeight(hrWeight);
				}
				stroke(adjustAlpha(c, a));
			} else {
				if (weightMode) strokeWeight(1);
				stroke(adjustAlpha(secColor, a));
			}
			drawVerticesBezier(vertices[i], curveTightness); 
      expandProgress[i] = constrain(expandProgress[i] + expandSpeed, 0, 1); 
    } 
  }
	
	if (DEBUG) drawTime();
}

function drawTime() {
	noStroke();
	fill(0);
	rect(0,0,90,50);
  let str = hour() + ':' + nf(minute(), 2) + ':' + nf(second(), 2);
  fill(255);
  text(str, 15, 30);
	noFill();
}

function adjustAlpha(c, a) {
	return color(red(c), green(c), blue(c), a);
}

function shrinkToCenter(shapeIndex) {
  let shape = vertices[shapeIndex];
  for (let i = 0; i < shape.length; i++) {
    shape[i].x = lerp(shape[i].x, width / 2, shrinkSpeed); 
    shape[i].y = lerp(shape[i].y, height / 2, shrinkSpeed); 
  }
}

function initVertices() {
  for (let s = 0; s < numShapes; s++) {
    let shapeVertices = [];
    let shapeTargetVertices = [];
    
    for (let i = 0; i < numVertices; i++) {
      let angle = map(i, 0, numVertices, 0, TWO_PI) + random(-0.1, 0.1);
      let r = baseRadius + random(-30, 30);
      let x = width / 2 + r * cos(angle);
      let y = height / 2 + r * sin(angle);
      
      shapeVertices.push(createVector(x, y));
      shapeTargetVertices.push(createVector(x, y)); 
    }
    
    vertices.push(shapeVertices);
    targetVertices.push(shapeTargetVertices);
    expandProgress.push(0); 
  }
}

function updateVertices(shapeIndex) {
  let shape = vertices[shapeIndex];
  let targetShape = targetVertices[shapeIndex];

  let baseRotation = t * rotationSpeed + shapeIndex * rotationSpeed;

  // update target positions 
  for (let i = 0; i < shape.length; i++) {
    let angle = map(i, 0, numVertices, 0, TWO_PI);
    
    let baseW = baseRadius + xMultiplier * sin(t + i / 2 + shapeIndex * 0.1);
    let baseH = baseRadius + yMultiplier * cos(t + i / 2 + shapeIndex * 0.1);
    
    let varX = map(noise(t + i * 1), 0, 1, -baseW * varLevel, baseW * varLevel);
    let varY = map(noise(t + i * 1), 0, 1, -baseH * varLevel, baseH * varLevel);
    
    let ogX = cos(angle) * (baseW + varX);
    let ogY = sin(angle) * (baseH + varY);
    
    let rotatedX = ogX * cos(baseRotation) - ogY * sin(baseRotation);
    let rotatedY = ogX * sin(baseRotation) + ogY * cos(baseRotation);
    
    let offset = distOffset * shapeIndex;
    
    targetShape[i].set(
      width / 2 + rotatedX + offset * cos(angle), 
      height / 2 + rotatedY + offset * sin(angle)
    );
  }

	// lerp actual positions to target positions 
  if (shapeIndex == 0) {
		// directly lerp start shape to target 
    for (let i = 0; i < shape.length; i++) {
      shape[i].x = lerp(shape[i].x, targetShape[i].x, expandProgress[shapeIndex]);
      shape[i].y = lerp(shape[i].y, targetShape[i].y, expandProgress[shapeIndex]);
    }
  } else {
    // lerp from prev shape's position to target position 
    let prevShape = vertices[shapeIndex - 1]; 
    for (let i = 0; i < shape.length; i++) {
      shape[i].x = lerp(prevShape[i].x, targetShape[i].x, expandProgress[shapeIndex]);
      shape[i].y = lerp(prevShape[i].y, targetShape[i].y, expandProgress[shapeIndex]);
    }
  }
}
