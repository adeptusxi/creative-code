// The AI Stable Diffusion process is managed by this code. 
// There's nothing to modify here, unless you know what you're doing. 

let network, generator;
let patch, patchNoise, patchNoiseLevel, patchLowRes, patchCoords, patchGuidance, outputBuf;
let denoised64x64imagep5; // a p5.js version of the denoised image
let ratio; // The ratio between the input and output image sizes
let iteration = 0; // The current iteration of the diffusion process
let nTotalIterations = 0; 

function initAI(){
	initializeModelVariables();
	loadNetwork();
}

function initializeModelVariables() {
  const inC = 3; // number of channels
  const inW = 64; // width of input
  const inH = 64; // height of input
  const inNumVals = inC * inW * inH; 
	ratio = 512 / inW; 

  patch = new ort.Tensor("float32", new Float32Array(inNumVals), [1, inC, inH, inW]);
  patchNoise = new ort.Tensor("float32", new Float32Array(inNumVals), [1, inC, inH, inW]);
  patchNoiseLevel = new ort.Tensor("float32", new Float32Array(1), [1, 1, 1, 1]);
  patchLowRes = new ort.Tensor("float32", new Float32Array(inNumVals), [1, inC, inH, inW]);
  patchCoords = new ort.Tensor("float32", new Float32Array(inNumVals), [1, inC, inH, inW]);
  patchGuidance = new ort.Tensor("float32", new Float32Array(inNumVals), [1, inC, inH, inW]);
  outputBuf = new ImageData(new Uint8ClampedArray(inH * inW * 4 * ratio * ratio), inW*ratio, inH*ratio);
  outputBuf.data.fill(255);
	
	denoised64x64imagep5 = createImage(inW,inH);
}

async function loadNetwork() {
  try {
    network = await ort.InferenceSession.create('./'+modelFileName, { 
      executionProviders: ['webgl'] 
    });
    // console.log('Network loaded.');
    generator = makeGenerator( 
      network, patch, patchNoise, patchNoiseLevel, patchLowRes, 
      patchCoords, patchGuidance, outputBuf);
    sendImageData();
  } catch (error) {
    console.error('Failed to load the network:', error);
  }
}

function sendImageData() {
  // Here, we copy the data from the user's input into the patchGuidance tensor.
	iteration = 0; 
  outputGraphics.background(255);
  inputGraphics.loadPixels(); 
  let imageData = inputGraphics.get();
  let nPixels = imageData.width * imageData.height;
  imageData.loadPixels();
  for (let c = 0; c < 3; c++) {
    for (let i = 0; i < nPixels; i++) {
      let srcVal = imageData.pixels[4 * i + c] / 255.0;
      let dstIndex = c * nPixels + i;
      patchGuidance.data[dstIndex] = srcVal;
    }
  }
  resample();
  regenerate();
}


// Taken from the original DinoDiffusion script.js file.
function resample() {
  for (let i = 0; i < patchNoise.data.length; i++) patchNoise.data[i] = Math.random();
}

// Adapted from the original DinoDiffusion script.js file.
function regenerate() {
  generator(
		[nSteps, 
    Math.max(1, Math.floor(nSteps / 10)), 
    Math.max(1, Math.floor(nSteps / 20)), 
    Math.max(1, Math.floor(nSteps / 25))]);
	
	nTotalIterations = nSteps * 1 + 
    Math.max(1, Math.floor(nSteps / 10)) * 9 + 
    Math.max(1, Math.floor(nSteps / 20)) * 25 + 
    Math.max(1, Math.floor(nSteps / 25)) * 81; 
}

