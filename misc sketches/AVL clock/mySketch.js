/* description: 
seconds are inserted as nodes into an AVL tree
one node for minute and one for hour 
resets when minute changes 
*/

let DEBUG = false;

// tick sound from 
// https://pixabay.com/sound-effects/clock-ticking-natural-room-verb-17249/
let tick1, tick2;
let tickVolume = 0.5;

const Measure = {
  SEC: "second",
  MIN: "minute",
  HR: "hour",
};

let tree;
let prevSec; // rollover code from Golan 
let millisRolloverTime;

let animSpeed = 0.01;
let easer;
let borderPadding = 50; 
let secNodeRadius = 7;
let minNodeRadius = 24;
let hrNodeRadius = 30;
let newRadiusFactor = 3; // how much bigger to make newest node 
let nodeTextSize = 0.6; // fraction of radius for text 
let bgColor, strokeColor, txtColor;
let secColor, minColor, hrColor;

let newX, newY; // target position of newest node 
let newVerticalOffset; // how much below newest node to add next node

function setup() {
	createCanvas(640, 640);
	tick1 = loadSound("tick1.mp3");
	tick1.setVolume(tickVolume);
	tick2 = loadSound("tick2.mp3");
	tick2.setVolume(tickVolume);
	textFont('Courier New');
	textStyle(BOLD);
	newX = width/2; 
	newY = height/2;
	newVerticalOffset = height/6;
	initTree();
	easer = new p5.Ease();
	
	bgColor = color(0,0,0);
	strokeColor = color(255,255,255);
	txtColor = color(50,50,50);
	secColor = color(255,255,255);
	minColor = color(180,180,180);
	hrColor = color(130,130,130);
  
  millisRolloverTime = 0; 
  prevSec = second(); 
}

function draw() {
  background(bgColor);
  tree.display();   // Draw the tree
	
  let S = second();
	let M = minute(); 
	let H = hour();

  // second rollover - update millisRolloverTime, add new sec node 
  if (prevSec != S) {
    millisRolloverTime = millis(); 
		(S % 2) ? tick2.play() : tick1.play();
    
    // minute rollover - reset tree, update min/hr node 
    if (S == 0) {
			newX = width/2;
			newY = height/2;
      tree = new AVLTree();
			tree.insert(M, Measure.MIN, newX, newY+newVerticalOffset);
			tree.insert(H, Measure.HR, newX, newY+newVerticalOffset);
    }
		
    tree.insert(S, Measure.SEC, newX, newY+newVerticalOffset);
    tree.calcNodePos(); 
    prevSec = S; 
  }
}

function initTree() {
	tree = new AVLTree();
	let midX = width/2; 
	let midY = height/2;
	
	tree.insert(hour(), Measure.HR, midX, midY);
	tree.insert(minute(), Measure.MIN, midX, midY);
	for (let i = 1; i <= second(); i++) {
		tree.insert(i, Measure.SEC, midX, midY);
	}
  tree.calcNodePos();
}

function mousePressed() {
	if (DEBUG) {
		secNodeRadius /= 2;
	} else {
		secNodeRadius *= 2;
	} 
	DEBUG = !DEBUG;
}