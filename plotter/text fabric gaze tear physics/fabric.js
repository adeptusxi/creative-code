// inspired by 思花's work
// https://www.xiaohongshu.com/user/profile/6041ed6c0000000001005c1f?xsec_token=YBELfpS5V803Xyh5L6E0zn6bFbVEnxjNcNeDjqokgftvs=&xsec_source=app_share&xhsshare=CopyLink&shareRedId=ODw7NjZJRU82NzUyOTgwNjZJOTo5NUlA&apptime=1759701407&share_id=2c4205b9fa7d471f9855c49bf79ed40c

// click/drag to tear fabric 
// holes will maintain roundness 
// randomly pinned border points to hold tension 
// adds spring physics and gravity to original sketch 

// parameters ------------------------------------------
// setup 
let spacing = 25;
let borderPadding = 60;
let pinProbability = 0.22; // chance of an edge dot being an anchor 
let pinBottom = false; // allow bottom border to be anchors

// display 
let showDots = true;
let highlightPins = true;
let showLines = true;
let showImage = false;

// gaze tracking tear 
let FAST_TEAR = "FAST_TEAR"; // tear when gaze moves quickly 
let LINGER_TEAR = "LINGER_TEAR"; // tear when gaze lingers in same spot 
let gazeTearMode = LINGER_TEAR;

// FAST_TEAR mode parameters 
let tearSpeedThreshold = 25; // min velocity of screenGazePt to tear 

// LINGER_TEAR mode parameters 
let lingerRadius = 45; // in px, how close to currLingerCenter is considered still lingering there
let lingerTimeThreshold = 10; // how many frames of lingering causes a tear 

// pinning points 
let SIGNIFICANT_CHARS = "SIGNIFICANT_CHARS"; // pin semantically significant chars selected from charTex 
let BORDER_RANDOM = "BORDER_RANDOM"; // random pin chars along border
let pinMode = SIGNIFICANT_CHARS;

// tear/hole deformation 
let tearRadius = 15; // enlarges affect area 
let baseHoleRadius = spacing * 0.7; // a removed dot is like a disk of this radius 
let rimOffset = spacing * 0.45; // how far neighboring alive dots should be from disk center 
let influenceMargin = spacing * 3.75; // how far outwards a removed dot's displacement affects 
let moveStrength = 1; // how strongly points tend towards the disk boundary (in range [0,1]) 
let smoothingPasses = 3; // how many local smoothing iterations 
let smoothingFactor = 1; // how strongly smoothing affects neighbors (in range [0,1])
// -----------------------------------------------------

let cols, rows;
let grid = []; // array of Particles

let currLingerFrames = 0; // timer for LINGER_TEAR
let currLingerCenter = null; // for LINGER_TEAR

function fabricSetup() {
  initGrid();
}

function fabricDraw() {
	gazeTear();
  drawFabric();
}

function initGrid() {
	cols = floor((width - 2 * borderPadding) / spacing) + 1;
  rows = floor((height - 2 * borderPadding) / spacing) + 1;
  grid = [];
	
  // center on canvas 
  let offsetX = (width - (cols - 1) * spacing) / 2;
  let offsetY = (height - (rows - 1) * spacing) / 2;

	let symbolCount = 0;
	let charCount = 0;
	
  for (let y = 0; y < rows; y++) {
		if (symbolCount >= charText.length) break;
		
    let row = [];
    for (let x = cols - 1; x >= 0; x--) {
			if (symbolCount >= charText.length) break;
			
      let px = x * spacing;
      let py = y * spacing;
			let c = charText[symbolCount];
			while (c == "。" || c == "，" || c == "；" || c == "：" || c == "？") {
				symbolCount++;
				if (symbolCount >= charText.length) break;
				c = charText[symbolCount];
			}
			if (c == "。" || c == "，" || c == "；" || c == "：" || c == "？") 
				break;
			
      let p = new Particle(px + offsetX, py + offsetY, x, y, c);
			
			if (pinMode == BORDER_RANDOM) {
				if (x == 0 || x == cols - 1 || y == 0 || (pinBottom && y == rows - 1))
					// point is on border, randomly assign it as an immovable anchor 
					if (random() < pinProbability) 
						p.pinned = true;
			} else if (pinMode == SIGNIFICANT_CHARS) {
				if (pinCharDict[c])
					p.pinned = true;
			}
      row.push(p);
			
			symbolCount++;
			charCount++;
    }
    grid.push(row);
  }
	
	print("initGrid(): initialized grid with:");
	print(symbolCount + "/" + charText.length + " symbols");
	print(charCount + " characters");
	print(rows + " rows, " + cols + " cols");
}

function drawFabric() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let p = grid[y][x];
      if (!p || !p.alive) continue;
			
			if (showLines) {
				stroke(200);
				strokeWeight(0.5);
				if (x < cols - 1 && grid[y][x + 1] && grid[y][x + 1].alive) {
					// towards neighbor to right 
					line(p.pos.x, p.pos.y, grid[y][x + 1].pos.x, grid[y][x + 1].pos.y);
				}
				if (y < rows - 1 && grid[y + 1][x] && grid[y + 1][x].alive) {
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
						currLingerCenter.set(screenGazePt.x, screenGazePt.y);
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
      if (!p || !p.alive || p.pinned) continue; // can't move anchors 
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
      if (!p || !p.alive || p.pinned) continue;

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
      if (!p || !p.alive || p.pinned) continue;

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
            if (q && q.alive) {
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
      if (!p || !p.alive || p.pinned) continue;
      if (newPosBuf[y][x]) p.pos = newPosBuf[y][x];
    }
  }
}

// particle class ------------------------------------------ 
// represents a point on the fabric 
class Particle {
  constructor(x, y, gx, gy, ch) {
    this.pos = createVector(x, y);
    this.gx = gx; // original grid coords (not used, maybe future iteration will need)
    this.gy = gy;
    this.alive = true; // does this point still exist (false if torn)
    this.pinned = false; // cannot be torn or moved by forces 
		this.char = ch;
  }
	
	draw() {
		noStroke();
		if (highlightPins && this.pinned) {
			// noStroke();
			// fill(30, 120, 255);
			// circle(this.pos.x, this.pos.y, 5);
			noFill();
			stroke('red');
			strokeWeight(3);
			addCharacter(this.char, this.pos.x, this.pos.y, 0, charScale);
		} else {
			// fill(this.brightness * 255);
			// circle(this.pos.x, this.pos.y, 3);
			noFill();
			stroke(0);
			strokeWeight(3);
			addCharacter(this.char, this.pos.x, this.pos.y, 0, charScale);
		}
	}
}
