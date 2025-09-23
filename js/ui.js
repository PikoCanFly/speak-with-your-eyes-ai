import * as DOM from './dom.js';
import { MORSE_CODE } from './constants.js';

let activeMessageTimer = null;

/**
 * Translates the current morse pattern and updates the display.
 * @param {string} morsePattern - The current morse pattern string.
 */
export function translateMorse(morsePattern) {
    const morseWords = morsePattern.trim().split('  ');
    const translatedText = morseWords.map(word => {
        return word.split(' ').map(morseLetter => MORSE_CODE[morseLetter] || (morseLetter ? '?' : '')).join('');
    }).join(' ');
    DOM.translationDiv.textContent = translatedText;
    DOM.patternDiv.textContent = morsePattern;
}

/**
 * Shows a temporary message in the status display area.
 * @param {string} message - The message to show.
 * @param {string} color - The CSS color of the message.
 * @param {number} duration - How long to show the message in milliseconds.
 */
export function showTemporaryStatus(message, color, duration) {
    clearTimeout(activeMessageTimer);
    DOM.statusDiv.textContent = message;
    DOM.statusDiv.style.color = color;
    activeMessageTimer = setTimeout(() => {
        activeMessageTimer = null; // Clear the timer reference
    }, duration);
}

/**
 * Updates the main status display based on application state.
 * @param {boolean} isPatternModeActive - Whether pattern mode is currently active.
 */
export function updateStatusDisplay(isPatternModeActive) {
    // Only update if a temporary message is not active
    if (activeMessageTimer === null) {
        if (isPatternModeActive) {
            DOM.statusDiv.textContent = "--- PATTERN RECORDING MODE ---";
            DOM.statusDiv.style.color = "#39FF14";
        } else {
            DOM.statusDiv.textContent = "Ready";
            DOM.statusDiv.style.color = "#4CAF50";
        }
    }
}

/**
 * Updates the elapsed time display.
 @param {number} startTime - timestamp when the application started.
 */
export function updateTimer(startTime) {
    if (!startTime) return;
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const mins = Math.floor(elapsed / 60).toString().padStart(2, '0');
    const secs = (elapsed % 60).toString().padStart(2, '0');
    DOM.timerDiv.textContent = `Time: ${mins}:${secs}`;
}

/**
 * Fills the Morse Code cheat sheet with data.
 */
export function populateCheatSheet() {
    const entries = Object.entries(MORSE_CODE).sort((a, b) => a[1].localeCompare(b[1]));
    const mid = Math.ceil(entries.length / 2);
    const col1 = entries.slice(0, mid);
    const col2 = entries.slice(mid);
    const createCol = (items) => {
        let html = '<div class="cheat-sheet-column">';
        items.forEach(([code, letter]) => {
            html += `<div><strong>${letter}</strong>: <span>${code}</span></div>`;
        });
        html += '</div>';
        return html;
    };
    DOM.cheatSheetContent.innerHTML = createCol(col1) + createCol(col2);
}