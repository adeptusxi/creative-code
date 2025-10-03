/* description: 
clock on your face 
detects up to 3 faces to display full time (priority hour > minute > second) 
*/

let secFace = null;
let minFace = null; 
let hrFace = null;

let secSegPoints = null; 
let minSegPoints = null; 
let hrSegPoints = null; 
let segPoints = [secSegPoints, minSegPoints, hrSegPoints];
let SLUL, SLUR, SLCL, SLCR, SLDL, SLDR, SRUL, SRUR, SRCL, SRCR, SRDL, SRDR; 
let MLUL, MLUR, MLCL, MLCR, MLDL, MLDR, MRUL, MRUR, MRCL, MRCR, MRDL, MRDR; 
let HLUL, HLUR, HLCL, HLCR, HLDL, HLDR, HRUL, HRUR, HRCL, HRCR, HRDL, HRDR; 

let baseLineWidth = 40; // line width if face fills entire screen vertically 
let secLineWidth = baseLineWidth; 
let minLineWidth = baseLineWidth;
let hrLineWidth = baseLineWidth;

function preload(){
  preloadTracker();
}

function setup() {
  createCanvas(640, 480);
  initializeWebcamAndFaceTracker(); 
}

function draw() {
  background('white');
  drawWebcamVideo(webcamAlpha = 60); 
	
	updateSegmentPoints();
	updateLineWidths(); 

	drawAllSegments();
	drawTime();
	drawColons();
}

function lline(p1, p2, solid, lineWidth) {
	if (solid) {
		fill('black');
		strokeWeight(lineWidth); 
		line(p1.x, p1.y, p2.x, p2.y);
		return;
	}
	
	stroke('black');
	noFill();
	strokeWeight(1); 

 	// distance 
 	let dx = p2.x - p1.x;
 	let dy = p2.y - p1.y;
 	let len = dist(p1.x, p1.y, p2.x, p2.y) 
 	// normalized orthogonal direction 
 	let offsetX = -(dy / len) * (lineWidth / 2);
 	let offsetY = (dx / len) * (lineWidth / 2);
	// angle 
	let angle = atan2(dy, dx); 

	line(p1.x + offsetX, p1.y + offsetY, 
			 p2.x + offsetX, p2.y + offsetY);
 	line(p1.x - offsetX, p1.y - offsetY, 
			 p2.x - offsetX, p2.y - offsetY);
 	arc(p1.x, p1.y, lineWidth, lineWidth, angle + HALF_PI, angle - HALF_PI);
 	arc(p2.x, p2.y, lineWidth, lineWidth, angle - HALF_PI, angle + HALF_PI);
}

function updateLineWidths() {
	// update line widths to be proportional to face height 
	if (secSegPoints != null) {
		let h = abs(secSegPoints.L.DL.y - secSegPoints.L.UL.y); 
		secLineWidth = map(h, 0, height, 0, baseLineWidth);
	}
	if (minSegPoints != null) {
		let h = abs(minSegPoints.L.DL.y - minSegPoints.L.UL.y); 
		minLineWidth = map(h, 0, height, 0, baseLineWidth);
	}
	if (hrSegPoints != null) {
		let h = abs(hrSegPoints.L.DL.y - hrSegPoints.L.UL.y); 
		hrLineWidth = map(h, 0, height, 0, baseLineWidth);
	}
}