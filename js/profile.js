// profile.js
document.addEventListener("DOMContentLoaded", () => {
    // Redirect if not logged in
    const state = AppState.get();
    if (!state.user.isLoggedIn) {
        PageTransition.to("signup.html");
        return;
    }

    const playTaDum = () => {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const audioCtx = new AudioContext();
            const now = audioCtx.currentTime;

            // "Ta" - Deep mid hit
            const osc1 = audioCtx.createOscillator();
            const gain1 = audioCtx.createGain();
            const filter1 = audioCtx.createBiquadFilter();
            
            osc1.type = 'sawtooth';
            osc1.frequency.setValueAtTime(80, now);
            osc1.frequency.exponentialRampToValueAtTime(50, now + 0.2);

            filter1.type = 'lowpass';
            filter1.frequency.setValueAtTime(160, now);
            filter1.frequency.exponentialRampToValueAtTime(70, now + 0.2);

            gain1.gain.setValueAtTime(0.01, now);
            gain1.gain.linearRampToValueAtTime(0.7, now + 0.05);
            gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

            osc1.connect(filter1);
            filter1.connect(gain1);
            gain1.connect(audioCtx.destination);

            // "Dum" - Deep sub boom
            const osc2 = audioCtx.createOscillator();
            const gain2 = audioCtx.createGain();
            const filter2 = audioCtx.createBiquadFilter();
            
            osc2.type = 'triangle';
            osc2.frequency.setValueAtTime(55, now + 0.15);
            osc2.frequency.exponentialRampToValueAtTime(32, now + 1.3);

            filter2.type = 'lowpass';
            filter2.frequency.setValueAtTime(120, now + 0.15);
            filter2.frequency.exponentialRampToValueAtTime(45, now + 0.8);

            gain2.gain.setValueAtTime(0.01, now + 0.15);
            gain2.gain.linearRampToValueAtTime(1.0, now + 0.25);
            gain2.gain.exponentialRampToValueAtTime(0.01, now + 1.3);

            osc2.connect(filter2);
            filter2.connect(gain2);
            gain2.connect(audioCtx.destination);

            // Resonant high-pass shimmer
            const osc3 = audioCtx.createOscillator();
            const gain3 = audioCtx.createGain();
            
            osc3.type = 'sine';
            osc3.frequency.setValueAtTime(290, now + 0.15);
            osc3.frequency.exponentialRampToValueAtTime(240, now + 0.6);

            gain3.gain.setValueAtTime(0.01, now + 0.15);
            gain3.gain.linearRampToValueAtTime(0.12, now + 0.22);
            gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

            osc3.connect(gain3);
            gain3.connect(audioCtx.destination);

            osc1.start(now);
            osc1.stop(now + 0.2);

            osc2.start(now + 0.15);
            osc2.stop(now + 1.3);

            osc3.start(now + 0.15);
            osc3.stop(now + 0.7);
        } catch (error) {
            console.warn("Audio Context blocked or unsupported:", error);
        }
    };

    const profileCard = document.getElementById("profile-sejal");
    if (profileCard) {
        profileCard.addEventListener("click", (e) => {
            e.preventDefault();
            
            // 1. Play synthesized Netflix sound
            playTaDum();
            
            // 2. Activate overlay transitions
            const introOverlay = document.getElementById("intro-overlay");
            if (introOverlay) {
                introOverlay.classList.add("active");
            }
            
            // 3. Smooth page transition to dashboard after 1.8s zoom completion
            setTimeout(() => {
                PageTransition.to("dashboard.html");
            }, 1800);
        });
    }
});
