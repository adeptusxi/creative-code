// inspired by 思花's work
// https://www.xiaohongshu.com/user/profile/6041ed6c0000000001005c1f?xsec_token=YBELfpS5V803Xyh5L6E0zn6bFbVEnxjNcNeDjqokgftvs=&xsec_source=app_share&xhsshare=CopyLink&shareRedId=ODw7NjZJRU82NzUyOTgwNjZJOTo5NUlA&apptime=1759701407&share_id=2c4205b9fa7d471f9855c49bf79ed40c

// click/drag to tear fabric 
// holes will maintain roundness 
// randomly pinned border points to hold tension 
// adds spring physics and gravity to original sketch 

// parameters ------------------------------------------
// image 
let WORK = false; // upload image first, set to true
let imageName = 'd.jpg';
let imageScale = 1/8;

// dithering 
let minRadius = 1;
let maxRadius = 5;

// setup 
let spacing = 8;
let topPadding = 50;
let pinProbability = 0.22; // chance of an edge dot being an anchor 
let pinBottom = false; // allow bottom border to be anchors

// display 
let showDots = true;
let highlightPins = true;
let showLines = true;
let showImage = false;
let showDotSizePreview = true;

// physics 
let gravity = 0.02;
let damping = 0.98; // damping constant for spring 
let springK = 0.08; // spring constant (stiffness) 
let restLen = spacing;

// tear/hole deformation 
let tearRadius = 26;
let rimOffset = spacing * 0.45; // how far neighboring alive dots should be from disk center 
let influenceMargin = spacing * 2.0; // how far outwards a removed dot's displacement affects 
let moveStrength = 0.9; // how strongly points tend towards the disk boundary (in range [0,1]) 
// -----------------------------------------------------

let cols, rows;
let grid = []; // array of Particles
let neighborDirs = [[1, 0], [0, 1], [-1, 0], [0, -1]]; // for cleaner loop 
let img;
let circleVerts = [];
let numCirclePoints = 10;
let buttons = [];

/******** v plotSVG stuff v ********/
p5.disableFriendlyErrors = true; 

let bDoExportSvg = false; 
let exportSvgButton; 

function initiateSvgExport(){
  bDoExportSvg = true; 
}
/******** ^ plotSVG stuff ^ ********/

function preload() {
	if (!WORK) {
		print("upload an image and set WORK=true");
		return;
	} else  {
		img = loadImage(imageName);
	}
	frameRate(15);
}

function setup() {
	if (!WORK) {
		noLoop();
		return;
	}
  createCanvas(816, 1056); 
  
	/******** v plotSVG stuff v ********/
  exportSvgButton = createButton('Export SVG');
  exportSvgButton.position(5, height + 30);
  exportSvgButton.mousePressed(initiateSvgExport);
  
  // Set the SVG group by stroke color to `true`, so that strokes 
  // of the same color are grouped together in the SVG file. 
  setSvgGroupByStrokeColor(true); 
	/******** ^ plotSVG stuff ^ ********/
	
	buttons.push(createToggleButton("Toggle Image", () => showImage = !showImage));
	buttons.push(createToggleButton("Toggle Fabric Dots", () => showDots = !showDots));
	buttons.push(createToggleButton("Toggle Fabric Pin Highlights", () => highlightPins = !highlightPins));
	buttons.push(createToggleButton("Toggle Fabric Lines", () => showLines = !showLines));
	buttons.push(createToggleButton("Toggle Preview", () => showDotSizePreview = !showDotSizePreview));
	
  for (let i = 0; i < numCirclePoints; i++) {
    let angle = map(i, 0, numCirclePoints, 0, TWO_PI);
    let x = cos(angle);
    let y = sin(angle);
    circleVerts.push({ x: x, y: y });
  }
	
	img.resize(img.width*imageScale, img.height*imageScale);
  initGrid();
}

function draw() {
	if (!WORK) return;
	
	/******** v plotSVG stuff v ********/
  if (bDoExportSvg){
    beginRecordSVG(this, "fabric.svg");
  }
	/******** ^ plotSVG stuff ^ ********/
	/********** v draw here v **********/
	
  background(250);
	if (showImage) 
		image(img, width/2 - img.width/2, topPadding);
	
  physicsUpdate();
  drawFabric();

	/********** ^ draw here ^ **********/
	/******** v plotSVG stuff v ********/
  if (bDoExportSvg){
    endRecordSVG();
    bDoExportSvg = false;
  }
	/******** ^ plotSVG stuff ^ ********/
}

function createToggleButton(label, callback) {
  let btn = createButton(label);
  btn.mousePressed(callback);
  btn.style("margin", "4px");
  return btn;
}

function drawPolygonFromVerts(x, y, s, polygon) {
	push();
	translate(x, y);
	scale(s);
	beginShape();
	for (let pt of polygon) {
		vertex(pt.x, pt.y);
	}
	endShape(CLOSE);
	pop();
}

