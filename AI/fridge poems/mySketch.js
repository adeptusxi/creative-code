let input;
let canvasString = "";
let canvasWords = []; 
let availableWords = [];

let magnets = [];
let maxRotation = 10; 
let magnetTextSize = 15;
let magnetHeight = 35; 
let magnetWidthPadding = 20;
let magnetThickness = 1; // for shadow
let backgroundColor, magnetColor, shadowColor, textColor;
let dividerY = 260;
let padding = 15; // border where magnets can't go 
let moveSpeed = 0.1; // for lerping 
let maxPlacementAttempts = 60; // to try placing without overlap, before placing randomly 

let PING = true;
let DEBUG = false;
const ResponseMode = {
	NONE: 0, 
	GENERATE_MAGNET: 1, 
	COMPLETE_POEM: 2
};
let responseMode = ResponseMode.NONE;
let mouseIsDragging = false;

function setup() {
	createCanvas(600, 400);
	textFont('Times New Roman');
	textAlign(CENTER, CENTER);
	textSize(magnetTextSize);
	rectMode(CENTER);
	
	backgroundColor = color(220, 220, 220); 
	magnetColor = color(245, 247, 247); 
	shadowColor = color(120, 119, 119);
	textColor = color(23, 23, 23);
  
  input = createInput();
	input.attribute("placeholder", "Type magnet word");
  input.position(10, 10);
  
	let responseCompleteButton = createButton('Complete Poem');
	responseCompleteButton.position(10, 40); 
	responseCompleteButton.mousePressed(completePoem);
	
	let responseAddButton = createButton('Generate Magnet'); 
	responseAddButton.position(10, 70);
	responseAddButton.mousePressed(generateMagnet);
}

function draw() {
  background(backgroundColor);
	stroke(0);
	shadow(true, 10);
	line(0, dividerY-1, width, dividerY-1);
	shadow(true, 40, color(28, 27, 27));
	line(0, dividerY-1, width, dividerY-1);
	noStroke();
	shadow(false);
	fill(backgroundColor); 
	rect(width/2, dividerY/2, width, dividerY);

  for (let magnet of magnets) {
    magnet.update();
		magnet.display();
  }
	
	// mouse 
	// if (DEBUG) {
	// 	fill(0);
	// 	text("(" + floor(mouseX) + ", " + floor(mouseY) + ")", 50,30); // mouse info 
	// }
}

function shadow(showShadow, blur = 10, clr = shadowColor) {
	drawingContext.shadowColor = clr; 
	if (showShadow) {
		drawingContext.shadowBlur = blur;
	} else {
		drawingContext.shadowBlur = 0;
	}
}

function mousePressed() {
  for (let magnet of magnets) {
    if (magnet.contains(mouseX, mouseY)) {
      magnet.dragging = true;
      magnet.offsetX = mouseX - magnet.x;
      magnet.offsetY = mouseY - magnet.y;
    }
  }
}

function mouseReleased() {
	mouseIsDragging = false;
  for (let magnet of magnets) {
    magnet.dragging = false;
  }
}

function mouseDragged() {
	mouseIsDragging = true;
  for (let magnet of magnets) {
		if (mouseX < 0 + magnet.width/2 
				|| mouseX > width - magnet.width/2 
				|| mouseY < 0 + magnet.height / 2
				|| mouseY > height - magnet.height / 2) 
			magnet.dragging = false;
    if (magnet.dragging) {
      let deltaX = mouseX - (magnet.x + magnet.offsetX);
      let deltaY = mouseY - (magnet.y + magnet.offsetY);
      
      magnet.x = mouseX - magnet.offsetX;
      magnet.y = mouseY - magnet.offsetY;
			magnet.resetTargetPosition();
			
			magnet.handleCollision(magnet, deltaX, deltaY);
    }
  }
}

function keyPressed() {
	if (keyCode == ENTER) addUserMagnet();
}

function addMagnet(text) {
  let newMagnet = new Magnet(text);
	for (let magnet of magnets) {
		if (magnet.text == text) {
			alert("Magnet already exists.");
			return;
		}
	}
  magnets.push(newMagnet);
  input.value('');
	if (DEBUG) console.log("Added \"" + newMagnet.text + "\" at (" + floor(newMagnet.x) + ", " + floor(newMagnet.y) + ").");
}

function addUserMagnet() {
	let text = input.value().trim();
	if (text) addMagnet(text);
}

function parseCanvas() {
	canvasString = "";
  canvasWords = [];  
  availableWords = [];  
  
  let aboveDivider = magnets.filter(magnet => (magnet.y - magnetHeight / 2) <= dividerY);
  
  // sort by top-down, left-right 
	aboveDivider.sort((a, b) => {
		if (Math.abs(a.y - b.y) <= magnetHeight / 2) {
			// consider as same line 
			return a.x - b.x;
		} else {
			return a.y - b.y;
		}
	});
  
  for (let magnet of aboveDivider) {
		canvasWords.push({word: magnet.text, 
											minX: floor(magnet.x - magnet.width), 
											maxX: floor(magnet.x + magnet.width), 
											y: floor(magnet.y)});
		canvasString = (canvasString == "") ? canvasString + magnet.text : canvasString + " " + magnet.text;
  }
  
  let belowDivider = magnets.filter(magnet => (magnet.y - magnetHeight / 2) > dividerY);
  for (let magnet of belowDivider) {
		availableWords.push({word: magnet.text, 
												 width: floor(magnet.width)});
  }
	  
	if (DEBUG) {
		console.log("On canvas:", canvasWords);
  	console.log("Available words:", availableWords);
	}
}

function updateMagnetPositions(updates) {
  for (let i = 0; i < updates.length; i++) {
    for (let j = 0; j < magnets.length; j++) {
      if (magnets[j].text == updates[i].text) {
        magnets[j].targetX = constrain(updates[i].x, 0, width - magnets[j].width/2 - padding);
        magnets[j].targetY = constrain(updates[i].y, 0, dividerY - magnetHeight - padding);
        break; 
      }
    }
  }
}
