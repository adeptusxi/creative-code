let buttons = [];
let circleVerts = [];
let numCirclePoints = 10;
let canvasScale = 1; // multiplier for letter size

/******** v plotSVG stuff v ********/
p5.disableFriendlyErrors = true; 

let bDoExportSvg = false; 
let regenerateButton; 
let exportSvgButton; 

function initiateSvgExport(){
  bDoExportSvg = true; 
}
/******** ^ plotSVG stuff ^ ********/

function preload() {
	fabricPreload();
}

function setup() {
  //createCanvas(816, 1056); // Letter: 8.5"x11 at 96 DPI.
	createCanvas(1056*canvasScale, 816*canvasScale);
	
	instructions = createP("Waiting for tracker...");
	instructions.style("text-align", "center");
  instructions.style("width", width + "px");
  instructions.position(0, height/2);
  
	/******** v plotSVG stuff v ********/
  exportSvgButton = createButton('Export SVG');
  exportSvgButton.position(4, height + 35);
  exportSvgButton.mousePressed(initiateSvgExport);
  
  // Set the SVG group by stroke color to `true`, so that strokes 
  // of the same color are grouped together in the SVG file. 
  setSvgGroupByStrokeColor(true); 
	/******** ^ plotSVG stuff ^ ********/
	
	buttons.push(createToggleButton("Toggle Pin/Tear", () => modePin = !modePin));
  buttons.push(createToggleButton("Toggle Gaze Point", () => showGazePt = !showGazePt));
  buttons.push(createToggleButton("Toggle Gaze Trail", () => showGazeTrail = !showGazeTrail));
	buttons.push(createToggleButton("Toggle Image", () => showImage = !showImage));
	buttons.push(createToggleButton("Toggle Fabric Dots", () => showDots = !showDots));
	buttons.push(createToggleButton("Toggle Fabric Pin Highlights", () => highlightPins = !highlightPins));
	buttons.push(createToggleButton("Toggle Fabric Lines", () => showLines = !showLines));

  for (let i = 0; i < numCirclePoints; i++) {
    let angle = map(i, 0, numCirclePoints, 0, TWO_PI);
    let x = cos(angle);
    let y = sin(angle);
    circleVerts.push({ x: x, y: y });
  }
	
	gazeTrackSetup();
	fabricSetup();
}

function draw(){
  background(245); 
  strokeWeight(1);
  stroke(0);
  noFill();
  
	/******** v plotSVG stuff v ********/
  if (bDoExportSvg){
    beginRecordSVG(this, "fabric.svg");
  }
	/******** ^ plotSVG stuff ^ ********/
	/********** v draw here v **********/
	
	gazeTrackUpdate();
	if (calibrated) {
		fabricDraw();
	}

	/********** ^ draw here ^ **********/
	/******** v plotSVG stuff v ********/
  if (bDoExportSvg){
    endRecordSVG();
    bDoExportSvg = false;
  }
	/******** ^ plotSVG stuff ^ ********/
}

function mouseClicked() {
	gazeTrackMouseClicked();
}

function createToggleButton(label, callback) {
  let btn = createButton(label);
  btn.mousePressed(callback);
  btn.style("margin", "4px");
  return btn;
}

function drawPolygonFromVerts(x, y, s, polygon) {
	push();
	translate(x, y);
	scale(s);
	beginShape();
	for (let pt of polygon) {
		vertex(pt.x, pt.y);
	}
	endShape(CLOSE);
	pop();
}