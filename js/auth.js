// auth.js
const Auth = (() => {
    // Dynamic synthesis of Netflix Ta-dum Sound (Zero asset dependencies)
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

    const initSignup = () => {
        const signupForm = document.getElementById("signup-form");
        const firstNameInput = document.getElementById("signup-firstname");
        const lastNameInput = document.getElementById("signup-lastname");
        const usernameInput = document.getElementById("signup-username");
        const passwordInput = document.getElementById("signup-password");

        if (signupForm) {
            signupForm.addEventListener("submit", (e) => {
                e.preventDefault();
                const fn = firstNameInput.value.trim();
                const ln = lastNameInput.value.trim();
                const u = usernameInput.value.trim();
                const p = passwordInput.value.trim();

                // Save details dynamically to state
                AppState.register(fn, ln, u, p);

                // Transition to login page
                PageTransition.to("login.html");
            });
        }
    };

    const initLogin = () => {
        const loginForm = document.getElementById("login-form");
        const usernameInput = document.getElementById("login-username");
        const passwordInput = document.getElementById("login-password");
        const errorContainer = document.getElementById("login-error-container");

        if (loginForm) {
            loginForm.addEventListener("submit", (e) => {
                e.preventDefault();
                const u = usernameInput.value.trim();
                const p = passwordInput.value.trim();

                // Retrieve registered credentials from localStorage state
                const state = AppState.get();
                const registeredUser = state.user.username;
                const registeredPass = state.user.password;

                if (registeredUser && registeredPass && u === registeredUser && p === registeredPass) {
                    errorContainer.innerHTML = "";
                    AppState.login();
                    playTaDum();
                    setTimeout(() => {
                        PageTransition.to("profile.html");
                    }, 1200); // Allow sound to start before loading next view
                } else {
                    errorContainer.innerHTML = `
                        <div class="error-text">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                            Wrong ID and Password
                        </div>
                    `;
                }
            });
        }
    };

    return {
        initSignup,
        initLogin
    };
})();
