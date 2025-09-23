// Morse Code Dictionary
export const MORSE_CODE = { '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E', '..-.': 'F', '--.': 'G', '....': 'H', '..': 'I', '.---': 'J', '-.-': 'K', '.-..': 'L', '--': 'M', '-.': 'N', '---': 'O', '.--.': 'P', '--.-': 'Q', '.-.': 'R', '...': 'S', '-': 'T', '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X', '-.--': 'Y', '--..': 'Z', '-----': '0', '.----': '1', '..---': '2', '...--': '3', '....-': '4', '.....': '5', '-....': '6', '--...': '7', '---..': '8', '----.': '9' };

// Gesture Detection Thresholds
export const BLINK_THRESHOLD = 0.5;
export const BLINK_CONSECUTIVE_FRAMES = 2;
export const LONG_BLINK_FRAMES = 15;
export const NOD_MOVEMENT_THRESHOLD = 20;
export const NOD_HISTORY_LENGTH = 15;
export const NOD_COOLDOWN_FRAMES = 45;
export const TURN_RIGHT_RATIO_THRESHOLD = 0.65;
export const TURN_LEFT_RATIO_THRESHOLD = 0.35;
export const TURN_COOLDOWN_FRAMES = 45;
export const NODS_TO_TOGGLE_MODE = 3;

// Facial Landmark Indices
export const NOSE_TIP_INDEX = 4;
export const RIGHT_CHEEK_INDEX = 234;
export const LEFT_CHEEK_INDEX = 454;