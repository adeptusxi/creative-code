let showGazePt = true;
let showGazeTrail = false;

// tracking stuff 
let leftEye, rightEye;
let capture;
let tracker;
let positions;
let trackerReady = false;

// calibration stuff 
let calibrationVectors; // gaze direction vectors, indexing corresponds to cornerText
let cornerText = ["top right", "top left", "bottom right", "bottom left"];
let currCorner = 0;
let calibrated = false;
let minX, maxX, minY, maxY;

let instructions;
let screenGazePt;
let history = [];
let maxHistory = 30; // len of history, size of avg pool to reduce screenGazePt jitter
let averagedHistory = [];
let maxAvgHistory = 100; // len of averagedHistory, # points in trail 
let newPtThres = 10; // min dist to count as a new point on trail

function gazeTrackSetup() {
	capture = createCapture(VIDEO);
  capture.size(width, height);
  capture.hide();
  tracker = new clm.tracker();
  tracker.init();
  tracker.start(capture.elt);
	
	calibrationVectors = [null, null, null, null];
}

function gazeTrackUpdate() {	
  // mirror video 
	translate(width, 0);
  scale(-1.0, 1.0);
	
	// points from clmtrackr and 
	// https://editor.p5js.org/Skye/sketches/hHGfyWS16
  positions = tracker.getCurrentPosition();
  if (positions.length > 0) {		
		trackerReady = true;
    leftEye = {
      outline: [23, 63, 24, 64, 25, 65, 26, 66].map(getPoint),
      center: getPoint(27),
      top: getPoint(24),
      bottom: getPoint(26)
    };
    rightEye = {
      outline: [28, 67, 29, 68, 30, 69, 31, 70].map(getPoint),
      center: getPoint(32),
      top: getPoint(29),
      bottom: getPoint(31)
    }
  } 
	
  if(!calibrated) {
    if (trackerReady) 
			instructions.html("Look at " + cornerText[currCorner] + " corner of canvas then click anywhere");
			fill('red');
			noStroke()
			switch(currCorner) {
				case 0: 
					ellipse(0,0,50);
					break;
				case 1: 
					ellipse(width,0,50);
					break;
				case 2: 
					ellipse(0,height,50);
					break;
				case 3: 
					ellipse(width,height,50);
					break;
			}
			noFill();
	} else {
		let currGazePt = getGazeScreenCoords(getCurrentAvgVec());
		history.push(currGazePt);
		if (history.length > maxHistory) {
			history.shift();
	}
		screenGazePt = averagePoint(history);
		screenGazePt = constrainPtToWindow(screenGazePt);
		if (averagedHistory.length > 0) {
			let lastPt = averagedHistory[averagedHistory.length - 1];
			let d = dist(lastPt.x, lastPt.y, screenGazePt.x, screenGazePt.y);
			if (d > newPtThres) averagedHistory.push(screenGazePt);
		} else {
			averagedHistory.push(screenGazePt);
		}
		if (averagedHistory.length > maxAvgHistory) {
			averagedHistory.shift();
		}
		
		if (showGazeTrail) drawGazeTrail();
		if (showGazePt) drawGazePt();
  }
	
}

function gazeTrackMouseClicked() {
	if (!trackerReady) return;
  if (currCorner < 4){
    calibrationVectors[currCorner] = getCurrentAvgVec();
    currCorner++;
    if(currCorner == 4){
			minX = Math.min(calibrationVectors[0].x, calibrationVectors[2].x);
		 	maxX = Math.max(calibrationVectors[1].x, calibrationVectors[3].x);
			minY = Math.min(calibrationVectors[0].y, calibrationVectors[1].y);
			maxY = Math.max(calibrationVectors[2].y, calibrationVectors[3].y);
			instructions.html("");
			calibrated = true;
    }
  }
}

function drawGazePt() {
	fill('red');
	stroke(0);
	ellipse(screenGazePt.x, screenGazePt.y, 5);
}

function drawGazeDirVector() {
		gaze.setMag(100);
		let screenCenter = createVector(width/2, height/2);
		let endPt = p5.Vector.add(screenCenter, gaze);
		line(screenCenter.x, screenCenter.y, endPt.x, endPt.y);
}

function drawGazeTrail() {
	noFill();
	stroke('red');
	beginShape();
	for (let v of averagedHistory) {
		vertex(v.x, v.y);
	}
	endShape();
}

function getPoint(index) {
  return createVector(positions[index][0], positions[index][1]);
}

function getActualCenter(eye) {
	let x = (eye.top.x + eye.bottom.x) / 2;
	let y = (eye.top.y + eye.bottom.y) / 2;
	return {x: x, y: y};
}

function getPupilPos(eye) {
	return {x: eye.center.x, y: eye.center.y};
}

function getGazeScreenCoords(currentVec){
	// map actual vector from eye-center -> pupil to calibrated vectors 
  let mappedX = map(currentVec.x, minX, maxX, 0, width);
  let mappedY = map(currentVec.y, minY, maxY, 0, height);
  return createVector(mappedX, mappedY);
}

// return average gaze vec of both eyes
function getCurrentAvgVec() {
	let eyeCenterL = getActualCenter(leftEye);
	let pupilL = getPupilPos(leftEye);
	let currentVecL = createVector(pupilL.x - eyeCenterL.x, pupilL.y - eyeCenterL.y);

	let eyeCenterR = getActualCenter(leftEye);
	let pupilR = getPupilPos(leftEye);
	let currentVecR = createVector(pupilR.x - eyeCenterR.x, pupilR.y - eyeCenterR.y);

	return p5.Vector.add(currentVecL, currentVecR).div(2);
}

function averagePoint(points) {
  let sumX = 0;
  let sumY = 0;
  for (let p of points) {
    sumX += p.x;
    sumY += p.y;
  }
  let n = points.length;
  return {x: sumX / n, y: sumY / n};
}

function constrainPtToWindow(pt) {
	let x = constrain(pt.x, 0, width);
	let y = constrain(pt.y, 0, height);
	return createVector(x, y);
}