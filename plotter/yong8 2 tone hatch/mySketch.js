let WORK = false; // upload image first, set to true
let imageName = 'a.png';
let imgScale = 1/3;

let img;
let cellRadius = 10; 
let charScale = 0.7; // within a cell 

let minMess = 0.25;
let maxMess = 0.75;

let drawImage = false;
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
	
  createCanvas(816, 1056); // Letter: 8.5"x11 at 96 DPI.
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
	
  background(220); 
  strokeWeight(0.5);
  stroke(0);
  noFill();
  
	/******** v plotSVG stuff v ********/
  if (bDoExportSvg){
    beginRecordSVG(this, "yong_hatch.svg");
  }
	/******** ^ plotSVG stuff ^ ********/
	/********** v draw here v **********/

	let xStart = width/2 - img.width/2;
	let yStart = height/2 - img.height/2;
	if (drawImage) {
		image(img, xStart, yStart);
	}
			
  for (let row=0; row<img.height/cellRadius; row++){
    for (let col=0; col<img.width/cellRadius; col++){
			// tuned to specific photo; less detail in foreground 
			let big = false;
			
      if ((row < 21 && col != 8 && col != 9) || (row >= 61)) {
				if (row % 2 == 1 || col % 2 == 1)
					// draw big cell starting from top left, skip other three small cells 
					continue;
				else 
					big = true;
			}
			
      let px = col * cellRadius; 
      let py = row * cellRadius; 
      let colorAtXY = img.get(px,py); 
			if (alpha(colorAtXY) == 0) continue; // background 
      let r = red (colorAtXY); 
      let g = green (colorAtXY); 
      let b = blue (colorAtXY); 
      let bri01 = (0.299*r + 0.587*g + 0.114*b)/255; //  NTSC luminance
      
			// 
      if (big) {
				drawCell(xStart + px, yStart + py, cellRadius * 2, bri01);
			} else {
				drawCell(xStart + px, yStart + py, cellRadius, bri01);
			}
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
	if (drawGrayscale) {
		noStroke();
		fill(map(brightness, 0, 1, 0, 255));
		rect(x, y, r);
	}
	stroke(0);
	noFill();
	
	// let mess = 1 - brightness;
	let mess = 0;
	let threshold = getThreshold(brightness);
	stroke(threshold.col);
	drawCharacter(x, y, r * charScale, mess, threshold.numStrokes);
}

function getThreshold(brightness) {
	if (brightness < 0.1) return {numStrokes: 20, col: 0};
	if (brightness < 0.23) return {numStrokes: 12, col: 0};

	if (brightness > 0.8) return {numStrokes: 15, col: 255};
	if (brightness > 0.6) return {numStrokes: 8, col: 255};
	return {numStrokes: 2, col: 0};
}

function drawCharacter(x, y, s, messiness, numStrokes) {	
	let connectProbability = messiness;
	let loopScalar = map(messiness, 0, 1, minMess, maxMess);

	let prevEnd = {x: x, y: y};
  for (let i = 0; i < numStrokes; i++) {
    prevEnd = drawRandomStroke({x: x, y: y}, prevEnd, s, connectProbability, loopScalar);
  }	
}

function weightedRandom(weights) {
  const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
  let r = Math.random() * totalWeight;
  for (const [item, weight] of Object.entries(weights)) {
    if (r < weight) return item;
    r -= weight;
  }
}

function drawRandomStroke(center, prevEnd, s, connectProbability, connectLoopScalar) {
  let {x, y} = center;
	s = s * 0.75;

  let topL = { x: x - s * 0.5,   y: y - s * 0.5 };
  let topM = { x: x,             y: y - s * 0.5 };
  let topR = { x: x + s * 0.5,   y: y - s * 0.5 };
  let midL = { x: x - s * 0.5,   y: y };
  let midM = { x: x,             y: y };
  let midR = { x: x + s * 0.5,   y: y };
  let botL = { x: x - s * 0.5,   y: y + s * 0.5 };
  let botM = { x: x,             y: y + s * 0.5 };
  let botR = { x: x + s * 0.5,   y: y + s * 0.5 };

  let type = weightedRandom(WeightedStrokeType); 
  let start, scl = s;

  switch (type) {
    case StrokeType.DIAN:
      start = random([topL, topM, topR, midL, midM, midR, botL, botM, botR]);
      break;
    case StrokeType.HENG:
      start = random([topL, topM, midL, midM, botL, botM]);
			scl = random(s * 0.25, s);
      break;
    case StrokeType.SHU:
			start = random([topL, topM, topR, midL, midM, midR]);
			scl = random(s * 0.5, s);
      break;
    case StrokeType.GOU:
      start = random([topL, topM, topR, midL, midM, midR]);
      break;
    case StrokeType.PIE:
      start = random([topL, topM, midL, midM]);
      scl = random(s * 0.25, s * 0.5);
      break;
    case StrokeType.NA:
			start = random([topM, midL, midM]);
      break;
    case StrokeType.TI:
      start = random([topL, topM, midL, midM]);
      scl = random(s * 0.25, s * 0.5);
      break;
    case StrokeType.WAN:
      start = random([topM, midL, midM]);
			scl = random(s * 0.25, s * 0.5);
      break;
  }
	
	if (random() <= connectProbability) connect(prevEnd, start, s, connectLoopScalar);

  return drawStroke(type, start, scl);
}

function connect(start, end, s, loopScalar) {
	// connect two strokes cursive-style 
	beginShape();
	vertex(start.x, start.y);

	let cp1 = {
		x: start.x + random(-s * loopScalar, s * loopScalar),
		y: start.y + random(-s * loopScalar, s * loopScalar)
	};
	let cp2 = {
		x: end.x + random(-s * loopScalar, s * loopScalar),
		y: end.y + random(-s * loopScalar, s * loopScalar)
	};

	bezierVertex(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);
	endShape();
}

// strokes ---------------------------

function drawStroke(type, start, s) {
  switch (type) {
    case StrokeType.DIAN:
      return dian(start, s);
    case StrokeType.HENG:
      return heng(start, s);
    case StrokeType.SHU:
      return shu(start, s);
    case StrokeType.GOU:
      return gou(start, s);
    case StrokeType.PIE:
      return pie(start, s);
    case StrokeType.NA:
      return na(start, s);
    case StrokeType.TI:
      return ti(start, s);
    case StrokeType.WAN:
      return wan(start, s);
  }
}

function dian(start, s) {
  let end = { 
    x: start.x + s * 0.15, 
    y: start.y + s * 0.06 
  };
  line(start.x, start.y - s * 0.06, end.x, end.y);
  return end;
}

function heng(start, s) {
  let end = { 
    x: start.x + s, 
    y: start.y - s * 0.15 
  };
  line(start.x, start.y, end.x, end.y);
  return end;
}

function shu(start, s) {
  let end = { 
    x: start.x, 
    y: start.y + s 
  };
  line(start.x, start.y, end.x, end.y);
  return end;
}

function gou(start, s) {
  let mid = { 
    x: start.x, 
    y: start.y + s 
  };
  let end = { 
    x: start.x - s * 0.3, 
    y: start.y + s * 0.8 
  };
  line(start.x, start.y, mid.x, mid.y);
  line(mid.x, mid.y, end.x, end.y);
  return end;
}

function pie(start, s) {
  let end = { 
    x: start.x - s, 
    y: start.y + s * 0.6 
  };
  noFill();
  beginShape();
  vertex(start.x, start.y);
  bezierVertex(
    start.x - s * 0.1, start.y + s * 0.15,
    start.x - s * 0.2, start.y + s * 0.3,
    end.x, end.y
  );
  endShape();
  return end;
}

function na(start, s) {
  let end = { 
    x: start.x + s * 1.1, 
    y: start.y + s * 0.65 
  };
  noFill();
  beginShape();
  vertex(start.x, start.y);
  bezierVertex(
    start.x + s * 0.1, start.y + s * 0.15,
    start.x + s * 0.25, start.y + s * 0.35,
    start.x + s * 0.7, start.y + s * 0.6
  );
  bezierVertex(
    start.x + s * 0.8, start.y + s * 0.65,
    start.x + s * 0.9, start.y + s * 0.65,
    end.x, end.y
  );
  endShape();
  return end;
}

function ti(start, s) {
  let end = { 
    x: start.x + s * 0.8, 
    y: start.y + s * 0.05 
  };
  noFill();
  beginShape();
  vertex(start.x, start.y);
  bezierVertex(
    start.x + s * 0.2, start.y + s * 0.05,
    start.x + s * 0.4, start.y + s * 0.1,
    end.x, end.y
  );
  endShape();
  return end;
}

function wan(start, s) {
  let end = { 
    x: start.x - s, 
    y: start.y + s 
  };
  noFill();
  beginShape();
  vertex(start.x, start.y);
  bezierVertex(
    start.x - s * 0.2, start.y + s * 0.3,
    start.x - s * 0.5, start.y + s * 0.7,
    end.x, end.y
  );
  endShape();
  return end;
}
