let clipperScale = 1000;

function getCapsuleVerts(cx, cy, w, h, angle, widen=true, wiggle=0.03) {
	let sideSteps = h/3;
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

function getCircleVerts(cx, cy, r, wiggle=0.03, numPoints=20) {
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

function offsetPath(path, dx, dy) {
  return path.map(p => ({ X: p.X + dx, Y: p.Y + dy }));
}

function getPersonVerts(x, y, size) {
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
  capsules.push(getCircleVerts(0, torsoTop - headR*0.75, headR/2, 0.03, size)); 
  // torso
	capsules.push(getCapsuleVerts(0, torsoTop + torsoH/2, torsoW, torsoH, 0, false));
  //left arm 
	capsules.push(getCapsuleVerts(-torsoW/2 - limbW/2, torsoTop + limbW*0.8, limbW, armH, radians(random(15, 70))));
  // right arm 
	capsules.push(getCapsuleVerts(torsoW/2 + limbW/2, torsoTop + limbW*0.8, limbW, armH, radians(-random(15, 70)))); 
  // left leg 
	capsules.push(getCapsuleVerts(-torsoW/4 - limbW*0.6, torsoH/2 + legH/2, limbW, legH, radians(random(0, 55))));
  // right leg 
	capsules.push(getCapsuleVerts(torsoW/4 + limbW*0.6, torsoH/2 + legH/2, limbW, legH, radians(-random(0, 55)))); 
	
  let clipperPaths = capsules.map(caps => p5VerticesToClipper(caps, clipperScale));
  let cpr = new ClipperLib.Clipper();
  cpr.AddPaths(clipperPaths, ClipperLib.PolyType.ptSubject, true);
  let solution_paths = new ClipperLib.Paths();
  cpr.Execute(ClipperLib.ClipType.ctUnion, solution_paths, ClipperLib.PolyFillType.pftNonZero, ClipperLib.PolyFillType.pftNonZero);
	
	return solution_paths[0];
}

// function drawPersonOutline(x, y, size) {
// 	let path = getPersonVerts(x, y, size);
// 	personOutlines.push(path);
// 	let verts = clipperPathToP5(path, clipperScale);
	
// 	push();
// 	translate(x, y);
// 	beginShape();
// 	for (let v of verts) {
// 	vertex(v.x, v.y);
// 	}
// 	endShape(CLOSE);
// 	pop();
// }

// occlusion version
function drawPersonOutline(x, y, size) {	
  let localPath = getPersonVerts(0, 0, size); 
  let dx = x * clipperScale;
  let dy = y * clipperScale;
  let path = offsetPath(localPath, dx, dy);
	
  let previousPaths = personOutlines;
  let clipper = new ClipperLib.Clipper();
  clipper.AddPaths([path], ClipperLib.PolyType.ptSubject, true);
  clipper.AddPaths(previousPaths, ClipperLib.PolyType.ptClip, true);

	// handle occlusion 
  let solutionPaths = new ClipperLib.Paths();
  clipper.Execute(
    ClipperLib.ClipType.ctDifference, 
    solutionPaths, 
    ClipperLib.PolyFillType.pftNonZero, 
    ClipperLib.PolyFillType.pftNonZero
  );

  personOutlines.push(path);

  for (let solPath of solutionPaths) {
    let verts = clipperPathToP5(solPath, clipperScale);
    push();
    beginShape();
    for (let v of verts) vertex(v.x, v.y);
    endShape(CLOSE);
    pop();
  }
}
