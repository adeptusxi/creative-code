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
		this.hollowCirc = random([true, false]);
		
		this.targetYAccent = random(-this.width, this.height + this.width);
		this.easingFuncAccent = random(easingFuncs10);
		
    this.targetY30 = random(this.height - this.height * 0.3);
		this.easingFunc30 = random(easingFuncs30);
		
		this.targetY10 = random(this.height - this.height * 0.3);
		this.easingFunc10 = random(easingFuncs10);
	}
	
  display() {
		// // background 
		// fill(bg60 ? col60 : col30);
		// rect(this.x, 0, this.width, this.height);
		
		// secondary + connecting curves 
		fill(bg60 ? col30 : col60);
		let fullCurve = this.width/2;
		rect(this.x, this.y30, this.width, this.height * (bg60 ? 0.3 : 0.6), this.width/2)
		
		// accents 
		// fill secondary 
		if (!this.solid) {
			fill(bg60 ? col60 : col30); 
			rect(this.x + this.width/4, this.y30 + this.width/4, this.width/2, this.height * (bg60 ? 0.3 : 0.6) - this.width / 2, this.width/2);
		}

		// accent color 
		fill(col10);
		rect(this.x, this.y10, this.width, this.height * 0.1, this.width/2);
		
		// little accents 
		fill(bg60 ? col60 : col30); 
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
	
	displayConnectors(prevSlider) {
		fill(bg60 ? col30 : col60);
		let curveTL = true;
		let curveTR = true; 
		let curveBR = true; 
		let curveBL = true;
		if (prevSlider) {
			let thisTop = this.y30;
  		let thisBottom = this.y30 + this.height * 0.3;
			let prevTop = prevSlider.y30;
			let prevBottom = prevSlider.y30 + prevSlider.height * 0.3;

			if (prevBottom < thisTop || prevTop > thisBottom) {
				// no overlap 
			} else {
				// bottom connection 
				if (abs(prevBottom - thisBottom) < min(this.width/2, prevSlider.width/2)) {
					// bottoms aligned 
					beginShape(); 
						vertex(this.x, thisBottom); 
						vertex(this.x, thisBottom - this.width/2);
						vertex(prevSlider.x + prevSlider.width/2, prevBottom - prevSlider.width/2);
						vertex(prevSlider.x + prevSlider.width/2, prevBottom); 
					endShape(CLOSE);
					curveBL = false;
				} else if (prevBottom < thisBottom) {
					// current bottom is below previous bottom 
					beginShape();
						vertex(prevSlider.x + prevSlider.width/2, prevBottom); // top L corner
						bezierVertex(this.x, prevBottom, // 90 deg corner as control
												 this.x, prevBottom, 
												 this.x, thisBottom - this.width/2); // bottom R corner 
						vertex(this.x, prevBottom); // 90 deg corner 
						vertex(this.x, prevBottom - prevSlider.width/2); // fill in prev corner 
					endShape(CLOSE);
				} else {
					// current bottom is above previous bottom 
					beginShape();
						vertex(this.x + this.width/2, thisBottom); // top R corner 
						bezierVertex(this.x, thisBottom, // 90 deg corner as control 
												 this.x, thisBottom, 
												 this.x, prevBottom - prevSlider.width/2) // bottom L corner
						vertex(this.x, thisBottom); // 90 deg corner 
					endShape(CLOSE);
					curveBL = false;
				}

				// top connection
				if (abs(prevTop - thisTop) < min(this.width/2, prevSlider.width/2)) {
					// tops aligned 
					beginShape(); 
						vertex(this.x, thisTop); 
						vertex(this.x, thisTop + this.width/2);
						vertex(prevSlider.x + prevSlider.width/2, prevTop + prevSlider.width/2);
						vertex(prevSlider.x + prevSlider.width/2, prevTop); 
					endShape(CLOSE);
					curveTL = false;
				} else if (prevTop > thisTop) {
					// current top is above previous top 
					beginShape();
						vertex(this.x, thisTop + this.width/2); // top R corner
						// vertex(prevSlider.x + prevSlider.width/2, prevTop); // bottom L corner 
						bezierVertex(this.x, prevTop, // 90 deg corner as control 
												 this.x, prevTop, 
												 prevSlider.x + prevSlider.width/2, prevTop); // bottom L corner 
						vertex(this.x, prevTop + prevSlider.width/2); // fill in prev corner
						vertex(this.x, prevTop); // 90 deg corner 
					endShape(CLOSE);
				} else {
					// current top is below previous top 
					beginShape();
						vertex(this.x, prevTop + prevSlider.width/2); // top L corner 
						bezierVertex(this.x, thisTop, // 90 deg corner as control 
												 this.x, thisTop, 
												 this.x + this.width/2, thisTop); // bottom R corner 
						vertex(this.x, thisTop); // 90 deg corner 
					endShape(CLOSE);
					curveTL = false;
				}
			}
		}
		fill(bg60 ? col30 : col60); // remove
		let fullCurve = this.width/2;
		rect(this.x, 
			this.y30, 
			this.width, 
			this.height * (bg60 ? 0.3 : 0.6), 
			// corner radii [tl], [tr], [br], [bl]
			curveTL ? fullCurve : 0, 
			curveTR ? fullCurve : 0, 
			curveBR ? fullCurve : 0, 
			curveBL ? fullCurve : 0);
	}
}