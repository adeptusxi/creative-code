let drawEndpoints = false;
let drawPlainLine = false;
let drawMouseHUD = false;

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

const paramsStandard = {
	wideScalar: 2.5, 
	linkLengthScalar: 1.75, // multiplier for width 
	spacingScalar: 1/3			// multiplier for width
};

function setup() {
	createCanvas(1056, 816); // 11" x 8.5" at 96 dpi
  
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

function draw(){
  randomSeed(myRandomSeed); 
  background(245); 
  strokeWeight(1);
  stroke('black');
  noFill();
  
	/******** v plotSVG stuff v ********/
  if (bDoExportSvg){
    beginRecordSVG(this, "plotSvg_generative_" + myRandomSeed + ".svg");
  }
	/******** ^ plotSVG stuff ^ ********/
	/********** v draw here v **********/
	
	let vPadding = 80;
	let hPadding = 300;
	let spacing = 45;
	
	let w1 = 5;
	let w2 = 9;
	let w3 = 13;
	let w4 = 17;
	let w5 = 22;
	
	let x = hPadding;
	
	chainLine(x, vPadding, 					// point 1 
						x, height - vPadding, // point 2
						w1, 									// width 
					  paramsStandard);
	
	x += spacing + w1/2;
	chainLine(x, vPadding, 
						x, height - vPadding, 
						w2, 
						paramsStandard);
	
	x += spacing + w2/2;
	chainLine(x, vPadding, 
						x, height - vPadding, 
						w3, 
						paramsStandard);
	
	x += spacing + w3/2;
	chainLine(x, vPadding, 
						x, height - vPadding, 
						w4, 
						paramsStandard);
	
	x += spacing + w4/2;
	chainLine(x, vPadding, 
						x, height - vPadding, 
						w5, 
						paramsStandard);
	
	x += spacing + w5/2;
	x += spacing * 0.5;
	chainBezier(x, vPadding, 										// point 1 
							x - spacing*0.75, 350, 					// control 1 
							x + spacing*0.75, height - 350, 	// control 2 
							x, height - vPadding, 					// point 2
							w5, 
						  paramsStandard);
	
	x += spacing + w5/2;
	chainBezier(x, vPadding, 
							x - spacing, 350,  
							x + spacing, height - 350, 
							x, height - vPadding,
							w4, 
							paramsStandard);
	
	x += spacing + w4/2;
	chainBezier(x, vPadding, 
							x - spacing * 1.5, 300,  
							x + spacing * 1.5, height - 300, 
							x, height - vPadding,
							w3, 
							paramsStandard);
	
	x += spacing + w3/2;
	chainBezier(x, vPadding, 
							x - spacing * 2.25, 300,  
							x + spacing * 2.25, height - 300, 
							x, height - vPadding,
							w2, 
							paramsStandard);
	
	x += spacing + w2/2;
	chainBezier(x, vPadding, 
							x - spacing * 3, 300,  
							x + spacing * 3, height - 300, 
							x, height - vPadding,
							w1, 
							paramsStandard);
	
	if (drawMouseHUD) {
		mouseCoordsHUD();
	}

	/********** ^ draw here ^ **********/
	/******** v plotSVG stuff v ********/
  if (bDoExportSvg){
    endRecordSVG();
    bDoExportSvg = false;
  }
	/******** ^ plotSVG stuff ^ ********/
}

function chainLine(x1, y1, x2, y2, width, params) {
	let wideScalar = params.wideScalar;
	let linkWidth = width / wideScalar;
	let linkLength = width * params.linkLengthScalar;
	let spacing = width * params.spacingScalar;
	
	if (drawPlainLine) {
		strokeWeight(width);
		stroke(255, 0, 0, 50);
		line(x1, y1, x2, y2);
		strokeWeight(1);
		stroke('black');
	}
	
	if (drawEndpoints) {
		stroke('red');
		fill('red');
		ellipse(x1, y1, linkWidth);
		ellipse(x2, y2, linkWidth);
		stroke('black');
		noFill();
	}
	
	drawChainLine(x1, y1, x2, y2, linkWidth, linkLength, wideScalar, spacing);
}

function chainBezier(x1, y1, cx1, cy1, cx2, cy2, x2, y2, width, params) {
	let wideScalar = params.wideScalar;
	let linkWidth = width / wideScalar;
	let linkLength = width * params.linkLengthScalar;
	let spacing = width * params.spacingScalar;

	if (drawPlainLine) {
		strokeWeight(width);
		stroke(255, 0, 0, 50);
		bezier(x1, y1, cx1, cy1, cx2, cy2, x2, y2);
		strokeWeight(1);
		stroke('black');
	}
	
	if (drawEndpoints) {
		stroke('red');
		fill('red');
		ellipse(x1, y1, linkWidth);
		ellipse(x2, y2, linkWidth);
		stroke('black');
		noFill();
	}
	
	drawChainBezier(x1, y1, cx1, cy1, cx2, cy2, x2, y2, linkWidth, linkLength, wideScalar, spacing);
}

function drawChainLine(x1, y1, x2, y2, linkWidth, linkLength, wideScalar, spacing) {
	let d = dist(x1, y1, x2, y2);
	let halfLen = linkLength/2;
	let halfWidth = linkWidth/2;
	let wideWidth = linkWidth * wideScalar;
	
	// tangent  
  let dx = x2 - x1;
  let dy = y2 - y1;
	// unit tangent
  let ux = dx / d;
  let uy = dy / d;
	// normal 
	let nx = uy;
  let ny = -ux;

	let stepLength = linkLength + spacing;
	let angle = atan2(dy, dx);
  let stepX = cos(angle) * stepLength;
  let stepY = sin(angle) * stepLength;

	// adjust to start at (x1,y1) and end at/before (x2, y2)
	x1 -= ux * halfWidth;
	y1 -= uy * halfWidth;
	d = dist(x1, y1, x2, y2);
	
  let numLinks = floor(d / stepLength);
  if (numLinks < 1) numLinks = 1;

	let px, py;
  for (let i = 0; i <= numLinks; i++) {
    px = x1 + stepX * i;
    py = y1 + stepY * i;
		
		// center weighted line on (x1,y1)-(x2,y2) 
    px += nx * halfWidth;
    py += ny * halfWidth;
		drawSideLink(px, py, angle, linkLength, linkWidth, true)
		
		if (i == numLinks) break; // end with a side-facing link 
		
		// shift down chain by half a link and recenter 
    px += ux * (halfLen + spacing/2) + nx * (wideWidth/2 - halfWidth);
    py += uy * (halfLen + spacing/2) + ny * (wideWidth/2 - halfWidth);
		// front facing link 
    drawFrontLink(px, py, angle, linkLength, linkWidth, wideWidth);
  }
	
	// linkWidth-wide "rails", illusion of hole in front facing link
	let start1x = x1 + ux * halfLen + nx * halfWidth;
	let start1y = y1 + uy * halfLen + ny * halfWidth;
	let end1x = x2 + nx * halfWidth;
	let end1y = y2 + ny * halfWidth;
	let start2x = x1 + ux * halfLen - nx * halfWidth;
	let start2y = y1 + uy * halfLen - ny * halfWidth;
	let end2x = x2 - nx * halfWidth;
	let end2y = y2 - ny * halfWidth;
	line(start1x, start1y, end1x, end1y);
	line(start2x, start2y, end2x, end2y);
}

function drawChainBezier(x1, y1, cx1, cy1, cx2, cy2, x2, y2, linkWidth, linkLength, wideScalar, spacing) {
	let stepLength = linkLength + spacing;
  let halfLen = linkLength / 2;
  let halfWidth = linkWidth / 2;
	let wideWidth = linkWidth * wideScalar;

  // estimate total curve length by sampling
	let dx = x2 - x1;
	let dy = y2 - y1;
  let samples = sqrt(dx*dx + dy*dy);
  let curvePoints = [];
  let totalLength = 0;
  
  let prevX = x1;
  let prevY = y1;
  curvePoints.push({x: prevX, y: prevY, t: 0});
  
  for (let i = 1; i <= samples; i++) {
    let t = i / samples;
    let px = bezierPoint(x1, cx1, cx2, x2, t);
    let py = bezierPoint(y1, cy1, cy2, y2, t);
    curvePoints.push({x: px, y: py, t: t});
    totalLength += dist(prevX, prevY, px, py);
    prevX = px;
    prevY = py;
  }

  let traveled = 0;
  let nextStep = 0;
  let i = 1;
  while (nextStep <= totalLength && i < curvePoints.length) {
    let p0 = curvePoints[i-1];
    let p1 = curvePoints[i];
    let segLength = dist(p0.x, p0.y, p1.x, p1.y);
    
    if (traveled + segLength >= nextStep) {
      let ratio = (nextStep - traveled) / segLength;
      let px = lerp(p0.x, p1.x, ratio);
      let py = lerp(p0.y, p1.y, ratio);
      let t = lerp(p0.t, p1.t, ratio);      
      let tx = bezierTangent(x1, cx1, cx2, x2, t);
      let ty = bezierTangent(y1, cy1, cy2, y2, t);
      
      // normal
      let mag = sqrt(tx*tx + ty*ty);
      let nx = -ty / mag;
      let ny = tx / mag;
			
	 		// side-facing link 			
			// tangent of approximate midpoint 
	    let midX = px + (tx / mag) * halfLen;
      let midY = py + (ty / mag) * halfLen;
      let midT = t + (halfLen / totalLength); 
      let angle = atan2(
        bezierTangent(y1, cy1, cy2, y2, midT),
        bezierTangent(x1, cx1, cx2, x2, midT)
      );
      let sideX = px - nx * halfWidth;
      let sideY = py - ny * halfWidth;
      drawSideLink(sideX, sideY, angle, linkLength, linkWidth, true);
      
			if (nextStep + stepLength > totalLength) break; // end with a side-facing link
			
			// front-facing link 
      let frontX = px + tx/mag * (halfLen + spacing/2) - nx * (wideWidth/2);
      let frontY = py + ty/mag * (halfLen + spacing/2) - ny * (wideWidth/2);
			// recalculate tangent for midpoint after shifting 
	    midX = frontX + (tx / mag) * halfLen;
      midY = frontY + (ty / mag) * halfLen;
      midT = t + ((halfLen + spacing/2 + halfLen) / totalLength);
      angle = atan2(
        bezierTangent(y1, cy1, cy2, y2, midT),
        bezierTangent(x1, cx1, cx2, x2, midT)
      );
      drawFrontLink(frontX, frontY, angle, linkLength, linkWidth, wideWidth);
			
			// hole in front-facing link 
			let shortenBy = spacing*2;
			frontX = px + tx/mag * (halfLen + spacing/2 + shortenBy/2) - nx * halfWidth;
      frontY = py + ty/mag * (halfLen + spacing/2 + shortenBy/2) - ny * halfWidth;
			
			drawSideLink(frontX, frontY, angle, linkLength - shortenBy, linkWidth, false);
      
      nextStep += stepLength;
    } else {
      traveled += segLength;
      i++;
    }
  }
}

function drawSideLink(px, py, angle, linkLength, linkWidth, drawCap) {
	/*
	push();
	translate(px, py);
	rotate(angle); 
	rect(0, 0, linkLength, linkWidth, linkWidth/2);
	pop();
	*/
	// draws the rounded rect above in segments 
	// to easily exclude cap part (reuse as "rails")
	
  push();
  translate(px, py);
  rotate(angle);

  let r = linkWidth / 2; 
  let w = linkLength;
  let h = linkWidth;

  let x0 = 0;
  let y0 = 0;
  let x1 = x0 + w;
  let y1 = y0 + h;
	
	// sides 
	line(x0 + r, y0, x1 - r, y0); // right 
  line(x1 - r, y1, x0 + r, y1); // left

	if (drawCap) {
		// sides 
		line(x1, y0 + r, x1, y1 - r); // top 
	  line(x0, y1 - r, x0, y0 + r); // bottom 
		
		// corners 
		arc(x0 + r, y0 + r, r*2, r*2, PI, -HALF_PI); // top right 
		arc(x1 - r, y0 + r, r*2, r*2, -HALF_PI, 0); // bottom right 
		arc(x1 - r, y1 - r, r*2, r*2, 0, HALF_PI); // bottom left 
		arc(x0 + r, y1 - r, r*2, r*2, HALF_PI, PI); // top left 
	}

  pop();
}

function drawFrontLink(px, py, angle, linkLength, linkWidth, wideWidth) {
  /*
	push();
	translate(px, py);
	rotate(angle);
	rect(0, 0, linkLength, wideWidth, linkWidth);
	pop();
	*/
	// draws the rounded rect above in segments 
	// to easily exclude overlapping part with side-facing links
	
	push();
  translate(px, py);
  rotate(angle);

  let x = 0;
  let y = 0;
  let w = linkLength;
  let h = wideWidth;
  let r = linkWidth * 3/4; 

  // clamp radius to half width/height like p5's rect does
  r = min(r, w/2, h/2);

  // points of the inner rect where arcs meet
  let x1 = x + r;
  let y1 = y;
  let x2 = x + w - r;
  let y2 = y + h;
  let y3 = y + r;
  let y4 = y + h - r;

	// sides 
  line(x1, y, x2, y); // right 
  //line(x + w, y3, x + w, y4); // top 
  line(x2, y + h, x1, y + h); // left 
  //line(x, y4, x, y3); // bottom

  // corners 
  arc(x + r, y + r, 2*r, 2*r, PI, PI + HALF_PI); // top left 
  arc(x + w - r, y + r, 2*r, 2*r, -HALF_PI, 0); // top right 
  arc(x + w - r, y + h - r, 2*r, 2*r, 0, HALF_PI); // bottom right 
  arc(x + r, y + h - r, 2*r, 2*r, HALF_PI, PI); // bottom left 

  pop();
}

function mouseCoordsHUD() {
	fill('black');
  textSize(16);
  text(`x: ${mouseX}`, 20, 30);
  text(`y: ${mouseY}`, 70, 30);
	noFill();
}