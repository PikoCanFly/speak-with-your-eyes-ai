// js/audio.js
import { appState } from './state.js';

let audioCtx;

/**
 * Initializes the Web Audio API AudioContext.
 */
export function initAudio() {
    if (!audioCtx && appState.soundEnabled) {
        try {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.error("Web Audio API is not supported in this browser");
        }
    }
}

/**
 * Plays a sound effect for 'dot' or 'dash'.
 */
function playSound(type) {
    if (!audioCtx) return;
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    const duration = (type === 'dot') ? 0.1 : 0.3;
    const frequency = (type === 'dot') ? 880 : 780;

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + duration);
}

/**
 * Speaks the given text using the browser's speech synthesis.
 */
function speakText(text) {
    if ('speechSynthesis' in window && text) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
    }
}

/**
 * Provides audio feedback based on the master sound toggle.
 * Plays beeps for dots/dashes and speaks text only when forced.
 * @param {string} feedbackType - The sound to play ('Dot', 'Dash') or text to speak.
 * @param {boolean} [forceSpeech=false] - If true, speaks the feedbackType text.
 */
export function provideFeedback(feedbackType, forceSpeech = false) {
    // Master switch: if sound is off, do nothing.
    if (!appState.soundEnabled) return;

    // Beeps for Morse input
    if (feedbackType === 'Dot' || feedbackType === 'Dash') {
        playSound(feedbackType.toLowerCase());
    } 
    // Spoken feedback for specific events (like completing a word)
    else if (forceSpeech) {
        speakText(feedbackType);
    }
}