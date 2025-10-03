// no animation 

// let cellsAcross = 6;
// let gridSpacing;
// let cols = []; 
// let rows = [];

// let backgroundColor; 
// let patternColor;
// let textColor;

// function setup() {
//   createCanvas(640, 640);	
// 	gridSpacing = width/(cellsAcross + 2);
// 	initColors();
// 	initPattern();
	
//   stroke(0);
// 	rectMode(CENTER);
// }

// function draw() {
// 	push();
// 		translate(gridSpacing, gridSpacing);
// 		background(backgroundColor);
// 		initPattern();
// 		drawLines();
// 	pop();
// }

// function initColors() {
// 	backgroundColor = color('black');
// 	patternColor = color('white');
// 	textColor = color('white');
// }

// function initPattern() {
//   cols = getTimeBinary(minute()); 
//   rows = getTimeBinary(second()); 
// }

// function getTimeBinary(timeValue) {
//   let bits = [];
//   for (let i = 5; i >= 0; i--) {
//     bits.push((timeValue >> i) & 1); 
//   }
//   return bits;
// }

// function writeNumbers() {
// 	fill(textColor);
// 	noStroke();
// 	for (let i = 0; i < cols.length; i++) {
// 		text(cols[i], i * gridSpacing, -gridSpacing/2);
// 	}
// 	for (let i = 0; i < rows.length; i++) {
// 		text(rows[i], -gridSpacing/2, i * gridSpacing);
// 	}
// }

// function drawLines() {
// 	strokeWeight(5);
// 	stroke(patternColor);
	
//   for (let x = 0; x < cols.length; x++) {
//     let start = cols[x] * gridSpacing;
//     for (let y = start; y < height - gridSpacing*2; y += gridSpacing*2) {
//       line(x * gridSpacing, y, x * gridSpacing, y + gridSpacing);
//     }
//   }

//   for (let y = 0; y < rows.length; y++) {
//     let start = rows[y] * gridSpacing;
//     for (let x = start; x < width - gridSpacing*2; x += gridSpacing*2) {
//       line(x, y * gridSpacing, x + gridSpacing, y * gridSpacing);
//     }
//   }
// }