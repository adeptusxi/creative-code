// p5.hershey.js by Lingdong Huang
// https://github.com/LingDong-/chinese-hershey-font
// golan demo 
// https://editor.p5js.org/golan/sketches/ybJ0pTrZT

let chfFile = [];
let chfFont;
let myDictionary; // keys are characters, values are polylineArrays. 
let displayedCharactersArray = []; 
const SVG_WIDTH_MM = 297; // letter size in mm
const SVG_HEIGHT_MM = 210;
const CHF_CHAR_SIZE = 50; 

function preload() {
	hersheyPreload();
}

function setup() {
	hersheySetup();
}

//------------------------------
function hersheyPreload() {
  chfFile = loadStrings("Heiti.hf.txt");
}

//------------------------------
function hersheySetup() {
  myDictionary = {};

  let nCharLines = chfFile.length;
  let chfFileTxt = chfFile.join("\n");
  chfFont = P5.hershey.parseFontString(chfFileTxt);
  let args = {
    font: chfFont,
    align: "center",
    cmap: (x) => x,
  };

  // Parse Hershey file; store polyline data in a Dictionary
  // i.e. myDictionary[aCharacter] = aPolylineArray;
  //
  for (let i = 0; i < nCharLines; i++) {
    let aCharLine = chfFile[i];
    let aCharLinePieces = split(aCharLine, " ");
    let aCodePoint = aCharLinePieces[0];
    let aCodePointNum = Number(aCodePoint);
    if (aCodePointNum > 0 && isFinite(aCodePointNum)) {
      let aCharacter = String.fromCodePoint(aCodePoint);
      let aCharacterHershtxt = chfFont[args.cmap(aCodePoint)];
      let content = aCharacterHershtxt.slice(5);

      let aPolylineArray = [];
      let aPolyline = [];
      for (let j = 0; j < content.length; j += 2) {
        let digit = content.slice(j, j + 2);
        if (digit == " R") {
          aPolylineArray.push(aPolyline);
          aPolyline = [];
        } else {
          let x = digit[0].charCodeAt(0) - 57;
          let y = digit[1].charCodeAt(0) - 57;
          aPolyline.push(createVector(x, y));
        }
      }
      aPolylineArray.push(aPolyline);
      
      myDictionary[aCharacter] = aPolylineArray; // magic happens here
    }
  }
}

//------------------------------

function addCharacter(c, x, y, r, s) {
	let aPolylineArray = myDictionary[c];

	displayedCharactersArray.push(new DisplayedCharacter(c, aPolylineArray, x, y, r, s)); 

	push(); 
	translate(x, y);
	rotate(r);
	scale(s);
	for (let i = 0; i < aPolylineArray.length; i++) {
		let ithPolyline = aPolylineArray[i];
		beginShape();
		for (let j = 0; j < ithPolyline.length; j++) {
			let jthPoint = ithPolyline[j];
			let px = jthPoint.x - (CHF_CHAR_SIZE/2); // should be P5.hershey.estimateTextWidth(s,args)/2
			let py = jthPoint.y - (CHF_CHAR_SIZE/2); 
			vertex(px,py); 
		}
		endShape();
	}
	pop(); 
}

//------------------------------
function constructSvgPolylines(displayedCharactersArray){
  let arrayOfPolylinesForSvgOutput = [];
  for (let c=0; c<displayedCharactersArray.length; c++){
    let aDisplayedCharacter = displayedCharactersArray[c]; 
    let aPolylineArray = aDisplayedCharacter.polys;
    let tx = aDisplayedCharacter.tx;
    let ty = aDisplayedCharacter.ty;
    let sca = aDisplayedCharacter.sca;
    let rot = aDisplayedCharacter.rot;
    
    for (let i = 0; i < aPolylineArray.length; i++) {
      let ithPolyline = aPolylineArray[i];
      let aPolylineForSvgOutput = []; 
      let cx = (CHF_CHAR_SIZE/2);
      let cy = (CHF_CHAR_SIZE/2);
      
      for (let j=0; j<ithPolyline.length; j++){
        let jthPointRaw = ithPolyline[j];
        let px = jthPointRaw.x; 
        let py = jthPointRaw.y;
        let transformedPoint = getTransformedPoint(px,py, cx,cy, tx,ty, rot,sca);
        aPolylineForSvgOutput.push(transformedPoint);
      }
      arrayOfPolylinesForSvgOutput.push(aPolylineForSvgOutput);
    }
  }
  createSVG(arrayOfPolylinesForSvgOutput);
}

