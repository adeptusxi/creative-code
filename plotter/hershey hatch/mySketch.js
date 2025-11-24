let WORK = false; // upload image first, set to true
let imageName = 'a.jpg';
let imgScale = 1/1.7;

let img;
// chinese sizes 
let cellRadius = 10;
let charScale = 0.25;
// // ascii sizes 
// cellRadius = 9;
// charScale = 0.35;

let drawImage = false;
let drawGrayscale = false;

let landscape = false;

let asciiHatch = true;
// let chars = ["啊", "阿", "可", "口", "一", ""];
let chars = ["善", "性", "初", "本", "之", "人", "", "", ""];
let charMappings = {};
let numChars;

let ascii = ["#", "%", "/", "+", "-", ".", ""];

/******** v plotSVG stuff v ********/
p5.disableFriendlyErrors = true; 

let bDoExportSvg = false; 
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
	hersheyPreload();
}

function setup() {
	if (!WORK) return;
	
  if (landscape) {
	  createCanvas(1056, 816);
  } else {
	  createCanvas(816, 1056);
  }
	img.resize(img.width*imgScale, img.height*imgScale);
	rectMode(CENTER);
  
	/******** v plotSVG stuff v ********/
  
  exportSvgButton = createButton('Export SVG');
  exportSvgButton.position(0, height);
  exportSvgButton.mousePressed(initiateSvgExport);
  
  // Set the SVG group by stroke color to `true`, so that strokes 
  // of the same color are grouped together in the SVG file. 
  setSvgGroupByStrokeColor(true); 
	/******** ^ plotSVG stuff ^ ********/
	
	hersheySetup();
	
	numChars = chars.length;
	chars.forEach((char, index) => {
		charMappings[index] = char;
	});
}

function draw(){
	if (!WORK) return;
	
  background(0); 
  
	/******** v plotSVG stuff v ********/
  if (bDoExportSvg){
    beginRecordSVG(this, "cn_hatch.svg");
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
      let px = col * cellRadius; 
      let py = row * cellRadius; 
      let colorAtXY = img.get(px,py); 
      let r = red (colorAtXY); 
      let g = green (colorAtXY); 
      let b = blue (colorAtXY); 
      let bri01 = (0.299*r + 0.587*g + 0.114*b)/255; //  NTSC luminance
      
      drawCell(xStart + px, yStart + py, charScale, bri01);
    }
  }

	/********** ^ draw here ^ **********/
	/******** v plotSVG stuff v ********/
  if (bDoExportSvg){
		hersheyDoSvgOutput();
    endRecordSVG();
    bDoExportSvg = false;
  }
	/******** ^ plotSVG stuff ^ ********/
	
	noLoop();
}

function drawCell(x, y, s, brightness) {
	if (drawGrayscale) {
		noStroke();
		fill(map(brightness, 0, 1, 0, 255));
		rect(x, y, cellRadius);
	}
	stroke(255);
	strokeWeight(3);
	noFill();

	if (asciiHatch) {
		let idx = floor(map(brightness, 0, 1, ascii.length, 0));
		push();
		translate(x, y);
		scale(s);
		for (let i = idx; i < ascii.length; i++) {
			P5.hershey.putText(ascii[i]);
		}
		pop();
	} else {
		let idx = getCharIndex(brightness);
		let char = charMappings[idx];
		if (char != "") {
			let thisS = map(idx, 0, numChars, s, s*0.6);
			addCharacter(char, x, y, 0, thisS);
		}
	}
}

function getCharIndex(brightness) {
	return constrain(floor(map(brightness, 0, 1, numChars, 0)), 0, numChars - 1);
}