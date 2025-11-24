// type A to generate an island at the mouse

/******** v plotSVG stuff v ********/
p5.disableFriendlyErrors = true; 

let bDoExportSvg = false; 
let exportSvgButton; 
let exportCentersButton;
let toggleLoopButton;

function initiateSvgExport(){
  bDoExportSvg = true; 
}
/******** ^ plotSVG stuff ^ ********/

let islands = [];

let nOffsetCurves = 30;
let maxOffset = 250;
let minOffset = 20;
let nVertices = 250;

let radius1 = 3;
let radius2 = 10;
let radius3 = 20;
let radius4 = 90;

let looping = true;
let drawMouseHUD = false;

function setup() {
  createCanvas(816, 1056); // 11"x8.5" at 96 DPI
  
	/******** v plotSVG stuff v ********/
  exportSvgButton = createButton('Export SVG');
  exportSvgButton.position(10, 10);
  exportSvgButton.mousePressed(initiateSvgExport);
  
  // Set the SVG group by stroke color to `true`, so that strokes 
  // of the same color are grouped together in the SVG file. 
  setSvgGroupByStrokeColor(true); 
	/******** ^ plotSVG stuff ^ ********/

	if (looping) {
		toggleLoopButton = createButton('Turn Loop Off');
	} else {
		toggleLoopButton = createButton('Turn Loop On');
	}
  toggleLoopButton.position(100, 10);
  toggleLoopButton.mousePressed(toggleLoop);
	
	exportCentersButton = createButton('Export Center Coordinates');
  exportCentersButton.position(200, 10);
  exportCentersButton.mousePressed(exportIslandCenters);
	
	if (looping) {
		loop();
	} else {
		noLoop();
	}
}

function draw(){
  background(245); 
  strokeWeight(1);
  stroke(0);
  noFill();
  
	/******** v plotSVG stuff v ********/
  if (bDoExportSvg){
    beginRecordSVG(this, "map.svg");
  }
	/******** ^ plotSVG stuff ^ ********/
	/********** v draw here v **********/
	
	let mergedIslands = mergeIslands(islands);
	for (let island of mergedIslands) {
    beginShape();
    for (let pt of island) {
			vertex(pt.X, pt.Y);
		}
    endShape(CLOSE);
	}
	
	let numOffsetCurves = 30;
	let offsetDist = 10;
	
	let maxOffset = 450;
	let minOffset = 10;
	
	// using lingdong's code for offsets (+ clipper.js for merging)
	let mergedOffsets = mergeOffsets(islands);
	for (let level of mergedOffsets) {
		for (let o of level) {
			beginShape();
			for (let pt of o) {
				vertex(pt.X, pt.Y);
			}
			endShape(CLOSE);
		}
	}

//  // using clipper.js for offsets and merging
// 	// offsets start close and get farther 
// 	for (let r = 1; r <= numOffsetCurves; r++) {
// 		let t = (r-1)/(numOffsetCurves-1);
// 		let d = maxOffset * pow((minOffset/maxOffset), t);

// 		let mergedOffsets = mergeOffsets(islands, d);
// 		for (let o of mergedOffsets) {
// 			beginShape();
// 			for (let pt of o) {
// 				vertex(pt.X, pt.Y);
// 			}
// 			endShape(CLOSE);
// 		}
// 	}
	
	mouseCoordsHUD();

	/********** ^ draw here ^ **********/
	/******** v plotSVG stuff v ********/
  if (bDoExportSvg){
    endRecordSVG();
    bDoExportSvg = false;
  }
	/******** ^ plotSVG stuff ^ ********/
}

function toggleLoop() {
	if (looping) {
		noLoop(); 
		toggleLoopButton.html("Turn Loop On")
	} else {
		loop();
		toggleLoopButton.html("Turn Loop Off")
	}
	looping = !looping;
}

function mouseCoordsHUD() {
	if (!drawMouseHUD) return;
	fill('black');
  textSize(16);
  text(`x: ${round(mouseX)}`, 20, 55);
  text(`y: ${round(mouseY)}`, 70, 55);
	noFill();
}

function keyPressed() {
  if (key == 'a') {
		if (!looping) return;
		let x = mouseX;
		let y = mouseY;
		let baseRadius;
		let chance = random();
		if (chance < 0.075) {
			baseRadius = map(random(), 0, 1, radius3, radius4);
		} else if (chance < 0.25) {
			baseRadius = map(random(), 0, 1, radius2, radius3);
		} else {
			baseRadius = map(random(), 0, 1, radius1, radius2);
		}
		let noiseScale = 100;
		let unRoundness = 1.2;
		islands.push(new Island(x, y, baseRadius, 
														noiseScale, nVertices, unRoundness));
  }
}

