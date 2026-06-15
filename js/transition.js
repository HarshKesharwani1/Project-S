// transition.js
const PageTransition = (() => {
    const init = () => {
        const overlay = document.getElementById("transition-overlay");
        if (overlay) {
            // Trigger exit fade-out on load
            setTimeout(() => {
                overlay.classList.add("fade-out");
            }, 50);
        }

        // Intercept standard link navigation clicks
        document.body.addEventListener("click", (e) => {
            const link = e.target.closest("a");
            if (link && link.getAttribute("href") && !link.getAttribute("target") && !link.href.startsWith("javascript:")) {
                const href = link.getAttribute("href");
                if (href !== "#" && !href.startsWith("#")) {
                    e.preventDefault();
                    to(href);
                }
            }
        });
    };

    const to = (url) => {
        const overlay = document.getElementById("transition-overlay");
        if (overlay) {
            overlay.classList.remove("fade-out");
            overlay.classList.add("fade-in");
            // Load target page once fade finishes (600ms match with CSS transition)
            setTimeout(() => {
                window.location.href = url;
            }, 600);
        } else {
            window.location.href = url;
        }
    };

    document.addEventListener("DOMContentLoaded", init);

    return {
        to
    };
})();
