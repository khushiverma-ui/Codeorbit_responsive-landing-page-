// ==========================================================================
// CSEP COMMUNITY JAVASCRIPT
// Handles community tabs, discussion creation, and search
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

    // 2. Tabs & Search
    const tabButtons = document.querySelectorAll(".comm-tab-btn");
    const searchInput = document.getElementById("communitySearch");
    const cards = document.querySelectorAll(".discussion-topic-card");

    let searchVal = "";

    function filterDiscussions() {
        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            if (!searchVal || text.includes(searchVal)) {
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
            const tab = btn.dataset.tab;
            if (tab === "announcements") {
                alert("📢 No new official department announcements today.");
            } else if (tab === "events") {
                alert("📅 Upcoming Hackathon: HackCSEP starts Dec 5th, 2026!");
            }
        });
    });

    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            searchVal = e.target.value.toLowerCase().trim();
            filterDiscussions();
        });
    }

    // 3. New Discussion Modal
    const modal = document.getElementById("newDiscussionModal");
    const openBtn = document.getElementById("openNewDiscussionBtn");
    const closeBtn = document.getElementById("closeDiscModalBtn");
    const cancelBtn = document.getElementById("cancelDiscModalBtn");
    const form = document.getElementById("newDiscussionForm");
    const container = document.getElementById("discussionsContainer");

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
            const title = document.getElementById("discTitleInput").value.trim();
            if (!title) return;

            const card = document.createElement("div");
            card.className = "discussion-topic-card";
            card.onclick = () => window.openDiscussionDetail(title, studentName);
            card.innerHTML = `
                <div class="discussion-main-content">
                    <h3>${title}</h3>
                    <div class="discussion-author-meta">Posted by ${studentName} • Just now</div>
                </div>
                <div class="discussion-comment-badge">
                    <span>💬</span> 0
                </div>
            `;

            container.prepend(card);
            alert(`💬 Discussion "${title}" published to CSEP Community!`);
            form.reset();
            closeModal();
        });
    }
});

// Global discussion click
window.openDiscussionDetail = function(title, author) {
    alert(`Discussion: "${title}"\nAuthor: ${author}\n\nJoin the discussion thread and share your answer!`);
};
