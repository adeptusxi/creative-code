/* description: 
time has physics 
big hour, medium minute, small second 
minutes and seconds share a ground collider, fall at minute change 
hour has its own ground collider, falls at hour change 
*/

const Measure = {
	SEC: "sec", 
	MIN: "min", 
	HR: "hr"
};

// collision categories 
const hrMask = 0x01;
const minMask = 0x02;
const secMask = 0x04; 
const groundMask = 0x08; 
const hrGroundMask = 0x10; 

let Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies;

let engine;
let world;
let colliders  = [];
let ground, hrGround, leftWall, rightWall;
let wallWidth = 5; 
let wallOff = 1; // pixels off screen 
let dropHeight = -30;
let dropRandomization = 5; // x-randomization for second drop position to avoid stacking 
let drawColliders = false;

let bgColor, textColor; 
let txtSpacing = 23;
let secSize = 35; // of text 
let minSize = 110; 
let hrSize = 180; 
let secRadius = 16; // of collider 
let minRadius = 45;
let hrRadius = 75;

let prevSec, prevMin, prevHr;

let fallTime = 1; // seconds to remove ground for minute rollover 
let t = 0; 
let clearingMin = false;
let clearingHr = false;

function setup() {
  createCanvas(640, 640);
	
	bgColor = color(0); 
	textColor = color(255);
	textFont('Monaco');

  engine = Engine.create();
	engine.world.gravity.y = 1.5;
  world = engine.world;

  // wall colliders 
  let options = {
    isStatic: true
  };
  leftWall = Bodies.rectangle(wallWidth/2 - wallOff, height / 2, wallWidth + wallOff, height, options);
  World.add(world, leftWall);
  rightWall = Bodies.rectangle(width - wallWidth/2 + wallOff, height / 2, wallWidth + wallOff, height, options);
  World.add(world, rightWall);
	
	hrGround = Bodies.rectangle(width / 2, height - wallWidth/2 + wallOff, width, wallWidth + wallOff, {
		isStatic: true, 
		collisionFilter: {
			category: hrGroundMask, 
			mask: hrMask
		}
	});
	World.add(world, hrGround);
  ground = Bodies.rectangle(width / 2, height - wallWidth/2 + wallOff, width, wallWidth + wallOff, {
		isStatic: true, 
		collisionFilter: {
			category: groundMask, 
			mask: secMask | minMask
		}
	});
  World.add(world, ground);

	prevSec = second();
	prevMin = minute(); 
	prevHr = hour();

	// for (let i = 1; i < second(); i++) {
	// 	addObject(i+"", Measure.SEC); 
	// }
	addObject(second()+"", Measure.SEC); 
	addObject(minute()+"", Measure.MIN); 
	addObject(hour()+"", Measure.HR);
}

function draw() {
  background(bgColor);
  Engine.update(engine);
	
	let S = second(); 
	let M = minute(); 
	let H = hour(); 
	if (S != prevSec) {
		addObject(second()+"", Measure.SEC); 
		if (clearingMin) {
			t++; 
			if (t >= fallTime) {
				World.add(world, ground);
				clearingMin = false;
				t = 0;
				if (clearingHr) {
					World.add(world, hrGround);
					clearingHr = false;
				}
			}
		}
		if (S == 0 && M != prevMin) {
			// minute rollover 
			World.remove(world, ground);
			clearingMin = true;
			addObject(minute()+"", Measure.MIN); 
			prevMin = M;
		}
		if (minute() == 0 && H != prevHr) {
			// hour rollover 
			World.remove(world, hrGround); 
			clearingHr = true;
			addObject(hour()+"", Measure.HR); 
			prevHr = H;
		}
		prevSec = S; 
	}
	
  if (drawColliders) drawWalls();
	drawObjects();
}

function addObject(str, measure) {
	let startX;
	if (measure == Measure.SEC) {
		startX = width - width/4 - (str.length * 20) / 2;
		startX += random(-dropRandomization, dropRandomization);
	} else if (measure == Measure.MIN) {
		startX = width / 2 - (str.length * 20) / 2;
	} else {
		startX = width/4 - (str.length * 20) / 2;
	}
	
	for (let i = 0; i < str.length; i++) {
		let x = startX + i * txtSpacing;
		let y = dropHeight;
		colliders.push(new Collider(x, y, str.charAt(i), measure));
	}
}

function removeObjects(measure) {
	for (let i = colliders.length - 1; i >= 0; i--) {
		if (colliders[i].measure == measure) {
			World.remove(world, colliders[i].body);
			colliders.splice(i, 1);
		}
	}
}

function drawWalls() {
	fill(textColor);
  noStroke();
  rectMode(CENTER);
  rect(ground.position.x, ground.position.y, width, wallWidth);
  rect(leftWall.position.x, leftWall.position.y, wallWidth, height);
  rect(rightWall.position.x, rightWall.position.y, wallWidth, height);
}

function drawObjects() {
  for (let i = 0; i < colliders.length; i++) {
    let pos = colliders[i].body.position;
    let angle = colliders[i].body.angle;
		let txtSize, radius;
		if (colliders[i].measure == Measure.SEC) {
			txtSize = secSize; 
			radius = secRadius;
		} else if (colliders[i].measure == Measure.MIN) {
			txtSize = minSize; 
			radius = minRadius; 
		} else {
			txtSize = hrSize; 
			radius = hrRadius;
		}
    
		// colliders 
		if (drawColliders) {
			push();
				translate(pos.x, pos.y);
				rotate(angle);
				stroke(255, 0, 0);
				noFill();
				ellipse(0, 0, radius * 2);
			pop();
		}
    
    // numbers  
    push();
			translate(pos.x, pos.y + txtSize/12);
			rotate(angle);
			fill(255);
			textSize(txtSize);
			textAlign(CENTER, CENTER);
			text(colliders[i].txt , 0, 0);
    pop();
  }
}