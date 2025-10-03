let num_designs = 15; 
const LINE_TYPES = {
    vertical_full: 0,
    vertical_top: 1,
    vertical_bottom: 2,
    vertical_top_partial: 3,
    vertical_bottom_partial: 4,
    horizontal_left: 5,
    horizontal_right: 6,
    horizontal_high3: 7,
    horizontal_high2: 8,
    horizontal_high1: 9,
    horizontal_low3: 10,
    horizontal_low2: 11,
    horizontal_low1: 12,
    curve_ul_down: 13,
    curve_lu_up: 14,
    curve_ru_down: 15,
    curve_ru_up: 16, 
};

class Tile {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		// this.designs; 
		// this.init_designs();
		this.designs = Array.from({ length: num_designs }, () => chance(50));
	}
	
	init_designs() {
		this.designs = Array.from({ length: num_designs }, () => chance(30));
		this.designs[LINE_TYPES.vertical_full] = this.designs[LINE_TYPES.vertical_full] || chance(50);
		this.designs[LINE_TYPES.horizontal_high2] = this.designs[LINE_TYPES.horizontal_high2] || chance(30);
		this.designs[LINE_TYPES.horizontal_high3] = this.designs[LINE_TYPES.horizontal_high3] || this.designs[LINE_TYPES.horizontal_high2] ? chance(50) : chance(10);
		this.designs[LINE_TYPES.horizontal_high1] = this.designs[LINE_TYPES.horizontal_high1] || this.designs[LINE_TYPES.horizontal_high2] ? chance(50) : chance(10);
	}
	
	draw_design(i) {
		push(); 
		translate(this.x, this.y);
		switch (i) {
			case LINE_TYPES.vertical_full: 
				// full vertical line 
				ink_line(0, -tile_height/2, 0, tile_height/2);
				break;
			case LINE_TYPES.vertical_top: 
				// top vertical line 
				ink_line(0, 0, 0, tile_height/2);
				break;
			case LINE_TYPES.vertical_bottom: 
				// bottom vertical line 
				ink_line(0, -tile_height/2, 0, 0);
				break;
			case LINE_TYPES.vertical_top_partial: 
				// partical top vertical line (missing bottom) 
				ink_line(0, 0, 0, tile_height/2 - padding*2);
				break;
			case LINE_TYPES.vertical_bottom_partial:
				// partial bottom vertical line (missing top)
				ink_line(0, -tile_height/2 + padding*2, 0, 0);
				break;
				
			case LINE_TYPES.horizontal_left: 
				// left horizontal line 
				ink_line(-tile_width/2, 0, 0, 0); 
				break; 
			case LINE_TYPES.horizontal_right: 
				// right horizontal line 
				ink_line(tile_width/2, 0, 0, 0); 
				break; 
			case LINE_TYPES.horizontal_high3:
				// horizontal high high line 
				ink_line(-tile_width/2 + padding, -tile_height/4, tile_width/2 - padding, -tile_height/4);
				break;
			case LINE_TYPES.horizontal_high2:
				// horizontal high line 
				ink_line(-tile_width/2 + padding*1.75, -tile_height/8, tile_width/2 - padding*1.75, -tile_height/8);
				break;
			case LINE_TYPES.horizontal_high1: 
				// horizontal mid line 
				ink_line(-tile_width/2 + padding*1.25, 0, tile_width/2 - padding*1.25, 0);
				break; 
			case LINE_TYPES.horizontal_low2:
				// horizontal high high line 
				ink_line(-tile_width/2 + padding, tile_height/4, tile_width/2 - padding, tile_height/4);
				break;
			case LINE_TYPES.horizontal_low3:
				// horizontal high line 
				ink_line(-tile_width/2 + padding*1.75, tile_height/8, tile_width/2 - padding*1.75, tile_height/8);
				break;
				
			case LINE_TYPES.curve_ul_down: 
				// up left downwards curve
				bezier_ink_line(0, 0, 0, -tile_height/3, -tile_width/2, -tile_height/3, -tile_width/2, 0);
				break; 
			case LINE_TYPES.curve_lu_up: 
				// up left upwards curve
				bezier_ink_line(0, 0, 0, tile_height/3, -tile_width/2, tile_height/3, -tile_width/2, 0);
				break; 
			case LINE_TYPES.curve_ru_down: 
				// up right downwards curve
				bezier_ink_line(0, 0, 0, -tile_height/3, tile_width/2, -tile_height/3, tile_width/2, 0);
				break; 
			case LINE_TYPES.curve_ru_up: 
				// up right upwards curve
				bezier_ink_line(0, 0, 0, tile_height/3, tile_width/2, tile_height/3, tile_width/2, 0);
				break; 
		}
		pop();
	}
	
	display() {
		stroke(196, 188, 185);
		//hexagon(this.x, this.y);
		stroke(ink_color);
		for (let i = 0; i < num_designs; i++) {
			if ((this.designs)[i]) {
				this.draw_design(i);
			}
		}
	}
}
