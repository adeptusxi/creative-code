// body tracking software:
// Copyright (c) 2018-2023 ml5
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
// Originally from https://editor.p5js.org/ml5/sketches/OukJYAJAb
// Requires: https://unpkg.com/ml5@0.20.0-alpha.3/dist/ml5.js

let myWebcam;
let myBodyTracker;
let bodies = [];
let bodyTrackerOptions = { maxPoses: 1, flipHorizontal: true };

let mic;

/****************** globals ******************/
let DEMO = true; 
let skeletonScale = 0.15;

let xscale;	let yscale;		// scaling camera capture to screen size

/***** wisp particle system *****/
let wisp = {
	step: 100, 							// grid step 
	
	noiseAmt: 10,  					// variation in particle paths 
	particleDensity: 3,			// density (per 100 px)
	particleWidth: 1, 			// thickness of lines
	particleOpacity: 20, 		// opacity of lines 
	maxSpeed: 10, 					// max speed of non-chasers 
	maxChaserSpeed: 30, 		// max speed of chasers 
	
	chaseSpeedThreshold: 2, // motion speed above which particles will chase target
	motionStability: 5, 		// tolerance threshold for what counts as motion
	
	hueShiftSpeed: 4, 			// speed of color lerp
	c1r: 196, 							// color 1: 196, 251, 255
	c1g: 251, 								
	c1b: 255, 
	c2r: 255, 							// color 2: 255, 145, 189
	c2g: 145, 
	c2b: 190,
	
	// dark on light scheme: 
	// color 1: 84, 0, 0 
	// color 2: 38, 38, 38
	// bg: (255, 251, 245, 20);
}

let grid;
let cols, rows;

let zOff = 0;
let wispParticles = [];

/******************** run ********************/
function preload() {
  preloadBodyTracker();
}

function setup() {
  angleMode(DEGREES);
	createCanvas(windowWidth, windowHeight); 
	background(0);
	noFill();
	
	// input setup 
	initializeWebcamAndBodyTracker();
	mic = new p5.AudioIn();
	mic.start();
	
	// var setup
	xscale = width/640;
	yscale = height/480;
	
	// wisp particle setup 
	cols = floor(width/wisp.step);
  rows = floor(height/wisp.step);
  grid = new Array(cols * rows);
	for (let i = 0; i < (width/100*wisp.particleDensity)*(height/100*wisp.particleDensity); i++) {
    wispParticles[i] = new WispParticle(random([R_WRIST, L_WRIST]));
  }
}

function draw() {
	//if (DEMO) drawWebcamVideo(60, 150);
	drawGuideLines();
	highlightPoints([R_WRIST, L_WRIST, NOSE]);
	
	background(0,0,0,5);
	drawWisp();
}

/***************** guidelines *****************/
function drawBodyKeypoints(){
	if (!DEMO) return;
	// Draw all the tracked landmark points
  for (let i = 0; i < bodies.length; i++) {
    let aBody = bodies[i];
    for (let j = 0; j < aBody.keypoints.length; j++) {
      let keypoint = aBody.keypoints[j];
      fill('red');
      noStroke();
      circle(keypoint.x, keypoint.y, 10);
    }
  }
}

function drawGuideLines() {
	if (!DEMO) return;
	fill('black');
	stroke('white')
	rect(0, 0, 300, 200);
	noFill();
	push();
		scale(skeletonScale);
		translate(20,50);
		strokeWeight(10);
		for (let i = 0; i < bodies.length; i++) {
			let aBody = bodies[i];
			let pts = aBody.keypoints;
			lineFromKeypoints(pts, R_EAR, L_EAR);
			lineFromKeypoints(pts, R_FOOT, R_KNEE);
			lineFromKeypoints(pts, R_KNEE, R_HIP);
			lineFromKeypoints(pts, L_FOOT, L_KNEE);
			lineFromKeypoints(pts, L_KNEE, L_HIP);
			lineFromKeypoints(pts, R_WRIST, R_ELBOW);
			lineFromKeypoints(pts, R_ELBOW, R_SHOULDER);
			lineFromKeypoints(pts, L_WRIST, L_ELBOW);
			lineFromKeypoints(pts, L_ELBOW, L_SHOULDER);
			lineFromKeypoints(pts, R_SHOULDER, L_SHOULDER);
			lineFromKeypoints(pts, R_HIP, L_HIP);
			line(averageX(pts, R_HIP, L_HIP) * xscale, averageY(pts, R_HIP, L_HIP) * yscale, averageX(pts, R_SHOULDER, L_SHOULDER) * xscale, averageY(pts, R_SHOULDER, L_SHOULDER) * yscale);
		pop();
	}
}

function highlightPoints(points) {
	if (!DEMO) return;
	push();
		scale(skeletonScale);
		translate(20,50);
		if (bodies.length > 0) {
			let aBody = bodies[0];
			let pts = aBody.keypoints;
			stroke('red');
			fill('white');
			for (let i = 0; i < points.length; i++) {
				ellipse(getX(points[i]), getY(points[i]), 75);
			}
			noFill();
		}
	pop();
}

/****************** helpers ******************/

function averageX(keypoints, a, b) {
	return (keypoints[a].x + keypoints[b].x)/2;
}

function averageY(keypoints, a, b) {
	return (keypoints[a].y + keypoints[b].y)/2;
}

function getX(point) {
	if (bodies.length > 0) {
		let aBody = bodies[0];
		let pts = aBody.keypoints;
		return pts[point].x * xscale;
	}
	return width/2; // FIX
}

function getY(point) {
	if (bodies.length > 0) {
		let aBody = bodies[0];
		let pts = aBody.keypoints;
		return pts[point].y * yscale;
	}
	return height/2; // FIX
}

function lineFromKeypoints(keypoints, start, end) {
	line(keypoints[start].x * xscale, keypoints[start].y * yscale, keypoints[end].x * xscale, keypoints[end].y * yscale);
}

/****************** drawing ******************/

function drawWisp() {
	background(0,3); // pseudo fading 
	
	// update noise grid 
  let yOff = 0;
  for (let y = 0; y < rows; y++) {
    let xOff = 0;
    for (let x = 0; x < cols; x++) {
      let theta = noise(xOff, yOff, zOff) * 1440; // random angle shift 1440 = 360*4 
      let newPoint = p5.Vector.fromAngle(theta); 
      newPoint.setMag(1);
      grid[x + y*cols] = newPoint;
      xOff += wisp.noiseAmt;
    }
    yOff += wisp.noiseAmt;
    zOff += 0.0003;
  }
	
	// show particles 
  for (let i = 0; i < wispParticles.length; i++) {
    wispParticles[i].draw();
  }
}

function drawCurve(sx,sy, ex,ey, a1x,a1y, a2x,a2y) {
	stroke(255,255,255, 50);
	beginShape();
		vertex(sx,sy);
		bezierVertex(a1x,a1y, a2x,a2y, ex,ey);
	endShape();
}
