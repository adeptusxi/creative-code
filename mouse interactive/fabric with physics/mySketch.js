// inspired by 思花's work
// https://www.xiaohongshu.com/user/profile/6041ed6c0000000001005c1f?xsec_token=YBELfpS5V803Xyh5L6E0zn6bFbVEnxjNcNeDjqokgftvs=&xsec_source=app_share&xhsshare=CopyLink&shareRedId=ODw7NjZJRU82NzUyOTgwNjZJOTo5NUlA&apptime=1759701407&share_id=2c4205b9fa7d471f9855c49bf79ed40c

// click/drag to tear fabric 
// holes will maintain roundness 
// randomly pinned border points to hold tension 
// adds spring physics and gravity to original sketch 

// parameters ------------------------------------------
// setup 
let spacing = 10;
let borderPadding = 50;
let bottomBorderPadding = 250;
let pinProbability = 0.22; // chance of an edge dot being an anchor 
let pinBottom = false; // allow bottom border to be anchors

// display 
let showDots = true;
let highlightPins = true;
let showLines = true;

// physics 
let gravity = 0.015;
let damping = 0.98; // damping constant for spring 
let springK = 0.02; // spring constant (stiffness) 
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

function setup() {
  createCanvas(windowWidth, windowHeight);
  initGrid();
}

function draw() {
  background(255);
	
  physicsUpdate();
  drawFabric();
}

function initGrid() {
	cols = floor((width - 2 * borderPadding) / spacing) + 1;
  rows = floor((height - borderPadding - bottomBorderPadding) / spacing) + 1;
  grid = [];
	
  // center on canvas 
  let offsetX = (width - (cols - 1) * spacing) / 2;
  let offsetY = (height - (rows - 1) * spacing) / 2 - (bottomBorderPadding - borderPadding)/2;

  for (let y = 0; y < rows; y++) {
    let row = [];
    for (let x = 0; x < cols; x++) {
      let px = offsetX + x * spacing;
      let py = offsetY + y * spacing;
      let p = new Particle(px, py);
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
				noStroke();
				if (highlightPins && p.pinned) {
					fill(30, 120, 255);
					circle(p.pos.x, p.pos.y, 6);
				} else {
					fill(20);
					circle(p.pos.x, p.pos.y, 4);
				}
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
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.alive = true; // does this point still exist (false if torn)
    this.pinned = false; // cannot be torn or moved by forces 
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
}
