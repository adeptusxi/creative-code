function setup() {
	createCanvas(600, 600);
	background(255);
	noFill();
}

function draw() {
	let s = 300;
	
	stroke('black');
	drawPerson(width/2, height/2, s);
	
	stroke('red');
	drawPersonUnioned(width/2, height/2, s);
	
	stroke('black');
	rectMode(CENTER);
	rect(width/2, height/2, s);
	
	noLoop();
}

function drawPerson(x, y, size) {
  push();
  translate(x, y);
  noFill();
  stroke(0);
  strokeWeight(1.5);

  // proportions
  let headR = size * 0.3;
  let torsoW = size * 0.2;
  let torsoH = size * 0.2
	let torsoTop = -size/5 + torsoH/4;
  let limbW = size * 0.13;
  let legH = size * 0.35;
	let armH = size * 0.25;
	
  // head
  //ellipse(0, torsoTop - headR*0.75, headR);
	drawCapsule(0, torsoTop - headR*0.75, headR, headR/20, 0, false, 2.5);

  // torso
  drawCapsule(0, torsoTop + torsoH/2, torsoW, torsoH, 0, false);

  // arms
  drawCapsule(-torsoW/2 - limbW/2, torsoTop + limbW*0.8, limbW, armH, radians(random(30, 50))); // left
  drawCapsule(torsoW/2 + limbW/2, torsoTop + limbW*0.8, limbW, armH, radians(-random(30, 50)));   // right

  // legs
  drawCapsule(-torsoW/4 - limbW*0.6, torsoH/2 + legH/2, limbW, legH, radians(random(15, 35)));   // left
  drawCapsule(torsoW/4 + limbW*0.6, torsoH/2 + legH/2, limbW, legH, radians(-random(15, 35)));   // right

  pop();
}

function drawCapsule(cx, cy, w, h, angle, widen=true, wiggle=2) {
	let sideSteps = h/15;
  push();
  translate(cx, cy);
  rotate(angle);
  let r = w / 2;

  beginShape();
  // top 
  for (let a = PI; a >= 0; a -= PI/12) {
    let vx = cos(a) * r + random(-wiggle, wiggle);
    let vy = -h/2 - sin(a) * r + random(-wiggle, wiggle);
    vertex(vx, vy);
  }
  // right
  for (let i = 1; i <= sideSteps; i++) {
    let t = i / sideSteps;
    let vx = r + random(-wiggle, wiggle);
    let vy = lerp(-h/2 + r, h/2 - r, t) + random(-wiggle, wiggle);
    vertex(vx, vy);
  }
	let oldCx = cx;
	let oldR = r;
	if (widen) {
		cx -= r/4;
		r *= 1.5;
	}
  // bottom 
  for (let a = 0; a <= PI; a += PI/12) {
    let vx = cos(a) * r + random(-wiggle, wiggle);
    let vy = h/2 + sin(a) * r + random(-wiggle, wiggle);
    vertex(vx, vy);
  }
	cx = oldCx;
	r = oldR;
  // left
  for (let i = 1; i <= sideSteps; i++) {
    let t = i / sideSteps;
    let vx = -r + random(-wiggle, wiggle);
    let vy = lerp(h/2 - r, -h/2 + r, t) + random(-wiggle, wiggle);
    vertex(vx, vy);
  }
  endShape(CLOSE);
  pop();
}

function getCapsuleVerts(cx, cy, w, h, angle, widen=true, wiggle=0.1) {
	let sideSteps = h/15;
	let verts = [];
	let r = w / 2;

  // top 
  for (let a = PI; a >= 0; a -= PI/12) {
    let vx = cos(a) * r + random(-wiggle, wiggle);
    let vy = -h/2 - sin(a) * r + random(-wiggle, wiggle);
    verts.push({x: vx, y: vy});
  }
  // right
  for (let i = 1; i <= sideSteps; i++) {
    let t = i / sideSteps;
    let vx = r + random(-wiggle, wiggle);
    let vy = lerp(-h/2 + r, h/2 - r, t) + random(-wiggle, wiggle);
    verts.push({x: vx, y: vy});
  }
	let oldCx = cx;
	let oldR = r;
	if (widen) {
		cx -= r/4;
		r *= 1.5;
	}
  // bottom 
  for (let a = 0; a <= PI; a += PI/12) {
    let vx = cos(a) * r + random(-wiggle, wiggle);
    let vy = h/2 + sin(a) * r + random(-wiggle, wiggle);
    verts.push({x: vx, y: vy});
  }
	cx = oldCx;
	r = oldR;
  // left
  for (let i = 1; i <= sideSteps; i++) {
    let t = i / sideSteps;
    let vx = -r + random(-wiggle, wiggle);
    let vy = lerp(h/2 - r, -h/2 + r, t) + random(-wiggle, wiggle);
    verts.push({x: vx, y: vy});
  }
	
  // rotate & translate
  let transformed = verts.map(v => {
    let rx = v.x * cos(angle) - v.y * sin(angle);
    let ry = v.x * sin(angle) + v.y * cos(angle);
    return { x: rx + cx, y: ry + cy };
  });

  return transformed;
}

