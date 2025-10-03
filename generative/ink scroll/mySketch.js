let bgClr, clr1, clr2;
let treeThreshold = 0.35; // not really threshold 
let birdThreshold = 0.1;

let screenOF = 50; // how much to draw off screen 

function initColors() {
  bgClr = color(219, 200, 191);
  clr1 = color(18, 7, 1, 200);
  clr2 = color(219, 200, 191, 240);
}

function setup() {
  createCanvas(800, 450);
  initColors();
  background(bgClr);
}

function draw() {
  background(bgClr);
	drawScene();
}

function gradientLine(x1, y1, x2, y2, color1, color2) {
  var grad = this.drawingContext.createLinearGradient(x1, y1, x2, y2);
  grad.addColorStop(0, color1);
  grad.addColorStop(1, color2);
  this.drawingContext.strokeStyle = grad;
  line(x1, y1, x2, y2);
}

function drawScene() {
	let xpos;
	strokeWeight(0);
	
	// clouds
	xpos = millis() / 120;
	for (let x = -screenOF; x < width+screenOF; x++) {
		let n = noise((x + xpos - 750) / 75);
		let h = height - (n * 75);
		fill(lerpColor(clr1,clr2,0.7));
		if (n > 0.6) {
			let squig = map(noise((x + xpos + 10000)/20), 0, 1, 0, 40);
			circle(x, squig+50, squig);
		}
	}
	
	strokeWeight(1);
	// back mountains 
  xpos = millis() / 100;
  for (let x = -screenOF; x < width+screenOF; x++) {
		let n = noise((x + xpos) / 230);
    let h = height - (n * 500);
    gradientLine(x, height, x, h, clr1, clr2);
		if (n < birdThreshold && n > birdThreshold-0.01) {
			drawBird(x, 100, 50, lerpColor(clr1, clr2, 0.4));
		}
	}

	// middle mountains 
  xpos = millis() / 70;
  for (let x = -screenOF; x < width+screenOF; x++) {
		let n = noise((x + xpos - 1000) / 200);
    let h = height - (n * 400);
    gradientLine(x, height, x, h, lerpColor(clr1, clr2, 0.8), lerpColor(clr1, clr2, 0.3));
		if ((n < treeThreshold && n > treeThreshold-0.01)
			 || (n > treeThreshold*2 && n < treeThreshold*2+0.01)) {
			drawTree(x, h, 20, lerpColor(clr1, clr2, 0.4));
		}
  }

	// front mountains 
	xpos = millis() / 35;
	for (let x = -screenOF; x < width+screenOF; x++) {
		let n = noise((x + xpos + 1000) / 180);
		let h = height - (n * 300);
		gradientLine(x, height+25, x, h, clr2, clr1);
		if ((n < treeThreshold && n > treeThreshold-0.01)
			 || (n > treeThreshold*2 && n < treeThreshold*2+0.01)) {
			drawTree(x, h, 30, lerpColor(clr1, clr2, 0.1));
		}
	}
	
	// river
	xpos = millis() / 15;
	strokeWeight(0);
	for (let x = -screenOF; x < width+screenOF; x++) {
		let n = noise((x + xpos + 10000) / 250);
		let h = height - (n * 60);
		fill(lerpColor(clr1,clr2,0.9));
		rect(x, h, 1, h);
		fill(lerpColor(clr1,clr2,0.7));
		if (n < 0.4 || n > 0.6) {
			let squig = map(noise((x + xpos + 10000)/20), 0, 1, 5, 20);
			circle(x, height - squig, 3);
		}
	}
}

function drawTree(x, y, h, clr) {
	strokeWeight(0);
	fill(clr);
	beginShape();
		for (let i = 0; i < h * 1.3; i++) {
			let scaledA = map(i, 0, h, 2, 15); // narrow to wide       
			let xOffset = sin(i * 1) * scaledA;
			vertex(x + xOffset, y + i - h);
		}
  endShape();
	strokeWeight(1);
}

function drawBird(x, y, size, clr) {
	let u = size/5; // unit
	strokeWeight(0);
	fill(clr);
	beginShape();
		// top stroke 
		vertex(x-2*u, y-0.5*u);
		curveVertex(x-u, y-u);
		curveVertex(x,y);
		curveVertex(x+u, y-0.75*u);
		curveVertex(x+2*u, y-1.25*u);
		curveVertex(x+3*u, y-0.5*u);
		// bottom
		curveVertex(x+2*u, y-0.5*u);
		curveVertex(x+u, y-0.5*u);
		curveVertex(x, y+0.1*u);
		curveVertex(x-u, y-0.5*u);
		curveVertex(x-2*u, y-0.5*u);
		curveVertex(x-2.1*u, y);
	endShape();
	strokeWeight(1);
}