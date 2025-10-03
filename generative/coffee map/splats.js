let minSplats = 3;
let maxSplats = 7;
let minDots = 5;
let maxDots = 20;

let splatColor;
let minSplatRadius = 30;
let maxSplatRadius = 80;
let minVertices = 30; 
let maxVertices = 40;
let minDotRadius = 5;
let maxDotRadius = 20;

let splats = [];

class Splat {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.numVertices = int(random(minVertices, maxVertices));
    this.splatRadius = random(minSplatRadius, maxSplatRadius);
    this.vertices = this.generateVertices();
  }

  generateVertices() {
    let vertices = [];
    for (let i = 0; i < this.numVertices; i++) {
      let angle = map(i, 0, this.numVertices, 0, TWO_PI);
      let r = this.splatRadius + randomGaussian(0, this.splatRadius / 5);
      r = max(r, this.splatRadius * 0.85);
      let x = r * cos(angle);
      let y = r * sin(angle);
      vertices.push(createVector(x, y));
    }
    return vertices;
  }

  draw() {
		fill(splatColor);
		stroke(0.9*red(splatColor), 0.9*green(splatColor), 0.9*blue(splatColor), alpha(splatColor));
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
  }
}