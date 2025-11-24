let highlightIntersections = false;
let showPaths = true;
let showCurves = true;

let curvePull = 0.8;

let paths = []; // drawn paths 
let currentPath = [];
let intersections = []; 
	// elements are 
	// { 
	// pt, 		  	// xy coord of intersection 
	// pathA, 		// paths that intersected
	// pathB, 
	// segmentA,  // indices of segments on each path that intersected
	// segmentB, 
	// maxCurveDist // distance to the closest intersection or endpoint
	// } 
let curves = [];

function intersectionsUpdate() {
	noFill();
	stroke(255, 0, 0, 50);
	if (showPaths) drawPaths();
	stroke(0, 0, 255, 100);
	if (showCurves) drawCurves();

  if (highlightIntersections) {
		fill(255, 0, 0);
		noStroke();
		for (let ixn of intersections) {
			circle(ixn.point.x, ixn.point.y, 8);
		}
	}
}

function startNewPath() {
	if (!calibrated) return;
  currentPath = [];
  paths.push(currentPath);
	intersections = calculateIntersections(paths);
	calculateCurves();
}

// paths ------------------------------------------------
function drawPaths() {
  for (let path of paths) {
    beginShape();
    for (let pt of path) {
      vertex(pt.x, pt.y);
    }
    endShape();
  }

  if (currentPath.length > 0) {
    beginShape();
    for (let pt of currentPath) {
      vertex(pt.x, pt.y);
    }
    endShape();
  }
}
// ------------------------------------------------------

// intersections ---------------------------------------- 

// returns a vector of the intersection of line segments a1-a2 and b1-b2 
// null if they don't intersect 
function segmentIntersection(a1, a2, b1, b2) {
	// if a1-a2 intersections with b1-b2, then there is 
	// some ta,tb s.t. a1 + t*(a2 - a1) = b1 + tb*(b2 - b1)
  let den = (a1.x - a2.x) * (b1.y - b2.y) - 
            (a1.y - a2.y) * (b1.x - b2.x);
  if (den == 0) return null;

  let ta = ((a1.x - b1.x) * (b1.y - b2.y) - 
           (a1.y - b1.y) * (b1.x - b2.x)) / den;
  let tb = -((a1.x - a2.x) * (a1.y - b1.y) - 
            (a1.y - a2.y) * (a1.x - b1.x)) / den;

  if (ta >= 0 && ta <= 1 && tb >= 0 && tb <= 1) {
    return createVector(
      a1.x + ta * (a2.x - a1.x),
      a1.y + ta * (a2.y - a1.y)
    );
  }
  return null;
}

function calculateIntersections(paths) {
	let res = [];
  for (let i = 0; i < paths.length; i++) {
    for (let a = 0; a < paths[i].length - 1; a++) {
      let a1 = paths[i][a];
      let a2 = paths[i][a+1];
      for (let j = i+1; j < paths.length; j++) {
        for (let b = 0; b < paths[j].length - 1; b++) {
          let b1 = paths[j][b];
          let b2 = paths[j][b+1];
          let pt = segmentIntersection(a1, a2, b1, b2);
          if (pt != null) {
            res.push({
              point: pt,
              pathA: i,
              pathB: j,
              segmentA: a,
              segmentB: b,
							maxCurveDist: 1
            });
					}
        }
      }
    }
  }
	computeMaxCurveDist(res);
  return res;
}

// for each ixn in intersection, calculate ixn.maxCurveDist 
// min of: dist to nearest intersection, dist to 4 endpoints of paths of ixn
function computeMaxCurveDist(ixns) {
	if (ixns.length == 1) {
		ixns[0].maxCurveDist = 0;
		return;
	}
  for (let i = 0; i < ixns.length; i++) {
    let thisPoint = ixns[i].point;
    let minDist = Infinity; 
		
		// distance to nearest other intersection 
    for (let j = 0; j < ixns.length; j++) {
      if (i == j) continue;
      let otherPoint = ixns[j].point;
      let d = p5.Vector.dist(thisPoint, otherPoint);
      if (d < minDist) {
        minDist = d;
      }
    }
		
		// distances to path endpoints (along path, not straight)
		pathA = paths[ixns[i].pathA];
		pathB = paths[ixns[i].pathB];
		minDist = min(minDist, minDistToEndpoints(pathA, ixns[i].segmentA));
		minDist = min(minDist, minDistToEndpoints(pathB, ixns[i].segmentB));

    ixns[i].maxCurveDist = minDist;
  }	
}