// set up image generator
function makeGenerator(
  network, patch, patchNoise, patchNoiseLevel, patchLowRes, 
  patchCoords, patchGuidance, outputBuf) {
  
  // single step of denoising
  async function generatePatch(tsk) {

    // useful stuff
    const [nlIn, nlOut] = [noiseLevelSchedule(1 - tsk.step / tsk.steps), noiseLevelSchedule(1 - (tsk.step + 1) / tsk.steps)];
    const [h, w] = [patch.dims[2], patch.dims[3]];
    
    // fill input information
    patchNoiseLevel.data[0] = nlIn;
    if (tsk.step == 0) {
      // fill working image
      for (let i = 0; i < patch.data.length; i++) {
        patch.data[i] = patchNoise.data[i];
      }
      // fill lowres image
      for (let i = 0; i < patchLowRes.data.length; i++) {
        patchLowRes.data[i] = (tsk.stage == 0) ? -1 : 
          outputBuf.data[patchIndexToImageIndex(i, tsk, h, w, outputBuf.height, outputBuf.width)] / 255.0;
      }
      // fill coords
      for (let i = 0; i < patchCoords.data.length; i++) {
        const coords = patchIndexToImageCoords(i, tsk, h, w);
        patchCoords.data[i] = coords.c == 0 ? (coords.x / outputBuf.width) : (coords.c == 1 ? (coords.y / outputBuf.height) : 1);
      }
      // fill guidance
      if (tsk.stage > 0) {
        for (let i = 0; i < patchGuidance.data.length; i++) {
          patchGuidance.data[i] = 1;
        }
      }
    }

    // perform denoising step
    const denoised = (await network.run({
      "x": patch, 
      "noise_level": patchNoiseLevel, 
      "x_lowres": patchLowRes, 
      "x_coords": patchCoords, 
      "x_cond": patchGuidance})).denoised;

    // update working image
    const alpha = nlOut / nlIn;
    for (let i = 0; i < patch.data.length; i++) {
        patch.data[i] = alpha * patch.data[i] + (1 - alpha) * denoised.data[i];
    }

    // update rendering
    writePatchToImageWithFancyOverlapHandling(denoised, tsk, outputBuf);
    renderResult(denoised);
    updateComposite(tsk); 
  }
	
	
  function renderResult(denoised) {
    if (denoised && denoised.data && denoised.data.length > 0) {
      // Copy the denoised image into the denoised64x64imagep5 image.
      // Note: the color channels are separated in the denoised tensor.
      denoised64x64imagep5.loadPixels();
      let nDenoisedPixels = denoised64x64imagep5.width * denoised64x64imagep5.height;
      let dstIndex = 0; 
      for (let y = 0; y < denoised64x64imagep5.height; y++) {
        for (let x = 0; x < denoised64x64imagep5.width; x++) {
          let loc =  y * denoised64x64imagep5.width + x;
          let r = int(denoised.data[loc] * 255.0); loc+=nDenoisedPixels;
          let g = int(denoised.data[loc] * 255.0); loc+=nDenoisedPixels;
          let b = int(denoised.data[loc] * 255.0);
          denoised64x64imagep5.pixels[dstIndex++] = r; 
          denoised64x64imagep5.pixels[dstIndex++] = g; 
          denoised64x64imagep5.pixels[dstIndex++] = b; 
          denoised64x64imagep5.pixels[dstIndex++] = 255; 
        }
      }
      denoised64x64imagep5.updatePixels();
    }
  }

  let generationHandle = null;
  function generate(stepsPerResolution) {
      // plan out the work we'll need for this image generation
      let patchTaskQueue = [];
      for (let i = 0; i < stepsPerResolution.length; i++) {
          const steps = stepsPerResolution[i];
          // extra patch here (the + 1) so we get some patch overlap and no ugly edges
          const patchesPerSide = i == 0 ? 1 : ((1 << i) + 1);
          const patchSidePx = Math.round(patch.dims[2] / patchesPerSide) * Math.round(outputBuf.width / patch.dims[2]);
          const tasksInStage = patchesPerSide * patchesPerSide * steps;
          for (let t = 0; t < tasksInStage; t++) {
              const [patchY, patchX, step] = [Math.floor(t / patchesPerSide / steps), Math.floor(t / steps) % patchesPerSide, t % steps];
              patchTaskQueue.push({
                  "stage": i, "step": step, "steps": steps,
                  "xIn": patchX * patchSidePx, "yIn": patchY * patchSidePx, "hwIn": Math.round(outputBuf.width / (1 << i)),
                  "xOut": patchX * patchSidePx, "yOut": patchY * patchSidePx, "hwOut": patchSidePx,
                  "progress": (t + 1) / tasksInStage
              });
          }
      }
      // if we're already generating something, stop doing that
      if (generationHandle) window.clearTimeout(generationHandle);
      // start generating the new thing
      const minFrameTime_ms = 10;
      function generateNextPatchInQueue() {
          if (patchTaskQueue.length == 0) return renderResult({"done": true});
          generatePatch(patchTaskQueue.shift()).then(() => {
              generationHandle = window.setTimeout(generateNextPatchInQueue, minFrameTime_ms);
          });
      }
      generationHandle = window.setTimeout(generateNextPatchInQueue, minFrameTime_ms);
  }
  return generate;
}

