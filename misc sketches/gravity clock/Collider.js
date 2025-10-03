class Collider {
  constructor(x, y, txt, measure) {
    let options = {
      restitution: 0.5, // bounciness 
      friction: 0.01, 
      frictionAir: 0.025, 
			collisionFilter: {}
    };
		
		if (measure == Measure.SEC) {
      options.collisionFilter.category = secMask;
      options.collisionFilter.mask = 0xFF; // seconds collide with anything 
    } else if (measure == Measure.MIN) {
      options.collisionFilter.category = minMask;
      options.collisionFilter.mask = 0xFF; // minutes collide with anything 
    } else if (measure == Measure.HR) {
      options.collisionFilter.category = hrMask;
			// hours collide with other numbers and hour ground 
      options.collisionFilter.mask = secMask | minMask | hrMask | hrGroundMask;  
    }

		let r; 
		if (measure == Measure.SEC) {
			r = secRadius; 
		} else if (measure == Measure.MIN) {
			r = minRadius; 
		} else {
			r = hrRadius;
		}
    this.body = Bodies.circle(x, y, r, options);
    this.txt = txt;
		this.measure = measure;
    World.add(world, this.body);
  }
}
