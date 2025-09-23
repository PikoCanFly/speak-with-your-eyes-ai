import { appState } from './state.js';
import * as DOM from './dom.js';
import * as Audio from './audio.js';
import * as UI from './ui.js';
import * as Vision from './vision.js';
import * as Detection from './detection.js';
import * as Actions from './actions.js';

/**
 * Manages the state of head turns to handle repeating actions like backspace.
 * @param {'left' | 'right' | null} turnState - The current orientation of the head.
 */
function manageTurnState(turnState) {
    // Case 1: Head is turned left.
    if (turnState === 'left') {
        // If a repeating timer isn't already running, start one.
        if (!appState.backspaceIntervalId) {
            Actions.handleLeftTurn(); // Trigger the first backspace immediately.
            // After the first one, set an interval to repeat every 500ms.
            appState.backspaceIntervalId = setInterval(() => {
                Actions.handleLeftTurn();
            }, 500);
        }
    }
    // Case 2: Head is turned right.
    else if (turnState === 'right') {
        // Stop any backspace repeating if the user quickly turns right.
        if (appState.backspaceIntervalId) {
            clearInterval(appState.backspaceIntervalId);
            appState.backspaceIntervalId = null;
        }
        Actions.handleRightTurn(); // Right turn is a single, non-repeating action.
    }
    // Case 3: Head is centered (or not turned).
    else {
        // If the user's head is no longer turned left, stop the timer.
        if (appState.backspaceIntervalId) {
            clearInterval(appState.backspaceIntervalId);
            appState.backspaceIntervalId = null;
            Actions.resetGestureSequence(); // Also reset combo sequence
        }
        // cooldown for the one-shot right turn gets to tick down.
        if (appState.turnCooldownCounter > 0) {
            appState.turnCooldownCounter--;
        }
    }
}

/**
 * The main prediction loop, called on every frame.
 */
async function predictWebcam() {
    // Ensure video is ready
    if (DOM.video.readyState < 2) {
        window.requestAnimationFrame(predictWebcam);
        return;
    }

    // Only run if the video frame has changed
    if (DOM.video.currentTime !== appState.lastVideoTime) {
        appState.lastVideoTime = DOM.video.currentTime;

        const results = appState.faceLandmarker.detectForVideo(DOM.video, Date.now());

        DOM.canvasCtx.save();
        DOM.canvasCtx.clearRect(0, 0, DOM.canvasElement.width, DOM.canvasElement.height);

        if (results.faceBlendshapes?.length > 0) {
            const { faceBlendshapes, faceLandmarks } = results;
            
            Vision.drawFaceMesh(results);

            const blinkResult = Detection.processBlink(faceBlendshapes[0].categories);
            if (blinkResult) Actions.handleBlink(blinkResult);

            if (Detection.processNod(faceLandmarks[0])) Actions.handleNod();
            
            const turnState = Detection.processTurn(faceLandmarks[0]);
            manageTurnState(turnState);

            UI.updateStatusDisplay(appState.isPatternModeActive);
        } else {
            DOM.statusDiv.textContent = "No Face Detected";
            DOM.statusDiv.style.color = "#FFA500";
            // Ensure the backspace timer stops if the face is lost
            if (appState.backspaceIntervalId) {
                clearInterval(appState.backspaceIntervalId);
                appState.backspaceIntervalId = null;
            }
        }
        DOM.canvasCtx.restore();
    }
    window.requestAnimationFrame(predictWebcam);
}

/**
 * Initializes the entire application.
 */
async function main() {
    UI.populateCheatSheet();

    // Setup UI event listeners
    DOM.cheatSheetToggle.addEventListener('click', () => DOM.cheatSheet.classList.toggle('visible'));
    DOM.meshToggle.addEventListener('change', () => { appState.showFaceMesh = DOM.meshToggle.checked; });
    
    // Updated event listener for the new "Sound" toggle
    DOM.soundToggle.addEventListener('change', () => {
        appState.soundEnabled = DOM.soundToggle.checked;
        // Initialize audio context if sound is turned on for the first time
        Audio.initAudio(); 
    });

    try {
        appState.faceLandmarker = await Vision.createFaceLandmarker();
        await Vision.setupCamera();

        // Initialize audio context on startup since sound is on by default
        Audio.initAudio();

        DOM.statusDiv.textContent = "Ready";
        appState.startTime = Date.now();
        setInterval(() => UI.updateTimer(appState.startTime), 1000);

        // Start the main loop
        predictWebcam();
    } catch (err) {
        DOM.errorDiv.textContent = `Error: ${err.message}`;
        console.error(err);
    }
}

// Start the application
main();