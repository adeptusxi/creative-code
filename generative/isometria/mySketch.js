let tileWidth = 75; let tileHeight;
let rows; let cols;
let triConst;
let topColor; let rightColor; let leftColor;
let numStairs = 6;
let cubes = []; let cubesIndex = 0;
let atRow = 0; let atCol = 0;
let perspectiveShift;

let overallStyles = ["invert", "lslope", "rslope", "ldowncurve", "rdowncurve", "lupcurve", "rupcurve", "lstairs", "rstairs", "none"];
let sideStyles = ["door", "rounddoor", "none"];
let topStyles = ["none"];

let topColors   = ["#ecf2c7", "#ccf6ff", "#f5e9bc"]; 
let rightColors = ["#badeb4", "#abbaed", "#ffd9c4"];
let leftColors  = ["#97c9b8", "#a895e8", "#fcb1b1"];

function setup() {
	createCanvas(1200, 600);
	noStroke();
	
	cubeSetup();
}

function draw() {
	atRow = 0;
	atCol = 0;
	
	for (let i = 0; i < cubes.length; i++) {
		let x = atRow * tileWidth;
		if (atCol % 2 == 1) x += tileWidth/2;
		let y = atCol * tileWidth / triConst;
		push();
			translate(x,y);
			cubes[i].display();
		pop();
		atRow++;
		if (atRow > rows) {
			atCol++;
			atRow = 0;
		}
	}
	noLoop();
}

function cubeSetup() {
	let colorIndex = floor(random(0, topColors.length));
	topColor = color(topColors[colorIndex]);
	rightColor = color(rightColors[colorIndex]);
	leftColor = color(leftColors[colorIndex]);
	background(leftColor);
	
	triConst = 2/sqrt(3);
	tileHeight = triConst * tileWidth;
	rows = width/tileWidth+tileWidth;
	cols = 2*height/tileHeight+tileHeight;
	perspectiveShift = tileWidth/50;
	
	cubes = [];
	for (let i = 0; i <= rows*cols; i++) {
		let newCube = new cube();
		cubes.push(newCube);
	}
}

function mouseClicked() {
	cubeSetup();
	loop();
}

// color helpers 
function getSideMainColor(side) {
	if (side == -1) {
		return leftColor;
	} else {
		return rightColor;
	}
}

function getSideInnerColor(side) {
	if (side == -1) {
		return rightColor;
	} else {
		return leftColor;
	}
}

// base shapes 
function hexagon(color) { // whole thing 
	fill(color);
	beginShape();
		vertex(0, -tileHeight/2); // top  
		vertex(-tileWidth/2, -tileHeight/4); // top L
		vertex(-tileWidth/2, tileHeight/4); // bottom L
		vertex(0, tileHeight/2); // bottom 
		vertex(tileWidth/2, tileHeight/4); // bottom R
		vertex(tileWidth/2, -tileHeight/4); // top R 
	endShape();
}

function drawCubeTop(color) {
	fill(color);
	beginShape();
		vertex(0, -tileHeight/2); // top  
		vertex(-tileWidth/2, -tileHeight/4); // top L
		vertex(0,0);
		vertex(tileWidth/2, -tileHeight/4); // top R 
	endShape();
}

function drawCubeSide(side, color) {
	fill(color);
	beginShape();
		vertex(0, tileHeight/2); // btm 
		vertex(side*tileWidth/2, tileHeight/4); // btm R
		vertex(side*tileWidth/2, -tileHeight/4); // top R 
		vertex(0,0);
	endShape();
}

// handle style drawing 
function drawStyle(overall, left, right, top) {
	switch (overall) {
		case "invert": 
			drawInvert();
			break;
		case "lslope": 
			drawSlope(-1);
			break;
		case "rslope": 
			drawSlope(1);
			break;
		case "ldowncurve": 
			drawDownCurve(-1);
			break;
		case "rdowncurve": 
			drawDownCurve(1);
			break;
		case "lupcurve": 
			drawUpCurve(-1);
			break;
		case "rupcurve": 
			drawUpCurve(1);
			break;
		/*case "lstairs": 
			drawStairs(-1);
			break;
		case "rstairs": 
			drawStairs(1);
			break;*/
		default:
			drawTopStyle(top);
			drawSideStyle(-1, left);
			drawSideStyle(1, right);
	}
}

