let displayX = 640; // size of drawn canvas 
let displayY = 640; 
let actualX = 64; // size of coordinate grid 
let actualY = 64; 
let xScale = actualX/displayX;
let yScale = actualY/displayY;
let input; 

function setup() {
  createCanvas(displayX, displayY);
  background(255);

  input = createInput();
  input.position(10, 10);
  input.size(100);
  input.attribute("placeholder", "(x, y)");

  input.changed(plotFromInput);
}

function draw() {
  // Nothing needed in the draw function for this sketch
}

function mousePressed() {
  let x = mouseX;
  let y = mouseY;
  if (x >= 0 && x < width && y >= 0 && y < height) {
    // point 
    stroke(0);
    strokeWeight(4);
    point(x, y);
		// text 
    noStroke();
    fill(0);
    textSize(12);
    text(`(${floor(x*xScale)}, ${floor(y*yScale)})`, x + 3, y - 3); 
  }
}

function keyPressed() {
	if (keyCode == 32) { // space bar 
		background(255);
  } 
}

function plotFromInput() {
  let coordText = input.value().replace(/\s+/g, '');
  let match = coordText.match(/^\(\s*(\d+)\s*,\s*(\d+)\s*\)$/);
  if (match) {
    let x = int(match[1]);
    let y = int(match[2]);
		let actualX = x/xScale;
		let actualY = y/yScale;

    if (actualX >= 0 && actualX < width && actualY >= 0 && actualY < height) {
      stroke(255, 0, 0); 
      strokeWeight(4);
      point(actualX, actualY);

      noStroke();
      fill(255, 0, 0);
      textSize(12);
      text(`(${x}, ${y})`, actualX + 3, actualY - 3);
    } 
  } else {
    console.log("Invalid format. Use (x, y)");
  }

  input.value('');
}