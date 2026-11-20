// ==========================================================================
// CODEORBIT — AUTHENTICATION CONTROLLER (FIREBASE)
// Powers Login & Register Forms with Google Sign-In & Email/Password
// ==========================================================================

import { signInWithGoogle, registerWithEmail, loginWithEmail } from "./firebase-auth.js";

document.addEventListener("DOMContentLoaded", function () {
    
    // 1. Google Sign-In Buttons (Login & Register)
    const googleLoginBtn = document.getElementById("googleLoginBtn");
    const googleRegisterBtn = document.getElementById("googleRegisterBtn");

    async function handleGoogleAuth() {
        try {
            const btn = googleLoginBtn || googleRegisterBtn;
            if (btn) {
                btn.style.opacity = "0.7";
                btn.style.pointerEvents = "none";
                btn.innerHTML = `<span style="display:inline-block; animation:spin 1s linear infinite;">⏳</span> Connecting with Google...`;
            }

            const { user } = await signInWithGoogle();
            alert(`🎉 Welcome to CodeOrbit, ${user.name || "Student"}!`);
            window.location.href = "dashboard.html";
        } catch (error) {
            alert("Google Sign-In failed: " + (error.message || "Please check your network and pop-up settings."));
            const btn = googleLoginBtn || googleRegisterBtn;
            if (btn) {
                btn.style.opacity = "1";
                btn.style.pointerEvents = "auto";
                btn.innerHTML = `
                    <svg class="google-icon-svg" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    Continue with Google
                `;
            }
        }
    }

    if (googleLoginBtn) googleLoginBtn.addEventListener("click", handleGoogleAuth);
    if (googleRegisterBtn) googleRegisterBtn.addEventListener("click", handleGoogleAuth);

    // 2. Email Login Form
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        const rememberedEmail = localStorage.getItem("rememberedEmail");
        if (rememberedEmail && document.getElementById("email")) {
            document.getElementById("email").value = rememberedEmail;
            const rem = document.getElementById("rememberMe");
            if (rem) rem.checked = true;
        }

        loginForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            const email = document.getElementById("email").value.trim().toLowerCase();
            const password = document.getElementById("password").value;
            const submitBtn = document.getElementById("loginButton");

            try {
                if (submitBtn) {
                    submitBtn.textContent = "Logging in...";
                    submitBtn.disabled = true;
                }

                await loginWithEmail(email, password);

                const rememberMe = document.getElementById("rememberMe");
                if (rememberMe && rememberMe.checked) {
                    localStorage.setItem("rememberedEmail", email);
                } else {
                    localStorage.removeItem("rememberedEmail");
                }

                window.location.href = "dashboard.html";
            } catch (err) {
                alert("Login Error: " + (err.message || "Invalid credentials."));
            } finally {
                if (submitBtn) {
                    submitBtn.textContent = "Login to CodeOrbit →";
                    submitBtn.disabled = false;
                }
            }
        });
    }

    // 3. Email Registration Form
    const regForm = document.getElementById("registrationForm");
    if (regForm) {
        regForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const name = document.getElementById("fullname").value.trim();
            const email = document.getElementById("email").value.trim().toLowerCase();
            const phone = document.getElementById("phone").value.trim();
            const college = document.getElementById("college").value.trim();
            const course = document.getElementById("course").value;
            const year = document.getElementById("year").value;
            const skill = document.getElementById("skill").value;
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirm-password").value;
            const terms = document.getElementById("terms");

            if (password !== confirmPassword) {
                alert("Passwords do not match!");
                return;
            }

            if (!terms.checked) {
                alert("Please accept the community terms.");
                return;
            }

            try {
                const profileData = { name, phone, college, course, year, skill };
                await registerWithEmail(email, password, profileData);
                window.location.href = "registration-success.html";
            } catch (err) {
                alert("Registration Error: " + err.message);
            }
        });
    }
});
