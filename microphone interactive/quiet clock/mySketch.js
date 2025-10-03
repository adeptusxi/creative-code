/* description: 
segment endpoints go into a frenzy if input volume is too loud
be quiet to read the time 
might have to adjust SENSITIVITY to room 
*/

let DEBUG = false;
let SENSITIVITY = 0.98; // of sound detection, between 0 and 1 

//---------------------------------------------

let bgColor, digitColor, frenzyColor, frenzyColor1, frenzyColor2;

let digitWidth = 40;
let digitHeight = 60;
let digitSpacing = 0.5; // fraction of digitWidth 
let pointRadius = 5;
let padding = 20; // from edge where points can't go

let mic;
let volume = 0; 
let lerpSpeed = 0.075; // for moving points 
let calmDownSpeed = 0.05 // for slowing down points 
let pulseSpeed = 0.02; // for pulsing frenzy color 
let frenzyColorValue = 0;
let frenzyIntensity = 0;
let frenzyLevel = 75; // multiplier for width 
let volThreshold = 1 - SENSITIVITY; // below this, no frenzy 

function setup() {
	createCanvas(640, 640);
	
	bgColor = color('black');
	digitColor = color('white');
	frenzyColor1 = color(102, 10, 3);
	frenzyColor2 = color(255, 42, 0);
	frenzyColor = frenzyColor1;
	
	mic = new p5.AudioIn();
  mic.start();
}

function draw() {
	background(red(bgColor), green(bgColor), blue(bgColor), 40);
	
	volume = mic.getLevel(); 
	lerpPoints();
	
	frenzyColorValue += pulseSpeed;
	if (frenzyColorValue >= 1 || frenzyColorValue <= 0) {
		pulseSpeed *= -1;
	}
	frenzyColor = lerpColor(frenzyColor1, frenzyColor2, frenzyColorValue);
	
	if (DEBUG) labelPoints();
	drawPoints();
	drawLines(hour(), minute(), second());
}

function lline(p1, p2) {
	line(p1.x, p1.y, p2.x, p2.y);
}

function ppoint(p) {
	fill(getDigitColor());
	stroke(getDigitColor());
	ellipse(p.x, p.y, pointRadius);
}

function getDigitColor() {
	let clr = lerpColor(digitColor, frenzyColor, frenzyIntensity);
	return clr;
}

function drawPoints() {
	stroke(getDigitColor());
	fill(bgColor);
	push();
		translate(width/2, height/2);
		for (const place in Points) {
			const pointSet = Points[place];
			for (const pt in pointSet) {
				const { x, y } = pointSet[pt];
				ellipse(x, y, pointRadius); 
			}
		}
	pop();
}

function drawLines(hr, min, sec) {
  push();
		strokeWeight(1);
		stroke(getDigitColor());
		translate(width / 2, height / 2);

		let h1 = floor(hr / 10);
		let h2 = hr % 10;
		let m1 = floor(min / 10);
		let m2 = min % 10;
		let s1 = floor(sec / 10); 
		let s2 = sec % 10; 

		drawDigit(h1, Points.h1); 
		drawDigit(h2, Points.h2); 
		drawDigit(m1, Points.m1); 
		drawDigit(m2, Points.m2); 
		drawDigit(s1, Points.s1); 
		drawDigit(s2, Points.s2); 
  pop();
}

function lerpPoints() {
	if (volume < volThreshold) {
		frenzyIntensity = lerp(frenzyIntensity, 0, calmDownSpeed);
	} else {
		frenzyIntensity = map(volume, 0, 1, 0, width*frenzyLevel);
	}
  for (let section in Points) {
    for (let point in Points[section]) {
      const fixedX = FixedPoints[section][point].x;
      const fixedY = FixedPoints[section][point].y;
      
      let targetX = constrain(fixedX + random(-frenzyIntensity, frenzyIntensity), -width/2, width/2);
      let targetY = constrain(fixedY + random(-frenzyIntensity, frenzyIntensity), -height/2, height/2);
      
      Points[section][point].x = lerp(Points[section][point].x, targetX, lerpSpeed);
      Points[section][point].y = lerp(Points[section][point].y, targetY, lerpSpeed);
    }
  }
}