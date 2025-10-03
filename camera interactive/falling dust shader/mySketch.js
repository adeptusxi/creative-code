// body tracking 
let body_widths; 
let ignore_keypoints; 

// shader 
let particles_shader; 
let prev_frame_buffer; // the final image of the previous frame 
let skeleton_buffer; // black silhouettes of detected bodies on white background 
let pose_overlap_buffer; // black circles of detected body overlaps on white background 
let touch_threshold = 50; // distance in pixels that counts as touching 
let pile_height; // y value of top of pile 
let pile_growth_inc = 0.015; // pixels per frame for pile to rise 

// camera 
let video;
let video_loaded = false;
let frames_wait_to_fall = 10; 
let frames_waited = 0;

function preload() {
  bodyPose = ml5.bodyPose("BlazePose", options);
}

function setup() {
  createCanvas(640, 480, WEBGL);
	particles_shader = new p5.Shader(this.renderer, vert, frag);
	skeleton_buffer = createGraphics(width, height);
	prev_frame_buffer = createGraphics(width, height); 
	pose_overlap_buffer = createGraphics(width, height); 
	
	pile_height = height; 
	
	body_widths = new Array(options.maxPoses); 
  for (let i = 0; i < body_widths.length; i++) {
    body_widths[i] = 0; 
  }

  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
	video.elt.onloadedmetadata = () => {
    video_loaded = true; 
  };

  bodyPose.detectStart(video, gotPoses);
  connections = bodyPose.getSkeleton();
	ignore_keypoints = [
		ML5BODY_NOSE,
		ML5BODY_LEFT_EYE_INNER,
		ML5BODY_LEFT_EYE,
		ML5BODY_LEFT_EYE_OUTER,
		ML5BODY_RIGHT_EYE_INNER,
		ML5BODY_RIGHT_EYE,
		ML5BODY_RIGHT_EYE_OUTER,
		ML5BODY_LEFT_EAR,
		ML5BODY_RIGHT_EAR,
		ML5BODY_MOUTH_LEFT,
		ML5BODY_MOUTH_RIGHT
	];
}

function draw() {
	if (!video_loaded) {
		fill(0);
		rect(-width/2, -height/2, width, height);
		return; 
	}
	
	updateBodyWidths(); 
	updateSkeletonBuffer(); 
	updatePoseOverlapBuffer();
	
	particles_shader.setUniform('u_resolution', [width, height]);
	particles_shader.setUniform('u_time', millis() / 1000.0);
	particles_shader.setUniform('u_video_input', video); 
	particles_shader.setUniform('u_prev_frame_buffer', prev_frame_buffer);
	particles_shader.setUniform('u_skeleton_buffer', skeleton_buffer);
	particles_shader.setUniform('u_pose_overlap_buffer', pose_overlap_buffer);
	particles_shader.setUniform('u_falling', frames_waited >= frames_wait_to_fall);
	particles_shader.setUniform('u_pile_height', pile_height); 
	
	shader(particles_shader);
	rect(0, 0, width, height);
	
	prev_frame_buffer.image(get(), 0, 0, width, height);
	if (pile_height <= height) pile_height -= pile_growth_inc;
	if (frames_waited < frames_wait_to_fall) frames_waited++; 
}

function updateBodyWidths() {
	for (let i = 0; i < poses.length; i++) {
		let pose = poses[i];
		body_widths[i] = abs(pose.keypoints[ML5BODY_LEFT_SHOULDER].x - pose.keypoints[ML5BODY_RIGHT_SHOULDER].x);
	}
}

