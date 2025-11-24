// inspired by 思花's work
// https://www.xiaohongshu.com/user/profile/6041ed6c0000000001005c1f?xsec_token=YBELfpS5V803Xyh5L6E0zn6bFbVEnxjNcNeDjqokgftvs=&xsec_source=app_share&xhsshare=CopyLink&shareRedId=ODw7NjZJRU82NzUyOTgwNjZJOTo5NUlA&apptime=1759701407&share_id=2c4205b9fa7d471f9855c49bf79ed40c

// click/drag to tear fabric 
// holes will maintain roundness 
// randomly pinned border points to hold tension 
// adds spring physics and gravity to original sketch 

// gaze tracking tear 
let FAST_TEAR = "FAST_TEAR"; // tear when gaze moves quickly 
let LINGER_TEAR = "LINGER_TEAR"; // tear when gaze lingers in same spot 
let gazeTearMode = LINGER_TEAR;

// FAST_TEAR mode parameters 
let tearSpeedThreshold = 25; // min velocity of screenGazePt to tear 

// LINGER_TEAR mode parameters 
let lingerRadius = 45; // in px, how close to currLingerCenter is considered still lingering there
let lingerTimeThreshold = 35; // how many frames of lingering causes a tear 

// parameters ------------------------------------------
// image 
let WORK = false; // upload image first, set to true
let imageName = 'd.jpg';
let imageScale = 1/12;

// setup 
let spacing = 10;
let topPadding = 100;
let pinProbability = 0.22; // chance of an edge dot being an anchor 
let pinBottom = false; // allow bottom border to be anchors

// display 
let showDots = true;
let highlightPins = true;
let showLines = true;
let showImage = false;

// physics 
let gravity = 0.015;
let damping = 0.98; // damping constant for spring 
let springK = 0.02; // spring constant (stiffness) 
let restLen = spacing;

// tear/hole deformation 
let tearRadius = 15;
let rimOffset = spacing * 0.45; // how far neighboring alive dots should be from disk center 
let influenceMargin = spacing * 2.0; // how far outwards a removed dot's displacement affects 
let moveStrength = 0.9; // how strongly points tend towards the disk boundary (in range [0,1]) 
// -----------------------------------------------------

let cols, rows;
let grid = []; // array of Particles
let neighborDirs = [[1, 0], [0, 1], [-1, 0], [0, -1]]; // for cleaner loop 

let currLingerFrames = 0; // timer for LINGER_TEAR
let currLingerCenter = null; // for LINGER_TEAR

let img;

function fabricPreload() {
	if (!WORK) {
		print("upload an image and set WORK=true");
		return;
	}
	img = loadImage(imageName);
}

function fabricSetup() {
	img.resize(img.width*imageScale, img.height*imageScale);
  initGrid();
}

function fabricDraw() {
	if (showImage) 
		image(img, width/2 - img.width/2, topPadding);
	
  physicsUpdate();
	gazeTear();
  drawFabric();
}

function initGrid() {
	cols = floor(img.width / spacing) + 1;
  rows = floor(img.height / spacing) + 1;
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

// tearing --------------------------------------------

function gazeTear() {
	if (screenGazePt && averagedHistory && averagedHistory.length > 1) {
		let curr = screenGazePt;
		let prev = averagedHistory[averagedHistory.length - 2];
		if (prev) {
			let speed = dist(curr.x, curr.y, prev.x, prev.y);
			if (gazeTearMode == FAST_TEAR) {
				if (speed > tearSpeedThreshold) {
					tear(screenGazePt.x, screenGazePt.y);
				}
			} else if (gazeTearMode == LINGER_TEAR) {
				if (!currLingerCenter) {
					// start a new linger 
					currLingerCenter = createVector(screenGazePt.x, screenGazePt.y);
				}

				let d = dist(screenGazePt.x, screenGazePt.y, currLingerCenter.x, currLingerCenter.y);
				if (d < lingerRadius) {
					currLingerFrames++;
					if (currLingerFrames > lingerTimeThreshold) {
						tear(screenGazePt.x, screenGazePt.y);
						currLingerFrames = 0;
					}
				} else {
					// moved away from linger, reset 
					currLingerCenter.set(screenGazePt.x, screenGazePt.y);
					currLingerFrames = 0;
				}
			}
		}
	}
}

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
		this.brightness = (0.299*r + 0.587*g + 0.114*b)/255; //  NTSC luminance
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
		noStroke();
		if (highlightPins && this.pinned) {
			fill(30, 120, 255);
			circle(this.pos.x, this.pos.y, 6);
		} else {
			fill(this.brightness * 255);
			circle(this.pos.x, this.pos.y, 4);
		}
	}
}
