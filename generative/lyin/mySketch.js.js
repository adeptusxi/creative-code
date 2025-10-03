// animation 
let currentState = 1;
let isResetting = false;
let isWaiting = false;
let anim = 0; let animLength = 30; let animPause = 10; let animToW = 1; let animToH = 1; 
let bob = 0; let fastBob = 0; let wobble = 0; let growthSmall = 0; let growthBig = 0;
let blink = 0; let blinkCount = 0;

// scale 
let earSc = 1; let headSc = 1; let flapSc = 1; let eyeSc = 1; let eyeLayers = 6;
let teethScx = 1; let teethScy = 1; let numTeeth = 5; let noseSc = 1; let nostrilSc = 1;
let circSc = 1; let topSc = 1; let topR = 1; let lineSc = 1;

// colors 
let head, mouthlight, mouthdark, lining, iris, whitex, blackx, staticwhite, staticblack;
let headColors = ['#d97252','#db433b','#c72c55','#f5b567','#a8c72c','#2680a3','#6d469e'];

// text 
let fortunes;
let thisFortune;

function preload() {
	fortunes = loadStrings("https://deckard.openprocessing.org/user423914/visual2182980/h63913a872e38145e0a128cb2c14a521f/fortunes.txt");
}

function setup() {
	createCanvas(600, 600);
	angleMode(DEGREES);
	rectMode(CENTER);
	textAlign(CENTER,CENTER);
	textSize(12);
	
	// colors 
	head = headColors[0];
	mouthlight = color(217, 43, 43);
	mouthdark = color(110, 0, 23);
	iris = color(162, 224, 144);
	lining = color(240, 235, 230);
	staticwhite = color(235, 223, 211);
	staticblack = color(66, 21, 11);
	whitex = staticwhite; 
	blackx = staticblack;
	drawingContext.shadowColor = staticblack;
	
	thisFortune = random(fortunes);
}

function draw() {
	// animation 
	if (isResetting) {
		anim++;
		let logAnim = map(log(anim + 1), 0, log(animLength + 1), 0, 1);
    animToW = map(logAnim, 0, 1, 1, width/3);
  	animToH = map(logAnim, 0, 1, 1, height/3);
		if (anim > animLength*animPause) {
			isWaiting = true;
		}
	}
	
	// anim vars 
	let vel = currentState*currentState;
	let chaos = map(currentState*currentState, 1, 16, 1, 9);
	if (currentState > 3) {
		iris = lerpColor(iris, color(237, 40, 40), map(frameCount%100, 0,100,0,0.02));
		whitex = lerpColor(whitex, color(237, 97, 97), map(frameCount%100, 0,100,0,0.01));
	}
	if (isResetting) chaos = map(currentState*currentState, 1, 16, 1, animLength*animPause/anim/2);
	if (anim > animLength*animPause/2) chaos = 0;
	wobble = chaos*sin(2*frameCount*vel);
	bob = map(sin(frameCount),-1,1,-0.75,0.75);
	fastBob = map(sin(frameCount),-1,1,0,10);
	growthSmall = map(sin(frameCount/2),-1,1,0.95,1.05);
	growthBig = map(cos(frameCount/2),-1,1,1,1.5);
	blink = 50*abs(sin(frameCount));

	// draw 
	background(staticblack);
	shadow(true);
	noStroke();
	noFill();
	translate(width/2, height/2);
	drawFace();
}

function shadow(showShadow) {
	if (showShadow) {
		drawingContext.shadowBlur = 10;
	} else {
		drawingContext.shadowBlur = 0;
	}
}

function mouseClicked() {
	currentState++;
	if (currentState > 4) isResetting = true;
	if (currentState > 5) reset(); isWaiting = false;
}

