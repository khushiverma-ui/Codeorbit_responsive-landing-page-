// ==========================================================================
// CSEP STUDENT PROFILE JAVASCRIPT
// Handles profile state, tabs switching, and edit profile modal
// ==========================================================================

import { initAuthState } from "./firebase-auth.js";

document.addEventListener("DOMContentLoaded", function () {
    // 1. Load Student Information
    let currentStudent = null;
    try {
        currentStudent = JSON.parse(localStorage.getItem("currentStudent"));
    } catch (e) {
        currentStudent = null;
    }

    // Reset any old stored "Abhay" in local storage to Khushi
    if (currentStudent && (currentStudent.name === "Abhay Rana" || currentStudent.name === "Abhay")) {
        currentStudent.name = "Khushi Verma";
        localStorage.setItem("currentStudent", JSON.stringify(currentStudent));
    }

    const defaultProfile = {
        name: "Khushi Verma",
        college: "CSE • Vidya University",
        bio: "Passionate about web development, product design and building student-focused solutions."
    };

    let profileData = {
        name: currentStudent && currentStudent.name ? currentStudent.name : defaultProfile.name,
        college: currentStudent && currentStudent.college ? `${currentStudent.course || "CSE"} • ${currentStudent.college}` : defaultProfile.college,
        bio: currentStudent && currentStudent.bio ? currentStudent.bio : defaultProfile.bio,
        photoURL: currentStudent?.photoURL || null
    };

    // DOM Elements
    const nameEl = document.getElementById("profileName");
    const collegeEl = document.getElementById("profileCollege");
    const bioEl = document.getElementById("profileBio");
    const topUsernameEl = document.getElementById("topUsername");
    const topAvatarEl = document.getElementById("topAvatar");
    const profileAvatarImg = document.querySelector(".profile-avatar-large");

    function updateProfileUI() {
        if (nameEl) {
            nameEl.innerHTML = `
                ${profileData.name} 
                <svg width="19" height="19" viewBox="0 0 24 24" fill="#3B82F6">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
            `;
        }
        if (collegeEl) collegeEl.textContent = profileData.college;
        if (bioEl) bioEl.textContent = profileData.bio;
        if (topUsernameEl) topUsernameEl.textContent = profileData.name;
        if (topAvatarEl) {
            if (profileData.photoURL) {
                topAvatarEl.innerHTML = `<img src="${profileData.photoURL}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;" alt="${profileData.name}">`;
            } else {
                topAvatarEl.textContent = profileData.name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2) || "KV";
            }
        }
        if (profileAvatarImg && profileData.photoURL) {
            profileAvatarImg.src = profileData.photoURL;
        }
    }

    updateProfileUI();

    // Sync with Firebase Auth state
    initAuthState((user) => {
        if (user) {
            profileData.name = user.name || profileData.name;
            if (user.college) profileData.college = `${user.course || "CSE"} • ${user.college}`;
            if (user.bio) profileData.bio = user.bio;
            if (user.photoURL) profileData.photoURL = user.photoURL;
            updateProfileUI();
        }
    });

    // 2. Tabs Switching (Skills, Projects, Certificates, Activity)
    const tabs = document.querySelectorAll(".profile-tab-item");
    const panels = {
        skills: document.getElementById("skillsTabPanel"),
        projects: document.getElementById("projectsTabPanel"),
        certificates: document.getElementById("certificatesTabPanel"),
        activity: document.getElementById("activityTabPanel")
    };

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            const tabKey = tab.dataset.tab;
            Object.keys(panels).forEach(key => {
                if (panels[key]) {
                    panels[key].style.display = key === tabKey ? "block" : "none";
                }
            });
        });
    });

    // 3. Edit Profile Modal
    const editModal = document.getElementById("editProfileModal");
    const editBtn = document.getElementById("editProfileBtn");
    const closeBtn = document.getElementById("closeEditModalBtn");
    const cancelBtn = document.getElementById("cancelEditModalBtn");
    const editForm = document.getElementById("editProfileForm");
    const nameInput = document.getElementById("editNameInput");
    const collegeInput = document.getElementById("editCollegeInput");
    const bioInput = document.getElementById("editBioInput");

    if (editBtn && editModal) {
        editBtn.addEventListener("click", () => {
            if (nameInput) nameInput.value = profileData.name;
            if (collegeInput) collegeInput.value = profileData.college;
            if (bioInput) bioInput.value = profileData.bio;
            editModal.classList.add("active");
        });
    }

    const closeEdit = () => {
        if (editModal) editModal.classList.remove("active");
    };

    if (closeBtn) closeBtn.addEventListener("click", closeEdit);
    if (cancelBtn) cancelBtn.addEventListener("click", closeEdit);

    if (editForm) {
        editForm.addEventListener("submit", (e) => {
            e.preventDefault();
            profileData.name = nameInput.value.trim();
            profileData.college = collegeInput.value.trim();
            profileData.bio = bioInput.value.trim();

            if (currentStudent) {
                currentStudent.name = profileData.name;
                currentStudent.college = profileData.college;
                currentStudent.bio = profileData.bio;
                localStorage.setItem("currentStudent", JSON.stringify(currentStudent));
            }

            updateProfileUI();
            closeEdit();
            alert("✓ Profile updated successfully!");
        });
    }

    // Share Profile button
    const shareBtn = document.getElementById("shareProfileBtn");
    if (shareBtn) {
        shareBtn.addEventListener("click", () => {
            navigator.clipboard.writeText(window.location.href);
            alert("🔗 Profile link copied to clipboard!");
        });
    }
});
