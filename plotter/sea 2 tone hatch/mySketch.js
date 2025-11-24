let WORK = false; // upload image first, set to true
let imageName = 'a.png';
let imgScale = 1/1.1;

let img;
let cellRadius = 18; 
let charScale = 0.7; // within a cell 

let minMess = 0.25;
let maxMess = 0.75;

let drawImage = false;
let drawGrids = false;
let drawGrayscale = false;

const StrokeType = {
  DIAN: "dian",
  HENG: "heng",
  SHU: "shu",
  GOU: "gou",
  PIE: "pie",
  NA: "na",
  TI: "ti",
  WAN: "wan"
}

const WeightedStrokeType = {
  [StrokeType.DIAN]: 1,
  [StrokeType.HENG]: 2.5,
  [StrokeType.SHU]: 1, 
	[StrokeType.GOU]: 0.75,
	[StrokeType.PIE]: 1,
	[StrokeType.NA]: 0.8,
	[StrokeType.TI]: 0.8,
	[StrokeType.WAN]: 0.8
};

/******** v plotSVG stuff v ********/
p5.disableFriendlyErrors = true; 

let bDoExportSvg = false; 
let myRandomSeed = 12345;
let exportSvgButton; 

function initiateSvgExport(){
  bDoExportSvg = true; 
	loop();
}
/******** ^ plotSVG stuff ^ ********/

function preload() {
	if (!WORK) {
		print("upload an image and set WORK=true");
		return;
	}
	img = loadImage(imageName);
}

function setup() {
	if (!WORK) return;
	
  createCanvas(12*96, 12*96); // Letter: 8.5"x11 at 96 DPI.
	img.resize(img.width*imgScale, img.height*imgScale);
  
	/******** v plotSVG stuff v ********/
  
  exportSvgButton = createButton('Export SVG');
  exportSvgButton.position(0, height);
  exportSvgButton.mousePressed(initiateSvgExport);
  
  // Set the SVG group by stroke color to `true`, so that strokes 
  // of the same color are grouped together in the SVG file. 
  setSvgGroupByStrokeColor(true); 
	/******** ^ plotSVG stuff ^ ********/
}

function draw(){
	if (!WORK) return;
	
  background(160); 
  strokeWeight(0.5);
  stroke(0);
  noFill();
  
	/******** v plotSVG stuff v ********/
  if (bDoExportSvg){
    beginRecordSVG(this, "yong_hatch.svg");
  }
	/******** ^ plotSVG stuff ^ ********/
	/********** v draw here v **********/

	let xStart = width/2 - img.width/2 - 50;
	let yStart = height/2 - img.height/2 - 30;
	if (drawImage) {
		image(img, xStart, yStart);
	}
			
  for (let row=0; row<img.height/cellRadius; row++){
    for (let col=0; col<img.width/cellRadius; col++){
      let px = col * cellRadius; 
      let py = row * cellRadius; 
      let colorAtXY = img.get(px,py); 
			if (alpha(colorAtXY) == 0) continue; // background 
      let r = red (colorAtXY); 
      let g = green (colorAtXY); 
      let b = blue (colorAtXY); 
      let bri01 = (0.299*r + 0.587*g + 0.114*b)/255; //  NTSC luminance
      
			drawCell(xStart + px, yStart + py, cellRadius, bri01);
    }
  }

	/********** ^ draw here ^ **********/
	/******** v plotSVG stuff v ********/
  if (bDoExportSvg){
    endRecordSVG();
    bDoExportSvg = false;
  }
	/******** ^ plotSVG stuff ^ ********/
	
	noLoop();
}

function drawCell(x, y, r, brightness) {
	let threshold = getThreshold(brightness);
	if (threshold.offCenter == 0) return;
	
	if (drawGrayscale) {
		noStroke();
		fill(threshold.col);
		if(threshold.col == 0) {
			ellipse(x+r/2, y+r/2, map(threshold.threshold, 0, 0.45, r, r/4));
		} else {
			ellipse(x+r/2, y+r/2, map(threshold.threshold, 0.45, 1, r/4, r));
		}
		noFill();
	}
			
	stroke(threshold.col);
	drawSymbol(x, y, r, threshold.offCenter);
}

// returns { threshold: normalized threshold 
// 					 col: black or white 
//				 	offCenter: threshold levels away from middle level }
function getThreshold(brightness) {
	if (brightness < 0.13) return {threshold: 0, col: 'black', offCenter: 4};
	if (brightness < 0.18) return {threshold: 0.25, col: 'black', offCenter: 3};
	if (brightness < 0.23) return {threshold: 0.35, col: 'black', offCenter: 2};
	if (brightness < 0.28) return {threshold: 0.45, col: 'black', offCenter: 1};
	
	if (brightness > 0.6) return {threshold: 1, col: 'white', offCenter: 4};
	if (brightness > 0.52) return {threshold: 0.8, col: 'white', offCenter: 3};
	if (brightness > 0.42) return {threshold: 0.7, col: 'white', offCenter: 2};
	if (brightness > 0.38) return {threshold: 0.5, col: 'white', offCenter: 1};
	
	return {threshold: 0.45, col: 'black', offCenter: 0};
}

function drawSymbol(x, y, cellSize, offCenter) {
	if (drawGrids) {
		rect(x - cellSize/2, y - cellSize/2, cellSize);
	}
	switch(offCenter) {
		case 4: 
			// let verts = drawPersonUnioned(x, y, cellSize);
			// drawHatchedPolygon(x, y, verts, 1.5);
			drawCoral(x, y, cellSize);
			break;
		case 3: 
			drawFish(x, y, cellSize);
			break; 
		case 2: 
			drawBubbleGroup(x, y, cellSize);
			break; 
		case 1: 
			drawBubble(x, y ,cellSize);
			break; 
		default: 
			print("called drawSymbol with offCenter=" + offCenter);
	}
}