function reset() {
	currentState = 1;
	anim = 1;
	animToW = 1;
	animToH = 1;
	isResetting = false;
	// colors 
	head = color(random(headColors));
	mouthlight = color(random(200,255), random(20,120), random(20,120));
	mouthdark = color(random(90,170), random(0,20), random(0,60));
	iris = color(random(100,255), random(100,255), random(100,255));
	lining = color(random(200,255), random(200,255), random(200,255));
	whitex = staticwhite;
	// scales 
	earSc = random(0.9,1.1);
	headSc = random(0.95,1.05);
	flapSc = random(0.9,1);
	eyeSc = random(0.9,1.1);
	eyeLayers = random([4,6,10]);
	teethScx = random(0.9,1.1);
	teethScy = random(0.9,1.1);
	numTeeth = random([3,5]);
	noseSc = random(0.9,1.1);
	nostrilSc = random(0.9,1.1);
	circSc = random(0.9,1.1);
	topSc = random(0.9,1.1);
	topR = random(0.9,1.1);
	lineSc = random(0.9,1.2);
	
	thisFortune = random(fortunes);
}

function shake() {
	let r = 0;
	let bound = map(currentState*currentState, 1, 16, 0.1, 1.2);
	if (currentState > 2) r = random(-bound,bound);
	return r;
}

function growthSpurt() {
	let r = 0;
	if (currentState > 3 && random(0,20) < 0.1) r = random(1.5,2);
	return r;
}

function fortune() { // hidden "fortune"
	if (anim > 1) {
		shadow(false); 
		fill(lining);
		text("☆" + thisFortune + "☆",0,5*bob);
		noFill();
		shadow(true);
	}
}

function drawFace() {
	scale(headSc);
	translate(0,-60+10*bob);
	if (!isWaiting) {
		translate(wobble*shake(), wobble*shake());
		drawHead(earSc,headSc,flapSc);
		drawEye(eyeSc);
		drawMouth(teethScx, teethScy);
		drawLining(lineSc);
		drawNose(noseSc, nostrilSc);
		drawOrnament(circSc, topSc, topR);
	} else {
		drawHeadOnly(earSc,headSc,flapSc);
	}
}

function drawHeadOnly(earSc, headSc, flapSc) {
	scale(headSc);
	fill(head);
	ellipse(0,10,360*growthSmall,270*growthSmall); // head base 
	fortune();
}

function drawHead(earSc, headSc, flapSc) {
	push();
		scale(earSc);
		for (let i = -1; i <= 1; i+=2) { 
			translate(i*animToW, -animToH);
			beginShape(); // ear lining 
				fill(lining);
				vertex(i*20, -100);
				vertex(i*60*lineSc+i*wobble, -160*lineSc-wobble + 50*growthSpurt());
				vertex(i*60, -140); // indent
				vertex(i*120*lineSc+i*wobble, -180*lineSc+wobble + 20*growthSpurt());
				if (earSc >= 1) vertex(i*115, -160); // indent
				vertex(i*180*lineSc+i*wobble, -175*lineSc-wobble + 50*growthSpurt());
				vertex(i*175, -160); // indent
				vertex(i*230*lineSc+i*wobble, -140*lineSc+wobble + 20*growthSpurt());
				vertex(i*195, -110);
				vertex(i*170, -40);
			endShape();
			fill(head);
			push();
				if (earSc <= 1) {
				scale(growthSmall);
				scale(earSc);
				beginShape(); // ears 
					vertex(i*20,-100); 
					bezierVertex(i*70,-100, i*100,-180, i*200,-130);
					bezierVertex(i*180,-130, i*130,-100, i*170,-10);
				endShape();
				} else {
					scale(growthSmall);
					ellipse(i*110, -100, earSc*100);
				}
			pop();
			push();
			scale(flapSc);
				translate(i*wobble,0);
				beginShape(); // bottom flap 
					vertex(i*80,30*growthBig);
					vertex(i*200*growthSmall + 40*growthSpurt(),200*growthSmall + 40*growthSpurt());
					vertex(i*80,190);
				endShape();
			pop();
		}
	pop();
	drawHeadOnly(earSc, headSc, flapSc)
}

