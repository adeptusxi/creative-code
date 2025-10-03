// truchet curves from 
// https://editor.p5js.org/kaleido/sketches/ZmphVUGVk

let tile_width = 20; 
let tile_height; 
let tri_const; 
let spacing; 
let tiles, bg_tiles; 
let video; 
let a, b, c, d; 
let light_clr, mid_clr, dark_clr;
let stroke_weight;
let change_threshold = 0.75 // brightness change to change tile design 
let bg_tile_scale = 3;
let draw_hex_grid = false;

const TileType = {
	"background" : 0, 
	"tile" : 1
};

function setup() {
  createCanvas(640, 480);
	frameRate(30);
	stroke_weight = tile_width / 5;
  strokeWeight(stroke_weight);
  rectMode(CENTER);
    
  spacing = tile_width / 2;
  tri_const = 2 / sqrt(3);
  tile_height = tri_const * tile_width;
	
  a = tile_width / 2; // half width 
  b = a * tan(PI / 6); // center to middle of side distance 
  c = sqrt(a * a + b * b); // center to vertex distance 
  d = (b + c) / 2; //
	
	light_clr = color(232, 255, 253); 
	mid_clr = color(158, 178, 184);
	dark_clr = color(91, 100, 110); 
    
  video = createCapture(VIDEO);
  video.size(floor(width / tile_width), floor(height / (tile_height * 0.75)) + 1);
  video.hide();
    
  init_tiles();
}

function draw() {
	background(light_clr);
	video.loadPixels(); 
	for (let i = 0; i < bg_tiles.length; i++) {
		bg_tiles[i].display();
	}
  for (let i = 0; i < tiles.length; i++) {
    tiles[i].display();
  }      
}

function init_tiles() {
  tiles = [];
  let at_col = 0;
	let i = 0;
  for (i; i < height + tile_height; i += tile_height * 0.75) {
    let j = (at_col % 2 == 0) ? 0 : tile_width / 2; 
    for (j; j < width + tile_width; j += tile_width) {
      // treat video pixels as tile_width x tile_height * 0.75 square grid with 
			let c = (width / tile_width) - 1 - floor(j / tile_width);
			let r = floor(i / (tile_height * 0.75)); 
      tiles.push(new Tile(TileType.tile, j, i, (r * floor(width/tile_width) + c) * 4));
    }
    at_col++;
  }
	
  bg_tiles = [];
  at_col = 0;
	i = 0;
  for (i; i < height + tile_height; i += (tile_height * 0.75) * bg_tile_scale) {
    let j = (at_col % 2 == 0) ? 0 : (tile_width / 2) * bg_tile_scale; 
    for (j; j < width + tile_width; j += tile_width * bg_tile_scale) {
			let c = (width / tile_width) - 1 - floor(j / tile_width);
			let r = floor(i / (tile_height * 0.75)); 
      bg_tiles.push(new Tile(TileType.background, j, i, (r * floor(width/tile_width) + c) * 4));
    }
    at_col++;
  }
}

function hexagon(x, y) { 
  push(); 
  translate(x, y); 
	fill(light_clr);
	strokeWeight(0);
  beginShape();
    vertex(0, -tile_height / 2); // top  
    vertex(-tile_width / 2, -tile_height / 4); // top L
    vertex(-tile_width / 2, tile_height / 4); // bottom L
    vertex(0, tile_height / 2); // bottom 
    vertex(tile_width / 2, tile_height / 4); // bottom R
    vertex(tile_width / 2, -tile_height / 4); // top R 
  endShape(CLOSE);
	noFill();
	strokeWeight(stroke_weight);
  pop(); 
}

function exaggerate(value) {
	return constrain(result - 0.25, 0, 1);
	result = value;
	if (value < 0.3) {
		result -= 0.25;
	} 
	else if (value > 0.7) {
		result += 0.25; 
	}
	return constrain(result, 0, 1);
}