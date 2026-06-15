// profile.js
document.addEventListener("DOMContentLoaded", () => {
    // Redirect if not logged in
    const state = AppState.get();
    if (!state.user.isLoggedIn) {
        PageTransition.to("signup.html");
        return;
    }

    const profileCard = document.getElementById("profile-sejal");
    if (profileCard) {
        profileCard.addEventListener("click", (e) => {
            e.preventDefault();
            PageTransition.to("dashboard.html");
        });
    }
});