function initGrid() {
	cols = floor(img.width / spacing);
  rows = floor(img.height / spacing);
  grid = [];
	
  // center on canvas 
  let offsetX = (width - (cols - 1) * spacing) / 2;
  let offsetY = topPadding;

  for (let y = 0; y < rows; y++) {
    let row = [];
    for (let x = 0; x < cols; x++) {
      let px = x * spacing;
      let py = y * spacing;
			let colorAtXY = img.get(px, py); 
      let p = new Particle(px + offsetX, py + offsetY, colorAtXY);
      if (x == 0 || x == cols - 1 || y == 0 || (pinBottom && y == rows - 1))
				// point is on border, randomly assign it as an immovable anchor 
        if (random() < pinProbability) 
					p.pinned = true;
      row.push(p);
    }
    grid.push(row);
  }
}

// performs one timestep for physics (gravity and springiness)
function physicsUpdate() {
  // gravity
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let p = grid[y][x];
      if (!p.alive || p.pinned) continue;
      p.applyForce(0, gravity);
    }
  }

  // spring forces (to alive neighbors) 
	// spring code from gpt 
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let p = grid[y][x];
      if (!p.alive) continue;
			
      for (let [dx, dy] of neighborDirs) {
        let nbrX = x + dx, nbrY = y + dy;
        if (nbrX < 0 || nbrX >= cols || nbrY < 0 || nbrY >= rows) continue;
        let q = grid[nbrY][nbrX];
        if (!q.alive) continue;
				
        let delta = p5.Vector.sub(q.pos, p.pos);
        let d = delta.mag();
        if (d == 0) continue;
        let diff = (d - restLen) * springK;
        delta.normalize().mult(diff);
        if (!p.pinned) p.vel.add(delta);
        if (!q.pinned) q.vel.sub(delta);
      }
    }
  }

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      grid[y][x].update();
    }
  }
}

function drawFabric() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let p = grid[y][x];
      if (!p.alive) continue;
			
			if (showLines) {
				stroke(200);
				if (x < cols - 1 && grid[y][x + 1].alive) {
					// towards neighbor to right 
					line(p.pos.x, p.pos.y, grid[y][x + 1].pos.x, grid[y][x + 1].pos.y);
				}
				if (y < rows - 1 && grid[y + 1][x].alive) {
					// towards neighbor below 
					line(p.pos.x, p.pos.y, grid[y + 1][x].pos.x, grid[y + 1][x].pos.y);
				}
			}
			
			if (showDots) {
				p.draw();
			}
    }
  }
}

// interaction ------------------------------------------

function mousePressed() {
  tear(mouseX, mouseY);
}

function mouseDragged() {
  tear(mouseX, mouseY);
}

// tearing --------------------------------------------

function tear(mx, my) {
  let removedPoints = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let p = grid[y][x];
      if (!p.alive || p.pinned) continue; // can't move anchors 
      let d = dist(mx, my, p.pos.x, p.pos.y);
      if (d <= tearRadius) {
				// remove this point, add a removedPoint at its current position 
        p.alive = false;
        removedPoints.push(p.pos.copy());
      }
    }
  }
	
	if (removedPoints.length > 0) {
		// displace 
		applyDisplacement(removedPoints);
	}
}

// deforms points outwards from hole 
// slightly simplified from original sketch's version 
function applyDisplacement(removedPoints) {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let p = grid[y][x];
      if (!p.alive || p.pinned) continue;
			
      for (let s of removedPoints) {
        let d = p5.Vector.dist(p.pos, s);
        if (d < influenceMargin + rimOffset) {
          let dir = p5.Vector.sub(p.pos, s);
          if (dir.mag() < 1e-6) dir = p5.Vector.random2D();
          dir.normalize();
          let target = p5.Vector.add(s, p5.Vector.mult(dir, rimOffset));
          let disp = p5.Vector.sub(target, p.pos);
          let str = map(d, 0, influenceMargin, 1, 0, true) * moveStrength;
          p.pos.add(p5.Vector.mult(disp, str));
        }
      }
    }
  }
}

// particle class ------------------------------------------ 
// represents a point on the fabric 
class Particle {
  constructor(x, y, clr) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.alive = true; // does this point still exist (false if torn)
    this.pinned = false; // cannot be torn or moved by forces 
		
		let r = red(clr); 
		let g = green(clr); 
		let b = blue(clr); 
		this.brightness = r/255;
		this.layers = floor(map(this.brightness, 0, 1, 4, 0));
		
		// switch (this.layers) {
		// 	case 0: 
		// 		this.color = 'blue';
		// 		break;
		// 	case 1: 
		// 		this.color = 'green';
		// 		break;
		// 	case 2: 
		// 		this.color = 'red';
		// 		break;
		// 	default: 
		// 		this.color = 'orange';
		// 		break;
		// }
	  this.color = 'black'
  }

  applyForce(fx, fy) {
    this.acc.add(fx, fy);
  }

  update() {
    if (!this.alive || this.pinned) {
      this.vel.set(0, 0);
      this.acc.set(0, 0);
      return;
    }
    this.vel.add(this.acc);
    this.vel.mult(damping);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
  }
	
	draw() {
		noFill();
		if (highlightPins && this.pinned) {
			stroke(30, 120, 255);
			drawPolygonFromVerts(this.pos.x, this.pos.y, 2, circleVerts);
		} else {
			stroke(this.color);
			point(this.pos.x, this.pos.y);
			
			if (showDotSizePreview) {
				strokeWeight(0.5);
				fill(0);
				ellipse(this.pos.x, this.pos.y, map(this.layers, 0, 4, minRadius, maxRadius*1.5));
			}
		}
	}
}
