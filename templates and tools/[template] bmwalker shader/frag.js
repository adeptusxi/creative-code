// This line is needed to integrate the shader into OpenProcessing:
const frag = `

precision mediump float;
varying vec2 vTexCoord;

uniform float u_xpts[15];
uniform float u_ypts[15];
uniform float u_time;
uniform vec2 u_resolution;

float INK_SPREAD = 0.1;
float INK_DENSITY = 0.75;
float NOISE_SCALE = 20.0;
float STROKE_FADE = 0.9;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    f = f * f * (3.0 - 2.0 * f);
    
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float inkLineEffect(vec2 coord, vec2 start, vec2 end) {
    vec2 lineDir = normalize(end - start);
    vec2 perpDir = vec2(-lineDir.y, lineDir.x);
    float lineDist = dot(coord - start, perpDir);
    float t = dot(coord - start, lineDir) / length(end - start);
    float inkIntensity = INK_DENSITY * exp(-pow(abs(lineDist / INK_SPREAD), 2.0)) * smoothstep(0.0, 1.0, t) * smoothstep(1.0, 0.0, t);
    
    // Add some noise for texture
    inkIntensity *= 0.5 + 0.5 * noise(coord * NOISE_SCALE + u_time);
    return inkIntensity;
}

void main() {
    vec2 uv = vTexCoord;
    vec3 inkColor = vec3(1.0); // Start with a white background

    for (int i = 0; i < 14; i++) { // Connect points in sequence
        vec2 startPos = vec2(u_xpts[i], u_ypts[i]);
        vec2 endPos = vec2(u_xpts[i + 1], u_ypts[i + 1]);

        float ink = inkLineEffect(uv, startPos, endPos);
        inkColor -= vec3(ink * STROKE_FADE, ink * STROKE_FADE, ink * STROKE_FADE * 0.8); // Darken the line slightly
    }

    gl_FragColor = vec4(inkColor, 1.0); // Output the final ink effect
}
`;
// This line is needed to integrate the shader into OpenProcessing