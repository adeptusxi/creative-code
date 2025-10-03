class Magnet {
  constructor(text) {
    this.text = text;
    this.width = textWidth(this.text) + magnetWidthPadding * 2;
    let overlapping = true;
		let i = 0;
    while (overlapping) {
      this.x = random(this.width + padding, width - this.width - padding);
      this.y = random(dividerY + magnetHeight + padding, height - magnetHeight - padding);
      overlapping = false;
      for (let otherMagnet of magnets) {
        if (this.intersects(otherMagnet)) {
          overlapping = true;
          break; 
        }
      }
			i++;
			if (i >= maxPlacementAttempts) break;
    }
		this.targetX = this.x; 
		this.targetY = this.y;
    this.dragging = false;
    this.offsetX = 0;
    this.offsetY = 0;
    this.rotation = random(-maxRotation, maxRotation); 
  }
	
	update() {
		if (mouseIsDragging) this.handleCollision();
		if (this.x == this.targetX && this.y == this.targetY) return;
		this.x = lerp(this.x, this.targetX, moveSpeed);
		this.y = lerp(this.y, this.targetY, moveSpeed);
	}
  
  display() {
		// shadow side 
    fill(shadowColor);
    noStroke();
		shadow(true, 5);
    push();
			translate(this.x + this.width / 2 + magnetThickness, this.y + magnetHeight / 2 + magnetThickness); // Move to magnet's center
			rotate(radians(this.rotation)); 
			rect(0, 0, this.width, magnetHeight); 
    pop();
		
		// top side 
		fill(magnetColor);
		push();
			translate(this.x + this.width / 2, this.y + magnetHeight / 2); 
			rotate(radians(this.rotation)); 
			rect(0, 0, this.width, magnetHeight); 
		pop();
    
		// text 
    fill(textColor);
		shadow(false);
    push();
			translate(this.x + this.width / 2, this.y + magnetHeight / 2); 
			rotate(radians(this.rotation)); 
			text(this.text, 0, 0); 
    pop();
  }
  
	resetTargetPosition() {
		this.targetX = this.x; 
		this.targetY = this.y;
	}
	
	contains(px, py) {
		// TODO: fix 
		// (px,py) in terms of magnet's coordinate system 
		let centerX = px - (this.x + this.width / 2);
		let centerY = py - (this.y + magnetHeight / 2);

		// rotate opposite to magnet's rotation 
		let cosRot = cos(-radians(this.rotation));
		let sinRot = sin(-radians(this.rotation));
		let rotatedX = centerX * cosRot - centerY * sinRot;
		let rotatedY = centerX * sinRot + centerY * cosRot;

		return (
			rotatedX > -this.width / 2 
			&& rotatedX < this.width / 2 
			&& rotatedY > -magnetHeight / 2 
			&& rotatedY < magnetHeight / 2
		);
	}
  
  intersects(other) {
		return !(this.x + this.width < other.x || 
             this.x > other.x + other.width || 
             this.y + magnetHeight < other.y || 
             this.y > other.y + magnetHeight);
  }
	
  handleCollision(draggedMagnet, deltaX, deltaY) {
    if (!mouseIsPressed) return;

    for (let otherMagnet of magnets) {
      if (this == otherMagnet || draggedMagnet == otherMagnet) continue;

      if (this.intersects(otherMagnet)) {
				otherMagnet.x += deltaX; 
				otherMagnet.y += deltaY;
        otherMagnet.resetTargetPosition()

        otherMagnet.handleCollision(this, deltaX, deltaY);
      }
    }
  }
}
