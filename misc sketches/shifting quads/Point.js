class Point {
  constructor(x, y, isRightEdge) {
    this.x = x;
    this.y = y;
    this.used = false; // is a side/vertex on this point?
		this.isShiftCandidate = false; // is this open for the next shift? 
		this.isRightEdge = isRightEdge;
  }
}