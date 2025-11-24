let buttons = [];

/******** v plotSVG stuff v ********/
p5.disableFriendlyErrors = true; 

let bDoExportSvg = false; 
let regenerateButton; 
let exportSvgButton; 

function initiateSvgExport(){
  bDoExportSvg = true; 
}
/******** ^ plotSVG stuff ^ ********/

function setup() {
  //createCanvas(816, 1056); // Letter: 8.5"x11 at 96 DPI.
	createCanvas(1056/1.5, 816/1.5);
	
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
	
  buttons.push(createToggleButton("Show Gaze Point", () => showGazePt = !showGazePt));
  buttons.push(createToggleButton("Show Gaze Trail", () => showGazeTrail = !showGazeTrail));
  buttons.push(createToggleButton("Highlight Intersections", () => highlightIntersections = !highlightIntersections));
  buttons.push(createToggleButton("Show Paths", () => showPaths = !showPaths));
  buttons.push(createToggleButton("Show Curves", () => showCurves = !showCurves));

  capture = createCapture(VIDEO);
  capture.size(width, height);
  capture.hide();
  tracker = new clm.tracker();
  tracker.init();
  tracker.start(capture.elt);
	
	calibrationVectors = [null, null, null, null];
}

function draw(){
  background(245); 
  strokeWeight(1);
  stroke(0);
  noFill();
  
	/******** v plotSVG stuff v ********/
  if (bDoExportSvg){
    beginRecordSVG(this, "pattern.svg");
  }
	/******** ^ plotSVG stuff ^ ********/
	/********** v draw here v **********/
	
	gazeTrackUpdate();
	intersectionsUpdate();

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
	startNewPath();
}

function keyPressed() {
  if (key == 'a' || key == 'A') {
    intersections = calculateIntersections(paths);
		calculateCurves();
  } 
}

function createToggleButton(label, callback) {
  let btn = createButton(label);
  btn.mousePressed(callback);
  btn.style("margin", "4px");
  return btn;
}