let adjs = ["random", "profound",  "mundane", "beautiful", "concise", "vivid", "lovely", "romantic", "scientific", "mathematical", "philosophical"];

function onGeminiResponse(resp) {
	if (DEBUG) console.log(resp);
}

function generateMagnet() {
	responseMode = ResponseMode.GENERATE_MAGNET;
	parseCanvas();
	
	let geminiPrompt = "";
	let availableString = availableWords.map(item => item.word).join(' ');
	let adj = adjs[floor(random(0, adjs.length))];
	if (canvasString == "" && availableString == "") {
		geminiPrompt = "Respond with a single " + adj + " word. Do not include punctuation."
	} else {
		if (canvasString != "") geminiPrompt += "Here is a sentence: " + canvasString + "\n"; 
		if (availableString != "") geminiPrompt += "Here are some words in no particular order: " + availableString + "\n";
		geminiPrompt +=  ("Respond with one new word which adds " + adj + " meaning to these words.\n"
				+ "If an article is necessary for these words to make sense, respond with that instead of a " + adj + " word. Do not add punctuation.\n"
				+ "Your word should be different from the words I have given you.");
	}
	
	if (DEBUG) console.log("PROMPT (mode " +  responseMode + "): " + geminiPrompt);
	if (PING) askGeminiWithCanvas(geminiPrompt);
}

function completePoem() {
	parseCanvas();
	if (canvasWords.length == 0 && availableWords.length == 0) return;
	
	responseMode = ResponseMode.COMPLETE_POEM;
	let geminiPrompt = 
			"Here is an array canvasWords of structs in the form {word, minX, maxX, y}:\n" 
			+ canvasWords.map(item => `{"${item.word}", ${item.minX}, ${item.maxX}, ${item.y}}`).join(', ') + "\n"
			+ "The words, in order, form a sentence. To be clear, the sentence is \"" + canvasString + "\".\n"
			+ "They are placed on a p5.js canvas, each in a rectangle spanning this.minX to this.maxX horizontally, and this.y-" + magnetHeight/2 + " to this.y+" + magnetHeight/2 + " vertically. The canvas size is " + width + "(width) by " + floor(dividerY) + "(height)" + ".\n"
			+ "Here is an array availableWords of structs in the form {word, width}:\n" 
			+ availableWords.map(item => `{"${item.word}", ${item.width}}`).join(', ') + "\n"
			+ "Each word will be placed onto the canvas at some (x,y), with height " + magnetHeight + " and width specified by the struct instance's width.\n"
			+ "Assume top-down, left-right reading. This means that earlier words should have smaller x's than words on the same line, and smaller y's than words on the next line.\n"
			+ "I want you to respond to the sentence in one of the following ways. Either way, use up all the availableWords and do not use any additional words.\n" 
			+ "If there is space between or around the existing rectangles for the words in availableWords to fit, inside rectangles with their specified widths, fill in the blanks by inserting the words between where each one fits.\n"
			+ "All words should fit within " + padding + " pixels of the canvas boundaries. No (x,y) coordinate should exceed (" + width + ", " + height + ") or be less than (" + padding + ", " + padding + ").\n"
			+ "For each word, select an appropriate y-value relative to the ones you want it to appear next to. For example, if \"am\" should be between \"I\" and \"me\", then its y should be the average of the y's for the \"I\" and \"me\" entries.\n"
			+ "If there is no space for any of the words, or there are some leftover that did not fit, or the sentence I gave you was empty, arrange availableWords in a way that makes as much semantic sense as possible.\n"
			+ "If the canvasWords form an empty sentence, you have free reign over how to arrange the words.\n"
			+ "Give your response in the form \"element0, element1, ..., elementn\", where each element is of the form {word: \"<word>\", x: <x position>, y: <y position>}. They should be separated by a comma and a space.";
	if (DEBUG) console.log("PROMPT (mode " +  responseMode + "): " + geminiPrompt);
	if (PING) askGeminiWithCanvas(geminiPrompt);
}

function onGeminiResponse(resp) {
	if (DEBUG) console.log("\nRESPONSE: " + resp + "\n");
	
	if (responseMode == ResponseMode.COMPLETE_POEM) updateMagnetPositions(parseResponse(resp));
	if (responseMode == ResponseMode.GENERATE_MAGNET) addMagnet((resp.trim()).toLowerCase());
	
	responseMode = ResponseMode.NONE;
}

function parseResponse(resp) {
  // split by curly brackets 
  let elements = resp.split(/\}, \{/).map(item => item.trim());
  
	let results = [];
	
  for (let element of elements) {
    // remove curly braces, split by comma separators 
    element = element.replace(/{|}/g, '').trim(); 
    let pairs = element.split(','); 

    // extract word and position 
		let word, x, y;
    for (let pair of pairs) {
      let [key, value] = pair.split(':').map(part => part.trim());
      if (key == 'word') {
        word = value.replace(/"/g, '');
      } else if (key == 'x') {
        x = Math.floor(Number(value));
      } else if (key == 'y') {
        y = Math.floor(Number(value));
      }
    }
        
    results.push({text: word, x: x, y: y});
  }

  return results;
}