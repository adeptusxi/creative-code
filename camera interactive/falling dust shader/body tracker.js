// Information: https://docs.ml5js.org/#/reference/bodypose
// Requires: https://unpkg.com/ml5@1/dist/ml5.js & p5.js v.1.11.0
// Version of 10/28/2024. 
//
// Learn more about the ml5.js project: https://ml5js.org/
// License: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md

let bodyPose;
let poses = [];
let connections;
let options = { maxPoses: 2, flipHorizontal: true, runtime: "mediapipe"};

//==================================================
// Callback function for when bodyPose outputs data
function gotPoses(results) {
  // Save the output to the poses variable
  poses = results;
}

function drawWebcamVideo(){
  // Draw the webcam video
	push();
	if (options.flipHorizontal){
		translate(width,0); 
		scale(-1,1);
	}
	let transparency = 100; // reduce this to make video transparent
	tint(255,255,255,transparency); 
  image(video, 0, 0, width, height);
	pop();
}

// Point indices:
// This information may be helpful:
const ML5BODY_NOSE = 0;
const ML5BODY_LEFT_EYE_INNER = 1;
const ML5BODY_LEFT_EYE = 2;
const ML5BODY_LEFT_EYE_OUTER = 3;
const ML5BODY_RIGHT_EYE_INNER = 4;
const ML5BODY_RIGHT_EYE = 5;
const ML5BODY_RIGHT_EYE_OUTER = 6;
const ML5BODY_LEFT_EAR = 7;
const ML5BODY_RIGHT_EAR = 8;
const ML5BODY_MOUTH_LEFT = 9;
const ML5BODY_MOUTH_RIGHT = 10;
const ML5BODY_LEFT_SHOULDER = 11;
const ML5BODY_RIGHT_SHOULDER = 12;
const ML5BODY_LEFT_ELBOW = 13;
const ML5BODY_RIGHT_ELBOW = 14;
const ML5BODY_LEFT_WRIST = 15;
const ML5BODY_RIGHT_WRIST = 16;
const ML5BODY_LEFT_PINKY = 17;
const ML5BODY_RIGHT_PINKY = 18;
const ML5BODY_LEFT_INDEX = 19;
const ML5BODY_RIGHT_INDEX = 20;
const ML5BODY_LEFT_THUMB = 21;
const ML5BODY_RIGHT_THUMB = 22;
const ML5BODY_LEFT_HIP = 23;
const ML5BODY_RIGHT_HIP = 24;
const ML5BODY_LEFT_KNEE = 25;
const ML5BODY_RIGHT_KNEE = 26;
const ML5BODY_LEFT_ANKLE = 27;
const ML5BODY_RIGHT_ANKLE = 28;
const ML5BODY_LEFT_HEEL = 29;
const ML5BODY_RIGHT_HEEL = 30;
const ML5BODY_LEFT_FOOT_INDEX = 31;
const ML5BODY_RIGHT_FOOT_INDEX = 32;