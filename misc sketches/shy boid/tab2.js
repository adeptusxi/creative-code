let flock = [];
let specialBoid;
let numBoids = 100;
let minBoidVelocity = 2;
let maxBoidVelocity = 4;

let specialBoidTrail = [];
let maxTrailLength = 500; // number of points stored 

let border = 50;

function updateAndDrawFlock() {
  for (let b of flock) {
    b.flock(flock);
    b.update();
    b.edges();
    b.render();
  }
	
	let pos = specialBoid.position;
	let speed = specialBoid.velocity.mag();
	let z = map(speed, 0, specialBoid.maxSpeed, zHi, zLo);
  specialBoidTrail.push(createVector(pos.x, pos.y, z));
  if (specialBoidTrail.length > maxTrailLength) {
    specialBoidTrail.shift(); // remove oldest point
  }
}

class Boid {
  constructor(x, y) {
    this.position = createVector(random(width), random(height));
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(minBoidVelocity, maxBoidVelocity));
    this.acceleration = createVector();
    this.maxForce = 0.2;
    this.maxSpeed = 4;

    this.alignmentWeight = 1.5;
    this.cohesionWeight = 1.5;
    this.separationWeight = 1.5;
		this.perceptionRadius = 50;

    this.size = 4; 
    this.color = color(200); 
		this.noiseOffset = random(1000); 
		
		this.bounceOffBoundary = false;
  }

  edges() {
    if (this.position.x > width - border) this.position.x = border;
    if (this.position.x < border) this.position.x = width - border;
    if (this.position.y > height - border) this.position.y = border;
    if (this.position.y < border) this.position.y = height - border;
  }

  align(boids) {
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < this.perceptionRadius) {
        steering.add(other.velocity);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  cohesion(boids) {
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < this.perceptionRadius) {
        steering.add(other.position);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.sub(this.position);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  separation(boids) {
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < this.perceptionRadius) {
        let diff = p5.Vector.sub(this.position, other.position);
        diff.div(d * d);
        steering.add(diff);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  flock(boids) {
    let alignment = this.align(boids).mult(this.alignmentWeight);
    let cohesion = this.cohesion(boids).mult(this.cohesionWeight);
    let separation = this.separation(boids).mult(this.separationWeight);

    this.acceleration.add(alignment);
    this.acceleration.add(cohesion);
    this.acceleration.add(separation);
  }

	update() {
		let n = noise(this.noiseOffset);
		let angle = map(n, 0, 1, -PI, PI);
		let noiseVec = p5.Vector.fromAngle(angle).mult(0.1);
		this.velocity.add(noiseVec);
		this.noiseOffset += 0.01;
		
		this.position.add(this.velocity);
		this.velocity.add(this.acceleration);
		this.velocity.limit(this.maxSpeed);

		if (this.bounceOffBoundary) {
			if (this.position.x < border) { 
				this.position.x = border; this.velocity.x *= -1; 
			} else if (this.position.x > width - border) { 
				this.position.x = width - border; this.velocity.x *= -1; 
			} 
			if (this.position.y < border) { 
				this.position.y = border; this.velocity.y *= -1; 
			} else if (this.position.y > height - border) {
				this.position.y = height - border; this.velocity.y *= -1; 
			}
		}

		this.acceleration.mult(0);
	}

	render() {
		// taken from p5js demo 
		// https://p5js.org/examples/classes-and-objects-flocking/
		let theta = this.velocity.heading() + radians(90);
		fill(this.color);
		noStroke();
		push();
		translate(this.position.x, this.position.y);
		rotate(theta);
		beginShape();
		vertex(0, -this.size * 2);
		vertex(-this.size, this.size * 2);
		vertex(this.size, this.size * 2);
		endShape(CLOSE);
		pop();
	}
}
