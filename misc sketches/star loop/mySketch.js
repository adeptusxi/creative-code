let myEaser;
let motionRadius = 150;
let minStarRadius = 20; 
let maxStarRadius = 80;
let starRadius = minStarRadius; 
let minCurveIntensity = 0.2;
let maxCurveIntensity = 0.8;
let curveIntensity = minCurveIntensity;

let bgColor, starColor;
let numStars = 3;
let phaseOffset = 1 / numStars;

function initColors() {
	bgColor = color(28, 29, 38);
	starColor = color(247, 235, 236);
}

function setup() {
	createCanvas(640, 640);
	frameRate(30);
	noStroke();
	pixelDensity(1);
	initColors();

	createLoop({
		duration: 8,
		gif: false
	});
	animLoop.noiseFrequency(0.45);
	myEaser = new p5.Ease();
}

function draw() {
	background(bgColor);
  
	for (let i = 0; i < numStars; i++) {
		let offsetProgress = (animLoop.progress + phaseOffset * i) % 1;
		let shaped = myEaser["elasticIn"](offsetProgress, 0.7);
		let cShaped = constrain(shaped, 0, 1);
		let angle = shaped * TWO_PI - HALF_PI; // start at pi/2 

		let x = width / 2 + motionRadius * cos(angle);
		let y = height / 2 + motionRadius * sin(angle);
		let rotationAngle = angle;
		if (shaped < 0.5) {
			starRadius = map(cShaped, 0, 0.5, minStarRadius, maxStarRadius);
			curveIntensity = map(cShaped, 0, 0.5, minCurveIntensity, maxCurveIntensity);
		} else {
			starRadius = map(cShaped, 0.5, 1, maxStarRadius, minStarRadius);
			curveIntensity = map(cShaped, 0.5, 1, maxCurveIntensity, minCurveIntensity);
		}
		
		noStroke();
		fill(starColor);
		push();
		translate(x, y);
		rotate(rotationAngle);
		drawStar(0, 0, 0);
		pop();
	}
}
