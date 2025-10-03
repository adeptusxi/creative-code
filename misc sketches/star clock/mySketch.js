/* description: 
particles move clockwise at rate corresponding to distance from center 
particles on secRadius complete one lap every minute 
particles on minRadius complete one lap every hour 
particles on hrRadius complete on lap every 12 hours 
triangle is drawn between tip of sec/min/hr hands 
click to see radii and current time 
*/

let DRAW_MARKERS = false;

let particles = [];
let maxParticles = 300; 

let secRadius, minRadius, hrRadius;
let maxDistance; // center-corner distance 

let secRSpeed = 360 / (60 * 60); // angle increment to complete circle in 1 minute 
let minRSpeed = 360 / (60 * 60 * 60); // in 60 minutes 
let hrRSpeed = 360 / (12 * 60 * 60 * 60); // in 12 hours 
let minSpeed = 0; 
let maxSpeed = 2;
let minTrailAlpha = 0; 
let maxTrailAlpha = 50;
let minStoredPos = 15; 
let maxStoredPos = 1000;

function setup() {
  createCanvas(400, 400);
	secRadius = width/7; 
	minRadius = 2*width/7; 
	hrRadius = 3*width/7;
	background(0);
  angleMode(DEGREES);
  textAlign(CENTER, CENTER);
  textSize(7);
	frameRate(15);
	
	maxDistance = dist(0, 0, width / 2, height / 2);
}

function draw() {
	// drawBackground();
	background(0);

	if (particles.length < maxParticles) {
		// progressively bias toward center 
		let w = map(particles.length, 0, maxParticles, width/2, width/8);
		let h = map(particles.length, 0, maxParticles, height/2, height/8)
		let p = new Particle(random(width/2 - w, width/2 + w), 
												 random(height/2 - h, height/2 + h)); 
		particles.push(p); 
	} else {
		// help 
		frameRate(4);
	}
  
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.update();
    p.display();
    if (p.isFinished()) {
      particles.splice(i, 1);
    }
  }
	drawTriangle();
	if (DRAW_MARKERS) drawMarkers();
}

function mousePressed() {
	DRAW_MARKERS = !DRAW_MARKERS;
}

function drawMarkers() { 
	// debug markers from chatGPT 
  let S = second();
  let M = minute();
  let H = hour();
  
  stroke(255);
  noFill();
  
  // seconds (1 min cycle)
  ellipse(width / 2, height / 2, secRadius * 2);
  let secAngle = map(S, 0, 60, 0, 360);
  let secX = width / 2 + cos(secAngle - 90) * secRadius;
  let secY = height / 2 + sin(secAngle - 90) * secRadius;
  fill(255);
  noStroke();
  ellipse(secX, secY, 15);
  fill(0);
  text(S, secX, secY); 

  // minutes (1 hr cycle)
  stroke(255);
  noFill();
  ellipse(width / 2, height / 2, minRadius * 2);
  let minAngle = map(M, 0, 60, 0, 360);
  let minX = width / 2 + cos(minAngle - 90) * minRadius;
  let minY = height / 2 + sin(minAngle - 90) * minRadius;
  fill(255);
  noStroke();
  ellipse(minX, minY, 15);
  fill(0);
  text(M, minX, minY); 

  // hours (12 hr cycle)
  stroke(255);
  noFill();
  ellipse(width / 2, height / 2, hrRadius * 2);
  let hrAngle = map(H % 12, 0, 12, 0, 360); 
  let hrX = width / 2 + cos(hrAngle - 90) * hrRadius;
  let hrY = height / 2 + sin(hrAngle - 90) * hrRadius;
  fill(255);
  noStroke();
  ellipse(hrX, hrY, 15);
  fill(0);
  text(H, hrX, hrY); 
}

// function drawTriangle() {
// 	/* draw triangle between particle closest to sec radius, 
// 													 particle closest to min radius, 
// 											 and particle closest to hr radius */
//   let secParticle = null;
//   let minParticle = null;
//   let hrParticle = null;
//   let closestSecDistance = Infinity;
//   let closestMinDistance = Infinity;
//   let closestHrDistance = Infinity;

//   for (let p of particles) {
//     let distanceToSec = abs(p.distFromCenter - secRadius);
//     let distanceToMin = abs(p.distFromCenter - minRadius);
//     let distanceToHr = abs(p.distFromCenter - hrRadius);

//     if (distanceToSec < closestSecDistance) {
//       closestSecDistance = distanceToSec;
//       secParticle = p;
//     }
//     if (distanceToMin < closestMinDistance) {
//       closestMinDistance = distanceToMin;
//       minParticle = p;
//     }
//     if (distanceToHr < closestHrDistance) {
//       closestHrDistance = distanceToHr;
//       hrParticle = p;
//     }
//   }

//   if (secParticle && minParticle && hrParticle) {
//     stroke(255);  
//     strokeWeight(1); 
// 		noFill();
    
//     triangle(
//       secParticle.pos.x, secParticle.pos.y,
//       minParticle.pos.x, minParticle.pos.y,
//       hrParticle.pos.x, hrParticle.pos.y
//     );
//   }
// }

function drawTriangle() { 
  let S = second();
  let M = minute();
  let H = hour();
  
  stroke(255);
  noFill();
	
	let secAngle = map(S, 0, 60, 0, 360);
	let secPt = {
		x: width / 2 + cos(secAngle - 90) * secRadius, 
		y: height / 2 + sin(secAngle - 90) * secRadius
	}; 
	
	let minAngle = map(M, 0, 60, 0, 360);
	let minPt = {
		x: width / 2 + cos(minAngle - 90) * minRadius, 
		y: height / 2 + sin(minAngle - 90) * minRadius
	}; 
	
	let hrAngle = map(H % 12, 0, 12, 0, 360); 
	let hrPt = {
		x: width / 2 + cos(hrAngle - 90) * hrRadius, 
		y: height / 2 + sin(hrAngle - 90) * hrRadius
	}; 

  triangle(secPt.x, secPt.y, minPt.x, minPt.y, hrPt.x, hrPt.y);
}