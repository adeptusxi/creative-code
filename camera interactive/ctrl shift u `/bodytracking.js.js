// Copyright (c) 2018-2023 ml5
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
// Originally from https://editor.p5js.org/ml5/sketches/OukJYAJAb
// Requires: https://unpkg.com/ml5@0.20.0-alpha.3/dist/ml5.js

//==============================================================
// DON'T CHANGE ANYTHING BELOW THIS LINE
// unless you know what you are doing :)
//
//----------------------------
function initializeWebcamAndBodyTracker(){
	// Create the webcam video, and start detecting hands.
  myWebcam = createCapture(VIDEO);
  myWebcam.size(640, 480);
	myWebcam.hide();
  myBodyTracker.detectStart(myWebcam, gotBodies);
}

//----------------------------
function preloadBodyTracker() {
  myBodyTracker = ml5.bodypose("BlazePose", bodyTrackerOptions);
}

//----------------------------
function gotBodies(results) {
  // If fresh body pose data is received, store it.
  bodies = results;
}

//----------------------------
function drawWebcamVideo(webcamAlpha, w){
	// Draw the webcam video
	push();
	if (bodyTrackerOptions.flipHorizontal){
		translate(w,0); 
		scale(-1,1);
	}
	tint(255,255,255,webcamAlpha); 
	image(myWebcam, 0, 0, w, (w/myWebcam.width*myWebcam.height)); 
	pop();
}

//----------------------------
// These constants may be helpful as indexes:
const NOSE = 0;
const L_EYE_INNER = 1;
const L_EYE = 2;
const L_EYE_OUTER = 3;
const R_EYE_INNER = 4;
const R_EYE = 5;
const R_EYE_OUTER = 6;
const L_EAR = 7;
const R_EAR = 8;
const L_MOUTH = 9;
const R_MOUTH = 10;
const L_SHOULDER = 11;
const R_SHOULDER = 12;
const L_ELBOW = 13;
const R_ELBOW = 14;
const L_WRIST = 15;
const R_WRIST = 16;
const L_PINKY = 17;
const R_PINKY = 18;
const L_INDEX = 19;
const R_INDEX = 20;
const L_THUMB = 21;
const R_THUMB = 22;
const L_HIP = 23;
const R_HIP = 24;
const L_KNEE = 25;
const R_KNEE = 26;
const L_ANKLE = 27;
const R_ANKLE = 28;
const L_HEEL = 29;
const R_HEEL = 30;
const L_FOOT = 31;
const R_FOOT = 32;