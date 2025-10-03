let numLines = 12;
let lines = [];
let borderWidth = 50;
let epsilon = 1e-10; // close enough 
let minLength = 200;
let maxLength = 400;
let minMarkSize = 10;
let maxMarkSize = 20;
let markSize = minMarkSize; 
let markGrowth = 0.75;

let bgColor = 0;
let drawColor = 255;
let fillMarks = false;

let t = 0; // time in frames 
let easeDuration = 200; // in frames 

function setup() {
	createCanvas(640, 640);
	background(bgColor);
	stroke(drawColor);
	fill(drawColor);
	initBorderLines();
	initLines();
}

function draw() {
	background(bgColor, bgColor, bgColor, 5);
	drawLines();
	stroke(drawColor);
	markIntersections();
	noStroke();
	markSize -= 1;
	markIntersections();
	markSize += 1;
	drawBorderMask();
	
	// linear growth/shrink 
	// markSize += markGrowth;
	// if (markSize > maxMarkSize || markSize < minMarkSize) {
	// 	markGrowth *= -1;
	// }
	
	t += markGrowth;
	if (t > easeDuration) {
	t = 0; 
	}
	let normalizedTime = t / easeDuration;
	let easeValue = quadEase(normalizedTime*2, 0, 1, 1);
	markSize = lerp(minMarkSize, maxMarkSize, easeValue);
	markSize = constrain(markSize, minMarkSize, maxMarkSize);
}

function mousePressed() {
	initLines();
	let markSize = minMarkSize; 
	background(bgColor);
	draw();
}

function quadEase(time, start, change, duration) {
  time /= duration / 2;
  if (time < 1) return change / 2 * time * time + start;
  time--;
  return -change / 2 * (time * (time - 2) - 1) + start;
}

function initBorderLines() {
	// top 
	let x1 = borderWidth;
	let y1 = borderWidth; 
	let x2 = width - borderWidth;
	let y2 = borderWidth;
	lines.push({ x1, y1, x2, y2 });
	// left 
	x2 = borderWidth;
	y2 = height - borderWidth;
	lines.push({ x1, y1, x2, y2 });
	// bottom 
	x1 = x2;
	y1 = y2; 
	x2 = width - borderWidth;
	y2 = height - borderWidth;
	lines.push({ x1, y1, x2, y2 });
	// right 
	x1 = x2;
	y1 = y2; 
	x2 = width - borderWidth;
	y2 = borderWidth;
	lines.push({ x1, y1, x2, y2 });
}

function initLines() {
	lines = lines.slice(0,4);
	for (let i = 0; i < numLines; i++) {
    let x1 = random(borderWidth, width - borderWidth);
    let y1 = random(borderWidth, height - borderWidth);
    let length = random(minLength, maxLength);
    let angle = random(TWO_PI);
    let x2 = x1 + length * cos(angle);
    let y2 = y1 + length * sin(angle);
    x2 = constrain(x2, borderWidth, width - borderWidth);
    y2 = constrain(y2, borderWidth, height - borderWidth);
    lines.push({ x1, y1, x2, y2 });
  }
}

function drawLines() {
	for (let i = 0; i < lines.length; i++) {
    let l = lines[i];
    line(l.x1, l.y1, l.x2, l.y2);
  }
}

function drawMark(x, y, diag1, diag2) {
	fillMarks ? fill(drawColor) : fill(bgColor);
	
	// calculate normalized-scaled diagonals 
	let d1 = diag1.copy();
	d1.normalize();
	d1.mult(markSize);
	let d2 = diag2.copy();
	d2.normalize();
	d2.mult(markSize);

  // starburst vertices 
  let p1 = createVector(x + d1.x, y + d1.y); 
  let p2 = createVector(x - d1.x, y - d1.y); 
  let p3 = createVector(x + d2.x, y + d2.y); 
  let p4 = createVector(x - d2.x, y - d2.y); 

  beginShape(); 
		// bezier vertices from chat gpt 
		vertex(p4.x, p4.y);
		bezierVertex(
			(x + p4.x) / 2, (y + p4.y) / 2,  // control point 
			(x + p1.x) / 2, (y + p1.y) / 2,
			p1.x, p1.y
		);

		vertex(p1.x, p1.y);
		bezierVertex(
			(x + p1.x) / 2, (y + p1.y) / 2,  // control point 
			(x + p3.x) / 2, (y + p3.y) / 2,
			p3.x, p3.y
		);

		vertex(p3.x, p3.y);
		bezierVertex(
			(x + p3.x) / 2, (y + p3.y) / 2,  // control point 
			(x + p2.x) / 2, (y + p2.y) / 2,
			p2.x, p2.y
		);

		vertex(p2.x, p2.y);
		bezierVertex(
			(x + p2.x) / 2, (y + p2.y) / 2,  // control point 
			(x + p4.x) / 2, (y + p4.y) / 2,
			p4.x, p4.y
		);
  endShape(CLOSE);
}

function drawBorderMask() {
	noStroke();
	fill(bgColor);
	rect(0, 0, width, borderWidth); // top 
	rect(0, 0, borderWidth, height); // left 
	rect(0, height - borderWidth, width, borderWidth); // bottom 
	rect(width - borderWidth, 0, borderWidth, height); // right 
	stroke(drawColor);
}

function markIntersections() {
  for (let i = 0; i < lines.length; i++) {
    for (let j = i + 1; j < lines.length; j++) {
      let l1 = lines[i];
      let l2 = lines[j];
      let [intersects, x, y, d1, d2] = lineIntersect(l1.x1, l1.y1, l1.x2, l1.y2, l2.x1, l2.y1, l2.x2, l2.y2);
      if (intersects) {
        drawMark(x, y, d1, d2); 
      }
    }
  }
}

// adapted from Paul Bourke's code @ https://paulbourke.net/geometry/pointlineplane/pdb.c
function lineIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
  let denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
  let numera = (x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3);
  let numerb = (x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3);

  // lines on top of each other 
  if (Math.abs(numera) < epsilon && Math.abs(numerb) < epsilon && Math.abs(denom) < epsilon) {
    let x = (x1 + x2) / 2;
    let y = (y1 + y2) / 2;
    return [true, x, y];
  }

  // lines parallel 
  if (Math.abs(denom) < epsilon) {
    return [false, 0, 0];
  }

  // lines intersecting 
  let mua = numera / denom;
  let mub = numerb / denom;
  if (mua < 0 || mua > 1 || mub < 0 || mub > 1) {
    return [false, 0, 0];
  }
	let x = x1 + mua * (x2 - x1);
  let y = y1 + mua * (y2 - y1);
  let d1 = createVector(x2 - x1, y2 - y1);
  let d2 = createVector(x4 - x3, y4 - y3);
  return [true, x, y, d1, d2];
}