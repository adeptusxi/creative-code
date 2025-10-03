const frag = `

precision mediump float;
varying vec2 vTexCoord;
uniform vec2 u_resolution; 
uniform float u_time;
uniform sampler2D u_tex0; // main camera feed
uniform sampler2D u_blurMask; // where the mouse has been 
uniform vec2 u_mouse; 
uniform float u_totalMouseDisplace;

float total_mouse_speed = 0.0;
#define edge_sensitivity 0.8
#define outline_threshold 0.3
#define outline_thickness 2.0 
#define dark_threshold 0.3
#define shadow1_threshold 0.6
#define hatch1_thickness 3.0
#define hatch1_distance 10.0
#define hatch1_angle 60.0
#define shadow2_threshold 0.4
#define hatch2_thickness 3.0
#define hatch2_distance 7.5
#define hatch2_angle -60.0

float noise(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

vec4 bg_color(vec2 xy) {
	vec4 color_1 = vec4(0.90, 0.85, 0.81, 1.0); 
	vec4 color_2 = vec4(0.616, 0.57, 0.542, 1.0);
	return mix(color_1, color_2, noise(xy));
	// return vec4(0.90, 0.85, 0.81, 1.0); // tan 
	// return vec4(0.88, 0.99, 1.00, 1.0); // skyblue  
}
vec4 dark_color() {
	return vec4(0.19, 0.15, 0.14, 1.0); // dark brown 
	// return vec4(0.87, 0.43, 0.37, 1.0); // salmon 
}
vec4 hatch2_color() {
	return dark_color();
} 
vec4 hatch1_color() {
	return dark_color();
} 

// luminance calculation from Graphics Shaders: Theory and Practice 
// https://web.engr.oregonstate.edu/~mjb/cgeducation/ShadersBookFirst/Source/Chapter10/toon.frag
float brightness(vec3 color) {
  return dot(color, vec3(0.2125, 0.7154, 0.0721));
}

bool hatch(vec2 pos, float angle, float distance, float thickness) {
  float rad = radians(angle);
  vec2 rotated_pos = vec2(
    pos.x * cos(rad) - pos.y * sin(rad),
    pos.x * sin(rad) + pos.y * cos(rad)
  );
  float line_pos = mod(rotated_pos.x, distance);
  return line_pos < thickness;
}

// sobel kernel function by Patrick Hebron 
// https://gist.github.com/Hebali/6ebfc66106459aacee6a9fac029d0115
void make_kernel(inout vec4 n[9], vec2 coord) {
	float w = 1.0 / u_resolution.x;
	float h = 1.0 / u_resolution.y;

	n[0] = texture2D(u_tex0, coord + vec2(-w, -h)); 	// up left 
	n[1] = texture2D(u_tex0, coord + vec2(0.0, -h)); 	// up 
	n[2] = texture2D(u_tex0, coord + vec2(w, -h)); 		// up right 
	n[3] = texture2D(u_tex0, coord + vec2(-w, 0.0)); 	// left 
	n[4] = texture2D(u_tex0, coord); 									// center 
	n[5] = texture2D(u_tex0, coord + vec2(w, 0.0)); 	// right 
	n[6] = texture2D(u_tex0, coord + vec2(-w, h)); 		// down left 
	n[7] = texture2D(u_tex0, coord + vec2(0.0, h)); 	// down 
	n[8] = texture2D(u_tex0, coord + vec2(w, h)); 		// down right 
}

vec2 warp(vec2 coord) {
	float blurAmt = texture2D(u_blurMask, vec2(vTexCoord.x, 1.0 - vTexCoord.y)).r;
	if (blurAmt < 0.1) return coord;
  float warp_strength = u_totalMouseDisplace * 0.00001; 
	vec2 grid_size = vec2(noise(coord) * 0.5, noise(coord) * 0.5);
  
  vec2 grid_coord = floor(coord / grid_size);
  vec2 grid_pos = fract(coord / grid_size);
  
	float seed = noise(grid_coord * 1.0); 
  
  if (seed > 0.3) { 
    float angle = fract(sin(seed * 100.0) * 10000.0) * 6.28318;
    vec2 direction = vec2(cos(angle), sin(angle));
    coord += direction * warp_strength;
  }
	return coord; 
}

void main() {
  vec2 coord = vec2(1.0 - vTexCoord.x, 1.0 - vTexCoord.y);
  coord = warp(coord);
  
  vec4 camera_pixel = texture2D(u_tex0, coord);
  float this_brightness = brightness(camera_pixel.rgb);

	vec4 n[9];
	make_kernel(n, coord);
  vec4 sobel_horizontal = n[2] + (2.0 * n[5]) + n[8] - (n[0] + (2.0 * n[3]) + n[6]);
  vec4 sobel_vertical = n[0] + (2.0 * n[1]) + n[2] - (n[6] + (2.0 * n[7]) + n[8]);
	float edge_magnitude = length(sobel_horizontal.rgb) + length(sobel_vertical.rgb);
  if (edge_magnitude > edge_sensitivity || this_brightness < dark_threshold) {
		gl_FragColor = dark_color(); 
	} else if (this_brightness < shadow2_threshold) {
		if (hatch(gl_FragCoord.xy, hatch2_angle, hatch2_distance, hatch2_thickness) || hatch(gl_FragCoord.xy, hatch1_angle, hatch1_distance, hatch1_thickness)) {
			gl_FragColor = hatch2_color(); 
		} else {
			gl_FragColor = bg_color(coord);
		}
	} else if (this_brightness < shadow1_threshold) {
		if (hatch(gl_FragCoord.xy, hatch1_angle, hatch1_distance, hatch1_thickness)) {
			gl_FragColor = hatch1_color(); 
		} else {
			gl_FragColor = bg_color(coord);
		}
  } else {
		gl_FragColor = bg_color(coord); 
	} 
}
`;