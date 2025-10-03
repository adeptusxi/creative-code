function updateSegmentPoints() {
	if (secFace != null) {
		secSegPoints = {
			L: {
				UL: {x: SLUL.x, y: SLUL.y},
				UR: {x: SLUR.x, y: SLUR.y},
				CL: {x: SLCL.x, y: SLCL.y}, 
				CR: {x: SLCR.x, y: SLCR.y}, 
				DL: {x: SLDL.x, y: SLDL.y},
				DR: {x: SLDR.x, y: SLDR.y}
			},
			R: {
				UL: {x: SRUL.x, y: SRUL.y},
				UR: {x: SRUR.x, y: SRUR.y},
				CL: {x: SRCL.x, y: SRCL.y}, 
				CR: {x: SRCR.x, y: SRCR.y}, 
				DL: {x: SRDL.x, y: SRDL.y},
				DR: {x: SRDR.x, y: SRDR.y}
			}
		};
	}
	
	if (minFace != null) {
		minSegPoints = {
			L: {
				UL: {x: MLUL.x, y: MLUL.y},
				UR: {x: MLUR.x, y: MLUR.y},
				CL: {x: MLCL.x, y: MLCL.y}, 
				CR: {x: MLCR.x, y: MLCR.y}, 
				DL: {x: MLDL.x, y: MLDL.y},
				DR: {x: MLDR.x, y: MLDR.y}
			},
			R: {
				UL: {x: MRUL.x, y: MRUL.y},
				UR: {x: MRUR.x, y: MRUR.y},
				CL: {x: MRCL.x, y: MRCL.y}, 
				CR: {x: MRCR.x, y: MRCR.y}, 
				DL: {x: MRDL.x, y: MRDL.y},
				DR: {x: MRDR.x, y: MRDR.y}
			}
		};
	}
	
	if (hrFace != null) {
		hrSegPoints = {
			L: {
				UL: {x: HLUL.x, y: HLUL.y},
				UR: {x: HLUR.x, y: HLUR.y},
				CL: {x: HLCL.x, y: HLCL.y}, 
				CR: {x: HLCR.x, y: HLCR.y}, 
				DL: {x: HLDL.x, y: HLDL.y},
				DR: {x: HLDR.x, y: HLDR.y}
			}, 
			R: {
				UL: {x: HRUL.x, y: HRUL.y},
				UR: {x: HRUR.x, y: HRUR.y},
				CL: {x: HRCL.x, y: HRCL.y}, 
				CR: {x: HRCR.x, y: HRCR.y}, 
				DL: {x: HRDL.x, y: HRDL.y},
				DR: {x: HRDR.x, y: HRDR.y}
			}
		};
	}
}

function drawSegmentPoints() {
	noStroke();
	fill('red');
	for (let i = 0; i < segPoints.length; i++) {
		let segpts = segPoints[i]; 
		if (segpts == null) continue; 
			for (let side in segpts) {
				for (let point in segpts[side]) {
					let p = segpts[side][point];
					circle(p.x, p.y, 5);
				}
			}
	}
}

function drawSegmentPoints() {
	noStroke();
	fill('red');
	for (let i = 0; i < segPoints.length; i++) {
		let segpts = segPoints[i]; 
		if (segpts == null) continue; 
		for (let side in segpts) {
			for (let point in segpts[side]) {
				let p = segpts[side][point];
				circle(p.x, p.y, 5);
			}
		}
	}
}

function drawAllSegments() {
	if (secSegPoints != null) {
		drawSegments(secSegPoints, secLineWidth);
	}
	if (minSegPoints != null) {
		drawSegments(minSegPoints, minLineWidth);
	}
	if (hrSegPoints != null) {
		drawSegments(hrSegPoints, hrLineWidth);
	}
}

function drawSegments(segpts, lineWidth) {
	// left side 
	lline(segpts.L.UL, segpts.L.UR, false, lineWidth);  // UL to UR
	lline(segpts.L.UR, segpts.L.CR, false, lineWidth);  // UR to CR
	lline(segpts.L.CR, segpts.L.DR, false, lineWidth);  // CR to DR
	lline(segpts.L.DR, segpts.L.DL, false, lineWidth);  // DR to DL
	lline(segpts.L.DL, segpts.L.CL, false, lineWidth);  // DL to CL
	lline(segpts.L.CL, segpts.L.UL, false, lineWidth);  // CL to UL
	lline(segpts.L.CL, segpts.L.CR, false, lineWidth);  // CL to CR

	// right half 
	lline(segpts.R.UL, segpts.R.UR, false, lineWidth);  // UL to UR
	lline(segpts.R.UR, segpts.R.CR, false, lineWidth);  // UR to CR
	lline(segpts.R.CR, segpts.R.DR, false, lineWidth);  // CR to DR
	lline(segpts.R.DR, segpts.R.DL, false, lineWidth);  // DR to DL
	lline(segpts.R.DL, segpts.R.CL, false, lineWidth);  // DL to CL
	lline(segpts.R.CL, segpts.R.UL, false, lineWidth);  // CL to UL
	lline(segpts.R.CL, segpts.R.CR, false, lineWidth);  // CL to CR
}