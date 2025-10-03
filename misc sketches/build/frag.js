const frag = `

precision mediump float;
varying vec2 vTexCoord;
uniform vec2 u_resolution; 
uniform sampler2D u_img; 
uniform sampler2D u_segment_img; 

bool isBlackPixel(vec4 pixel) {
	return pixel == vec4(0.0, 0.0, 0.0, 1.0);
}

void main() {
  vec2 coord = vec2(vTexCoord.x, 1.0 - vTexCoord.y);
  
  vec4 clr_pixel = texture2D(u_img, coord);
	vec4 segment_pixel = texture2D(u_segment_img, coord); 

	if (isBlackPixel(segment_pixel)) {
		// gl_FragColor = clr_pixel; 
		gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); 
	} else {
		gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0); 
	}
}
`;