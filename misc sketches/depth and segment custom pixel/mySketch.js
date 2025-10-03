let img, depth_img, segment_img; 
let depth_points = []; // bright points in depth_img 
let segment_points = []; // bright points in segment_img  

let cols, rows;
let cell_size = 16; 
let min_lines = 0; // from depth to depth points 
let max_lines = 3; // from depth to depth points 
let num_figure_lines = 2; // from segment to segment points 

function preload() {
	img = loadImage('original_rgb.png'); 
	depth_img = loadImage('elephant_depth_00001_.png'); 
	segment_img = loadImage('elephant_segment_00001_.png');
}

function setup() {
  createCanvas(964, 640, WEBGL);
  cols = width / cell_size;
  rows = height / cell_size;
  init_points(); 
	noFill();
	frameRate(30);
	// noLoop();
}

function draw() {
	background(255);
	drawLines(); 
}

function init_points() {
	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			let x = i * cell_size; 
			let y = j * cell_size; 
			
			let depth_pixel = depth_img.get(x,y); // change this to take avg of cell 
			let depth = (red(depth_pixel) + green(depth_pixel) + blue(depth_pixel)) / 3 / 255; 
			if (depth > 0.5) {
				depth_points.push(createVector(x, y, depth));
			}
			
			let segment_pixel = segment_img.get(x,y); // change this to take avg of cell 
			let figure = (red(segment_pixel) + green(segment_pixel) + blue(segment_pixel)) / 3 / 255; 
			if (figure > 0.75) {
				segment_points.push(createVector(x, y));
			}
		}
	}
}

function drawLines() {
	push(); 
	translate(-width/2, -height/2); 
	
	// for (let i = 0; i < depth_points.length; i++) {
	// 	let pt = depth_points[i];
	// 	let num_lines = map(pt.z, 0.5, 1, min_lines, max_lines); 
		
	// 	stroke(0, 0, 0, 50);
	// 	for (let j = 0; j < num_lines; j++) {
	// 		let end_pt = random(depth_points);
	// 		let ctrl_pt = random(segment_points);
	// 		beginShape(); 
	// 			stroke(adjustAlpha(img.get(pt.x, pt.y), 50)); 
	// 			vertex(pt.x, pt.y); 
	// 			stroke(adjustAlpha(img.get(end_pt.x, end_pt.y), 50)); 
	// 			bezierVertex(ctrl_pt.x, ctrl_pt.y, ctrl_pt.x, ctrl_pt.y, end_pt.x, end_pt.y);
	// 			// vertex(end_pt.x, end_pt.y);
	// 		endShape(); 
	// 	}
	// }
	
	for (let i = 0; i < segment_points.length; i++) {
		let pt = segment_points[i]; 
		stroke(0, 0, 0, 50);
		for (let j = 0; j < num_figure_lines; j++) {
			let end_pt = random(segment_points);
			let ctrl_pt = random(segment_points);
			beginShape(); 
				stroke(adjustAlpha(img.get(pt.x, pt.y), 50)); 
				vertex(pt.x, pt.y); 
				stroke(adjustAlpha(img.get(end_pt.x, end_pt.y), 50)); 
				bezierVertex(ctrl_pt.x, ctrl_pt.y, ctrl_pt.x, ctrl_pt.y, end_pt.x, end_pt.y);
				// vertex(end_pt.x, end_pt.y);
			endShape(); 
		}
	}
	
	pop();
}

function adjustAlpha(clr, alpha) {
	return color(red(clr), green(clr), blue(clr), alpha);
}