function getCircleVerts(cx, cy, r, wiggle=0.1, numPoints=10) {
  let verts = [];
  for (let i = 0; i < numPoints; i++) {
    let angle = map(i, 0, numPoints, 0, TWO_PI);
    let x = cos(angle) * r + random(-wiggle, wiggle);
    let y = sin(angle) * r + random(-wiggle, wiggle);
    verts.push({ x: x + cx, y: y + cy });
  }
  return verts;
}

function p5VerticesToClipper(vertices, scale=1000) {
  return vertices.map(v => ({ X: v.x * scale, Y: v.y * scale }));
}

function clipperPathToP5(path, scale=1000) {
  return path.map(p => createVector(p.X / scale, p.Y / scale));
}

function drawPersonUnioned(x, y, size) {
  let capsules = [];

  // proportions
  let headR = size * 0.3;
  let torsoW = size * 0.2;
  let torsoH = size * 0.2;
  let torsoTop = -size/5 + torsoH/4;
  let limbW = size * 0.13;
  let legH = size * 0.35;
  let armH = size * 0.25;

	// head
  capsules.push(getCircleVerts(0, torsoTop - headR*0.75, headR/2)); 
  // torso
	capsules.push(getCapsuleVerts(0, torsoTop + torsoH/2, torsoW, torsoH, 0, false));
  //left arm 
	capsules.push(getCapsuleVerts(-torsoW/2 - limbW/2, torsoTop + limbW*0.8, limbW, armH, radians(random(20, 50))));
  // right arm 
	capsules.push(getCapsuleVerts(torsoW/2 + limbW/2, torsoTop + limbW*0.8, limbW, armH, radians(-random(20, 50)))); 
  // left leg 
	capsules.push(getCapsuleVerts(-torsoW/4 - limbW*0.6, torsoH/2 + legH/2, limbW, legH, radians(random(10, 35))));
  // right leg 
	capsules.push(getCapsuleVerts(torsoW/4 + limbW*0.6, torsoH/2 + legH/2, limbW, legH, radians(-random(10, 35)))); 
	
  let scale = 1000;
  let clipperPaths = capsules.map(caps => p5VerticesToClipper(caps, scale));
  let cpr = new ClipperLib.Clipper();
  cpr.AddPaths(clipperPaths, ClipperLib.PolyType.ptSubject, true);
  let solution_paths = new ClipperLib.Paths();
  cpr.Execute(ClipperLib.ClipType.ctUnion, solution_paths, ClipperLib.PolyFillType.pftNonZero, ClipperLib.PolyFillType.pftNonZero);

  push();
  translate(x, y);
  beginShape();
	let verts = clipperPathToP5(solution_paths[0], scale);
  for (let v of verts) {
    vertex(v.x, v.y);
  }
  endShape(CLOSE);
  pop();
	
	return verts;
}

// polygon: array of {x, y}
// spacing: vertical distance between hatch lines
function drawHatchedPolygon(worldX, worldY, polygon, spacing = 2) {
  let minY = Math.min(...polygon.map(p => p.y));
  let maxY = Math.max(...polygon.map(p => p.y));

  for (let y = minY; y <= maxY; y += spacing) {
    let intersections = [];

    for (let i = 0; i < polygon.length; i++) {
      let p1 = polygon[i];
      let p2 = polygon[(i + 1) % polygon.length];

      if ((p1.y <= y && p2.y > y) || (p2.y <= y && p1.y > y)) {
        let x = p1.x + (y - p1.y) * (p2.x - p1.x) / (p2.y - p1.y);
        intersections.push(x);
      }
    }

    intersections.sort((a, b) => a - b);

    for (let i = 0; i < intersections.length; i += 2) {
      let x1 = intersections[i];
      let x2 = intersections[i + 1];
      if (x2 !== undefined) {
        line(worldX + x1, worldY + y, worldX + x2, worldY + y);
      }
    }
  }
}