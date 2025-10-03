let meetCriteria = true; // true turns off curves and color lerping 
let makeGif = false; 
// -------------

let tileWidth = 100; let tileHeight;
let rows; let cols;
let triConst;
let numStairs = 6;
let cubes = []; let cubesIndex = 0;
let doorPhases = 2; // sets of time-displaced door closing
let atRow = 0; let atCol = 0;
let perspectiveShift;

// let overallStyles = ["invert", "lslope", "rslope", "ldowncurve", "rdowncurve", "lupcurve", "rupcurve", "lstairs", "rstairs", "none"];
let overallStyles;
let sideStyles = ["door", "rounddoor", "none"];
let topStyles = ["none"];

let globalF, globalF2;
let easer;

let topColor; let rightColor; let leftColor;
let color1, color2, color3;
function colorInit() {
	color1 = color("#ecf2c7"); 
	color2 = color("#badeb4");
	color3 = color("#97c9b8");
}

function setup() {
	createCanvas(640, 640);
	noStroke();
	strokeCap(SQUARE);
	
	if (meetCriteria) {
		overallStyles = ["invert", "lslope", "rslope", "lstairs", "rstairs", "none", "none", "none", "none"];
	} else {
		overallStyles = ["invert", "lslope", "rslope", "ldowncurve", "rdowncurve", "lupcurve", "rupcurve", "lstairs", "rstairs", "none", "none", "none", "none"];
	}
	colorInit();
	cubeSetup();
	
	frameRate(30);
	pixelDensity(1);

	// Here, change gif:false to true in order to export the GIF!!!!!
	createLoop({
		duration: 5,
		gif:makeGif
	});
	animLoop.noiseFrequency(0.45);
	easer = new p5.Ease();
}

function draw() {
	background(leftColor);
	let shaped = easer["elasticInOut"](animLoop.progress, 0.7);
	globalF = map(shaped, 0, 1, 0, 49);
	let shaped2 = easer["quarticInOut"](animLoop.progress, 0.7);
	shaped2 += 0.5;
	if (shaped2 > 1) shaped2 --;
	globalF2 = map(shaped2, 0, 1, 0, 50);
	
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
}

function mousePressed() {
	isLooping() ? noLoop() : loop();
	print("looping: " + isLooping());
}

function lerpColors() {
	// let lerpVal = easer["linear"](animLoop.progress, 0.7);
	let lerpVal = map(millis() % 20000, 0, 19999, 0, 1);
	if (lerpVal < 1/3) {
		lerpVal = map(lerpVal, 0, 1/3, 0, 1);
		topColor = lerpColor(color1, color2, lerpVal);
		rightColor = lerpColor(color2, color3, lerpVal);
		leftColor = lerpColor(color3, color1, lerpVal);
	} else if (lerpVal < 2/3) {
		lerpVal = map(lerpVal, 1/3, 2/3, 0, 1);
		topColor = lerpColor(color2, color3, lerpVal);
		rightColor = lerpColor(color3, color1, lerpVal);
		leftColor = lerpColor(color1, color2, lerpVal);
	} else {
		lerpVal = map(lerpVal, 2/3, 1, 0, 1);
		topColor = lerpColor(color3, color1, lerpVal);
		rightColor = lerpColor(color1, color2, lerpVal);
		leftColor = lerpColor(color2, color3, lerpVal);
	}
}

