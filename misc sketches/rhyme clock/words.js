const timeWords = {
  1: "one", 
  2: "two", 
  3: "three", 
  4: "four", 
  5: "five", 
  6: "six", 
  7: "seven", 
  8: "eight", 
  9: "nine", 
  10: "ten", 
  11: "eleven", 
  12: "twelve", 
  13: "thirteen", 
  15: "fifteen", 
  20: "twenty", 
  30: "thirty", 
  40: "forty", 
  50: "fifty"
};

// rhyme help from rhymebrain, rhymezone, and chatGPT 
let rhymeAdjectives = {
  "one": ["fun", "undone"], 
  "two": ["new", "true", "blue"],
  "three": ["free"], // FIX 
  "four": ["sore", "fore", "your"],
  "five": ["live"], // FIX 
  "six": ["sick", "quick"],
  "seven": ["smitten", "second", "elven", "given"], 
  "eight": ["great", "late", "innate"],
  "nine": ["fine", "divine", "thine", "sublime"], 
  "ten": ["zen"], // FIX 
  "eleven": ["second", "elven", "given"], 
  "twelve": ["quelled", "felled"], // FIX 
	"twen": ["thin"], // FIX 
  "thir": ["blurred", "curved"], // FIX  
  "fif": ["stiff"], // FIX 
	
	"oh": ["low", "slow"], // FIX 
  "clock": ["locked"], // FIX 
	
  "twenty": ["empty"], // FIX 
  "thirty": ["sturdy", "dirty", "early"],
  "forty": ["courtly", "lordly"], // FIX 
  "fifty": ["thrifty", "nifty", "pretty"], 
};
let rhymeNouns = {
  "one": ["son", "sun", "gun", "pun"], 
  "two": ["view", "dew", "coup", "rue", "pew"],
  "three": ["debris", "glee", "key", "tree", "sea", "plea"],
  "four": ["roar", "lore", "shore", "hoar", "war", "door", "gore"],
  "five": ["life", "strife", "dive", "drive"],
  "six": ["fix", "sticks", "kicks", "tricks", "cliques"],
  "seven": ["heaven", "lesson", "weapon", "tension", "question"],
  "eight": ["date", "fate", "hate", "weight"],
  "nine": ["fine", "sign", "shrine", "spine"],
  "ten": ["men", "gem"],
  "eleven": ["posession", "obsession", "depression", "aggression", "supression"], 
  "twelve": ["self", "health", "wealth"],  
	
  "clock": ["rock", "lock", "talk"],  
	"teen": ["gene", "dream", "scene", "queen"],  
	
	"ty": ["debris", "glee", "key", "tree", "sea", "plea"]
}