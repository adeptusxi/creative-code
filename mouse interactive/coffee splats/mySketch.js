let backgroundColor;
let inkColor;
let staySolidFrames = 90; // frames to stay solid before fading
let noDropletsFrames = 7; // frames before droplets appear 
let completeFadeFrames = 360; // frames after fading before disappearing
let minFadedAlpha = 10; // alpha of smallest faded stains
let maxFadedAlpha = 50; // alpha of largest faded stains

let minSplatRadius = 30;
let maxSplatRadius = 90;
let minVertices = 55; 
let maxVertices = 65;
let maxDroplets = 5; // max number of dot splatters per 
let minDropletRadius = 7;
let maxDropletRadius = 15;

let splats = [];

function setup() {
  createCanvas(640, 640);
  backgroundColor = color(240, 237, 235);
	inkColor = color(36, 23, 13);

  noStroke();
  background(backgroundColor);
}

function draw() {
  background(backgroundColor);
	for (let i = 0; i < splats.length; i++) {
		(splats[i]).draw();
	}
}

function mousePressed() {
  splats.push(new Splat(mouseX, mouseY));
}
