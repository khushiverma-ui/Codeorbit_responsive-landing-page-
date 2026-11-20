// ==========================================================================
// CSEP REGISTRATION SUCCESS JAVASCRIPT
// Displays registered student name & skill
// ==========================================================================

document.addEventListener("DOMContentLoaded", function () {
    let currentStudent = null;
    try {
        currentStudent = JSON.parse(localStorage.getItem("currentStudent"));
    } catch (e) {
        currentStudent = null;
    }

    const nameEl = document.getElementById("studentName");
    const skillEl = document.getElementById("studentSkill");

    if (currentStudent && currentStudent.name) {
        if (nameEl) nameEl.textContent = `Welcome, ${currentStudent.name}!`;
        if (skillEl) skillEl.textContent = `Primary Skill: ${currentStudent.skill || "Technology & Design"}`;
    } else {
        if (nameEl) nameEl.textContent = "Welcome, Khushi!";
        if (skillEl) skillEl.textContent = "Primary Skill: Web Development";
    }
});