function cubeSetup() {
	topColor = color1;
	rightColor = color2;
	leftColor = color3;
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
function drawStyle(overall, left, right, top, phase) {
	switch (overall) {
		case "invert": 
			drawInvert();
			break;
		case "lslope": 
			drawSlope(-1, phase);
			break;
		case "rslope": 
			drawSlope(1, phase);
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
		case "lstairs": 
			drawStairs(-1);
			break;
		case "rstairs": 
			drawStairs(1);
			break;
		default:
			drawTopStyle(top);
			drawSideStyle(-1, left, phase);
			drawSideStyle(1, right, phase);
	}
}

function drawTopStyle(topStyle) {
	switch(topStyle) {
		default:
			drawCubeTop(topColor);
	}
}

function drawSideStyle(side, sideStyle, phase) {
	let main = getSideMainColor(side);
	let inner = getSideInnerColor(side);
	switch (sideStyle) {
		case "door": 
			drawDoor(side, phase);
			break;
		case "rounddoor": 
			drawRoundDoor(side, phase);
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
function drawSlope(side, phase) {
	let f = calculatePhaseMapper(side, phase, globalF2);
	hexagon(getSideInnerColor(side));
	fill(topColor);
	beginShape();
		vertex(side*tileWidth/2, tileHeight/4); // nearer bottom 
		vertex(0, -tileHeight/2); // top  
		vertex(-side*tileWidth/2, -tileHeight/4); // nearer top 
		vertex(0, tileHeight/2); // bottom 
	endShape();
	// animation 
	let longSlope = (3*tileHeight/2)/(side*tileWidth);
	strokeWeight(10);
	stroke(getSideInnerColor(-side));
	// stroke(lerpColor(topColor, getSideInnerColor(-side), 0.5));
	let topX = -side*tileWidth/4; 
	let topY = -3*tileHeight/8;
	let btmX = -topX;
	let btmY = -topY;
	let midX = (btmX + topX)/2;
	let midY = (btmY + topY)/2;
	line(midX, midY, map(f,0,1,midX,topX), map(f,0,1,midY,topY));
	line(midX, midY, map(f,0,1,midX,btmX), map(f,0,1,midY,btmY));
	noStroke();
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
				vertex(side*x, (i-verticalStep/2)-tileHeight/numStairs/4 - verticalStep/numStairs);
				vertex(side*(x - tileWidth/2), (i-verticalStep)-tileHeight/4);
				vertex(side*(x - tileWidth/2), i-tileHeight/4 - verticalStep/numStairs);
			endShape();
	}
}
function drawDoor(side, phase) {
	let f = calculatePhaseMapper(side, phase, globalF);
	drawCubeSide(side, topColor);
	if (meetCriteria) {
		fill(getSideInnerColor(side));
	} else {
		fill(lerpColor(getSideInnerColor(-side), getSideInnerColor(side), f));
	}
	let raised = map(f, 0, 1, 20*tileHeight/24/sqrt(3), 5*tileHeight/24/sqrt(3));
	beginShape(); 
		vertex(side*2*tileWidth/6 + side*perspectiveShift, 4*tileHeight/12); // btm R
		vertex(0, raised); // btm L
		vertex(side*tileWidth/6 + side*perspectiveShift, 0); // top L
		vertex(side*2*tileWidth/6 + side*perspectiveShift, 4*tileHeight/12 - tileHeight/4); // top R
	endShape();
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
function drawRoundDoor(side, phase) {
	let f = calculatePhaseMapper(side, phase, globalF);
	drawCubeSide(side, topColor);
	if (meetCriteria) {
		fill(getSideInnerColor(side));
	} else {
		fill(lerpColor(getSideInnerColor(-side), getSideInnerColor(side), f));
	}	let raised = map(f, 0, 1, 20*tileHeight/24/sqrt(3), 5*tileHeight/24/sqrt(3));	
	beginShape(); 
		vertex(side*2*tileWidth/6 + side*perspectiveShift, 4*tileHeight/12);
		vertex(0, raised);
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

function calculatePhaseMapper(side, phase, global) {
	// returns value between 0 and 1 for animation mapping 
	let f;
	phase += side;
	if (phase < 1) phase = doorPhases;
	if (phase > doorPhases) phase = 0;
	let phasedGlobalF = global;
	for (let i = 0; i < phase; i++) {
		phasedGlobalF += 50/3;
	}
	phasedGlobalF %= 50;
	if (phasedGlobalF > 25) {
		f = map(phasedGlobalF, 25, 49, 0, 1);
	} else {
		f = map(phasedGlobalF, 0, 25, 1, 0);
	}
	return f;
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
		this.phase = floor(random(1,doorPhases+1));
	}
	
	display() {
		drawStyle(this.overall, this.left, this.right, this.top, this.phase);;
	}
}