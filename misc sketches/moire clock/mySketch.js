/* description: 
6 particles trace paths around the time in HH:MM:SS format 
a line connecting them is translated by multiples of lineSpacing to fill the screen 
background is static straight lines spaced by lineSpacing 
click to show/hide paths 
*/

let DRAW_TRAILS = true;

let SLParticle, SRParticle, MLParticle, MRParticle, HLParticle, HRParticle;
let particles = [SLParticle, SRParticle, MLParticle, MRParticle, HLParticle, HRParticle];
let SLPoints, SRPoints, MLPoints, MRPoints, HLPoints, HRPoints;
let points = [SLPoints, SRPoints, MLPoints, MRPoints, HLPoints, HRPoints];
let particleSpeed = 0.5; // base value
let particleLifetime = 50; // base value 

let font;
let digitSize = 100;
let digitSpacing = 75;
let lineSpacing = 5;
let bgColor, bgLineColor, particleColor;

const Measure = {
	SEC: "second", 
	MIN: "minute", 
	HR: "hour"
}

function preload() {
  // font from https://www.abstractfonts.com/font/12804
  font = loadFont('plump.ttf');
}

function setup() {
  createCanvas(640, 300);
	textFont(font);
	
	bgColor = color('black'); 
	bgLineColor = color(255, 122, 149);
	particleColor = color(99, 190, 255);
	
  SLParticle = new Particle(Measure.SEC);
  SRParticle = new Particle(Measure.SEC);
  MLParticle = new Particle(Measure.MIN);
  MRParticle = new Particle(Measure.MIN);
	HLParticle = new Particle(Measure.HR);
  HRParticle = new Particle(Measure.HR);
}

function draw() {
	background(bgColor);
	
	strokeWeight(1);
	stroke(bgLineColor);
	for (let i = 0; i < height; i+= lineSpacing) {
		line(0, i, width, i); 
	}
	
	particles = [SLParticle, SRParticle, MLParticle, MRParticle, HLParticle, HRParticle];
	points = [SLPoints, SRPoints, MLPoints, MRPoints, HLPoints, HRPoints];
	handleParticles();
	
	if (DRAW_TRAILS) {
		noStroke();
		for (let i = 0; i < particles.length; i++) {
			let p = particles[i]; 
			if (p == null) continue;
			p.display();
		}
	}
	
	for (let i = -height; i < height; i += lineSpacing) {
		strokeWeight(1);
		if (DRAW_TRAILS && i == 0) strokeWeight(2); 
		drawConnectingLine(0, i); 
	}
}

function mousePressed() {
	DRAW_TRAILS = !DRAW_TRAILS;
}

function lline(p1, p2) {
	line(p1.pos.x, p1.pos.y, p2.pos.x, p2.pos.y);
}

function eellipse(p, r) {
	ellipse(p.pos.x, p.pos.y, r);
}

function handleParticles() {
  let SL = (floor(second() / 10)).toString();
  let SR = (second() % 10).toString();
	let ML = (floor(minute() / 10)).toString(); 
	let MR = (minute() % 10).toString(); 
	let HL = (floor(hour() / 10)).toString(); 
	let HR = (hour() % 10).toString();
	
	let options = {
		sampleFactor: 0.1
	}
	let midX = width/2 - digitSize/4; 
	let midY = height/2 + digitSize/4;

  SLPoints = font.textToPoints(SL, midX + (digitSpacing/2 + digitSize), midY, digitSize, options);
  SRPoints = font.textToPoints(SR, midX + (digitSpacing/2 + 2*digitSize), midY, digitSize, options);
  MLPoints = font.textToPoints(ML, midX - (digitSpacing/2), midY, digitSize, options);
  MRPoints = font.textToPoints(MR, midX + (digitSpacing/2), midY, digitSize, options);
  HLPoints = font.textToPoints(HL, midX - (digitSpacing/2 + 2*digitSize), midY, digitSize, options);
  HRPoints = font.textToPoints(HR, midX - (digitSpacing/2 + digitSize), midY, digitSize, options);

	for (let i = 0; i < particles.length; i++) {
		let p = particles[i]; 
		if (p == null) return;
		p.update(points[i]);
	}
}

function drawConnectingLine(x, y) {
	push(); 
		translate(x, y)
		stroke(particleColor); 
		line(0,height/2, HLParticle.pos.x, HLParticle.pos.y); // left end 
		lline(HLParticle, HRParticle);
		lline(HRParticle, MLParticle); 
		lline(MLParticle, MRParticle); 
		lline(MRParticle, SLParticle); 
		lline(SLParticle, SRParticle);
		line(width,height/2, SRParticle.pos.x, SRParticle.pos.y); // right end 
	
		// fill(particleColor);
		// for (let i = 0; i < particles.length; i++) {
		// 	let p = particles[i]; 
		// 	if (p == null) continue;
		// 	eellipse(p, 2);
		// }
	pop();
}