class Droplet {
  constructor(x, y) {
		this.x = x;
		this.y = y;
		this.r = random(minDropletRadius, maxDropletRadius);
		this.transparency = 255 + staySolidFrames;
  }
	
	draw(transparency) {
		let t = constrain(this.transparency, 0, 255+staySolidFrames);
		let rOffset = map(t, 0, 255+staySolidFrames, 100, 0);
		let gOffset = map(t, 0, 255+staySolidFrames, 75, 0);
		let constrainMin = 1; // if time to fade completely, multiplies constrain min by 0, else by 1
		if (this.transparency < -1*completeFadeFrames) {
			constrainMin = map(this.transparency, -1*completeFadeFrames, -2*completeFadeFrames, 1, 0);
		}
		fill(red(inkColor) + rOffset, green(inkColor) + gOffset, blue(inkColor), constrain(this.transparency, minFadedAlpha*constrainMin, 255));
		stroke(red(inkColor), green(inkColor), blue(inkColor), constrain(this.transparency, minFadedAlpha*1.2*constrainMin, 200));
		strokeWeight(0.75);
		ellipse(this.x, this.y, this.r, this.r);
		this.transparency -= 2;
	}
}