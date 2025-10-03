let cols, rows;
let cell_size = 16; // size of "pixels" in pixels
let brightnessMap = [];
let max_lines_per_cell = 5; 
let min_lines = 0; 
let block_size = 4; 
let brightnessBlocks = [];
let max_length = 3; // max cells away for endpoint selection
let bright_thresh = 0.9; 
let dark_thresh = 0.4;
let totalBrightness = 0;
let numBlocks = 0;
let avgBrightness = 0;

// i am so sorry about the poor style choices in this code 

function setup() {
  createCanvas(640, 480);
  cols = width / cell_size;
  rows = height / cell_size;
  pixelDensity(1);
  video = createCapture(VIDEO);
  video.size(cols, rows);
  video.hide();
	frameRate(45);
}

function draw() {
  video.loadPixels();
  // background(0);
	background(0,0,0,80);

  calculateBrightnessMap();
	calculateBrightnessBlocks(); 
  drawLines(); 
}

function calculateBrightnessMap() {
  brightnessMap = [];
  for (let i = 0; i < cols; i++) {
    brightnessMap[i] = [];
    for (let j = 0; j < rows; j++) {
      let loc = ((cols - i - 1) + j * cols) * 4; // mirror image
      let r = video.pixels[loc];
      let g = video.pixels[loc + 1];
      let b = video.pixels[loc + 2];
      let brightness = (r + g + b) / 3; 
      brightnessMap[i][j] = map(brightness, 0, 255, 0, 1);
    }
  }
}

function calculateBrightnessBlocks() {
  brightnessBlocks = [];
  totalBrightness = 0;
  numBlocks = 0;

  for (let i = 0; i < cols; i += block_size) {
    let colBlocks = [];
    for (let j = 0; j < rows; j += block_size) {
      let blockBrightness = 0;
      let cellsInBlock = 0;

      for (let x = 0; x < block_size; x++) {
        for (let y = 0; y < block_size; y++) {
          let cellCol = i + x;
          let cellRow = j + y;
          if (cellCol < cols && cellRow < rows) {
            blockBrightness += brightnessMap[cellCol][cellRow];
            cellsInBlock++;
          }
        }
      }

      blockBrightness /= cellsInBlock; 
      colBlocks.push(blockBrightness);
      totalBrightness += blockBrightness;
      numBlocks++;
    }
    brightnessBlocks.push(colBlocks);
  }

	avgBrightness = totalBrightness / (cols*rows);
}

function drawLines() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
			let num_lines = floor(map(brightnessMap[i][j], 0, 1, min_lines, max_lines_per_cell));
			let clr = map(brightnessMap[i][j], 0, 1, 100, 255);
			
			if (brightnessMap[i][j] > bright_thresh) {
				clr = 255;
				num_lines = floor(map(brightnessMap[i][j], 0, 1, max_lines_per_cell, 2*max_lines_per_cell));
			} else if (brightnessMap[i][j] < dark_thresh) {
				clr = 80; 
				num_lines = floor(map(brightnessMap[i][j], 0, 1, 0, min_lines));
		  } 
      for (let l = 0; l < num_lines; l++) {
        let targetFound = false;
        let attempts = 0;

        while (!targetFound && attempts < 5) {
          let offsetX = floor(random(-max_length, max_length + 1));
          let offsetY = floor(random(-max_length, max_length + 1));
          let targetCol = i + offsetX;
          let targetRow = j + offsetY;
					
      		let startX = i * cell_size + cell_size / 2;
      		let startY = j * cell_size + cell_size / 2;

          // valid target? in bounds and bright enough 
          if (
            targetCol >= 0 && targetCol < cols &&
            targetRow >= 0 && targetRow < rows &&
            brightnessMap[targetCol][targetRow] > 0.2
          ) {
            targetFound = true;

            let endX = targetCol * cell_size + cell_size / 2;
            let endY = targetRow * cell_size + cell_size / 2;
						stroke(clr,clr,clr);
						line(startX, startY, endX, endY);
						if (brightnessMap[i][j] > 1 - (bright_thresh/2)) {
							fill(255, 255, 255, 75); 
							ellipse(startX, startY, map(brightnessMap[i][j], 1 - (bright_thresh/2), 1, 0, 4));
							noFill();
						}
						
						
            // calculate midpoint / curve 
            let midX = (startX + endX) / 2;
            let midY = (startY + endY) / 2;

            let nearestBrightBlockX = 0;
            let nearestBrightBlockY = 0;
            let minDist = Infinity;

            for (let bx = 0; bx < brightnessBlocks.length; bx++) {
              for (let by = 0; by < brightnessBlocks[bx].length; by++) {
                if (brightnessBlocks[bx][by] > totalBrightness / numBlocks) { 
                  let blockCenterX = bx * block_size * cell_size + (block_size * cell_size) / 2;
                  let blockCenterY = by * block_size * cell_size + (block_size * cell_size) / 2;
                  let distance = dist(midX, midY, blockCenterX, blockCenterY);
                  if (distance < minDist) {
                    minDist = distance;
                    nearestBrightBlockX = blockCenterX;
                    nearestBrightBlockY = blockCenterY;
                  }
                }
              }
            }

            let controlX = midX + (nearestBrightBlockX - midX) * 0.2;
            let controlY = midY + (nearestBrightBlockY - midY) * 0.2;

            stroke(255);
            noFill();
            beginShape();
            vertex(startX, startY);
            quadraticVertex(controlX, controlY, endX, endY);
            endShape();
						
          } 
						
          attempts++;
        }
      }
    }
  }
}