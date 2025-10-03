class Tile {
	constructor(tiletype, x, y, idx) {
		this.tiletype = tiletype;
    this.x = x;
    this.y = y;
		this.pixels_index = idx;
		this.rot = floor(random()*12)*(PI/3);
		this.prev_brightness = -1;
		this.color = (this.tiletype == TileType.background) ? mid_clr : dark_clr;
  }
    
  display() {
		
		if (this.pixels_index >= 0 && this.pixels_index < video.pixels.length) {
      let r = video.pixels[this.pixels_index + 0];
      let g = video.pixels[this.pixels_index + 1];
      let b = video.pixels[this.pixels_index + 2];
      let brightness = (r+g+b)/3/255;
      this.draw_design(brightness);
    }
  }
	
	draw_design(value) {
		stroke(this.color);
		noFill();
		push();
		translate(this.x, this.y); 
		if (this.tiletype == TileType.background) {
			scale(bg_tile_scale,bg_tile_scale);
			strokeWeight(stroke_weight/bg_tile_scale);
			//value = exaggerate(value);
		}
		
		rotate(this.rot);
		if (value < 0.1) {
			dark_with_circle(this.color);
		} else if (value < 0.15) {
			drawCurveType4(this.color);
		} else if (value < 0.3) {
			drawCurveType3();
		} else if (value < 0.5) {
			drawCurveType2();
		} else if (value < 0.65) {
			drawCurveType1();
		} 
		if (draw_hex_grid) {
			stroke(255,0,0);
			strokeWeight(1);
			noFill();
			drawHex();
			strokeWeight(stroke_weight);
		}
		pop();
	}
}

function dark_with_circle(clr) {
    arc(a, -b, b * 2, b * 2, PI * 0.5, PI * 1.1667, OPEN);
    arc(-a, -b, b * 2, b * 2, -PI * 0.1667, PI * 0.5, OPEN);
    arc(0, c, b * 2, b * 2, PI * 1.1667, -PI * 0.1667, OPEN);
    arc(a, b, b * 2, b * 2, PI * 0.8333, PI * 1.5, OPEN);
    arc(-a, b, b * 2, b * 2, PI * 1.5, PI * 0.1667, OPEN);
    arc(0, -c, b * 2, b * 2, PI * 0.1667, PI * 0.8333, OPEN);
    fill(clr);
    circle(0, 0, b * 2);
    noFill();
}

// following functions are from ---------------------
https://editor.p5js.org/kaleido/sketches/ZmphVUGVk
function drawCurveType1() {
    arc(a, -b, b * 2, b * 2, PI * 0.5, PI * 1.1667, OPEN);
    arc(-a, -b, b * 2, b * 2, -PI * 0.1667, PI * 0.5, OPEN);
    arc(0, c, b * 2, b * 2, PI * 1.1667, -PI * 0.1667, OPEN);
}

function drawCurveType2() {
    arc(0, c, b * 2, b * 2, PI * 1.1667, -PI * 0.1667, OPEN);
    arc(0, -c, b * 2, b * 2, PI * 0.1667, PI * 0.8333, OPEN);
    line(a, 0, -a, 0);
}

function drawCurveType3() {
    line(a, 0, -a, 0);
    line(-a / 2, d, a / 2, d);
    line(-a / 2, d, a / 2, -d);
}

function drawCurveType4(clr) {
    arc(a, -b, b * 2, b * 2, PI * 0.5, PI * 1.1667, OPEN);
    arc(-a, -b, b * 2, b * 2, -PI * 0.1667, PI * 0.5, OPEN);
    arc(0, c, b * 2, b * 2, PI * 1.1667, -PI * 0.1667, OPEN);
    arc(a, b, b * 2, b * 2, PI * 0.8333, PI * 1.5, OPEN);
    arc(-a, b, b * 2, b * 2, PI * 1.5, PI * 0.1667, OPEN);
    arc(0, -c, b * 2, b * 2, PI * 0.1667, PI * 0.8333, OPEN);
    fill(clr);
    circle(0, 0, b * 2);
    noFill();
}

function drawHex() {
  beginShape();
  vertex(0, -c);
  vertex(a, -b);
  vertex(a, b);
  vertex(0, c);
  vertex(-a, b);
  vertex(-a, -b);
  endShape(CLOSE);
}

//------------------------------------------
