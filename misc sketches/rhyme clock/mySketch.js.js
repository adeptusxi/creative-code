/* description: 
dubious poems made of the previous, current, and next hour and minute replaced with rhyming words 
randomizes to a new one when minute changes 
some of the rhymes are a stretch TT 
*/

let DEBUG = false; 
let smallTxtSize = 20;
let largeTxtSize = 25;
let verticalOffset = 30; // between lines of text 
let padding = 2; // shift for larger text 
let boldLargeText = true; 
let bgColor, txtColor;

let currMin = 0, currHr = 12; // for manual time (debugging)

function setup() {
  createCanvas(600, 400);
	textFont('Times New Roman'); 
	textAlign(CENTER, CENTER);
	bgColor = color(247, 246, 245);
	txtColor = txtColor = color(23, 17, 12);
	fill(txtColor);
	background(bgColor);
	frameRate(30);

	drawPhrases();
}

function draw() {
	if (DEBUG) {
		debugDraw();
		return;
	}
	if (second() == 0) {
		background(bgColor);
		drawPhrases();
	} 
}

function debugDraw() {
  background(bgColor);
  textAlign(CENTER, CENTER);
  textSize(48);
	
	let h = currHr; 
	let m = currMin;

	textStyle(NORMAL);
	textSize(largeTxtSize);
  text(convertToRhyme(h, m), width / 2, height / 2);
	textSize(15);
	text(nf(h,2) + ":" + nf(m,2), 40, 20);
	noLoop();
}

function mousePressed() {
	if (!DEBUG) return;
	loop();
	currMin = (currMin + 1) % 60;
	if (currMin == 0) {
		currHr = (currHr + 1) % 12;
	}
}

function drawPhrases() {
	textSize(largeTxtSize);
	if (boldLargeText) textStyle(BOLD);

	let h = hour() % 12;
	if (h == 0) h = 12;
	let m = minute();
	text(convertToRhyme(h, m) + ",", width/2, height/2);
		
	textSize(smallTxtSize);
	textStyle(NORMAL);
	let prevH = h;
	let prevM = (m - 1) % 60;
	if (prevM == 59) {
		prevH = (h - 1) % 12; 
		if (prevH == 0) prevH = 12;
	}
	let prevStr = convertToRhyme(prevH, prevM);
	let first = prevStr[0].toUpperCase();
	text(first + prevStr.slice(1), width/2, height/2 - 2*verticalOffset - padding);
	text("precedes", width/2, height/2 - verticalOffset - padding);
		
	let nextH = h; 
	let nextM = (m + 1) % 60; 
	if (nextM == 0) {
		nextH = (h + 1) % 12;
		if (prevH == 0) prevH = 12;
	}
	text(convertToRhyme(nextH, nextM) + ".", width/2, height/2 + 2*verticalOffset + padding);
	text("succeeded by", width/2, height/2 + verticalOffset + padding);
}

function convertToRhyme(h, m) {
	let hourStr = getRhymingWord(h, rhymeAdjectives)
	if (!
				(m >= 10 && m <= 12)
				|| hourStr == "thine" 
				|| hourStr == "your"
		 ) hourStr += ",";
  
  let minuteStr;
	if (m == 0) {
		// 00 -> "oh clock"
		minuteStr = getRhymingWord(0) + " " + getRhymingWord("clock", rhymeNouns);
	} else if (m < 10) {
		// 0_ -> "oh__"
    minuteStr = getRhymingWord(0) + " " + getRhymingWord(m, rhymeNouns); 
  } else if (m >= 10 && m <= 12) {
		// 10, 11, 12 -> direct word 
    minuteStr = getRhymingWord(m, rhymeNouns); 
	} else if (m == 13) {
		// 13 -> "thir-teen"
		minuteStr = getRhymingWord("thir") + " " + getRhymingWord("teen", rhymeNouns);
	} else if (m == 15) {
		// 15 -> "fif-teen"
		minuteStr = getRhymingWord("fif") + " " + getRhymingWord("teen", rhymeNouns);
	} else if (m >= 13 && m <= 19) {
    // 14, 16, 17, 18, 19 -> "__teen"
    minuteStr = getRhymingWord(m % 10) + " " + getRhymingWord("teen", rhymeNouns); 
  } else if (m === 20) {
		// 20 -> "twen-ty"
    minuteStr = getRhymingWord("twen") + " " + getRhymingWord("ty", rhymeNouns);  
  } else if (m > 20 && m < 30) {
		// 2_ -> "twenty__"
    minuteStr = getRhymingWord("twenty") + " " + getRhymingWord(m % 10, rhymeNouns); 
  } else if (m === 30) {
		// 30 -> "thir-ty"
    minuteStr = getRhymingWord("thir") + " " + getRhymingWord("ty", rhymeNouns);  
  } else if (m > 30 && m < 40) {
		// 3_ -> "thirty__"
    minuteStr = getRhymingWord("thirty") + " " + getRhymingWord(m % 10, rhymeNouns); 
  } else if (m === 40) {
		// 40 -> "four-ty"
    minuteStr = getRhymingWord("four") + " " + getRhymingWord("ty", rhymeNouns); 
  } else if (m > 40 && m < 50) {
		// 4_ -> "forty__" 
    minuteStr = getRhymingWord("forty") + " " + getRhymingWord(m % 10, rhymeNouns); 
  } else if (m === 50) {
		// 50 -> "fif-ty"
    minuteStr = getRhymingWord("fif") + " " + getRhymingWord("ty", rhymeNouns);
  } else {
		// 5_ -> "fifty__"
    minuteStr = getRhymingWord("fifty") + " " + getRhymingWord(m % 10, rhymeNouns); 
  }
	
	return fixGrammar(hourStr + " " + minuteStr);
}

function getRhymingWord(num, rhymeWords = rhymeAdjectives) {
  if (num === 0) {
    return rhymeWords["oh"] && rhymeWords["oh"].length > 0 ? random(rhymeWords["oh"]) : "oh";
  }
  let word = timeWords[num] || num; // use actual number in case timeWords element null 
  return rhymeWords[word] && rhymeWords[word].length > 0 ? random(rhymeWords[word]) : word;
}

function fixGrammar(str) {
  let words = str.split(/, | /); // split by " " and ", "
  if (words.includes("your") || words.includes("thine")) {
    str = str.replace(/,/g, '');
  }
	// todo replace "precedes" by "precede" if last word of prev str is plural 
  return str;
}
