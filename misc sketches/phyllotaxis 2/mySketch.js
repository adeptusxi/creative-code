// parastichy numbers: 

let phi; 
let angle; 
let n = 0; // current dot number 
let maxN; 
let minC = 300; // fraction of window width 
let maxC = 40; 
let c; // dot spacing 
let minRadius = 300; // fraction of window width 
let maxRadius = 20; 

let phase = 1;
let currentlyAnimating = true;
let rotationAngle = 0;
let rotationSpeed = 0.3; // degrees to rotate per frame

let colorH1 = 44;
let colorS1 = 20;
let colorV1 = 90;
// color 2 
let colorH2 = 250;
let colorS2 = 20;
let colorV2 = 90;

function setup() {
	createCanvas(windowWidth, windowHeight);
	angleMode(DEGREES);
	colorMode(HSB, 360, 100, 100, 255);
	noFill();
	let d = sqrt(sq(width / 2) + sq(height / 2)); // distance between screen center and corner
	noStroke();
	
	phi = (1 + sqrt(5))/2;
	angle = 360 / (phi * phi);
	c = windowWidth / minC;
  maxN = sq((d - maxRadius) / ((windowWidth/minC)*0.25 + (windowWidth/maxC)*0.75)); 
}

function draw() {
	translate(windowWidth / 2, windowHeight / 2);
	drawSpiral();
}

function drawSpiral(phase) {
	for (let n = 0; n < maxN; n++) {
		let theta = n * angle;
		let r = c * sqrt(n);
		let x = r * cos(theta);
		let y = r * sin(theta);
		fill(map(n, 0, maxN, colorH1, colorH2), 
					 map(n, 0, maxN, colorS1, colorS2),
					 map(n, 0, maxN, colorV1, colorV2));
		ellipse(x, y, map(n, 0, maxN, windowWidth/minRadius, windowWidth/maxRadius));
		c = map(n, 0, maxN, (windowWidth/minC), (windowWidth/maxC));
	}
}