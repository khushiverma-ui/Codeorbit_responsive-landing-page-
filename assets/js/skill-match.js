// ==========================================================================
// CODEORBIT — PEER SKILL MATCH JAVASCRIPT
// Handles barter matchmaking, swap proposals, and request tracking
// ==========================================================================

document.addEventListener("DOMContentLoaded", function () {
    // 1. User profile display in topbar (Khushi)
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

    // 2. Sent Swaps Tracking
    let sentSwaps = [];
    try {
        sentSwaps = JSON.parse(localStorage.getItem("csepSentSwaps")) || [];
    } catch (e) {
        sentSwaps = [];
    }

    const sentCountBadge = document.getElementById("sentCountBadge");
    if (sentCountBadge) sentCountBadge.textContent = sentSwaps.length;

    // 3. Match Finding Form
    const findBtn = document.getElementById("findMatchesBtn");
    const learnSelect = document.getElementById("wantToLearnSelect");
    const teachSelect = document.getElementById("canTeachSelect");
    const cards = document.querySelectorAll(".peer-match-card");

    if (findBtn) {
        findBtn.addEventListener("click", () => {
            const desired = learnSelect.value;
            let matchCount = 0;

            cards.forEach(card => {
                const cardLearn = card.dataset.learn || "";
                if (desired === "all" || cardLearn.includes(desired) || desired.includes(cardLearn)) {
                    card.style.display = "flex";
                    matchCount++;
                } else {
                    card.style.display = "none";
                }
            });

            alert(`✨ Found ${matchCount} campus peers ready to exchange skills!`);
        });
    }

    // 4. Tab Switching
    const tabs = document.querySelectorAll(".match-tab-pill");
    const container = document.getElementById("matchesContainer");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            const tabType = tab.dataset.tab;
            if (tabType === "sent") {
                renderSentSwaps();
            } else if (tabType === "active") {
                renderActiveSwaps();
            } else {
                cards.forEach(c => c.style.display = "flex");
            }
        });
    });

    function renderSentSwaps() {
        const existing = JSON.parse(localStorage.getItem("csepSentSwaps") || "[]");
        if (existing.length === 0) {
            alert("No sent proposals yet. Click 'Propose Skill Swap ⇄' on any peer card to connect!");
            return;
        }
        alert(`You have ${existing.length} pending skill swap proposals:\n` + existing.map((s, i) => `${i+1}. ${s.peer} (${s.time})`).join("\n"));
    }

    function renderActiveSwaps() {
        alert("Active Swap: 1\n• Partner: Kunal Verma (Weekly C++ DSA ⇄ Web Dev review every Saturday at 11 AM).");
    }

    // 5. Swap Modal Logic
    const swapModal = document.getElementById("swapModal");
    const closeBtn = document.getElementById("closeSwapModalBtn");
    const cancelBtn = document.getElementById("cancelSwapModalBtn");
    const swapForm = document.getElementById("swapForm");

    const closeModal = () => {
        if (swapModal) swapModal.classList.remove("active");
    };

    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (cancelBtn) cancelBtn.addEventListener("click", closeModal);

    if (swapForm) {
        swapForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const peer = document.getElementById("modalPeerName").textContent.replace("Swapping with ", "");
            const time = document.getElementById("swapTimeInput").value.trim();
            const msg = document.getElementById("swapMsgInput").value.trim();

            const newSwap = {
                peer,
                time,
                msg,
                date: new Date().toLocaleDateString()
            };

            const existing = JSON.parse(localStorage.getItem("csepSentSwaps") || "[]");
            existing.push(newSwap);
            localStorage.setItem("csepSentSwaps", JSON.stringify(existing));

            if (sentCountBadge) sentCountBadge.textContent = existing.length;

            alert(`🎉 Skill swap proposal successfully sent to ${peer}!\nA notification has been dispatched to coordinate your first session.`);
            swapForm.reset();
            closeModal();
        });
    }

    // Peer Search
    const searchInput = document.getElementById("peerSearch");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase().trim();
            cards.forEach(c => {
                const text = c.textContent.toLowerCase();
                c.style.display = (!query || text.includes(query)) ? "flex" : "none";
            });
        });
    }
});

// Global open swap modal
window.openSwapModal = function (peerName, theyTeach, theyLearn) {
    const modal = document.getElementById("swapModal");
    const nameEl = document.getElementById("modalPeerName");
    const learnEl = document.getElementById("modalYouLearn");
    const teachEl = document.getElementById("modalYouTeach");

    if (nameEl) nameEl.textContent = `Swapping with ${peerName}`;
    if (learnEl) learnEl.textContent = theyTeach;
    if (teachEl) teachEl.textContent = theyLearn;

    if (modal) modal.classList.add("active");
};
