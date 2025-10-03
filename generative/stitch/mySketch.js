let gridSpacing = 20;
let cols = []; 
let rows = [];

let backgroundColor; 
let borderColor;
let patternColor;
let textColor;

const MODE = {
	curve: 0, 
	straight: 1
};
let mode = MODE.curve;

function setup() {
  createCanvas(640, 640);	
	initColors();
	initPattern();
	noLoop();
	
  stroke(0);
	rectMode(CENTER);
}

function draw() {
	background(backgroundColor);
	(mode == MODE.curve) ? drawCurvedLines() : drawStraightLines();
	drawBorder();
	writeNumbers();
}

function mousePressed() {
	draw();
}

function initColors() {
	backgroundColor = color(245, 244, 240);
	borderColor = color(245, 244, 240);
	patternColor = color(210, 214, 214);
	textColor = color(210, 214, 214);
}

function initPattern() {
	for (let i = 0; i < width / gridSpacing; i++) {
		cols.push(Math.floor(random(2)));
	}
	for (let i = 0; i < height / gridSpacing; i++) {
		rows.push(Math.floor(random(2)));
	}
}

function drawBorder() {
	fill(borderColor);
	stroke(borderColor);
	rect(width / 2, gridSpacing / 2, width, gridSpacing); // top 
	rect(gridSpacing / 2, height / 2, gridSpacing, height); // left 
	rect(width / 2, height - gridSpacing / 2, width, gridSpacing); // bottom 
	rect(width - gridSpacing / 2, height / 2, gridSpacing, height); // right
}

function writeNumbers() {
	fill(textColor);
	noStroke();
	for (let i = 1; i < cols.length; i++) {
		text(cols[i], i * gridSpacing, gridSpacing/2);
	}
	for (let i = 1; i < rows.length; i++) {
		text(rows[i], gridSpacing/3, i * gridSpacing);
	}
}

function drawStraightLines() {
	stroke(patternColor);
	
  for (let x = 0; x < cols.length; x++) {
    let start = cols[x] * gridSpacing;
    for (let y = start; y < height; y += gridSpacing * 2) {
      line(x * gridSpacing, y, x * gridSpacing, y + gridSpacing);
    }
  }

  for (let y = 0; y < rows.length; y++) {
    let start = rows[y] * gridSpacing;
    for (let x = start; x < width; x += gridSpacing * 2) {
      line(x, y * gridSpacing, x + gridSpacing, y * gridSpacing);
    }
  }
}

function drawCurvedLines() {
  stroke(patternColor);
  noFill();

	// vertical 
  for (let x = 0; x < cols.length; x++) {
    let start = cols[x] * gridSpacing;
    for (let y = start; y < height; y += gridSpacing * 2) {
      let xPos = x * gridSpacing;
      let yPos = y;

			// randomly curve left or right
      if (random(0,1) < 0.5) {
				arc(xPos, yPos + gridSpacing / 2, gridSpacing, gridSpacing, -HALF_PI, HALF_PI);
			} else {
				arc(xPos, yPos + gridSpacing / 2, gridSpacing, gridSpacing, HALF_PI, -HALF_PI);
			}
    }
  }

	// horizontal 
  for (let y = 0; y < rows.length; y++) {
    let start = rows[y] * gridSpacing;
    for (let x = start; x < width; x += gridSpacing * 2) {
      let xPos = x + gridSpacing / 2;
      let yPos = y * gridSpacing;

			// randomly curve up or down
      if (random(0,1) < 0.5) {
				arc(xPos, yPos, gridSpacing, gridSpacing, 0, PI);
			} else {
				arc(xPos, yPos, gridSpacing, gridSpacing, PI, 0);
			}
    }
  }
}
