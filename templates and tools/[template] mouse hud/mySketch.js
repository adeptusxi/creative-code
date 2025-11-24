let drawMouseHUD = true;
let roundPos = true;
let drawCross = true;

function setup() {
	createCanvas(600, 400);
}

function draw() {
	background(255);
	mouseCoordsHUD();
	mouseCross();
}

function mouseCoordsHUD() {
	if (!drawMouseHUD) return;
  textSize(16);
	
	let x = roundPos ? round(mouseX) : mouseX;	
	if (mouseX >= 0 && mouseX <= width) {
		fill('black');
	} else {
		fill('red');
	}
  text(`x: ${x}`, 20, 30);

	let y = roundPos ? round(mouseY) : mouseY;
	if (mouseY >= 0 && mouseY <= height) {
		fill('black');
	} else {
		fill('red');
	}
  text(`y: ${y}`, 20, 45);
	noFill();
}

function mouseCross() {
	if (!drawCross) return;
	stroke('black');
	line(mouseX, 0, mouseX, height);
	line(0, mouseY, width, mouseY);
}