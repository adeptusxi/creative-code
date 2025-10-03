class Quad {
  constructor(p1, i1, p2, i2, p3, i3, p4, i4, col) {
    this.vertex1 = p1; // top left 
		this.idx1 = i1;
    this.vertex2 = p2; // top right 
		this.idx2 = i2;
    this.vertex3 = p3; // bottom left 
		this.idx3 = i3;
		this.vertex4 = p4; // bottom right 
		this.idx4 = i4;
		this.color = col;
		this.justShifted = false;
  }
	
	draw() {
		fill(this.color);
		quad(
			this.vertex1.x, this.vertex1.y, // top left 
			this.vertex2.x, this.vertex2.y, // top right 
			this.vertex4.x, this.vertex4.y, // bottom right 
			this.vertex3.x, this.vertex3.y, // bottom left
		);
	}
}