class Island {
  constructor(cx, cy, baseRadius, noiseScale, nVertices, unRoundness) {
    this.cx = cx;
    this.cy = cy;
    this.baseRadius = baseRadius;
    this.noiseScale = noiseScale;
    this.nVertices = nVertices;
    this.unRoundness = unRoundness;

    // build island 
    this.border = [];
		let deltaT = millis()/3000.0; 
    for (let i = 0; i < this.nVertices; i++) {
      let t = map(i, 0, this.nVertices, 0, TWO_PI);
      let nx = 1.23 + deltaT + this.unRoundness * cos(t);
      let ny = 5.67 + deltaT + this.unRoundness * sin(t);
      let r = this.baseRadius + this.noiseScale * noise(nx, ny);
      let px = this.cx + r * cos(t);
      let py = this.cy + r * sin(t);
      this.border.push(createVector(px, py));
    }
		this.border = localAvgPolyline(this.border, 0.8);
		
		// build offsets with unmess 
		this.offsets = [];
		
		for (let r = 0; r < nOffsetCurves; r++) {
			let offset = [];

			let t = (r-1) / (nOffsetCurves-1);
			let w = maxOffset * pow((minOffset/maxOffset), t);
			
			let N = this.border.length;
			let l1 = [];
			for (let i=0; i<N-1; i++){
				let a = this.border[(i%N)];
				let b = this.border[(i+1)%N];
				let dx = b.x-a.x;
				let dy = b.y-a.y;
				let l = sqrt(dx*dx+dy*dy);
				let nx = dx/l*w;
				let ny = dy/l*w;
				let xx = -ny;
				let yy = nx;

				l1.push([a.x-xx,a.y-yy]);
				l1.push([b.x-xx,b.y-yy]);
			}


			// Compute the unmessed polyline.
			let unmessInput = l1;
			let unmessResults = unmess.unmess(unmessInput,{
				hole_policy:unmess.HOLE_AGGRESSIVE,
				epsilon:0.001, 
				search_percent:0.3,
			});
			let unmessPoly = unmessResults[0]; 

			for (let i=0; i<unmessPoly.length; i++){
				let unmessedPt = unmessPoly[i]; 
				offset.push(createVector(unmessedPt[0], unmessedPt[1])); 
			}
			
			this.offsets.push(offset);
		}
  }

	/*
  draw() {
    strokeWeight(1);
    noFill();
    stroke(0);
    beginShape();
    for (let v of this.border) {
      vertex(v.x, v.y);
    }
    endShape(CLOSE);
		
		for (let offset of this.offsets) {
			beginShape();
			for (let i = 0; i < offset.length; i++){
				let pt = offset[i]; 
				vertex(pt.x, pt.y); 
			}
			endShape(CLOSE); 
		}
  }
	*/
}

function localAvgPolyline(vertices, smoothing=0.5) {
  let n = vertices.length;
  let newVerts = [];
  for (let i = 0; i < n; i++) {
    let prev = vertices[(i - 1 + n) % n];
    let curr = vertices[i];
    let next = vertices[(i + 1) % n];

    let avgx = (prev.x + curr.x + next.x) / 3;
    let avgy = (prev.y + curr.y + next.y) / 3;

    let x = lerp(curr.x, avgx, smoothing);
    let y = lerp(curr.y, avgy, smoothing);

    newVerts.push(createVector(x, y));
  }
  return newVerts;
}

function exportIslandCenters() {
  let lines = islands.map(o => `${o.cx},${o.cy}`);
  saveStrings(lines, 'island_centers.txt');
}

// clipper -----------------------------------------------------------

// union island borders 
function mergeIslands(islands) {
  let clipper = new ClipperLib.Clipper();
  let polys = islands.map(island =>
    island.border.map(v => ({X: v.x, Y: v.y}))
  );

  let union = new ClipperLib.Paths();
	clipper.AddPaths(polys, ClipperLib.PolyType.ptSubject, true);
  clipper.Execute(
    ClipperLib.ClipType.ctUnion, union,
    ClipperLib.PolyFillType.pftNonZero,
    ClipperLib.PolyFillType.pftNonZero
  );

  return union;
}

// using lingdong's code for offsets 
// union island offsets 
function mergeOffsets(islands) {
	let unions = [];
	
	for (let i = 0; i < nOffsetCurves; i++) {
		let clipper = new ClipperLib.Clipper();
		let polys = [];
		for (let island of islands) {
			let path = island.offsets[i].map(v => ({X:v.x, Y:v.y}));
			polys.push(path);
		}
		let union = new ClipperLib.Paths();
		clipper.AddPaths(polys, ClipperLib.PolyType.ptSubject, true);
		clipper.Execute(ClipperLib.ClipType.ctUnion, union,
										ClipperLib.PolyFillType.pftNonZero,
										ClipperLib.PolyFillType.pftNonZero);
		unions.push(union);
	}
	
	return unions;
}

// // using clipper.js for offsets 
// // for each island, create offset at distance d and union with other offsets
// function mergeOffsets(islands, d) {
//   let clipper = new ClipperLib.Clipper();
//   let offsetter = new ClipperLib.ClipperOffset();
// 	offsetter.ArcTolerance = 0.05; 
// 	offsetter.MiterLimit = 5;

//   let polys = [];

//   for (let island of islands) {
//     let path = island.border.map(v => ({X:v.x, Y:v.y}));
//     offsetter.Clear();
//     offsetter.AddPath(path,
//       ClipperLib.JoinType.jtRound,
//       ClipperLib.EndType.etClosedPolygon);
//     let solution = new ClipperLib.Paths();
//     offsetter.Execute(solution, d);
//     polys.push(...solution);
//   }

//   let union = new ClipperLib.Paths();
//   clipper.AddPaths(polys, ClipperLib.PolyType.ptSubject, true);
//   clipper.Execute(ClipperLib.ClipType.ctUnion, union,
//                   ClipperLib.PolyFillType.pftNonZero,
//                   ClipperLib.PolyFillType.pftNonZero);
//   return union;
// }