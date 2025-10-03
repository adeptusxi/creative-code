//----------------------------
function checkFaceTracking(){
  if (theFace != null){
    // Check if both eyes and the mouth are detected
    if (eyeLeftPt && eyeRightPt && mouthLeftPt && mouthRightPt && mouthTopPt && mouthBottomPt) {
      facingCamera = true;
    } else {
      facingCamera = false;
    }
    console.log("Facing Camera: ", facingCamera);  // Output the status to the console
  } else {
    facingCamera = false;
  }
}

//----------------------------
function drawFaceLandmarks(){
  // Always check to see that the face exists, first!
  if (theFace != null){
    noStroke(); 
    fill('red');
    let Diam = 10; 
    circle(nosePt.x, nosePt.y, Diam);
    circle(eyeLeftPt.x, eyeLeftPt.y, Diam);
    circle(eyeRightPt.x, eyeRightPt.y, Diam);
    circle(mouthLeftPt.x, mouthLeftPt.y, Diam);
    circle(mouthRightPt.x, mouthRightPt.y, Diam);
    circle(mouthBottomPt.x, mouthBottomPt.y, Diam);
    circle(mouthTopPt.x, mouthTopPt.y, Diam);
    circle(foreheadPt.x, foreheadPt.y, Diam);
    circle(chinPt.x, chinPt.y, Diam);
    circle(faceLeftPt.x, faceLeftPt.y, Diam);
    circle(faceRightPt.x, faceRightPt.y, Diam);
    circle(browLeftPt.x, browLeftPt.y, Diam);
    circle(browRightPt.x, browRightPt.y, Diam);
  }
}

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
  // Load the facemesh model.
	// For simplicity, we will only track one face,
	// but just FYI, the tracker can actually do more.
	trackerOptions.maxFaces = 1;
	trackerOptions.refineLandmarks = false;
  myFaceTracker = ml5.facemesh(trackerOptions);

	nosePt = createVector();
	eyeLeftPt = createVector();
	eyeRightPt = createVector();
	browLeftPt = createVector(); 
	browRightPt = createVector();
	mouthLeftPt = createVector(); 
	mouthRightPt = createVector();
	mouthTopPt = createVector();
	mouthBottomPt = createVector();
	chinPt = createVector();
	foreheadPt = createVector();
	faceLeftPt = createVector(); //234
	faceRightPt = createVector(); //454
}
//----------------------------
// When we have fresh face data, store it.
function gotFaces(results) {
  faces = results;
	
	// Note that for simplicity, we're only
	// storing named points for the first face. 
	if (faces.length > 0){
		theFace = faces[0];
		
		let keypoints = theFace.keypoints;
		nosePt = keypoints[4];
		mouthLeftPt = keypoints[78];
		mouthRightPt = keypoints[308];
		mouthBottomPt = keypoints[14];
		mouthTopPt = keypoints[13];
		foreheadPt = keypoints[10];
		chinPt = keypoints[152];
		browLeftPt = keypoints[105];
		browRightPt = keypoints[334];
		faceLeftPt = keypoints[234];
	  faceRightPt = keypoints[454];
		
		let el1 = keypoints[33];
		let el2 = keypoints[133];
		let er1 = keypoints[362];
		let er2 = keypoints[263];
		eyeLeftPt.set((el1.x+el2.x)/2, (el1.y+el2.y)/2);
		eyeRightPt.set((er1.x+er2.x)/2, (er1.y+er2.y)/2);
	} else {
		theFace = null;
	}
}


//----------------------------
function drawAllFacePoints(){
	// Draw all 468 of the tracked face points. 
  if (theFace != null){
		noStroke();
	  fill('black');
    for (let j = 0; j < theFace.keypoints.length; j++) {
      let aKeypoint = theFace.keypoints[j];
			circle(aKeypoint.x, aKeypoint.y, 2);
    }
	}
}

//----------------------------
function drawFaceLandmarkSubset(){
	// Highlight some special landmarks on the face
  if (theFace != null){
		noFill();
	  stroke('red');
		let faceLandmarkSubset = FACE_LANDMARKS_33;
		for (let i=0; i<faceLandmarkSubset.length; i++){
			let j = faceLandmarkSubset[i];
			let aKeypoint = theFace.keypoints[j];
			circle(aKeypoint.x, aKeypoint.y,12);
		}
  }
}

const FACE_LANDMARKS_33 = [
	33,133,362,263,1,62,308,159,
	145,386,374,6,102,331,2,13,14,70,
	105,107,336,334,300,54,10,284,50,
	280,234,454,58,288,152];
