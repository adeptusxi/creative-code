let DEBUG = false;
let PRINTDEBUG = false;

let gridPoints = []; 
let numPointsAcross = 20; 
let quads = [];
let numQuads = 25;
let border; 
let colors = [];

let mode;;

function setup() {
  createCanvas(650, 650);
  background(255);
	noStroke();
	frameRate(10);	
	border = width / (numPointsAcross + 2);
	//noLoop(); // 

	mode = ShiftMode.LEAD;
	initColors();
	initGrid();
	initQuads();
	shiftFirstVertex(); 
}

function draw() {
	background(255);
	if (mode == ShiftMode.LEAD) {
		shiftFirstVertex();
		mode = ShiftMode.FOLLOW;
	} else {
		checkAndShiftVertex();
		mode = ShiftMode.LEAD;
		for (let i = 0; i < quads.length; i++) {
			quads[i].justShifted = false;
		}
	}
	drawQuads();
	if (DEBUG) {
		drawTextGrid();
	} else {
		drawDotGrid();
	}
}

function mouseClicked() {
	draw();
}

// draw grid points as dots
function drawDotGrid() {
  fill(150);
  for (let point of gridPoints) {
    ellipse(point.x, point.y, 2);
  }
}

// draw grid points by index in array
function drawTextGrid() {
  textSize(10);
  textAlign(CENTER, CENTER);

  for (let i = 0; i < gridPoints.length; i++) {
    let point = gridPoints[i];
		
		// highlight used/candidate points 
		if (point.used) {
			fill(255,0,0);
		} else if (point.isShiftCandidate) {
			fill(0,255,0);
		} else {
			fill(0);
		}
		
    text(i, point.x, point.y);
  }
}

function initColors() {
	colors.push(color(108, 137, 173, 100));
}

function initGrid() {
	let maxX = width - border;
	let gridSpacing = (width - 2*border) / (numPointsAcross - 1);
  for (let y = border; y <= height - border; y += gridSpacing) {
    for (let x = border; x <= width - border; x += gridSpacing) {
			let isRightEdge = (x >= maxX - gridSpacing + border);
      gridPoints.push(new Point(x, y, isRightEdge));
    }
  }
}

function initQuads() {
	fill(100,100,100,100);
	let i1 = 0;
	let i2 = 3;
	let i3 = 60; 
	let i4 = 63; 
	for (let i = 0; i < numQuads; i++) {
		let p1 = gridPoints[i1]; // top left 
		let p2 = gridPoints[i2]; // top right 
		let p3 = gridPoints[i3]; // bottom left 
		let p4 = gridPoints[i4]; // bottom right
		colidx = floor(random(0, colors.length));
		let qd = new Quad(p1, i1, p2, i2, p3, i3, p4, i4, colors[colidx]);
		quads.push(qd);
		
		gridPoints[i1].used = true;
		gridPoints[i2].used = true;
		gridPoints[i3].used = true;
		gridPoints[i4].used = true;
		
		// if square at edge, shift down to next row 
		// otherwise shift over 
		let shift = p2.isRightEdge ? 64 : 4; // FIX
		i1 += shift;
		i2 += shift;
		i3 += shift;
		i4 += shift;
	}
}

function drawQuads() {
	fill(100,100,100,100);
	for (let i = 0; i < quads.length; i++) {
		quads[i].draw();
	}
}

// start the vertex shifting chain reaction 
function shiftFirstVertex() {
	let idx = floor(random(quads.length)); // random quad to shift 
	let q = quads[idx];
	q.justShifted = true;
	let v = random([1,2,3,4]); // random vertex to shift 

	let oldVertex;
	let oldPoint;
	
	switch (v) {
		case 1:
			// top left vertex1
			oldVertex = q.vertex1;
			oldPoint = q.idx1;
			if (oldPoint + Direction.DR > gridPoints.length 
					|| (gridPoints[oldPoint + Direction.DR]).used) 
				return;
			q.vertex1 = gridPoints[oldPoint + Direction.DR];
			q.idx1 += Direction.DR;
			q.vertex1.used = true;
			q.vertex1.isShiftCandidate = false;
			
			gridPoints[q.idx1 + Direction.L].isShiftCandidate = true;
			gridPoints[q.idx1 + Direction.U].isShiftCandidate = true;
			
			break;
		case 2:
			// top right vertex2
			oldVertex = q.vertex2;
			oldPoint = q.idx2;
			if (oldPoint + Direction.DL > gridPoints.length
						|| (gridPoints[oldPoint + Direction.DL]).used) 
				return;
			q.vertex2 = gridPoints[oldPoint + Direction.DL];
			q.idx2 += Direction.DL;
			q.vertex2.used = true;
			q.vertex2.isShiftCandidate = false;
			
			gridPoints[q.idx2 + Direction.R].isShiftCandidate = true;
			gridPoints[q.idx2 + Direction.U].isShiftCandidate = true;
			
			break;
		case 3:
			// bottom left vertex3 
			oldVertex = q.vertex3;
			oldPoint = q.idx3;
			if (oldPoint + Direction.UR < gridPoints.length
						|| (gridPoints[oldPoint + Direction.UR]).used) 
				return;
			q.vertex3 = gridPoints[oldPoint + Direction.UR];
			q.idx3 += Direction.UR;
			q.vertex3.used = true;
			q.vertex3.isShiftCandidate = false;
			
			gridPoints[q.idx3 + Direction.L].isShiftCandidate = true;
			gridPoints[q.idx3 + Direction.D].isShiftCandidate = true;
			
			break;
		case 4:
			// bottom right vertex4 
			oldVertex = q.vertex4;
			oldPoint = q.idx4;
			if (oldPoint + Direction.UL < gridPoints.length
						|| (gridPoints[oldPoint + Direction.UL]).used) 
				return;
			q.vertex4 = gridPoints[oldPoint + Direction.UL];
			q.idx4 += Direction.UL;
			q.vertex4.used = true;
			q.vertex4.isShiftCandidate = false;
			
			gridPoints[q.idx4 + Direction.R].isShiftCandidate = true;
			gridPoints[q.idx4 + Direction.D].isShiftCandidate = true;
			
			break;
	}
	
	oldVertex.used = false;
	oldVertex.isShiftCandidate = true;
}

