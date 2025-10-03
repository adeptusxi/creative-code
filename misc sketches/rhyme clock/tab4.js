// // she don't work 

// let rhymeWords = {}; 
// const rhymeAPIBase = "https://rhymebrain.com/talk?function=getRhymes&word=";
// const numRhymes = 5; 
// const timeWords = [
//   "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "oh", 
//   "clock", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", 
//   "sixteen", "seventeen", "eighteen", "nineteen", "twenty", "thirty", "forty", "fifty"
// ];
// let isLoading = true; 

// function setup() {
//   createCanvas(800, 400);
//   getRhymes(); 
// }

// function draw() {
//   background(255);
  
//   if (!isLoading) {
// 		// loading complete 
//     textAlign(CENTER, CENTER);
//     textSize(48);

//     let h = hour() % 12;
//     let m = minute();

//     let rhymingTimeStr = convertToRhymingTime(h, m);

//     text(rhymingTimeStr, width / 2, height / 2);
//   } else {
// 		// loading 
// 		textAlign(CENTER, CENTER);
//     textSize(32);
//     fill(0);
//     text("Loading rhymes...", width / 2, height / 2);
//   }
// }

// function convertToRhymingTime(h, m) {
//   let hourStr = getRhymingWord(h); 
  
//   let minuteStr = m < 10 ? "oh-" + getRhymingWord(m) : getRhymingWord(m); 

// 	return hourStr + "-" + minuteStr;
// }

// function getRhymingWord(num) {
//   if (num == 0) return rhymeWords["oh"] && rhymeWords["oh"].length > 0 ? random(rhymeWords["oh"]).word : "oh"; 
//   return rhymeWords[timeWords[num - 1]] && rhymeWords[timeWords[num - 1]].length > 0 ? random(rhymeWords[timeWords[num - 1]]).word : num; 
// }

// function getRhymes() {
// 	// fetching from chatGPT 
//   let fetchPromises = []; 
//   timeWords.forEach(word => {
//     const fetchPromise = fetch(rhymeAPIBase + word)
//       .then(response => {
//         if (!response.ok) {
//           throw new Error('Network response was not ok: ' + response.statusText);
//         }
//         return response.json();
//       })
//       .then(data => {
//         if (Array.isArray(data) && data.length > 0) {
//           rhymeWords[word] = data.slice(0, numRhymes); 
//         } else {
//           console.warn(`No rhymes found for "${word}"`); 
//           rhymeWords[word] = []; 
//         }
//       })
//       .catch(error => {
//         console.error('Error fetching rhymes for word "' + word + '":', error);
//         rhymeWords[word] = []; 
//       });
    
//     fetchPromises.push(fetchPromise); 
//   });

//   // wait for to complete all fetches 
//   Promise.all(fetchPromises).then(() => {
//     isLoading = false; 
//   });
// }
