var ripples = [];
var growthInc = 6;
var maxDiam = 1000;

function setup() {
	createCanvas(640, 640);
	background(255);
	noFill();
	strokeWeight(1);
}

function draw() {
	background(255);
	stroke(0);
	for (let i = 0; i < ripples.length; i++) {
		ripples[i].expand();
		ripples[i].draw();
		if (ripples[i].done()) {
			ripples.splice(i, 1);
		}
		
		for (let j = 0; j < i; j++) {
			if (ripples[i].x == ripples[j].x && ripples[i].y == ripples[j].y) {
				ripples[j].growthInc *= 1.02;
			}
		}
	}
}

function mousePressed() {
  ripples.push(new Ripple(mouseX, mouseY));
}