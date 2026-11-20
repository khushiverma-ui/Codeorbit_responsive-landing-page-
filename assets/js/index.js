// ==========================================================================
// CSEP LANDING PAGE (HOME) JAVASCRIPT
// ==========================================================================

document.addEventListener("DOMContentLoaded", function () {
    console.log("CSEP – Learn. Share. Grow Together.");

    // Check if user is already logged in
    let currentStudent = null;
    try {
        currentStudent = JSON.parse(localStorage.getItem("currentStudent"));
    } catch (e) {
        currentStudent = null;
    }

    if (currentStudent && currentStudent.name) {
        const loginBtn = document.querySelector(".btn-nav-login");
        const signupBtn = document.querySelector(".btn-nav-signup");

        if (loginBtn) {
            loginBtn.textContent = "My Profile";
            loginBtn.href = "profile.html";
        }
        if (signupBtn) {
            signupBtn.textContent = "Dashboard →";
            signupBtn.href = "dashboard.html";
        }
    }

    // Bell notification interaction
    const bellBtn = document.querySelector(".landing-bell-btn");
    if (bellBtn) {
        bellBtn.addEventListener("click", () => {
            alert("🔔 Notifications: 3 peer study sessions scheduled on your campus this week!");
        });
    }

    // Smooth Scroll for Internal Anchors
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener("click", function (e) {
            const targetId = this.getAttribute("href");
            if (targetId && targetId !== "#") {
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    e.preventDefault();
                    targetEl.scrollIntoView({ behavior: "smooth" });
                }
            }
        });
    });
});
