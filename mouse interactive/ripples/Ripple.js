class Ripple {
	constructor(x,y) {
		this.x = x;
		this.y = y;
		this.r = 0;
		this.growthInc = growthInc;
		this.clr = 0;
	}
	
	expand() {
		this.r += this.growthInc;
		this.growthInc *= 0.99;
		this.clr += 2;
	}
	
	draw() {
		stroke(this.clr);
		circle(this.x,this.y,this.r);
	}
	
	done() {
		return this.r >= maxDiam;
	}
}