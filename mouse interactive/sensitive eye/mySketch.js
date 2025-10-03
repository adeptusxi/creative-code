let eyeRadius = 100; 
let irisRadius = 50
let pupilMinRadius = 20;
let pupilMaxRadius = 40;
let maxPupilDistance = eyeRadius - irisRadius; // max distance from eye center the pupil can be

let backgroundColor;
let eyeColor1; // start color 
let eyeColor2; // "irritated" color 
let pupilColor; 
let irisColor;

let lerpFactor = 0;
let timeCursorInside = 0; // time cursor inside eye 
let timeCursorOvertime = 0; // time past maxTimeInside 
let maxTimeInside = 3000; // max time cursor can remain inside before closing 
let maxOvertimeInside = 3000; // max time cursor can remain overtime inside before stop counting 
let eyelidDisplace = eyeRadius * 0.5; // displacement of eyelids from center of eye 

function setup() {
  createCanvas(640, 640);
  noStroke();
	
	backgroundColor = color(147, 159, 171);
	eyeColor1 = color(219, 216, 204);
	eyeColor2 = color(235, 184, 178);
	pupilColor = color(20, 17, 14);
	irisColor = color(64, 48, 39);
}

function draw() {
  background(backgroundColor);
	
	let eyeX = width / 2; 
	let eyeY = height / 2;

	// distance between eye center and mouse 
  let dx = mouseX - eyeX;
  let dy = mouseY - eyeY;
  let distance = dist(mouseX, mouseY, eyeX, eyeY);
	
	// determine pupil position 
  let pupilX, pupilY;
  if (distance <= maxPupilDistance) {
    // mouse far enough inside eye; put pupil directly under mouse 
    pupilX = mouseX;
    pupilY = mouseY;
		if (timeCursorInside < maxTimeInside) {
			timeCursorInside += deltaTime*1.5;
		} else if (timeCursorOvertime < maxOvertimeInside) {
			timeCursorOvertime += deltaTime*0.75;
		}
  } else {
    // mouse too far; constrain pupil to eyeball 
    let angle = atan2(dy, dx);
    pupilX = eyeX + cos(angle) * maxPupilDistance;
    pupilY = eyeY + sin(angle) * maxPupilDistance;
		if (timeCursorOvertime > 0) {
			timeCursorOvertime -= deltaTime*0.75;
		} else if (timeCursorInside > 0) {
			timeCursorInside -= deltaTime*1.5;
		}
  }
	
	// color lerping, turn red if cursor inside 
  timeInside = constrain(timeCursorInside, 0, maxTimeInside);
  lerpFactor = map(timeCursorInside, 0, maxTimeInside, 0, 1);
  let clr = lerpColor(eyeColor1, eyeColor2, lerpFactor);
	
	// pupil size lerping, shrink if cursor inside 
  let pupilRadius = lerp(pupilMaxRadius, pupilMinRadius, lerpFactor);
	pupilRadius = constrain(pupilRadius, pupilMinRadius, pupilMaxRadius);
  maxPupilDistance = eyeRadius - irisRadius; 
	
	// eyelid displace lerping, close if cursor inside and color/pupil effects are done
	let targetEyelidDisplace;
  if (timeCursorOvertime > 0) {
    targetEyelidDisplace = map(timeCursorOvertime, 0, maxOvertimeInside, eyeRadius, 0);
  } else {
    targetEyelidDisplace = eyeRadius * 1.5;
  }
  eyelidDisplace = lerp(eyelidDisplace, targetEyelidDisplace, 0.1);
	eyelidDisplace = constrain(eyelidDisplace, eyeRadius * 0.5, eyelidDisplace);
  
	// draw parts 
	drawOuterEye(eyeX, eyeY, clr);
  drawPupil(pupilX, pupilY, pupilRadius);
	drawEyelids(eyeX, eyeY, eyelidDisplace);
}

function drawOuterEye(x, y, clr) {
	fill(clr);
  ellipse(x, y, eyeRadius * 2, eyeRadius * 2);
}

function drawPupil(x, y, r) {
	fill(irisColor);
	ellipse(x, y, irisRadius * 2, irisRadius * 2);
	
	fill(pupilColor);
  ellipse(x, y, r * 2, r * 2);
	
	fill(eyeColor1);
	ellipse(x - irisRadius / 2.5, y - irisRadius / 2.5, 20, 20);
}

function drawLiner(x, y) {
	noFill();
	stroke(pupilColor);
	strokeCap(PROJECT);
	strokeWeight(10);
	arc(x, y, eyeRadius * 2, eyeRadius * 2, PI, 0);
	noStroke();
}

function drawEyelids(x, y, displace) {
  fill(backgroundColor);
	rectMode(CENTER);
  rect(x, y+displace, width, eyeRadius);
	rect(x, y-displace, width, eyeRadius);
}