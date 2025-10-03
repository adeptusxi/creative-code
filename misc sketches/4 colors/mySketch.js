/*
which color interpolation technique did you use and why?
chroma.js's bezier curve because it's smooth 
*/

function setup() {
  createCanvas(400, 200);
  noLoop();
}

function draw() {
  background(0);
  let border = 40;
	let radius = 40;
	
	let color1 = chroma(192, 0.5083, 0.9412, "hsv");
	let color2 = chroma(129.71, 0.5784, 1, "hsv");
	let color3 = chroma(30.24, 0.592, 1, "hsv");
	let color4 = chroma(7.83, 0.5314, 1, "hsv"); 
	let colors = [color1, color2, color3, color4];
	let colorCurve = chroma.bezier(colors).scale().mode('lab');
	for (let i = border; i < width - border; i++) {
		let curveIdx = map(i, border, width - border, 0, 1);
		stroke(colorCurve(curveIdx).hex());
		line(i, height/2 + border/2, i, 3*height/4);
	}
	
	noStroke();
	for (let i = 0; i < colors.length; i++) {
		fill(colors[i].hex()); 
		ellipse(map(i, 0, colors.length - 1, border + radius/2, width - border - radius/2), height/2 - border/2, radius);
	}
}
