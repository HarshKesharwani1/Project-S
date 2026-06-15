// episodes.js
const EpisodeControllers = (() => {

    // ==========================================================================
    // EPISODE 1: The Apology
    // ==========================================================================
    const initEpisode1 = () => {
        const state = AppState.get();
        if (!state.user.isLoggedIn) {
            PageTransition.to("signup.html");
            return;
        }

        const strikeText = document.getElementById("strike-target");
        const replaceText = document.getElementById("replace-target");
        const apologyCard = document.getElementById("apology-card");
        const finishBtn = document.getElementById("ep1-finish");

        // Sequence animations
        setTimeout(() => {
            if (strikeText) strikeText.classList.add("striked");
        }, 1000);

        setTimeout(() => {
            if (replaceText) replaceText.classList.add("active");
        }, 2200);

        setTimeout(() => {
            if (apologyCard) apologyCard.classList.add("active");
        }, 3200);

        if (finishBtn) {
            finishBtn.addEventListener("click", () => {
                AppState.markEpisodeComplete("episode1");
                PageTransition.to("dashboard.html");
            });
        }
    };

    // ==========================================================================
    // EPISODE 2: The Memory Vault (Memory Lane Timeline)
    // ==========================================================================
    const initEpisode2 = () => {
        const state = AppState.get();
        if (!state.user.isLoggedIn) {
            PageTransition.to("signup.html");
            return;
        }
        if (state.progress.episode2.locked) {
            PageTransition.to("dashboard.html");
            return;
        }

        // Memory Timeline Data
        // =====================================================================
        // HOW TO CUSTOMIZE:
        // You can easily add your own photos and memory text here!
        // 1. "year": Change this to the date string you want to display on top.
        // 2. "title": The main heading of the memory card.
        // 3. "image": Put the URL of the image here. It can be a link starting 
        //    with 'https://' or a local file path relative to this project, 
        //    such as 'assets/images/my_memory_photo.jpg'.
        // 4. "desc": Write the story/memory description inside quotes.
        // =====================================================================
        const memories = [
            {
                year: "2 June 2020",
                image: "assets/images/1 chat.jpeg",
                desc: "Ye toh bahut ache se yaad hai, Raj and I were in his car 🚗. I don't remember exactly, but I think he had posted something about your birthday 🎂, and I asked, 'Main bhi wish kar doon?' Toh he said, 'Kar do.' But I was a little nervous to text kyuki school mein toh humari rarely baat hui thi 😅. And of course, it was \"the best birthday wish you have ever got\" 🙄😂But who knew ki one day, the classmate jisse I rarely used to talk, will become my best friend who knows all my secrets! 🤫❤️"
            },
            {
                year: "5 Sept 2021",
                image: "assets/images/5 sept 2021.jpeg",
                desc: "Ohh, this day! ✨ The last—or you can say first—outing before you went to Doon and I went to Bhopal. Kaise taise karke sab ready hue the, but it was so much fun! 💃 Those talks, the photos 📸, and most importantly, the food we had, which was amazing! 🍕🤤 It was such a good day. ❤️"
            },
            {
                year: "9 June 2022",
                image: "assets/images/delhi part1.png",
                desc: `My first solo visit to Delhi! I have a lot of memories from this day. Let's start from the beginning—I remember exactly every second of what happened over those two days. I was at Haldiram's, I think, when you came and gave me a chocolate 🍫. Tbh, it was the first gift someone had ever given me, so I didn't know how to react. I got so nervous that I didn't even say thank you 😅. And then we roamed all around Noida to watch a movie, meet Lucky, and have those conversations in the cab which basically cleared up most of the misunderstandings we had about each other. The next day, you came to the hotel when you were in a full-on angry mood about some chaos happening in your college club group 😤. Then the burgers 🍔, and finally, the hardest part: saying goodbye 🥺. Honestly, that meeting and everything we sorted out is what truly made our bond so tight 🤝. But I didn't know ki iske baad hum direct 3-4 saal baad milenge.`
            },
            {
                year: "2 Oct 2022",
                image: "assets/images/garba .jpeg",
                desc: `I remember this day exactly. I was exhausted because of some exam, and you were continuously video calling and texting me to pick up 📱. When I finally answered, I saw a beautiful girl standing on the video call, and I was about to ask, "Sejal ka phone tumhare paas kya kar raha hai?" aur phir pata chala ki ye toh tu hi hai! Just kidding! 😂 You just asked, "Kaisi lag rahi hoon, jaldi batao?" I said, "Acchi lag rahi..." and before I could even complete the sentence, you said "Thank you, thank you!" and hung up 🤦‍♂️.

I have added this to this episode just because this was the incident that made me realize ki bhale hi thodi importance ho, but I actually have importance in someone's life ❤️. And poori honesty se ek baat tab bhi boli thi aur ab bhi bolta hoon—you can pull off any outfit perfectly, but absolutely nothing beats how gorgeous you look in traditional Indian wear ✨💖.`
            },
            {
                year: "21 Feb 2026",
                image: "assets/images/pryj 2026.jpeg",
                desc: `I just want to talk about the photo—the first photo I had with my best friend after almost 6 years! 📸 I personally was so excited to meet you, and even though the day had its own crazy chaos, finally getting to see you made it all perfectly unforgettable ✨. And the best part: we got our first photo together and also celebrated our first party after getting our jobs! 🥳👔`
            },
            {
                year: "7 June 2026",
                image: "assets/images/gurgaon 2026.png",
                desc: `The last-minute addition because this whole surprise got delayed! To be honest, there is no specific memory here because we just talked for hours and hours and hours about everything under the sun 🗣️☕.`
            },
            {
                year: "Future & Beyond 🚀",
                image: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=600",
                desc: `These were just a few memories from a whole ocean of good, happy, and sad memories we have created. The memories above only made it to this "episode" because these were first-time experiences I had—not just with you, but with anyone in the world 🌍. And honestly, I don't think ki sharing those 'firsts' would have been more fun with anyone else. Here's to making countless more unforgettable memories together in the future! 🥂🌟`
            }
        ];

        let activeIndex = -1;
        const visitedNodes = new Set();

        const timelineProgress = document.getElementById("timeline-progress");
        const nodeWrappers = document.querySelectorAll(".timeline-node-wrapper");
        const claimBtn = document.getElementById("claim-loot");

        // Lightbox elements
        const modal = document.getElementById("lightbox-modal");
        const modalImg = document.getElementById("lightbox-img");
        const modalYear = document.getElementById("lightbox-year");
        const modalDesc = document.getElementById("lightbox-desc");

        const closeBtn = document.getElementById("lightbox-close");
        const prevBtn = document.getElementById("lightbox-prev");
        const nextBtn = document.getElementById("lightbox-next");

        // Initially deactivate claim button
        if (claimBtn) {
            claimBtn.disabled = true;
            claimBtn.style.opacity = "0.3";
            claimBtn.style.cursor = "not-allowed";
            claimBtn.innerText = "Explore All Years First";
        }

        const openLightbox = (index) => {
            if (index < 0 || index >= memories.length) return;
            activeIndex = index;
            const item = memories[index];

            // Render content
            modalImg.src = item.image;
            modalYear.innerText = item.year;
            modalDesc.innerText = item.desc;

            // Mark node active & visited
            nodeWrappers.forEach((wrapper, wIdx) => {
                wrapper.classList.remove("active");
                if (wIdx === index) {
                    wrapper.classList.add("active");
                    wrapper.classList.add("visited");
                    visitedNodes.add(index);
                }
            });

            // Update Progress Bar
            const progressPct = ((visitedNodes.size) / memories.length) * 100;
            timelineProgress.style.width = `${progressPct}%`;

            // Check if all visited to enable Loot Drop button
            if (visitedNodes.size === memories.length && claimBtn) {
                claimBtn.disabled = false;
                claimBtn.style.opacity = "1";
                claimBtn.style.cursor = "pointer";
                claimBtn.innerText = "Claim Loot Drop";
                claimBtn.classList.add("pulse-glow"); // Custom pulse animation
            }

            // Open Modal
            modal.classList.add("active");
        };

        const closeLightbox = () => {
            modal.classList.remove("active");
            nodeWrappers.forEach((w) => w.classList.remove("active"));
            activeIndex = -1;
        };

        // Attach listeners to nodes
        nodeWrappers.forEach((wrapper, index) => {
            const btn = wrapper.querySelector(".timeline-node");
            btn.addEventListener("click", () => openLightbox(index));
        });

        // Close bindings
        closeBtn.addEventListener("click", closeLightbox);
        modal.addEventListener("click", (e) => {
            if (e.target === modal) closeLightbox();
        });

        // Arrow Navigations
        prevBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (activeIndex > 0) openLightbox(activeIndex - 1);
        });

        nextBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (activeIndex < memories.length - 1) openLightbox(activeIndex + 1);
        });

        // Keybindings (Escape to close, Left/Right arrows)
        document.addEventListener("keydown", (e) => {
            if (!modal.classList.contains("active")) return;
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowLeft" && activeIndex > 0) openLightbox(activeIndex - 1);
            if (e.key === "ArrowRight" && activeIndex < memories.length - 1) openLightbox(activeIndex + 1);
        });

        // Claim button completion
        if (claimBtn) {
            claimBtn.addEventListener("click", () => {
                if (visitedNodes.size === memories.length) {
                    AppState.markEpisodeComplete("episode2");
                    PageTransition.to("dashboard.html");
                }
            });
        }
    };

    // ==========================================================================
    // EPISODE 3: The Director's Cut (Interactive Special)
    // ==========================================================================
    const initEpisode3 = () => {
        const state = AppState.get();
        if (!state.user.isLoggedIn) {
            PageTransition.to("signup.html");
            return;
        }
        if (state.progress.episode3.locked) {
            PageTransition.to("dashboard.html");
            return;
        }

        // DOM elements
        const cards = document.querySelectorAll(".interactive-card");
        const backHeader = document.getElementById("director-back-header");
        const lootContainer = document.getElementById("loot-drop-container");
        const claimLootBtn = document.getElementById("claim-loot-btn");

        const viewedChapters = new Set();

        // 1. Interactive Card / Overlay zoom controllers
        cards.forEach((card) => {
            const index = card.getAttribute("data-card");
            card.addEventListener("click", () => {
                const overlay = document.getElementById(`zoom-overlay-${index}`);
                if (overlay) {
                    if (backHeader) backHeader.style.display = "none";
                    overlay.classList.add("active");

                    // Mark as viewed
                    viewedChapters.add(index);
                    card.classList.add("visited");
                    const badge = card.querySelector(".card-status-badge");
                    if (badge) {
                        badge.innerText = "Watched";
                        badge.style.background = "#4cd137";
                    }

                    // Check if all 3 chapters viewed
                    if (viewedChapters.size === 3) {
                        lootContainer.style.display = "block";
                        setTimeout(() => {
                            lootContainer.style.opacity = "1";
                        }, 50);
                    }
                }
            });
        });

        // 2. Back buttons inside Zoom overlays
        const backButtons = document.querySelectorAll(".zoom-back-btn");
        backButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                const activeOverlay = document.querySelector(".zoom-overlay.active");
                if (activeOverlay) {
                    activeOverlay.classList.remove("active");
                }
                if (backHeader) backHeader.style.display = "flex";
            });
        });

        // 3. Claim Loot drop completion
        if (claimLootBtn) {
            claimLootBtn.addEventListener("click", () => {
                AppState.markEpisodeComplete("episode3");
                PageTransition.to("dashboard.html");
            });
        }
    };

    // ==========================================================================
    // EPISODE 4: The Grand Finale & Confetti Engine
    // ==========================================================================
    const initEpisode4 = () => {
        const state = AppState.get();
        if (!state.user.isLoggedIn) {
            PageTransition.to("signup.html");
            return;
        }
        if (state.progress.episode4.locked) {
            PageTransition.to("dashboard.html");
            return;
        }

        const takeExamBtn = document.getElementById("take-exam-btn");
        const finishExamBtn = document.getElementById("finish-exam-btn");

        if (takeExamBtn && finishExamBtn) {
            takeExamBtn.addEventListener("click", () => {
                // Show the "I Finished It!" button
                finishExamBtn.style.display = "block";
                setTimeout(() => {
                    finishExamBtn.style.opacity = "1";
                }, 50);
            });

            finishExamBtn.addEventListener("click", () => {
                AppState.markEpisodeComplete("episode4");
                PageTransition.to("dashboard.html");
            });
        }
    };

    // ==========================================================================
    // EPISODE 5: The Grand Finale & Confetti Engine
    // ==========================================================================
    const initEpisode5 = () => {
        const state = AppState.get();
        if (!state.user.isLoggedIn) {
            PageTransition.to("signup.html");
            return;
        }
        if (state.progress.episode5.locked) {
            PageTransition.to("dashboard.html");
            return;
        }

        AppState.markEpisodeComplete("episode5");
        setupConfetti();
    };

    const setupConfetti = () => {
        const canvas = document.getElementById("confetti-canvas");
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        let animationFrameId;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        const colors = ["#E50914", "#ffffff", "#ffcc00", "#ff66b2", "#33ccff", "#66ff66"];
        const particles = [];

        class ConfettiParticle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height - canvas.height;
                this.size = Math.random() * 8 + 6;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.speedX = Math.random() * 4 - 2;
                this.speedY = Math.random() * 5 + 4;
                this.rotation = Math.random() * 360;
                this.rotationSpeed = Math.random() * 4 - 2;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.rotation += this.rotationSpeed;

                if (this.y > canvas.height) {
                    this.y = -20;
                    this.x = Math.random() * canvas.width;
                    this.speedY = Math.random() * 5 + 4;
                }
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate((this.rotation * Math.PI) / 180);
                ctx.fillStyle = this.color;
                ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size / 2);
                ctx.restore();
            }
        }

        for (let i = 0; i < 150; i++) {
            particles.push(new ConfettiParticle());
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p) => {
                p.update();
                p.draw();
            });
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        window.addEventListener("beforeunload", () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("resize", resizeCanvas);
        });
    };

    return {
        initEpisode1,
        initEpisode2,
        initEpisode3,
        initEpisode4,
        initEpisode5
    };
})();
