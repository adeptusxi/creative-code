let tile_width = 80;
let tile_height; 
let tri_const; 
let spacing; 
let tiles; 
let padding; 
let ink_color, bg_color; 

function setup() {
	createCanvas(640, 640);
	noStroke();
	bg_color = color(237, 229, 225);
	ink_color = color(26, 14, 9);
	background(bg_color);
	rectMode(CENTER);
	spacing = tile_width/2;
	tri_const = 2/sqrt(3);
	tile_height = tri_const * tile_width;
	padding = tile_height / 8;
	init_tiles();
}

function draw() {
	noFill();
	let at_col = 0;
	for (let i = 0; i < tiles.length; i++) {
		tiles[i].display();
	}	
	noLoop();
}

function init_tiles() {
	tiles = [];
	let at_col = 0;
	for (i = 0; i < height + tile_height; i += tile_height * 0.75) {
		let j = (at_col % 2 == 0) ? 0 : tile_width/2; 
		for (j; j < width + tile_width; j += tile_width) {
			tiles.push(new Tile(j, i))
		}
		at_col++;
	}
}

function hexagon(x, y) { 
	push(); 
	translate(x,y); 
	beginShape();
		vertex(0, -tile_height/2); // top  
		vertex(-tile_width/2, -tile_height/4); // top L
		vertex(-tile_width/2, tile_height/4); // bottom L
		vertex(0, tile_height/2); // bottom 
		vertex(tile_width/2, tile_height/4); // bottom R
		vertex(tile_width/2, -tile_height/4); // top R 
	endShape(CLOSE);
	pop(); 
}

function chance(percent) {
	return Math.random() < percent/100;
}

function ink_line(x1, y1, x2, y2) {
	// angle and control point calculations from chatGPT 
	fill(ink_color);
  let angle = atan2(y2 - y1, x2 - x1);
  let length = dist(x1, y1, x2, y2);

  let endThickness = constrain(length/30, 5, length); 
  let midThickness = endThickness/5; 
	
  // if (abs(cos(angle)) > abs(sin(angle))) {
  //   x1 += cos(angle) * endThickness/2;
  //   x2 -= cos(angle) * endThickness/2;
  // } else {
  //   y1 += sin(angle) * endThickness/2;
  //   y2 -= sin(angle) * endThickness/2;
  // }
	
  let ctrlDist1 = length * 0.3;
  let ctrlDist2 = length * 0.7;
  let ctrlThickness1 = midThickness;
  let ctrlThickness2 = midThickness;

  let ctrl1x = x1 + cos(angle) * ctrlDist1;
  let ctrl1y = y1 + sin(angle) * ctrlDist1;
  let ctrl2x = x1 + cos(angle) * ctrlDist2;
  let ctrl2y = y1 + sin(angle) * ctrlDist2;

  noStroke();
  beginShape();
		// top edge 
		vertex(x1 + cos(angle + HALF_PI) * endThickness / 2, y1 + sin(angle + HALF_PI) * endThickness / 2);
		bezierVertex(
			ctrl1x + cos(angle + HALF_PI) * ctrlThickness1 / 2, ctrl1y + sin(angle + HALF_PI) * ctrlThickness1 / 2,
			ctrl2x + cos(angle + HALF_PI) * ctrlThickness2 / 2, ctrl2y + sin(angle + HALF_PI) * ctrlThickness2 / 2,
			x2 + cos(angle + HALF_PI) * endThickness / 2, y2 + sin(angle + HALF_PI) * endThickness / 2
		);

		// bottom edge 
		vertex(x2 + cos(angle - HALF_PI) * endThickness / 2, y2 + sin(angle - HALF_PI) * endThickness / 2);
		bezierVertex(
			ctrl2x + cos(angle - HALF_PI) * ctrlThickness2 / 2, ctrl2y + sin(angle - HALF_PI) * ctrlThickness2 / 2,
			ctrl1x + cos(angle - HALF_PI) * ctrlThickness1 / 2, ctrl1y + sin(angle - HALF_PI) * ctrlThickness1 / 2,
			x1 + cos(angle - HALF_PI) * endThickness / 2, y1 + sin(angle - HALF_PI) * endThickness / 2
		);
  endShape(CLOSE);

  ellipse(x1, y1, endThickness, endThickness);
  ellipse(x2, y2, endThickness, endThickness);
}

