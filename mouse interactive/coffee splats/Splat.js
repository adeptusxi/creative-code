class Splat {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.numVertices = int(random(minVertices, maxVertices));
    this.splatRadius = random(minSplatRadius, maxSplatRadius);
    this.vertices = this.generateVertices();
		this.droplets = this.generateDroplets();
		this.transparency = 255 + staySolidFrames;
		this.timeCounter = 0;
		this.fadedAlpha = map(this.splatRadius, minSplatRadius, maxSplatRadius, minFadedAlpha, maxFadedAlpha);
  }

  generateVertices() {
    let vertices = [];
    for (let i = 0; i < this.numVertices; i++) {
      let angle = map(i, 0, this.numVertices, 0, TWO_PI);
      let r = this.splatRadius + randomGaussian(0, this.splatRadius / 3);
      r = max(r, this.splatRadius * 0.85);
      let x = r * cos(angle);
      let y = r * sin(angle);
      vertices.push(createVector(x, y));
    }
    return vertices;
  }
	
	generateDroplets() {
		let droplets = [];
		for (let i = 0; i < (int)(random(0,maxDroplets)); i++) {
			let signX = random([-1, 1]);
			let signY = random([-1, 1]);
			let dropX = this.x + signX * (this.splatRadius*1.2 + randomGaussian(-10,10));
			let dropY = this.y + signY * (this.splatRadius*1.2 + randomGaussian(10,10));
			droplets.push(new Droplet(dropX, dropY));
		}
		return droplets;
	}

  draw() {
		// R and G offset for yellowing fade out 
		let t = constrain(this.transparency, 0, 255+staySolidFrames);
		let rOffset = map(t, 0, 255+staySolidFrames, 75, 0);
		let gOffset = map(t, 0, 255+staySolidFrames, 50, 0);
		let constrainMin = 1; // if time to fade completely, multiplies constrain min by 0, else by 1
		if (this.transparency < -1*completeFadeFrames) {
			constrainMin = map(this.transparency, -1*completeFadeFrames, -2*completeFadeFrames, 1, 0);
		}
		fill(red(inkColor) + rOffset, green(inkColor) + gOffset, blue(inkColor), constrain(this.transparency, constrainMin*this.fadedAlpha, 255));
		stroke(red(inkColor), green(inkColor), blue(inkColor), constrain(this.transparency, constrainMin*this.fadedAlpha*1.2, 200));
		strokeWeight(1);
		
    push();
			translate(this.x, this.y);

			beginShape();
				for (let i = 0; i < this.vertices.length; i++) {
					curveVertex((this.vertices)[i].x, (this.vertices)[i].y);
				}
			endShape(CLOSE);

			this.transparency -= 1.5;
			this.timeCounter += 1;
    pop();
		
		if (this.timeCounter >= noDropletsFrames) {
			for (let i = 0; i < this.droplets.length; i++) {
				(this.droplets)[i].draw(this.transparency);
			}
		}
  }
}