class Slider {
  constructor(x, y, w, h, frameOffsetAccent, frameOffset30, frameOffset10) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;

		this.targetYAccent = random(-this.width, this.height + this.width); 
    this.targetY30 = random(-this.height * 0.3, this.height + this.height * 0.3);
    this.targetY10 = random(-this.height * 0.1, this.height + this.height * 0.1);
    
		this.yAccent = this.targetYAccent;
    this.y30 = this.targetY30;
    this.y10 = this.targetY10;

		this.framesCountAccent = frameOffsetAccent;
    this.framesCount30 = frameOffset30;
		this.framesCount10 = frameOffset10;
		this.easingFuncAccent = random(easingFuncs10);
		this.easingFunc30 = random(easingFuncs30);
		this.easingFunc10 = random(easingFuncs10);
		
		this.solid = random(0,1) < solidChance;
		this.bg60 = random([true, false]);
		this.hollowCirc = random([true, false]); // draw the extra lined circle ?
  }

  update() {
		let lerpValAccent = map(this.framesCountAccent, 0, animFrames10, 0, 1);
		let lerpVal30 = map(this.framesCount30, 0, animFrames30, 0, 1);
		let lerpVal10 = map(this.framesCount10, 0, animFrames10, 0, 1);
		this.yAccent = lerp(this.yAccent, this.targetYAccent, easer[this.easingFuncAccent](lerpValAccent));
		this.y30 = lerp(this.y30, this.targetY30, easer[this.easingFunc30](lerpVal30));
    this.y10 = lerp(this.y10, this.targetY10, easer[this.easingFunc10](lerpVal10));
    
		this.framesCountAccent++;
    if (this.framesCountAccent >= animFrames10) {
      this.framesCountAccent = 0;
      this.targetYAccent = random(-this.width, this.height + this.width);
			this.easingFuncAccent = random(easingFuncs10);
    }
		
		this.framesCount30++;
    if (this.framesCount30 >= animFrames30) {
      this.framesCount30 = 0;
      this.targetY30 = random(this.height - this.height * 0.3);
			this.easingFunc30 = random(easingFuncs30);
    }
		
		this.framesCount10++;
    if (this.framesCount10 >= animFrames10) {
      this.framesCount10 = 0;
      this.targetY10 = random(this.height - this.height * 0.3);
			this.easingFunc10 = random(easingFuncs10);
    }
  }
	
	updateDesign() {
		this.solid = random(0,1) < solidChance;
		this.bg60 = random([true, false]);
		this.hollowCirc = random([true, false]);
		
		this.targetYAccent = random(-this.width, this.height + this.width);
		this.easingFuncAccent = random(easingFuncs10);
		
    this.targetY30 = random(this.height - this.height * 0.3);
		this.easingFunc30 = random(easingFuncs30);
		
		this.targetY10 = random(this.height - this.height * 0.3);
		this.easingFunc10 = random(easingFuncs10);
	}

  display() {
		fill(this.bg60 ? col60 : col30);
		rect(this.x, 0, this.width, this.height);
		
    fill(this.bg60 ? col30 : col60);
    rect(this.x, this.y30, this.width, this.height * (this.bg60 ? 0.3 : 0.6), this.width/2);
		if (!this.solid) {
			fill(this.bg60 ? col60 : col30); 
			rect(this.x + this.width/4, this.y30 + this.width/4, this.width/2, this.height * (bg60 ? 0.3 : 0.6) - this.width / 2, this.width/2);
		}

    fill(col10);
    rect(this.x, this.y10, this.width, this.height * 0.1, this.width/2);
		
		fill(this.bg60 ? col60 : col30); 
		ellipse(this.x + this.width / 2, this.yAccent, this.width * 0.8);
		rect(this.x, this.yAccent + this.height/3, this.width, this.height * 0.025);
		rect(this.x, this.yAccent + this.height/3 + this.height/10, this.width, this.height * 0.01);
		
		if (this.hollowCirc) {
			fill(col60); 
			ellipse(this.x + this.width / 2, this.y10 + this.height/2, this.width * 0.8);
			fill(col10); 
			ellipse(this.x + this.width / 2, this.y10 + this.height/2, this.width * 0.5);
		}
  }
}