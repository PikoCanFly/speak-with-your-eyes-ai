import * as CONST from './constants.js';
import { appState } from './state.js';
import * as DOM from './dom.js';

/**
 * Analyzes blendshapes to detect short or long blinks.
 * @param {Array} blendshapes - The face blendshapes category array from MediaPipe.
 * @returns {'short' | 'long' | null} The type of blink detected, or null.
 */
export function processBlink(blendshapes) {
    const rightEyeBlink = blendshapes.find(c => c.categoryName === 'eyeBlinkRight')?.score || 0;
    const leftEyeBlink = blendshapes.find(c => c.categoryName === 'eyeBlinkLeft')?.score || 0;

    if ((rightEyeBlink + leftEyeBlink) / 2.0 > CONST.BLINK_THRESHOLD) {
        appState.blinkFrameCounter++;
        return null;
    }

    if (appState.blinkFrameCounter >= CONST.BLINK_CONSECUTIVE_FRAMES) {
        const isLong = appState.blinkFrameCounter >= CONST.LONG_BLINK_FRAMES;
        appState.blinkFrameCounter = 0; // Reset after detection
        return isLong ? 'long' : 'short';
    }
    
    appState.blinkFrameCounter = 0; // Reset if no blink is detected
    return null;
}

/**
 * Analyzes nose landmark history to detect a nod.
 * @param {Array} landmarks - The face landmarks array from MediaPipe.
 * @returns {boolean} True if a nod is detected, false otherwise.
 */
export function processNod(landmarks) {
    const noseY = landmarks[CONST.NOSE_TIP_INDEX].y * DOM.video.videoHeight;
    appState.noseYHistory.push(noseY);
    if (appState.noseYHistory.length > CONST.NOD_HISTORY_LENGTH) {
        appState.noseYHistory.shift();
    }

    if (appState.nodCooldownCounter > 0) {
        appState.nodCooldownCounter--;
        return false;
    }

    if (appState.noseYHistory.length === CONST.NOD_HISTORY_LENGTH) {
        const minY = Math.min(...appState.noseYHistory);
        const maxY = Math.max(...appState.noseYHistory);
        if ((maxY - minY) > CONST.NOD_MOVEMENT_THRESHOLD) {
            appState.nodCooldownCounter = CONST.NOD_COOLDOWN_FRAMES;
            appState.noseYHistory = []; // Clear history after detection
            return true;
        }
    }
    return false;
}

/**
 * Analyzes cheek and nose landmarks to detect a head turn.
 * @param {Array} landmarks - The face landmarks array from MediaPipe.
 * @returns {'left' | 'right' | null} The direction of the turn, or null.
 */
export function processTurn(landmarks) {

    const nose = landmarks[CONST.NOSE_TIP_INDEX];
    const leftCheek = landmarks[CONST.LEFT_CHEEK_INDEX];
    const rightCheek = landmarks[CONST.RIGHT_CHEEK_INDEX];

    const totalCheekWidth = leftCheek.x - rightCheek.x;
    const noseToRightCheekDist = nose.x - rightCheek.x;

    if (totalCheekWidth > 0.1) {
        const turnRatio = noseToRightCheekDist / totalCheekWidth;
        if (turnRatio > CONST.TURN_RIGHT_RATIO_THRESHOLD) {
            return 'left';
        } else if (turnRatio < CONST.TURN_LEFT_RATIO_THRESHOLD) {
            return 'right';
        }
    }
    return null; // Represents 'center'
}