// copy of original forked file

// // Seamless looping GIF generator with p5.createloop and p5.func
// // Be sure that the following scripts are included.
// //
// // To add p5.createloop, open Library in the Sketch tab 
// // of OpenProcessing, then paste in this URL: 
// // https://unpkg.com/p5.createloop@0.3.1/dist/p5.createloop.js
// //
// // To add p5.func, open Files in the Sketch tab, 
// // Upload a copy of the following file
// // then add p5.func.js to the Libraries 
// // https://raw.githubusercontent.com/IDMNYU/p5.js-func/master/lib/p5.func.js

// var myEaser;
// function setup() {
// 	createCanvas(640, 640);
// 	frameRate(30);
// 	pixelDensity(1);

// 	// Here, change gif:false to true in order to export the GIF!!!!!
// 	createLoop({
// 		duration: 4,
// 		gif:false
// 	});
// 	animLoop.noiseFrequency(0.45);
// 	myEaser = new p5.Ease();
// }


// //------------------------------------------
// function draw() {
// 	background("dodgerBlue");
// 	noStroke();
	
// 	// Use p5.createloop's animLoop.theta as a periodic angle
// 	let radius = width * 0.25; 
// 	let px = width/2 + cos(animLoop.theta) * radius;
//   let py = height/2 + sin(animLoop.theta) * radius;
// 	fill('black'); 
// 	circle(px, py, width*0.5); 

// 	// Use p5.createloop's animLoop.noise1D() to generate periodic noise 
// 	// between -1 and 1, just like a sine wave!
// 	let seedOne = 1234; // these numbers can be anything
// 	let seedTwo = 5555; // but if they are very close together
// 	let seedThree = 3456; // the signals will correlate
// 	let nx = map(animLoop.noise1D(seedOne), -1, 1, 0, width);
// 	let ny = map(animLoop.noise1D(seedTwo), -1, 1, 0, height);
// 	let nd = map(animLoop.noise1D(seedThree), -1, 1, 80, 320);
// 	fill("white");
// 	circle(nx, ny, nd);
	
	
// 	// Linear movement
// 	let rw = width / 16; 
// 	let ax = map(animLoop.progress, 0,1, 0-rw,width);
// 	fill ("red");
// 	rect(ax,rw*0, rw,rw);
	
// 	// Linear movement, twice as fast & often
// 	let dx = map((animLoop.progress*2)%1, 0,1, 0-rw,width);
// 	fill ("orange");
// 	rect(dx,rw*1, rw,rw);
	
// 	// Simple non-linear movement with pow()
// 	let bx = map(pow(animLoop.progress,1.5), 0,1, 0-rw,width); 
// 	fill ("gold");
// 	rect(bx,rw*2, rw,rw);
	
// 	// Sophisticated non-linear movement with p5.func library
// 	let shaped = myEaser["doubleExponentialSigmoid"](animLoop.progress, 0.7);
// 	let cx = map(shaped, 0,1, 0-rw,width); 
// 	fill ("yellow");
// 	rect(cx,rw*3, rw,rw);
// }