function writePatchToImageWithFancyOverlapHandling(patch, tsk, outputBuf) {
  const [h, w] = [patch.dims[2], patch.dims[3]];
  const overlap = ((tsk.hwIn - tsk.hwOut) + 1);
  for (let y = tsk.yIn; y < tsk.yIn + tsk.hwIn && y < outputBuf.height; y++) {
    for (let x = tsk.xIn; x < tsk.xIn + tsk.hwIn && x < outputBuf.width; x++) {
      const py = constrain(Math.round((y - tsk.yIn + 0.5) / tsk.hwIn * h - 0.5), 0, h - 1);
      const px = constrain(Math.round((x - tsk.xIn + 0.5) / tsk.hwIn * w - 0.5), 0, w - 1);
      let alphaX = constrain((y - tsk.yIn) / overlap + (tsk.yIn == 0), 0, 1);
      let alphaY = constrain((x - tsk.xIn) / overlap + (tsk.xIn == 0), 0, 1)
      let alpha = Math.min(alphaX, alphaY);
      for (let c = 0; c < 3; c++) {
        let v = 255 * patch.data[c * (h * w) + py * w + px];
        v = alpha * v + (1 - alpha) * outputBuf.data[(y * outputBuf.width + x) * 4 + c];
        outputBuf.data[(y * outputBuf.width + x) * 4 + c] = v;
      }
    }
  }
}

function updateComposite(tsk){ 
	let hw = tsk.hwIn;
	let px = tsk.xIn; let py = tsk.yIn;
	outputGraphics.image(denoised64x64imagep5, px,py,hw,hw);
	iteration++;
}

function displayOutputGraphics (px,py, pw,ph){
	image(outputGraphics, 512,0,512,512); 
	if (iteration < nTotalIterations){
		fill(0); 
		noStroke(); 
		text(iteration + "/" + nTotalIterations, 512+20,30); 
	}
}

function patchIndexToImageCoords(i, tsk, h, w) {
  const c = Math.floor(i / (h * w));
  const y = (Math.floor(i / w) % h + 0.5) / h * tsk.hwIn + tsk.yIn - 0.5;
  const x = (i % w + 0.5) / w * tsk.hwIn + tsk.xIn - 0.5;
  return {y, x, c};
}

function patchIndexToImageIndex(i, tsk, h, w, oh, ow) {
  const coords = patchIndexToImageCoords(i, tsk, h, w);
  const outY = constrain(Math.round(coords.y), 0, oh - 1);
  const outX = constrain(Math.round(coords.x), 0, ow - 1);
  return (outY * ow + outX) * 4 + coords.c;
}

function noiseLevelSchedule(x) {
  const k = 0.2;
  return x * (1 + k) / (x + k);
}