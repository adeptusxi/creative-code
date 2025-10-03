// function setup() {
//   createCanvas(450, 300);
//   noStroke();
//   noLoop();
// }

// function draw() {
//   background("black");
//   let nSteps = 100;
// 	let W = width
// 	let dy = 80; 
// 	// let myColors = [ "#344E5C","#4AB19D","#EF3D59","#EFC958"]
// 	let color1 = "#06e0ff";
// 	let color2 = "#d0ffce";
// 	let color3 = "#ffd9b7"; 
// 	let color4 = "#ff97aa"; 
// 	let myColors = [color1, color2, color3, color4];
//   for (let i = 0; i < myColors.length ; i++) {
//     let x = i * width/4;
// 		fill(myColors[i])
//     rect(x+10, 50, width/4-15, 80);
//   }

//   let scale = chroma.bezier(myColors).scale().correctLightness().mode('oklab');
// 	for (let i=0; i<nSteps; i++){
      
//       let x = map(i, 0,nSteps, 0,W); 
// 		  let t = map(i, 0,nSteps-1, 0,1); 
//       let y = height/2; 
//       let col = scale (t);
//       // Draw the color chip for this step
//       noStroke(); 
//       fill(col.hex());
//       rect(x,y, W/nSteps+1,dy-1);
      
//       // // Draw the luminance of this step
//       // stroke(255); 
//       // let px = map(i,0,nSteps,W,500);
//       // let dx = (500-W)/nSteps;
//       // let py = map(col.get('lab.l'),0,100, dy,0) + y; 
//       // line(px,py,px+dx,py); 
//     }
// }
