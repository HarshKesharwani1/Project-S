// music.js
const AmbientMusic = (() => {
    const MUSIC_URL = "https://assets.codepen.co/4358584/Anitek_-_01_-_Kisses.mp3";
    const STORAGE_KEY_MUTED = "sejal_stream_muted";
    const STORAGE_KEY_TIME = "sejal_stream_music_time";
    let audio = null;

    const init = () => {
        if (audio) return;
        
        audio = new Audio(MUSIC_URL);
        audio.loop = true;
        audio.volume = 0.25; // Soft ambient volume

        // Load muted state (default to unmuted if not set)
        const isMuted = localStorage.getItem(STORAGE_KEY_MUTED) === "true";
        audio.muted = isMuted;

        // Restore playback time if available
        const savedTime = localStorage.getItem(STORAGE_KEY_TIME);
        if (savedTime) {
            audio.currentTime = parseFloat(savedTime);
        }

        // Try playing if tab is active and not muted
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Autoplay policy: Audio will play on first click.");
                // Listen to first user interaction to start playing
                const startOnInteract = () => {
                    if (!audio.muted) {
                        audio.play().catch(e => console.log("Play error on interaction:", e));
                    }
                    window.removeEventListener("click", startOnInteract);
                    window.removeEventListener("keydown", startOnInteract);
                };
                window.addEventListener("click", startOnInteract);
                window.addEventListener("keydown", startOnInteract);
            });
        }

        // Save progress periodically and before unload
        setInterval(saveTime, 1000);
        window.addEventListener("beforeunload", saveTime);

        // Update speaker UI elements
        updateUI();
    };

    const saveTime = () => {
        if (audio && !audio.paused) {
            localStorage.setItem(STORAGE_KEY_TIME, audio.currentTime.toString());
        }
    };

    const toggle = () => {
        if (!audio) return;
        if (audio.muted) {
            audio.muted = false;
            audio.play().catch(e => console.log("Toggle play error:", e));
            localStorage.setItem(STORAGE_KEY_MUTED, "false");
        } else {
            audio.muted = true;
            localStorage.setItem(STORAGE_KEY_MUTED, "true");
        }
        updateUI();
    };

    const updateUI = () => {
        const buttons = document.querySelectorAll(".music-toggle-btn");
        buttons.forEach(btn => {
            if (audio.muted) {
                btn.classList.add("muted");
                btn.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.21.05-.42.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                    </svg>
                `;
            } else {
                btn.classList.remove("muted");
                btn.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                    </svg>
                `;
            }
        });
    };

    return {
        init,
        toggle
    };
})();

// Auto-initialize if logged in
document.addEventListener("DOMContentLoaded", () => {
    const state = typeof AppState !== 'undefined' ? AppState.get() : null;
    if (state && state.user.isLoggedIn) {
        AmbientMusic.init();
    }
});
