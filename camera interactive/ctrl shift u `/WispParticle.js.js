class WispParticle {
  constructor(chasePoint) {
    this.pos = createVector(random(width), random(height)); // position 
    this.v = createVector(0, 0);							// velocity 
    this.displace = createVector(0, 0);				// position shift 
    this.chaser = this.pos.copy();						// previous position 
    this.isChaser = random() > 0.5;						// follows point?
		this.hue = 0;															// position between color1 and color2
		this.hueShift = 1; 												// phase of color lerp
		this.r = wisp.c1r;												// color 
		this.g = wisp.c1g; 
		this.b = wisp.c1b;
		this.targetPt = chasePoint;								// chase point (index of body keypoints)
		this.targetVel = createVector(0,0);				// chase point velocity 
		this.targetCurr = createVector(0,0);			// chase point position 
		this.targetChaser = createVector(0,0);		// chase point previous position
  }
	
	draw() {
		this.handleVelocity();
		this.updateDisplacement();
		this.shiftPosition();
		this.checkEdges();
		this.updateColor();
		this.drawLine();
	}
	
	/************ update ************/

  shiftPosition() {
		if (this.isChaser) {
			this.isChaser = random() > 0.25;
		} else {
			this.isChaser = random() > 0.5;
		}
    this.v.add(this.displace);
    if (this.chase()) {
      this.v.limit(wisp.maxChaserSpeed);
    } else {
      this.v.limit(wisp.maxSpeed);
    }
    this.pos.add(this.v);
    this.displace.mult(0);
  }
	
	checkEdges() {
		if (this.pos.x > width) {
    	this.pos.x = 0;
  		this.updateChaser();
    }
    if (this.pos.x < 0) {
      this.pos.x = width;
      this.updateChaser();
    }
    if (this.pos.y > height) {
      this.pos.y = 0;
      this.updateChaser();
    }
    if (this.pos.y < 0) {
      this.pos.y = height;
      this.updateChaser();
    }
	}

  updateDisplacement() {
    let x = floor(this.pos.x / wisp.step);
    let y = floor(this.pos.y / wisp.step);
    let index = x + y * cols;
    let force = grid[index];
    if (this.chase()) {
			let target = p5.Vector.sub(createVector((bodies[0].keypoints)[this.targetPt].x*xscale, (bodies[0].keypoints)[this.targetPt].y*yscale), this.pos); 
      target.limit(wisp.maxChaserSpeed);
      force = p5.Vector.sub(target);
    } 
    this.displace.add(force); 
  }
	
	updateColor() {
		this.hue += (this.hueShift * wisp.hueShiftSpeed);
		if (this.hue == 100 || this.hue == 0) this.hueShift *= -1;
		this.r = map(this.hue, 0, 100, wisp.c1r, wisp.c2r);
		this.g = map(this.hue, 0, 100, wisp.c1g, wisp.c2g);
		this.b = map(this.hue, 0, 100, wisp.c1b, wisp.c2b);
	}
	
	drawLine() {
		stroke(this.r,this.g,this.b, wisp.particleOpacity);
    strokeWeight(wisp.particleWidth);
    line(this.pos.x, this.pos.y, this.chaser.x, this.chaser.y);
    this.updateChaser();
	}

	/************ helpers ************/
  updateChaser() {
    this.chaser.x = this.pos.x;
    this.chaser.y = this.pos.y;
  }
	
	chase() {
		return this.isChaser && bodies.length > 0 && (this.targetVel).mag() > wisp.chaseSpeedThreshold;
	}
	
	handleVelocity() {
		if (bodies.length > 0) {
			let aBody = bodies[0];
			let pts = aBody.keypoints;
			this.targetChaser = this.targetCurr.copy();
			//this.targetCurr = createVector(pts[this.targetPt].x*xscale, pts[this.targetPt].y*yscale);
			this.targetCurr = createVector(getX(this.targetPt), getY(this.targetPt));
		} 
		this.targetVel = createVector(this.targetCurr.x - this.targetChaser.x, this.targetCurr.y - this.targetChaser.y);
		if (abs(this.targetVel.x) < wisp.motionStability) this.targetVel.x = 0;
		if (abs(this.targetVel.y) < wisp.motionStability) this.targetVel.y = 0;
	}

}