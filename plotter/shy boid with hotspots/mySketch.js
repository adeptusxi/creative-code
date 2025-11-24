// to be used with files exported from 'island offset curves' sketch

// 'G' to export gcode s
// 'S' to export svg (first turn off trail and trail weight)
// 'H' to add a hotspot at the cursor

let onlyDrawTrail = false;
let drawTrailWeight = true;

let onlyDrawTrailBtn; 
let drawTrailWeightBtn;

// Don't touch these constants:
const pxToMm = 25.4 / 96;
const xMaxMm = 457;
const yMaxMm = 609;
const zMaxMm = 60;

// These Z values are up to you: 
const zUp = 25.0;
const zHi = 22.5;
const zLo = 20.0;

//------------------------------------------------
let bDoExportGCode = false;
let bDoExportSvg = false; 

function setup() {
  createCanvas(816, 1056); // Letter: 8.5"x11 at 96 DPI.
	center = createVector(width/2, height/2);
	
  createSpan('Upload hotspots file:').position(1010, 10);
  hotspotFileInput = createFileInput(handleHotspotFile);
  hotspotFileInput.position(1200, 10);

  createSpan('Upload background image:').position(1010, 40);
  bgFileInput = createFileInput(handleBgFile);
  bgFileInput.position(1200, 40);
	
  resetFlockBtn = createButton('ResetFlock');
  resetFlockBtn.position(1010, 70);
  resetFlockBtn.mousePressed(initFlock);
	
  onlyDrawTrailBtn = createButton('Toggle Flock');
  onlyDrawTrailBtn.position(1010, 100);
  onlyDrawTrailBtn.mousePressed(toggleFlock);
	
	drawTrailWeightBtn = createButton('Toggle Trail Weight');
  drawTrailWeightBtn.position(1010, 130);
  drawTrailWeightBtn.mousePressed(toggleTrailWeight);
	
	// hotSpots.push(createVector(constrain(random() * width, border, width - border), 
	// 													 constrain(random() * height, border, height - border)));
	// hotSpots.push(createVector(constrain(random() * width, border, width - border), 
	// 													 constrain(random() * height, border, height - border)));
	// hotSpots.push(createVector(constrain(random() * width, border, width - border), 
	// 													 constrain(random() * height, border, height - border)));

	initFlock();
	
	setSvgGroupByStrokeColor(true); 
}

function toggleFlock() {
	onlyDrawTrail = !onlyDrawTrail;
}

function toggleTrailWeight() {
	drawTrailWeight = !drawTrailWeight;
}

// Press 'g' to initiate saving of the G-Code file
function keyPressed(){
  if (key == 'g'){
    bDoExportGCode = true;
  } else if (key == 's') {
		bDoExportSvg = true;
	} else if (key == 'h') {
		hotSpots.push(createVector(mouseX, mouseY));;
	}
}

function draw() {
	background(255);
  if (bgImage && !onlyDrawTrail) {
    background(bgImage);
  } 
	
	if (bDoExportSvg){
    beginRecordSVG(this, "shy_boid.svg");
  }
	
	if (onlyDrawTrail) {
		drawPointsOnScreen(specialBoidTrail); 
		savePointsToGCode(specialBoidTrail); 
		updateFlock();
	} else {
		fill(255, 0, 0);
		noStroke();
		for (let hs of hotSpots) {
			ellipse(hs.x, hs.y, 12, 12);
		}

		stroke('black');
		drawPointsOnScreen(specialBoidTrail); 
		savePointsToGCode(specialBoidTrail); 

		updateAndDrawFlock();
	}
	
  if (bDoExportSvg){
    endRecordSVG();
    bDoExportSvg = false;
  }
}

//------------------------------------------------
// This function previews the points you computed onscreen.
// It draws a polyline spine, and then uses circles 
// to indicate how the z-pressure might look. 
function drawPointsOnScreen(points){
  noFill();
  
  // Draw the spine 
  beginShape();
  for (let i=0; i<points.length; i++){
    let pt = points[i]; 
    vertex(pt.x, pt.y);
  }
  endShape();

	if (drawTrailWeight) {
		const maxLineWeightPx = 7; 
		for (let i=0; i<points.length; i++){
			let pt = points[i]; 
			let d = map(pt.z, zLo,zHi, maxLineWeightPx,0); 
			noStroke();
			fill('black');
			circle(pt.x, pt.y, d);
		}
	} else {
		noFill();
		stroke(0);
		beginShape();
		for (let pt of points) {
			vertex(pt.x, pt.y);
		}
		endShape();
	}
}

