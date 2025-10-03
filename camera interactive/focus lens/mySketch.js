// Uses: https://unpkg.com/ml5@1/dist/ml5.js
// Audio: Metamodernity - Vansire https://www.youtube.com/watch?v=PiLc3m59qIw 

// Model URL, obtained from Teachable Machine. 
let imageModelURL = 'https://teachablemachine.withgoogle.com/models/lNDrvJr6Kk/';

// Classifier Variable
let classifier;
// Video
let video;
// To store the current classification
let currentCategoryLabel = "";

let focused = false; 
let video_size = {w: 320, h: 200};
let vert_padding = 100; 
let bin_offset = 100; // binocular disparity 
let w_ratio; 

let music; 
let music_playing;

//--------------------------------------------------
// Load the model first
function preload() {
	classifier = ml5.imageClassifier(imageModelURL + 'model.json');
	music = loadSound('metamodernity.mp3');
}

//--------------------------------------------------
function setup() {
	createCanvas(video_size.w*2 + bin_offset*2, video_size.h + vert_padding*2);
	noStroke();
	
	// Create the webcam video 
	video = createCapture(VIDEO);
	video.size(video_size.w, video_size.h);
	video.hide();
	
	w_ratio = width / video.width;

	// Start classifying
	classifyVideo();
	
	music_playing = false; 
	music.loop();
	// music.pause();
	music.setVolume(0);
}

//--------------------------------------------------
function draw() {
	background('black');
	
	// Draw the webcam video
	image(video, bin_offset, vert_padding); // left 
	image(video, video_size.w + bin_offset, vert_padding); // right 
	fill(0, 0, 0, 0); 
	rect(0, 0, width, height);
	
	focused = currentCategoryLabel == "focused";
	handleFocused(); 
	drawLensOutline(); 
}
	
	
//--------------------------------------------------
// Get a prediction for the current video frame
function classifyVideo() {
	classifier.classify(video, gotResult);
}

// What to do when the classifier returns a result.
// Note that the order of the arguments (results, error)
// has been swapped since earlier versions of ml5!
function gotResult(results, error) {
	// If there is an error
	if (error) {
		console.error(error);
		return;
	}
	// The results are stored in an array ordered by confidence.
	// See e.g. onsole.log(results[0]);
	currentCategoryLabel = results[0].label;
	// Now, trigger classify to happen again!
	classifyVideo();
}

function handleFocused() {
	if (focused) {
		if (!music_playing) {
			// music.play();
			music.setVolume(1, 1.0); 
			music_playing = true;
		}
	} else {
		filter(GRAY);
		if (music_playing) {
			// music.pause(); 
			music.setVolume(0, 1.0); 
			music_playing = false;
		}
	}
	rect(0, 0, width, height);
}

function drawLensOutline() {
	fill(0);
	rect(0, 0, bin_offset, height); // left 
	rect(video_size.w + bin_offset/2, 0, bin_offset, height); // middle 
	rect(video_size.w*2 + bin_offset, 0, bin_offset, height); // right 
	rect(0, 0, width, vert_padding); // top 
	rect(0, video_size.h + vert_padding, width, vert_padding); // bottom 
	drawLensCurves(true); 
	drawLensCurves(false);
}
	
function drawLensCurves(left) {
	push(); 
	if (!left) translate(bin_offset/2 + video_size.w, 0);
	let og_curve_softness = {up_out: 20, down_out: 55, up_in: 15, down_in: 35}; 
	let curve_softness; 
	if (left) {
		curve_softness = og_curve_softness; 
	} else {
		curve_softness = {up_out: og_curve_softness.up_in, down_out: og_curve_softness.down_in, up_in: og_curve_softness.up_out, down_in: og_curve_softness.down_out};
	}
	
	beginShape(); // top left 
		vertex(bin_offset, height/2);
		bezierVertex(bin_offset, vert_padding + curve_softness.up_out, 
								 bin_offset + curve_softness.up_out, vert_padding, 
								 bin_offset + video_size.h/2, vert_padding)
		vertex(bin_offset, vert_padding);
	endShape(CLOSE); 
	
	beginShape(); // top right 
		vertex(bin_offset/2 + video_size.w, height/2);
		bezierVertex(bin_offset/2 + video_size.w, vert_padding + curve_softness.up_in, 
								 bin_offset/2 + video_size.w - curve_softness.up_in, vert_padding, 
								 bin_offset/2 + video_size.w - video_size.h/2, vert_padding)
		vertex(bin_offset/2 + video_size.w, vert_padding);
	endShape(CLOSE); 
		
	beginShape(); // bottom left 
		vertex(bin_offset, height/2);
		bezierVertex(bin_offset, height-vert_padding - curve_softness.down_out, 
								 bin_offset + curve_softness.down_out, height-vert_padding, 
								 bin_offset + video_size.h/2, height-vert_padding)
		vertex(bin_offset, height-vert_padding);
	endShape(CLOSE);
	
	beginShape(); // bottom right 
		vertex(bin_offset/2 + video_size.w, height/2);
		bezierVertex(bin_offset/2 + video_size.w, height-vert_padding - curve_softness.down_in, 
								 bin_offset/2 + video_size.w - curve_softness.down_in, height-vert_padding, 
								 bin_offset/2 + video_size.w - video_size.h/2, height-vert_padding)
		vertex(bin_offset/2 + video_size.w, height-vert_padding);
	endShape(CLOSE);
	
	pop(); 
}