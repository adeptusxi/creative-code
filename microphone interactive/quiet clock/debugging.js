function labelPoints() {
	textSize(7);
	textAlign(CENTER, CENTER);
	fill(255);
	push();
		translate(width/2, height/2);

		text("h1a", -(4 + digitSpacing*1.5) * digitWidth, -digitHeight);
		text("h1b", -(3 + digitSpacing*1.5) * digitWidth, -digitHeight);
		text("h1c", -(3 + digitSpacing*1.5) * digitWidth, 0);
		text("h1d", -(3 + digitSpacing*1.5) * digitWidth, digitHeight);
		text("h1e", -(4 + digitSpacing*1.5) * digitWidth, digitHeight);
		text("h1f", -(4 + digitSpacing*1.5) * digitWidth, 0);
	
		text("h2a", -(3 + digitSpacing*0.5) * digitWidth, -digitHeight);
		text("h2b", -(2 + digitSpacing*0.5) * digitWidth, -digitHeight);
		text("h2c", -(2 + digitSpacing*0.5) * digitWidth, 0);
		text("h2d", -(2 + digitSpacing*0.5) * digitWidth, digitHeight);
		text("h2e", -(3 + digitSpacing*0.5) * digitWidth, digitHeight);
		text("h2f", -(3 + digitSpacing*0.5) * digitWidth, 0);
	
		text("c1t", -(1.5 + digitSpacing*0.5) * digitWidth, -digitHeight/2);
		text("c1b", -(1.5 + digitSpacing*0.5) * digitWidth, digitHeight/2);
	
		text("m1a", -(1 + digitSpacing*0.5) * digitWidth, -digitHeight);
		text("m1b", -(digitSpacing*0.5) * digitWidth, -digitHeight);
		text("m1c", -(digitSpacing*0.5) * digitWidth, 0);
		text("m1d", -(digitSpacing*0.5) * digitWidth, digitHeight);
		text("m1e", -(1 + digitSpacing*0.5) * digitWidth, digitHeight);
		text("m1f", -(1 + digitSpacing*0.5) * digitWidth, 0);
	
		text("m2b", (1 + digitSpacing*0.5) * digitWidth, -digitHeight);
		text("m2a", (digitSpacing*0.5) * digitWidth, -digitHeight);
		text("m2f", (digitSpacing*0.5) * digitWidth, 0);
		text("m2e", (digitSpacing*0.5) * digitWidth, digitHeight);
		text("m2d", (1 + digitSpacing*0.5) * digitWidth, digitHeight);
		text("m2c", (1 + digitSpacing*0.5) * digitWidth, 0);
	
		text("c2t", (1.5 + digitSpacing*0.5) * digitWidth, -digitHeight/2);
		text("c2b", (1.5 + digitSpacing*0.5) * digitWidth, digitHeight/2);
	
		text("s1b", (3 + digitSpacing*0.5) * digitWidth, -digitHeight);
		text("s1a", (2 + digitSpacing*0.5) * digitWidth, -digitHeight);
		text("s1f", (2 + digitSpacing*0.5) * digitWidth, 0);
		text("s1e", (2 + digitSpacing*0.5) * digitWidth, digitHeight);
		text("s1d", (3 + digitSpacing*0.5) * digitWidth, digitHeight);
		text("s1c", (3 + digitSpacing*0.5) * digitWidth, 0);
	
		text("s2b", (4 + digitSpacing*1.5) * digitWidth, -digitHeight);
		text("s2a", (3 + digitSpacing*1.5) * digitWidth, -digitHeight);
		text("s2f", (3 + digitSpacing*1.5) * digitWidth, 0);
		text("s2e", (3 + digitSpacing*1.5) * digitWidth, digitHeight);
		text("s2d", (4 + digitSpacing*1.5) * digitWidth, digitHeight);
		text("s2c", (4 + digitSpacing*1.5) * digitWidth, 0);
	pop();
}