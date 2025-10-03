/* 
inspired by Alessandro Valentino's Process4.reload()
https://openprocessing.org/sketch/402537

person photo by Evie Martinez via Unsplash 
https://unsplash.com/photos/a-man-in-a-white-outfit-with-his-hands-on-his-hips-LfTRT9qycJM

flower photo by Danist Soh via Unsplash 
https://unsplash.com/photos/pink-and-yellow-water-lily-BoYm46b3l6A
*/

let img, segment_img; 
let segment_points = []; // bright points in segment_img  
let mask_shader; 
let flower = false; // draw flower or person 

let cols, rows;
let cell_size = 16; 

let num_paths = 30; 
let paths = []; 

function preload() {
	if (flower) {
		img = loadImage('flower.jpg'); 
		segment_img = loadImage('flower_segment.png');
	} else {
		img = loadImage('sideprofile.jpg'); 
		segment_img = loadImage('sideprofile_segment.jpg');
	}
}

function setup() {
  if (flower) {
		createCanvas(960, 640, WEBGL);
	} else {
		createCanvas(640, 960, WEBGL);
	}
	// mask_shader = new p5.Shader(this.renderer, vert, frag);
	background(0);
  cols = width / cell_size;
  rows = height / cell_size;
  init_points(); 
	init_paths(); 
	noFill();
}

function draw() {
  for (let i = 0 ; i < paths.length; i++){
    let path = paths[i];
    path.update();
  }

  for (let i = 0; i < paths.length; i++) {
    let path = paths[i];
    for (var j = i + 1; j < paths.length; j++) {
      let other_path = paths[j];
      path.onOverlap(other_path);
    }
  }
	
	// mask_shader.setUniform('u_resolution', [width, height]);
	// mask_shader.setUniform('u_img', img);
	// mask_shader.setUniform('u_segment_img', segment_img);
	// shader(mask_shader);
	// fill(0);
	// rect(0, 0, width, height);
}

function init_points() {
	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			let x = i * cell_size; 
			let y = j * cell_size; 
			
			let segment_pixel = segment_img.get(x,y); 
			let figure = (red(segment_pixel) + green(segment_pixel) + blue(segment_pixel)) / 3 / 255; 
			if (figure > 0.75) {
				segment_points.push(createVector(x, y));
			}
		}
	}
}

function init_paths() {
  for (let i = 0; i < num_paths; i++) {
		let pt = random(segment_points)
		paths.push(new Path(pt.x, pt.y, random(40, 60)));
  }
}

function adjustAlpha(clr, alpha) {
	return color(red(clr), green(clr), blue(clr), alpha);
}