let percentList = [0.10, 0.30, 0.50, 0.70, 0.90];
let pixelsPerInch = 96;
let personOutlines = [];

/******** v plotSVG stuff v ********/
p5.disableFriendlyErrors = true; 

let bDoExportSvg = false; 
let exportSvgButton; 

function initiateSvgExport(){
  bDoExportSvg = true; 
	loop();
}
/******** ^ plotSVG stuff ^ ********/

function setup() {
  createCanvas(1056, 816); // Letter: 11"x8.5" at 96 DPI.
	rectMode(CORNERS);
  
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
  background(245); 
  strokeWeight(1);
  stroke(0);
  noFill();
  
	/******** v plotSVG stuff v ********/
  if (bDoExportSvg){
    beginRecordSVG(this, "hatch.svg");
  }
	/******** ^ plotSVG stuff ^ ********/
	/********** v draw here v **********/
	
  let nLevels = percentList.length;
	
	let leftBegin = width / 2 - nLevels * pixelsPerInch / 2;
	let top = height/2 - 3*pixelsPerInch;
	let bottom = top + pixelsPerInch;
	
  for (let i = 0; i < nLevels; i++) {
		let left = leftBegin + i*pixelsPerInch;
		let right = left + pixelsPerInch;
		rippleHatch(left, right, top, bottom, percentList[i]);
  }
	
	top += pixelsPerInch*1.5;
	bottom += pixelsPerInch*1.5;
	rippleHatchGradient(leftBegin, leftBegin + nLevels*pixelsPerInch, top, bottom, 0, 1);
	
	personOutlines = [];
	top += pixelsPerInch*1.5;
	bottom += pixelsPerInch*1.5;
  for (let i = 0; i < nLevels; i++) {
		let left = leftBegin + i*pixelsPerInch;
		let right = left + pixelsPerInch;
		peopleHatch(left, right, top, bottom, percentList[i], true);
		//rect(left, top, right, bottom);
  }
	
	personOutlines = [];
	top += pixelsPerInch*1.5;
	bottom += pixelsPerInch*1.5;
	peopleHatchGradient(leftBegin, leftBegin + nLevels*pixelsPerInch, top, bottom, true);

	/********** ^ draw here ^ **********/
	/******** v plotSVG stuff v ********/
  if (bDoExportSvg){
    endRecordSVG();
    bDoExportSvg = false;
  }
	/******** ^ plotSVG stuff ^ ********/
	
	noLoop();
}

function lineHatch(left, right, top, bottom, hatchPercent) {
	  let nLinesToDraw = round(hatchPercent * pixelsPerInch);
    let offset = (pixelsPerInch/nLinesToDraw)/2;
		for (var j=0; j<nLinesToDraw; j++){
			let lx = map(j,0,nLinesToDraw, left,right) + offset;
			line(lx,top, lx,bottom);
    }
}

// ripple hatch -----------------------------------------------------------------
// ------------------------------------------------------------------------------

function rippleHatch(left, right, top, bottom, hatchPercent) {
	let rippleCenterPadding = map(hatchPercent, 0, 1, 0, pixelsPerInch);
		// padding around left-right-top-bottom rectangle in which ripple centers can be placed 
	let centersPerPercent = 10; // how many ripple centers for each percent 
	
  let nCenters = int(hatchPercent * centersPerPercent);
  let centers = [];

  for (let i = 0; i < nCenters; i++) {
    let cx = random(left - rippleCenterPadding, right + rippleCenterPadding);
    let cy = random(top - rippleCenterPadding, bottom + rippleCenterPadding);
    centers.push({x: cx, y: cy});
  }

  centers.forEach(c => {
    let startRadius = 5;
    let spacing = 5; // initial spacing 
    let spacingGrowth = map(hatchPercent, 0, 1, 1.8, 1.1);
		let endRadius = dist(c.x, c.y, left, top) + rippleCenterPadding*2;
		
		let r = startRadius;
    while (r < endRadius) {
      let segments = circleRectangleIntersect(c.x, c.y, r, left, right, top, bottom);
      segments.forEach(seg => {
				let noiseAmp = map(r, startRadius, endRadius, 1, 7);
				let noiseScale = map(r, startRadius, endRadius, 5, 20);
        noisyArc(c.x, c.y, r, seg.startAngle, seg.endAngle, noiseAmp, noiseScale);
      });
      r += spacing;
      spacing *= spacingGrowth;
    }
  });
}

