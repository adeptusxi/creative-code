let noiseLevel = 0.015; 
let mainThreshold = 0.5; // between main color groups 
let levelsPerGroup = 10; // sub colors per main color group 
let aboveColors = [];
let aboveColor1;
let aboveColor2;
let belowColors = [];
let belowColor1;
let belowColor2;

function setup() {
  createCanvas(640, 640);
	initColors();
	initSplats();
  noLoop();
	blendMode(MULTIPLY);
}

function initColors() {
	splatColor = color(215, 155, 95, 75);
	
	aboveColor1 = color(199, 171, 143);
	aboveColor2 = color(54, 29, 5);
	belowColor1 = color(232, 234, 237);
	belowColor2 = color(188, 192, 196);
	
	for (let i = 0; i < levelsPerGroup; i++) {
		let imapped = map(i, 0, levelsPerGroup-1, 0, 1);
		let clr = lerpColor(aboveColor1, aboveColor2, imapped);
		aboveColors.push(clr);
		clr = lerpColor(belowColor1, belowColor2, imapped)
		belowColors.push(clr);
		
	}
}

function initSplats() {
	for (let i = 0; i < floor(random(minSplats, maxSplats)); i++) {
		let x = random(0, width);
		let y = random(0, height);
		splats.push(new Splat(x, y));
	}
}

function draw() {
	// load, noise, update format from chatgpt 
  loadPixels(); 
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      let n = noise(i * noiseLevel, j * noiseLevel);
			
			let clr; 
			let idx;
			if (n > mainThreshold) {
				// pick from above colors 
				idx = floor(map(n, mainThreshold, 1, 0, aboveColors.length - 1));
				clr = aboveColors[idx];
			} else {
				// pick from below colors 
				idx = floor(map(n, 0, mainThreshold, 0, belowColors.length - 1));
				clr = belowColors[idx];
			}
      set(i, j, clr);
    }
  }
  updatePixels();
	
	// splats 
	// for (let i = 0; i < splats.length; i++) {
	// 	(splats[i]).draw();
	// }
	// dots 
	for (let i = 0; i < floor(random(minDots, maxDots)); i++) {
		fill(splatColor);
		stroke(0.9*red(splatColor), 0.9*green(splatColor), 0.9*blue(splatColor), alpha(splatColor));
		let r = random(minDotRadius, maxDotRadius);
		let x = random(0, width);
		let y = random(0, height);
		ellipse(x, y, r, r);
	}
}