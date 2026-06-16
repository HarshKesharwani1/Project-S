// dashboard.js
document.addEventListener("DOMContentLoaded", () => {
    // 1. Authentication Check
    const state = AppState.get();
    if (!state.user.isLoggedIn) {
        PageTransition.to("signup.html");
        return;
    }

    // 2. Render State on Dashboard
    renderEpisodes(state);

    // 3. Navbar Scrolling Effect
    const navbar = document.querySelector(".navbar");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    // 4. Set up Reset button
    const resetBtn = document.getElementById("reset-progress");
    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            if (confirm("Are you sure you want to reset your series progress?")) {
                AppState.resetProgress();
                location.reload();
            }
        });
    }

    // 5. Setup Card Hover Previews
    setupHoverPreviews();
});

function renderEpisodes(state) {
    const progress = state.progress;

    // Ep 1: The Apology (Always Unlocked)
    setupEpisodeCard("ep-1", false, progress.episode1);

    // Ep 2: The Memory Vault
    setupEpisodeCard("ep-2", progress.episode2.locked, progress.episode2);

    // Ep 3: The Director's Cut
    setupEpisodeCard("ep-3", progress.episode3.locked, progress.episode3);

    // Ep 4: The Friendship Audit
    setupEpisodeCard("ep-4", progress.episode4.locked, progress.episode4);

    // Ep 5: The Grand Finale
    setupEpisodeCard("ep-5", progress.episode5.locked, progress.episode5);

    // Dynamic Play Button on Hero Banner
    const playHeroBtn = document.getElementById("play-hero");
    if (playHeroBtn) {
        let targetUrl = "episode1.html";
        let buttonText = "Play Episode 1";
        if (progress.episode1.completed && !progress.episode2.locked && !progress.episode2.completed) {
            targetUrl = "episode2.html";
            buttonText = "Play Episode 2";
        } else if (progress.episode2.completed && !progress.episode3.locked && !progress.episode3.completed) {
            targetUrl = "episode3.html";
            buttonText = "Play Episode 3";
        } else if (progress.episode3.completed && !progress.episode4.locked && !progress.episode4.completed) {
            targetUrl = "episode4.html";
            buttonText = "Play Episode 4";
        } else if (progress.episode4.completed && !progress.episode5.locked && !progress.episode5.completed) {
            targetUrl = "episode5.html";
            buttonText = "Play Episode 5";
        } else if (progress.episode5.completed) {
            targetUrl = "episode1.html";
            buttonText = "Replay Series";
        }
        
        playHeroBtn.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
            </svg>
            ${buttonText}
        `;

        playHeroBtn.addEventListener("click", (e) => {
            e.preventDefault();
            PageTransition.to(targetUrl);
        });
    }
}

function setupEpisodeCard(cardId, isLocked, epState) {
    const card = document.getElementById(cardId);
    if (!card) return;

    const progressBar = card.querySelector(".progress-bar");
    const lockedOverlay = card.querySelector(".locked-overlay");

    // Update Progress Bar
    if (progressBar) {
        progressBar.style.width = `${epState.progressPercent}%`;
    }

    // Update Locking Style
    if (isLocked) {
        card.classList.add("locked");
        if (lockedOverlay) {
            lockedOverlay.style.display = "flex";
        }
    } else {
        card.classList.remove("locked");
        if (lockedOverlay) {
            lockedOverlay.style.display = "none";
        }
    }

    // Handle clicks
    card.addEventListener("click", (e) => {
        e.preventDefault();
        if (isLocked) {
            card.classList.add("shake");
            setTimeout(() => card.classList.remove("shake"), 500);
            return;
        }

        const targetUrl = card.getAttribute("href");
        PageTransition.to(targetUrl);
    });
}

function setupHoverPreviews() {
    const ep2Card = document.getElementById("ep-2");
    if (ep2Card) {
        let intervalId = null;
        const slides = ep2Card.querySelectorAll(".hover-slide-img");
        let currentSlide = 0;

        const startSlideshow = () => {
            if (slides.length === 0) return;
            // Clear all active classes
            slides.forEach(s => s.classList.remove("active"));
            slides[0].classList.add("active");
            currentSlide = 0;

            intervalId = setInterval(() => {
                slides[currentSlide].classList.remove("active");
                currentSlide = (currentSlide + 1) % slides.length;
                slides[currentSlide].classList.add("active");
            }, 1000);
        };

        const stopSlideshow = () => {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
            slides.forEach(s => s.classList.remove("active"));
        };

        ep2Card.addEventListener("mouseenter", () => {
            if (!ep2Card.classList.contains("locked")) {
                startSlideshow();
            }
        });
        ep2Card.addEventListener("mouseleave", stopSlideshow);
    }
}