function drawEye(eyeSc) {
		for (let i = -1; i <= 1; i+=2) {
			push();
			translate(i*90+i*animToW*1.5, -15);
			scale(eyeSc*1.1);
			push();
			for (let j = 0; j < eyeLayers; j++) {
				if (j%2 == 0) {
					fill(whitex);
				} else {
					fill(blackx);
				}
				ellipse(-i*j*2, j*6, 100);
				scale(0.8);
			}
			pop();
			fill(iris);
			ellipse(-i*5,15,25);
			pop();
		}
}

function drawMouth(teethScx, teethScy) {
	push();
		translate(0,10);
		fill(lining);
		push();
			translate(0+random([-1,1])*shake(),-fastBob);
			translate(0, 1.75*animToH);
			beginShape(); // below mouth lining 
				for (let i = -1; i <= 1; i++) {
					vertex(0, 310+wobble);
					for (let j = 1; j < 7; j++) {
						let resize = 0;
						let v = 260-wobble;
						if (j%2 == 0) v = 320 - resize + wobble;
						if (teethScx > 1 && j > 5) break;
						vertex(i*j*20*lineSc, v-j*10 + 30*growthSpurt()*lineSc);
					}
					vertex(i*150, 110);
					vertex(0,50);
				}
			endShape(CLOSE);
		pop();
		translate(0,75+fastBob); // outer 
		fill(mouthlight); 
		drawMouthShape(1.6,1.5);
		translate(0,18); // inner dark red 
		fill(mouthdark); 
		drawMouthShape(1.3,1.1);
		translate(0,60);
		drawRoundTeeth(teethScx*40, teethScy*45);
		translate(0,-65);
		fill(mouthdark);
		drawMouthShape(1.3,0.7);
		translate(0,-10);
		fill(mouthlight);
		drawMouthShape(1.2,0.6);
	pop();
} 

function drawMouthShape(teethScx, teethScy) {
	push();
		translate(0, animToH*1.6);
		scale(teethScx,teethScy);
		beginShape();
			vertex(0,0); // top center (start)
			bezierVertex(-55,0, -60,40, -90,7); // left corner 
			bezierVertex(-75,80, -30,95, 0,95); // bottom center 
			bezierVertex(30,95, 75,80, 90,7); // right corner 
			bezierVertex(60,40, 55,0, 0,0); // top center (curved close)
		endShape(CLOSE);
	pop();
}

function drawRoundTeeth(w,h) {
	fill(whitex); 
	push(); 
		translate(0, animToH);
		for (let i = -1; i <= 1; i+= 2) {
			push();
				for (let j = 0; j < numTeeth/2; j++) {
					arc(0,0, w,h*1.9 + 20*growthSpurt(), 0,180);
					translate(i*w*0.8*animToW,-(j+1)*w/7*animToH);
					rotate(-i*18);
				}
			pop(); 
		}
	pop(); 
}