//------------------------------
// Compute transformed points. See:
// https://stackoverflow.com/questions/17410809/how-to-calculate-rotation-in-2d-in-javascript
function getTransformedPoint(px, py, cx, cy, tx, ty, rot, sca){
  // px,py: point to transform
  // cx,cy: offsets to center of rotation
  // tx,ty: translation
  // rot: rotation
  // sca: scale
  let oldx = px - cx; 
  let oldy = py - cy; 
  let newx = (cos(-rot) * oldx) + (sin(-rot) * oldy);
  let newy = (cos(-rot) * oldy) - (sin(-rot) * oldx);
  newx = (newx * sca) + tx + cx; 
  newy = (newy * sca) + ty + cy; 
  return createVector(newx,newy);
}

//------------------------------
function keyPressed() {
  if (key == "s") {
    bDoSvgOutput = true;
  }
}

//------------------------------
class DisplayedCharacter {
  // A class which stores a displayed character: 
  // binding together its char, and its polylines, 
  // with its translation, scale, and rotation. 
  constructor(c, polys, tx, ty, rot, sca) {
    this.c = c;
    this.polys = polys;
    this.tx = tx;
    this.ty = ty;
    this.rot = rot; 
    this.sca = sca;
  }
}

//------------------------------
function createSVG(arrayOfPolylinesForSvgOutput) {
  let aDocumentStr = getSVGDocumentHeader();
  const svgScale = SVG_WIDTH_MM / width; // converts pixels to mm.
  // Set graphic elements to be black, unfilled, 1px lineweight.
  const sw1pt = 1.0 / 2.8346456692913; // pt to mm.
  aDocumentStr +=
    '<g fill="none" stroke="black" stroke-width="' + sw1pt + '"> \n';

  // Add strings to the SVG file...
  let bPolylinesAreClosed = false;
  for (let p = 0; p < arrayOfPolylinesForSvgOutput.length; p++) {
    let aPolyline = arrayOfPolylinesForSvgOutput[p];
    aDocumentStr += getPolylineSVG(aPolyline, svgScale, bPolylinesAreClosed);
  }

  aDocumentStr += "</g>\n";
  aDocumentStr += "</svg>";
  let svgFilename = "svg_output_";
  svgFilename += nf(hour(), 2) + "_" + nf(minute(), 2) + "_" + nf(second(), 2);
  saveStrings([aDocumentStr], svgFilename, "svg");
}

//----------------------------------------------------------------
// https://www.w3.org/TR/SVG2/render.html#PaintingShapesAndText
function getSVGDocumentHeader() {
  let aDocumentStr = "";
  aDocumentStr += '<?xml version="1.0" encoding="UTF-8" standalone="no"?> \n';
  aDocumentStr += "\n";
  aDocumentStr += "<svg \n";
  aDocumentStr += '  width="' + SVG_WIDTH_MM + 'mm" \n';
  aDocumentStr += '  height="' + SVG_HEIGHT_MM + 'mm" \n';
  aDocumentStr +=
    '  viewBox="0 0 ' + SVG_WIDTH_MM + " " + SVG_HEIGHT_MM + '" \n';
  aDocumentStr += '  version="1.1" \n';
  aDocumentStr += '  xmlns="http://www.w3.org/2000/svg" \n';
  aDocumentStr += '  xmlns:svg="http://www.w3.org/2000/svg" \n';
  aDocumentStr +=
    '  xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">\n';
  aDocumentStr += "\n";
  return aDocumentStr;
}

//----------------------------------------------------------------
function getPolylineSVG(verts, svgScale, bClosed) {
  // Generate SVG for a polyline.
  let aPolylineStr = "  <path\n";
  aPolylineStr += '    d="';
  for (let j = 0; j < verts.length; j++) {
    if (j == 0) {
      aPolylineStr += "M ";
    } else {
      aPolylineStr += " L ";
    }
    let px = verts[j].x * svgScale;
    let py = verts[j].y * svgScale;
    aPolylineStr += nf(px, 1, 3) + ",";
    aPolylineStr += nf(py, 1, 3);
  }
  if (bClosed) {
    aPolylineStr += " Z"; // close loop if appropriate.
  }
  aPolylineStr += '"/>\n';
  return aPolylineStr;
}