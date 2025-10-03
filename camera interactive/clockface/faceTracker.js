let myWebcam;
let myFaceTracker;
let faces = [];
let trackerOptions = { flipHorizontal: true };

//==============================================================
// DON'T CHANGE ANYTHING BELOW THIS LINE.
//
//----------------------------
function initializeWebcamAndFaceTracker(){
	// Create the webcam video, and start detecting faces:
  myWebcam = createCapture(VIDEO);
  myWebcam.size(640, 480).hide();
  myFaceTracker.detectStart(myWebcam, gotFaces);
}

//----------------------------
function drawWebcamVideo(webcamAlpha){
  // Draw the webcam video
	push();
	if (trackerOptions.flipHorizontal){
		translate(myWebcam.width,0); 
		scale(-1,1);
	}
	tint(255,255,255, webcamAlpha); 
  image(myWebcam, 0, 0, myWebcam.width, myWebcam.height);
	pop();
}
//----------------------------
function preloadTracker() {
	trackerOptions.maxFaces = 3;
	trackerOptions.refineLandmarks = false;
  myFaceTracker = ml5.facemesh(trackerOptions);
}
function gotFaces(results) {
  faces = results;
	 
	if (faces.length < 3) {
		secFace = null; 
		secSegPoints = null;
	} 
	if (faces.length < 2) {
		minFace = null; 
		minSegPoints = null;
	} 
	if (faces.length < 1) {
		hrFace = null;
		hrSegPoints = null;
		return;
	}
	
	faces.sort((a, b) => {
	return a.keypoints[226].x - b.keypoints[226].x;
	});
	
	for (let i = 0; i < min(3, faces.length); i++) {
		let keypoints; 
		if (i == 0) {
			// hour face 
			hrFace = faces[i]; 
			keypoints = hrFace.keypoints;
			HLUL = keypoints[71];
			HLUR = keypoints[107];
			HLDL = keypoints[58];
			HLDR = keypoints[78];
			HLCL = keypoints[226];
			HLCR = keypoints[190];

			HRUL = keypoints[336];
			HRUR = keypoints[300];
			HRDL = keypoints[308];
			HRDR = keypoints[288];
			HRCL = keypoints[413];
			HRCR = keypoints[446];
		} else if (i == 1) {
			// minute face 
			minFace = faces[i]; 
			keypoints = minFace.keypoints;
			MLUL = keypoints[71];
			MLUR = keypoints[107];
			MLDL = keypoints[58];
			MLDR = keypoints[78];
			MLCL = keypoints[226];
			MLCR = keypoints[190];

			MRUL = keypoints[336];
			MRUR = keypoints[300];
			MRDL = keypoints[308];
			MRDR = keypoints[288];
			MRCL = keypoints[413];
			MRCR = keypoints[446];
		} else {
			// second face 
			secFace = faces[i];
			keypoints = secFace.keypoints;
			SLUL = keypoints[71];
			SLUR = keypoints[107];
			SLDL = keypoints[58];
			SLDR = keypoints[78];
			SLCL = keypoints[226];
			SLCR = keypoints[190];

			SRUL = keypoints[336];
			SRUR = keypoints[300];
			SRDL = keypoints[308];
			SRDR = keypoints[288];
			SRCL = keypoints[413];
			SRCR = keypoints[446];
		}
	}
}