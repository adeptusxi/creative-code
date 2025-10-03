function setup() {
	createCanvas(400, 400);
	noStroke();
	background(100);
	rectMode(CENTER);
}

function draw() {
	fill('white');
	let spacing = 50;
	for (let i = 0; i < 10; i++) {
		for (let j = 0; j < 10; j++) {
			let x = j * spacing;
			if (i%2 == 1) x += spacing/2;
			let y = i * spacing * sqrt(3)/2;
			rect(x,y,10);
		}
	}
}