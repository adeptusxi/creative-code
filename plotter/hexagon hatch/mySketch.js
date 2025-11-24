let WORK = false; // upload image first, set to true
let imgName = "";
let imgScale = 1/4;

let img;
let cellRadius = 10; // horizontal hexagon radius 

let minRadius = 3;
let maxLayers = 7;

let drawImage = false;
let drawGrayscale = false;
let drawBorders = false;

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
	img = loadImage(imgName);
}

function setup() {
	if (!WORK) return;
	
  createCanvas(816, 1056); // Letter: 8.5"x11 at 96 DPI.
	//img.resize(img.width/2.5, img.height/2.5);
	img.resize(img.width * imgScale, img.height * imgScale);
  
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
	
  background(245); 
  strokeWeight(0.5);
  stroke(0);
  noFill();
  
	/******** v plotSVG stuff v ********/
  if (bDoExportSvg){
    beginRecordSVG(this, "selfie.svg");
  }
	/******** ^ plotSVG stuff ^ ********/
	/********** v draw here v **********/
	
	let hexWidth = 2 * cellRadius;
	let hexHeight = sqrt(3) * cellRadius;
	let hexHorizSpacing = 1.5 * cellRadius; // x distance between centers
	let hexVertSpacing = hexHeight; // y distance between centers
	
	let xStart = width/2 - img.width/2;
	let yStart = height/2 - img.height/2;
	if (drawImage) {
		image(img, xStart, yStart);
	}
	xStart += cellRadius/2;
	yStart += cellRadius/2;
	
  for (let row = 0; row * hexVertSpacing < img.height; row++) {
    for (let col = 0; col * hexHorizSpacing < img.width; col++) {
      let cx = col * hexHorizSpacing;
      let cy = row * hexVertSpacing;
      if (col % 2 == 1) cy += hexVertSpacing / 2;
      if (cy + cellRadius >= img.height) break;

      // approximate hexagon cell with square sample 
      let totalBright = 0;
      let count = 0;

      for (let yy = -hexHeight/2; yy < hexHeight/2; yy++) {
        for (let xx = -hexWidth/2; xx < hexWidth/2; xx++) {
          let px = int(cx + xx);
          let py = int(cy + yy);
          if (px < 0 || py < 0 || px >= img.width || py >= img.height) continue;

          // could do point in hexagon test for (xx,yy) here but slow 
          let c = img.get(px, py);
          let r = red(c), g = green(c), b = blue(c);
          let bri = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          bri = pow(bri, 0.45);
          totalBright += bri;
          count++;
        }
      }

      let brightness = (count > 0) ? totalBright / count : 1;

      drawHexCell(xStart + cx, yStart + cy, cellRadius, brightness, drawBorders);
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

function drawHexCell(cx, cy, r, brightness, drawBorder=false) {
	if (drawBorder) {
		stroke(0);
	} else {
		noStroke();
	}
	if (drawGrayscale) {
		 fill(map(brightness, 0, 1, 0, 255));
	} else {
		noFill();
	}
	
	// beginShape();
	// for (let i = 0; i < 6; i++) {
	// 	let angle = TWO_PI / 6 * i;
	// 	vertex(cx + cos(angle) * r, cy + sin(angle) * r);
	// }
	// endShape(CLOSE);
	
	stroke(0);
	push();
	translate(cx, cy);
	let numLayers = getNumLayers(brightness);
	let thisR = minRadius;
	let radiusInc = (r - thisR) / (maxLayers - 1);
	for (let l = 0; l < numLayers; l++) {
		beginShape();
		for (let i = 0; i < 6; i++) {
			let angle = TWO_PI / 6 * i;
			vertex(cos(angle) * thisR, sin(angle) * thisR);
		}
		endShape(CLOSE);
		thisR += radiusInc;
	}
	pop();
}

function getNumLayers(brightness) {
	if (brightness < 0.28) {
		return maxLayers;
	} else if (brightness < 0.38) {
		return 6;
	} else if (brightness < 0.45) {
		return 5;
	} else if (brightness < 0.6) {
		return 4;
	} else if (brightness < 0.65) {
		return 3;
	} else if (brightness < 0.72) {
		return 2;
	} else if (brightness < 0.77) {
		return 1;
	} else {
		return 0;
	}
}