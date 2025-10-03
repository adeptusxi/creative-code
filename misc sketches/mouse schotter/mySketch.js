let squareWidth = 36;
let mouseR = 0;

function setup() {
	createCanvas(680, 1000);
	background(223,220,210);
}

function draw() {
	noLoop();
	noFill();
	angleMode(DEGREES);
	rectMode(CENTER);
	strokeWeight(1);
	background(223,220,210);
	translate(120,120);
	let rScale = 0;
	for (let i = 0; i < 20; i++) {
		for (let i = 0; i < 12; i++) {
			push();
				let r = random(0,rScale);
				let sign = random([-1, 2]);
				rotate(r*sign*mouseR);
				translate(random(0,rScale*mouseR/6),random(0,rScale*mouseR/6));
				rect(squareWidth/2,squareWidth/2,squareWidth);
			pop();
			translate(squareWidth, 0);
			rScale += 0.1875;
		}
		translate(-12*squareWidth, squareWidth);
	}
}

function mouseMoved() {
	mouseR = map(mouseY, 0, height, 0, 1);
	loop();
}