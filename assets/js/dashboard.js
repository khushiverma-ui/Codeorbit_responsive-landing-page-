// ==========================================================================
// CSEP DASHBOARD JAVASCRIPT
// Handles student data, stats, and "+ Share a Skill" modal
// ==========================================================================

import { initAuthState, logoutUser } from "./firebase-auth.js";

document.addEventListener("DOMContentLoaded", function () {
    // 1. Get Logged In Student from Local Storage / Firebase
    let currentStudent = null;
    try {
        currentStudent = JSON.parse(localStorage.getItem("currentStudent"));
    } catch (e) {
        currentStudent = null;
    }

    // Reset any old stored "Abhay" in local storage to Khushi
    if (currentStudent && (currentStudent.name === "Abhay Rana" || currentStudent.name === "Abhay")) {
        currentStudent.name = "Khushi";
        localStorage.setItem("currentStudent", JSON.stringify(currentStudent));
    }

    const defaultName = "Khushi";
    let studentName = currentStudent && currentStudent.name ? currentStudent.name : defaultName;
    let firstName = studentName.split(" ")[0];

    // DOM Elements
    const greetingEl = document.getElementById("welcomeGreeting");
    const topUsernameEl = document.getElementById("topUsername");
    const topAvatarEl = document.getElementById("topAvatar");
    const sharedCountEl = document.getElementById("skillsSharedCount");
    const logoutBtn = document.getElementById("logoutBtn");

    function renderUser(name, photoURL) {
        studentName = name;
        firstName = studentName.split(" ")[0];
        if (greetingEl) {
            greetingEl.textContent = `Welcome back, ${firstName}! 👋`;
        }
        if (topUsernameEl) {
            topUsernameEl.textContent = studentName;
        }
        if (topAvatarEl) {
            if (photoURL) {
                topAvatarEl.innerHTML = `<img src="${photoURL}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;" alt="${studentName}">`;
            } else {
                const initials = studentName.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
                topAvatarEl.textContent = initials || "KV";
            }
        }
    }

    // Initial render from local cache
    renderUser(studentName, currentStudent?.photoURL);

    // Sync with Live Firebase Auth State
    initAuthState((user) => {
        if (user) {
            renderUser(user.name || "Khushi Verma", user.photoURL);
        }
    });

    // Logout handling
    if (logoutBtn) {
        logoutBtn.addEventListener("click", async (e) => {
            e.preventDefault();
            await logoutUser();
        });
    }

    // Update Skills Shared count from localStorage if any added
    const customSkills = JSON.parse(localStorage.getItem("csepSharedSkills") || "[]");
    const baseShared = 8;
    if (sharedCountEl) {
        sharedCountEl.textContent = baseShared + customSkills.length;
    }

    // Modal Interaction
    const shareModal = document.getElementById("shareSkillModal");
    const openModalBtn = document.getElementById("openShareModalBtn");
    const closeModalBtn = document.getElementById("closeShareModalBtn");
    const cancelModalBtn = document.getElementById("cancelShareModalBtn");
    const shareForm = document.getElementById("shareSkillForm");

    if (openModalBtn && shareModal) {
        openModalBtn.addEventListener("click", () => {
            shareModal.classList.add("active");
        });
    }

    const closeModal = () => {
        if (shareModal) shareModal.classList.remove("active");
    };

    if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);
    if (cancelModalBtn) cancelModalBtn.addEventListener("click", closeModal);

    if (shareModal) {
        shareModal.addEventListener("click", (e) => {
            if (e.target === shareModal) closeModal();
        });
    }

    if (shareForm) {
        shareForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const title = document.getElementById("newSkillTitle").value.trim();
            const category = document.getElementById("newSkillCategory").value;
            const desc = document.getElementById("newSkillDesc").value.trim();

            if (!title || !desc) {
                alert("Please fill in the skill details.");
                return;
            }

            const newSkill = {
                title,
                category,
                desc,
                author: studentName,
                createdAt: new Date().toISOString()
            };

            const existing = JSON.parse(localStorage.getItem("csepSharedSkills") || "[]");
            existing.push(newSkill);
            localStorage.setItem("csepSharedSkills", JSON.stringify(existing));

            if (sharedCountEl) {
                sharedCountEl.textContent = baseShared + existing.length;
            }

            alert(`🎉 Skill "${title}" published successfully! Other students can now explore it.`);
            shareForm.reset();
            closeModal();
        });
    }
});
