function drawTime() {
	if (secSegPoints != null) {
		let S = nf(second(), 2); 
		drawDigit(secSegPoints.L, floor(S/10), secLineWidth);
		drawDigit(secSegPoints.R, S%10, secLineWidth);
	}
	if (minSegPoints != null) {
		let M = nf(minute(), 2); 
		drawDigit(minSegPoints.L, floor(M/10), minLineWidth);
		drawDigit(minSegPoints.R, M%10, minLineWidth);
	}
	if (hrSegPoints != null) {
		let H = nf(hour(), 2); 
		drawDigit(hrSegPoints.L, floor(H/10), hrLineWidth);
		drawDigit(hrSegPoints.R, H%10, hrLineWidth);
	}
}

function drawColons() {
	strokeWeight(1); 
	
	if (hrSegPoints != null && minSegPoints != null) {
		let radius = (hrLineWidth + minLineWidth);
		let u = { // upper endpoint of line 
			x: (hrSegPoints.R.UR.x + minSegPoints.L.UL.x) / 2, 
			y: (hrSegPoints.R.UR.y + minSegPoints.L.UL.y) / 2 
		}
		let d = { // lower endpoint of line 
			x: (hrSegPoints.R.DR.x + minSegPoints.L.DL.x) / 2, 
			y: (hrSegPoints.R.DR.y + minSegPoints.L.DL.y) / 2 
		} 
		let p1 = {
			x: (3 * u.x + d.x) / 4, 
			y: (3 * u.y + d.y) / 4
		}
		let p2 = {
			x: (u.x + 3 * d.x) / 4, 
			y: (u.y + 3 * d.y) / 4
		}
		ellipse(p1.x, p1.y, radius);
		ellipse(p2.x, p2.y, radius); 
	}
	
	if (minSegPoints != null && secSegPoints != null) {
		let radius = (minLineWidth + secLineWidth);
		let u = { // upper endpoint of line 
			x: (minSegPoints.R.UR.x + secSegPoints.L.UL.x) / 2, 
			y: (minSegPoints.R.UR.y + secSegPoints.L.UL.y) / 2 
		}
		let d = { // lower endpoint of line 
			x: (minSegPoints.R.DR.x + secSegPoints.L.DL.x) / 2, 
			y: (minSegPoints.R.DR.y + secSegPoints.L.DL.y) / 2 
		} 
		let p1 = {
			x: (3 * u.x + d.x) / 4, 
			y: (3 * u.y + d.y) / 4
		}
		let p2 = {
			x: (u.x + 3 * d.x) / 4, 
			y: (u.y + 3 * d.y) / 4
		}
		ellipse(p1.x, p1.y, radius);
		ellipse(p2.x, p2.y, radius); 
	}
}

function drawDigit(place, value, lineWidth) {
	switch(value) {
		case 0:
			draw0(place, lineWidth);
			break;
		case 1:
			draw1(place, lineWidth);
			break;
		case 2:
			draw2(place, lineWidth);
			break;
		case 3:
			draw3(place, lineWidth);
			break;
		case 4:
			draw4(place, lineWidth);
			break;
		case 5:
			draw5(place, lineWidth);
			break;
		case 6:
			draw6(place, lineWidth);
			break;
		case 7:
			draw7(place, lineWidth);
			break;
		case 8:
			draw8(place, lineWidth);
			break;
		case 9:
			draw9(place, lineWidth);
			break;
	}
}	

function draw0(place, lineWidth) {
	lline(place.UL, place.UR, true, lineWidth);
	lline(place.UR, place.CR, true, lineWidth);
	lline(place.CR, place.DR, true, lineWidth);
	lline(place.DR, place.DL, true, lineWidth);
	lline(place.DL, place.CL, true, lineWidth);
	lline(place.CL, place.UL, true, lineWidth);
}

function draw1(place, lineWidth) {
	lline(place.UR, place.CR, true, lineWidth);
	lline(place.CR, place.DR, true, lineWidth);
}

function draw2(place, lineWidth) {
	lline(place.UL, place.UR, true, lineWidth);
	lline(place.UR, place.CR, true, lineWidth);
	lline(place.DR, place.DL, true, lineWidth);
	lline(place.DL, place.CL, true, lineWidth);
	lline(place.CR, place.CL, true, lineWidth);
}

function draw3(place, lineWidth) {
	lline(place.UL, place.UR, true, lineWidth);
	lline(place.UR, place.CR, true, lineWidth);
	lline(place.CR, place.DR, true, lineWidth);
	lline(place.DR, place.DL, true, lineWidth);
	lline(place.CR, place.CL, true, lineWidth);
}

function draw4(place, lineWidth) {
	lline(place.UR, place.CR, true, lineWidth);
	lline(place.CR, place.DR, true, lineWidth);
	lline(place.CL, place.UL, true, lineWidth);
	lline(place.CR, place.CL, true, lineWidth);
}

function draw5(place, lineWidth) {
	lline(place.UL, place.UR, true, lineWidth);
	lline(place.CR, place.DR, true, lineWidth);
	lline(place.DR, place.DL, true, lineWidth);
	lline(place.CL, place.UL, true, lineWidth);
	lline(place.CR, place.CL, true, lineWidth);
}

function draw6(place, lineWidth) {
	lline(place.UL, place.UR, true, lineWidth);
	lline(place.CR, place.DR, true, lineWidth);
	lline(place.DR, place.DL, true, lineWidth);
	lline(place.DL, place.CL, true, lineWidth);
	lline(place.CL, place.UL, true, lineWidth);
	lline(place.CR, place.CL, true, lineWidth);
}

function draw7(place, lineWidth) {
	lline(place.UL, place.UR, true, lineWidth);
	lline(place.UR, place.CR, true, lineWidth);
	lline(place.CR, place.DR, true, lineWidth);
}

function draw8(place, lineWidth) {
	lline(place.UL, place.UR, true, lineWidth);
	lline(place.UR, place.CR, true, lineWidth);
	lline(place.CR, place.DR, true, lineWidth);
	lline(place.DR, place.DL, true, lineWidth);
	lline(place.DL, place.CL, true, lineWidth);
	lline(place.CL, place.UL, true, lineWidth);
	lline(place.CR, place.CL, true, lineWidth);
}

function draw9(place, lineWidth) {
	lline(place.UL, place.UR, true, lineWidth);
	lline(place.UR, place.CR, true, lineWidth);
	lline(place.CR, place.DR, true, lineWidth);
	lline(place.DR, place.DL, true, lineWidth);
	lline(place.CL, place.UL, true, lineWidth);
	lline(place.CR, place.CL, true, lineWidth);
}