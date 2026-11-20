// ==========================================================================
// CSEP EXPLORE SKILLS JAVASCRIPT
// Handles real-time search, category tab filtering, and user session
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

    // 2. Search & Category Filter Logic
    const searchInput = document.getElementById("skillsMainSearch");
    const topSearchInput = document.getElementById("topSearchInput");
    const categoryButtons = document.querySelectorAll(".category-chip-btn");
    const skillCards = document.querySelectorAll(".skill-interactive-card");
    const gridContainer = document.getElementById("skillsGridContainer");

    let currentCategory = "all";
    let searchQuery = "";

    function filterCards() {
        let visibleCount = 0;

        skillCards.forEach(card => {
            const cardCat = card.dataset.category || "";
            const keywords = (card.dataset.keywords || "").toLowerCase();
            const text = card.textContent.toLowerCase();

            const matchesCategory = (currentCategory === "all") || (cardCat === currentCategory);
            const matchesSearch = !searchQuery || keywords.includes(searchQuery) || text.includes(searchQuery);

            if (matchesCategory && matchesSearch) {
                card.style.display = "flex";
                visibleCount++;
            } else {
                card.style.display = "none";
            }
        });

        // Show/hide no results message
        let noResults = document.querySelector(".no-skills-found");
        if (visibleCount === 0) {
            if (!noResults) {
                noResults = document.createElement("div");
                noResults.className = "no-skills-found";
                noResults.innerHTML = `
                    <p style="font-size:24px; margin-bottom:8px;">🔍</p>
                    <h3 style="font-size:17px; font-weight:700; color:#0F172A; margin-bottom:6px;">No Skills Found</h3>
                    <p style="color:#64748B; font-size:14px;">Try searching for a different keyword like "React", "Python", or "Design".</p>
                `;
                gridContainer.appendChild(noResults);
            }
            noResults.style.display = "block";
        } else if (noResults) {
            noResults.style.display = "none";
        }
    }

    // Category Tabs click
    categoryButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            categoryButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentCategory = btn.dataset.category;
            filterCards();
        });
    });

    // Search Input listeners
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            searchQuery = e.target.value.toLowerCase().trim();
            filterCards();
        });
    }

    if (topSearchInput) {
        topSearchInput.addEventListener("input", (e) => {
            searchQuery = e.target.value.toLowerCase().trim();
            if (searchInput) searchInput.value = e.target.value;
            filterCards();
        });
    }
});
