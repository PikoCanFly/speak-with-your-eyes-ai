
# Blink, Nod & Turn: A Morse Code Communicator

[![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-yellow?style=for-the-badge&logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![MediaPipe](https://img.shields.io/badge/MediaPipe-Face%20Landmarker-orange?style=for-the-badge&logo=google)](https://mediapipe.dev/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://en.wikipedia.org/wiki/HTML5)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://en.wikipedia.org/wiki/CSS3)

### ➡️ [**Try the Live Demo Here!**](https://fantastic-hamster-94cff7.netlify.app/) ⬅️

What if you could speak with your eyes? This project makes it possible. Using the power of browser-based AI, this application tracks 478 facial landmarks in real-time to translate your blinks, nods, and head turns into Morse code, allowing you to communicate without a keyboard.

[![Blink Morse Code Demo GIF](assets/showcase.gif)](https://youtu.be/LB8nHcPoW-g)

*Click the GIF above to watch the full YouTube video explaining how it was built.*

---

## ✨ Features

-   👁️ **Speak with Your Eyes:** Translate short blinks into dots (`.`) and long blinks into dashes (`-`).
-   🤖 **Full Gesture Control:**
    -   **Toggle Mode:** Nod three times to enter or exit Pattern Detection Mode.
    -   **Next Letter:** Turn your head to the right to add a space.
    -   **Backspace:** Turn your head to the left to delete the last character.
    -   **Next Word:** Nod once to add a word break.
-   🌐 **Real-Time Translation:** Instantly see your Morse pattern and its English translation updated with every gesture.
-   🛠️ **Helpful UI:** Includes a toggleable face mesh for visual feedback, optional sound effects, and an interactive Morse code guide for learning.

## 🤔 How It Works

The magic is in translating subtle facial movements into discrete, intentional actions.

1.  **Blink Detection:** The app monitors the `eyeBlink` blendshapes from MediaPipe. When the blink score passes a `0.5` threshold, a frame counter begins. If the eyes are closed for 2-14 frames, it's a **short blink (dot)**. If they're closed for 15+ frames, it's a **long blink (dash)**.

2.  **Nod Detection:** To avoid false positives from minor head jitters, the app uses a "sliding window" technique. It records the Y-position of the nose tip over the last 15 frames. A nod is only registered if the difference between the highest and lowest points in that window exceeds a specific movement threshold.

3.  **Turn Detection:** The app calculates the total width between the edges of the cheeks (landmarks 234 and 454). It then calculates a "turn ratio" based on the nose tip's position relative to the cheeks. When looking straight, the ratio is ~0.5. A turn is detected when the ratio goes above `0.65` or below `0.35`.

## 🚀 How to Run Locally

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/your-repo.git
    ```
2.  **Navigate to the directory:**
    ```bash
    cd your-repo-name
    ```
3.  **Start a local server.** This is required to handle the ES6 JavaScript modules.
    *   **Using Python:**
        ```bash
        # For Python 3
        python -m http.server
        ```
    *   **Using VS Code:** Install the **Live Server** extension and click "Go Live" in the status bar.

4.  Open your browser and navigate to `http://localhost:8000` (or the address your server provides).

## Support

<a href="https://ko-fi.com/pikocanfly/tip" target="_blank">
  <img src="https://storage.ko-fi.com/cdn/kofi2.png?v=3" alt="Support Me on Ko-fi" style="border:0px;height: 60px !important;width: 217px !important;" >

</a>

Like this project? It was a lot of fun to build. Any support is greatly appreciated!

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

## Acknowledgements

-   This project would not be possible without the incredible open-source work from the [MediaPipe](https://mediapipe.dev/) team.
-   Inspired by the bravery of [Jeremiah Denton](https://en.wikipedia.org/wiki/Jeremiah_Denton).