// if possible, shift a vertex into a shift candidate  
function checkAndShiftVertex() {
	for (let i = 0; i < quads.length; i++) {
		let q = quads[i];
		if (q.justShifted) continue;
		for (let j = 1; j <= 4; j++) {
			let dir;
			let idx;
			if (j == 1) {
				idx = q.idx1;
			} else if (j == 2) {
				idx = q.idx2;
			} else if (j == 3) {
				idx = q.idx3;
			} else if (j == 4) {
				idx = q.idx4;
			} else {
				// unreachable 
			}
			dir = checkShiftCandidates(idx);
			if (PRINTDEBUG && dir != Direction.NONE) {
				print("quad: " + (i+1));
				print("vertex: " + j);
				print("point: " + idx);
				print("direction: " + dir);
				print('\n');
			}
			shiftVertex(q, j, dir);
		}
	}
}

// check if adjacent grid points are shift candidates 
// returns a direction to shift in, or Direction.NONE 
function checkShiftCandidates(idx) {
	let rightEdge = idx % numPointsAcross == (numPointsAcross - 1); 
	let leftEdge = idx % numPointsAcross == 0;
	let topEdge = idx < numPointsAcross;
	let bottomEdge = idx >= numPointsAcross * numPointsAcross - numPointsAcross;
	
	if (!topEdge) {
		if (!leftEdge && gridPoints[idx + Direction.UL].isShiftCandidate) return Direction.UL;
		if (gridPoints[idx + Direction.U].isShiftCandidate) return Direction.U;
		if (!rightEdge && gridPoints[idx + Direction.UR].isShiftCandidate) return Direction.UR;
	}
	
	if (!leftEdge && gridPoints[idx + Direction.L].isShiftCandidate) return Direction.L;
	if (!rightEdge && gridPoints[idx + Direction.R].isShiftCandidate) return Direction.R;
	
	
	if (!bottomEdge) {
		if (!leftEdge && gridPoints[idx + Direction.DL].isShiftCandidate) return Direction.DL;
		if (gridPoints[idx + Direction.D].isShiftCandidate) return Direction.D;
		if (!rightEdge && gridPoints[idx + Direction.DR].isShiftCandidate) return Direction.DR;
	}
	return Direction.NONE;
}

// shift the given vertex in the given direction 
// shiftVertex(quad object, vertex number to shift, direction to shift)
function shiftVertex(q, v, dir) {
	if (dir == Direction.NONE) return;
	
	let oldVertex;
	if (v == 1) {
		// shift top left 
		oldVertex = q.vertex1;
		q.idx1 += dir;
		q.vertex1 = gridPoints[q.idx1];
		q.vertex1.used = true;
		q.vertex1.isShiftCandidate = false;
	} else if (v == 2) {
		// shift top right 
		oldVertex = q.vertex2;
		q.idx2 += dir;
		q.vertex2 = gridPoints[q.idx2];
		q.vertex2.used = true;
		q.vertex2.isShiftCandidate = false;
	} else if (v == 3) {
		// shift bottom left 
		oldVertex = q.vertex3;
		q.idx3 += dir;
		q.vertex3 = gridPoints[q.idx3];
		q.vertex3.used = true;
		q.vertex3.isShiftCandidate = false;
	} else if (v == 4) {
		// shift bottom right 
		oldVertex = q.vertex4;
		q.idx4 += dir;
		q.vertex4 = gridPoints[q.idx4];
		q.vertex4.used = true;
		q.vertex4.isShiftCandidate = false;
	} else {
		//unreachable 
	}
	oldVertex.used = false;
}