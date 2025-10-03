const frag = `

precision mediump float;
varying vec2 vTexCoord;
uniform vec2 u_resolution; 
uniform float u_time;
uniform sampler2D u_video_input; // main camera feed 
uniform sampler2D u_prev_frame_buffer; 
uniform sampler2D u_skeleton_buffer; 
uniform sampler2D u_pose_overlap_buffer; 
uniform bool u_falling; // draw pixels falling? 
uniform float u_pile_height; 

const vec4 bg_color = vec4(0.0, 0.0, 0.0, 1.0);
const float disintegrate_distance = 0.2; // max distance to be not-background 
const float sample_distance = 0.2; 
const float base_color_chance = 0.5; // chance for pixels fully in silhouette to have color 
const float fall_source_size = 0.02; 
const float fall_velocity = 1.5; 
const float pixel_height = 1.0 / 480.0;
vec2 fall_offset = vec2(0.0, fall_velocity / u_resolution.y);

float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

vec2 invertVec2(vec2 coord, bool invertX, bool invertY) {
	float x = invertX ? 1.0 - coord.x : coord.x; 
	float y = invertY ? 1.0 - coord.y : coord.y;
	return vec2(x, y);
}

bool isBlackPixel(vec4 pixel) {
	return pixel.rgb == vec3(0.0);
}

bool isPileColor(vec4 pixel) {
	return dot(pixel.rgb, vec3(0.2125, 0.7154, 0.0721)) > 0.5;
}

vec2 nearestBlackCoord(sampler2D sampler, vec2 coord) {
	vec2 result = coord - disintegrate_distance;
	float min_distance = disintegrate_distance; 
  for (float x = -disintegrate_distance; x <= disintegrate_distance; x += 0.01) {
    for (float y = -disintegrate_distance; y <= disintegrate_distance; y += 0.01) {
      vec2 offset = vec2(x, y);
      vec4 sample = texture2D(sampler, coord + offset);
      if (isBlackPixel(sample)) {  
        float this_dist = length(offset);
        if (this_dist < min_distance) {
          min_distance = this_dist;
					result = coord + offset;
        }
      }
    }
  }
  return result;
}

bool isFallSource(vec2 coord) {
	vec4 skeleton_pixel = texture2D(u_skeleton_buffer, coord);
	vec4 prev_above_pixel = texture2D(u_prev_frame_buffer, coord - vec2(0.0, fall_source_size));
	if (isBlackPixel(prev_above_pixel)) return true; 
	
  for (float y = 0.0; y <= 1.0; y += pixel_height) {
		if (coord.y - y < 0.0) return false;
    vec4 current_pixel = texture2D(u_skeleton_buffer, vec2(coord.x, coord.y - y));
    if (isBlackPixel(current_pixel)) return false;
  }
  return true; 
}

bool isInOverlap(vec2 coord) {
	if (isBlackPixel(texture2D(u_skeleton_buffer, coord))) {
		vec4 overlap_pixel = texture2D(u_pose_overlap_buffer, coord); 
		return isBlackPixel(overlap_pixel); 
	} else {
		for (float y = 0.0; y <= 1.0; y += pixel_height) {
			if (coord.y - y < 0.0) return false; 
			vec4 overlap_pixel = texture2D(u_pose_overlap_buffer, vec2(coord.x, coord.y - y));
			if (isBlackPixel(overlap_pixel)) return true;
		}
	}
	
	return false;
}

void main() {
  vec2 coord = invertVec2(vTexCoord, false, true);
	vec4 camera_pixel = texture2D(u_video_input, invertVec2(vTexCoord, true, true));
	vec4 skeleton_pixel = texture2D(u_skeleton_buffer, invertVec2(vTexCoord, false, true));
	
	vec2 nearest_body = nearestBlackCoord(u_skeleton_buffer, coord);
	float distance_to_body = distance(nearest_body, coord); 
	float chance = (distance_to_body / disintegrate_distance); 
	chance = base_color_chance - pow(chance, 2.0);
	float random_val = rand(coord);
	
	if (random_val < chance) {
		float rand_angle = rand(coord) * 6.28318530718;
		vec2 rand_offset = vec2(cos(rand_angle), sin(rand_angle)) * (disintegrate_distance/2.0);
		vec4 sample = texture2D(u_video_input, invertVec2(nearest_body + rand_offset, true, false));		
		float blendFactor = distance_to_body / disintegrate_distance; 
		blendFactor = pow(blendFactor, 2.0); 
		gl_FragColor = mix(sample, bg_color, blendFactor);
	} else {
		gl_FragColor = bg_color;
	}
	
	if (!isInOverlap(coord) && !isFallSource(coord) && coord.y > 0.0 + pixel_height && u_falling) {
		vec4 falling_pixel = texture2D(u_prev_frame_buffer, coord - fall_offset);
		gl_FragColor = falling_pixel;
	}
	if (coord.y > u_pile_height / u_resolution.y) {
		vec4 prev_pixel = texture2D(u_prev_frame_buffer, coord); 
		if (isPileColor(prev_pixel)) gl_FragColor = prev_pixel;
	}
}
`;