/************************ declarations ************************/
let debug = false;
let sound;

// extended origin https://openprocessing.org/sketch/2175842
let origin = {
  x: 0,
  y: 0,
	z: 0,
};
let originStack = [];

// colors
let skyBlue, skyYellow, treeBrown, brick, road, grass;

// recursive tree values 
let verticalGrowth;
let startLevel = 100;

/*************************** draw ***************************/

function preload() {
	sound = loadSound("https://deckard.openprocessing.org/user423914/visual2175862/hd26f22c38289db1decdf9649cc1fb1b0/rustle.mp3");
}

function setup() {
	createCanvas(800, 800);
	strokeCap(SQUARE);
	noStroke();
	
	// colors in one place 
	/*skyBlue = color(197,230,260);
	skyYellow = color(240,230,198);
	treeBrown = color(64,60,53);
	brick = color(76,60,60);
	road = color(80,90,100);
	grass = color(179,196,145);*/
	skyBlue = color(170);
	skyYellow = color(255);
	treeBrownDark = color(25);
	treeBrownLight = color(100);
	brick = color(50);
	road = color(75);
	grass = color(150);
	
	// tree value setup 
	verticalGrowth = -height/17;
}

function draw() {
	// background
	background(grass);
	verticalGradient(800, 400, skyBlue, skyYellow);
	
	mouseHud();
	noStroke();
	noLoop();
	
	// background trees 
	stroke(treeBrownLight);
	strokeWeight(5);
	ppush();
		ttranslate(450,410);
		scale(0.5); 
		for (let i = 1; i < 5; i++) {
			ppush();
				ttranslate(i*width/10,0); 
				scale(1 + i/15);
				tree(startLevel, 200);
			ppop();
		}
	ppop();
	
	// roads
	noStroke();
	fill(road);
	beginShape(); // vertical  
		vertex(460,520); // top R
		vertex(300,523); // top L
		vertex(0,630); // left edge 
		vertex(0,800); // corner edge
		vertex(180,800); // bottom edge
	endShape(CLOSE);
	beginShape(); // curved 
		vertex(240,660);
		bezierVertex(270,930,520,930,730,800);
		bezierVertex(450,690,470,740,330,580);
	endShape(CLOSE);
	beginShape(); // horizontal 
		vertex(0,430); // top L 
		vertex(0,495); // bottom L 
		vertex(800,570); // bottom R 
		vertex(800,470); // top R 
	endShape(CLOSE);
	
	// buildings 
	noStroke();
	fill(brick);
	beginShape(); // big one on right 
		vertex(800,238); // top R
		vertex(685,130); // triangle tip 
		vertex(623,248); // triangle bottom L
		vertex(600,250); // top L 
		vertex(600,712); // bottom L
		vertex(800,750); // bottom R
	endShape(CLOSE);
	
	// foreground trees 
	stroke(treeBrownDark);
	strokeWeight(5);
	for (let i = 1; i < 6; i++) {
		ppush();
			ttranslate(i*width/8,height); 
			scale(1 + i/15);
			tree(startLevel, 400);
		ppop();
	}
}

/************************** helpers **************************/

function mouseClicked() {
	sound.play();
	loop();
}

function mouseHud() {
	if (!debug) return;
	push();
		stroke(80); 
		line(mouseX, 0, mouseX, height); 
		line(0, mouseY, width, mouseY); 
		fill(160); 
		textSize(24);
		text(mouseX + ", " + mouseY, 20,30);
	pop();
}

function verticalGradient(w, h, topColor, bottomColor) {
	for (let i = 0; i <= h; i++) {
      stroke(lerpColor(topColor, bottomColor, i/h));
      line(0, i, w, i);
  }
}

function tree(level, maxY) { 
	// recursive tree 
	// adapted from https://p5js.org/examples/simulate-recursive-tree.html
	if (level <= 12 || origin.y <= maxY) return; // height/depth limit 
		/**** y coord limit not working ??? ****/
	let x = 1;
	if (level == startLevel) x += random(); // vary trunk height
	line(0,0,0,verticalGrowth*x);
	ttranslate(0,verticalGrowth*x);
	rotate(random(-0.05,0.05));
	if (random([1,2]) == 1 || level == startLevel) { // branching 
		scale(0.8);
		ppush(); // right branch
			rotate(random(0.2, 0.35));
			if (level <= 30) rotate(0.05);
			tree(level*0.75);
		ppop();
		ppush(); // left branch
			rotate(random(-0.2, -0.35));
			if (level <= 30) rotate(-0.05);
			tree(level*0.75);
		ppop();
	} else {
		scale(0.98);
		tree(level);
	}
}

// extended origin https://openprocessing.org/sketch/2175842
function ttranslate(x,y,z=0) { 
	translate(x,y,z);
	origin.x += x;
	origin.y += y;
	origin.z += z;
	//if (debug) print("x: " + origin.x + ", y: " + origin.y);
}

function ppush() {
  originStack.push({x: origin.x, y: origin.y, z: origin.z});
	push();
}

function ppop() {
	if (originStack.length == 0) return;
  let o = originStack.pop();
	ttranslate(o.x - origin.x, o.y - origin.y, o.z - origin.z);
	pop();
}