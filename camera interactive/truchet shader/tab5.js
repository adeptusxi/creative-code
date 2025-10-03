let circle_diam = 30;

function hexagon(x, y) { 
  push(); 
  translate(x, y); 
  beginShape();
    vertex(0, -tile_height / 2); // top  
    vertex(-tile_width / 2, -tile_height / 4); // top L
    vertex(-tile_width / 2, tile_height / 4); // bottom L
    vertex(0, tile_height / 2); // bottom 
    vertex(tile_width / 2, tile_height / 4); // bottom R
    vertex(tile_width / 2, -tile_height / 4); // top R 
  endShape(CLOSE);
  pop(); 
}

function draw_base(x, y) {
  push(); 
  translate(x, y);
	
	// arcs 
	// bottom left 
  arc(-tile_width/2, tile_height/4, circle_diam, circle_diam, 3*PI/2, PI/4, PIE);
  // bottom right 
	arc(tile_width/2, tile_height/4, circle_diam, circle_diam, -PI/4, 3*PI/2, PIE);
	// top left 
	arc(-tile_width/2, -tile_height/4, circle_diam, circle_diam, 11*PI/6, PI/2, PIE); 
	// top right 
	arc(tile_width/2, -tile_height/4, circle_diam, circle_diam, PI/2, 7*PI/6, PIE); 
	// bottom 
	arc(0, tile_height/2, circle_diam, circle_diam, 7*PI/6, 11*PI/6, PIE);
	// top 
	arc(0, -tile_height/2, circle_diam, circle_diam, -11*PI/6, -7*PI/6, PIE);
	
	// left vertical 
	beginShape()
		vertex(-circle_diam/2, -tile_height/2 + circle_diam/4);
		vertex(0, -tile_height/2);
		vertex(circle_diam/2, -tile_height/2 + circle_diam/4);
		vertex(circle_diam/2, tile_height/2 - circle_diam/4);
		vertex(0, tile_height/2);
		vertex(-circle_diam/2, tile_height/2 - circle_diam/4); 
	endShape(CLOSE)

  let y_topleft_lower = -tile_height/4 + circle_diam/2; 
	let y_topright_lower = -tile_height/4 + circle_diam/2; 
  let y_bottomright_higher = tile_height/4 - circle_diam/2; 
  let y_bottomleft_higher = tile_height/4 - circle_diam/2; 

	pop();
}