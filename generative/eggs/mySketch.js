var circDiam = 40;
var yolkDisplace = 8;

function setup() {
	createCanvas(640, 640);
	background(172, 216, 230);
	noStroke();
}

function draw() {
	mouseClicked();
}

function mouseClicked() {
	background(172, 216, 230);
	for (i = 0; i < 8; i++) {
		for (j = 0; j < 8; j++) {
			var r = random(); 
			if (r < 0.2) {
				// special 
				sunnyEgg(i * width/8 + width/16, j * width/8 + width/16);
			} else {
				// regular 
				wholeEgg(i * width/8 + width/16, j * width/8 + width/16);
			}
		}
	}
	noLoop();
}

function wholeEgg(x,y) {
	fill(245, 244, 240)
	circle(x, y + circDiam/6, circDiam);
	circle(x, y - circDiam/6, circDiam*0.7);
	circle(x, y - circDiam/14, circDiam*0.8);
}

function sunnyEgg(x,y) {
	fill(245, 244, 240);
	circle(x, y, circDiam*1.3);
	var rx = blobHelper();
	var ry = blobHelper();
	for (var i = 0; i < 10; i++) {
		circle(x + rx, y + ry, circDiam*0.7);
		rx = blobHelper();
		ry = blobHelper();
	}
	
	rx = random(-yolkDisplace,yolkDisplace);
	ry = random(-yolkDisplace,yolkDisplace);
	fill(255,226,60);
	circle(x + rx, y + ry, circDiam*0.6);
}

function blobHelper() {
	return random(circDiam * -0.4, circDiam * 0.4)
}