function updateSkeletonBuffer() {
	push(); 
	translate(-width / 2, -height / 2);
	
	skeleton_buffer.background('white'); 
	
	skeleton_buffer.stroke(0); 
  // draw limbs (adapted from Golan Levin @ https://openprocessing.org/sketch/2417039)
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i];
		let stroke_size = map(body_widths[i], 0, width, 0, 75);
    for (let j = 0; j < connections.length; j++) {
      let pointAIndex = connections[j][0];
      let pointBIndex = connections[j][1];
			if (ignore_keypoints.includes(pointAIndex)
			 		|| ignore_keypoints.includes(pointBIndex)) continue;
      let pointA = pose.keypoints[pointAIndex];
      let pointB = pose.keypoints[pointBIndex];
      // estimate connections for upper bodies 
			let a = pointA.confidence > 0.1 ? pointA : {x: width/2, y: height*2};
			let b = pointB.confidence > 0.1 ? pointB : {x: width/2, y: height*2};
			skeleton_buffer.strokeWeight(stroke_size);
			skeleton_buffer.line(a.x, a.y, b.x, b.y);
    }
  }

	skeleton_buffer.noStroke();
	skeleton_buffer.fill(0);
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i];
		
		// draw all the tracked landmark points (adapted from Golan Levn @ https://openprocessing.org/sketch/2417039)
		let stroke_size = map(body_widths[i], 0, width, 0, 150);
    for (let j = 0; j < pose.keypoints.length; j++) {
			if (ignore_keypoints.includes(j)) continue;
      let keypoint = pose.keypoints[j];
      // Only draw a circle if the keypoint's confidence is bigger than 0.1
      if (keypoint.confidence > 0.1) {
        skeleton_buffer.circle(keypoint.x, keypoint.y, stroke_size);
      }
    }
	
		// draw torso 
		let l_shoulder = pose.keypoints[ML5BODY_LEFT_SHOULDER]; 
		let r_shoulder = pose.keypoints[ML5BODY_RIGHT_SHOULDER]; 
		if (l_shoulder.confidence > 0.1 
			  && r_shoulder.confidence > 0.1) {
			let l_hip = pose.keypoints[ML5BODY_LEFT_HIP]; 
			let r_hip = pose.keypoints[ML5BODY_RIGHT_HIP];
			// estimate hips for upper bodies 
			let torso_width = abs(l_shoulder.x - r_shoulder.x); 
			let torse_height = abs(l_shoulder.y - r_shoulder.y) * 2; 
			if (l_hip.confidence <= 0.1) l_hip = {x: width/2, y: height*2}; 
			if (r_hip.confidence <= 0.1) r_hip = {x: width/2, y: height*2}; 
			skeleton_buffer.beginShape(); 
				skeleton_buffer.vertex(l_shoulder.x, l_shoulder.y); 
				skeleton_buffer.vertex(r_shoulder.x, r_shoulder.y); 
				skeleton_buffer.vertex(r_hip.x, r_hip.y); 
				skeleton_buffer.vertex(l_hip.x, l_hip.y); 
			skeleton_buffer.endShape(); 
		}
		
		// draw head 
		let nose = pose.keypoints[ML5BODY_NOSE];
		let mid_shoulder = {x: (l_shoulder.x + r_shoulder.x) / 2, y: (l_shoulder.y + r_shoulder.y) / 2};
		let l_eye = pose.keypoints[ML5BODY_LEFT_EYE]; 
		let r_eye = pose.keypoints[ML5BODY_RIGHT_EYE];
		if (nose.confidence > 0.1 
				&& l_eye.confidence > 0.1 
				&& r_eye.confidence > 0.1) {
			let nose_eye_dist = abs(nose.y - (l_eye.y + r_eye.y) / 2);
			let angle = atan2(nose.y - mid_shoulder.y, nose.x - mid_shoulder.x) - HALF_PI;
			skeleton_buffer.push();
			skeleton_buffer.translate(nose.x, nose.y - nose_eye_dist*0.5);
			skeleton_buffer.rotate(angle);
			skeleton_buffer.ellipse(0, 0, stroke_size * 1.75, stroke_size * 2.5);
			skeleton_buffer.pop();
		}
		
		// draw neck 
		skeleton_buffer.stroke(0); 
		skeleton_buffer.strokeWeight(stroke_size * 0.75);
		skeleton_buffer.line(nose.x, nose.y, mid_shoulder.x, mid_shoulder.y);
  }
	
	pop();
}

// overlap calculation from chatGPT 
function updatePoseOverlapBuffer() {
	push(); 
	translate(-width / 2, -height / 2);
	
	pose_overlap_buffer.background('white');
	pose_overlap_buffer.fill(0);
  pose_overlap_buffer.noStroke();
	
  for (let i = 0; i < poses.length; i++) {
    let poseA = poses[i];
		for (let j = i + 1; j < poses.length; j++) { 
		// for (let j = 0; j < poses.length; j++) { // single person overlap test 
      let poseB = poses[j];
				for (let k = 0; k < poseA.keypoints.length; k++) {
          let keypointA = poseA.keypoints[k];
					if (keypointA.confidence < 0.1) continue;
					for (let l = 0; l < poseB.keypoints.length; l++) {
            let keypointB = poseB.keypoints[l];
						if (keypointB.confidence < 0.1) continue;
						// if (keypointA == keypointB) continue; // single person overlap test 
						let distance = dist(keypointA.x, keypointA.y, keypointB.x, keypointB.y);
            if (distance < touch_threshold) {
              let midX = (keypointA.x + keypointB.x) / 2;
              let midY = (keypointA.y + keypointB.y) / 2;
							let size = body_widths[i] + body_widths[j] / 2;
							size = map(size, 0, width, 0, 150);
              pose_overlap_buffer.ellipse(midX, midY, size); 
            }
          }
        }
    }
  }

	pop();
}

function isWhitePixel(pixel) {
	return pixel[0] == 255 && pixel[1] == 255 && pixel[2] == 255;
}