// calculates minimum distance from path[ptIdx] to its endpoints 
// this is dist along the path, not straight dist 
function minDistToEndpoints(path, ptIdx) {
	if (ptIdx < 0 || ptIdx >= path.length) return Infinity;
	
  let distToStart = 0;
  for (let i = ptIdx; i > 0; i--) {
    distToStart += p5.Vector.dist(path[i], path[i - 1]);
  }

  let distToEnd = 0;
  for (let i = ptIdx; i < path.length - 1; i++) {
    distToEnd += p5.Vector.dist(path[i], path[i + 1]);
  }

  return Math.min(distToStart, distToEnd);
}

// ------------------------------------------------------

// curves -----------------------------------------------

// returns point at a distance along a path 
// path: list of points 
// startIndex: index of point to start at 
// fromPoint: point to travel the distance from 
// distance: distance to travel 
// direction: +1 if forward, -1 if backward 
function pointAlongPath(path, startIndex, fromPoint, distance, direction) {
  let idx = startIndex + (direction === 1 ? 1 : 0);
  let remaining = distance;
  let current = fromPoint.copy();

  while (remaining > 0 && idx >= 0 && idx < path.length - 1) {
    let next = path[idx + direction];
    let seg = p5.Vector.sub(next, current);
    let segLen = seg.mag();

    if (segLen > remaining) {
      seg.normalize().mult(remaining);
      current.add(seg);
      break;
    } else {
      remaining -= segLen;
      current = next.copy();
      idx += direction;
    }
  }
  return current;
}

// calculates curves for all intersections 
function calculateCurves() {
	curves = [];
	for (let ixn of intersections) {
		let pA = ixn.point;
		let pB = ixn.point;

		let pathA = paths[ixn.pathA];
		let pathB = paths[ixn.pathB];
		
		let expandDist = ixn.maxCurveDist;

		let pAback = pointAlongPath(pathA, ixn.segmentA, pA, expandDist, -1);
		let pAfor  = pointAlongPath(pathA, ixn.segmentA, pA, expandDist, +1);

		let pBback = pointAlongPath(pathB, ixn.segmentB, pB, expandDist, -1);
		let pBfor  = pointAlongPath(pathB, ixn.segmentB, pB, expandDist, +1);

		curves.push(calculateInwardCurve(pAback, pBback, ixn.point));
		curves.push(calculateInwardCurve(pBback, pAfor, ixn.point));
		curves.push(calculateInwardCurve(pAfor, pBfor, ixn.point));
		curves.push(calculateInwardCurve(pBfor, pAback, ixn.point));
	}	
}

// naive version - does not take paths into account 
// calculates a curve from anchor1 to anchor2 curving towards ctrl
function calculateInwardCurve(anchor1, anchror2, ctrl) {
  let towardsCtrl1 = p5.Vector.sub(ctrl, anchor1).mult(curvePull);
  let towardsCtrl2 = p5.Vector.sub(ctrl, anchror2).mult(curvePull);

  let ctrl1 = p5.Vector.add(anchor1, towardsCtrl1);
  let ctrl2 = p5.Vector.add(anchror2, towardsCtrl2);

  return {
    anchor1: anchor1.copy(),
    ctrl1: ctrl1.copy(),
    ctrl2: ctrl2.copy(),
    anchror2: anchror2.copy()
  };
}

function drawCurves() {
	for (let c of curves) {
		bezier(
			c.anchor1.x, c.anchor1.y,
			c.ctrl1.x, c.ctrl1.y,
			c.ctrl2.x, c.ctrl2.y,
			c.anchror2.x, c.anchror2.y
		);
	}
}
// ------------------------------------------------------