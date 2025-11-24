// inspired by 思花's work
// https://www.xiaohongshu.com/user/profile/6041ed6c0000000001005c1f?xsec_token=YBELfpS5V803Xyh5L6E0zn6bFbVEnxjNcNeDjqokgftvs=&xsec_source=app_share&xhsshare=CopyLink&shareRedId=ODw7NjZJRU82NzUyOTgwNjZJOTo5NUlA&apptime=1759701407&share_id=2c4205b9fa7d471f9855c49bf79ed40c

// click/drag to tear fabric 
// holes will maintain roundness 
// randomly pinned border points to hold tension 

// parameters ------------------------------------------
// setup 
let spacing = 15;
let borderPadding = 75; 
let pinProbability = 0.22; // chance of an edge dot being an anchor 

// display 
let showDots = true;
let highlightPins = true;
let showLines = true;

// tear/hole deformation 
let tearRadius = 26; // enlarges cursor's affect area 
let baseHoleRadius = spacing * 0.7; // a removed dot is like a disk of this radius 
let rimOffset = spacing * 0.45; // how far neighboring alive dots should be from disk center 
let influenceMargin = spacing * 2.0; // how far outwards a removed dot's displacement affects 
let moveStrength = 0.9; // how strongly points tend towards the disk boundary (in range [0,1]) 
let smoothingPasses = 3; // how many local smoothing iterations 
let smoothingFactor = 0.9; // how strongly smoothing affects neighbors (in range [0,1])
// -----------------------------------------------------

let cols, rows;
let grid = []; // array of Particles

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  initGrid();
}

function draw() {
  background(255);
	drawFabric();
}

function initGrid() {
	cols = floor((width - 2 * borderPadding) / spacing) + 1;
  rows = floor((height - 2 * borderPadding) / spacing) + 1;
  grid = [];
	
  // center on canvas 
  let offsetX = (width - (cols - 1) * spacing) / 2;
  let offsetY = (height - (rows - 1) * spacing) / 2;

  for (let y = 0; y < rows; y++) {
    let row = [];
    for (let x = 0; x < cols; x++) {
      let px = offsetX + x * spacing;
      let py = offsetY + y * spacing;
      let p = new Particle(px, py, x, y);
      if (x == 0 || x == cols - 1 || y == 0 || y == rows - 1) {
				// point is on border, randomly assign it as an immovable anchor 
        if (random() < pinProbability) 
					p.pinned = true;
      }
      row.push(p);
    }
    grid.push(row);
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
        removedPoints.push({
          center: p.pos.copy(),
          radius: baseHoleRadius * random(0.8, 1.2) // little bit of variation 
        });
      }
    }
  }

  if (removedPoints.length > 0) {
		// displace and smooth 
    applyDisplacement(removedPoints);
    for (let i = 0; i < smoothingPasses; i++) 
			smoothParticles();
  }
}

// applyDisplacement function from gpt 
// moves each alive point based on the strongest displacement required by removedPoints 
// so that the alive points bordering holes form a round-ish rim 
function applyDisplacement(removedPoints) {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let p = grid[y][x];
      if (!p.alive || p.pinned) continue;

      let best = {mag: 0, vec: null, holeIdx: -1, desiredRad: 0, holeDist: 0};

      for (let i = 0; i < removedPoints.length; i++) {
        let s = removedPoints[i];
        let d = p5.Vector.dist(p.pos, s.center);
        let desiredRad = s.radius + rimOffset;
        if (d < desiredRad + influenceMargin) {
					// s might influence p 
          let dir = p5.Vector.sub(p.pos, s.center); // direction away from hole center 
          if (dir.mag() < 1e-6) {
            // if position coincides with hole center, choose a random direction
            dir = p5.Vector.fromAngle(random(TWO_PI));
          }
          dir.normalize();
          // target position to sit on the circular rim for this hole 
          let target = p5.Vector.add(s.center, p5.Vector.mult(dir, desiredRad));
          let disp = p5.Vector.sub(target, p.pos);
          let mag = disp.mag();
          if (mag > best.mag) {
            best = {mag, vec: disp.copy(), holeIdx: i, desiredRad, holeDist: d};
          }
        }
      }

      if (best.vec) {
        // strength depends on how deep the particle is inside the desired radius:
        // deeper = stronger pull; near outer influence = weaker
        let howDeep = max(0, best.desiredRad - best.holeDist); // how far inside desired rim
        let strength = map(howDeep, 0, influenceMargin, 0.2, 1.0);
        strength = constrain(strength, 0, 1);
        let disp = p5.Vector.mult(best.vec, strength * moveStrength);
        p.pos.add(disp);
      }
    }
  }
}

// moves each alive, non-pinned point towards the average of its alive neighbors 
// strength of displacement is `smoothingFactor`
function smoothParticles() {
  // init empty buffer 
  let newPosBuf = [];
  for (let y = 0; y < rows; y++) {
    newPosBuf[y] = [];
    for (let x = 0; x < cols; x++) {
      newPosBuf[y][x] = null;
    }
  }

	// first pass: compute and store new position in buffer 
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let p = grid[y][x];
      if (!p.alive || p.pinned) continue;

			// take average of alive members of the 8 neighbors adjacent to p 
      let sum = createVector(0, 0);
      let count = 0;
      for (let offsetY = -1; offsetY <= 1; offsetY++) {
        for (let offsetX = -1; offsetX <= 1; offsetX++) {
          if (offsetX == 0 && offsetY == 0) continue; // skip p 
          let nbrX = x + offsetX; 
					let nbrY = y + offsetY;
          if (nbrX >= 0 && nbrX < cols && nbrY >= 0 && nbrY < rows) {
            let q = grid[nbrY][nbrX];
            if (q.alive) {
              sum.add(q.pos);
              count++;
            }
          }
        }
      }

      if (count > 0) {
        sum.div(count);
        let lerped = p5.Vector.lerp(p.pos, sum, smoothingFactor);
        newPosBuf[y][x] = lerped;
      } else {
        newPosBuf[y][x] = p.pos.copy(); // no alive neighbors 
      }
    }
  }

  // second pass: apply new positions 
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let p = grid[y][x];
      if (!p.alive || p.pinned) continue;
      if (newPosBuf[y][x]) p.pos = newPosBuf[y][x];
    }
  }
}

// particle class ------------------------------------------ 
// represents a point on the fabric 
class Particle {
  constructor(x, y, gx, gy) {
    this.pos = createVector(x, y);
    this.gx = gx; // original grid coords (not used, maybe future iteration will need)
    this.gy = gy;
    this.alive = true; // does this point still exist (false if torn)
    this.pinned = false; // cannot be torn or moved by forces 
  }
}