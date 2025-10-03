function drawStar(x, y, angle) {
  let angleRad = radians(angle);
  
  let diag1 = createVector(1, 0);
  let diag2 = createVector(0, 1);
  
  let d1 = rotateVector(diag1, angleRad).mult(starRadius);
  let d2 = rotateVector(diag2, angleRad).mult(starRadius);
  
  let p1 = createVector(x + d1.x, y + d1.y);
  let p2 = createVector(x - d1.x, y - d1.y);
  let p3 = createVector(x + d2.x, y + d2.y);
  let p4 = createVector(x - d2.x, y - d2.y);
  
  let controlPointDistance = starRadius * curveIntensity;

  beginShape();
  
  vertex(p4.x, p4.y);
  bezierVertex(
    x + (p4.x - x) * controlPointDistance / dist(p4.x, p4.y, x, y), 
    y + (p4.y - y) * controlPointDistance / dist(p4.x, p4.y, x, y),
    x + (p1.x - x) * controlPointDistance / dist(p1.x, p1.y, x, y), 
    y + (p1.y - y) * controlPointDistance / dist(p1.x, p1.y, x, y),
    p1.x, p1.y
  );
  
  vertex(p1.x, p1.y);
  bezierVertex(
    x + (p1.x - x) * controlPointDistance / dist(p1.x, p1.y, x, y),
    y + (p1.y - y) * controlPointDistance / dist(p1.x, p1.y, x, y),
    x + (p3.x - x) * controlPointDistance / dist(p3.x, p3.y, x, y),
    y + (p3.y - y) * controlPointDistance / dist(p3.x, p3.y, x, y),
    p3.x, p3.y
  );
  
  vertex(p3.x, p3.y);
  bezierVertex(
    x + (p3.x - x) * controlPointDistance / dist(p3.x, p3.y, x, y),
    y + (p3.y - y) * controlPointDistance / dist(p3.x, p3.y, x, y),
    x + (p2.x - x) * controlPointDistance / dist(p2.x, p2.y, x, y),
    y + (p2.y - y) * controlPointDistance / dist(p2.x, p2.y, x, y),
    p2.x, p2.y
  );
  
  vertex(p2.x, p2.y);
  bezierVertex(
    x + (p2.x - x) * controlPointDistance / dist(p2.x, p2.y, x, y),
    y + (p2.y - y) * controlPointDistance / dist(p2.x, p2.y, x, y),
    x + (p4.x - x) * controlPointDistance / dist(p4.x, p4.y, x, y),
    y + (p4.y - y) * controlPointDistance / dist(p4.x, p4.y, x, y),
    p4.x, p4.y
  );
  
  endShape(CLOSE);
}


function rotateVector(v, angle) {
	// from chatGPT 
  let cosA = cos(angle);
  let sinA = sin(angle);
  return createVector(v.x * cosA - v.y * sinA, v.x * sinA + v.y * cosA);
}