//------------------------------------------------
// This function takes the points you computed, 
// and exports them to a G-Code text file 
// if the user has enabled the bDoExportGCode latch. 
function savePointsToGCode(points){
  if (bDoExportGCode){
    let gcodeData = [];
    gcodeData.push("$H"); // Home the plotter 
    gcodeData.push("G21"); // Use millimeters
    gcodeData.push("G90"); // Use absolute coordinates
    gcodeData.push("G1 F5000"); // Feed rate of 5000 mm/min

    // Compute each vertex
    for (let i=0; i<points.length; i++){
      let pt = points[i]; 
      let px = pt.x * pxToMm; 
      let py = (height-pt.y) * pxToMm;
      let pz = pt.z;
    
      // Keep movement within safe bounds
      if ((px >= 0) && (px < xMaxMm) && 
          (py >= 0) && (py < yMaxMm) && 
          (pz >= 0) && (pz < zMaxMm)){
        let gx = nf(px,1,4); 
        let gy = nf(py,1,4); 
        let gz = nf(pz,1,4); 
      
        // Travel to the first point with the pen raised
        if (i==0){gcodeData.push("G1 X"+gx+ " Y"+gy+ " Z"+zUp);}

        // Save a line with the current point's data
        gcodeData.push("G1 X" + gx + " Y" + gy + " Z" + gz);
      } else {
        console.warn("POINT " + i + " OUT OF BOUNDS!");
      }
    }

    gcodeData.push("G1 Z" + zUp); // Raise pen at end
    gcodeData.push("M2"); // End the G-Code program
    gcodeData.push("$H"); // Re-home the plotter
    saveStrings (gcodeData, "shy_boid.gcode.txt");
    bDoExportGCode = false; 
  } 
}

// FILES ---------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------

let hotspotsFile;
let bgImage;

let hotSpots = [];

function handleHotspotFile(file) {
  if (file.type == 'text') {
    //importIslandCenters(file.data);
  } else {
		print("Uploaded a non-text hotspots file");
	}
}

function handleBgFile(file) {
  if (file.type == 'image') {
    bgImage = loadImage(file.data, () => {
    });
  } else {
    print("Uploaded a non-image background file");
  }
}

function importIslandCenters(fileContent) {
  let lines = fileContent.split('\n');
  hotSpots = [];
  for (let line of lines) {
    line = line.trim();
    if (line.length === 0) continue;
    let parts = line.split(',');
    if (parts.length === 2) {
      let x = parseFloat(parts[0]);
      let y = parseFloat(parts[1]);
      hotSpots.push(createVector(x, y));
    }
  }
}

// FLOCKS --------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------
let flock = [];
let specialBoid;
let numBoids = 75;
let minBoidVelocity = 2;
let maxBoidVelocity = 4;

let specialBoidTrail = [];
let maxTrailLength = 10000; // number of points stored 

let border = 50;

let resetFlockBtn;

function initFlock() {
	flock = [];
	specialBoidTrail = [];
	
  for (let i = 0; i < numBoids; i++) {
    flock.push(new Boid());
  }

  specialBoid = flock[int(random(flock.length))];
	let specialStartSpot = hotSpots.length == 0 ? createVector(width/2, height/2) : random(hotSpots);
	specialBoid.position = specialStartSpot.copy();
	specialBoid.separationWeight = 4.0;
	specialBoid.cohesionWeight = 0.2;
	specialBoid.alignmentWeight = 0.2;
	this.hotspotWeight = 1.6;
	specialBoid.perceptionRadius += 15;
	specialBoid.bounceOffBoundary = true;
  specialBoid.color = color(150, 150, 255);
	specialBoid.size *= 2;
}

function updateFlock() {
  for (let b of flock) {
    b.flock(flock);
    b.update();
    b.edges();
  }
	
	let pos = specialBoid.position;
	let speed = specialBoid.velocity.mag();
	let z = map(speed, 0, specialBoid.maxSpeed, zHi, zLo);
  specialBoidTrail.push(createVector(pos.x, pos.y, z));
  if (specialBoidTrail.length > maxTrailLength) {
    specialBoidTrail.shift(); // remove oldest point
  }
}