function drawBubble(x, y, cellSize) {
	let bubbleRadius = random(cellSize/3, cellSize/2);
	let randX = random(x - cellSize/1.5 + bubbleRadius/1, x + cellSize/2 - bubbleRadius/1.5);
	let randY = random(y - cellSize/1.5 + bubbleRadius/1, y + cellSize/2 - bubbleRadius/1.5);
	ellipseAsVerts(randX, randY, bubbleRadius);
}

function drawBubbleGroup(x, y, cellSize) {
	ellipseAsVerts(x-cellSize/5, y-cellSize/3.5, cellSize/4); // top 
	ellipseAsVerts(x+cellSize/5.5, y-cellSize/15, cellSize/2); // middle 
	ellipseAsVerts(x-cellSize/4.5, y+cellSize/4, cellSize/3); // bottom 
}

function ellipseAsVerts(x, y, r) {
	let ellipsePoints = 20;
	beginShape();
	for (let i = 0; i < ellipsePoints; i++) {
		let theta = TWO_PI * i / ellipsePoints;
		let px = x + r/2 * Math.cos(theta);
		let py = y - r/2 * Math.sin(theta); 
		vertex(px, py);
	}
	endShape(CLOSE);
}

function drawFish(x, y, cellSize) {
	let verts = getFishVertices(cellSize);
	
  let scale = 1000;
  let clipperPaths = verts.map(vs => p5VerticesToClipper(vs, scale));
  let cpr = new ClipperLib.Clipper();
  cpr.AddPaths(clipperPaths, ClipperLib.PolyType.ptSubject, true);
  let solution_paths = new ClipperLib.Paths();
  cpr.Execute(ClipperLib.ClipType.ctUnion, solution_paths, ClipperLib.PolyFillType.pftNonZero, ClipperLib.PolyFillType.pftNonZero);

	push();
	translate(x,y);
	for (let i = 0; i < solution_paths.length; i++) {
			beginShape();
		let unionedVerts = clipperPathToP5(solution_paths[i], scale);
		for (let v of unionedVerts) {
			vertex(v.x, v.y);
		}
		endShape(CLOSE);
	}
	pop();
}

function getFishVertices(cellSize) {
	let x = 0;
	let y = 0;
	let results = [];
	
  let size = cellSize / 2;

  let bodyLength = size * 1.2; 
  let bodyHeight = size / 1.5; 
  let cx = x + bodyLength / 4;

	// head 
	let head = [];
	let ellipsePoints = 10;
	for (let i = 0; i < ellipsePoints; i++) {
		let theta = TWO_PI * i / ellipsePoints;
		let px = cx + (bodyLength / 2) * Math.cos(theta);
		let py = y - (bodyHeight / 2) * Math.sin(theta); 
		head.push({ x: px, y: py });
	}

	// tail 
	let tailWidth = size;
	let tailLength = size * 0.75;
	let tail = [];
	tail.push({ x: x - tailLength, y: y - tailWidth / 2 });
	tail.push({ x: x - tailLength, y: y + tailWidth / 2 });
	tail.push({ x: x + 0, y: y + 0 });

	// top fin 
	let finWidth = tailWidth / 2;
	let topFin = [];
	topFin.push({ x: x + finWidth / 4, y: y - cellSize / 2 + finWidth / 2 });
	topFin.push({ x: x + finWidth, y: y - bodyHeight / 2 });
	topFin.push({ x: x + 0, y: y - bodyHeight / 2 });

	// bottom fin
	let bottomFin = [];
	bottomFin.push({ x: x + finWidth / 4, y: y + cellSize / 2 - finWidth / 2 });
	bottomFin.push({ x: x + finWidth, y: y + bodyHeight / 2 });
	bottomFin.push({ x: x + 0, y: y + bodyHeight / 2 });
	
	results.push(head);
	results.push(tail);
	results.push(topFin);
	results.push(bottomFin);
	
	return results;
}

function drawCoral(x, y, cellSize, maxDepth = 2) {
	let half = cellSize/2;
  let vertices = [];

  function branch(px, py, length, angle, depth) {
    if (depth > maxDepth || length < 1) return;

    let tipX = px + length * cos(angle);
    let tipY = py + length * sin(angle);
		tipX = constrain(tipX, x - half, x + half);
		tipY = constrain(tipY, y - half, y + half);

    vertices.push({ x: px, y: py });
    vertices.push({ x: tipX, y: tipY });

    let nBranches = floor(random(1, 3));
    for (let i = 0; i < nBranches; i++) {
      let newAngle = angle + radians(random(-35, 35));
      let newLength = length * random(0.5, 1);
      branch(tipX, tipY, newLength, newAngle, depth + 1);
    }
  }

  let trunkLength = cellSize / 2;
	branch(x, y + cellSize / 2, trunkLength, -PI/4, 0);
  branch(x, y + cellSize / 2, trunkLength, -PI/3, 0);
	branch(x, y + cellSize / 2, trunkLength, -PI/2, 0);
	branch(x, y + cellSize / 2, trunkLength, -2*PI/3, 0);
	branch(x, y + cellSize / 2, trunkLength, -3*PI/4, 0);

  push();
  for (let i = 0; i < vertices.length; i += 2) {
    let p1 = vertices[i];
    let p2 = vertices[i + 1];
    line(p1.x, p1.y, p2.x, p2.y);
  }
  pop();

  //return vertices; 
}