function bezier_ink_line(end1x, end1y, ctrl1x, ctrl1y, ctrl2x, ctrl2y, end2x, end2y) {
  // angle and control point calculations from chatGPT 
	fill(ink_color);
	let angle = atan2(end2y - end1y, end2x - end1x);
	let length = dist(end1x, end1y, end2x, end2y);
	
	let endThickness = constrain(length/30, 5, length); 
  let midThickness = endThickness/5; 
  
  // if (abs(cos(angle)) > abs(sin(angle))) { 
  //   end1x += cos(angle) * endThickness/2;
  //   end2x -= cos(angle) * endThickness/2;
  // } else { // Closer to vertical
  //   end1y += sin(angle) * endThickness/2;
  //   end2y -= sin(angle) * endThickness/2;
  // }

  let angle1 = atan2(ctrl1y - end1y, ctrl1x - end1x); // Start angle
  let angle2 = atan2(end2y - ctrl2y, end2x - ctrl2x); // End angle
  let ctrlAngle1 = atan2(ctrl2y - ctrl1y, ctrl2x - ctrl1x); // Between control points

  let end1OffsetX1 = end1x + cos(angle1 + HALF_PI) * endThickness / 2;
  let end1OffsetY1 = end1y + sin(angle1 + HALF_PI) * endThickness / 2;
  let end1OffsetX2 = end1x + cos(angle1 - HALF_PI) * endThickness / 2;
  let end1OffsetY2 = end1y + sin(angle1 - HALF_PI) * endThickness / 2;

  let end2OffsetX1 = end2x + cos(angle2 + HALF_PI) * endThickness / 2;
  let end2OffsetY1 = end2y + sin(angle2 + HALF_PI) * endThickness / 2;
  let end2OffsetX2 = end2x + cos(angle2 - HALF_PI) * endThickness / 2;
  let end2OffsetY2 = end2y + sin(angle2 - HALF_PI) * endThickness / 2;

  let ctrl1OffsetX1 = ctrl1x + cos(ctrlAngle1 + HALF_PI) * midThickness / 2;
  let ctrl1OffsetY1 = ctrl1y + sin(ctrlAngle1 + HALF_PI) * midThickness / 2;
  let ctrl1OffsetX2 = ctrl1x + cos(ctrlAngle1 - HALF_PI) * midThickness / 2;
  let ctrl1OffsetY2 = ctrl1y + sin(ctrlAngle1 - HALF_PI) * midThickness / 2;

  let ctrl2OffsetX1 = ctrl2x + cos(ctrlAngle1 + HALF_PI) * midThickness / 2;
  let ctrl2OffsetY1 = ctrl2y + sin(ctrlAngle1 + HALF_PI) * midThickness / 2;
  let ctrl2OffsetX2 = ctrl2x + cos(ctrlAngle1 - HALF_PI) * midThickness / 2;
  let ctrl2OffsetY2 = ctrl2y + sin(ctrlAngle1 - HALF_PI) * midThickness / 2;

  // Draw the main brush stroke shape
  noStroke();
  beginShape();
		// top edge 
		vertex(end1OffsetX1, end1OffsetY1);
		bezierVertex(ctrl1OffsetX1, ctrl1OffsetY1, ctrl2OffsetX1, ctrl2OffsetY1, end2OffsetX1, end2OffsetY1);
		// bottom edge 
		vertex(end2OffsetX2, end2OffsetY2);
		bezierVertex(ctrl2OffsetX2, ctrl2OffsetY2, ctrl1OffsetX2, ctrl1OffsetY2, end1OffsetX2, end1OffsetY2);
  endShape(CLOSE);

  ellipse(end1x, end1y, endThickness, endThickness);
  ellipse(end2x, end2y, endThickness, endThickness);
} 