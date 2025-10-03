class Particle {
  constructor(measure) {
    this.pos = createVector(width/2 - digitSize/4, height/2 + digitSize/4);
    this.idx = 0; 
    this.target = createVector(width/2 - digitSize/4, height/2 + digitSize/4); 
    this.trail = []; 
		// this.lifetime = 10;
		// this.speed = 0.5;
		if (measure == Measure.SEC) {
			this.speed = particleSpeed; 
			this.lifetime = particleLifetime;
			this.pos.x = width/2 + (digitSpacing/2 + 1.5*digitSize);
			this.target.x = width/2 + (digitSpacing/2 + 1.5*digitSize);
		} else if (measure == Measure.MIN) {
			this.speed = particleSpeed / 10; 
			this.lifetime = particleLifetime * 20;
		} else {
			this.speed = particleSpeed / 20;
			this.lifetime = particleLifetime * 40;
			this.pos.x = width/2 - (digitSpacing/2 + 1.5*digitSize);
			this.target.x = width/2 - (digitSpacing/2 + 1.5*digitSize);
		}
  }

  update(points) {
    if (points && points.length > 0) {
      if (this.pos.dist(this.target) < 1) {
        this.idx += 1; 
        if (this.idx >= points.length) {
          this.idx = 0; 
        }
        this.target.set(points[this.idx].x, points[this.idx].y); 
      }

      this.pos.x = lerp(this.pos.x, this.target.x, this.speed);
      this.pos.y = lerp(this.pos.y, this.target.y, this.speed);
      
      this.trail.push(this.pos.copy());

      if (this.trail.length > this.lifetime) {
        this.trail.shift(); 
      }
    }
  }

  display() {
    fill(particleColor);
    noStroke();

    // trail 
    for (let i = 0; i < this.trail.length; i++) {
      let pos = this.trail[i];
      let alpha = map(i, 0, this.trail.length, 0, 255);
      fill(red(particleColor), green(particleColor), blue(particleColor), alpha); 
      ellipse(pos.x, pos.y, 2);
    }

    // head 
    fill(particleColor);
    ellipse(this.pos.x, this.pos.y, 5); 
  }
}