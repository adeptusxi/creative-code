// closed bezier shape code from Golan 
// https://editor.p5js.org/golan/sketches/gL43b7cTn

function drawVerticesBezier(verts, tightness){
  let N = verts.length; 
  beginShape(); 
  let p1 = getVertexPoint(verts, 0, 0, tightness);
  vertex(p1.x,p1.y);
  for (var i=0; i<N; i++){
    let p2 = getVertexPoint(verts, i,    1, tightness);
    let p3 = getVertexPoint(verts, i+1, -1, tightness);
    let p4 = getVertexPoint(verts, i+1,  0, tightness);
    bezierVertex(p2.x,p2.y, p3.x,p3.y, p4.x,p4.y);
  }
  endShape(CLOSE);
}

function getVertexPoint(verts, index, side, tightness){
  let N = verts.length; 
  if (side === 0){
    return (verts[index%N]); 
  } else {
    
    // Get the current vertex, and its neighbors
    let vB = verts[index%N];
    let vA = verts[(index+N-1)%N];
    let vC = verts[(index+N+1)%N];
    
    // Compute delta vectors from neigbors
    let dAB = p5.Vector.sub(vA,vB); 
    let dCB = p5.Vector.sub(vC,vB); 
    let dAB1 = dAB.copy().normalize(); 
    let dCB1 = dCB.copy().normalize(); 
    
    // Compute perpendicular and tangent vectors
    let vPerp = p5.Vector.add(dAB1, dCB1).normalize();
    let vTan = createVector(vPerp.y, 0-vPerp.x);
    let vCros = p5.Vector.cross(dAB1, dCB1);
    
    // Compute control point
    let len = tightness;
    if (side === 1){
      len *= dCB.mag(); 
      len *= (vCros.z > 0) ? -1:1;
    } else { // e.g. if side === -1
      len *= dAB.mag();
      len *= (vCros.z < 0) ? -1:1;
    }
    return(vB.copy().add(vTan.mult(len)));
  }
}