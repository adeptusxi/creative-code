/************************ declarations ************************/
let debug = false;

// extended origin system https://openprocessing.org/sketch/2175842
let origin = {
  x: 0,
  y: 0,
	z: 0,
};
let originStack = [];

// colors
let skyBlue, skyYellow, treeBrown;

// recursive tree values 
let verticalGrowth;
let startLevel = 100;
let trees = []; 

/*************************** draw ***************************/

function setup() {
	createCanvas(800, 800);
	frameRate(1);
	
	// color setup
	skyBlue = color(197,230,260);
	skyYellow = color(240,230,198);
	treeBrown = color(92, 74, 64);
	
	// tree value setup 
	verticalGrowth = -height/17;
}

function draw() {
	// background gradient 
	verticalGradient(800, 800, skyBlue, skyYellow);
	
	// trees 
	ppush();
		stroke(treeBrown);
		strokeWeight(5);
		for (let i = 1; i < 6; i++) {
			ppush();
				ttranslate(i*width/8,height); 
				scale(1 + i/15);
				trees.push(new Tree(startLevel));
				for (let tree of trees) {
    			tree.display();
  			}
			ppop();
		}
	ppop();
}

/************************** helpers **************************/

function verticalGradient(w, h, topColor, bottomColor) {
	for (let i = 0; i <= h; i++) {
      stroke(lerpColor(topColor, bottomColor, i/h));
      line(0, i, w, i);
  }
}

function tree(level) { 
	// adapted from https://p5js.org/examples/simulate-recursive-tree.html
	if (level <= 12 || origin.y <= 400) return;
	let x = 1;
	if (level == startLevel) x = 1.5;
	line(0,0,0,verticalGrowth*x);
	ttranslate(0,verticalGrowth*x);
	rotate(random(-0.05,0.05));
	if (random([1,2]) == 1) {
		scale(0.8);
		ppush(); // right branch
			rotate(0.3); 
			tree(level*0.75);
		ppop();
		ppush(); // left branch
			rotate(-0.3);
			tree(level*0.75);
		ppop();
	} else {
		tree(level);
	}
}

// extended origin system https://openprocessing.org/sketch/2175842
function ttranslate(x,y,z=0) { 
	translate(x,y,z);
	origin.x += x;
	origin.y += y;
	origin.z += z;
	if (debug) print("TRANSLATED: " + origin.x + ", " + origin.y + ", " + origin.z);
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

/************************** classes **************************/

class Tree { 
  constructor(level) {
    this.level = level;
  }

  display() {
		tree(this.level);
  }
}