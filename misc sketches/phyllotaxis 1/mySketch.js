// parastichy numbers: 

let phi; // golden ratio 
let angle; // golden angle in degrees 
let n = 0; // current dot number 
let maxN; // num dots required to fill screen, calculated 
let minC = 400; // fraction of window width for inner spacing 
let maxC = 20; // fraction of window width for outer spacing 
let c; // dot spacing 
let minRadius = 200; // fraction of window width for inner radii 
let maxRadius = 10; // fraction of window width for outer radii

let phase = 1;
let currentlyAnimating = true;
let rotationAngle = 0;
let rotationSpeed = 0.3; // degrees to rotate per frame

let colorH1 = 48;
let colorS1 = 15;
let colorV1 = 70;
// color 2 
let colorH2 = 230;
let colorS2 = 30;
let colorV2 = 100;

function setup() {
	createCanvas(windowWidth, windowHeight);
	angleMode(DEGREES);
	colorMode(HSB, 360, 100, 100, 255);
	noFill();
	strokeWeight(1);
	let d = sqrt(sq(width / 2) + sq(height / 2)); // distance between screen center and corner
	for (let i = 0; i < d*2; i++) {
		stroke(map(i, 0, d*2, colorH2, colorH1), 
					 map(i, 0, d*2, colorS1, colorS2),
					 map(i, 0, d*2, colorV1, colorV2));
		circle(windowWidth/2, windowHeight/2, i);
	}
	noStroke();
	
	phi = (1 + sqrt(5))/2;
	angle = 360 / (phi * phi);
	c = windowWidth / minC;
  maxN = sq((d - maxRadius) / ((windowWidth/minC)*0.25 + (windowWidth/maxC)*0.75)); 
}

function draw() {
	translate(windowWidth / 2, windowHeight / 2);
	if (phase == 1) {
		if (currentlyAnimating) {
			animDrawSpiral(phase);
		} else {
			rotate(rotationAngle);
			drawSpiral(phase); 
			rotationAngle += rotationSpeed; 
			if (rotationAngle > 40) {
				phase = 2;
				currentlyAnimating = true;
				n = 0;
				rotationAngle = 0;
			}
		}
	} else {
		if (currentlyAnimating) {
			animDrawSpiral(phase);
		} else {
			rotate(rotationAngle);
			drawSpiral(phase); 
			rotationAngle -= rotationSpeed; 
			if (rotationAngle < -40) {
				phase = 1;
				currentlyAnimating = true;
				n = 0;
				rotationAngle = 0;
			}
		}
	}
}

function drawSpiral(phase) {
	for (let n = 0; n < maxN; n++) {
		let theta = n * angle;
		let r = c * sqrt(n);
		let x = r * cos(theta);
		let y = r * sin(theta);
		if (phase == 1) {
			fill(map(n, 0, maxN, colorH1, colorH2), 
					 map(n, 0, maxN, colorS1, colorS2),
					 map(n, 0, maxN, colorV1, colorV2));
		} else {
			fill(map(n, 0, maxN, colorH2, colorH1), 
					 map(n, 0, maxN, colorS1, colorS2),
					 map(n, 0, maxN, colorV1, colorV2));
		}
		ellipse(x, y, map(n, 0, maxN, windowWidth/minRadius, windowWidth/maxRadius));
			c = map(n, 0, maxN, (windowWidth/minC), (windowWidth/maxC));
	}
}

function animDrawSpiral(phase) {
	let theta = n * angle;
	let r = c * sqrt(n);
	let x = r * cos(theta);
	let y = r * sin(theta);
	if (phase == 1) {
			fill(map(n, 0, maxN, colorH1, colorH2), 
					 map(n, 0, maxN, colorS1, colorS2),
					 map(n, 0, maxN, colorV1, colorV2));
		} else {
			fill(map(n, 0, maxN, colorH2, colorH1), 
					 map(n, 0, maxN, colorS1, colorS2),
					 map(n, 0, maxN, colorV1, colorV2));
	}	
	ellipse(x, y, map(n, 0, maxN, windowWidth/minRadius, windowWidth/maxRadius));
			
	n++;
	c = map(n, 0, maxN, (windowWidth/minC), (windowWidth/maxC));
	if (n >= maxN) {
		currentlyAnimating = false;
	}
}