function drawTopStyle(topStyle) {
	switch(topStyle) {
		default:
			drawCubeTop(topColor);
	}
}

function drawSideStyle(side, sideStyle) {
	let main = getSideMainColor(side);
	let inner = getSideInnerColor(side);
	switch (sideStyle) {
		case "door": 
			drawDoor(side);
			break;
		case "rounddoor": 
			drawRoundDoor(side);
			break;
		default:
			drawCubeSide(side, main);
	}
}

// style drawers 
function drawInvert() {
	push();
		translate(tileWidth/2, -tileHeight/4);
		drawCubeSide(-1, leftColor);
	pop();
	push();
		translate(-tileWidth/2, -tileHeight/4);
		drawCubeSide(1, rightColor);
	pop();
	push();
		translate(0, tileHeight/2);
		drawCubeTop(topColor);
	pop();
}
function drawSlope(side) {
	hexagon(getSideInnerColor(side));
	fill(topColor);
	beginShape();
		vertex(side*tileWidth/2, tileHeight/4); 
		vertex(0, -tileHeight/2); // top  
		vertex(-side*tileWidth/2, -tileHeight/4); 
		vertex(0, tileHeight/2); // bottom 
	endShape();
}
function drawDownCurve(side) {
	hexagon(getSideInnerColor(side));
	let gradient;
	if (side == -1) {
		gradient = drawingContext.createLinearGradient(tileWidth/4,-3*tileHeight/8, -tileWidth/4,3*tileHeight/8);
		gradient.addColorStop(0.5, getSideInnerColor(side).toString());
	} else {
		gradient = drawingContext.createLinearGradient(-tileWidth/4,-3*tileHeight/8, tileWidth/4,3*tileHeight/8);
	}
	gradient.addColorStop(0, getSideMainColor(side).toString());
	gradient.addColorStop(1, topColor.toString());
	drawingContext.fillStyle = gradient;
	beginShape();
		vertex(side*tileWidth/2, tileHeight/4); 
		bezierVertex(0,0, 0,0, 0,-tileHeight/2); 
		vertex(-side*tileWidth/2, -tileHeight/4); 
		bezierVertex(-side*tileWidth/2,tileHeight/4, -side*tileWidth/2,tileHeight/4, 0,tileHeight/2); 
	endShape();
}
function drawUpCurve(side) {
	hexagon(getSideInnerColor(side));
	let gradient;
	if (side == -1) {
		gradient = drawingContext.createLinearGradient(tileWidth/4,-3*tileHeight/8, -tileWidth/4,3*tileHeight/8);
		gradient.addColorStop(0.5, getSideInnerColor(side).toString());
	} else {
		gradient = drawingContext.createLinearGradient(-tileWidth/4,-3*tileHeight/8, tileWidth/4,3*tileHeight/8);
	}
	gradient.addColorStop(0, topColor.toString());
	gradient.addColorStop(1, getSideMainColor(side).toString());
	drawingContext.fillStyle = gradient;
	beginShape();
		vertex(side*tileWidth/2, tileHeight/4); 
		bezierVertex(side*tileWidth/2,-tileHeight/4, side*tileWidth/2,-tileHeight/4, 0,-tileHeight/2); // top 
		vertex(-side*tileWidth/2, -tileHeight/4); 
		bezierVertex(0,0, 0,0, 0,tileHeight/2); 
	endShape();
}
function drawStairs(side) {
	let x = 0;
	let y = 0;
	hexagon(getSideMainColor(side));
	let verticalStep = ((3/4)*tileHeight)/numStairs/2; 
	verticalStep = ((3/4)*tileHeight)/numStairs; // SOMETHING IS WRONG HERE
	for (let i = tileHeight/2; i > -tileHeight/4 + verticalStep; i -= verticalStep) {
		fill(topColor);
		beginShape();
			vertex(side*x,i);
			vertex(side*(x - tileWidth/2), i-tileHeight/4);
			vertex(side*(x - tileWidth/2 + tileWidth/2/numStairs), i-tileHeight/4 - verticalStep/numStairs);
			vertex(side*(x + tileWidth/2/numStairs), i - verticalStep/numStairs);
		endShape();
		x += tileWidth/2/numStairs;
		fill(getSideInnerColor(side));
			beginShape();
				vertex(side*x, i - verticalStep/numStairs);
				vertex(side*x, i-tileHeight/numStairs/2 - verticalStep/numStairs);
				vertex(side*(x - tileWidth/2), i - verticalStep/numStairs - tileHeight/numStairs/2 - verticalStep);
				vertex(side*(x - tileWidth/2), i - verticalStep/numStairs - verticalStep);
			endShape();
	}
}
function drawDoor(side) {
	drawCubeSide(side, topColor);
	fill(getSideInnerColor(side));
	beginShape(); 
		vertex(side*2*tileWidth/6 + side*perspectiveShift, 4*tileHeight/12); // btm R
		vertex(0, 5*tileHeight/24/sqrt(3)); // btm L
		vertex(side*tileWidth/6 + side*perspectiveShift, 0); // top L
		vertex(side*2*tileWidth/6 + side*perspectiveShift, 4*tileHeight/12 - tileHeight/4); // top R
	endShape();
	//fill('white');
	//ellipse(side*map(sin(frameCount/10),0,1,tileWidth/6,tileWidth/2), map(sin(frameCount/10),0,1,tileHeight/5,tileHeight/2), tileHeight/5);
	fill(getSideMainColor(side));
	beginShape(); 
		vertex(0, tileHeight/2); // btm 
		vertex(side*tileWidth/6 + side*perspectiveShift, 5*tileHeight/12); // btm L door 
		vertex(side*tileWidth/6 + side*perspectiveShift, 5*tileHeight/12 - tileHeight/4); // top L door 
		vertex(side*2*tileWidth/6 + side*perspectiveShift, 4*tileHeight/12 - tileHeight/4); // top R door 
		vertex(side*2*tileWidth/6 + side*perspectiveShift, 4*tileHeight/12); // btm R door 
		vertex(side*tileWidth/2, tileHeight/4); // btm R 
		vertex(side*tileWidth/2, -tileHeight/4); // top R 
		vertex(0,0);
	endShape();
}
function drawRoundDoor(side) {
	drawCubeSide(side, topColor);
	fill(getSideInnerColor(side));
	beginShape(); 
		vertex(side*2*tileWidth/6 + side*perspectiveShift, 4*tileHeight/12);
		vertex(0, 5*tileHeight/24/sqrt(3));
		vertex(side*tileWidth/6 + side*perspectiveShift, 0);
		vertex(side*2*tileWidth/6 + side*perspectiveShift, 4*tileHeight/12 - tileHeight/4);
	endShape();
	fill(getSideMainColor(side));
	beginShape(); 
		vertex(0, tileHeight/2); // btm 
		vertex(side*tileWidth/6 + side*perspectiveShift, 5*tileHeight/12); // btm inner door 
		bezierVertex(side*tileWidth/6+side*perspectiveShift,tileHeight/12, side*2*tileWidth/6+side*perspectiveShift,tileHeight/12, side*2*tileWidth/6+side*perspectiveShift,4*tileHeight/12); // column count sacrilege uh oh
		vertex(side*tileWidth/2, tileHeight/4);  
		vertex(side*tileWidth/2, -tileHeight/4); 
		vertex(0,0);
	endShape();
}

// class 
class cube {
	constructor() {
		this.overall = random(overallStyles);
		let thistop = "none";
		let thisleft = "none";
		let thisright = "none";	
		if (this.overall == "none") {
			thistop = random(topStyles);
			thisleft = random(sideStyles);
			thisright = random(sideStyles);
		}
		this.top = thistop;
		this.left = thisleft;
		this.right = thisright;
	}
	
	display() {
		drawStyle(this.overall, this.left, this.right, this.top);;
	}
}