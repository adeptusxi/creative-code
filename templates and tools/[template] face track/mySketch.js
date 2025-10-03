let myWebcam;
let myFaceTracker;
let faces = [];
let theFace = null;
let trackerOptions = { flipHorizontal: true };
let myMicrophone;

let nosePt, eyeLeftPt, eyeRightPt, browLeftPt, browRightPt;
let mouthLeftPt, mouthRightPt, mouthTopPt, mouthBottomPt;
let chinPt, foreheadPt, faceLeftPt, faceRightPt;

let facingCamera = false;  // Variable to track if the user is facing the camera

//----------------------------
function setup() {
  createCanvas(640, 480);
  initializeWebcamAndFaceTracker(); 
  myMicrophone = new p5.AudioIn();
  myMicrophone.start();
}
//----------------------------
function preload(){
  preloadTracker();
}

//----------------------------
function draw() {
  background('white');
  drawWebcamVideo(webcamAlpha = 60); 
  checkFaceTracking(); 
  drawFaceLandmarks();
}

