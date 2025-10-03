// offset version of lline (no overlap)
// looks weird at small scales 

// function lline(p1, p2) {
//   stroke('black');
//   noFill();
//   strokeWeight(1); 

//   // distance 
//   let dx = p2.x - p1.x;
//   let dy = p2.y - p1.y;
//   let len = dist(p1.x, p1.y, p2.x, p2.y); 
// 	// normalized direction 
//   let dirX = dx / len;
//   let dirY = dy / len;
//   // normalized orthogonal direction 
//   let offsetX = -dirY * (4 / 2);
//   let offsetY = dirX * (lineWidth / 2);
//   // angle for the arcs
//   let angle = atan2(dy, dx); 
//   // move endpoints in by lineWidth 
//   let p1Shortened = { 
//     x: p1.x + dirX * lineWidth, 
//     y: p1.y + dirY * lineWidth 
//   };
//   let p2Shortened = { 
//     x: p2.x - dirX * lineWidth, 
//     y: p2.y - dirY * lineWidth 
//   };

// 	line(p1Shortened.x + offsetX, p1Shortened.y + offsetY, 
//        p2Shortened.x + offsetX, p2Shortened.y + offsetY);
//   line(p1Shortened.x - offsetX, p1Shortened.y - offsetY, 
//        p2Shortened.x - offsetX, p2Shortened.y - offsetY);
//   arc(p1Shortened.x, p1Shortened.y, lineWidth, lineWidth, angle + HALF_PI, angle - HALF_PI);
//   arc(p2Shortened.x, p2Shortened.y, lineWidth, lineWidth, angle - HALF_PI, angle + HALF_PI);
// }