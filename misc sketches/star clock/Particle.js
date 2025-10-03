class Particle {
	constructor(x, y) {
    this.pos = createVector(x, y);
    this.distFromCenter = dist(this.pos.x, this.pos.y, width / 2, height / 2);
    this.angle = atan2(this.pos.y - height / 2, this.pos.x - width / 2);
    this.size = random(1, 3);
    
		// speed based on distance from center 
    if (this.distFromCenter <= secRadius) {
			// inside sec radius 
      let lerpFactor = map(this.distFromCenter, 0, secRadius, 0, 1);
      this.speed = lerp(maxSpeed, secRSpeed, lerpFactor);
    } else if (this.distFromCenter >= hrRadius) {
			// outside hr radius 
      let lerpFactor = map(this.distFromCenter, hrRadius, maxDistance, 0, 1);
      this.speed = lerp(hrRSpeed, minSpeed, lerpFactor);
    } else {
      if (this.distFromCenter < minRadius) {
				// between sec and min radius 
        let lerpFactor = map(this.distFromCenter, secRadius, minRadius, 0, 1);
        this.speed = lerp(secRSpeed, minRSpeed, lerpFactor); 
      } else {
				// between min and hr radius 
        let lerpFactor = map(this.distFromCenter, minRadius, hrRadius, 0, 1);
        this.speed = lerp(minRSpeed, hrRSpeed, lerpFactor); 
      }
    }
    
    this.lifespan = random(2500 * this.speed, 180 / this.speed);
		this.numStoredPos = map(this.lifespan, 2500 * this.speed, 180 / this.speed, minStoredPos, maxStoredPos);
    
    // Initialize previous positions array
    this.previousPositions = [];
  }
  
  update() {
    this.angle += this.speed;  
    this.pos.x = width / 2 + cos(this.angle) * this.distFromCenter;
    this.pos.y = height / 2 + sin(this.angle) * this.distFromCenter;

    this.previousPositions.push(this.pos.copy());
    if (this.previousPositions.length > this.numStoredPos) { 
      this.previousPositions.shift(); 
    }
    
    this.lifespan -= 1;
  }
  
  display() {
    noStroke();
		
    // tail 
    for (let i = 0; i < this.previousPositions.length; i++) {
      let alpha = map(i, 0, this.previousPositions.length, minTrailAlpha, maxTrailAlpha);
			let r = map(i, 0, this.previousPositions.length, 0, this.size);
      fill(255, alpha);
      ellipse(this.previousPositions[i].x, this.previousPositions[i].y, r);
    }
		
    // head 
    fill(255);
    ellipse(this.pos.x, this.pos.y, this.size);
  }
  
  isFinished() {
    return this.lifespan < 0;
  }
}