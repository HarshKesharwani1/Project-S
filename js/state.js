// state.js
const AppState = (() => {
    const STATE_KEY = "sejal_stream_state";

    const DEFAULT_STATE = {
        user: {
            isLoggedIn: false,
            firstName: "",
            lastName: "",
            username: "",
            password: ""
        },
        progress: {
            episode1: { completed: false, progressPercent: 0 },
            episode2: { locked: true, completed: false, progressPercent: 0 }, // Memory Vault
            episode3: { locked: true, completed: false, progressPercent: 0 }, // Director's Cut
            episode4: { locked: true, completed: false, progressPercent: 0 }, // Friendship Audit
            episode5: { locked: true, completed: false, progressPercent: 0 }  // Grand Finale
        }
    };

    const get = () => {
        const data = localStorage.getItem(STATE_KEY);
        if (!data) {
            localStorage.setItem(STATE_KEY, JSON.stringify(DEFAULT_STATE));
            return DEFAULT_STATE;
        }
        try {
            const parsed = JSON.parse(data);
            
            // Migration safeguard: if user has an old state stored, merge missing episodes
            if (parsed && parsed.progress) {
                let updated = false;
                for (const epKey in DEFAULT_STATE.progress) {
                    if (!parsed.progress[epKey]) {
                        parsed.progress[epKey] = JSON.parse(JSON.stringify(DEFAULT_STATE.progress[epKey]));
                        updated = true;
                    }
                }
                if (updated) {
                    localStorage.setItem(STATE_KEY, JSON.stringify(parsed));
                }
            }
            
            return parsed;
        } catch (e) {
            localStorage.setItem(STATE_KEY, JSON.stringify(DEFAULT_STATE));
            return DEFAULT_STATE;
        }
    };

    const save = (state) => {
        localStorage.setItem(STATE_KEY, JSON.stringify(state));
    };

    const register = (firstName, lastName, username, password) => {
        const state = get();
        state.user.firstName = firstName;
        state.user.lastName = lastName;
        state.user.username = username;
        state.user.password = password;
        save(state);
    };

    const login = () => {
        const state = get();
        state.user.isLoggedIn = true;
        save(state);
    };

    const logout = () => {
        const state = get();
        state.user.isLoggedIn = false;
        save(state);
    };

    const resetProgress = () => {
        const state = get();
        state.progress = JSON.parse(JSON.stringify(DEFAULT_STATE.progress));
        save(state);
    };

    const markEpisodeComplete = (epId) => {
        const state = get();
        if (state.progress[epId]) {
            state.progress[epId].completed = true;
            state.progress[epId].progressPercent = 100;

            // Chain unlock progression
            if (epId === 'episode1') {
                state.progress.episode2.locked = false;
            } else if (epId === 'episode2') {
                state.progress.episode3.locked = false;
            } else if (epId === 'episode3') {
                state.progress.episode4.locked = false;
            } else if (epId === 'episode4') {
                state.progress.episode5.locked = false;
            }
            save(state);
        }
    };

    return {
        get,
        save,
        register,
        login,
        logout,
        resetProgress,
        markEpisodeComplete
    };
})();
