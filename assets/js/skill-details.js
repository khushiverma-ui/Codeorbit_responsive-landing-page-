// ==========================================================================
// CSEP SKILL DETAIL / SESSION JAVASCRIPT
// Matches Screen 04: Dynamic skill topics, mentor profile, join button
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

    // 2. Data dictionary for different skills
    const sessionsData = {
        "web-development": {
            title: "React Basics – Peer Learning Session",
            icon: "</>",
            iconBg: "#EDE9FE",
            iconColor: "#7C3AED",
            tags: ["Development", "Frontend", "React"],
            desc: "A beginner-friendly session to get started with React. We'll cover fundamentals, components, state, and a mini project.",
            mentor: "Priya Sharma",
            branch: "CSE • 3rd Year",
            rating: "★ 4.9 (42 reviews)",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
            date: "Nov 21, 2026",
            time: "4:00 PM – 5:30 PM",
            venue: "Online (Google Meet)",
            attendees: 58,
            topics: [
                { title: "Introduction to React & Virtual DOM", desc: "Understanding React component architecture and how JSX works." },
                { title: "Functional Components & Props", desc: "Deconstructing UI into reusable, composable pieces and passing dynamic data." },
                { title: "State Management with useState", desc: "Handling reactivity, user inputs, toggles, and live event handling in components." },
                { title: "Hands-On Mini Project", desc: "Building a live student task manager with interactive CRUD functionality." }
            ]
        },
        "graphic-design": {
            title: "UI/UX Design Systems in Figma",
            icon: "🎨",
            iconBg: "#FDF2F8",
            iconColor: "#EC4899",
            tags: ["Design", "UI/UX", "Figma"],
            desc: "Master layout grids, auto-layout, typography hierarchies, and clickable prototyping in Figma.",
            mentor: "Rohan Mehta",
            branch: "Design & Media • 2nd Year",
            rating: "★ 4.8 (38 reviews)",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
            date: "Nov 23, 2026",
            time: "5:00 PM – 6:30 PM",
            venue: "Online (Google Meet)",
            attendees: 44,
            topics: [
                { title: "Figma Fundamentals & Canvas Setup", desc: "Mastering frames, vector shapes, layers, and shortcut workflows." },
                { title: "Auto-Layout & Responsive Components", desc: "Building flexible, responsive cards, buttons, and navigation systems." },
                { title: "Design Systems & Tokens", desc: "Managing color palettes, type scales, and component libraries." },
                { title: "Interactive Prototyping", desc: "Creating micro-interactions, smart-animates, and user testing flows." }
            ]
        },
        "c": {
            title: "Data Structures & Algorithms in C++",
            icon: "⬡",
            iconBg: "#F3E8FF",
            iconColor: "#9333EA",
            tags: ["Development", "DSA", "Problem Solving"],
            desc: "Strengthen your algorithmic problem-solving for coding interviews and hackathons.",
            mentor: "Kunal Verma",
            branch: "IT • 4th Year",
            rating: "★ 4.9 (65 reviews)",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
            date: "Nov 25, 2026",
            time: "6:00 PM – 7:30 PM",
            venue: "Lab 302 / Hybrid",
            attendees: 72,
            topics: [
                { title: "Time & Space Complexity (Big-O)", desc: "Analyzing worst, average, and best-case performance for algorithms." },
                { title: "Arrays, Strings & Two Pointers", desc: "Solving sliding window and two-pointer interview questions." },
                { title: "Linked Lists, Stacks & Queues", desc: "Core pointer operations, memory representations, and applications." },
                { title: "Recursion & Trees", desc: "Binary tree traversals, DFS, BFS, and dynamic memoization." }
            ]
        },
        "ai-ml": {
            title: "Machine Learning with Python & Scikit-Learn",
            icon: "🤖",
            iconBg: "#ECFDF5",
            iconColor: "#10B981",
            tags: ["AI/ML", "Python", "Data Science"],
            desc: "Learn data preprocessing, supervised learning, model evaluation, and regression/classification models.",
            mentor: "Ananya Singh",
            branch: "CSE (AI/ML) • 3rd Year",
            rating: "★ 4.7 (31 reviews)",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
            date: "Nov 26, 2026",
            time: "4:30 PM – 6:00 PM",
            venue: "Online (Google Meet)",
            attendees: 63,
            topics: [
                { title: "NumPy & Pandas for Data Prep", desc: "Cleaning dirty datasets, handling null values, and feature engineering." },
                { title: "Linear & Logistic Regression", desc: "Implementing predictive modeling from scratch and with Scikit-Learn." },
                { title: "Decision Trees & Random Forests", desc: "Building robust non-linear classification models." },
                { title: "Model Evaluation & Deployment", desc: "Confusion matrices, cross-validation, and deploying as a Streamlit app." }
            ]
        }
    };

    // 3. Detect URL query param
    const urlParams = new URLSearchParams(window.location.search);
    const skillParam = urlParams.get("skill") || "web-development";
    const data = sessionsData[skillParam] || sessionsData["web-development"];

    // Update Elements
    document.title = `CSEP | ${data.title}`;
    const titleEl = document.getElementById("sessionTitle");
    const descEl = document.getElementById("sessionDescription");
    const iconEl = document.getElementById("sessionIcon");
    const pillsEl = document.getElementById("sessionPills");
    const mentorNameEl = document.getElementById("mentorName");
    const mentorBranchEl = document.getElementById("mentorBranch");
    const mentorRatingEl = document.getElementById("mentorRating");
    const mentorImgEl = document.getElementById("mentorAvatarImg");
    const dateEl = document.getElementById("sessionDate");
    const timeEl = document.getElementById("sessionTime");
    const venueEl = document.getElementById("sessionVenue");
    const attendeesEl = document.getElementById("attendeesCount");
    const curriculumEl = document.getElementById("curriculumList");

    if (titleEl) titleEl.textContent = data.title;
    if (descEl) descEl.textContent = data.desc;
    if (iconEl) {
        iconEl.textContent = data.icon;
        iconEl.style.background = data.iconBg;
        iconEl.style.color = data.iconColor;
    }
    if (pillsEl) {
        pillsEl.innerHTML = data.tags.map(t => `<span class="tag-chip">${t}</span>`).join("");
    }
    if (mentorNameEl) mentorNameEl.textContent = data.mentor;
    if (mentorBranchEl) mentorBranchEl.textContent = data.branch;
    if (mentorRatingEl) mentorRatingEl.innerHTML = `${data.rating}`;
    if (mentorImgEl) mentorImgEl.src = data.avatar;
    if (dateEl) dateEl.textContent = data.date;
    if (timeEl) timeEl.textContent = data.time;
    if (venueEl) venueEl.textContent = data.venue;
    if (attendeesEl) attendeesEl.textContent = `${data.attendees} Students Joining`;

    if (curriculumEl && data.topics) {
        curriculumEl.innerHTML = data.topics.map((t, idx) => `
            <li class="curriculum-item">
                <div class="topic-index-badge">${idx + 1}</div>
                <div class="topic-text-content">
                    <h4>${t.title}</h4>
                    <p>${t.desc}</p>
                </div>
            </li>
        `).join("");
    }

    // 4. Join Session Button Logic
    const joinBtn = document.getElementById("joinSessionBtn");
    let isJoined = false;

    if (joinBtn) {
        joinBtn.addEventListener("click", () => {
            isJoined = !isJoined;
            if (isJoined) {
                joinBtn.textContent = "✓ Joined Session";
                joinBtn.style.background = "#10B981";
                joinBtn.style.borderColor = "#10B981";
                data.attendees += 1;
                if (attendeesEl) attendeesEl.textContent = `${data.attendees} Students Joining`;
                alert(`🎉 You're registered for "${data.title}"!\nA calendar invite has been sent to your student email.`);
            } else {
                joinBtn.textContent = "Join Session";
                joinBtn.style.background = "var(--primary)";
                data.attendees -= 1;
                if (attendeesEl) attendeesEl.textContent = `${data.attendees} Students Joining`;
            }
        });
    }
});
