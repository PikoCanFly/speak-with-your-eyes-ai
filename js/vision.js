import { FaceLandmarker, FilesetResolver, DrawingUtils } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/vision_bundle.js";
import { appState } from './state.js';
import * as DOM from './dom.js';

/**
 * Creates and initializes the MediaPipe FaceLandmarker.
 * @returns {Promise<FaceLandmarker>} A promise that resolves to the FaceLandmarker instance.
 */
export async function createFaceLandmarker() {
    DOM.statusDiv.textContent = "Downloading model...";
    const resolver = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm");
    const landmarker = await FaceLandmarker.createFromOptions(resolver, {
        baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
            delegate: "GPU"
        },
        outputFaceBlendshapes: true,
        outputFaceLandmarks: true,
        runningMode: "VIDEO",
        numFaces: 1
    });
    return landmarker;
}

/**
 * Sets up the user's webcam and attaches it to the video element.
 * @returns {Promise<void>} A promise that resolves when the camera is ready.
 */
export async function setupCamera() {
    DOM.statusDiv.textContent = "Setting up camera...";
    const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
    DOM.video.srcObject = stream;
    return new Promise((resolve) => {
        DOM.video.addEventListener("loadeddata", resolve);
    });
}

/**
 * Draws the face mesh and eye outlines on the canvas if enabled.
 * @param {Object} results - The detection results from FaceLandmarker.
 */
export function drawFaceMesh(results) {
    // This function is only active if the "Show Face Mesh" toggle is on.
    if (!appState.showFaceMesh) return;
    
    const drawingUtils = new DrawingUtils(DOM.canvasCtx);
    for (const landmarks of results.faceLandmarks) {
        // Draw the full face wireframe (tessellation) in a faint color
        drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_TESSELATION, { color: "#C0C0C070", lineWidth: 1 });
        
        // Draw the outlines for the eyes in a prominent color and thickness
        drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE, { color: "#39FF14", lineWidth: 2 });
        drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LEFT_EYE, { color: "#39FF14", lineWidth: 2 });
        // drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LIPS, { color: "#39FF14", lineWidth: 2 });
    }
}