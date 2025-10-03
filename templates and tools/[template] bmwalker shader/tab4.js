// // This line is needed to integrate the shader into OpenProcessing:
// const frag = `

// precision mediump float;
// varying vec2 vTexCoord;

// uniform float u_xpts[15]; 
// uniform float u_ypts[15]; 
// uniform float u_time; 
// uniform float u_progress; 
// uniform vec2 u_mouse; 

// void main() {
//     vec2 coord = vTexCoord;
    
//     float minDist = 1.0;
//     for (int i=0; i<15; i++){
//     	float dx = coord.x - u_xpts[i];
//     	float dy = coord.y - u_ypts[i];
//     	float dist = sqrt(dx*dx + dy*dy);
//     	if (dist < minDist){
//     		minDist = dist;
//     	}
//     }
	 
// 	  const float TWO_PI = 6.283185307179586;
// 	  float r = 6.0 * minDist;
//     float g = u_mouse.y * coord.y;
//     float b = 0.5 + 0.5 * cos(TWO_PI * u_progress);
//     gl_FragColor = vec4(r,g,b, 1.00 ); 
// }


// `;
// // This line is needed to integrate the shader into OpenProcessing