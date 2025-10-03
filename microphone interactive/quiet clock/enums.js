const Measure = {
	HR: "hour", 
	MIN: "minute", 
	SEC: "second"
};

const FixedPoints = {
	h1: {
		a: {x: -(4 + digitSpacing*1.5) * digitWidth, y: -digitHeight},
		b: {x: -(3 + digitSpacing*1.5) * digitWidth, y: -digitHeight},
		c: {x: -(3 + digitSpacing*1.5) * digitWidth, y: 0},
		d: {x: -(3 + digitSpacing*1.5) * digitWidth, y: digitHeight},
		e: {x: -(4 + digitSpacing*1.5) * digitWidth, y: digitHeight}, 
		f: {x: -(4 + digitSpacing*1.5) * digitWidth, y: 0}
	},
	
	h2: {
		a: {x: -(3 + digitSpacing*0.5) * digitWidth, y: -digitHeight},
		b: {x: -(2 + digitSpacing*0.5) * digitWidth, y: -digitHeight},
		c: {x: -(2 + digitSpacing*0.5) * digitWidth, y: 0},
		d: {x: -(2 + digitSpacing*0.5) * digitWidth, y: digitHeight},
		e: {x: -(3 + digitSpacing*0.5) * digitWidth, y: digitHeight}, 
		f: {x: -(3 + digitSpacing*0.5) * digitWidth, y: 0}
	},
	
	c1: {
		t: {x: -(1.5 + digitSpacing*0.5) * digitWidth, y: -digitHeight/2}, 
		b: {x: -(1.5 + digitSpacing*0.5) * digitWidth, y: digitHeight/2}
	}, 
	
	m1: {
		a: {x: -(1 + digitSpacing*0.5) * digitWidth, y: -digitHeight},
		b: {x: -(digitSpacing*0.5) * digitWidth, y: -digitHeight},
		c: {x: -(digitSpacing*0.5) * digitWidth, y: 0},
		d: {x: -(digitSpacing*0.5) * digitWidth, y: digitHeight},
		e: {x: -(1 + digitSpacing*0.5) * digitWidth, y: digitHeight}, 
		f: {x: -(1 + digitSpacing*0.5) * digitWidth, y: 0}
	},
	
	m2: {
		b: {x: (1 + digitSpacing*0.5) * digitWidth, y: -digitHeight},
		a: {x: (digitSpacing*0.5) * digitWidth, y: -digitHeight},
		f: {x: (digitSpacing*0.5) * digitWidth, y: 0},
		e: {x: (digitSpacing*0.5) * digitWidth, y: digitHeight},
		d: {x: (1 + digitSpacing*0.5) * digitWidth, y: digitHeight}, 
		c: {x: (1 + digitSpacing*0.5) * digitWidth, y: 0}
	}, 
	
	c2: {
		t: {x: (1.5 + digitSpacing*0.5) * digitWidth, y: -digitHeight/2}, 
		b: {x: (1.5 + digitSpacing*0.5) * digitWidth, y: digitHeight/2}
	}, 
	
	s1: {
		b: {x: (3 + digitSpacing*0.5) * digitWidth, y: -digitHeight},
		a: {x: (2 + digitSpacing*0.5) * digitWidth, y: -digitHeight},
		f: {x: (2 + digitSpacing*0.5) * digitWidth, y: 0},
		e: {x: (2 + digitSpacing*0.5) * digitWidth, y: digitHeight},
		d: {x: (3 + digitSpacing*0.5) * digitWidth, y: digitHeight}, 
		c: {x: (3 + digitSpacing*0.5) * digitWidth, y: 0}
	}, 
	
	s2: {
		b: {x: (4 + digitSpacing*1.5) * digitWidth, y: -digitHeight},
		a: {x: (3 + digitSpacing*1.5) * digitWidth, y: -digitHeight},
		f: {x: (3 + digitSpacing*1.5) * digitWidth, y: 0},
		e: {x: (3 + digitSpacing*1.5) * digitWidth, y: digitHeight},
		d: {x: (4 + digitSpacing*1.5) * digitWidth, y: digitHeight}, 
		c: {x: (4 + digitSpacing*1.5) * digitWidth, y: 0} 
	}
};

let Points = JSON.parse(JSON.stringify(FixedPoints));