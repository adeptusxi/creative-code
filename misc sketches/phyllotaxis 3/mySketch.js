// parastichy numbers: 13, 21

let phi; 
let angle; 
let n = 0; // current dot number 
let maxN; 
let minC = 300; // fraction of window width 
let maxC = 25; 
let c; // dot spacing 
let minSize = 400; // fraction of window width 
let maxSize = 10; 
let flattenFactor = 0.2; // factor to flatten rhombuses 

// color 1 
let colorR1 = 230;
let colorG1 = 195;
let colorB1 = 185;
// color 2 
let colorR2 = 25;
let colorG2 = 35;
let colorB2 = 48;

let animVal = 0;
let animTime = 480; // frames for complete animation cycle
let animInc = 1;

let animVal2 = 0;
let anim2Time = 420;
let anim2Inc = -1;

function setup() {
	// createCanvas(windowWidth, windowHeight);
	createCanvas(640, 640);
	angleMode(DEGREES);
	noFill();
	let d = sqrt(sq(width / 2) + sq(height / 2)); // distance between screen center and corner
	strokeWeight(1);
	background(35, 45, 59);
	
	phi = (1 + sqrt(5))/2;
	angle = 360 / (phi * phi);
	c = windowWidth / minC;
  maxN = sq((d - maxSize) / (width/maxC)); 
}

function draw() {
	translate(width / 2, height / 2);
	drawSpiral();
	background(35, 45, 59, 100);
	
	animVal += animInc;
	if (animVal > animTime/2 || animVal < -animTime/2) {
		animInc *= -1;
	}
	
	animVal2 += anim2Inc;
	if (animVal2 > anim2Time/2 || animVal2 < -anim2Time/2) {
		anim2Inc *= -1;
	}
	
	if (animVal2 > 0) {
		background(35, 45, 59, constrain(map(animVal2, 0, anim2Time/2, 0, 255), 0, 254));
	}
}

function drawSpiral() {
	for (let n = 0; n < maxN; n++) {
		let theta = n * angle;
		let r = c * sqrt(n);
		let size = map(n, 0, maxN, width/minSize, width/maxSize);
		let x = r * cos(theta);
		let y = r * sin(theta);
		
		noFill();
		stroke(map(n, 0, maxN, colorR1-30, colorR2), 
					 map(n, 0, maxN, colorG1-30, colorG2),
					 map(n, 0, maxN, colorB1-30, colorB2));
		ellipse(x, y, size);
		
		noStroke();
		fill(map(n, 0, maxN, 255, colorR2), 
					 map(n, 0, maxN, colorG1-30, colorG2),
					 map(n, 0, maxN, colorB1-30, colorB2));
		ellipse(x, y, size/7);
		
		noFill();
		stroke(map(n, 0, maxN, colorR1, colorR2), 
					 map(n, 0, maxN, colorG1, colorG2),
					 map(n, 0, maxN, colorB1, colorB2));
		drawRhombus(x, y, size, theta);
		
		c = map(n, 0, maxN, (width/minC), (width/maxC));
	}
}

function drawRhombus(x, y, size, angleToCenter) {
  let minorDiag = size;
  let majorDiag = size * flattenFactor;

  beginShape();
	let vx1 = map(animVal, -animTime/2, animTime/2, majorDiag, minorDiag) * cos(angleToCenter);
	let vy1 = map(animVal, -animTime/2, animTime/2, majorDiag, minorDiag) * sin(angleToCenter);
	vertex(x + vx1, y + vy1);
  for (let i = 0; i < 4; i++) {
    let angleOffset = angleToCenter + i * 90; 
    let vx, vy;

    if (i % 2 == 0) {
			let diagMapped = map(animVal, -animTime/2, animTime/2, majorDiag, minorDiag);
      vx = diagMapped * cos(angleOffset);
      vy = diagMapped * sin(angleOffset);
    } else {
			let diagMapped = map(animVal, -animTime/2, animTime/2, minorDiag, majorDiag);
      vx = diagMapped * cos(angleOffset);
      vy = diagMapped * sin(angleOffset);

    }
    curveVertex(x + vx, y + vy);
  }
	endShape(CLOSE);
}