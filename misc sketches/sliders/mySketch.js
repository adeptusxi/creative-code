let col60, col30, col10;
let sliders = [];
let numSliders = 60;
let animFrames30 = 600; // frames per animation cycle for 30% rectangles 
let animFrames10 = 480; // frames per animation cycle for 10% rectangles 
let easer; 
let easingFuncs30 = ["quadraticIn", "quadraticOut", "quadraticInOut", "cubicIn", "cubicOut", "cubicInOut", "sineInOut"];
let easingFuncs10 = ["quadraticInOut", "cubicInOut", "sineInOut", "elasticInOut"];

let bg60 = true; // true -> 60% is bg color, false -> 60% is a slider
let solidChance = 0.7; // chance for big slider to be solid (not hollow)
let minWidth = 120; // fraction of screen width for narrowest slider 
let maxWidth = 25; // fraction of screen width for widest slider

function setup() {
  createCanvas(640, 360);
	noStroke();
	generateColors(); 
	background(col60);
	easer = new p5.Ease();

	let w = 0;
  while (w < width) {
		let widthRandom = random(width/minWidth, width/maxWidth);
    sliders.push(new Slider(w, 
														0, 
														widthRandom, 
														height, 
														random(0, animFrames10), 
														random(0, animFrames30), 
													  random(0, animFrames10)));
		w += widthRandom;
  }
}

function draw() {
	bg60 ? background(adjustAlpha(col60, 30)) : background(adjustAlpha(col30, 50));
  for (let s of sliders) {
    s.update();
    s.display();
  }
}

function mousePressed(){
  generateColors(); 
	bg60 = random([0,1]);
	bg60 ? background(col60) : background(col30);
	for (let s of sliders) {
    s.updateDesign();
	}
}

function generateColors() {
	let h = random(0, 360);  
	col10 = chroma(h, 0.8, 0.8, "hsv").hex(); // saturated accent 
	col30 = chroma((h + random([-30, 30])) % 360, 0.15, 0.7, "hsv").hex(); // pastel secondary 
	col60 = chroma((h + 180) % 360, 0.8, 0.15, "hsv").hex(); // dark dominant 
}

function adjustAlpha(clr, a) {
	return color(red(clr), green(clr), blue(clr), a);
}
