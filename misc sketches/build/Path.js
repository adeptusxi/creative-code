class Path {
	constructor(x, y, radius) {
		this.x = x; 
		this.y = y;
		this.r = radius;
		this.target = random(segment_points); 
	}
	
	update() {
		let distance = dist(this.x, this.y, this.target.x, this.target.y);
		if (distance >= 2) {
			this.x += 2 * (this.target.x - this.x) / distance; 
			this.y += 2 * (this.target.y - this.y) / distance; 
		} else {
			this.target = random(segment_points);
		}
	}

	onOverlap(other) {
		let distance = dist(this.x, this.y, other.x, other.y); 
		if (distance < (this.r + other.r)) {
			this.drawLineTo(other);
		}
	}

	drawLineTo(other) {
		push(); 
		translate(-width/2, -height/2); 
		
		let this_clr = img.get(this.x, this.y);
		let other_clr = img.get(other.x, other.y);
		noFill();
		strokeWeight(0.5);
		beginShape(); 
			stroke(adjustAlpha(this_clr, 30));
			vertex(this.x, this.y); 
			stroke(adjustAlpha(other_clr, 30));
			vertex(other.x, other.y); 
		endShape(); 
		
		pop();
	}
}