function drawLining(lineSc) {
	push(); // above mouth  
		translate(0+random([-1,1])*shake(), 0.1-wobble);
		fill(lining);
		translate(0,100);
		beginShape();
		for (let i = -1; i <= 1; i += 2) {
			translate(0, animToH);
			vertex(0,0);
			for (let j = 0; j < 6; j++) {
				let v = wobble;
				if (j%2) v = -10-wobble;
				vertex(i*j*17, v+j*3+20 + 20*growthSpurt()*lineSc);
			}
			vertex(i*130-i*wobble, 40);
			vertex(i*160+i*wobble, 10+wobble);
			vertex(i*150, -10);
			vertex(i*195*lineSc+i*wobble + 50*growthSpurt(), -45*lineSc-wobble - 10*growthSpurt()); 
			vertex(i*130, -25*lineSc);
			if (lineSc < 1.1) vertex(i*160*lineSc+i*wobble + 50*growthSpurt(), -45*lineSc-wobble - 10*growthSpurt());
			vertex(i*70, -20*lineSc);
			vertex(0,-50);
		}
		endShape(CLOSE);
	pop();
	push(); // below eyes 
		translate(random([-1,1])*shake(),random([-1,1])*shake());
		fill(lining);
		for (let i = -1; i <= 1; i+= 2) {
			push();
				translate(i*animToW, -animToH/2);
				beginShape();
					vertex(i*20, 10);
					vertex(i*70, 35);
					vertex(i*100, 35);
					vertex(i*130, 25);
					vertex(i*160, 5);
					vertex(i*180, -15); // inner corner 
					vertex(i*140, -60);
					vertex(i*210*lineSc+i*wobble, -75*lineSc-wobble);
					vertex(i*180, -40); // indent 
					vertex(i*210*lineSc+i*wobble, -40*lineSc+wobble);
					if (lineSc > 1.05) vertex(i*180, -5); // indent
					vertex(i*200, 0); 
					vertex(i*170, 40);
					vertex(i*150, 50);
					vertex(i*100, 50);
					vertex(i*70, 40);
					vertex(i*50, 20);
				endShape();
			pop();
		}
	pop(); 
	push(); // above eyes 
		fill(lining);
		let localBlink = blink;
		blinkCount++;
		if (blinkCount >= 180) localBlink = 0;
		if (blinkCount >= 900) blinkCount = 0;
		let tall = map(lineSc,0.9,1.2,-20,40);
		for (let i = -1; i <= 1; i+= 2) {
			push();
				translate(i*animToW, -animToH);
				if (currentState > 3 && random(0,20) < 0.2) localBlink = 50;
				beginShape();
					vertex(i*10,20); 
					vertex(i*40, 0); 
					vertex(i*60, -25 + 1.3*localBlink); 
					vertex(i*90, -40 + 1.6*localBlink); 
					vertex(i*120, -40 + 1.4*localBlink);
					vertex(i*150, -30 + 1.2*localBlink);
					vertex(i*180*lineSc + 50*growthSpurt()+i*wobble, -15*lineSc-wobble);
					vertex(i*150-i*wobble, -55); // indent 
					vertex(i*180*lineSc + 60*growthSpurt()+i*wobble, -70*lineSc+wobble-tall);
					vertex(i*140, -80-tall);
					vertex(i*100, -80-tall);
					if (lineSc > 1) vertex(i*80, -60); // indent
					vertex(i*60*lineSc, -70-tall);
					vertex(i*50, -40); // indent
					vertex(i*55*lineSc+i*wobble, -80-wobble + -80*growthSpurt()-tall);
					vertex(i*30, -20); // indent 
					vertex(i*20-i*wobble, -40+wobble);
				endShape();
			pop();
		}
	pop();
}

function drawNose(noseSc, nostrilSc) {
	push();
		fill(mouthlight);
		if (noseSc <= 1) {
			rect(0,40+1.8*animToH, 80*noseSc,45*noseSc, 15,15,15,15);
		} else {
			push();
				translate(0, 1.8*animToH);
				triangle(0,90*noseSc, -50*noseSc,20*noseSc, 50*noseSc,20*noseSc);
			pop();
		}
		for (let i = -1; i <= 1; i+= 2) {
			ellipse(i*35+i*1.8*animToW,20,40*growthBig*nostrilSc);
		}
	pop();
}

function drawOrnament(circSc, topSc, topR) {
	translate(0,-70);
	push();
		if (circSc <= 1.05) {
			fill(mouthdark);
			ellipse(0,0-animToH,60*growthBig*circSc);
			fill(mouthlight);
			ellipse(0,0-animToH,50*growthBig*circSc);
		}
		if (circSc >= 1) rect(0,-70-animToH, 80*topSc,70, 20*topR*topR,20*topR*topR,10,10);
	pop();
}