// js/actions.js
import { appState } from './state.js';
import * as CONST from './constants.js';
import * as UI from './ui.js';
import * as Audio from './audio.js';
import * as DOM from './dom.js';

export function resetGestureSequence() {
    appState.gestureSequence = "";
    clearTimeout(appState.gestureSequenceTimer);
}

export function handleBlink(blinkType) {
    if (appState.isPatternModeActive) {
        resetGestureSequence();
        const morseChar = (blinkType === 'long') ? '-' : '.';
        appState.morsePattern += morseChar;
        UI.translateMorse(appState.morsePattern);
        Audio.provideFeedback((blinkType === 'long') ? "Dash" : "Dot", false, appState.voiceAssistanceEnabled);
    } else {
        const message = (blinkType === 'long') ? 'LONG BLINK!' : 'BLINK!';
        UI.showTemporaryStatus(message, "#FF00FF", 1000);
    }
}

export function handleNod() {
    resetGestureSequence();
    clearTimeout(appState.nodResetTimer);
    appState.consecutiveNods++;

    if (appState.isPatternModeActive) {
        if (appState.consecutiveNods === 1 && appState.morsePattern.trim().length > 0 && !appState.morsePattern.endsWith('  ')) {
            appState.morsePattern += '  ';
            UI.translateMorse(appState.morsePattern);
            UI.showTemporaryStatus('NEW WORD', '#00FFFF', 1500);
            Audio.provideFeedback(DOM.translationDiv.textContent, true, appState.voiceAssistanceEnabled);
        }
        UI.showTemporaryStatus(`Nod ${appState.consecutiveNods}/${CONST.NODS_TO_TOGGLE_MODE} to Exit...`, '#FF4747', 2000);
        if (appState.consecutiveNods >= CONST.NODS_TO_TOGGLE_MODE) {
            appState.isPatternModeActive = false;
            appState.consecutiveNods = 0;
            UI.showTemporaryStatus('Exiting Pattern Mode', '#FF4747', 2000);
            // Audio.provideFeedback("Exiting Pattern Mode", false, appState.voiceAssistanceEnabled);
        } else {
            appState.nodResetTimer = setTimeout(() => { appState.consecutiveNods = 0; }, 2500);
        }
    } else {
        UI.showTemporaryStatus(`Nod ${appState.consecutiveNods}/${CONST.NODS_TO_TOGGLE_MODE} to Activate`, '#00FFFF', 1000);
        if (appState.consecutiveNods >= CONST.NODS_TO_TOGGLE_MODE) {
            appState.isPatternModeActive = true;
            appState.morsePattern = "";
            appState.consecutiveNods = 0;
            UI.translateMorse("");
            UI.showTemporaryStatus('Pattern Mode ACTIVATED', '#39FF14', 2000);
            // Audio.provideFeedback("Pattern Mode Activated", false, appState.voiceAssistanceEnabled);
        } else {
            appState.nodResetTimer = setTimeout(() => { appState.consecutiveNods = 0; }, 2500);
        }
    }
}

export function handleLeftTurn() {
    if (!appState.isPatternModeActive) {
        UI.showTemporaryStatus('TURN LEFT!', '#9370DB', 1000);
        return;
    }
    
    // combo sequence for clearing the screen
    appState.gestureSequence += 'L';
    clearTimeout(appState.gestureSequenceTimer);
    if (appState.gestureSequence === 'LRL') {
        appState.morsePattern = "";
        resetGestureSequence();
        UI.translateMorse(appState.morsePattern);
        UI.showTemporaryStatus('SCREEN CLEARED', '#FF4747', 1500);
        // Audio.provideFeedback("Cleared", false, appState.voiceAssistanceEnabled);
        return;
    }
    appState.gestureSequenceTimer = setTimeout(resetGestureSequence, 2000);

    // This is the core backspace logic
    if (appState.morsePattern.length > 0) {
        appState.morsePattern = appState.morsePattern.slice(0, -1);
        UI.translateMorse(appState.morsePattern);
        // The repeating timer will handle this.
        if (!appState.backspaceIntervalId) { 
            UI.showTemporaryStatus('Backspace', '#FFA500', 750);
            // Audio.provideFeedback("Backspace", false, appState.voiceAssistanceEnabled);
        }
    }
}

export function handleRightTurn() {
    // ADDED: Cooldown check specific to this one-shot action
    if (appState.turnCooldownCounter > 0) return;
    appState.turnCooldownCounter = CONST.TURN_COOLDOWN_FRAMES;

    if (appState.isPatternModeActive) {
        if (appState.gestureSequence === 'L') {
            appState.gestureSequence += 'R';
        } else {
            resetGestureSequence();
        }
        clearTimeout(appState.gestureSequenceTimer);
        appState.gestureSequenceTimer = setTimeout(resetGestureSequence, 2000);

        if (appState.morsePattern.length > 0 && !appState.morsePattern.endsWith(' ')) {
            appState.morsePattern += ' ';
            UI.translateMorse(appState.morsePattern);
            UI.showTemporaryStatus('NEXT LETTER', '#FFFF00', 750);
            // Audio.provideFeedback("Next Letter", false, appState.voiceAssistanceEnabled);
        }
    } else {
        UI.showTemporaryStatus('TURN RIGHT!', '#20B2AA', 1000);
    }
}