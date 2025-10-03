function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(0);
  noStroke(); 
  noLoop(); 
	
	let h = random(0, 360); 
	let s = random(0.3, 0.5); 
	let v = random(0.85, 1); 
	let offset = random(15, 30);

	let randomCol = chroma(h, s, v, "hsv").hex();
	let comp1 = chroma(h + 180 + offset, s, v, "hsv").hex();
	let comp2 = chroma(h + 180 - offset, s, v, "hsv").hex();
  
  fill(randomCol); 
  rect(0,0, width/2, height); 
  
  fill(comp1); 
  rect(width/2,0, width/2, height/2); 
  
  fill(comp2); 
  rect(width/2,height/2, width/2, height/2); 
  
}

function mousePressed(){
  loop();
}