function rippleHatchGradient(left, right, top, bottom) {
  let nCols = percentList.length + 1;
  let colWidth = (right - left) / nCols;
  let centers = [];
	let rippleCenterPadding = pixelsPerInch;

  for (let col = 0; col < nCols; col++) {
    let hatchPercent = col < percentList.length ? percentList[col] : 1.3;
    let nCenters = int(hatchPercent * 3);  

    for (let i = 0; i < nCenters; i++) {
      let colLeft = left + col * colWidth;
      let colRight = colLeft + colWidth;
      let cx = random(colLeft - rippleCenterPadding, colRight + rippleCenterPadding);
      let cy = random(top - rippleCenterPadding, bottom + rippleCenterPadding);
      centers.push({x: cx, y: cy, hatchPercent: hatchPercent});
    }
  }
		
  centers.forEach(c => {
    let startRadius = 5;
    let globalSpacing = 5;
    let spacingGrowth = map(c.hatchPercent, 0, 1, 1.8, 1.3);
		//let endRadius = dist(c.x, c.y, left, top) + rippleCenterPadding*2;
		
		let r = startRadius;
		let numRipples = 10;
    //while (r < endRadius) {
		for (let i = 0; i < numRipples; i++) {
      let segments = circleRectangleIntersect(c.x, c.y, r, left, right, top, bottom);
      segments.forEach(seg => {
				// let noiseAmp = map(r, startRadius, endRadius, 1, 15);
				// let noiseScale = map(r, startRadius, endRadius, 5, 20);
				let noiseAmp = map(i, 0, numRipples, 1, 8);
				let noiseScale = map(i, 0, numRipples, 5, 15);
        noisyArc(c.x, c.y, r, seg.startAngle, seg.endAngle, noiseAmp, noiseScale);
      });
      r += globalSpacing;
      globalSpacing *= spacingGrowth;
    }
  });
}

// by gpt, returns array of {startAngle, endAngle} arcs of a circle inside the rect
function circleRectangleIntersect(cx, cy, r, left, right, top, bottom) {
  let segments = [];
  let inside = false;
  let startAngle = 0;
  let prevInside = false;
  let nSamples = 360;

  for (let i = 0; i <= nSamples; i++) {
    let theta = map(i, 0, nSamples, 0, TWO_PI);
    let x = cx + r * cos(theta);
    let y = cy + r * sin(theta);
    inside = (x >= left && x <= right && y >= top && y <= bottom);

    if (inside && !prevInside) {
      startAngle = theta;
    }
    if (!inside && prevInside) {
      segments.push({startAngle: startAngle, endAngle: theta});
    }
    prevInside = inside;
  }
  if (inside) {
    segments.push({startAngle: startAngle, endAngle: TWO_PI});
  }
  return segments;
}

function noisyArc(cx, cy, r, startAngle, endAngle, noiseAmp, noiseScale) {
  beginShape();
  for (let theta = startAngle; theta <= endAngle; theta += 0.02) {
    let nr = r + noiseAmp * (noise(cx*0.1, cy*0.1, theta*noiseScale) - 0.5);
    let x = cx + nr * cos(theta);
    let y = cy + nr * sin(theta);
    vertex(x, y);
  }
  endShape();
}

// people hatch -----------------------------------------------------------------
// ------------------------------------------------------------------------------

function peopleHatch(left, right, top, bottom, hatchPercent, rejectionSample=false) {
  let size = 20;
  // let radius = size * map(hatchPercent, 0, 1, 2.4, 0.6);
  // let nPeople = int(map(hatchPercent, 0, 1, 1, 50));
  let radius = size * map(hatchPercent, 0, 1, 1.2, 0.3);
  // let nPeople = int(map(hatchPercent, 0, 1, 0, 75)); // linear density map 
	let nPeople = int(map(pow(hatchPercent, 1.2), 0, 1, 0, 60)); // nonlinear 
	
	// rejection sampling to avoid overlaps
	let maxTries = 100;
  let positions = [];
  
  for (let i = 0; i < nPeople; i++) {
		if (rejectionSample) {
			let tries = 0;
			let placed = false;
			while (tries < maxTries && !placed) { 
				let offset = size/2;
				let x = random(left + 0, right - 0);
				let y = random(top + offset, bottom - offset);
				let ok = true;
				for (let p of positions) {
					if (dist(x, y, p.x, p.y) < radius) {
						ok = false;
						break;
					}
				}
				if (ok) {
					positions.push({x, y});
					drawPersonOutline(x, y, size);
					placed = true;
				}
				tries++;
			}
		} else {
			let x = random(left + size/2, right - size/2);
			let y = random(top + size/2, bottom - size/2);
			drawPersonOutline(x, y, size);
		}
  }
}

function peopleHatchGradient(left, right, top, bottom, rejectionSample=false) {
  let size = 20;
	// let radius = size * 1.1;
	// let globalDensity = 5;
	let radius = size * 0.6;
	let globalDensity = 10;
  let sliceWidth = size;
	
	let maxTries = 100;
  let positions = [];

  // right->left, dense->sparse 
  for (let xSlice = right - sliceWidth; xSlice >= left; xSlice -= sliceWidth) {
    let xMid = xSlice + sliceWidth / 2;
    let localPercent = map(xMid, left, right, 0, 1);
    // let nPeople = int(localPercent * globalDensity); // nPeople in vertical slice, linear 
		let nPeople = int(pow(localPercent, 1.1) * globalDensity); // nonlinear 

    for (let i = 0; i < nPeople; i++) {
			if (rejectionSample) {
				let tries = 0;
				let placed = false;
				while (tries < maxTries && !placed) {
					let x = random(xSlice, xSlice + sliceWidth);
					let y = random(top + size/2, bottom - size/2);

					let ok = true;
					for (let p of positions) {
						if (dist(x, y, p.x, p.y) < radius) {
							ok = false;
							break;
						}
					}

					if (ok) {
						positions.push({x, y});
						drawPersonOutline(x, y, size);
						placed = true;
					}
					tries++;
				}
			} else {
				let x = random(xSlice, xSlice + sliceWidth);
				let y = random(top + size/2, bottom - size/2);
				drawPersonOutline(x, y, size);
			}
    }
  }
}