function updateAndDrawFlock() {
  for (let b of flock) {
    b.flock(flock);
    b.update();
    b.edges();
    b.render();
  }
	
	let pos = specialBoid.position;
	let speed = specialBoid.velocity.mag();
	let z = map(speed, 0, specialBoid.maxSpeed, zHi, zLo);
  specialBoidTrail.push(createVector(pos.x, pos.y, z));
  if (specialBoidTrail.length > maxTrailLength) {
    specialBoidTrail.shift(); // remove oldest point
  }
}

class Boid {
  constructor(x, y) {
    this.position = createVector(random(width), random(height));
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(minBoidVelocity, maxBoidVelocity));
    this.acceleration = createVector();
    this.maxForce = 0.2;
    this.maxSpeed = 4;
		this.targetHotSpotIndex = floor(random(hotSpots.length));

    this.alignmentWeight = 1.5;
    this.cohesionWeight = 1.5;
    this.separationWeight = 1.5;
		this.hotspotWeight = 1;
		this.perceptionRadius = 50;

    this.size = 4; 
    this.color = color(200); 
		this.noiseOffset = random(1000); 
		
		this.bounceOffBoundary = false;
  }

  edges() {
    if (this.position.x > width - border) this.position.x = border;
    if (this.position.x < border) this.position.x = width - border;
    if (this.position.y > height - border) this.position.y = border;
    if (this.position.y < border) this.position.y = height - border;
  }

  align(boids) {
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < this.perceptionRadius) {
        steering.add(other.velocity);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  cohesion(boids) {
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < this.perceptionRadius) {
        steering.add(other.position);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.sub(this.position);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  separation(boids) {
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < this.perceptionRadius) {
        let diff = p5.Vector.sub(this.position, other.position);
        diff.div(d * d);
        steering.add(diff);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }
	
	towardHotSpot(spots) {
		if (spots.length == 0) return createVector(0, 0);

		let targetHS = spots[this.targetHotSpotIndex];
		let desired = p5.Vector.sub(targetHS, this.position);
		let distance = desired.mag();

		if (distance < 10) {
			let newIndex;
			do {
				newIndex = floor(random(spots.length));
			} while (newIndex == this.targetHotSpotIndex && spots.length > 1);
			this.targetHotSpotIndex = newIndex;
			targetHS = random(spots);
			desired = p5.Vector.sub(targetHS, this.position);
		}

		desired.setMag(this.maxSpeed);
		let steer = p5.Vector.sub(desired, this.velocity);
		steer.limit(this.maxForce);

		steer.mult(this.hotspotWeight);

		return steer;
	}


  flock(boids) {
    let alignment = this.align(boids).mult(this.alignmentWeight);
    let cohesion = this.cohesion(boids).mult(this.cohesionWeight);
    let separation = this.separation(boids).mult(this.separationWeight);
		let attraction = this.towardHotSpot(hotSpots);

    this.acceleration.add(alignment);
    this.acceleration.add(cohesion);
    this.acceleration.add(separation);
		this.acceleration.add(attraction);
  }

	update() {
		let n = noise(this.noiseOffset);
		let angle = map(n, 0, 1, -PI, PI);
		let noiseVec = p5.Vector.fromAngle(angle).mult(0.1);
		this.velocity.add(noiseVec);
		this.noiseOffset += 0.01;
		
		this.position.add(this.velocity);
		this.velocity.add(this.acceleration);
		this.velocity.limit(this.maxSpeed);

		if (this.bounceOffBoundary) {
			if (this.position.x < border) { 
				this.position.x = border; this.velocity.x *= -1; 
			} else if (this.position.x > width - border) { 
				this.position.x = width - border; this.velocity.x *= -1; 
			} 
			if (this.position.y < border) { 
				this.position.y = border; this.velocity.y *= -1; 
			} else if (this.position.y > height - border) {
				this.position.y = height - border; this.velocity.y *= -1; 
			}
		}

		this.acceleration.mult(0);
	}

	render() {
		// taken from p5js demo 
		// https://p5js.org/examples/classes-and-objects-flocking/
		let theta = this.velocity.heading() + radians(90);
		fill(this.color);
		noStroke();
		push();
		translate(this.position.x, this.position.y);
		rotate(theta);
		beginShape();
		vertex(0, -this.size * 2);
		vertex(-this.size, this.size * 2);
		vertex(this.size, this.size * 2);
		endShape(CLOSE);
		pop();
	}
}
