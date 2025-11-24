// Lissajous curve, exported as G-Code with (z) pressure.
// Used as a demo in DwM; do not delete. 
// Press 'g' to save G-Code. 
// Preview your G-Code using: https://ncviewer.com/


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
function setup() {
  createCanvas(1056, 816); // Letter: 11"x8.5" at 96 DPI.
	center = createVector(width/2, height/2);

  for (let i = 0; i < numBoids; i++) {
    flock.push(new Boid());
  }

  specialBoid = flock[int(random(flock.length))];
  specialBoid.separationWeight = 4.0;
  specialBoid.cohesionWeight = 0.2;
  specialBoid.alignmentWeight = 0.2;
	specialBoid.perceptionRadius += 15;
	specialBoid.bounceOffBoundary = true;
  specialBoid.color = color(150, 150, 255);
	specialBoid.size *= 2;
}

// Press 'g' to initiate saving of the G-Code file
function keyPressed(){
  if (key == 'g'){
    bDoExportGCode = true;
  } 
}

function draw() {
  background(255);
	
	stroke('black');
  drawPointsOnScreen(specialBoidTrail); 
  savePointsToGCode(specialBoidTrail); 
	
	updateAndDrawFlock();
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

  // Preview the lineweight
  const maxLineWeightPx = 7; 
  for (let i=0; i<points.length; i++){
    let pt = points[i]; 
    let d = map(pt.z, zLo,zHi, maxLineWeightPx,0); 
		noStroke();
		fill('black');
    circle(pt.x, pt.y, d);
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