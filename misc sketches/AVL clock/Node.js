class Node {
  constructor(val, measure, x, y) {
    this.value = val;
    this.left = null;
    this.right = null;
    this.x = x;
    this.y = y;
    this.targetX = 0;
    this.targetY = 0;
    this.height = 1;
		this.measure = measure; // sec, min, or hr 
		this.animProgress = 0;
		this.rAnimProgress = 0; // for radius shrink
		this.shrinking = false;
  }

  // animation 
  moveToTarget() {
		this.animProgress = constrain(this.animProgress + animSpeed, 0, 1);
		if (this.animProgress >= 0.5) this.shrinking = true;
		if (this.shrinking) {
			this.rAnimProgress = constrain(this.rAnimProgress + 2*animSpeed, 0, 1);
			if (this.rAnimProgress == 1) this.shrinking = false;
		}
		
		let lerpVal = easer.doubleCubicOgee(this.animProgress, 0.005, 0.002);
		// let lerpVal = easer.doubleCubicOgeeSimplified(this.animProgress, 0.001, 0.75);
    
		this.x = lerp(this.x, this.targetX, lerpVal);
		this.y = lerp(this.y, this.targetY, lerpVal);
	}

  display(newestNode) {
    this.moveToTarget();

    // lines to children
		stroke(strokeColor);
    if (this.left) {
			strokeWeight(1);
      line(this.x, this.y, this.left.x, this.left.y);
      this.left.display(newestNode);
    }
    if (this.right) {
			strokeWeight(1);
      line(this.x, this.y, this.right.x, this.right.y);
      this.right.display(newestNode);
    }
    
    // current node  
		let r;
    if (this.measure == Measure.SEC) {
			fill(secColor);
			r = secNodeRadius;
		} else if (this.measure == Measure.MIN) {
			fill(minColor);
			r = minNodeRadius;
		} else {
			fill(hrColor);
			r = hrNodeRadius;
		}
		if (this.measure == Measure.SEC) r = map(this.rAnimProgress, 0, 1, r*newRadiusFactor, r);
		textSize(map(this.rAnimProgress, 0, 1, r*nodeTextSize, r*nodeTextSize));
		strokeWeight(0);
    ellipse(this.x, this.y, r, r);
		// only display hour, minute, and newest second 
		if (DEBUG
				|| (this.value == newestNode)
			  || (this.measure != Measure.SEC)) {
			fill(txtColor);
			if (this.measure != Measure.SEC) fill(secColor);
    	textAlign(CENTER, CENTER);
    	text(this.value, this.x, this.y);
		}
  }
}