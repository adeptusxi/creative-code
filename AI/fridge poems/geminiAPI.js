/**
 * Version: 0.1.5 adds ask Gemini with Audio
 * Last updated: 08-22-2024
 *
 * This file contains helper functions for quick experiments with the Google Gemini API.
 * It currently defaults to using the Gemini 1.5 Flash model, but can be configured to use other models.
 *
 * You'll need to provide your own API Key (the app will prompt the user for it).
 *
 * How to obtain a Google AI Studio developer test API key:
 *
 * 1. Go to the Google AI Studio website: https://ai.google.dev/aistudio
 * 2. Sign in with your Google account
 * 3. Navigate to the API Keys section (the blue "Get API Key" button on the top left)
 * 4. Click on the "Create API Key" button
 * 5. Follow the prompts to create a new project or select an existing one.
 * 6. Enable the Gemini API for your project.
 * 7. Copy the generated API key and paste it into the "API KEY" input field in the web application.
 *
 * Note: Make sure to keep your API key secure and avoid sharing it publicly.
 */

// Global variable for the last response
let geminiResponse = "";

// Singleton to store state and core functionality
const GeminiAPI = (function () {
  return {
    // whether or not to maintain a transcript of previous messages sent and received
    maintainHistory: false,
    // the transcript of previous messages sent and received while conversationMode is enabled
    history: [],
    generationConfig: {},
    safetySettings: [],
    modelName: "gemini-1.5-flash",
    preventConcurrentRequests: true,
    isWaitingForResponse: false,
    getCanvas: function () {
      return document.getElementById("defaultCanvas0");
    },

    /**
     * Sends a request to the Gemini API. You can use this method
     * directly for direct access to the APIs capabilities (rather than
     * the provided p5js helper functions)
     *
     * @param {Object} postData - the request object to send to Gemini
     * API - see https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/inference
     * for this object reference.
     *
     * Note that The Gemini API provides safety settings that you can
     * adjust during the prototyping stage to determine if your
     * application requires more or less restrictive safety configuration.
     * see https://ai.google.dev/gemini-api/docs/safety-settings for how
     * to set these.
     */

    sendToGeminiRaw: function (postData, callback) {
      let geminiApiKey = getItem("geminiApiKey");
      if (geminiApiKey === null) {
        geminiApiKey = prompt("Gemini API key");
        storeItem("geminiApiKey", geminiApiKey);
      }

      // Construct the API URL with the user's API key and selected model
      let url = `https://generativelanguage.googleapis.com/v1beta/models/${this.modelName}:generateContent?key=${geminiApiKey}`;

      function onError(error) {
        console.log("error incoming", error);
        console.error(error);
      }

      if (
        GeminiAPI.preventConcurrentRequests == true &&
        GeminiAPI.isWaitingForResponse === true
      ) {
        console.log(
          `[GeminiAPI.js] Your last request to the Gemini API has been ignored by geminiAPI.js because your previous one hasn't returned yet. Use throttleGeminiRequests(false) to allow concurrent requests.`
        );
        return;
      }
      GeminiAPI.isWaitingForResponse = true;

      fetch(url, {
        method: "POST",
        body: JSON.stringify(postData),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(
          (result) => result.json(),
          function (error) {
            GeminiAPI.isWaitingForResponse = false;
            console.error("GeminiAPI.js:", error.message);
            if (typeof onGeminiError === "function") {
              onGeminiError(error.message);
            }
          }
        )
        .then((result) => {
          GeminiAPI.isWaitingForResponse = false;
          // Log the full API response to the console for debugging
          if (result.candidates) {
            // if a candidate object has been returned
            if (result.candidates[0].finishReason !== "STOP") {
              let errorMessage = `[GeminiAPI.js] Gemini finished with reason ${result.candidates[0].finishReason}`;
              console.error(errorMessage);
              if (typeof onGeminiError === "function") {
                onGeminiError(errorMessage);
              }
            } else {
              // Extract the generated text from the response
              let lastGemStr = result.candidates[0].content.parts[0].text;
              geminiResponse = lastGemStr;
            }
          } else if (result.error) {
            let errorMessage = `[GeminiAPI.js] Gemini did not return with a valid response object, reason: ${result.error.message}`;
            console.error(errorMessage);
            if (typeof onGeminiError === "function") {
              onGeminiError(errorMessage);
            }
            if (
              result.error.status === "PERMISSION_DENIED" ||
              result.error.status === "INVALID_ARGUMENT"
            ) {
              console.log(
                `[GeminiAPI.js] You are likely missing or have entered a wrong API KEY, visit https://ai.google.dev/aistudio to obtain a Gemini API Key and copy it into the pop-up window.`
              );
              resetGeminiApiKey();
            }
          }
          // if we are in chat mode, push the response into the history
          if (GeminiAPI.maintainHistory) {
            GeminiAPI.history.push({
              role: "model",
              parts: [{ text: geminiResponse }],
            });
          }

          if (typeof callback === "function") {
            callback(geminiResponse);
          }

          if (typeof onGeminiResponse === "function") {
            onGeminiResponse(geminiResponse);
          }
          if (typeof geminiCallback === "function") {
            geminiCallback(geminiResponse);
          }
        });
    },

    /**
     * Sends a request to the Gemini API
     * @param {Array} parts - Array of content parts to send to Gemini
     * @param {function} geminiCallback - Callback function to handle the response
     * @param {Object} generationConfig - Configuration for the Gemini API request
     * @param {Object} safetySettings - safetySettings for the Gemini API request
     */
    sendToGemini: function (
      parts,
      geminiCallback,
      generationConfig = {},
      safetySettings = []
    ) {
      let contents = [];
      const content = {
        role: "user",
        parts,
      };
      if (GeminiAPI.maintainHistory) {
        contents = GeminiAPI.history;
      }
      contents.push(content);
      // Prepare the data to be sent in the request
      let postData = {
        contents,
        generationConfig,
        safetySettings,
      };
      GeminiAPI.sendToGeminiRaw(postData, geminiCallback);
    },
    /**
     * Converts a p5.Image to a base64 encoded string
     * @param {p5.Image} img - The p5.Image object to convert
     * @returns {string} Base64 encoded image data
     */
    getBase64PartFromImage: function (img) {
      let canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext("2d").drawImage(img, 0, 0);
      return canvas.toDataURL("image/png").split(",")[1];
    },
    getCanvasInlineDataPart: function () {
      const canvasData = GeminiAPI.getCanvas().toDataURL().split("base64,")[1];
      return { inlineData: { mimeType: "image/png", data: canvasData } };
    },
  };
})();

/**
 * if `true` then a transcript of your conversation is maintained
 * and sent with each following request
 */
function enableGeminiHistory(isEnabled) {
  GeminiAPI.maintainHistory = isEnabled;
}

/**
 * calling this will empty the transcript while in conversation mode
 */
function resetGeminiHistory() {
  GeminiAPI.history = [];
}

/**
 * Sends a text prompt to the Gemini API
 * @param {string} promptStr - The text prompt to send to Gemini
 * @param {function} callback - Optional callback function to handle the response
 */
function askGemini(promptStr, callback) {
  const parts = [{ text: promptStr }];
  GeminiAPI.sendToGemini(parts, callback, GeminiAPI.generationConfig);
  return parts;
}

/**
 * Sends a text prompt along with the current canvas state to the Gemini API
 * @param {string} promptStr - The text prompt to send to Gemini
 * @param {function} callback - Optional callback function to handle the response
 */
function askGeminiWithCanvas(promptStr, callback) {
  const canvasData = GeminiAPI.getCanvas().toDataURL().split("base64,")[1];
  const parts = [{ text: promptStr }, GeminiAPI.getCanvasInlineDataPart()];
  GeminiAPI.sendToGemini(
    parts,
    callback,
    GeminiAPI.generationConfig,
    GeminiAPI.safetySettigns
  );
  return parts;
}

/**
 * Resets the stored Gemini API key
 * (user will be prompted to enter a new one via a pop-up)
 */
function resetGeminiApiKey() {
  removeItem("geminiApiKey");
}

/**
 * Disables/Enables throttling of concurrent requests to Gemini
 * @param {boolean} isThrottled - When true (default) your request will be ignored until the last one returns
 */
function throttleGeminiRequests(isThrottled) {
  GeminiAPI.preventConcurrentRequests = isThrottled;
}

/**
 * Sends a text prompt along with an image to the Gemini API
 * @param {string} promptStr - The text prompt to send to Gemini
 * @param {string|p5.Image} img - Either a URL string or a p5.Image object
 * @param {function} callback - Optional callback function to handle the response
 */
function askGeminiWithImage(promptStr, img, callback) {
  processImageForGemini(
    img,
    (imageData) => {
      const parts = [
        { text: promptStr },
        { inlineData: { mimeType: "image/png", data: imageData } },
      ];
      GeminiAPI.sendToGemini(
        parts,
        callback,
        GeminiAPI.generationConfig,
        GeminiAPI.safetySettigns
      );
    },
    typeof onGeminiError === "function" ? onGeminiError : undefined
  );
}

/**
 * Processes the image input and returns base64 encoded image data
 * @param {string|p5.Image} img - Either a URL string or a p5.Image object
 * @param {function} callback - Callback function to handle the processed image data
 * @param {function} onError - Callback for when an error occurs on image processing
 */
function processImageForGemini(img, callback, onError) {
  if (typeof img === "string") {
    // If image is a URL string
    loadImage(img, (imgData) => {
      callback(GeminiAPI.getBase64PartFromImage(imgData.canvas));
    });
  } else if (img instanceof p5.Image) {
    // If image is a p5.Image object
    callback(GeminiAPI.getBase64PartFromImage(img.canvas));
  } else if (img instanceof p5.MediaElement) {
    // If image is a p5.MediaElement object
    callback(GeminiAPI.getBase64PartFromImage(img.canvas));
  } else {
    let errorMessage =
      "Invalid image input. Please provide a URL or a p5.Image object.";
    console.error(errorMessage);
    if (typeof onError === "function") {
      onError(errorMessage);
    }
  }
}

/**
 * Sends a text prompt along with an audio blob to the Gemini API
 * @param {string} promptStr - The text prompt to send to Gemini
 * @param {Blob} audio - the audio blob to send to Gemini
 * @param {function} callback - Optional callback function to handle the response
 */
function askGeminiWithAudio(promptStr, audio, callback) {
  processAudioBlobForGemini(
    audio,
    (audioData) => {
      const parts = [
        { text: promptStr },
        { inlineData: { mimeType: audio.type.split(";")[0], data: audioData } },
      ];
      GeminiAPI.sendToGemini(
        parts,
        callback,
        GeminiAPI.generationConfig,
        GeminiAPI.safetySettigns
      );
    },
    typeof onGeminiError === "function" ? onGeminiError : undefined
  );
}

/**
 * Processes an audio blob and returns base64 encoded audio data
 * @param {Blob} blob - Audio blob
 * @param {function} callback - Callback function to handle the processed audio data
 */
function processAudioBlobForGemini(blob, callback) {
  blob.arrayBuffer().then((buffer) => {
    let audioData = bufferToBase64(buffer);
    callback(audioData);
  });
}

// Util function that converst a buffer to a base64 string
function bufferToBase64(buffer) {
  var bytes = new Uint8Array(buffer);
  var len = buffer.byteLength;
  var binary = "";
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}
