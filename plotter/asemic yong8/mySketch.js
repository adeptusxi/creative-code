/******** v plotSVG stuff v ********/
p5.disableFriendlyErrors = true; 

let bDoExportSvg = false; 
let myRandomSeed = 12345;
let regenerateButton; 
let exportSvgButton; 

function regenerate(){
  myRandomSeed = round(millis()); 
}

function initiateSvgExport(){
  bDoExportSvg = true; 
}
/******** ^ plotSVG stuff ^ ********/
// character parameters
let characterScale = 20;
let minMess = 0.25;
let maxMess = 0.75;

// layout parameters 
let drawGrids = false;

let numCharacters = 9; // per line
let numLines = 12;

let characterSpacing = 15;
let lineSpacing = 50;
let horizontalPadding = 145;
let verticalPadding = 240;

let horizontal = false; // rows or columns of characters?

let startMessAt = numCharacters * 0.1; // character to start cursive at 
let shortenLastLine = 3; // shorten the last line by how many characters?

// punctuation 
let period = false; // end phrases with periods? 
let endingPeriod = false; // end whole thing with a period?
let periodScale = 0.15; // radius relative to character scale 
let comma = false; // separate phrases with commas? 
let phraseLength = 3; 
let commaSpacing = characterSpacing * 1.5;
let seal = true; // replace last character with a red seal? 
let randomPunctuation = false; // replace random characters with punctuation? 
let periodChance = 0.1; 
let commaChance = 0.1; 


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

function setup() {
  createCanvas(1056, 816);
  
	/******** v plotSVG stuff v ********/
  regenerateButton = createButton('Regenerate');
  regenerateButton.position(0, height);
  regenerateButton.mousePressed(regenerate);
  
  exportSvgButton = createButton('Export SVG');
  exportSvgButton.position(100, height);
  exportSvgButton.mousePressed(initiateSvgExport);
  
  // Set the SVG group by stroke color to `true`, so that strokes 
  // of the same color are grouped together in the SVG file. 
  setSvgGroupByStrokeColor(true); 
	/******** ^ plotSVG stuff ^ ********/
}

let justPunctuated = true;

function draw(){
  randomSeed(myRandomSeed); 
  background(245); 
  strokeWeight(1);
  stroke(0);
  noFill();
  
	/******** v plotSVG stuff v ********/
  if (bDoExportSvg){
    beginRecordSVG(this, "plotSvg_generative_" + myRandomSeed + ".svg");
  }
	/******** ^ plotSVG stuff ^ ********/
	/********** v draw here v **********/

  for (let line = 0; line < numLines; line++) {
		let i = 0;
		let x, y;
		
		let localNumCharacters = numCharacters;
		if ((horizontal && line + 1 == numLines)
				 			|| (!horizontal && line == 0)) {
			localNumCharacters = max(0, localNumCharacters - shortenLastLine);
		}
    for (let character = 0; character < localNumCharacters; character++) {
      let messiness = i < startMessAt ? 0 : i / (localNumCharacters - 1);
			
			if (horizontal) {
        x = horizontalPadding + i * (characterScale + characterSpacing);
        y = verticalPadding + line * (characterScale + lineSpacing);
      } else {
        x = horizontalPadding + line * (characterScale + lineSpacing);
        y = verticalPadding + i * (characterScale + characterSpacing);
      }
			
			if (comma && character > 0 && character % phraseLength == 0) {
				if (horizontal) {
					x -= characterSpacing - commaSpacing;
					drawComma(x, y, characterScale);
					x += characterScale + commaSpacing;
				} else {
					y -= characterSpacing - commaSpacing;
					drawComma(x, y, characterScale);
					y += characterScale + commaSpacing;
				}
				
				i++;
			} 
			
			if (randomPunctuation && !justPunctuated) {
				let r = random();
				if (r < periodChance) {
					drawPeriod(x, y, characterScale);
				} else if (r < periodChance + commaChance) {
					drawComma(x, y, characterScale);
				} else {
					drawCharacter(x, y, characterScale, messiness);
				}
			} else {
				drawCharacter(x, y, characterScale, messiness);
			}
			i++;
    }
		
		if (period || (endingPeriod && line + 1 == numLines)) {
			if (horizontal) {
				x += characterScale + commaSpacing;
				drawPeriod(x, y, characterScale);
			} else {
				y += characterScale + commaSpacing;
				drawPeriod(x, y, characterScale);
			}
		}
		
		if (seal && ((horizontal && line + 1 == numLines)
				 			|| (!horizontal && line == 0))) {
			if (horizontal) {
				x += characterScale + commaSpacing;
			} else {
				y += characterScale + commaSpacing;
			}
			drawSeal(x, y, characterScale);
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

function mouseClicked() {
  regenerate();
	loop();
}

function drawComma(x, y, s) {
  beginShape();
	vertex(x + s * 0.05, y + s * 0.3);
  bezierVertex(
    x + s * 0.1, y + s * 0.3,
    x + s * 0.075, y + s * 0.5,
    x - s * 0.05, y + s * 0.5
  ); 
	endShape();
	justPunctuated = true;
}

function drawPeriod(x, y, s) {
	if (horizontal) {
		circle(x, y + s * 0.5, s * periodScale);
	} else {
		circle(x + s * 0.5, y, s * periodScale);
	}
	justPunctuated = true;
}

function drawSeal(x, y, s) {
	stroke('red');
	rectMode(CENTER);
	rect(x, y, s, s * 1.25, 3);
	drawCharacter(x, y, characterScale * 0.75, 0);
	drawCharacter(x, y, characterScale * 0.75, 0.5);
	stroke(0);
}

function drawCharacter(x, y, s, messiness) {
	if (drawGrids) {
		stroke(0, 0, 0, 50);
		rectMode(CENTER);
		rect(x, y, s);
		stroke(0);
	}
	
	let connectProbability = messiness;
	let loopScalar = map(messiness, 0, 1, minMess, maxMess);
	
  let numStrokes = floor(random(3, 16)); 

	let prevEnd = {x: x, y: y};
  for (let i = 0; i < numStrokes; i++) {
    prevEnd = drawRandomStroke({x: x, y: y}, prevEnd, s, connectProbability, loopScalar);
  }
	
	justPunctuated = false;
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
