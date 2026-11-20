// ==========================================================================
// CSEP PROJECTS JAVASCRIPT
// Handles project tabs, search, join toggle, and new project modal
// ==========================================================================

document.addEventListener("DOMContentLoaded", function () {
    // 1. User profile display in topbar
    let currentStudent = null;
    try {
        currentStudent = JSON.parse(localStorage.getItem("currentStudent"));
    } catch (e) {
        currentStudent = null;
    }
    const studentName = currentStudent && currentStudent.name && currentStudent.name !== "Abhay Rana" ? currentStudent.name : "Khushi";
    const topUsernameEl = document.getElementById("topUsername");
    const topAvatarEl = document.getElementById("topAvatar");

    if (topUsernameEl) topUsernameEl.textContent = studentName;
    if (topAvatarEl) {
        topAvatarEl.textContent = studentName.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2) || "KV";
    }

    // 2. Tab switching & Search
    const tabButtons = document.querySelectorAll(".proj-tab-btn");
    const searchInput = document.getElementById("projectSearch");
    const cards = document.querySelectorAll(".project-collab-card");

    let activeTab = "all";
    let searchVal = "";

    function filterProjectCards() {
        cards.forEach(card => {
            const isJoined = card.classList.contains("joined-by-user");
            const isMine = card.classList.contains("created-by-user");
            const text = card.textContent.toLowerCase();

            let matchesTab = true;
            if (activeTab === "joined") matchesTab = isJoined;
            if (activeTab === "my") matchesTab = isMine;

            const matchesSearch = !searchVal || text.includes(searchVal);

            if (matchesTab && matchesSearch) {
                card.style.display = "flex";
            } else {
                card.style.display = "none";
            }
        });
    }

    tabButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            tabButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            activeTab = btn.dataset.tab;
            filterProjectCards();
        });
    });

    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            searchVal = e.target.value.toLowerCase().trim();
            filterProjectCards();
        });
    }

    // 3. New Project Modal
    const modal = document.getElementById("newProjectModal");
    const openBtn = document.getElementById("openNewProjectBtn");
    const closeBtn = document.getElementById("closeProjModalBtn");
    const cancelBtn = document.getElementById("cancelProjModalBtn");
    const form = document.getElementById("newProjectForm");
    const container = document.getElementById("projectsContainer");

    if (openBtn && modal) {
        openBtn.addEventListener("click", () => modal.classList.add("active"));
    }

    const closeModal = () => {
        if (modal) modal.classList.remove("active");
    };

    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (cancelBtn) cancelBtn.addEventListener("click", closeModal);

    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const title = document.getElementById("projTitleInput").value.trim();
            const role = document.getElementById("projRoleInput").value.trim();
            const tech = document.getElementById("projTechInput").value.split(",").map(t => t.trim()).filter(Boolean);

            if (!title) return;

            const card = document.createElement("div");
            card.className = "project-collab-card created-by-user";
            card.innerHTML = `
                <div class="project-left-details">
                    <div class="project-icon-box" style="background: #EDE9FE; color: #7C3AED;">
                        🚀
                    </div>
                    <div class="project-info-body">
                        <h3>${title}</h3>
                        <div class="project-role-need">${role}</div>
                        <div class="project-tags-row">
                            ${tech.map(t => `<span class="tag-chip">${t}</span>`).join("")}
                        </div>
                    </div>
                </div>
                <div class="project-right-actions">
                    <span class="team-count-indicator">1/4</span>
                    <button class="btn-secondary" style="font-size:13px; padding:6px 16px;">
                        Manage
                    </button>
                </div>
            `;

            container.prepend(card);
            alert(`🎉 Project "${title}" posted successfully!`);
            form.reset();
            closeModal();
        });
    }
});

// Global Join button handler
window.toggleJoinProject = function(btn, title) {
    const card = btn.closest(".project-collab-card");
    const countEl = card.querySelector(".team-count-indicator");

    if (btn.textContent.trim() === "Join") {
        btn.textContent = "✓ Joined";
        btn.style.background = "#10B981";
        btn.style.borderColor = "#10B981";
        card.classList.add("joined-by-user");
        alert(`🎉 You've applied to join "${title}"! The project lead has been notified.`);
    } else {
        btn.textContent = "Join";
        btn.style.background = "var(--primary)";
        card.classList.remove("joined-by-user");
    }
};
